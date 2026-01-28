"""Payment gateway service - supports multiple payment methods"""
from app.core.config import settings
from app.models.orders import CheckoutSessionRequest, CheckoutSessionResponse
import logging
import stripe
import requests
import base64
import json

logger = logging.getLogger(__name__)


class PaymentService:
    """Unified payment service supporting multiple gateways"""
    
    @staticmethod
    async def create_checkout_session(request: CheckoutSessionRequest) -> CheckoutSessionResponse:
        """Create checkout session for the specified payment method"""
        if request.paymentMethod == "stripe":
            return await PaymentService._create_stripe_session(request)
        elif request.paymentMethod == "paypal":
            return await PaymentService._create_paypal_session(request)
        elif request.paymentMethod == "razorpay":
            return await PaymentService._create_razorpay_session(request)
        else:
            raise ValueError(f"Unsupported payment method: {request.paymentMethod}")
    
    @staticmethod
    async def _create_stripe_session(request: CheckoutSessionRequest) -> CheckoutSessionResponse:
        """Create Stripe checkout session"""
        if not settings.STRIPE_SECRET_KEY:
            raise ValueError("Stripe is not configured. Please set STRIPE_SECRET_KEY.")
        
        stripe.api_key = settings.STRIPE_SECRET_KEY
        
        # Calculate total
        total = sum(item.price * item.quantity for item in request.items)
        
        # Create line items
        line_items = []
        for item in request.items:
            line_items.append({
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": item.name,
                    },
                    "unit_amount": int(item.price * 100),  # Convert to cents
                },
                "quantity": item.quantity,
            })
        
        # Create checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{settings.FRONTEND_URL}/dashboard?payment=success&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/#products",
            customer_email=request.customerEmail,
            metadata={
                "items": json.dumps([item.dict() for item in request.items]),
                "total": str(total),
                "payment_method": "stripe"
            }
        )
        
        return CheckoutSessionResponse(
            sessionId=checkout_session.id,
            url=checkout_session.url,
            paymentMethod="stripe"
        )
    
    @staticmethod
    async def _create_paypal_session(request: CheckoutSessionRequest) -> CheckoutSessionResponse:
        """Create PayPal checkout session"""
        if not settings.PAYPAL_CLIENT_ID or not settings.PAYPAL_CLIENT_SECRET:
            raise ValueError("PayPal is not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.")
        
        # Calculate total
        total = sum(item.price * item.quantity for item in request.items)
        
        # Get PayPal access token
        base_url = "https://api.sandbox.paypal.com" if settings.PAYPAL_MODE == "sandbox" else "https://api.paypal.com"
        
        auth_string = f"{settings.PAYPAL_CLIENT_ID}:{settings.PAYPAL_CLIENT_SECRET}"
        auth_bytes = auth_string.encode('ascii')
        auth_b64 = base64.b64encode(auth_bytes).decode('ascii')
        
        # Get access token
        token_response = requests.post(
            f"{base_url}/v1/oauth2/token",
            headers={
                "Authorization": f"Basic {auth_b64}",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data={"grant_type": "client_credentials"}
        )
        
        if token_response.status_code != 200:
            raise ValueError(f"Failed to get PayPal access token: {token_response.text}")
        
        access_token = token_response.json()["access_token"]
        
        # Create order
        order_data = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": "USD",
                    "value": str(total)
                },
                "description": f"Order for {len(request.items)} item(s)"
            }],
            "application_context": {
                "return_url": f"{settings.FRONTEND_URL}/dashboard?payment=success",
                "cancel_url": f"{settings.FRONTEND_URL}/#products"
            }
        }
        
        order_response = requests.post(
            f"{base_url}/v2/checkout/orders",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            },
            json=order_data
        )
        
        if order_response.status_code != 201:
            raise ValueError(f"Failed to create PayPal order: {order_response.text}")
        
        order = order_response.json()
        
        # Get approval URL
        approval_url = None
        for link in order.get("links", []):
            if link.get("rel") == "approve":
                approval_url = link.get("href")
                break
        
        if not approval_url:
            raise ValueError("Failed to get PayPal approval URL")
        
        return CheckoutSessionResponse(
            sessionId=order["id"],
            url=approval_url,
            paymentMethod="paypal"
        )
    
    @staticmethod
    async def _create_razorpay_session(request: CheckoutSessionRequest) -> CheckoutSessionResponse:
        """Create Razorpay checkout session"""
        if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
            raise ValueError("Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.")
        
        import razorpay
        
        # Calculate total (convert to INR - Razorpay's default currency)
        total = sum(item.price * item.quantity for item in request.items)
        total_inr = total * 83  # Approximate USD to INR conversion (adjust as needed)
        
        # Initialize Razorpay client
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        
        # Create order
        order_data = {
            "amount": int(total_inr * 100),  # Convert to paise
            "currency": "INR",
            "receipt": f"order_{request.items[0].productId if request.items else 'unknown'}",
            "notes": {
                "items": json.dumps([item.dict() for item in request.items]),
                "customer_email": request.customerEmail or ""
            }
        }
        
        try:
            razorpay_order = client.order.create(data=order_data)
            
            amount_paise = int(total_inr * 100)
            checkout_url = f"{settings.FRONTEND_URL}/#checkout"
            
            return CheckoutSessionResponse(
                sessionId=razorpay_order["id"],
                url=checkout_url,
                paymentMethod="razorpay",
                amount=amount_paise,
                currency="INR",
                razorpayKeyId=settings.RAZORPAY_KEY_ID,
            )
        except Exception as e:
            logger.error(f"Razorpay order creation failed: {e}")
            raise ValueError(f"Failed to create Razorpay order: {str(e)}")
