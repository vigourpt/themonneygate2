from pydantic import BaseModel
from typing import Dict, Any, Optional
from fastapi import APIRouter, Request, HTTPException, Header, Depends
import stripe
import databutton as db
import json
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK if not already initialized
try:
    firebase_admin.get_app()
except ValueError:
    # App not initialized, initialize it
    firebase_admin.initialize_app()

# Get Firestore client
firestore_db = firestore.client()

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

# Try to get webhook secret based on environment, but make it optional
from app.env import Mode, mode

WEBHOOK_SECRET = None

if mode == Mode.DEV:
    try:
        WEBHOOK_SECRET = db.secrets.get("STRIPE_WEBHOOK_SECRET_TEST")
        print("Using Stripe TEST webhook secret in development mode")
    except:
        try:
            # Fallback to live webhook secret
            WEBHOOK_SECRET = db.secrets.get("STRIPE_WEBHOOK_SECRET")
            print("WARNING: Using Stripe LIVE webhook secret in development mode")
        except:
            print("Warning: No webhook secret configured. Webhook signature verification will be skipped.")
else:
    try:
        WEBHOOK_SECRET = db.secrets.get("STRIPE_WEBHOOK_SECRET")
        print("Using Stripe LIVE webhook secret in production mode")
    except:
        print("Warning: STRIPE_WEBHOOK_SECRET not configured. Webhook signature verification will be skipped.")

# Storage keys for webhook data
WEBHOOK_EVENTS_LOG = "stripe_webhook_events.log"
STRIPE_METRICS_KEY = "stripe_subscription_metrics.json"

# Update subscription metrics
def update_subscription_metrics(event_type: str, subscription_data: Dict[str, Any] = None) -> None:
    """Update subscription metrics based on webhook events."""
    try:
        # Get existing metrics or initialize
        try:
            metrics = db.storage.json.get(STRIPE_METRICS_KEY, default={
                "total_subscriptions": 0,
                "active_subscriptions": 0,
                "trial_subscriptions": 0,
                "canceled_subscriptions": 0,
                "revenue_monthly_usd": 0,
                "last_updated": datetime.now().isoformat()
            })
        except:
            metrics = {
                "total_subscriptions": 0,
                "active_subscriptions": 0,
                "trial_subscriptions": 0,
                "canceled_subscriptions": 0,
                "revenue_monthly_usd": 0,
                "last_updated": datetime.now().isoformat()
            }
        
        # Update metrics based on event type
        if event_type == "checkout.session.completed" and subscription_data:
            metrics["total_subscriptions"] += 1
            if subscription_data.get("status") == "trialing":
                metrics["trial_subscriptions"] += 1
            else:
                metrics["active_subscriptions"] += 1
                
        elif event_type == "customer.subscription.updated" and subscription_data:
            # Check for status changes
            status = subscription_data.get("status")
            if status == "active":
                metrics["active_subscriptions"] += 1
                metrics["trial_subscriptions"] = max(0, metrics["trial_subscriptions"] - 1)
            elif status == "trialing":
                metrics["trial_subscriptions"] += 1
            elif status == "canceled":
                metrics["canceled_subscriptions"] += 1
                metrics["active_subscriptions"] = max(0, metrics["active_subscriptions"] - 1)
                
        elif event_type == "customer.subscription.deleted":
            metrics["canceled_subscriptions"] += 1
            metrics["active_subscriptions"] = max(0, metrics["active_subscriptions"] - 1)
            
        elif event_type == "invoice.payment_succeeded" and subscription_data:
            # Update revenue metrics if this is a subscription payment
            amount = subscription_data.get("amount_paid", 0) / 100  # Convert cents to dollars
            if subscription_data.get("billing_reason") == "subscription_cycle":
                metrics["revenue_monthly_usd"] += amount
        
        # Update last_updated timestamp
        metrics["last_updated"] = datetime.now().isoformat()
        
        # Save updated metrics
        db.storage.json.put(STRIPE_METRICS_KEY, metrics)
        
    except Exception as e:
        print(f"Error updating subscription metrics: {str(e)}")

