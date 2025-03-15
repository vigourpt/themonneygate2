import React from "react";
import { useSubscriptionStore } from "utils/subscriptionStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Calendar, AlertTriangle } from "lucide-react";
import { PLAN_FREE } from "utils/subscriptionStore";

export interface Props {
  onManage?: () => void;
  onUpgrade?: () => void;
}

export const SubscriptionStatus: React.FC<Props> = ({ onManage, onUpgrade }) => {
  const {
    status,
    isLoading,
    isSubscribed,
    isOnFreePlan,
    isOnTrial,
    getActivePlan,
    getRemainingTrialDays,
    getFormattedExpiryDate,
  } = useSubscriptionStore();

  if (isLoading || !status) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 pb-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span>Loading subscription details...</span>
        </CardContent>
      </Card>
    );
  }

  const activePlan = getActivePlan();
  const subscription = status.subscription;
  const daysLeft = getRemainingTrialDays();
  const expiryDate = getFormattedExpiryDate();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Subscription Status</span>
          {isOnTrial() && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Trial
            </Badge>
          )}
          {isSubscribed() && subscription?.cancel_at_period_end && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Canceling
            </Badge>
          )}
          {isSubscribed() && !subscription?.cancel_at_period_end && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Active
            </Badge>
          )}
          {isOnFreePlan() && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Free
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {isOnFreePlan()
            ? "You are currently on the free plan with limited features."
            : `You are subscribed to the ${activePlan?.name} plan.`}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {activePlan && (
            <div className="flex items-start">
              <CreditCard className="h-5 w-5 mr-2 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{activePlan.name}</p>
                <p className="text-muted-foreground text-sm">
                  {activePlan.id === PLAN_FREE
                    ? "Free access with limited features"
                    : `$${activePlan.price_per_month.toFixed(2)}/month`}
                </p>
              </div>
            </div>
          )}
          
          {subscription && (
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-2 text-primary mt-0.5" />
              <div>
                <p className="font-medium">
                  {subscription.cancel_at_period_end
                    ? "Access until"
                    : isOnTrial()
                    ? "Trial ends on"
                    : "Renews on"}
                </p>
                <p className="text-muted-foreground text-sm">{expiryDate}</p>
              </div>
            </div>
          )}
          
          {isOnTrial() && daysLeft > 0 && (
            <div className="flex items-start mt-4">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">Trial Period</p>
                <p className="text-muted-foreground text-sm">
                  {daysLeft} {daysLeft === 1 ? "day" : "days"} remaining in your trial
                </p>
              </div>
            </div>
          )}
          
          {subscription?.payment_method && (
            <div className="flex items-start">
              <CreditCard className="h-5 w-5 mr-2 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Payment Method</p>
                <p className="text-muted-foreground text-sm">
                  {subscription.payment_method.brand.toUpperCase()} ending in{" "}
                  {subscription.payment_method.last4}
                </p>
              </div>
            </div>
          )}
          
          {subscription?.cancel_at_period_end && (
            <div className="bg-amber-50 p-4 rounded-md mt-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Subscription Canceling</p>
                  <p className="text-amber-700 text-sm">
                    Your subscription will end on {expiryDate}. You'll still have access until then.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {isOnFreePlan() ? (
          <Button onClick={onUpgrade} className="w-full">
            Upgrade Now
          </Button>
        ) : (
          <Button onClick={onManage} variant="outline" className="w-full">
            Manage Subscription
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
