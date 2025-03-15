import React from "react";
import { MainNavigation } from "components/MainNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "components/Card";
import { ArrowRight, FileText, Globe, Search, CreditCard, BarChart2 } from "lucide-react";
import { Button } from "components/Button";
import { useNavigate } from "react-router-dom";
import { Toaster } from "components/Toast";

interface Guide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  color: string;
}

export default function Guides() {
  const navigate = useNavigate();

  const guides: Guide[] = [
    {
      id: "1",
      title: "Finding Hidden Money Doors: Complete Guide",
      description: "A comprehensive guide to identifying valuable keyword opportunities with low competition but high monetization potential.",
      icon: <Search className="h-12 w-12" />,
      category: "Getting Started",
      color: "blue"
    },
    {
      id: "2",
      title: "Creating Effective Money-Generating Tools",
      description: "Learn how to create high-converting tools, calculators, and templates that attract your target audience.",
      icon: <FileText className="h-12 w-12" />,
      category: "Creation",
      color: "green"
    },
    {
      id: "3",
      title: "Strategic Distribution for Maximum Visibility",
      description: "Maximize visibility and traffic by sharing your content across the right platforms to reach your target audience.",
      icon: <Globe className="h-12 w-12" />,
      category: "Distribution",
      color: "amber"
    },
    {
      id: "4",
      title: "Profitable Monetization Strategies",
      description: "Turn your traffic into revenue with effective monetization techniques including affiliate marketing, ads, and more.",
      icon: <CreditCard className="h-12 w-12" />,
      category: "Monetization",
      color: "purple"
    },
    {
      id: "5",
      title: "Tracking and Optimizing Performance",
      description: "Use analytics to understand what's working, what's not, and how to improve your results over time.",
      icon: <BarChart2 className="h-12 w-12" />,
      category: "Analytics",
      color: "cyan"
    },
    {
      id: "6",
      title: "The 30-Day Money Door Challenge",
      description: "Follow this step-by-step guide to identify, create, distribute, and monetize your first Money Door in 30 days.",
      icon: <FileText className="h-12 w-12" />,
      category: "Challenge",
      color: "red"
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
          {/* Guides Header */}
          <section className="container mx-auto px-4 max-w-6xl mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Money Doors Guides & Resources</h1>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
              Comprehensive guides to help you master every aspect of creating and monetizing Hidden Money Doors.
            </p>
          </section>

          {/* Featured Guide */}
          <section className="container mx-auto px-4 max-w-6xl mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg overflow-hidden shadow-lg text-white">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4 w-fit">
                    Ultimate Guide
                  </div>
                  <h2 className="text-3xl font-bold mb-4">The Complete Money Doors Blueprint</h2>
                  <p className="text-white/90 mb-6">
                    Our most comprehensive guide covering the entire process from finding opportunities to scaling your income. Packed with real examples, case studies, and actionable tactics.
                  </p>
                  <Button 
                    variant="default" 
                    className="w-fit bg-white text-blue-600 hover:bg-blue-50"
                    onClick={() => navigate('/guide/blueprint')}
                  >
                    Download Free Guide <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="bg-blue-800/30 p-12 flex items-center justify-center">
                  <FileText className="h-48 w-48 text-white/30" />
                </div>
              </div>
            </div>
          </section>

          {/* Guides Grid */}
          <section className="container mx-auto px-4 max-w-6xl mb-16">
            <h2 className="text-2xl font-bold mb-8">Browse by Topic</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <Card 
                  key={guide.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col h-full" 
                  onClick={() => navigate(`/guide/${guide.id}`)}
                >
                  <CardHeader className={`pb-2 bg-${guide.color}-50 border-b border-${guide.color}-100`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full bg-${guide.color}-100 text-${guide.color}-600 text-xs font-medium mb-2 w-fit`}>
                          {guide.category}
                        </div>
                        <CardTitle className="line-clamp-2">{guide.title}</CardTitle>
                      </div>
                      <div className={`text-${guide.color}-300`}>
                        {guide.icon}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow py-4">
                    <CardDescription className="line-clamp-3">{guide.description}</CardDescription>
                    <div className="flex items-center mt-4 text-sm font-medium text-blue-600">
                      Read Guide <ArrowRight className="h-3 w-3 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Video Tutorials */}
          <section className="bg-zinc-50 py-16">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-3xl font-bold text-center mb-8">Video Tutorials</h2>
              <p className="text-center text-zinc-600 max-w-3xl mx-auto mb-12">
                Learn by watching our step-by-step video tutorials that walk you through the entire process.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="aspect-video bg-zinc-200 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-blue-600/90 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-1">{[
                        "How to Research Profitable Money Doors",
                        "Creating Tools That Convert Visitors",
                        "Maximizing Revenue with Strategic Monetization"
                      ][index - 1]}</h3>
                      <p className="text-sm text-zinc-600">{[
                        "Learn how to find untapped opportunities using our keyword research method.",
                        "Step-by-step guide to creating tools that attract and convert visitors.",
                        "Techniques to maximize the revenue potential of your Money Doors."
                      ][index - 1]}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/video-tutorials')}
                >
                  View All Video Tutorials
                </Button>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Money Doors Journey?</h2>
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