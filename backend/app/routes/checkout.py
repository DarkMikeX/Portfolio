"""Checkout and payment routes"""
from fastapi import APIRouter, HTTPException, Request
from app.core.database import db
from app.core.config import settings
from app.models.orders import Order, OrderCreate, CheckoutSessionRequest, CheckoutSessionResponse, PaymentStats, RazorpayVerifyRequest
from app.services.payment_service import PaymentService
from bson import ObjectId
from typing import List
from datetime import datetime, timezone, timedelta
import logging
import stripe

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Checkout"])

# Initialize Stripe
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY
else:
    logger.warning("Stripe secret key not configured. Payment functionality will be limited.")


@router.post("/checkout/create-session", response_model=CheckoutSessionResponse)
async def create_checkout_session(request: CheckoutSessionRequest):
    """Create checkout session for any payment method"""
    try:
        # Use payment service to create session
        session_response = await PaymentService.create_checkout_session(request)
        
        # Calculate total
        total = sum(item.price * item.quantity for item in request.items)
        
        # Store order in database
        try:
            order = Order(
                items=request.items,
                total=total,
                status="pending",
                paymentMethod=request.paymentMethod,
                paymentSessionId=session_response.sessionId,
                customerEmail=request.customerEmail,
                customerName=request.customerName,
                customerPhone=request.customerPhone,
                shippingAddress=request.shippingAddress
            )
            await db.orders.insert_one(order.dict())
        except Exception as db_error:
            logger.warning(f"Could not save order to database: {db_error}")
            # Continue even if database save fails
        
        return session_response
        
    except ValueError as e:
        logger.error(f"Payment configuration error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating checkout session: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/checkout/verify-razorpay")
async def verify_razorpay_payment(body: RazorpayVerifyRequest):
    """Verify Razorpay payment signature and mark order as paid"""
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=400, detail="Razorpay is not configured.")
    try:
        import razorpay
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        params = {
            "razorpay_order_id": body.razorpay_order_id,
            "razorpay_payment_id": body.razorpay_payment_id,
            "razorpay_signature": body.razorpay_signature,
        }
        client.utility.verify_payment_signature(params)
        # Update order status
        try:
            await db.orders.update_one(
                {"paymentSessionId": body.razorpay_order_id},
                {
                    "$set": {
                        "status": "paid",
                        "paymentIntentId": body.razorpay_payment_id,
                        "updatedAt": datetime.now(timezone.utc),
                    }
                },
            )
        except Exception as db_error:
            logger.warning(f"Could not update order in database: {db_error}")
        return {"status": "success", "message": "Payment verified"}
    except Exception as e:
        err_name = type(e).__name__
        if "SignatureVerification" in err_name or "signature" in str(e).lower():
            logger.error(f"Razorpay signature verification failed: {e}")
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        logger.error(f"Error verifying Razorpay payment: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/checkout/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    try:
        payload = await request.body()
        sig_header = request.headers.get("stripe-signature")
        
        if not settings.STRIPE_WEBHOOK_SECRET:
            logger.warning("Stripe webhook secret not configured")
            return {"status": "webhook secret not configured"}
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            logger.error(f"Invalid payload: {e}")
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Invalid signature: {e}")
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Handle the event
        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            # Update order status in database
            try:
                from datetime import datetime, timezone
                await db.orders.update_one(
                    {"paymentSessionId": session["id"]},
                    {
                        "$set": {
                            "status": "paid",
                            "paymentIntentId": session.get("payment_intent"),
                            "updatedAt": datetime.now(timezone.utc)
                        }
                    }
                )
                logger.info(f"Order {session['id']} marked as paid")
            except Exception as db_error:
                logger.error(f"Error updating order status: {db_error}")
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/orders", response_model=List[Order])
async def get_orders(session_id: str = "default", limit: int = 50):
    """Get orders (for admin or user)"""
    try:
        cursor = db.orders.find().sort("createdAt", -1).limit(limit)
        orders = []
        async for doc in cursor:
            # Convert ObjectId to string
            if "_id" in doc:
                doc["id"] = str(doc["_id"])
                del doc["_id"]
            orders.append(Order(**doc))
        return orders
    except Exception as e:
        logger.error(f"Error getting orders: {e}")
        # Return empty list if database is not available
        return []


@router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    """Get specific order"""
    try:
        from bson import ObjectId
        try:
            order_doc = await db.orders.find_one({"_id": ObjectId(order_id)})
        except:
            order_doc = None
        
        if not order_doc:
            # Try by payment session id
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
        logger.error(f"Error getting order: {e}")
        raise HTTPException(status_code=500, detail=str(e))
