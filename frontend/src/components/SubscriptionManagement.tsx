import React, { useState } from "react";
import { useSubscriptionStore } from "utils/subscriptionStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";

export interface Props {
  onClose: () => void;
  onChangePlan: () => void;
}

export const SubscriptionManagement: React.FC<Props> = ({
  onClose,
  onChangePlan,
}) => {
  const { status, isLoading, cancelSubscription, reactivateSubscription, createCustomerPortalSession } = useSubscriptionStore();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  const handleUpdatePaymentMethod = async () => {
    try {
      setConfirmLoading(true);
      // Set the return URL to come back to the subscription page
      const returnUrl = `${window.location.origin}${window.location.pathname}?portal_return=true`;
      await createCustomerPortalSession(returnUrl);
    } catch (error) {
      console.error("Error accessing payment settings:", error);
      toast.error("Failed to access payment settings");
      setConfirmLoading(false);
    }
  };

  if (isLoading || !status || !status.subscription) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span>Loading subscription details...</span>
        </CardContent>
      </Card>
    );
  }

  const subscription = status.subscription;
  const isCanceling = subscription.cancel_at_period_end;

  const handleCancelSubscription = async () => {
    if (!subscription.subscription_id) {
      toast.error("No subscription ID found");
      return;
    }

    try {
      setConfirmLoading(true);
      await cancelSubscription(subscription.subscription_id);
      setCancelDialogOpen(false);
      toast.success("Your subscription has been canceled");
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription.subscription_id) {
      toast.error("No subscription ID found");
      return;
    }

    try {
      setConfirmLoading(true);
      await reactivateSubscription(subscription.subscription_id);
      toast.success("Your subscription has been reactivated");
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      toast.error("Failed to reactivate subscription");
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Subscription</CardTitle>
        <CardDescription>
          Update or cancel your subscription
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Payment Method</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {subscription.payment_method ? (
                <span>
                  {subscription.payment_method.brand.toUpperCase()} ending in{" "}
                  {subscription.payment_method.last4} ({subscription.payment_method.exp_month}/
                  {subscription.payment_method.exp_year})
                </span>
              ) : (
                <span>No payment method on file</span>
              )}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={handleUpdatePaymentMethod}
              disabled={confirmLoading}
            >
              {confirmLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                </>
              ) : (
                <>Update Payment Method</>
              )}
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Billing Cycle</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your current billing cycle{" "}
              {isCanceling
                ? "ends"
                : "renews"}{" "}
              on{" "}
              {new Date(subscription.current_period_end).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Change Plan</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Upgrade or downgrade your subscription plan
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={onChangePlan}
            >
              Change Plan
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Cancel Subscription</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isCanceling
                ? "Your subscription is set to cancel at the end of the billing period. You can reactivate it anytime before then."
                : "You can cancel your subscription anytime. You'll still have access until the end of your billing period."}
            </p>
            {isCanceling ? (
              <Button
                variant="outline"
                size="sm"
                className="mt-2 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                onClick={handleReactivateSubscription}
                disabled={confirmLoading}
              >
                {confirmLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reactivating...
                  </>
                ) : (
                  <>Reactivate Subscription</>
                )}
              </Button>
            ) : (
              <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                  >
                    Cancel Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel your subscription? You'll still have access until the end of your current billing period.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="flex items-start bg-amber-50 p-4 rounded-md">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">You'll lose access to:</p>
                        <ul className="text-amber-700 text-sm list-disc list-inside mt-1">
                          <li>Create unlimited tools</li>
                          <li>Advanced monetization strategies</li>
                          <li>Premium keyword analysis</li>
                          <li>And other premium features</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setCancelDialogOpen(false)}
                    >
                      Keep Subscription
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleCancelSubscription}
                      disabled={confirmLoading}
                    >
                      {confirmLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Canceling...
                        </>
                      ) : (
                        <>Confirm Cancellation</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};
