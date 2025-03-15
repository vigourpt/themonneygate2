import { create } from 'zustand';
import brain from 'brain';
import { toast } from 'sonner';
import { APP_BASE_PATH, firebaseApp } from 'app';
import { doc, getDoc, collection, query, where, onSnapshot, getFirestore } from 'firebase/firestore';
import { useCurrentUser } from 'app';

// Types from the API
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_per_month: number;
  features: string[];
  stripe_price_id?: string;
  is_annual: boolean;
  discount_percentage?: number;
}

export interface CurrentSubscription {
  plan_id: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_end?: string;
  subscription_id?: string;
  payment_method?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    id: string;
  };
}

// Firestore subscription interface
export interface FirestoreSubscription {
  planId: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
  trialEndDate?: string;
  isTrial: boolean;
  isActive: boolean;
  isAutoRenew: boolean;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  updatedAt: string;
  canceledAt?: string;
}

export interface SubscriptionStatus {
  is_active: boolean;
  is_trial: boolean;
  subscription?: CurrentSubscription;
  available_plans: SubscriptionPlan[];
}

interface SubscriptionState {
  // State
  status: SubscriptionStatus | null;
  firestoreSubscription: FirestoreSubscription | null;
  isLoading: boolean;
  error: string | null;
  checkoutUrl: string | null;
  firestoreUnsubscribe: (() => void) | null;
  
  // Actions
  fetchSubscriptionStatus: () => Promise<void>;
  subscribeToFirestore: (userId: string) => Promise<void>;
  unsubscribeFromFirestore: () => void;
  createCheckoutSession: (planId: string) => Promise<void>;
  createCustomerPortalSession: (returnUrl: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string, atPeriodEnd?: boolean) => Promise<void>;
  reactivateSubscription: (subscriptionId: string) => Promise<void>;
  reset: () => void;
  
  // Derived state
  isSubscribed: () => boolean;
  isOnFreePlan: () => boolean;
  isOnTrial: () => boolean;
  getActivePlan: () => SubscriptionPlan | null;
  getRemainingTrialDays: () => number;
  getFormattedExpiryDate: () => string;
}

export const PLAN_FREE = 'free';
export const PLAN_PREMIUM = 'premium';
export const PLAN_PREMIUM_ANNUAL = 'premium_annual';