# Model for webhook response
class WebhookResponse(BaseModel):
    success: bool
    message: str

# Helper function to log webhook events
def log_webhook_event(event_id: str, event_type: str, event_data: Dict[str, Any]) -> None:
    """Log webhook event to storage for debugging and auditing purposes."""
    try:
        # Get existing log
        try:
            existing_log = db.storage.json.get(WEBHOOK_EVENTS_LOG, default=[])
        except:
            existing_log = []
        
        # Add new event with timestamp
        event_entry = {
            "id": event_id,
            "type": event_type,
            "timestamp": datetime.now().isoformat(),
            "data": event_data
        }
        
        # Append to log and save
        existing_log.append(event_entry)
        
        # Only keep the last 100 events to avoid storage issues
        if len(existing_log) > 100:
            existing_log = existing_log[-100:]
            
        db.storage.json.put(WEBHOOK_EVENTS_LOG, existing_log)
    except Exception as e:
        print(f"Error logging webhook event: {str(e)}")

# Endpoint to handle Stripe webhooks
@router.post("/stripe", response_model=WebhookResponse)
async def handle_stripe_webhook(
    request: Request,
    stripe_signature: Optional[str] = Header(None, alias="Stripe-Signature")
):
    """Handle Stripe webhook events."""
    
    # Only validate signature if webhook secret is configured
    if not stripe_signature and WEBHOOK_SECRET:
        raise HTTPException(status_code=400, detail="Stripe signature is required")
    
    try:
        # Get the raw request body
        payload = await request.body()
        payload_str = payload.decode("utf-8")
        
        # Process the event differently based on whether we have a webhook secret
        if WEBHOOK_SECRET and stripe_signature:
            # Verify the signature
            try:
                event = stripe.Webhook.construct_event(
                    payload=payload_str,
                    sig_header=stripe_signature,
                    secret=WEBHOOK_SECRET
                )
            except stripe.error.SignatureVerificationError:
                raise HTTPException(status_code=400, detail="Invalid signature")
        else:
            # In development mode or without webhook secret, parse the payload without verification
            try:
                event_data = json.loads(payload_str)
                event = stripe.Event.construct_from(event_data, stripe.api_key)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid JSON payload")
        
        # Log the event
        log_webhook_event(event.id, event.type, event.data.object.to_dict())
        
        # Update subscription metrics for relevant events
        event_data = event.data.object.to_dict()
        update_subscription_metrics(event.type, event_data)
        
        # Handle different event types
        if event.type == "checkout.session.completed":
            # A checkout was successful
            session = event.data.object
            customer_id = session.customer
            subscription_id = session.subscription
            
            if subscription_id and customer_id:
                # Get customer email for notifications
                try:
                    customer = stripe.Customer.retrieve(customer_id)
                    user_email = customer.email
                    
                    # Get subscription details
                    subscription = stripe.Subscription.retrieve(subscription_id)
                    
                    # Get the user ID from session metadata
                    user_id = session.metadata.get('user_id')
                    
                    # Update Firestore if we have a user ID
                    if user_id:
                        try:
                            # Determine plan ID from metadata or default to premium
                            plan_id = session.metadata.get('plan_id', 'premium')
                            plan_name = "Premium Monthly"
                            if plan_id == "premium_annual":
                                plan_name = "Premium Annual"
                                
                            # Create subscription data
                            sub_data = {
                                'planId': plan_id,
                                'planName': plan_name,
                                'status': subscription.status,
                                'startDate': datetime.fromtimestamp(subscription.current_period_start).isoformat(),
                                'endDate': datetime.fromtimestamp(subscription.current_period_end).isoformat(),
                                'isTrial': subscription.status == 'trialing',
                                'isActive': subscription.status == 'active' or subscription.status == 'trialing',
                                'isAutoRenew': not subscription.cancel_at_period_end,
                                'stripeCustomerId': customer_id,
                                'stripeSubscriptionId': subscription_id,
                                'updatedAt': datetime.now().isoformat()
                            }
                            
                            # Add trial end date if applicable
                            if subscription.trial_end:
                                sub_data['trialEndDate'] = datetime.fromtimestamp(subscription.trial_end).isoformat()
                            
                            # Save to Firestore
                            firestore_db.collection('subscriptions').document(user_id).set(sub_data, merge=True)
                            print(f"Updated subscription in Firestore for user {user_id}")
                            
                        except Exception as e:
                            print(f"Error updating Firestore: {str(e)}")
                    
                    # Send welcome email notification
                    try:
                        db.notify.email(
                            to=user_email,
                            subject="Welcome to MoneyGate Premium!",
                            content_html=f"""
                            <h1>Thanks for subscribing to MoneyGate Premium!</h1>
                            <p>Your subscription is now active. You now have access to all premium features.</p>
                            <p>Your subscription details:</p>
                            <ul>
                                <li>Plan: Premium</li>
                                <li>Status: {subscription.status}</li>
                                <li>Started: {datetime.fromtimestamp(subscription.current_period_start).strftime('%Y-%m-%d')}</li>
                                <li>Next billing date: {datetime.fromtimestamp(subscription.current_period_end).strftime('%Y-%m-%d')}</li>
                            </ul>
                            <p>If you have any questions, please contact our support team.</p>
                            """,
                            content_text="Thanks for subscribing to MoneyGate Premium! Your subscription is now active."
                        )
                    except Exception as e:
                        print(f"Error sending welcome email: {str(e)}")
                except Exception as e:
                    print(f"Error retrieving customer or subscription details: {str(e)}")
            
        elif event.type == "customer.subscription.created":
            # A subscription was created
            subscription = event.data.object
            customer_id = subscription.customer
            
            # This is handled by checkout.session.completed in most cases
            # but we could add additional logic here for API-created subscriptions
            pass
            
        elif event.type == "customer.subscription.updated":
            # A subscription was updated
            subscription = event.data.object
            customer_id = subscription.customer
            
            # Handle specific update scenarios like plan changes
            try:
                customer = stripe.Customer.retrieve(customer_id)
                user_email = customer.email
                
                # Try to get user ID from metadata or lookup by customer ID
                user_id = subscription.metadata.get('user_id')
                if not user_id:
                    # Try to look up in existing subscriptions
                    subs_query = firestore_db.collection('subscriptions').where('stripeCustomerId', '==', customer_id).limit(1).get()
                    if subs_query and len(subs_query) > 0:
                        user_id = subs_query[0].id
                
                # Update Firestore if we have a user ID
                if user_id:
                    try:
                        # Determine plan ID - keep existing or get from metadata
                        sub_ref = firestore_db.collection('subscriptions').document(user_id)
                        existing_sub = sub_ref.get()
                        plan_id = subscription.metadata.get('plan_id')
                        plan_name = "Premium Monthly"
                        
                        if existing_sub.exists:
                            existing_data = existing_sub.to_dict()
                            if not plan_id and 'planId' in existing_data:
                                plan_id = existing_data['planId']
                        
                        if plan_id == "premium_annual":
                            plan_name = "Premium Annual"
                        
                        # Create updated subscription data
                        sub_data = {
                            'planId': plan_id or 'premium',
                            'planName': plan_name,
                            'status': subscription.status,
                            'endDate': datetime.fromtimestamp(subscription.current_period_end).isoformat(),
                            'isTrial': subscription.status == 'trialing',
                            'isActive': subscription.status == 'active' or subscription.status == 'trialing',
                            'isAutoRenew': not subscription.cancel_at_period_end,
                            'stripeCustomerId': customer_id,
                            'stripeSubscriptionId': subscription.id,
                            'updatedAt': datetime.now().isoformat()
                        }
                        
                        # Add trial end date if applicable
                        if subscription.trial_end:
                            sub_data['trialEndDate'] = datetime.fromtimestamp(subscription.trial_end).isoformat()
                        
                        # Save to Firestore
                        sub_ref.set(sub_data, merge=True)
                        print(f"Updated subscription in Firestore for user {user_id} (status: {subscription.status})")
                        
                    except Exception as e:
                        print(f"Error updating Firestore for subscription update: {str(e)}")
                
                # Check if the subscription moved from trial to active
                if subscription.status == "active" and "trial_end" in event.data.previous_attributes:
                    # Trial just ended and converted to paid plan
                    try:
                        db.notify.email(
                            to=user_email,
                            subject="Your MoneyGate trial has converted to a paid subscription",
                            content_html=f"""
                            <h1>Your trial has ended</h1>
                            <p>Your trial period has ended and your paid subscription is now active.</p>
                            <p>Your subscription details:</p>
                            <ul>
                                <li>Plan: Premium</li>
                                <li>Status: Active</li>
                                <li>Next billing date: {datetime.fromtimestamp(subscription.current_period_end).strftime('%Y-%m-%d')}</li>
                            </ul>
                            <p>You can manage your subscription anytime from your account settings.</p>
                            """,
                            content_text="Your trial has ended and your paid subscription is now active."
                        )
                    except Exception as e:
                        print(f"Error sending trial conversion email: {str(e)}")
            except Exception as e:
                print(f"Error processing subscription update: {str(e)}")
            
        elif event.type == "customer.subscription.deleted":
            # A subscription was cancelled and ended (not just set to cancel at period end)
            subscription = event.data.object
            customer_id = subscription.customer
            
            try:
                customer = stripe.Customer.retrieve(customer_id)
                user_email = customer.email
                
                # Try to get user ID from metadata or lookup by customer ID
                user_id = subscription.metadata.get('user_id')
                if not user_id:
                    # Try to look up in existing subscriptions
                    subs_query = firestore_db.collection('subscriptions').where('stripeCustomerId', '==', customer_id).limit(1).get()
                    if subs_query and len(subs_query) > 0:
                        user_id = subs_query[0].id
                
                # Update Firestore if we have a user ID
                if user_id:
                    try:
                        # Update subscription status in Firestore
                        sub_data = {
                            'status': 'canceled',
                            'isActive': False,
                            'isAutoRenew': False,
                            'canceledAt': datetime.now().isoformat(),
                            'updatedAt': datetime.now().isoformat()
                        }
                        
                        # Save to Firestore
                        firestore_db.collection('subscriptions').document(user_id).set(sub_data, merge=True)
                        print(f"Updated subscription in Firestore for user {user_id} (status: canceled)")
                        
                    except Exception as e:
                        print(f"Error updating Firestore for subscription deletion: {str(e)}")
                
                # Send cancellation email
                try:
                    db.notify.email(
                        to=user_email,
                        subject="Your MoneyGate subscription has ended",
                        content_html=f"""
                        <h1>Your subscription has ended</h1>
                        <p>Your premium subscription has now ended. You've been moved to the free plan.</p>
                        <p>We're sorry to see you go! If you'd like to share feedback on your experience, please reply to this email.</p>
                        <p>You can resubscribe anytime from your account settings.</p>
                        """,
                        content_text="Your premium subscription has ended. You've been moved to the free plan."
                    )
                except Exception as e:
                    print(f"Error sending subscription ended email: {str(e)}")
            except Exception as e:
                print(f"Error handling subscription deletion: {str(e)}")
            
        elif event.type == "invoice.payment_succeeded":
            # Payment succeeded
            invoice = event.data.object
            customer_id = invoice.customer
            subscription_id = invoice.subscription
            
            if subscription_id and customer_id:
                try:
                    customer = stripe.Customer.retrieve(customer_id)
                    user_email = customer.email
                    amount = invoice.amount_paid / 100  # Convert cents to dollars
                    currency = invoice.currency.upper()
                    
                    # Only send receipt for recurring payments (not initial payment which is handled by checkout.session.completed)
                    if invoice.billing_reason == "subscription_cycle":
                        try:
                            db.notify.email(
                                to=user_email,
                                subject=f"Receipt for your MoneyGate payment of {amount} {currency}",
                                content_html=f"""
                                <h1>Payment Receipt</h1>
                                <p>We've received your payment for your MoneyGate subscription.</p>
                                <p><strong>Amount:</strong> {amount} {currency}</p>
                                <p><strong>Date:</strong> {datetime.fromtimestamp(invoice.created).strftime('%Y-%m-%d')}</p>
                                <p><strong>Invoice ID:</strong> {invoice.id}</p>
                                <p>Thank you for your continued subscription!</p>
                                """,
                                content_text=f"We've received your payment of {amount} {currency} for your MoneyGate subscription. Thank you!"
                            )
                        except Exception as e:
                            print(f"Error sending payment receipt email: {str(e)}")
                except Exception as e:
                    print(f"Error processing successful payment: {str(e)}")
            
        elif event.type == "invoice.payment_failed":
            # Payment failed
            invoice = event.data.object
            customer_id = invoice.customer
            subscription_id = invoice.subscription
            attempt_count = invoice.attempt_count
            
            if subscription_id and customer_id:
                try:
                    customer = stripe.Customer.retrieve(customer_id)
                    user_email = customer.email
                    
                    # Send payment failure notification
                    try:
                        customer_portal_link = "https://themoneygate.com/subscription"
                        
                        db.notify.email(
                            to=user_email,
                            subject=f"Action required: Your MoneyGate payment failed",
                            content_html=f"""
                            <h1>Payment Failed</h1>
                            <p>We weren't able to process your payment for your MoneyGate subscription.</p>
                            <p>This was attempt #{attempt_count}. Please update your payment method to avoid any interruption to your service.</p>
                            <p><a href="{customer_portal_link}">Update your payment method here</a></p>
                            <p>If you need assistance, please contact our support team.</p>
                            """,
                            content_text=f"We weren't able to process your payment for your MoneyGate subscription (attempt #{attempt_count}). Please update your payment method to avoid service interruption."
                        )
                    except Exception as e:
                        print(f"Error sending payment failure email: {str(e)}")
                except Exception as e:
                    print(f"Error handling payment failure: {str(e)}")
            
        elif event.type == "customer.subscription.trial_will_end":
            # Trial period will end soon (3 days before)
            subscription = event.data.object
            customer_id = subscription.customer
            trial_end = subscription.trial_end
            
            try:
                customer = stripe.Customer.retrieve(customer_id)
                user_email = customer.email
                
                # Format the trial end date
                trial_end_date = datetime.fromtimestamp(trial_end).strftime('%B %d, %Y')
                
                # Send trial ending notification
                try:
                    customer_portal_link = "https://themoneygate.com/subscription"
                    
                    db.notify.email(
                        to=user_email,
                        subject="Your MoneyGate free trial is ending soon",
                        content_html=f"""
                        <h1>Your Free Trial is Ending Soon</h1>
                        <p>Your MoneyGate free trial will end on {trial_end_date}. After this date, your subscription will automatically convert to a paid plan.</p>
                        <p>If you wish to continue enjoying premium features, no action is required. Your payment method will be charged automatically.</p>
                        <p>If you would like to cancel before being charged, you can do so by <a href="{customer_portal_link}">visiting your subscription page</a>.</p>
                        <p>We hope you've enjoyed using MoneyGate and found value in our premium features!</p>
                        """,
                        content_text=f"Your MoneyGate free trial will end on {trial_end_date}. After this date, your subscription will automatically convert to a paid plan unless you cancel."
                    )
                except Exception as e:
                    print(f"Error sending trial ending email: {str(e)}")
            except Exception as e:
                print(f"Error handling trial ending notification: {str(e)}")
                
        # Add handling for additional Stripe events
        
        elif event.type == "invoice.upcoming":
            # An upcoming invoice is about to be created
            invoice = event.data.object
            customer_id = invoice.customer
            subscription_id = invoice.subscription
            
            if subscription_id and customer_id:
                try:
                    customer = stripe.Customer.retrieve(customer_id)
                    user_email = customer.email
                    amount = invoice.amount_due / 100  # Convert cents to dollars
                    currency = invoice.currency.upper()
                    invoice_date = datetime.fromtimestamp(invoice.created).strftime('%Y-%m-%d')
                    
                    # Send upcoming invoice notification
                    try:
                        db.notify.email(
                            to=user_email,
                            subject=f"Your upcoming MoneyGate subscription payment",
                            content_html=f"""
                            <h1>Upcoming Subscription Payment</h1>
                            <p>This is a reminder about your upcoming MoneyGate subscription payment.</p>
                            <p><strong>Amount:</strong> {amount} {currency}</p>
                            <p><strong>Date:</strong> {invoice_date}</p>
                            <p>Your payment method will be charged automatically. If you need to update your payment information, please visit your subscription settings.</p>
                            """,
                            content_text=f"This is a reminder about your upcoming MoneyGate subscription payment of {amount} {currency} on {invoice_date}."
                        )
                    except Exception as e:
                        print(f"Error sending upcoming invoice email: {str(e)}")
                except Exception as e:
                    print(f"Error processing upcoming invoice: {str(e)}")
        
        elif event.type == "customer.updated":
            # Customer details were updated
            customer = event.data.object
            user_email = customer.email
            
            # Update user metadata in Firestore if needed
            # This could include updating the customer email or other details
            
            # If this update contains a user_id in the metadata, we can use it to link
            # the Stripe customer ID to the Firebase user ID
            user_id = customer.metadata.get('user_id')
            if user_id:
                try:
                    # Save the stripe_customer_id to the user's Firestore document
                    firestore_db.collection('users').document(user_id).set({
                        'stripeCustomerId': customer.id,
                        'updatedAt': datetime.now().isoformat()
                    }, merge=True)
                    print(f"Updated Stripe customer ID for user {user_id} in Firestore")
                except Exception as e:
                    print(f"Error updating user with Stripe customer ID: {str(e)}")
                    
        elif event.type == "customer.subscription.pending_update_applied":
            # A pending update to a subscription has been applied
            subscription = event.data.object
            customer_id = subscription.customer
            
            try:
                customer = stripe.Customer.retrieve(customer_id)
                user_email = customer.email
                
                # Try to get user ID from metadata or lookup by customer ID
                user_id = subscription.metadata.get('user_id')
                if not user_id:
                    # Try to look up in existing subscriptions
                    subs_query = firestore_db.collection('subscriptions').where('stripeCustomerId', '==', customer_id).limit(1).get()
                    if subs_query and len(subs_query) > 0:
                        user_id = subs_query[0].id
                
                # Update Firestore if we have a user ID
                if user_id:
                    try:
                        # Get updated subscription details
                        sub = stripe.Subscription.retrieve(subscription.id)
                        
                        # Create updated subscription data
                        sub_data = {
                            'status': sub.status,
                            'endDate': datetime.fromtimestamp(sub.current_period_end).isoformat(),
                            'isActive': sub.status == 'active' or sub.status == 'trialing',
                            'isAutoRenew': not sub.cancel_at_period_end,
                            'updatedAt': datetime.now().isoformat()
                        }
                        
                        # Save to Firestore
                        firestore_db.collection('subscriptions').document(user_id).set(sub_data, merge=True)
                        print(f"Updated subscription in Firestore for user {user_id} (pending update applied)")
                        
                        # Send notification email
                        db.notify.email(
                            to=user_email,
                            subject="Your MoneyGate subscription has been updated",
                            content_html=f"""
                            <h1>Subscription Updated</h1>
                            <p>The pending changes to your MoneyGate subscription have been applied.</p>
                            <p>Your updated subscription details:</p>
                            <ul>
                                <li>Status: {sub.status.title()}</li>
                                <li>Next billing date: {datetime.fromtimestamp(sub.current_period_end).strftime('%Y-%m-%d')}</li>
                            </ul>
                            <p>You can view and manage your subscription anytime from your account settings.</p>
                            """,
                            content_text="The pending changes to your MoneyGate subscription have been applied."
                        )
                    except Exception as e:
                        print(f"Error handling pending update: {str(e)}")
                        
            except Exception as e:
                print(f"Error processing subscription pending update: {str(e)}")
                
        elif event.type == "payment_method.attached":
            # A new payment method was attached to a customer
            payment_method = event.data.object
            customer_id = payment_method.customer
            
            if customer_id:
                try:
                    customer = stripe.Customer.retrieve(customer_id)
                    user_email = customer.email
                    
                    # Get last 4 digits of the card
                    card_last4 = None
                    if payment_method.type == "card" and "card" in payment_method:
                        card_last4 = payment_method.card.last4
                    
                    # Send payment method added notification
                    try:
                        card_info = f" ending in {card_last4}" if card_last4 else ""
                        db.notify.email(
                            to=user_email,
                            subject="New payment method added to your MoneyGate account",
                            content_html=f"""
                            <h1>New Payment Method Added</h1>
                            <p>A new payment method{card_info} has been added to your MoneyGate account.</p>
                            <p>This payment method will be used for future subscription payments.</p>
                            <p>If you did not make this change, please contact our support team immediately.</p>
                            """,
                            content_text=f"A new payment method{card_info} has been added to your MoneyGate account."
                        )
                    except Exception as e:
                        print(f"Error sending payment method notification: {str(e)}")
                except Exception as e:
                    print(f"Error processing payment method update: {str(e)}")
                    
        elif event.type == "charge.succeeded":
            # A charge was successfully created
            # We primarily handle this through invoice.payment_succeeded for subscriptions,
            # but this can be useful for one-time charges
            charge = event.data.object
            customer_id = charge.customer
            
            # Only handle non-subscription charges here (subscription charges handled by invoice events)
            if customer_id and not charge.invoice:
                try:
                    customer = stripe.Customer.retrieve(customer_id)
                    user_email = customer.email
                    amount = charge.amount / 100  # Convert cents to dollars
                    currency = charge.currency.upper()
                    
                    # Send receipt for one-time charges
                    try:
                        db.notify.email(
                            to=user_email,
                            subject=f"Receipt for your MoneyGate payment of {amount} {currency}",
                            content_html=f"""
                            <h1>Payment Receipt</h1>
                            <p>We've received your one-time payment to MoneyGate.</p>
                            <p><strong>Amount:</strong> {amount} {currency}</p>
                            <p><strong>Date:</strong> {datetime.fromtimestamp(charge.created).strftime('%Y-%m-%d')}</p>
                            <p><strong>Charge ID:</strong> {charge.id}</p>
                            <p>Thank you for your payment!</p>
                            """,
                            content_text=f"We've received your one-time payment of {amount} {currency} to MoneyGate. Thank you!"
                        )
                    except Exception as e:
                        print(f"Error sending one-time charge receipt: {str(e)}")
                except Exception as e:
                    print(f"Error processing one-time charge: {str(e)}")
                    
        elif event.type == "charge.failed":
            # A charge attempt failed
            charge = event.data.object
            customer_id = charge.customer
            
            if customer_id:
                try:
                    customer = stripe.Customer.retrieve(customer_id)
                    user_email = customer.email
                    amount = charge.amount / 100  # Convert cents to dollars
                    currency = charge.currency.upper()
                    failure_message = charge.failure_message or "Unknown reason"
                    
                    # Send payment failure notification
                    try:
                        db.notify.email(
                            to=user_email,
                            subject="Your payment to MoneyGate failed",
                            content_html=f"""
                            <h1>Payment Failed</h1>
                            <p>We were unable to process your payment of {amount} {currency}.</p>
                            <p><strong>Reason:</strong> {failure_message}</p>
                            <p>Please update your payment method in your account settings or contact our support team for assistance.</p>
                            """,
                            content_text=f"We were unable to process your payment of {amount} {currency}. Reason: {failure_message}"
                        )
                    except Exception as e:
                        print(f"Error sending charge failed notification: {str(e)}")
                except Exception as e:
                    print(f"Error processing failed charge: {str(e)}")
        
        return WebhookResponse(success=True, message=f"Processed event: {event.type}")
        
    except Exception as e:
        # Log the error
        print(f"Error handling webhook: {str(e)}")
        
        # Return a 200 response to acknowledge receipt even on error
        # This is Stripe's recommended approach to prevent retries
        return WebhookResponse(success=False, message=f"Error processing webhook: {str(e)}")
