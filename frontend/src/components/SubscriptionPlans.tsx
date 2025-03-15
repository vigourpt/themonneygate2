import React from "react";
import { useSubscriptionStore, SubscriptionPlan } from "utils/subscriptionStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";

export interface Props {
  onPlanSelected?: (planId: string) => void;
  showFree?: boolean;
}

export const SubscriptionPlans: React.FC<Props> = ({
  onPlanSelected,
  showFree = true,
}) => {
  const { status, isLoading, createCheckoutSession, isSubscribed, getActivePlan } =
    useSubscriptionStore();

  const handleSelectPlan = async (planId: string) => {
    if (onPlanSelected) {
      onPlanSelected(planId);
    } else {
      await createCheckoutSession(planId);
    }
  };

  if (isLoading || !status) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading plans...</span>
      </div>
    );
  }

  const currentPlan = getActivePlan();
  const plans = showFree
    ? status.available_plans
    : status.available_plans.filter((plan) => plan.id !== "free");

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isActive={currentPlan?.id === plan.id}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>
    </div>
  );
};

interface PlanCardProps {
  plan: SubscriptionPlan;
  isActive: boolean;
  onSelect: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isActive, onSelect }) => {
  return (
    <Card className={`flex flex-col p-6 ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
        <p className="text-muted-foreground mb-4">{plan.description}</p>

        {plan.price_per_month > 0 ? (
          <div className="mb-6">
            <span className="text-3xl font-bold">
              ${plan.price_per_month.toFixed(2)}
            </span>
            <span className="text-muted-foreground ml-1">/month</span>
            
            {plan.is_annual && plan.discount_percentage && (
              <div className="mt-1 text-sm text-green-600 font-medium">
                Save {plan.discount_percentage}% with annual billing
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6">
            <span className="text-3xl font-bold">Free</span>
            <span className="text-muted-foreground ml-1">forever</span>
          </div>
        )}

        <div className="space-y-2 mb-6">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={() => onSelect(plan.id)}
        variant={isActive ? "outline" : "default"}
        className="w-full mt-auto"
        disabled={isActive}
      >
        {isActive ? "Current Plan" : "Select Plan"}
      </Button>
    </Card>
  );
};
