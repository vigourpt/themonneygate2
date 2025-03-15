import React, { useState, useEffect } from "react";
import { checkIsAdmin } from "utils/adminUtils";
import { useCurrentUser } from "app";
import { useProgressStore } from "utils/progressStore";
import { useNavigate } from "react-router-dom";
import { useUserGuardContext } from "app";
import { Button } from "components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/Card";
import { AIAssistant } from "components/AIAssistant";
import { ProcessFlowDiagram } from "components/ProcessFlowDiagram";
import { MoneyFlowVisualization } from "components/MoneyFlowVisualization";
import { ToolTemplates } from "components/ToolTemplates";
import { KeywordAnalysis } from "components/KeywordAnalysis";
import { KeywordResearch } from "components/KeywordResearch";
import { SideNavigation } from "components/SideNavigation";
import { ToolCreator } from "components/ToolCreator";
import { MonetizationAdvisor } from "components/MonetizationAdvisor";
import { DistributionChecklist } from "components/DistributionChecklist";
import { AnalyticsDashboard } from "components/AnalyticsDashboard";
import { 
  ChevronRight, 
  ChevronLeft, 
  User, 
  LogOut, 
  CreditCard, 
  PieChart, 
  FileText, 
  Search, 
  Target, 
  Layers, 
  BarChart2,
  Share2,
  ChevronDown,
  Check,
  Lock
} from "lucide-react";

