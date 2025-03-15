import React from "react";
import { MainNavigation } from "components/MainNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "components/Card";
import { Check, Target, PieChart, Layers, Users, CreditCard, BarChart2, FileText, Search, Globe } from "lucide-react";
import { Button } from "components/Button";
import { useNavigate } from "react-router-dom";
import { Toaster } from "components/Toast";

export default function Features() {
  const navigate = useNavigate();

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
                <li><a href="/features" className="text-blue-600 font-medium">Features</a></li>
                <li><a href="/pricing" className="text-zinc-600 hover:text-blue-600 transition-colors">Pricing</a></li>
                <li>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/login')}
                  >
                    Get Started
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="py-12">
          {/* Hero Section */}
          <section className="container mx-auto px-4 max-w-6xl text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features to Discover <span className="text-blue-600">Hidden Money Doors</span></h1>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
              Everything you need to find, create, and monetize content that connects low-competition traffic with high-value markets.
            </p>
          </section>

          {/* Feature Categories */}
          <section className="container mx-auto px-4 max-w-6xl mb-16">
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="mr-2 h-5 w-5 text-blue-600" /> Discovery Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>AI-powered opportunity detection</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Keyword value gap analysis</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Niche market identification</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" /> Creation Suite
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>AI tool & template generator</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Embeddable calculators & trackers</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Professional content formatting</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-blue-600" /> Monetization Engine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Strategic affiliate linking</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>High-value traffic redirection</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Conversion optimization tools</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Detailed Features */}
          <section className="bg-zinc-50 py-16">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-3xl font-bold text-center mb-12">Complete Platform for Digital Entrepreneurs</h2>
              
              <div className="space-y-12">
                {/* Feature 1 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">
                      <Target className="h-4 w-4 mr-2" /> Discovery
                    </div>
                    <h3 className="text-2xl font-bold mb-4">AI-Powered Opportunity Detection</h3>
                    <p className="text-zinc-600 mb-6">
                      Automatically identify untapped markets where low-competition content can connect with high-value monetization opportunities.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Intelligent keyword pairing algorithms</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Competition vs. value analysis</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Trending opportunity alerts</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 h-64 flex items-center justify-center">
                      <Search className="h-24 w-24 text-blue-300" />
                    </div>
                  </div>
                </div>
                
                {/* Feature 2 */}
                <div className="grid md:grid-cols-2 gap-8 items-center md:order-2">
                  <div className="md:order-2">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium mb-4">
                      <FileText className="h-4 w-4 mr-2" /> Creation
                    </div>
                    <h3 className="text-2xl font-bold mb-4">AI Tool & Template Generator</h3>
                    <p className="text-zinc-600 mb-6">
                      Create professional tools, calculators, planners, and templates that attract your target audience with minimal effort.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>One-click tool generation</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Customizable templates & designs</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Embed code for websites & blogs</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md md:order-1">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-100 h-64 flex items-center justify-center">
                      <FileText className="h-24 w-24 text-green-300" />
                    </div>
                  </div>
                </div>
                
                {/* Feature 3 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-4">
                      <CreditCard className="h-4 w-4 mr-2" /> Monetization
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Strategic Monetization Engine</h3>
                    <p className="text-zinc-600 mb-6">
                      Maximize your revenue by intelligently connecting your content with the most profitable monetization opportunities.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Affiliate program recommendations</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Contextual monetization suggestions</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Revenue optimization analysis</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 h-64 flex items-center justify-center">
                      <CreditCard className="h-24 w-24 text-purple-300" />
                    </div>
                  </div>
                </div>
                
                {/* Feature 4 */}
                <div className="grid md:grid-cols-2 gap-8 items-center md:order-2">
                  <div className="md:order-2">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-sm font-medium mb-4">
                      <Globe className="h-4 w-4 mr-2" /> Distribution
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Multi-Channel Distribution</h3>
                    <p className="text-zinc-600 mb-6">
                      Share your tools and content across multiple platforms to maximize visibility and traffic generation.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Platform-specific formatting</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Distribution checklist & guides</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Audience targeting recommendations</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md md:order-1">
                    <div className="bg-amber-50 p-6 rounded-lg border border-amber-100 h-64 flex items-center justify-center">
                      <Globe className="h-24 w-24 text-amber-300" />
                    </div>
                  </div>
                </div>
                
                {/* Feature 5 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-100 text-cyan-600 text-sm font-medium mb-4">
                      <BarChart2 className="h-4 w-4 mr-2" /> Analytics
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Performance Analytics</h3>
                    <p className="text-zinc-600 mb-6">
                      Track, analyze, and optimize your Money Doors with comprehensive analytics and insights.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Traffic and engagement metrics</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Conversion rate optimization</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Revenue attribution tracking</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-100 h-64 flex items-center justify-center">
                      <BarChart2 className="h-24 w-24 text-cyan-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Creating Hidden Money Doors?</h2>
              <p className="text-xl text-zinc-600 mb-8">
                Join thousands of entrepreneurs who are building profitable online businesses with TheMoneyGate.
              </p>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/login')}
              >
                Get Started Now
              </Button>
              <p className="mt-4 text-sm text-zinc-500">
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
