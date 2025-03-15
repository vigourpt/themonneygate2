import React from "react";
import { MainNavigation } from "components/MainNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "components/Card";
import { MessageSquare, Mail, FileText, HelpCircle, Book, ExternalLink } from "lucide-react";
import { Button } from "components/Button";
import { useNavigate } from "react-router-dom";
import { Toaster } from "components/Toast";

export default function Support() {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "What are Hidden Money Doors?",
      answer: "Hidden Money Doors are strategic opportunities where you can create low-competition content that connects to high-value monetization niches, allowing you to profit from the value gap between traffic cost and monetization potential."
    },
    {
      question: "How does TheMoneyGate help me find these opportunities?",
      answer: "Our platform uses advanced algorithms to identify keyword pairs where the content creation side has low competition (easy to rank for) but the monetization side has high value (expensive PPC, valuable affiliate programs, etc.)."
    },
    {
      question: "What kind of tools can I create with TheMoneyGate?",
      answer: "You can create a wide variety of tools including calculators, trackers, planners, templates, checklists, and more. Our AI-powered tool generator helps you create these assets quickly and professionally."
    },
    {
      question: "How do I monetize these tools once I've created them?",
      answer: "Our platform provides strategic monetization guidance, including affiliate program recommendations, advertising suggestions, and conversion optimization tips tailored to your specific tool and target audience."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 14-day money-back guarantee. If you're not satisfied with our service within the first 14 days, contact us for a full refund."
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
          {/* Hero Section */}
          <section className="container mx-auto px-4 max-w-6xl mb-16">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">How Can We Help You?</h1>
              <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
                Find answers to common questions or get in touch with our support team for personalized assistance.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-8 mb-12">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Search for answers</h2>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search for help articles, tutorials, or FAQs..." 
                    className="w-full px-4 py-3 pl-12 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <Button 
                    variant="primary" 
                    className="absolute right-1 top-1 py-2"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="mr-2 h-5 w-5 text-blue-600" /> Knowledge Base
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 mb-4">Browse our comprehensive help articles, guides, and tutorials.</p>
                  <div className="flex items-center text-sm font-medium text-blue-600">
                    Explore Knowledge Base <ExternalLink className="h-3 w-3 ml-1" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-blue-600" /> Live Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 mb-4">Chat with our support team for immediate assistance with your questions.</p>
                  <div className="flex items-center text-sm font-medium text-blue-600">
                    Start Chat <ExternalLink className="h-3 w-3 ml-1" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-blue-600" /> Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
                  <div className="flex items-center text-sm font-medium text-blue-600">
                    Email Us <ExternalLink className="h-3 w-3 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-zinc-50 py-16 mb-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                    <p className="text-zinc-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <p className="text-zinc-600 mb-4">Don't see your question here?</p>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/contact')}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="container mx-auto px-4 max-w-3xl mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-zinc-600">
                Have a specific question or need personalized help? Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <form>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    rows={6} 
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <Button variant="primary" className="w-full">Send Message</Button>
              </form>
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