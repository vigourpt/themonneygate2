import React from "react";
import { MainNavigation } from "components/MainNavigation";
import { Users, Target, Award, BarChart, Heart, Globe } from "lucide-react";
import { Button } from "components/Button";
import { useNavigate } from "react-router-dom";
import { Toaster } from "components/Toast";

export default function About() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      bio: "Entrepreneur and marketing strategist with 10+ years of experience in digital marketing and content monetization."
    },
    {
      name: "Sarah Chen",
      role: "CMO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
      bio: "Former marketing executive with a passion for helping entrepreneurs discover untapped monetization opportunities."
    },
    {
      name: "Michael Peters",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      bio: "Tech expert with a background in AI and data analysis, focused on building tools that provide actionable insights."
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About TheMoneyGate</h1>
              <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
                We help digital entrepreneurs discover and monetize Hidden Money Doors – opportunities where low-competition content connects with high-value markets.
              </p>
            </div>
            
            <div className="relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-blue-600 opacity-10"></div>
              <div className="relative bg-gradient-to-r from-blue-600/80 to-blue-600/60 p-12 md:p-16 text-white">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                  <p className="text-xl mb-6">
                    To democratize online monetization by helping entrepreneurs identify and capitalize on untapped opportunities in the digital landscape.
                  </p>
                  <p className="text-xl">
                    We believe that with the right tools and knowledge, anyone can build profitable online income streams without massive budgets or technical expertise.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="container mx-auto px-4 max-w-6xl mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">
                  Our Story
                </div>
                <h2 className="text-3xl font-bold mb-6">From Discovery to Platform</h2>
                <p className="text-lg text-zinc-600 mb-4">
                  TheMoneyGate started when our founder, Alex, discovered a pattern while helping small businesses with their digital marketing: there were consistently overlooked opportunities where low-competition content could be connected to high-value monetization channels.
                </p>
                <p className="text-lg text-zinc-600 mb-4">
                  What began as a spreadsheet tracking these "Money Doors" evolved into a methodology, then a consulting service, and finally the comprehensive platform you see today.
                </p>
                <p className="text-lg text-zinc-600">
                  Since our launch in 2024, we've helped thousands of entrepreneurs discover and monetize their own Hidden Money Doors, generating millions in collective revenue.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="TheMoneyGate team" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section className="bg-zinc-50 py-16 mb-16">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
                  These principles guide everything we do at TheMoneyGate and shape how we build our platform.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Strategic Opportunity</h3>
                  <p className="text-zinc-600">
                    We believe in working smarter, not harder, by identifying and capitalizing on strategic opportunities rather than competing in oversaturated spaces.
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Value Creation</h3>
                  <p className="text-zinc-600">
                    We're committed to ensuring our users create genuine value through their content and tools, creating win-win scenarios for both creators and their audiences.
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mb-4">
                    <BarChart className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Data-Driven Decisions</h3>
                  <p className="text-zinc-600">
                    We rely on concrete data and proven methodologies rather than guesswork, ensuring our users can make informed decisions with confidence.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="container mx-auto px-4 max-w-6xl mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
                The passionate people behind TheMoneyGate who are dedicated to helping entrepreneurs succeed.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="h-48 w-48 mx-auto rounded-full overflow-hidden mb-4">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <p className="text-zinc-600">{member.bio}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-blue-600 text-white py-16">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">10,000+</div>
                  <p className="text-xl">Users</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">50,000+</div>
                  <p className="text-xl">Money Doors Discovered</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">$5M+</div>
                  <p className="text-xl">User Revenue Generated</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">25+</div>
                  <p className="text-xl">Countries Served</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <h2 className="text-3xl font-bold mb-4">Join Us on Our Mission</h2>
              <p className="text-xl text-zinc-600 mb-8">
                Discover your own Hidden Money Doors and become part of our growing community of entrepreneurs.
              </p>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/login')}
              >
                Get Started Now
              </Button>
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