"""Cart routes"""
from fastapi import APIRouter, HTTPException
from app.models.cart import Cart, CartItem, CartItemCreate, CartItemUpdate
from typing import List
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Cart"])

# In-memory cart storage (in production, use Redis or database)
cart_storage = {}


def _get_cart(session_id: str = "default") -> Cart:
    """Get or create cart for session"""
    if session_id not in cart_storage:
        cart_storage[session_id] = Cart()
    return cart_storage[session_id]


@router.post("/cart", response_model=CartItem)
async def create_cart_item(item: CartItemCreate, session_id: str = "default"):
    """Add item to cart"""
    try:
        cart = _get_cart(session_id)
        
        # Check if item already exists
        existing_item = next(
            (i for i in cart.items if i.productId == item.productId),
            None
        )
        
        if existing_item:
            existing_item.quantity += item.quantity
        else:
            new_item = CartItem(**item.dict())
            cart.items.append(new_item)
            existing_item = new_item
        
        cart.updatedAt = datetime.now(timezone.utc)
        cart_storage[session_id] = cart
        
        return existing_item
    except Exception as e:
        logger.error(f"Error adding to cart: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/cart", response_model=Cart)
async def get_cart(session_id: str = "default"):
    """Get cart contents"""
    try:
        cart = _get_cart(session_id)
        return cart
    except Exception as e:
        logger.error(f"Error getting cart: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/cart/{item_id}", response_model=CartItem)
async def update_cart_item(item_id: str, update: CartItemUpdate, session_id: str = "default"):
    """Update cart item quantity"""
    try:
        cart = _get_cart(session_id)
        
        item = next((i for i in cart.items if i.id == item_id), None)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found in cart")
        
        item.quantity = update.quantity
        cart.updatedAt = datetime.now(timezone.utc)
        cart_storage[session_id] = cart
        
        return item
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating cart item: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/cart/{item_id}")
async def delete_cart_item(item_id: str, session_id: str = "default"):
    """Remove item from cart"""
    try:
        cart = _get_cart(session_id)
        
        cart.items = [i for i in cart.items if i.id != item_id]
        cart.updatedAt = CartItem.addedAt.default_factory()
        cart_storage[session_id] = cart
        
        return {"message": "Item removed from cart"}
    except Exception as e:
        logger.error(f"Error removing cart item: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/cart")
async def clear_cart(session_id: str = "default"):
    """Clear entire cart"""
    try:
        if session_id in cart_storage:
            del cart_storage[session_id]
        return {"message": "Cart cleared"}
    except Exception as e:
        logger.error(f"Error clearing cart: {e}")
        raise HTTPException(status_code=500, detail=str(e))
