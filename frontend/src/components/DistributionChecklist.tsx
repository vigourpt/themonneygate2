import React, { useState } from "react";
import { Button } from "components/Button";
import { Card, CardContent } from "components/Card";
import { Globe, Share2, Check, RefreshCw, ArrowUpRight, Linkedin, Twitter, MessageCircle, Youtube, Mail, Bookmark, CheckSquare } from "lucide-react";

type PlatformCategory = "website" | "social" | "community" | "email";

interface DistributionPlatform {
  id: string;
  name: string;
  category: PlatformCategory;
  icon: React.ReactNode;
  difficulty: number; // 1-5
  trafficPotential: number; // 1-5
  timeInvestment: string;
  bestPractices: string[];
  isSetup: boolean;
}

export function DistributionChecklist() {
  const [platforms, setPlatforms] = useState<DistributionPlatform[]>([
    {
      id: "personal-website",
      name: "Personal Website",
      category: "website",
      icon: <Globe className="h-5 w-5" />,
      difficulty: 3,
      trafficPotential: 4,
      timeInvestment: "3-5 hours initial setup, 1-2 hours weekly maintenance",
      bestPractices: [
        "Create dedicated landing pages for each tool",
        "Optimize page for SEO with relevant keywords",
        "Include clear calls-to-action near your tools",
        "Add Google Analytics to track visitor behavior"
      ],
      isSetup: false
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      category: "social",
      icon: <Linkedin className="h-5 w-5" />,
      difficulty: 2,
      trafficPotential: 4,
      timeInvestment: "30 minutes setup, 2-3 hours weekly content",
      bestPractices: [
        "Create posts highlighting the problem your tool solves",
        "Join finance-related groups and share your tools",
        "Create carousel posts explaining financial concepts",
        "Connect with financial advisors who might share your tools"
      ],
      isSetup: false
    },
    {
      id: "twitter",
      name: "Twitter/X",
      category: "social",
      icon: <Twitter className="h-5 w-5" />,
      difficulty: 1,
      trafficPotential: 3,
      timeInvestment: "15 minutes setup, 15-30 minutes daily engagement",
      bestPractices: [
        "Create threads about personal finance topics",
        "Share quick financial tips with links to your tools",
        "Follow and engage with personal finance influencers",
        "Use relevant hashtags like #personalfinance #financialplanning"
      ],
      isSetup: false
    },
    {
      id: "reddit",
      name: "Reddit",
      category: "community",
      icon: <MessageCircle className="h-5 w-5" />,
      difficulty: 2,
      trafficPotential: 5,
      timeInvestment: "15 minutes setup, 1-2 hours weekly engagement",
      bestPractices: [
        "Share your tools in r/personalfinance and similar subreddits",
        "Create value-focused posts, not promotional content",
        "Respond to questions with helpful advice",
        "Read subreddit rules carefully before posting"
      ],
      isSetup: false
    },
    {
      id: "youtube",
      name: "YouTube",
      category: "social",
      icon: <Youtube className="h-5 w-5" />,
      difficulty: 4,
      trafficPotential: 5,
      timeInvestment: "2-3 hours per video, weekly or bi-weekly publishing",
      bestPractices: [
        "Create tutorials showing how to use your tools",
        "Share financial advice with your tools as the solution",
        "Optimize video titles and descriptions for SEO",
        "Include links to your tools in video descriptions"
      ],
      isSetup: false
    },
    {
      id: "email-list",
      name: "Email Newsletter",
      category: "email",
      icon: <Mail className="h-5 w-5" />,
      difficulty: 3,
      trafficPotential: 4,
      timeInvestment: "2-3 hours setup, 1-2 hours per newsletter",
      bestPractices: [
        "Offer a free financial worksheet to build your email list",
        "Send regular newsletters with financial tips",
        "Include links to your tools in every email",
        "Segment your list based on financial interests"
      ],
      isSetup: false
    },
  ]);
  
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [setupInProgress, setSetupInProgress] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  
  const toggleSetupStatus = (platformId: string) => {
    setPlatforms(platforms.map(platform => 
      platform.id === platformId 
        ? { ...platform, isSetup: !platform.isSetup } 
        : platform
    ));
  };
  
  const startSetup = (platformId: string) => {
    setSelectedPlatform(platformId);
    setSetupInProgress(true);
    
    // Simulate setup process
    setTimeout(() => {
      setSetupInProgress(false);
      toggleSetupStatus(platformId);
    }, 2000);
  };
  
  const getCategoryName = (category: PlatformCategory) => {
    switch(category) {
      case "website": return "Websites";
      case "social": return "Social Media";
      case "community": return "Communities";
      case "email": return "Email Marketing";
      default: return "Other";
    }
  };
  
  const getDifficultyLabel = (level: number) => {
    switch(level) {
      case 1: return "Very Easy";
      case 2: return "Easy";
      case 3: return "Moderate";
      case 4: return "Challenging";
      case 5: return "Advanced";
      default: return "Unknown";
    }
  };
  
  const getTrafficLabel = (level: number) => {
    switch(level) {
      case 1: return "Low";
      case 2: return "Moderate";
      case 3: return "Good";
      case 4: return "High";
      case 5: return "Excellent";
      default: return "Unknown";
    }
  };
  
  const getRatingColor = (value: number, isTraffic = false) => {
    if (isTraffic) {
      // For traffic, higher is better
      if (value >= 4) return "text-green-600";
      if (value >= 3) return "text-yellow-600";
      return "text-red-500";
    } else {
      // For difficulty, lower is better
      if (value <= 2) return "text-green-600";
      if (value <= 3) return "text-yellow-600";
      return "text-red-500";
    }
  };
  
  const renderRatingBadge = (value: number, isTraffic = false) => {
    const color = getRatingColor(value, isTraffic);
    const label = isTraffic ? getTrafficLabel(value) : getDifficultyLabel(value);
    const bgColor = color.replace('text-', 'bg-').replace('-600', '-100').replace('-500', '-100');
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${color} ${bgColor}`}>
        {label}
      </span>
    );
  };
  
  const platformsByCategory = platforms.reduce((acc, platform) => {
    if (!acc[platform.category]) {
      acc[platform.category] = [];
    }
    acc[platform.category].push(platform);
    return acc;
  }, {} as Record<PlatformCategory, DistributionPlatform[]>);
  
  const platformGuides = {
    "personal-website": [
      { id: "domain", title: "Selecting a Domain and Hosting" },
      { id: "wordpress", title: "Setting up WordPress" },
      { id: "landing-page", title: "Creating Tool Landing Pages" },
      { id: "analytics", title: "Setting up Google Analytics" },
    ],
    "linkedin": [
      { id: "profile", title: "Optimizing Your Profile" },
      { id: "content", title: "Content Strategy for Financial Tools" },
      { id: "groups", title: "Finding and Joining Finance Groups" },
    ],
    "reddit": [
      { id: "subreddits", title: "Top Finance Subreddits" },
      { id: "posting", title: "Effective Posting Strategy" },
      { id: "engagement", title: "Community Engagement Techniques" },
    ],
    "email-list": [
      { id: "mailchimp", title: "Setting up MailChimp" },
      { id: "lead-magnet", title: "Creating a Lead Magnet" },
      { id: "sequence", title: "Building an Email Sequence" },
    ],
  };
  
  const completedPlatformsCount = platforms.filter(p => p.isSetup).length;
  
  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Distribution Checklist</h3>
            <div className="flex items-center">
              <span className="text-sm mr-2">{completedPlatformsCount}/{platforms.length} Platforms Set Up</span>
              <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${(completedPlatformsCount / platforms.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">Distribution Strategy</h4>
            <p className="text-sm text-blue-700">
              For best results, select at least one platform from each category. Start with the platforms marked "Easy" to build momentum, then expand to others. Aim to set up 3-4 platforms initially.
            </p>
          </div>
          
          {Object.entries(platformsByCategory).map(([category, categoryPlatforms]) => (
            <div key={category} className="mb-6">
              <h4 className="font-medium text-zinc-700 mb-3">{getCategoryName(category as PlatformCategory)}</h4>
              <div className="space-y-3">
                {categoryPlatforms.map((platform) => (
                  <div 
                    key={platform.id}
                    className={`border rounded-lg p-4 ${platform.isSetup ? 'bg-green-50 border-green-100' : 'hover:border-blue-200'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-md ${platform.isSetup ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} mr-3`}>
                          {platform.icon}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{platform.name}</h4>
                            {platform.isSetup && (
                              <span className="ml-2 text-xs bg-green-100 text-green-700 py-0.5 px-1.5 rounded flex items-center">
                                <Check size={12} className="mr-1" /> Set Up
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {renderRatingBadge(platform.difficulty)}
                            <span className="text-zinc-300">|</span>
                            <span className="text-sm text-zinc-500">Traffic Potential: {renderRatingBadge(platform.trafficPotential, true)}</span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">Time: {platform.timeInvestment}</p>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {platform.isSetup ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center"
                            onClick={() => setSelectedGuide(platform.id)}
                          >
                            <Bookmark size={14} className="mr-1" /> Resources
                          </Button>
                        ) : (
                          <Button 
                            variant="primary" 
                            size="sm"
                            className="flex items-center"
                            onClick={() => startSetup(platform.id)}
                            disabled={setupInProgress}
                          >
                            {setupInProgress && selectedPlatform === platform.id ? (
                              <>
                                <RefreshCw size={14} className="mr-1 animate-spin" /> Setting Up...
                              </>
                            ) : (
                              <>
                                <ArrowUpRight size={14} className="mr-1" /> Set Up
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {selectedGuide === platform.id && platformGuides[platform.id as keyof typeof platformGuides] && (
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-medium text-sm mb-2">Setup Guides & Resources</h5>
                        <ul className="space-y-2">
                          {platformGuides[platform.id as keyof typeof platformGuides].map(guide => (
                            <li key={guide.id} className="text-sm">
                              <a href="#" className="text-blue-600 hover:underline flex items-center">
                                <ArrowUpRight size={12} className="mr-1" /> {guide.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {platform.id === selectedPlatform && setupInProgress && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="py-4 flex flex-col items-center justify-center">
                          <RefreshCw size={24} className="text-blue-600 animate-spin mb-2" />
                          <p className="text-sm text-zinc-600">Setting up {platform.name}...</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center mb-4">
              <Share2 className="text-blue-600 h-5 w-5 mr-2" />
              <h4 className="font-semibold">Share Strategy Pattern</h4>
            </div>
            
            <div className="bg-zinc-50 p-4 rounded-lg border">
              <h5 className="font-medium text-sm mb-3">Recommended Sharing Pattern</h5>
              <div className="space-y-3">
                <div className="flex items-center p-2 bg-white border rounded">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Create tool landing page on your website</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 flex justify-center">
                    <div className="h-6 w-0.5 bg-blue-200"></div>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-white border rounded">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Share helpful content on Reddit & other communities</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 flex justify-center">
                    <div className="h-6 w-0.5 bg-blue-200"></div>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-white border rounded">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Post regular content on social platforms with tool links</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 flex justify-center">
                    <div className="h-6 w-0.5 bg-blue-200"></div>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-white border rounded">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Send weekly email with financial tips & showcase tools</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
