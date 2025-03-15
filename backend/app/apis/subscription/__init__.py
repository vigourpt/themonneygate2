from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Request, Depends, Header
import stripe
import databutton as db
import json
from datetime import datetime, timedelta
from app.auth import AuthorizedUser

# Initialize router
router = APIRouter()

# Initialize Stripe with the environment-appropriate secret key
from app.env import Mode, mode

# Use test key in development, live key in production
if mode == Mode.DEV:
    try:
        stripe.api_key = db.secrets.get("STRIPE_SECRET_KEY_TEST")
        print("Using Stripe TEST key in development mode")
    except:
        # Fallback to live key if test key is not available
        stripe.api_key = db.secrets.get("STRIPE_SECRET_KEY")
        print("WARNING: Using Stripe LIVE key in development mode - consider adding STRIPE_SECRET_KEY_TEST")
else:
    stripe.api_key = db.secrets.get("STRIPE_SECRET_KEY")
    print("Using Stripe LIVE key in production mode")

# Constants for subscription plans
PLAN_FREE = 'free'
PLAN_PREMIUM = 'premium'
PLAN_PREMIUM_ANNUAL = 'premium_annual'

# Constants for trial
TRIAL_DAYS = 14

# Model for subscription plan
class SubscriptionPlan(BaseModel):
    id: str
    name: str
    description: str
    price_per_month: float
    features: List[str]
    stripe_price_id: Optional[str] = None
    is_annual: bool = False
    discount_percentage: Optional[int] = None

# Model for subscription creation
class CreateCheckoutSessionRequest(BaseModel):
    plan_id: str = Field(..., description="ID of the subscription plan")
    success_url: str = Field(..., description="URL to redirect to on success")
    cancel_url: str = Field(..., description="URL to redirect to on cancel")

# Model for subscription response
class CheckoutSessionResponse(BaseModel):
    session_id: str
    checkout_url: str

# Model for current subscription
class CurrentSubscription(BaseModel):
    plan_id: str
    status: str
    current_period_end: datetime
    cancel_at_period_end: bool
    trial_end: Optional[datetime] = None
    subscription_id: Optional[str] = None
    payment_method: Optional[Dict[str, Any]] = None

# Model for subscription status
class SubscriptionStatus(BaseModel):
    is_active: bool
    is_trial: bool
    subscription: Optional[CurrentSubscription] = None
    available_plans: List[SubscriptionPlan]

# Define subscription plans
SUBSCRIPTION_PLANS = [
    SubscriptionPlan(
        id=PLAN_FREE,
        name="Free",
        description="Basic access to MoneyGate",
        price_per_month=0,
        features=[
            "Create up to 3 tools",
            "Basic monetization insights",
            "Standard keyword analysis"
        ],
        stripe_price_id=None  # No Stripe price ID for free plan
    ),
    SubscriptionPlan(
        id=PLAN_PREMIUM,
        name="Premium Monthly",
        description="Full access to all MoneyGate features",
        price_per_month=29.99,
        features=[
            "Create unlimited tools",
            "Advanced monetization strategies",
            "Premium keyword analysis with competitor insights",
            "Embed code generator",
            "Distribution checklist",
            "Priority support"
        ],
        stripe_price_id="price_1QziBUIvNC25xjLS63EuE4Ri"  # Updated with actual Stripe price ID
    ),
    SubscriptionPlan(
        id=PLAN_PREMIUM_ANNUAL,
        name="Premium Annual",
        description="Full access to all MoneyGate features with annual discount",
        price_per_month=23.99,  # Monthly equivalent
        features=[
            "Create unlimited tools",
            "Advanced monetization strategies",
            "Premium keyword analysis with competitor insights",
            "Embed code generator",
            "Distribution checklist",
            "Priority support",
            "20% annual discount"
        ],
        stripe_price_id="price_1QziBUIvNC25xjLSfyA5a4vu",  # Updated with actual Stripe price ID
        is_annual=True,
        discount_percentage=20
    )
]

