"""Order models"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
import uuid
from datetime import datetime, timezone


class OrderItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    productId: str
    name: str
    price: float
    quantity: int


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    items: list[OrderItem]
    total: float
    status: str = "pending"  # pending, paid, failed, cancelled, refunded
    paymentMethod: str = "stripe"  # stripe, paypal, razorpay
    paymentSessionId: Optional[str] = None  # Generic session ID for any payment gateway
    paymentIntentId: Optional[str] = None  # Generic payment intent ID
    customerEmail: Optional[str] = None
    customerName: Optional[str] = None
    customerPhone: Optional[str] = None
    shippingAddress: Optional[dict] = None
    notes: Optional[str] = None
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OrderCreate(BaseModel):
    items: list[OrderItem]
    customerEmail: Optional[str] = None


class CheckoutSessionRequest(BaseModel):
    items: list[OrderItem]
    paymentMethod: str = "stripe"  # stripe, paypal, razorpay
    customerEmail: Optional[str] = None
    customerName: Optional[str] = None
    customerPhone: Optional[str] = None
    shippingAddress: Optional[dict] = None


class CheckoutSessionResponse(BaseModel):
    sessionId: str
    url: str
    paymentMethod: str
    # Razorpay: amount in paise, currency, key for frontend
    amount: Optional[int] = None
    currency: Optional[str] = None
    razorpayKeyId: Optional[str] = None


class RazorpayVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class PaymentStats(BaseModel):
    totalOrders: int
    totalRevenue: float
    pendingOrders: int
    paidOrders: int
    failedOrders: int
    todayRevenue: float
    todayOrders: int