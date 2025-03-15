import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserGuardContext } from "app";
import { Button } from "components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "components/Card";
import { DollarSign, ArrowRight, Link, ExternalLink, PieChart, BarChart3, ChevronDown, ChevronUp, CheckCircle, RefreshCw, AlertCircle, FileSpreadsheet, FileText, Calculator, ArrowLeft } from "lucide-react";
import { useMonetizationStore, MonetizationMethod, affiliatePrograms } from "utils/monetizationStore";
import { GeneratedTool } from "utils/generatedToolsStore";

interface Props {
  toolId?: string;
  tool?: GeneratedTool;
  standalone?: boolean;
}

interface MonetizationOption {
  id: MonetizationMethod;
  title: string;
  description: string;
  icon: React.ReactNode;
  profitPotential: number; // 1-10
  effortLevel: number; // 1-10
  conversionRate: number; // 1-10
}

export function MonetizationAdvisor({ toolId, tool, standalone = false }: Props) {
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  const { 
    strategies, 
    loading, 
    error, 
    getToolStrategies, 
    saveStrategy,
    updateImplementationStatus,
    getRecommendedAffiliates
  } = useMonetizationStore();
  
  const [selectedMethod, setSelectedMethod] = useState<MonetizationMethod | null>(null);
  const [expandedOptionId, setExpandedOptionId] = useState<string | null>(null);
  const [selectedAffiliates, setSelectedAffiliates] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filteredAffiliates, setFilteredAffiliates] = useState(affiliatePrograms);
  const [implementationNotes, setImplementationNotes] = useState('');
  const [implementation, setImplementation] = useState({
    implemented: false,
    strategyId: ''
  });
  
  // Load existing strategies for this tool when component mounts
  useEffect(() => {
    if (user && toolId) {
      getToolStrategies(user.uid, toolId).then(loadedStrategies => {
        // If there's an existing strategy, load it
        if (loadedStrategies.length > 0) {
          const latestStrategy = loadedStrategies[0]; // Assuming sorted by createdAt desc
          setSelectedMethod(latestStrategy.selectedMethod);
          if (latestStrategy.selectedAffiliates) {
            setSelectedAffiliates(latestStrategy.selectedAffiliates);
          }
          setImplementation({
            implemented: latestStrategy.implemented,
            strategyId: latestStrategy.id
          });
          if (latestStrategy.implementationNotes) {
            setImplementationNotes(latestStrategy.implementationNotes);
          }
        }
      });
    }
  }, [user, toolId, getToolStrategies]);
  
  // Filter affiliates based on tool type and category when tool changes
  useEffect(() => {
    if (tool) {
      const recommendedAffiliates = getRecommendedAffiliates(tool.fileType, tool.customizationOptions?.targetAudience);
      setFilteredAffiliates(recommendedAffiliates);
    }
  }, [tool, getRecommendedAffiliates]);
  
  const toggleOption = (id: string) => {
    setExpandedOptionId(expandedOptionId === id ? null : id);
  };
  
  const toggleAffiliate = (id: string) => {
    if (selectedAffiliates.includes(id)) {
      setSelectedAffiliates(selectedAffiliates.filter(affId => affId !== id));
    } else {
      setSelectedAffiliates([...selectedAffiliates, id]);
    }
  };
  
  const handleSaveStrategy = async () => {
    if (!user || !toolId || !selectedMethod) return;
    
    try {
      setIsSaving(true);
      const strategyId = await saveStrategy(user.uid, {
        toolId,
        selectedMethod,
        selectedAffiliates: selectedMethod === "affiliate" ? selectedAffiliates : undefined,
        implemented: false,
      });
      
      setImplementation({
        implemented: false,
        strategyId
      });
      
      setSuccessMessage("Monetization strategy saved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error saving strategy:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleUpdateImplementation = async (implemented: boolean) => {
    if (!user || !implementation.strategyId) return;
    
    try {
      setIsSaving(true);
      await updateImplementationStatus(user.uid, implementation.strategyId, implemented, implementationNotes);
      
      setImplementation(prev => ({
        ...prev,
        implemented
      }));
      
      setSuccessMessage(implemented ? "Implementation tracked successfully!" : "Implementation status updated!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error updating implementation:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Get tool icon based on file type
  const getToolIcon = (fileType?: string) => {
    switch (fileType) {
      case 'spreadsheet':
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case 'document':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'calculator':
        return <Calculator className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-zinc-600" />;
    }
  };
  
  const getToolSpecificAdvice = () => {
    if (!tool) return null;
    
    let advice = "";
    
    switch (tool.fileType) {
      case 'spreadsheet':
        advice = "Spreadsheets are excellent for affiliate marketing. Consider adding a 'Resources' tab with affiliate links to financial tools and services related to the spreadsheet's purpose.";
        break;
      case 'document':
        advice = "Documents work well with contextual affiliate links. Include a 'Recommended Resources' section at the end with affiliate links to services that can help the reader take action.";
        break;
      case 'calculator':
        advice = "Calculators have high conversion potential. Show relevant financial product offers based on the user's calculation results, with affiliate links to those products.";
        break;
      default:
        advice = "Consider which monetization method best matches your tool's purpose and audience.";
    }
    
    return advice;
  };
  
  const monetizationOptions: MonetizationOption[] = [
    {
      id: "affiliate",
      title: "Affiliate Links",
      description: "Earn commissions by referring users to relevant financial products and services",
      icon: <Link className="h-5 w-5" />,
      profitPotential: 8,
      effortLevel: 3,
      conversionRate: 6
    },
    {
      id: "ads",
      title: "Display Advertising",
      description: "Show targeted ads from financial service providers to your audience",
      icon: <ExternalLink className="h-5 w-5" />,
      profitPotential: 5,
      effortLevel: 2,
      conversionRate: 4
    },
    {
      id: "upsell",
      title: "Premium Upsells",
      description: "Offer enhanced versions of your tools or custom consultations",
      icon: <BarChart3 className="h-5 w-5" />,
      profitPotential: 9,
      effortLevel: 7,
      conversionRate: 5
    },
    {
      id: "membership",
      title: "Membership Program",
      description: "Create a premium membership with access to all your tools and exclusive content",
      icon: <PieChart className="h-5 w-5" />,
      profitPotential: 10,
      effortLevel: 9,
      conversionRate: 3
    }
  ];
  
  // Use the filtered affiliates from our store
  const affiliateOptions = filteredAffiliates;
  
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-600";
    if (rating >= 5) return "text-yellow-600";
    return "text-red-500";
  };
  
  const renderRatingBar = (value: number, label: string) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className={getRatingColor(value)}>{value}/10</span>
      </div>
      <div className="w-full bg-zinc-100 rounded-full h-1.5">
        <div
          className={`h-full rounded-full ${value >= 8 ? 'bg-green-500' : value >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${value * 10}%` }}
        ></div>
      </div>
    </div>
  );
  
  return (
    <div className="w-full">
      {tool && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50 mr-3">
                {getToolIcon(tool.fileType)}
              </div>
              <div>
                <h3 className="font-medium">{tool.title}</h3>
                <p className="text-sm text-zinc-500">{tool.fileType.charAt(0).toUpperCase() + tool.fileType.slice(1)} • {tool.fileFormat.toUpperCase()}</p>
              </div>
              
              {standalone && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-auto"
                  onClick={() => navigate("/generated-tools")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Tools
                </Button>
              )}
            </div>
            
            {/* Custom monetization advice based on tool type */}
            <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-700">{getToolSpecificAdvice()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent className="p-6">
          {!selectedMethod ? (
            // Method Selection
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose a Monetization Strategy</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {monetizationOptions.map((option) => (
                  <div
                    key={option.id}
                    className="border rounded-lg overflow-hidden cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div 
                      className="p-4" 
                      onClick={() => toggleOption(option.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-md mr-3 text-blue-700">
                            {option.icon}
                          </div>
                          <h4 className="font-medium">{option.title}</h4>
                        </div>
                        <button className="p-1 text-zinc-500">
                          {expandedOptionId === option.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                      <p className="text-sm text-zinc-600 mt-2">{option.description}</p>
                    </div>
                    
                    {expandedOptionId === option.id && (
                      <div className="p-4 border-t bg-zinc-50">
                        {renderRatingBar(option.profitPotential, "Profit Potential")}
                        {renderRatingBar(option.effortLevel, "Implementation Effort")}
                        {renderRatingBar(option.conversionRate, "Typical Conversion Rate")}
                        
                        <Button 
                          variant="primary" 
                          className="mt-3 w-full"
                          onClick={() => setSelectedMethod(option.id)}
                        >
                          Select This Strategy
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Pro Tip</h4>
                <p className="text-sm text-blue-700">
                  For best results, consider using a combination of strategies. Many successful monetization approaches use affiliate links as the main revenue source, supplemented by ad revenue and premium upgrades.
                </p>
              </div>
            </div>
          ) : selectedMethod === "affiliate" ? (
            // Affiliate Integration
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Select Affiliate Programs</h3>
                <Button variant="outline" size="sm" onClick={() => setSelectedMethod(null)}>
                  Back to Strategies
                </Button>
              </div>
              
              <div className="mb-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Affiliate Strategy Best Practices</h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                  <li>Select affiliates that align with your tool's purpose</li>
                  <li>Integrate affiliate links naturally within your tool's content</li>
                  <li>Be transparent about affiliate relationships</li>
                  <li>Focus on value to the user first, revenue second</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <table className="w-full border-collapse">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th className="text-left p-3 border text-sm font-medium">Select</th>
                      <th className="text-left p-3 border text-sm font-medium">Affiliate Program</th>
                      <th className="text-left p-3 border text-sm font-medium">Category</th>
                      <th className="text-left p-3 border text-sm font-medium">Commission</th>
                      <th className="text-left p-3 border text-sm font-medium">Conv. Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliateOptions.map((affiliate) => (
                      <tr 
                        key={affiliate.id} 
                        className={`hover:bg-blue-50 cursor-pointer ${selectedAffiliates.includes(affiliate.id) ? 'bg-blue-50' : ''}`}
                        onClick={() => toggleAffiliate(affiliate.id)}
                      >
                        <td className="p-3 border text-center">
                          <div className="flex justify-center">
                            {selectedAffiliates.includes(affiliate.id) ? (
                              <CheckCircle size={18} className="text-green-600" />
                            ) : (
                              <div className="w-4 h-4 border rounded-sm" />
                            )}
                          </div>
                        </td>
                        <td className="p-3 border">
                          <div className="font-medium">{affiliate.name}</div>
                          <a href={affiliate.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600">View program details</a>
                        </td>
                        <td className="p-3 border text-sm">{affiliate.category}</td>
                        <td className="p-3 border text-sm">{affiliate.commission}</td>
                        <td className="p-3 border text-sm">{affiliate.conversionRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg mb-4">
                <h4 className="font-medium text-green-800 mb-2">Revenue Potential</h4>
                <p className="text-sm text-green-700">
                  With your current selections, your estimated potential monthly revenue is:
                </p>
                <div className="text-xl font-bold text-green-700 mt-2">
                  $500 - $1,500 <span className="text-sm font-normal">(based on 1,000 monthly visitors)</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="primary"
                  disabled={selectedAffiliates.length === 0 || isSaving}
                  className="flex items-center"
                  onClick={handleSaveStrategy}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <DollarSign size={16} className="mr-2" />
                      Apply Monetization Strategy
                    </>
                  )}
                </Button>
              </div>
              
              {successMessage && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  <div className="flex items-center">
                    <CheckCircle size={18} className="mr-2" />
                    {successMessage}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Other strategies (simplified)
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Configure {selectedMethod === "ads" ? "Advertising" : selectedMethod === "upsell" ? "Premium Upsells" : "Membership Program"}</h3>
                <Button variant="outline" size="sm" onClick={() => setSelectedMethod(null)}>
                  Back to Strategies
                </Button>
              </div>
              
              <div className="py-12 text-center">
                <p className="text-zinc-600 mb-4">This feature is not available in the demo.</p>
                <p className="text-sm text-zinc-500">In the full version, you would be able to configure:</p>
                <ul className="text-sm text-zinc-500 list-disc inline-block text-left mt-2">
                  {selectedMethod === "ads" && (
                    <>
                      <li>Ad network integration</li>
                      <li>Ad placement within your tools</li>
                      <li>Audience targeting options</li>
                    </>
                  )}
                  {selectedMethod === "upsell" && (
                    <>
                      <li>Premium tool features</li>
                      <li>Pricing tiers</li>
                      <li>Upsell messaging</li>
                    </>
                  )}
                  {selectedMethod === "membership" && (
                    <>
                      <li>Membership levels</li>
                      <li>Subscription pricing</li>
                      <li>Member benefits</li>
                    </>
                  )}
                </ul>
                
                <Button variant="primary" className="mt-6" onClick={() => setSelectedMethod(null)}>
                  Back to Strategy Selection
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedMethod === "affiliate" && selectedAffiliates.length > 0 && (
        <div className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Strategic Placement of Affiliate Links</h3>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-1/2 p-4 bg-zinc-50 rounded-lg border">
                  <h4 className="font-medium mb-3">Tool Content</h4>
                  <div className="space-y-4">
                    <div className="p-3 border bg-white rounded-md">
                      <h5 className="font-medium text-sm mb-2">Introduction Section</h5>
                      <p className="text-sm text-zinc-600">Include general affiliate links to relevant financial education resources</p>
                    </div>
                    <div className="p-3 border bg-white rounded-md">
                      <h5 className="font-medium text-sm mb-2">Tool Interface</h5>
                      <p className="text-sm text-zinc-600">Place targeted affiliate links next to relevant features (e.g., loan calculator → loan offers)</p>
                    </div>
                    <div className="p-3 border bg-white rounded-md">
                      <h5 className="font-medium text-sm mb-2">Results Section</h5>
                      <p className="text-sm text-zinc-600">Show personalized recommendations based on user inputs</p>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <ArrowRight className="h-8 w-8 text-zinc-300" />
                </div>
                <div className="block md:hidden mx-auto">
                  <ArrowRight className="h-8 w-8 text-zinc-300 rotate-90" />
                </div>
                
                <div className="w-full md:w-1/2 p-4 bg-zinc-50 rounded-lg border">
                  <h4 className="font-medium mb-3">Selected Affiliate Programs</h4>
                  <div className="space-y-3">
                    {selectedAffiliates.map(id => {
                      const affiliate = affiliateOptions.find(a => a.id === id);
                      if (!affiliate) return null;
                      
                      return (
                        <div key={id} className="flex items-center bg-white p-3 border rounded-md">
                          <div className="p-1.5 bg-blue-100 rounded text-blue-700 mr-3">
                            <Link size={14} />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{affiliate.name}</div>
                            <div className="text-xs text-zinc-500">{affiliate.category} | {affiliate.commission}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {implementation.strategyId && (
        <Card className="mt-6">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">Implementation Tracking</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {implementation.implemented ? (
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-medium text-green-800">Monetization Strategy Implemented</h4>
                    <p className="text-sm text-green-700 mt-1">{implementationNotes || "No implementation notes."}</p>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => handleUpdateImplementation(false)}
                    >
                      Mark as Not Implemented
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-3 text-zinc-600">Track your progress by marking when you've implemented this monetization strategy for your tool.</p>
                
                <div className="mb-4">
                  <label htmlFor="implementation-notes" className="block text-sm font-medium text-zinc-700 mb-1">
                    Implementation Notes (Optional)
                  </label>
                  <textarea
                    id="implementation-notes"
                    value={implementationNotes}
                    onChange={(e) => setImplementationNotes(e.target.value)}
                    placeholder="Describe what you implemented, placement of links, etc."
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    rows={3}
                  />
                </div>
                
                <Button
                  variant="primary"
                  onClick={() => handleUpdateImplementation(true)}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>Mark as Implemented</>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}