# Helper function to get plan by ID
def get_plan_by_id(plan_id: str) -> Optional[SubscriptionPlan]:
    for plan in SUBSCRIPTION_PLANS:
        if plan.id == plan_id:
            return plan
    return None

# Endpoint to get available subscription plans
@router.get("/plans")
async def get_subscription_plans() -> List[SubscriptionPlan]:
    """Get all available subscription plans."""
    return SUBSCRIPTION_PLANS

# Endpoint to create a checkout session
@router.post("/create-checkout-session")
async def create_checkout_session(
    request: CreateCheckoutSessionRequest,
    user: AuthorizedUser
) -> CheckoutSessionResponse:
    """Create a Stripe checkout session for subscription."""
    
    # Get the plan
    plan = get_plan_by_id(request.plan_id)
    if not plan or not plan.stripe_price_id:
        raise HTTPException(status_code=400, detail="Invalid plan ID or free plan selected")
    
    try:
        # Create a customer if they don't exist
        customers = stripe.Customer.list(email=user.email)
        if customers and customers.data:
            customer = customers.data[0]
            
            # Update customer metadata with user ID if needed
            if 'user_id' not in customer.metadata or customer.metadata['user_id'] != user.sub:
                stripe.Customer.modify(
                    customer.id,
                    metadata={"user_id": user.sub}
                )
        else:
            customer = stripe.Customer.create(
                email=user.email,
                metadata={"user_id": user.sub}
            )
        
        # Create checkout session
        checkout_session = stripe.checkout.Session.create(
            customer=customer.id,
            payment_method_types=['card'],
            line_items=[{
                'price': plan.stripe_price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            subscription_data={
                'trial_period_days': TRIAL_DAYS,
                'metadata': {
                    'user_id': user.sub,
                    'plan_id': plan.id
                }
            },
            metadata={
                'user_id': user.sub,
                'plan_id': plan.id
            }
        )
        
        return CheckoutSessionResponse(
            session_id=checkout_session.id,
            checkout_url=checkout_session.url
        )
    
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint to get current subscription status
@router.get("/status")
async def get_subscription_status(user: AuthorizedUser) -> SubscriptionStatus:
    """Get the current subscription status for a user."""
    
    try:
        # Look up customer
        customers = stripe.Customer.list(email=user.email)
        if not customers or not customers.data:
            # No customer found, return free plan status
            return SubscriptionStatus(
                is_active=True,  # Everyone has access to free features
                is_trial=False,
                subscription=None,
                available_plans=SUBSCRIPTION_PLANS
            )
        
        customer = customers.data[0]
        
        # Get subscriptions
        subscriptions = stripe.Subscription.list(
            customer=customer.id,
            status="active",
            expand=["data.default_payment_method"]
        )
        
        if not subscriptions or not subscriptions.data:
            # No active subscription, return free plan status
            return SubscriptionStatus(
                is_active=True,  # Everyone has access to free features
                is_trial=False,
                subscription=None,
                available_plans=SUBSCRIPTION_PLANS
            )
        
        # Get the latest subscription
        subscription = subscriptions.data[0]
        
        # Determine the plan ID from metadata or infer from price
        plan_id = subscription.metadata.get('plan_id') if subscription.metadata else None
        
        if not plan_id:
            # Try to infer plan from price
            for plan in SUBSCRIPTION_PLANS:
                if plan.stripe_price_id and plan.stripe_price_id == subscription.items.data[0].price.id:
                    plan_id = plan.id
                    break
            
            # If still not found, default to premium
            if not plan_id:
                plan_id = PLAN_PREMIUM
        
        # Determine trial status
        is_trial = subscription.status == 'trialing'
        trial_end = datetime.fromtimestamp(subscription.trial_end) if subscription.trial_end else None
        
        # Extract payment method info if available
        payment_method = None
        if subscription.default_payment_method:
            pm = subscription.default_payment_method
            payment_method = {
                "brand": pm.card.brand,
                "last4": pm.card.last4,
                "exp_month": pm.card.exp_month,
                "exp_year": pm.card.exp_year,
                "id": pm.id
            }
        
        # Build subscription info
        current_sub = CurrentSubscription(
            plan_id=plan_id,
            status=subscription.status,
            current_period_end=datetime.fromtimestamp(subscription.current_period_end),
            cancel_at_period_end=subscription.cancel_at_period_end,
            trial_end=trial_end,
            subscription_id=subscription.id,
            payment_method=payment_method
        )
        
        return SubscriptionStatus(
            is_active=True,  # Premium plan is active
            is_trial=is_trial,
            subscription=current_sub,
            available_plans=SUBSCRIPTION_PLANS
        )
    
    except stripe.error.StripeError as e:
        # On error, still return a valid status but log the error
        print(f"Error getting subscription status: {str(e)}")
        return SubscriptionStatus(
            is_active=True,  # Default to free access on error
            is_trial=False,
            subscription=None,
            available_plans=SUBSCRIPTION_PLANS
        )

# Endpoint to cancel subscription
@router.post("/cancel")
async def cancel_subscription(
    subscription_id: str,
    user: AuthorizedUser,
    at_period_end: bool = True
) -> Dict[str, Any]:
    """Cancel a subscription."""
    
    try:
        # Verify the subscription belongs to this user
        subscription = stripe.Subscription.retrieve(subscription_id)
        customers = stripe.Customer.list(email=user.email)
        
        if not customers or not customers.data or customers.data[0].id != subscription.customer:
            raise HTTPException(status_code=403, detail="Subscription does not belong to this user")
        
        # Cancel the subscription
        if at_period_end:
            # Cancel at period end
            updated_subscription = stripe.Subscription.modify(
                subscription_id,
                cancel_at_period_end=True
            )
            message = "Subscription will be canceled at the end of the current billing period"
        else:
            # Cancel immediately
            updated_subscription = stripe.Subscription.delete(subscription_id)
            message = "Subscription has been canceled immediately"
        
        return {
            "success": True,
            "message": message,
            "status": updated_subscription.status,
            "cancel_at_period_end": updated_subscription.cancel_at_period_end
        }
    
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

# Endpoint to reactivate a canceled subscription
@router.post("/reactivate")
async def reactivate_subscription(
    subscription_id: str,
    user: AuthorizedUser
) -> Dict[str, Any]:
    """Reactivate a subscription that was set to cancel at period end."""
    
    try:
        # Verify the subscription belongs to this user
        subscription = stripe.Subscription.retrieve(subscription_id)
        customers = stripe.Customer.list(email=user.email)
        
        if not customers or not customers.data or customers.data[0].id != subscription.customer:
            raise HTTPException(status_code=403, detail="Subscription does not belong to this user")
        
        # Can only reactivate if it's set to cancel at period end
        if not subscription.cancel_at_period_end:
            raise HTTPException(status_code=400, detail="Subscription is not set to cancel at period end")
        
        # Reactivate the subscription
        updated_subscription = stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=False
        )
        
        return {
            "success": True,
            "message": "Subscription has been reactivated",
            "status": updated_subscription.status,
            "cancel_at_period_end": updated_subscription.cancel_at_period_end
        }
    
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

# Model for customer portal request
class CustomerPortalRequest(BaseModel):
    return_url: str = Field(..., description="URL to redirect to after the customer portal session completes")

# Model for customer portal response
class CustomerPortalResponse(BaseModel):
    url: str

# Endpoint to create a customer portal session
@router.post("/customer-portal")
async def create_customer_portal_session(
    request: CustomerPortalRequest,
    user: AuthorizedUser
) -> CustomerPortalResponse:
    """Create a customer portal session for managing billing and subscriptions."""
    
    try:
        # Find the customer
        customers = stripe.Customer.list(email=user.email)
        
        if not customers or not customers.data:
            raise HTTPException(status_code=404, detail="No Stripe customer found for this user")
        
        customer = customers.data[0]
        
        # Create the session
        session = stripe.billing_portal.Session.create(
            customer=customer.id,
            return_url=request.return_url,
        )
        
        return CustomerPortalResponse(url=session.url)
    
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e