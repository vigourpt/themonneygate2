import React from "react";
import { MainNavigation } from "components/MainNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "components/Card";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "components/Button";
import { useNavigate } from "react-router-dom";
import { Toaster } from "components/Toast";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  image: string;
}

export default function Blog() {
  const navigate = useNavigate();

  const featuredPost: BlogPost = {
    id: "1",
    title: "How I Built a $5,000/Month Passive Income Stream with Hidden Money Doors",
    description: "Discover how I identified a low-competition keyword with high-value monetization potential and built a simple tool that generates consistent passive income.",
    author: "Sarah Johnson",
    date: "March 2, 2025",
    category: "Case Study",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
  };

  const blogPosts: BlogPost[] = [
    {
      id: "2",
      title: "5 Hidden Money Doors You Can Open Today",
      description: "A guide to finding and monetizing untapped opportunities in the digital landscape.",
      author: "Michael Chen",
      date: "February 23, 2025",
      category: "Strategy",
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: "3",
      title: "The Ultimate Guide to Keyword Value Gap Analysis",
      description: "Learn how to identify keywords with high monetization potential but low competition.",
      author: "Emma Wilson",
      date: "February 15, 2025",
      category: "Keywords",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: "4",
      title: "How to Create High-Converting Financial Tools with AI",
      description: "A step-by-step guide to generating valuable tools that attract and convert visitors.",
      author: "David Park",
      date: "February 8, 2025",
      category: "Tools",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: "5",
      title: "Multi-Channel Distribution: Get More Eyes on Your Money Doors",
      description: "Strategies for maximizing visibility and traffic to your tools and content.",
      author: "Jessica Taylor",
      date: "January 30, 2025",
      category: "Distribution",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
    },
    {
      id: "6",
      title: "Monetization Strategies That Actually Work in 2025",
      description: "Up-to-date techniques for turning traffic into revenue in today's digital landscape.",
      author: "Robert Chen",
      date: "January 22, 2025",
      category: "Monetization",
      image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
          {/* Blog Header */}
          <section className="container mx-auto px-4 max-w-6xl mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Money Doors Blog</h1>
            <p className="text-xl text-zinc-600 max-w-3xl">
              Insights, strategies, and success stories to help you discover and monetize Hidden Money Doors.
            </p>
          </section>

          {/* Featured Post */}
          <section className="container mx-auto px-4 max-w-6xl mb-16">
            <div className="rounded-lg overflow-hidden shadow-lg bg-white">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="overflow-hidden h-full">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4 w-fit">
                    {featuredPost.category}
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="text-zinc-600 mb-6">{featuredPost.description}</p>
                  <div className="flex items-center text-sm text-zinc-500 mb-6">
                    <div className="flex items-center mr-4">
                      <User className="h-4 w-4 mr-1" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{featuredPost.date}</span>
                    </div>
                  </div>
                  <Button 
                    variant="default" 
                    className="w-fit"
                    onClick={() => navigate(`/blog/${featuredPost.id}`)}
                  >
                    Read More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Blog Posts Grid */}
          <section className="container mx-auto px-4 max-w-6xl mb-16">
            <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/blog/${post.id}`)}>
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium mb-2 w-fit">
                      {post.category}
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="line-clamp-3 mb-4">{post.description}</CardDescription>
                    <div className="flex items-center text-xs text-zinc-500 mt-auto">
                      <div className="flex items-center mr-4">
                        <User className="h-3 w-3 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Newsletter Sign-up */}
          <section className="bg-blue-50 py-16">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
              <p className="text-lg text-zinc-600 mb-8">
                Get the latest strategies and tips for discovering Hidden Money Doors delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button variant="primary">Subscribe</Button>
              </div>
              <p className="mt-4 text-sm text-zinc-500">
                We respect your privacy. Unsubscribe at any time.
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