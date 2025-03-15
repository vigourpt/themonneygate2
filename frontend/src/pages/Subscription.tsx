import React, { useEffect, useState } from "react";
import { useUserGuardContext } from "app";
import { useSubscriptionStore } from "utils/subscriptionStore";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { SubscriptionPlans } from "components/SubscriptionPlans";
import { SubscriptionStatus } from "components/SubscriptionStatus";
import { SubscriptionManagement } from "components/SubscriptionManagement";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Package } from "lucide-react";

enum SubscriptionView {
  STATUS = "status",
  PLANS = "plans",
  MANAGE = "manage",
}

const Subscription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserGuardContext();
  const { 
    fetchSubscriptionStatus, 
    subscribeToFirestore, 
    unsubscribeFromFirestore,
    status, 
    firestoreSubscription,
    isSubscribed 
  } = useSubscriptionStore();
  const [view, setView] = useState<SubscriptionView>(SubscriptionView.STATUS);

  // Parse URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const checkoutSuccess = searchParams.get("checkout_success");
    const checkoutCanceled = searchParams.get("checkout_canceled");
    const portalReturn = searchParams.get("portal_return");

    if (checkoutSuccess) {
      toast.success("Subscription activated successfully!");
      // Remove the query parameters
      navigate("/subscription", { replace: true });
    } else if (checkoutCanceled) {
      toast.info("Checkout canceled");
      // Remove the query parameters
      navigate("/subscription", { replace: true });
    } else if (portalReturn) {
      toast.success("Payment settings updated");
      // Refresh subscription status to get the latest changes
      fetchSubscriptionStatus();
      // Remove the query parameters
      navigate("/subscription", { replace: true });
    }
  }, [location.search, navigate, fetchSubscriptionStatus]);

  // Fetch subscription status and connect to Firestore on mount
  useEffect(() => {
    if (user) {
      // First fetch initial status from API
      fetchSubscriptionStatus();
      
      // Then subscribe to real-time updates from Firestore
      subscribeToFirestore(user.uid);
      
      // Clean up Firestore subscription when component unmounts
      return () => {
        unsubscribeFromFirestore();
      };
    }
  }, [user, fetchSubscriptionStatus, subscribeToFirestore, unsubscribeFromFirestore]);
  
  // Log Firestore subscription updates for debugging
  useEffect(() => {
    if (firestoreSubscription) {
      console.log('Current Firestore subscription state:', firestoreSubscription);
    }
  }, [firestoreSubscription]);

  // Determine the default view based on subscription status
  useEffect(() => {
    if (status) {
      const hasSubscription = status.subscription && status.subscription.plan_id !== "free";
      setView(hasSubscription ? SubscriptionView.STATUS : SubscriptionView.PLANS);
    }
  }, [status]);

  // Handle navigation between views
  const handleUpgrade = () => {
    setView(SubscriptionView.PLANS);
  };

  const handleManage = () => {
    setView(SubscriptionView.MANAGE);
  };

  const handleBack = () => {
    setView(SubscriptionView.STATUS);
  };

  const handleChangePlan = () => {
    setView(SubscriptionView.PLANS);
  };

  return (
    <>
      <MainNavigation />
      <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/profile")} 
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Profile
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription</h1>
          <p className="text-muted-foreground">
            Manage your TheMoneyGate subscription and billing
          </p>
        </div>

        {isSubscribed() && view === SubscriptionView.STATUS && (
          <Button onClick={handleManage}>
            <CreditCard className="h-4 w-4 mr-2" /> Manage Subscription
          </Button>
        )}

        {!isSubscribed() && view === SubscriptionView.STATUS && (
          <Button onClick={handleUpgrade}>
            <Package className="h-4 w-4 mr-2" /> Upgrade Now
          </Button>
        )}
      </div>

      <Separator className="mb-8" />

      {view === SubscriptionView.STATUS && (
        <div className="grid grid-cols-1 gap-6">
          <SubscriptionStatus onManage={handleManage} onUpgrade={handleUpgrade} />
        </div>
      )}

      {view === SubscriptionView.PLANS && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Choose a Plan</h2>
            {isSubscribed() && (
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
          </div>
          <SubscriptionPlans />
        </div>
      )}

      {view === SubscriptionView.MANAGE && (
        <SubscriptionManagement onClose={handleBack} onChangePlan={handleChangePlan} />
      )}
      </div>
    </>
  );
};

export default Subscription;