// Get Firestore instance
const db = getFirestore(firebaseApp);

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  // Initial state
  status: null,
  firestoreSubscription: null,
  isLoading: false,
  error: null,
  checkoutUrl: null,
  firestoreUnsubscribe: null,
  
  // Actions
  subscribeToFirestore: async (userId: string) => {
    // Unsubscribe from any existing listener
    get().unsubscribeFromFirestore();
    
    try {
      // Subscribe to the user's subscription document
      const subscriptionRef = doc(db, 'subscriptions', userId);
      
      const unsubscribe = onSnapshot(subscriptionRef, (doc) => {
        if (doc.exists()) {
          const firestoreSubscription = doc.data() as FirestoreSubscription;
          set({ firestoreSubscription });
          console.log('Updated subscription from Firestore:', firestoreSubscription);
        } else {
          console.log('No subscription found in Firestore');
          set({ firestoreSubscription: null });
        }
      }, (error) => {
        console.error('Error getting subscription from Firestore:', error);
      });
      
      set({ firestoreUnsubscribe: unsubscribe });
    } catch (error) {
      console.error('Error subscribing to Firestore:', error);
    }
  },
  
  unsubscribeFromFirestore: () => {
    const { firestoreUnsubscribe } = get();
    if (firestoreUnsubscribe) {
      firestoreUnsubscribe();
      set({ firestoreUnsubscribe: null });
    }
  },
  
  fetchSubscriptionStatus: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await brain.get_subscription_status();
      const data = await response.json();
      set({ status: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      set({ 
        error: 'Failed to load subscription information', 
        isLoading: false,
        // Set a default status so the UI doesn't break
        status: {
          is_active: true,
          is_trial: false,
          available_plans: []
        }
      });
      toast.error('Failed to load subscription information');
    }
  },
  
  createCheckoutSession: async (planId: string) => {
    try {
      set({ isLoading: true, error: null, checkoutUrl: null });
      
      // Base paths for success and cancel URLs
      const successUrl = `${window.location.origin}${APP_BASE_PATH}/profile?checkout_success=true`;
      const cancelUrl = `${window.location.origin}${APP_BASE_PATH}/profile?checkout_canceled=true`;
      
      const response = await brain.create_checkout_session({
        plan_id: planId,
        success_url: successUrl,
        cancel_url: cancelUrl
      });
      
      const data = await response.json();
      set({ checkoutUrl: data.checkout_url, isLoading: false });
      
      // Redirect to Stripe checkout
      window.location.href = data.checkout_url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      set({ error: 'Failed to create checkout session', isLoading: false });
      toast.error('Failed to create checkout session');
    }
  },
  
  createCustomerPortalSession: async (returnUrl: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await brain.create_customer_portal_session({
        return_url: returnUrl
      });
      
      const data = await response.json();
      set({ isLoading: false });
      
      // Redirect to Stripe customer portal
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating customer portal session:', error);
      set({ error: 'Failed to create customer portal session', isLoading: false });
      toast.error('Failed to access payment settings');
    }
  },
  
  cancelSubscription: async (subscriptionId: string, atPeriodEnd = true) => {
    try {
      set({ isLoading: true, error: null });
      
      await brain.cancel_subscription({
        subscription_id: subscriptionId,
        at_period_end: atPeriodEnd
      });
      
      // Update status
      await get().fetchSubscriptionStatus();
      
      const message = atPeriodEnd 
        ? 'Your subscription will be canceled at the end of the billing period' 
        : 'Your subscription has been canceled';
      
      toast.success(message);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      set({ error: 'Failed to cancel subscription', isLoading: false });
      toast.error('Failed to cancel subscription');
    }
  },
  
  reactivateSubscription: async (subscriptionId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await brain.reactivate_subscription({
        subscription_id: subscriptionId
      });
      
      // Update status
      await get().fetchSubscriptionStatus();
      
      toast.success('Your subscription has been reactivated');
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      set({ error: 'Failed to reactivate subscription', isLoading: false });
      toast.error('Failed to reactivate subscription');
    }
  },
  
  reset: () => {
    // Unsubscribe from Firestore
    get().unsubscribeFromFirestore();
    
    set({
      status: null,
      firestoreSubscription: null,
      isLoading: false,
      error: null,
      checkoutUrl: null,
      firestoreUnsubscribe: null
    });
  },
  
  // Derived state
  isSubscribed: () => {
    const { status, firestoreSubscription } = get();
    
    // Check Firestore first (most up-to-date)
    if (firestoreSubscription) {
      return firestoreSubscription.isActive && firestoreSubscription.planId !== PLAN_FREE;
    }
    
    // Fall back to API data
    if (!status || !status.subscription) return false;
    return status.subscription.plan_id !== PLAN_FREE && status.is_active;
  },
  
  isOnFreePlan: () => {
    const { status, firestoreSubscription } = get();
    
    // Check Firestore first (most up-to-date)
    if (firestoreSubscription) {
      return firestoreSubscription.planId === PLAN_FREE || !firestoreSubscription.isActive;
    }
    
    // Fall back to API data
    if (!status) return true; // Default to free plan if no status
    if (!status.subscription) return true;
    return status.subscription.plan_id === PLAN_FREE;
  },
  
  isOnTrial: () => {
    const { status, firestoreSubscription } = get();
    
    // Check Firestore first (most up-to-date)
    if (firestoreSubscription) {
      return firestoreSubscription.isTrial;
    }
    
    // Fall back to API data
    if (!status) return false;
    return status.is_trial;
  },
  
  getActivePlan: () => {
    const { status, firestoreSubscription } = get();
    
    // Use the plan ID from Firestore if available
    let planId;
    if (firestoreSubscription && firestoreSubscription.isActive) {
      planId = firestoreSubscription.planId;
    } else if (status && status.subscription) {
      planId = status.subscription.plan_id;
    } else {
      return null;
    }
    
    // Need the available plans from the API
    if (!status || !status.available_plans) return null;
    
    return status.available_plans.find(plan => plan.id === planId) || null;
  },
  
  getRemainingTrialDays: () => {
    const { status, firestoreSubscription } = get();
    
    // Check Firestore first (most up-to-date)
    if (firestoreSubscription && firestoreSubscription.trialEndDate) {
      const trialEnd = new Date(firestoreSubscription.trialEndDate);
      const now = new Date();
      const diffTime = trialEnd.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
    
    // Fall back to API data
    if (!status || !status.subscription || !status.subscription.trial_end) return 0;
    
    const trialEnd = new Date(status.subscription.trial_end);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  },
  
  getFormattedExpiryDate: () => {
    const { status, firestoreSubscription } = get();
    
    // Check Firestore first (most up-to-date)
    if (firestoreSubscription) {
      const date = firestoreSubscription.trialEndDate || firestoreSubscription.endDate;
      if (date) {
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }
    
    // Fall back to API data
    if (!status || !status.subscription) return '';
    
    const date = status.subscription.trial_end || status.subscription.current_period_end;
    if (!date) return '';
    
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}));
