import React, { useState, useEffect } from "react";
import brain from "brain";
import { useNavigate } from "react-router-dom";
import { useUserGuardContext } from "app";
import { Button } from "components/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "components/Card";
import { useToolStore, ToolIdea, KeywordSuggestion, MonetizationIdea } from "utils/toolStore";
import { Sparkles, Save, ArrowRight, Check, BookOpen, Coins, PiggyBank, Wallet, LineChart, Calculator, FileText, FilterX, Plus, Filter, RefreshCw, Archive, Clock3, Code, Eye, DollarSign } from "lucide-react";

export default function ToolGenerator() {
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  const { tools, loading, saveTool, loadTools } = useToolStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('finance');
  const [prompt, setPrompt] = useState("");
  const [complexity, setComplexity] = useState<ToolIdea['complexity']>("beginner");
  const [generatedTools, setGeneratedTools] = useState<Array<Omit<ToolIdea, 'id' | 'createdAt' | 'updatedAt'>> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');
  
  // Load user's saved tools on component mount
  useEffect(() => {
    if (user) {
      loadTools(user.uid);
    }
  }, [user, loadTools]);
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    setSavedIds([]);
    
    try {
      // Call the OpenAI-powered API
      const response = await brain.generate_tool_ideas({
        category: selectedCategory,
        prompt: prompt,
        complexity: complexity,
        max_results: 3
      });
      
      const data = await response.json();
      console.log("Generated tools:", data);
      
      // Transform the API response to our tool format
      if (data.tools && Array.isArray(data.tools)) {
        const formattedTools = data.tools.map(tool => ({
          title: tool.title,
          description: tool.description,
          implementation_details: tool.implementation_details,
          category: selectedCategory,
          complexity: complexity,
          status: "idea",
          keywords: Array.isArray(tool.keywords) ? tool.keywords : [],
          monetizationIdeas: Array.isArray(tool.monetization_ideas) ? tool.monetization_ideas : []
        }));
        
        console.log("Formatted tools:", formattedTools);
        setGeneratedTools(formattedTools);
      } else {
        console.error("Invalid API response format:", data);
        // Fallback to mock data if API fails
        const generatedResults = generateMockToolIdeas(selectedCategory, prompt, complexity);
        setGeneratedTools(generatedResults);
      }
    } catch (error) {
      console.error("Error generating tools:", error);
      // Fallback to mock data if API fails
      const generatedResults = generateMockToolIdeas(selectedCategory, prompt, complexity);
      setGeneratedTools(generatedResults);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveTool = async (tool: Omit<ToolIdea, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    try {
      const id = await saveTool(user.uid, tool);
      setSavedIds(prev => [...prev, id]);
    } catch (error) {
      console.error("Error saving tool:", error);
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'finance':
        return <PiggyBank className="h-5 w-5" />;
      case 'health':
        return <Wallet className="h-5 w-5" />;
      case 'productivity':
        return <LineChart className="h-5 w-5" />;
      case 'education':
        return <Calculator className="h-5 w-5" />;
      case 'marketing':
        return <Clock3 className="h-5 w-5" />;
      case 'social':
        return <FileText className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };
  
  const categoryColor: Record<string, string> = {
    finance: "bg-green-100 text-green-700",
    health: "bg-red-100 text-red-700",
    productivity: "bg-blue-100 text-blue-700",
    education: "bg-purple-100 text-purple-700",
    marketing: "bg-amber-100 text-amber-700",
    social: "bg-slate-100 text-slate-700",
    other: "bg-zinc-100 text-zinc-700"
  };
  
  const filteredTools = filterCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === filterCategory);
  
  return (
    <div className="container max-w-6xl px-4 py-10 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Tool Generator</h1>
          <p className="text-zinc-600">Generate and save financial tool ideas with AI</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="bg-blue-50 border-b pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-blue-100 rounded-lg">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>AI Tool Generator</CardTitle>
                    <CardDescription>Create tools that connect free content to high-value niches</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {!generatedTools ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Financial Category</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(['savings', 'debt', 'investment', 'budgeting', 'retirement', 'taxes', 'other'] as const).map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`border rounded-lg p-3 flex flex-col items-center justify-center transition-colors ${selectedCategory === category 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-zinc-200 hover:border-blue-300 hover:bg-blue-50'}`}
                        >
                          <div className={`p-2 rounded-md ${categoryColor[category]} mb-2`}>
                            {getCategoryIcon(category)}
                          </div>
                          <span className="capitalize">{category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-zinc-700 mb-2">
                      What's your tool focus? (optional)
                    </label>
                    <input
                      id="prompt"
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={`E.g., "retirement planning for freelancers" or "debt snowball calculator"`}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Complexity Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setComplexity(level)}
                          className={`border rounded-lg p-3 flex items-center justify-center transition-colors ${complexity === level 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-zinc-200 hover:border-blue-300 hover:bg-blue-50'}`}
                        >
                          <span className="capitalize">{level}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">Tips for Great Results</h4>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                      <li>Be specific about your target audience</li>
                      <li>Consider tools that solve specific problems</li>
                      <li>Think about how the tool connects to higher-value services</li>
                      <li>Look for niches with high monetization potential</li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      variant="primary" 
                      size="lg"
                      className="px-6"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Generating Ideas...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Tool Ideas
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-start">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-800 mb-1">Tool Ideas Generated</h4>
                      <p className="text-green-700 text-sm">We've generated {generatedTools.length} tool ideas based on your criteria.</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Generated Tool Ideas</h3>
                    <div className="space-y-4">
                      {generatedTools.map((tool, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className="p-4 flex items-start justify-between">
                            <div className="flex">
                              <div className={`p-2 rounded-md ${categoryColor[tool.category]} mr-3`}>
                                {getCategoryIcon(tool.category)}
                              </div>
                              <div>
                                <h4 className="font-medium">{tool.title}</h4>
                                <div className="flex items-center mt-1 space-x-2">
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full capitalize">
                                    {tool.category}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full capitalize">
                                    {tool.complexity}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSaveTool(tool)}
                              disabled={savedIds.includes(`idea-${index}`)}
                              className={savedIds.includes(`idea-${index}`) ? 'bg-green-50 text-green-700' : ''}
                            >
                              {savedIds.includes(`idea-${index}`) ? (
                                <>
                                  <Check className="mr-1 h-4 w-4" /> Saved
                                </>
                              ) : (
                                <>
                                  <Save className="mr-1 h-4 w-4" /> Save Idea
                                </>
                              )}
                            </Button>
                          </div>
                          
                          <div className="px-4 pb-4 pt-0">
                            <p className="text-sm text-zinc-600 mb-3">{tool.description}</p>
                            
                            {tool.implementation_details && (
                              <div className="mb-3">
                                <h5 className="text-xs font-medium text-zinc-500 mb-1">Implementation Details</h5>
                                <p className="text-xs text-zinc-600 p-2 bg-zinc-50 rounded-md border border-zinc-100">
                                  {tool.implementation_details}
                                </p>
                              </div>
                            )}
                            
                            <div className="space-y-3">
                              <div>
                                <h5 className="text-xs font-medium text-zinc-500 mb-1">Keywords</h5>
                                <div className="flex flex-wrap gap-1">
                                  {Array.isArray(tool.keywords) && tool.keywords.map((keyword, i) => {
                                    // Handle both string and KeywordSuggestion types
                                    const keywordText = typeof keyword === 'string' 
                                      ? keyword 
                                      : keyword.keyword;
                                    
                                    const competitionColor = {
                                      'Low': 'bg-green-100 text-green-700',
                                      'Medium': 'bg-yellow-100 text-yellow-700',
                                      'High': 'bg-red-100 text-red-700'
                                    };
                                    
                                    if (typeof keyword === 'string') {
                                      return (
                                        <span key={i} className="text-xs px-2 py-0.5 bg-zinc-100 rounded-full">
                                          {keywordText}
                                        </span>
                                      );
                                    } else {
                                      return (
                                        <div key={i} className="inline-flex mr-1 mb-1">
                                          <span className="text-xs px-2 py-0.5 bg-zinc-100 rounded-l-full">
                                            {keywordText}
                                          </span>
                                          <span className={`text-xs px-2 py-0.5 ${competitionColor[keyword.competition as 'Low' | 'Medium' | 'High'] || 'bg-zinc-100 text-zinc-700'} border-l border-white`}>
                                            {keyword.competition}
                                          </span>
                                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-r-full border-l border-white">
                                            {keyword.suggested_cpc}
                                          </span>
                                        </div>
                                      );
                                    }
                                  })}
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="text-xs font-medium text-zinc-500 mb-1">Monetization Opportunities</h5>
                                <ul className="text-xs text-zinc-600 space-y-1 list-disc pl-5">
                                  {Array.isArray(tool.monetizationIdeas) && tool.monetizationIdeas.map((idea, i) => {
                                    // Handle both string and MonetizationIdea types
                                    if (typeof idea === 'string') {
                                      return <li key={i}>{idea}</li>;
                                    } else {
                                      return (
                                        <li key={i} className="mb-2">
                                          <div className="font-medium text-zinc-700">{idea.idea}</div>
                                          {idea.description && (
                                            <div className="text-xs text-zinc-600 mt-0.5">{idea.description}</div>
                                          )}
                                          {idea.potential_value && (
                                            <div className="text-xs mt-0.5 inline-block px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                                              {idea.potential_value}
                                            </div>
                                          )}
                                        </li>
                                      );
                                    }
                                  })}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
                    <p className="text-sm text-blue-700 mb-2">
                      Save the ideas you like, then head to the Tool Creator to build them, or view your saved ideas in your tool library.
                    </p>
                    <div className="flex space-x-3 mt-3">
                      <Button
                        variant="outline"
                        onClick={() => setGeneratedTools(null)}
                        className="text-sm"
                      >
                        Generate More Ideas
                      </Button>
                      <Button
                        variant="primary"
                        className="text-sm"
                        onClick={() => navigate("/generated-tools")}
                      >
                        <ArrowRight className="mr-1.5 h-3.5 w-3.5" />
                        View My Generated Tools
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="bg-zinc-50 border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Tool Library</CardTitle>
                  <CardDescription>Saved tool ideas you can create</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-zinc-700">Filter by Category</label>
                  {filterCategory !== 'all' && (
                    <button
                      onClick={() => setFilterCategory('all')}
                      className="text-xs flex items-center text-zinc-500 hover:text-zinc-700"
                    >
                      <FilterX className="h-3 w-3 mr-1" /> Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setFilterCategory('all')}
                    className={`text-xs px-2 py-1 rounded-md ${filterCategory === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                  >
                    All
                  </button>
                  {(['savings', 'debt', 'investment', 'budgeting', 'retirement', 'taxes', 'other'] as const).map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilterCategory(category)}
                      className={`text-xs px-2 py-1 rounded-md capitalize ${filterCategory === category 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="ml-2 text-zinc-600">Loading your tools...</span>
                </div>
              ) : filteredTools.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto p-1">
                  {filteredTools.map((tool) => (
                    <div key={tool.id} className="border rounded-lg p-3 hover:bg-zinc-50">
                      <div className="flex items-start">
                        <div className={`p-1.5 rounded-md ${categoryColor[tool.category]} mr-2`}>
                          {getCategoryIcon(tool.category)}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{tool.title}</h4>
                          <div className="flex mt-1 space-x-1">
                            <span className="text-xs px-1.5 py-0.5 bg-zinc-100 rounded-full capitalize">
                              {tool.category}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 bg-zinc-100 rounded-full capitalize">
                              {tool.complexity}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-600 mt-2 line-clamp-2">{tool.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Archive className="mx-auto h-8 w-8 text-zinc-300 mb-2" />
                  <h4 className="text-zinc-500 font-medium mb-1">No saved tools yet</h4>
                  <p className="text-zinc-400 text-sm">Generated tools you save will appear here</p>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center"
                  onClick={() => setGeneratedTools(null)} // In full implementation, this would open a modal or navigate to a create page
                >
                  <Plus className="h-4 w-4 mr-1.5" /> Create Custom Tool
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate mock tool ideas
function generateMockToolIdeas(category: ToolIdea['category'], prompt: string, complexity: ToolIdea['complexity']) {
  // Predefined tool ideas by category
  const toolIdeasByCategory: Record<ToolIdea['category'], Array<Omit<ToolIdea, 'id' | 'createdAt' | 'updatedAt'>>> = {
    savings: [
      {
        title: "Interactive Savings Goal Calculator",
        description: "An interactive tool that helps users visualize their progress toward multiple savings goals and provides motivational milestones.",
        category: "savings",
        complexity: complexity,
        status: "idea",
        keywords: ["savings goals", "savings calculator", "financial planning", "budget planner"],
        monetizationIdeas: [
          "Link to high-yield savings accounts with affiliate commissions",
          "Upsell premium version with advanced projection features",
          "Integrate wealth management consultation offers"
        ]
      },
      {
        title: "Emergency Fund Builder",
        description: "A tool that helps users calculate their ideal emergency fund size based on their personal situation and create a step-by-step plan to build it.",
        category: "savings",
        complexity: complexity,
        status: "idea",
        keywords: ["emergency fund", "financial security", "savings plan", "financial stability"],
        monetizationIdeas: [
          "Partner with insurance companies for emergency coverage options",
          "Cross-promote high-interest savings accounts",
          "Offer premium version with automated savings recommendations"
        ]
      },
      {
        title: "52-Week Money Challenge Tracker",
        description: "A customizable spreadsheet that gamifies saving money through various challenge formats, with progress tracking and rewards system.",
        category: "savings",
        complexity: complexity,
        status: "idea",
        keywords: ["money challenge", "savings game", "52 week challenge", "saving money"],
        monetizationIdeas: [
          "Upsell digital rewards and achievements system",
          "Partner with banks offering new account bonuses",
          "Cross-promote with budgeting apps through affiliate links"
        ]
      },
      {
        title: "Savings Rate Calculator",
        description: "Tool that calculates a user's savings rate and compares it to recommended benchmarks, offering personalized suggestions for improvement.",
        category: "savings",
        complexity: complexity,
        status: "idea",
        keywords: ["savings rate", "financial independence", "FIRE movement", "retirement planning"],
        monetizationIdeas: [
          "Affiliate links to financial advisors specializing in high-net-worth clients",
          "Premium consultation for wealth-building strategies",
          "Cross-promote investment platforms with sign-up bonuses"
        ]
      }
    ],
    debt: [
      {
        title: "Debt Snowball/Avalanche Calculator",
        description: "Interactive tool that compares both debt reduction methods and creates a personalized payoff plan based on user's financial situation.",
        category: "debt",
        complexity: complexity,
        status: "idea",
        keywords: ["debt payoff", "debt snowball", "debt avalanche", "debt reduction", "debt free"],
        monetizationIdeas: [
          "Affiliate links to debt consolidation loans",
          "Partnerships with credit counseling services",
          "Premium version with advanced debt scenarios and strategies"
        ]
      },
      {
        title: "Credit Card Payoff Planner",
        description: "Calculator that shows how different payment amounts affect total interest paid and payoff time for credit card debt.",
        category: "debt",
        complexity: complexity,
        status: "idea",
        keywords: ["credit card debt", "debt payoff", "interest calculator", "financial freedom"],
        monetizationIdeas: [
          "Affiliate links to balance transfer credit cards",
          "Cross-promote personal loans for debt consolidation",
          "Upsell advanced debt analytics package"
        ]
      },
      {
        title: "Student Loan Repayment Optimizer",
        description: "Tool that analyzes different student loan repayment strategies including income-driven plans, refinancing, and loan forgiveness options.",
        category: "debt",
        complexity: complexity,
        status: "idea",
        keywords: ["student loans", "loan forgiveness", "student debt", "loan repayment"],
        monetizationIdeas: [
          "Partner with student loan refinancing companies",
          "Offer premium consultation on forgiveness programs",
          "Advertise high-end financial planning services for professionals"
        ]
      },
      {
        title: "Mortgage Refinance Calculator",
        description: "Decision tool that helps homeowners determine if refinancing their mortgage would save money based on current rates and fees.",
        category: "debt",
        complexity: complexity,
        status: "idea",
        keywords: ["mortgage refinance", "home loan", "refi calculator", "interest savings"],
        monetizationIdeas: [
          "Mortgage lender affiliate partnerships",
          "Real estate agent referral network",
          "Home insurance cross-promotions"
        ]
      }
    ],
    investment: [
      {
        title: "Investment Fee Analyzer",
        description: "Calculator that reveals the true impact of investment fees over time and compares low-fee alternatives.",
        category: "investment",
        complexity: complexity,
        status: "idea",
        keywords: ["investment fees", "expense ratios", "low-cost investing", "fee comparison"],
        monetizationIdeas: [
          "Affiliate links to low-cost brokerages",
          "Cross-promote robo-advisors with sign-up bonuses",
          "Partner with fiduciary financial advisors"
        ]
      },
      {
        title: "Portfolio Allocation Visualizer",
        description: "Interactive tool that helps users understand asset allocation concepts and visualize different portfolio strategies.",
        category: "investment",
        complexity: complexity,
        status: "idea",
        keywords: ["asset allocation", "portfolio strategy", "investment mix", "diversification"],
        monetizationIdeas: [
          "Premium version with advanced portfolio analysis",
          "Affiliate partnerships with wealth management services",
          "Cross-promote specialized investment platforms"
        ]
      },
      {
        title: "Dividend Income Calculator",
        description: "Tool that projects potential passive income from dividend stocks based on investment amount and dividend yield assumptions.",
        category: "investment",
        complexity: complexity,
        status: "idea",
        keywords: ["dividend investing", "passive income", "dividend stocks", "income investing"],
        monetizationIdeas: [
          "Partner with dividend-focused brokerages",
          "Promote premium stock research services",
          "Cross-sell dividend ETF analysis tools"
        ]
      },
      {
        title: "Dollar-Cost Averaging Calculator",
        description: "Visualization tool showing the benefits of regular investing versus trying to time the market.",
        category: "investment",
        complexity: complexity,
        status: "idea",
        keywords: ["dollar-cost averaging", "DCA", "investing strategy", "market timing"],
        monetizationIdeas: [
          "Affiliate links to automatic investment platforms",
          "Cross-promote with high-end financial newsletters",
          "Partner with wealth management firms"
        ]
      }
    ],
    budgeting: [
      {
        title: "50/30/20 Budget Calculator",
        description: "Interactive tool that helps users implement the 50/30/20 budgeting method (needs, wants, savings) with customized recommendations.",
        category: "budgeting",
        complexity: complexity,
        status: "idea",
        keywords: ["50/30/20 budget", "budget percentages", "budget calculator", "simple budgeting"],
        monetizationIdeas: [
          "Affiliate partnerships with budgeting apps",
          "Cross-promote personal finance courses",
          "Integration with cashback reward programs"
        ]
      },
      {
        title: "Expense Tracker Template",
        description: "Comprehensive spreadsheet for tracking daily expenses with automatic categorization and visual spending reports.",
        category: "budgeting",
        complexity: complexity,
        status: "idea",
        keywords: ["expense tracking", "spending tracker", "budget template", "money management"],
        monetizationIdeas: [
          "Upsell premium version with advanced reporting",
          "Affiliate links to automated financial services",
          "Cross-promote personal financial coaching"
        ]
      },
      {
        title: "Cash Flow Planner",
        description: "Tool that helps visualize upcoming income and expenses to prevent cash flow problems and optimize timing of bills and savings.",
        category: "budgeting",
        complexity: complexity,
        status: "idea",
        keywords: ["cash flow", "bill calendar", "income planning", "financial calendar"],
        monetizationIdeas: [
          "Partner with bill negotiation services",
          "Promote early paycheck access services",
          "Affiliate links to high-yield checking accounts"
        ]
      },
      {
        title: "Zero-Based Budget Template",
        description: "Spreadsheet implementing the zero-based budgeting method where every dollar is assigned a purpose, with guidance for new users.",
        category: "budgeting",
        complexity: complexity,
        status: "idea",
        keywords: ["zero-based budget", "zero-sum budget", "budget spreadsheet", "YNAB method"],
        monetizationIdeas: [
          "Cross-promote with premium budgeting software",
          "Affiliate links to financial coaching services",
          "Partner with expense management tools"
        ]
      }
    ],
    retirement: [
      {
        title: "Retirement Readiness Calculator",
        description: "Comprehensive tool that assesses retirement preparedness based on current savings, expected needs, and projected income sources.",
        category: "retirement",
        complexity: complexity,
        status: "idea",
        keywords: ["retirement planning", "retirement calculator", "retirement readiness", "retirement savings"],
        monetizationIdeas: [
          "Partnerships with wealth management firms",
          "Affiliate links to annuity products",
          "Cross-promote retirement coaching services"
        ]
      },
      {
        title: "Social Security Optimizer",
        description: "Tool that helps users determine the optimal age to claim Social Security benefits based on their unique situation.",
        category: "retirement",
        complexity: complexity,
        status: "idea",
        keywords: ["social security", "claiming strategy", "retirement benefits", "social security calculator"],
        monetizationIdeas: [
          "Affiliate links to Medicare supplemental insurance",
          "Cross-promote estate planning services",
          "Partner with retirement income specialists"
        ]
      },
      {
        title: "Required Minimum Distribution Calculator",
        description: "Calculator that helps retirees determine their required minimum distributions from retirement accounts and plan accordingly.",
        category: "retirement",
        complexity: complexity,
        status: "idea",
        keywords: ["RMD calculator", "required minimum distribution", "retirement withdrawals", "IRA distribution"],
        monetizationIdeas: [
          "Partner with tax preparation services",
          "Affiliate links to estate planning attorneys",
          "Cross-promote with high-net-worth financial advisors"
        ]
      },
      {
        title: "Retirement Income Planner",
        description: "Tool that helps users create a sustainable withdrawal strategy for retirement savings across different account types.",
        category: "retirement",
        complexity: complexity,
        status: "idea",
        keywords: ["retirement income", "withdrawal strategy", "retirement distribution", "safe withdrawal rate"],
        monetizationIdeas: [
          "Affiliate links to retirement income products",
          "Partner with wealth management firms",
          "Cross-promote with estate planning services"
        ]
      }
    ],
    taxes: [
      {
        title: "Tax Withholding Optimizer",
        description: "Calculator that helps users adjust their W-4 withholding to maximize take-home pay without owing at tax time.",
        category: "taxes",
        complexity: complexity,
        status: "idea",
        keywords: ["tax withholding", "W-4 calculator", "tax planning", "paycheck calculator"],
        monetizationIdeas: [
          "Affiliate links to tax preparation software",
          "Cross-promote with tax professionals",
          "Partner with payroll services for small businesses"
        ]
      },
      {
        title: "Capital Gains Tax Calculator",
        description: "Tool that estimates tax implications of selling investments based on purchase date, cost basis, and current tax rates.",
        category: "taxes",
        complexity: complexity,
        status: "idea",
        keywords: ["capital gains tax", "investment taxes", "tax harvesting", "investment sales"],
        monetizationIdeas: [
          "Partner with tax-focused financial advisors",
          "Affiliate links to tax-optimized investment platforms",
          "Cross-promote with estate planning services"
        ]
      },
      {
        title: "Small Business Tax Deduction Finder",
        description: "Interactive checklist that helps small business owners and freelancers identify potential tax deductions they may qualify for.",
        category: "taxes",
        complexity: complexity,
        status: "idea",
        keywords: ["small business taxes", "tax deductions", "self-employed taxes", "business expenses"],
        monetizationIdeas: [
          "Partner with small business accountants",
          "Affiliate links to business tax software",
          "Cross-promote business formation services"
        ]
      },
      {
        title: "Retirement Tax Optimization Planner",
        description: "Tool that helps users optimize tax outcomes across different retirement account types (Traditional, Roth, Taxable).",
        category: "taxes",
        complexity: complexity,
        status: "idea",
        keywords: ["retirement tax planning", "Roth conversion", "tax-efficient withdrawals", "retirement accounts"],
        monetizationIdeas: [
          "Partner with retirement tax specialists",
          "Affiliate links to estate planning attorneys",
          "Cross-promote with high-net-worth financial advisors"
        ]
      }
    ],
    other: [
      {
        title: "Financial Goal Priority Matrix",
        description: "Decision tool that helps users prioritize multiple financial goals based on importance, urgency, and potential return.",
        category: "other",
        complexity: complexity,
        status: "idea",
        keywords: ["financial goals", "money priorities", "financial planning", "goal setting"],
        monetizationIdeas: [
          "Partner with life coaches and financial planners",
          "Cross-promote with productivity apps",
          "Affiliate links to wealth management services"
        ]
      },
      {
        title: "Marriage Financial Compatibility Quiz",
        description: "Interactive assessment that helps couples understand their money personalities and potential financial conflicts.",
        category: "other",
        complexity: complexity,
        status: "idea",
        keywords: ["money and marriage", "financial compatibility", "couples finances", "money personality"],
        monetizationIdeas: [
          "Partner with couples counselors specializing in finances",
          "Affiliate links to shared budgeting tools",
          "Cross-promote with estate planning attorneys"
        ]
      },
      {
        title: "College Cost Calculator",
        description: "Tool that projects the full cost of college education including tuition, living expenses, books, and hidden fees.",
        category: "other",
        complexity: complexity,
        status: "idea",
        keywords: ["college costs", "education expenses", "college planning", "tuition calculator"],
        monetizationIdeas: [
          "Affiliate links to 529 plan providers",
          "Partner with college financial aid consultants",
          "Cross-promote with scholarship search services"
        ]
      },
      {
        title: "Life Insurance Needs Calculator",
        description: "Calculator that helps users determine appropriate life insurance coverage based on family situation and financial obligations.",
        category: "other",
        complexity: complexity,
        status: "idea",
        keywords: ["life insurance calculator", "insurance needs", "family protection", "financial security"],
        monetizationIdeas: [
          "Partner with insurance brokers",
          "Affiliate links to online insurance marketplaces",
          "Cross-promote with estate planning attorneys"
        ]
      }
    ]
  };
  
  // Generate random IDs for the tools
  return toolIdeasByCategory[category].map(tool => ({
    ...tool,
    id: `idea-${Math.random().toString(36).substr(2, 9)}` // Simple ID generation
  }));
}
