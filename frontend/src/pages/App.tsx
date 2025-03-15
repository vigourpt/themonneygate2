import React, { useEffect, useState } from "react";
import { checkIsAdmin } from "utils/adminUtils";
import { Button } from "components/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "components/Card";
import { StepCard } from "components/StepCard";
import { MainNavigation } from "components/MainNavigation";
import { CreditCard, PieChart, FileText, Search, Target, Layers, BarChart2, ArrowRight, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "app";
import { useSubscriptionStore } from "utils/subscriptionStore";
import { toast } from "sonner";
import { Toaster } from "components/Toast";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useCurrentUser();
  const { fetchSubscriptionStatus } = useSubscriptionStore();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is admin
  useEffect(() => {
    if (user) {
      const checkAdmin = async () => {
        const adminStatus = await checkIsAdmin(user.uid);
        setIsAdmin(adminStatus);
      };
      
      checkAdmin();
    }
  }, [user]);
  
  // Check for subscription checkout callbacks
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const checkoutSuccess = searchParams.get("checkout_success");
    const checkoutCanceled = searchParams.get("checkout_canceled");

    if (checkoutSuccess) {
      toast.success("Subscription activated successfully!");
      // Remove the query parameters
      navigate("/", { replace: true });
      // Refresh subscription status
      if (user) {
        fetchSubscriptionStatus();
      }
    } else if (checkoutCanceled) {
      toast.info("Checkout canceled");
      // Remove the query parameters
      navigate("/", { replace: true });
    }
  }, [location.search, navigate, fetchSubscriptionStatus, user]);
  return (
    <>
      <Toaster />
      <MainNavigation />
      <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">M</div>
            <h1 className="text-xl font-bold">TheMoneyGate</h1>
          </div>
          <nav>
            <ul className="flex space-x-6 items-center">
              <li><a href="#how-it-works" className="text-zinc-600 hover:text-blue-600 transition-colors">How It Works</a></li>
              <li><a href="#benefits" className="text-zinc-600 hover:text-blue-600 transition-colors">Benefits</a></li>
              {!loading && (
                user ? (
                  <>
                    <li>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center"
                      >
                        Dashboard
                      </Button>
                    </li>
                    {isAdmin && (
                      <li>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate('/admin-dashboard')}
                          className="flex items-center"
                        >
                          Admin
                        </Button>
                      </li>
                    )}
                    <li>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/profile')}
                        className="flex items-center"
                      >
                        <User className="h-4 w-4 mr-2" /> Profile
                      </Button>
                    </li>
                    <li>
                      <Button 
                        variant="primary" 
                        onClick={() => navigate('/logout')}
                        className="flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Sign Out
                      </Button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Button 
                      variant="primary" 
                      onClick={() => navigate('/login')}
                    >
                      Sign Up
                    </Button>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Discover <span className="text-blue-600">Hidden Money Doors</span> for Digital Entrepreneurs
                </h1>
                <p className="text-xl text-zinc-600 mb-8">
                  Transform free content into profitable opportunities by redirecting low-cost traffic to high-value niches.
                </p>
                <div className="flex space-x-4">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => user ? navigate('/dashboard') : navigate('/login')}
                  >
                    {user ? "Go to Dashboard" : "Get Started Free"}
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-full h-full bg-blue-200 rounded-xl"></div>
                  <div className="relative bg-blue-600 text-white p-8 rounded-xl">
                    <h3 className="text-2xl font-bold mb-4">Hidden Money Door Example:</h3>
                    <div className="bg-blue-500 p-4 rounded-lg mb-6">
                      <span className="block mb-2 text-blue-100">Low-Competition Content:</span>
                      <span className="text-xl font-semibold block">"Savings Goal Tracker"</span>
                      <span className="text-sm text-blue-100 block mt-1">Cost Per Click: $0.30</span>
                    </div>
                    <div className="flex items-center justify-center my-4">
                      <ArrowRight className="text-blue-200" size={32} />
                    </div>
                    <div className="bg-green-600 p-4 rounded-lg">
                      <span className="block mb-2 text-green-100">High-Value Niche:</span>
                      <span className="text-xl font-semibold block">"Wealth Management"</span>
                      <span className="text-sm text-green-100 block mt-1">Cost Per Click: $15+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What are Hidden Money Doors */}
        <section className="py-16 bg-zinc-50">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What are Hidden Money Doors?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-blue-600" /> Untapped Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Hidden Money Doors are strategic pathways where low-competition content attracts traffic that can be monetized through high-value niches.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5 text-blue-600" /> Traffic Arbitrage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    By creating free or low-cost tools, you attract users interested in specific topics, then redirect them to related high-value offers.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-blue-600" /> Passive Income Engines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Once set up, these pathways can generate consistent income without requiring constant maintenance or high advertising costs.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why It's Valuable */}
        <section id="benefits" className="py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Why Hidden Money Doors are Valuable</h2>
            <p className="text-center text-zinc-600 max-w-3xl mx-auto mb-12">
              Smart entrepreneurs leverage these opportunities to build sustainable online businesses with minimal investment.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex">
                <div className="mr-4 p-2 bg-blue-100 rounded-lg h-fit">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lower Competition</h3>
                  <p className="text-zinc-600">
                    Target keywords and niches with less competition but still relevant to profitable markets.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 p-2 bg-blue-100 rounded-lg h-fit">
                  <PieChart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Higher ROI</h3>
                  <p className="text-zinc-600">
                    Invest less in content creation and advertising while earning from high-value affiliate programs and offers.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 p-2 bg-blue-100 rounded-lg h-fit">
                  <Layers className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Scalable Business Model</h3>
                  <p className="text-zinc-600">
                    Easily replicate the process across different niches and tools to build multiple income streams.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 p-2 bg-blue-100 rounded-lg h-fit">
                  <BarChart2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Data-Driven Decisions</h3>
                  <p className="text-zinc-600">
                    Use analytics to continually refine your approach and maximize monetization opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How TheMoneyGate Helps */}
        <section id="how-it-works" className="py-16 bg-zinc-50">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-center mb-4">How TheMoneyGate Helps You</h2>
            <p className="text-center text-zinc-600 max-w-3xl mx-auto mb-12">
              Our platform guides you through the complete process of finding, creating, and monetizing Hidden Money Doors.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StepCard 
                number={1} 
                title="Discover Concepts" 
                description="Understand the fundamental principles of Hidden Money Doors and how they create profitable opportunities." 
                icon={<PieChart className="h-6 w-6" />}
              />
              <StepCard 
                number={2} 
                title="Generate Tool Ideas" 
                description="Use our AI to brainstorm tool and template ideas that can attract free traffic in your chosen niche." 
                icon={<Layers className="h-6 w-6" />}
              />
              <StepCard 
                number={3} 
                title="Analyze Keywords" 
                description="Identify high-value advertising niches related to your content using our keyword analysis tools." 
                icon={<Search className="h-6 w-6" />}
              />
              <StepCard 
                number={4} 
                title="Create Tools" 
                description="Build professional tools and templates with our AI-powered content generator and formatting tools." 
                icon={<FileText className="h-6 w-6" />}
              />
              <StepCard 
                number={5} 
                title="Integrate Monetization" 
                description="Seamlessly add affiliate links and ads to maximize your revenue from each tool or template." 
                icon={<CreditCard className="h-6 w-6" />}
              />
              <StepCard 
                number={6} 
                title="Analyze & Optimize" 
                description="Track performance metrics and optimize your strategy to increase traffic and conversion rates." 
                icon={<BarChart2 className="h-6 w-6" />}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto max-w-4xl px-4 text-center">
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
              No credit card required. Start building your first money door in minutes.
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
                  <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
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
