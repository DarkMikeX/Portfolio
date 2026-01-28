"""Dashboard routes for payment and order management (admin only)"""
from fastapi import APIRouter, HTTPException, Depends
from app.core.database import db
from app.core.auth import get_current_admin
from app.models.orders import Order, PaymentStats
from bson import ObjectId
from typing import List
from datetime import datetime, timezone, timedelta
import logging

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard/stats", response_model=PaymentStats)
async def get_payment_stats(_: dict = Depends(get_current_admin)):
    """Get payment and order statistics"""
    try:
        # Get all orders
        cursor = db.orders.find()
        orders = []
        async for doc in cursor:
            if "_id" in doc:
                doc["id"] = str(doc["_id"])
                del doc["_id"]
            orders.append(Order(**doc))
        
        # Calculate stats
        total_orders = len(orders)
        total_revenue = sum(order.total for order in orders if order.status == "paid")
        pending_orders = len([o for o in orders if o.status == "pending"])
        paid_orders = len([o for o in orders if o.status == "paid"])
        failed_orders = len([o for o in orders if o.status == "failed"])
        
        # Today's stats
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        today_orders = [o for o in orders if o.createdAt >= today]
        today_revenue = sum(order.total for order in today_orders if order.status == "paid")
        today_orders_count = len(today_orders)
        
        return PaymentStats(
            totalOrders=total_orders,
            totalRevenue=total_revenue,
            pendingOrders=pending_orders,
            paidOrders=paid_orders,
            failedOrders=failed_orders,
            todayRevenue=today_revenue,
            todayOrders=today_orders_count
        )
    except Exception as e:
        logger.error(f"Error getting payment stats: {e}")
        # Return default stats if database is not available
        return PaymentStats(
            totalOrders=0,
            totalRevenue=0.0,
            pendingOrders=0,
            paidOrders=0,
            failedOrders=0,
            todayRevenue=0.0,
            todayOrders=0
        )


@router.get("/dashboard/orders", response_model=List[Order])
async def get_dashboard_orders(limit: int = 50, status: str = None, _: dict = Depends(get_current_admin)):
    """Get orders for dashboard with optional status filter"""
    try:
        query = {}
        if status:
            query["status"] = status
        
        cursor = db.orders.find(query).sort("createdAt", -1).limit(limit)
        orders = []
        async for doc in cursor:
            if "_id" in doc:
                doc["id"] = str(doc["_id"])
                del doc["_id"]
            orders.append(Order(**doc))
        return orders
    except Exception as e:
        logger.error(f"Error getting dashboard orders: {e}")
        return []


@router.get("/dashboard/orders/{order_id}", response_model=Order)
async def get_dashboard_order(order_id: str, _: dict = Depends(get_current_admin)):
    """Get specific order for dashboard"""
    try:
        from bson import ObjectId
        try:
            order_doc = await db.orders.find_one({"_id": ObjectId(order_id)})
        except:
            order_doc = None
        
        if not order_doc:
            order_doc = await db.orders.find_one({"paymentSessionId": order_id})
            if not order_doc:
                raise HTTPException(status_code=404, detail="Order not found")
        
        if "_id" in order_doc:
            order_doc["id"] = str(order_doc["_id"])
            del order_doc["_id"]
        
        return Order(**order_doc)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting dashboard order: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/dashboard/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str, _: dict = Depends(get_current_admin)):
    """Update order status"""
    try:
        from bson import ObjectId
        valid_statuses = ["pending", "paid", "failed", "cancelled", "refunded"]
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        
        try:
            result = await db.orders.update_one(
                {"_id": ObjectId(order_id)},
                {
                    "$set": {
                        "status": status,
                        "updatedAt": datetime.now(timezone.utc)
                    }
                }
            )
        except:
            result = await db.orders.update_one(
                {"paymentSessionId": order_id},
                {
                    "$set": {
                        "status": status,
                        "updatedAt": datetime.now(timezone.utc)
                    }
                }
            )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return {"message": "Order status updated successfully", "status": status}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating order status: {e}")
        raise HTTPException(status_code=500, detail=str(e))
