import React, { useState } from "react";
import { MainNavigation } from "components/MainNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "components/Card";
import { Check, X, CreditCard, Users, Zap } from "lucide-react";
import { Button } from "components/Button";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "app";
import { Toaster } from "components/Toast";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  cta: string;
  popular?: boolean;
}

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  
  const plans: PricingPlan[] = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      description: "Basic tools to get started with your first Hidden Money Door.",
      features: [
        { name: "Basic keyword research", included: true },
        { name: "Up to 3 AI-generated tools", included: true },
        { name: "Basic monetization guidance", included: true },
        { name: "Distribution checklist", included: true },
        { name: "Limited analytics", included: true },
        { name: "Advanced keyword insights", included: false },
        { name: "Unlimited tool generation", included: false },
        { name: "Advanced monetization strategies", included: false },
        { name: "Priority support", included: false }
      ],
      cta: "Get Started"
    },
    {
      id: "pro",
      name: "Pro",
      price: billingInterval === "monthly" ? "$29" : "$290",
      description: "Everything you need to build multiple profitable Hidden Money Doors.",
      features: [
        { name: "Advanced keyword research", included: true },
        { name: "Unlimited AI-generated tools", included: true },
        { name: "Advanced monetization guidance", included: true },
        { name: "Multi-channel distribution", included: true },
        { name: "Full analytics dashboard", included: true },
        { name: "Market opportunity detection", included: true },
        { name: "Custom tool embedding", included: true },
        { name: "Priority email support", included: true },
        { name: "1-on-1 strategy session", included: false }
      ],
      cta: "Upgrade to Pro",
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: billingInterval === "monthly" ? "$99" : "$990",
      description: "Advanced features for agencies and professional marketers.",
      features: [
        { name: "Enterprise keyword research", included: true },
        { name: "Unlimited AI-generated tools", included: true },
        { name: "Custom monetization strategies", included: true },
        { name: "Multi-channel distribution", included: true },
        { name: "Advanced analytics & reporting", included: true },
        { name: "White-label tools", included: true },
        { name: "API access", included: true },
        { name: "Team collaboration", included: true },
        { name: "Dedicated account manager", included: true }
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <>
      <Toaster />
      <MainNavigation />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">M</div>
              <h1 onClick={() => navigate('/')} className="text-xl font-bold cursor-pointer">TheMoneyGate</h1>
            </div>
            <nav>
              <ul className="flex space-x-6 items-center">
                <li><a href="/#how-it-works" className="text-zinc-600 hover:text-blue-600 transition-colors">How It Works</a></li>
                <li><a href="/features" className="text-zinc-600 hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="/pricing" className="text-blue-600 font-medium">Pricing</a></li>
                <li>
                  <Button 
                    variant="primary" 
                    onClick={() => user ? navigate('/dashboard') : navigate('/login')}
                  >
                    {user ? "Dashboard" : "Get Started"}
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="py-12">
          {/* Pricing Header */}
          <section className="container mx-auto px-4 max-w-6xl text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto mb-8">
              Choose the plan that's right for your business and start building profitable Hidden Money Doors today.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-zinc-100 p-1 rounded-lg mb-8">
              <button
                onClick={() => setBillingInterval("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingInterval === "monthly" ? "bg-white shadow-sm text-blue-600" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval("yearly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingInterval === "yearly" ? "bg-white shadow-sm text-blue-600" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Yearly <span className="text-xs text-green-600 ml-1">Save 15%</span>
              </button>
            </div>
          </section>

          {/* Pricing Plans */}
          <section className="container mx-auto px-4 max-w-6xl mb-16">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card key={plan.id} className={`relative ${plan.popular ? 'border-blue-400 shadow-lg' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                      MOST POPULAR
                    </div>
                  )}
                  <CardHeader className={`pb-2 ${plan.popular ? 'pt-10' : ''}`}>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {billingInterval === "monthly" ? (
                        <span className="text-zinc-500 ml-2">/month</span>
                      ) : (
                        <span className="text-zinc-500 ml-2">/year</span>
                      )}
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-zinc-300 mr-2 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={feature.included ? "" : "text-zinc-400"}>{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant={plan.popular ? "primary" : "outline"}  
                      className="w-full"
                      onClick={() => {
                        if (plan.id === "free") {
                          navigate('/login');
                        } else if (plan.id === "pro") {
                          navigate('/subscription');
                        } else {
                          navigate('/contact');
                        }
                      }}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-zinc-50 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">What are Hidden Money Doors?</h3>
                  <p className="text-zinc-600">
                    Hidden Money Doors are strategic opportunities where you can create low-competition content that connects to high-value monetization niches, allowing you to profit from the value gap.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Can I cancel my subscription at any time?</h3>
                  <p className="text-zinc-600">
                    Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-zinc-600">
                    We accept all major credit cards including Visa, Mastercard, American Express, and Discover. We also support payment through PayPal.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Do you offer refunds?</h3>
                  <p className="text-zinc-600">
                    We offer a 14-day money-back guarantee. If you're not satisfied with our service within the first 14 days, contact us for a full refund.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">How many tools can I create on the free plan?</h3>
                  <p className="text-zinc-600">
                    The free plan allows you to create up to 3 AI-generated tools. For unlimited tool creation, you'll need to upgrade to our Pro or Enterprise plan.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-blue-600 text-white">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Hidden Money Doors?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of entrepreneurs who are turning simple content into profitable income streams.
              </p>
              <Button 
                variant="default" 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-zinc-100"
                onClick={() => user ? navigate('/dashboard') : navigate('/login')}
              >
                {user ? "Go to Dashboard" : "Get Started Now"}
              </Button>
              <p className="mt-4 text-sm opacity-80">
                No credit card required for free plan. Start building your first money door in minutes.
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-zinc-900 text-zinc-400 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-8 md:mb-0">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">M</div>
                  <h1 className="text-xl font-bold text-white">TheMoneyGate</h1>
                </div>
                <p className="max-w-xs">Helping digital entrepreneurs discover profitable content opportunities through Hidden Money Doors.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-white font-semibold mb-4">Platform</h3>
                  <ul className="space-y-2">
                    <li><a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                    <li><a href="/features" className="hover:text-white transition-colors">Features</a></li>
                    <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Resources</h3>
                  <ul className="space-y-2">
                    <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                    <li><a href="/guides" className="hover:text-white transition-colors">Guides</a></li>
                    <li><a href="/support" className="hover:text-white transition-colors">Support</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Company</h3>
                  <ul className="space-y-2">
                    <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                    <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                    <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-sm">
              © {new Date().getFullYear()} TheMoneyGate. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