// Step data with detailed information
const steps = [
  {
    id: 1,
    title: "Understand Hidden Money Doors",
    description: "Learn the concept of redirecting low-cost traffic to high-value niches",
    icon: <Target className="h-6 w-6" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">What are Hidden Money Doors?</h3>
        <p>These are opportunities where low-cost or free online content can lead to high-value advertising or affiliate markets.</p>
        
        <h3 className="text-lg font-semibold">Why is it Important?</h3>
        <p>This sets the foundation for leveraging underutilized traffic and redirecting it to lucrative niches.</p>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
          <h4 className="font-medium text-blue-800 mb-2">Key Insight:</h4>
          <p className="text-blue-700">The disconnect between content cost and monetization value creates profit opportunities that most people miss.</p>
        </div>
      </div>
    ),
    cta: "Take Hidden Money Doors Quiz",
    ctaAction: "/quiz"
  },
  {
    id: 2,
    title: "Generate Tool Ideas",
    description: "Use AI to brainstorm simple tools and templates that can attract free traffic",
    icon: <Layers className="h-6 w-6" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Creating Value-First Content</h3>
        <p>Use ChatGPT or other AI tools to generate ideas for simple tools, templates, or spreadsheets that solve specific problems.</p>
        
        <h4 className="font-medium mt-4">Examples:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Savings Goal Tracker</li>
          <li>Debt Payoff Planner</li>
          <li>Mortgage Hardship Letter Template</li>
          <li>Budget Calculator</li>
          <li>Investment Return Estimator</li>
        </ul>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
          <h4 className="font-medium text-blue-800 mb-2">Pro Tip:</h4>
          <p className="text-blue-700">Look for tools that solve specific problems but have broader applications to higher-value services.</p>
        </div>
      </div>
    ),
    cta: "Use AI Tool Generator",
    ctaAction: "/tools/generate"
  },
  {
    id: 3,
    title: "Identify High-Value Niches",
    description: "Research related high-value keywords and monetization opportunities",
    icon: <Search className="h-6 w-6" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Finding Lucrative Keywords</h3>
        <p>Use tools like SpyFu, Ahrefs, or SEMrush to analyze the advertising value of different keywords related to your content.</p>
        
        <h4 className="font-medium mt-4">Example Comparison:</h4>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="font-medium">"Savings goal tracker"</p>
            <p className="text-sm text-zinc-600">Low competition</p>
            <p className="text-sm text-zinc-600">$0.30-0.50 CPC</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="font-medium">"Wealth management"</p>
            <p className="text-sm text-zinc-600">High competition</p>
            <p className="text-sm text-zinc-600">$15+ CPC</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
          <h4 className="font-medium text-blue-800 mb-2">Strategy:</h4>
          <p className="text-blue-700">Redirecting traffic from a low-value keyword to a high-value niche increases your earning potential significantly.</p>
        </div>
      </div>
    ),
    cta: "Analyze Keywords",
    ctaAction: "/keywords"
  },
  {
    id: 4,
    title: "Create the Tool or Template",
    description: "Build the actual content that will attract your target audience",
    icon: <FileText className="h-6 w-6" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Building Your Money Bait</h3>
        <p>Use AI to generate the actual content/tool, then format it professionally to attract and retain users.</p>
        
        <h4 className="font-medium mt-4">Best Formats:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Excel Spreadsheets</li>
          <li>PDF Templates</li>
          <li>Interactive Calculators</li>
          <li>Google Docs/Sheets</li>
          <li>Simple Web Applications</li>
        </ul>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
          <h4 className="font-medium text-blue-800 mb-2">Important:</h4>
          <p className="text-blue-700">Focus on quality and usefulness - these tools act as "money bait" attracting free or low-cost traffic.</p>
        </div>
      </div>
    ),
    cta: "Create Tool Now",
    ctaAction: "/tool-generator"
  },
  {
    id: 5,
    title: "Integrate Monetization",
    description: "Add affiliate links, ads, or redirect traffic to high-value services",
    icon: <CreditCard className="h-6 w-6" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Monetization Strategies</h3>
        <p>Strategically add promotional elements that guide users toward high-value offerings related to the tool's purpose.</p>
        
        <h4 className="font-medium mt-4">Effective Methods:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Contextual affiliate links (Amazon, ShareASale, etc.)</li>
          <li>Targeted service recommendations</li>
          <li>Premium version upsells</li>
          <li>Related content promotion</li>
          <li>Email list building for follow-up marketing</li>
        </ul>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
          <h4 className="font-medium text-blue-800 mb-2">Example:</h4>
          <p className="text-blue-700">Include links to wealth management services in the savings goal tracker or refinancing services in mortgage hardship letters.</p>
        </div>
      </div>
    ),
    cta: "Setup Monetization",
    ctaAction: "/monetization"
  },
  {
    id: 6,
    title: "Host and Share Tools",
    description: "Distribute your tools on platforms where your target audience can find them",
    icon: <Share2 className="h-6 w-6" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Distribution Channels</h3>
        <p>Make your tools easily accessible through multiple platforms to maximize visibility and reach.</p>
        
        <h4 className="font-medium mt-4">Popular Platforms:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Your own website or landing page</li>
          <li>Reddit communities relevant to your tool</li>
          <li>Quora answers to related questions</li>
          <li>YouTube tutorials demonstrating the tool</li>
          <li>Social media groups and platforms</li>
          <li>Medium articles or blog posts</li>
        </ul>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
          <h4 className="font-medium text-blue-800 mb-2">Key Point:</h4>
          <p className="text-blue-700">Visibility ensures your tools reach users who can generate revenue through your monetization strategies.</p>
        </div>
      </div>
    ),
    cta: "Distribution Checklist",
    ctaAction: "/distribution"
  },
  {
    id: 7,
    title: "Analyze and Optimize",
    description: "Track performance and make adjustments to maximize revenue",
    icon: <BarChart2 className="h-6 w-6" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Performance Analysis</h3>
        <p>Use analytics tools to track traffic, engagement, and conversion metrics to optimize your strategy.</p>
        
        <h4 className="font-medium mt-4">Key Metrics to Track:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Traffic sources and volume</li>
          <li>Tool download/usage rates</li>
          <li>Affiliate link click-through rates</li>
          <li>Conversion rates for monetization elements</li>
          <li>Revenue per visitor</li>
        </ul>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
          <h4 className="font-medium text-blue-800 mb-2">Continuous Improvement:</h4>
          <p className="text-blue-700">Adjust keywords, tool offerings, or ad placements based on performance data to maximize revenue over time.</p>
        </div>
      </div>
    ),
    cta: "View Analytics Dashboard",
    ctaAction: "/analytics"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiResults, setAiResults] = useState<any | null>(null);
  
  // Use Firestore progress tracking
  const { 
    progress, 
    setCurrentStep, 
    completeStep, 
    setCurrentlyWorking,
    saveProgress, 
    loadProgress 
  } = useProgressStore();
  const [currentStep, setCurrentStepLocal] = useState(progress.currentStep);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Load user progress on component mount
  useEffect(() => {
    if (user) {
      loadProgress(user.uid);
      
      // Check if user is admin
      const checkAdmin = async () => {
        const adminStatus = await checkIsAdmin(user.uid);
        setIsAdmin(adminStatus);
      };
      
      checkAdmin();
    }
  }, [user, loadProgress]);
  
  // Update local state when progress changes
  useEffect(() => {
    setCurrentStepLocal(progress.currentStep);
  }, [progress.currentStep]);
  
  // Sync local state with store
  useEffect(() => {
    setCurrentStep(currentStep);
    if (user) {
      saveProgress(user.uid);
    }
  }, [currentStep, setCurrentStep, saveProgress, user]);
  
  // Handle AI Assistant completion
  const handleAIAssistantComplete = (results: any) => {
    setAiResults(results);
    setShowAIAssistant(false);
    
    // Update progress when AI assistant completes
    completeStep(3); // Mark step 3 as complete
    setCurrentlyWorking(4); // Set working on step 4
    
    // Move to the next appropriate step based on the AI results
    setCurrentStepLocal(4); // Move to tool creation step
    
    // Save progress to Firestore
    if (user) {
      saveProgress(user.uid);
    }
  };
  
  const selectedStep = steps.find(step => step.id === currentStep) || steps[0];
  
  const getStepStatus = (stepId: number) => {
    if (progress.completedSteps.includes(stepId)) {
      return "completed";
    } else if (progress.currentlyWorking === stepId) {
      return "in-progress";
    } else {
      return "pending";
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStepLocal(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStepLocal(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div 
              onClick={() => navigate('/')} 
              className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer"
            >
              M
            </div>
            <h1 className="text-xl font-bold">TheMoneyGate</h1>
          </div>
          <nav>
            <ul className="flex space-x-6 items-center">
              <li><a href="/dashboard" className="text-zinc-600 hover:text-blue-600 transition-colors">Dashboard</a></li>
              {isAdmin && (
                <li>
                  <a href="/admin-dashboard" className="text-zinc-600 hover:text-blue-600 transition-colors">Admin</a>
                </li>
              )}
              <li className="relative group">
                <a href="#" className="text-zinc-600 hover:text-blue-600 transition-colors flex items-center">
                  Tools <ChevronDown className="ml-1 h-3 w-3" />
                </a>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none hidden group-hover:block z-10">
                  <div className="py-1">
                    <a href="/tool-generator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">AI Tool Generator</a>
                    <a href="/generated-tools" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Generated Tools</a>
                    <a href="/embed-tool" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Embed Tool View</a>
                  </div>
                </div>
              </li>
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
                  variant="outline" 
                  onClick={() => navigate('/logout')}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Money Gate Dashboard</h1>
          <p className="text-zinc-600">Track your progress through the 7 steps of finding and exploiting Hidden Money Doors.</p>
        </div>
        
        {/* Progress Overview */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Your Progress</h3>
                  <p className="text-zinc-600">
                    You've completed {progress.completedSteps.length} of 7 steps ({Math.round((progress.completedSteps.length / 7) * 100)}%)
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-3">
                  {!showAIAssistant && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAIAssistant(true)}
                      className="flex items-center"
                    >
                      Use AI Assistant
                    </Button>
                  )}
                  <Button variant="primary" onClick={() => setCurrentStepLocal(progress.currentlyWorking)}>
                    Continue Where You Left Off
                  </Button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${(progress.completedSteps.length / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Visual Process Flow */}
              <div className="mt-8 pt-6 border-t">
                <h4 className="text-lg font-medium mb-4">Your Money Gate Journey</h4>
                <ProcessFlowDiagram 
                  steps={steps}
                  completedSteps={progress.completedSteps}
                  currentlyWorking={progress.currentlyWorking}
                  onSelectStep={setCurrentStepLocal}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* AI Assistant */}
        {showAIAssistant && (
          <div className="mb-8">
            <AIAssistant onComplete={handleAIAssistantComplete} />
          </div>
        )}
        
        {/* Concept Visualization */}
        {!showAIAssistant && currentStep === 1 && (
          <div className="mb-8">
            <MoneyFlowVisualization />
          </div>
        )}
        
        {/* Tool Templates */}
        {!showAIAssistant && currentStep === 2 && (
          <div className="mb-8">
            <ToolTemplates />
          </div>
        )}
        
        {/* Keyword Analysis */}
        {!showAIAssistant && currentStep === 3 && (
          <div className="mb-8">
            <KeywordAnalysis />
          </div>
        )}
        
        {/* Tool Creator */}
        {!showAIAssistant && currentStep === 4 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create Your Financial Tool</h2>
              <Button 
                variant="outline"
                onClick={() => navigate('/generated-tools')}
                className="flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" /> View My Tools
              </Button>
            </div>
            <ToolCreator />
            <div className="mt-4 text-center">
              <a href="/generated-tools" className="text-blue-600 hover:text-blue-800 text-sm underline">View my generated tools</a>
            </div>
          </div>
        )}
        
        {/* Monetization Advisor */}
        {!showAIAssistant && currentStep === 5 && (
          <div className="mb-8">
            <MonetizationAdvisor />
          </div>
        )}
        
        {/* Distribution Checklist */}
        {!showAIAssistant && currentStep === 6 && (
          <div className="mb-8">
            <DistributionChecklist />
          </div>
        )}
        
        {/* Analytics Dashboard */}
        {!showAIAssistant && currentStep === 7 && (
          <div className="mb-8">
            <AnalyticsDashboard />
          </div>
        )}
        
        {/* Keyword Research Widget */}
        {!showAIAssistant && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Keyword Research</h2>
            <Card>
              <CardContent className="p-4">
                <KeywordResearch compact={true} />
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate("/keyword-research")} 
                    className="flex items-center"
                  >
                    Advanced Keyword Research
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Step Navigation */}
          <div className="lg:col-span-4 xl:col-span-3">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Your 7-Step Journey</CardTitle>
                <CardDescription>Follow these steps to create profitable Hidden Money Doors</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
                  {steps.map((step) => {
                    const status = getStepStatus(step.id);
                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStepLocal(step.id)}
                        className={`w-full flex items-center p-3 rounded-lg transition-colors ${currentStep === step.id 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-zinc-50'}`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 
                          ${status === 'completed' ? 'bg-green-100 text-green-600' : 
                            status === 'in-progress' ? 'bg-blue-100 text-blue-600' : 
                            'bg-zinc-100 text-zinc-500'}`}
                        >
                          {status === 'completed' ? (
                            <Check size={16} />
                          ) : status === 'pending' ? (
                            <Lock size={14} />
                          ) : (
                            step.id
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className={`font-medium ${currentStep === step.id ? 'text-blue-700' : 'text-zinc-800'} truncate`}>
                            {step.title}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">{step.description}</p>
                        </div>
                        <ChevronRight size={16} className="text-zinc-400" />
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step Content */}
          <div className="lg:col-span-8 xl:col-span-9">
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <div className="text-blue-600">{selectedStep.icon}</div>
                  </div>
                  <div>
                    <CardTitle>Step {selectedStep.id}: {selectedStep.title}</CardTitle>
                    <CardDescription>{selectedStep.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  {selectedStep.content}
                </div>
                
                <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                    onClick={() => {
                      completeStep(selectedStep.id);
                      if (user) {
                        saveProgress(user.uid);
                      }
                    }}
                    disabled={progress.completedSteps.includes(selectedStep.id)}
                  >
                    {progress.completedSteps.includes(selectedStep.id) ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Completed
                      </>
                    ) : (
                      <>Mark as Complete</>
                    )}
                  </Button>
                  <div className="flex space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevStep}
                      disabled={currentStep === 1}
                      className="flex items-center"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleNextStep}
                      disabled={currentStep === steps.length}
                      className="flex items-center"
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    variant="primary"
                    onClick={() => navigate(selectedStep.ctaAction)}
                  >
                    {selectedStep.cta}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Resources Section */}
            <div className="mt-6">
              <Card>
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Resources for Step {selectedStep.id}</CardTitle>
                    <Button variant="ghost" className="flex items-center text-blue-600">
                      View All <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                      <h4 className="font-medium">Guide: {selectedStep.title}</h4>
                      <p className="text-sm text-zinc-500 mt-1">Comprehensive guide on how to master this step</p>
                    </div>
                    <div className="p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                      <h4 className="font-medium">Template: Quick Start</h4>
                      <p className="text-sm text-zinc-500 mt-1">Ready-to-use template to speed up your progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
