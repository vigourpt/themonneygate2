import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserGuardContext } from "app";
import { Button } from "components/Button";
import { Card, CardContent } from "components/Card";
import { FileSpreadsheet, FileText, Calculator, Download, Plus, RefreshCw, Settings, Check, ExternalLink } from "lucide-react";
import { useGeneratedToolsStore, SpreadsheetOptions, DocumentOptions } from "utils/generatedToolsStore";


type ToolType = "spreadsheet" | "document" | "calculator";

interface TemplateOption {
  id: string;
  title: string;
  description: string;
  type: ToolType;
  icon: React.ReactNode;
}

export function ToolCreator() {
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  const { generateSpreadsheet, generateDocument, loading } = useGeneratedToolsStore();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customizationComplete, setCustomizationComplete] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [generatedTool, setGeneratedTool] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  
  const templates: TemplateOption[] = [
    {
      id: "savings-tracker",
      title: "Savings Goal Tracker",
      description: "Track progress towards multiple savings goals with visual indicators",
      type: "spreadsheet",
      icon: <FileSpreadsheet className="h-5 w-5" />
    },
    {
      id: "debt-payoff",
      title: "Debt Payoff Planner",
      description: "Compare different debt payoff strategies and create a personalized plan",
      type: "calculator",
      icon: <Calculator className="h-5 w-5" />
    },
    {
      id: "mortgage-letter",
      title: "Mortgage Hardship Letter",
      description: "Professionally formatted template for requesting mortgage forbearance",
      type: "document",
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: "budget-template",
      title: "Monthly Budget Spreadsheet",
      description: "Comprehensive budget template with expense categorization and analysis",
      type: "spreadsheet",
      icon: <FileSpreadsheet className="h-5 w-5" />
    },
  ];
  
  const [customizations, setCustomizations] = useState({
    title: "",
    description: "",
    targetAudience: "beginners",
    complexity: "simple",
    includeBranding: true,
    includeResourceLinks: true
  });
  
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCustomizations({
        ...customizations,
        title: template.title,
        description: template.description
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCustomizations({
        ...customizations,
        [name]: checked
      });
    } else {
      setCustomizations({
        ...customizations,
        [name]: value
      });
    }
  };
  
  const handleSubmitCustomizations = async () => {
    if (!user) {
      setErrorMessage('You must be logged in to generate tools');
      return;
    }
    
    setErrorMessage(null);
    setCustomizationComplete(true);
    
    try {
      // Find the selected template
      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) {
        throw new Error('Template not found');
      }
      
      let result;
      
      // Generate the appropriate file type based on the template
      if (template.type === 'spreadsheet') {
        const options: SpreadsheetOptions = {
          title: customizations.title,
          description: customizations.description,
          targetAudience: customizations.targetAudience,
          complexity: customizations.complexity,
          includeBranding: customizations.includeBranding,
          includeResourceLinks: customizations.includeResourceLinks,
          templateId: template.id,
        };
        
        result = await generateSpreadsheet(user.uid, options);
      } else if (template.type === 'document') {
        const options: DocumentOptions = {
          title: customizations.title,
          description: customizations.description,
          targetAudience: customizations.targetAudience,
          complexity: customizations.complexity,
          includeBranding: customizations.includeBranding,
          includeResourceLinks: customizations.includeResourceLinks,
          templateId: template.id,
        };
        
        result = await generateDocument(user.uid, options);
      } else {
        throw new Error('Unsupported template type');
      }
      
      setGeneratedTool(result);
      setGenerationComplete(true);
    } catch (error) {
      console.error('Error generating tool:', error);
      setErrorMessage('Failed to generate tool. Please try again.');
      setCustomizationComplete(false);
    }
  };

  
  const getTemplateTypeColor = (type: ToolType) => {
    switch(type) {
      case "spreadsheet":
        return "bg-green-100 text-green-700";
      case "document":
        return "bg-blue-100 text-blue-700";
      case "calculator":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };
  
  const startOver = () => {
    setSelectedTemplate(null);
    setCustomizationComplete(false);
    setGenerationComplete(false);
    setCustomizations({
      title: "",
      description: "",
      targetAudience: "beginners",
      complexity: "simple",
      includeBranding: true,
      includeResourceLinks: true
    });
  };
  
  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-6">
          {!selectedTemplate ? (
            // Step 1: Template Selection
            <div>
              <h3 className="text-lg font-semibold mb-4">Select a Template to Customize</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div 
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className="border rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-md ${getTemplateTypeColor(template.type)} mr-3`}>
                        {template.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{template.title}</h4>
                        <span className="text-xs text-zinc-500 capitalize">{template.type}</span>
                        <p className="text-sm text-zinc-600 mt-2">{template.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => {}}
                  className="flex items-center"
                >
                  <Plus size={16} className="mr-2" /> Create Custom Template
                </Button>
              </div>
            </div>
          ) : !customizationComplete ? (
            // Step 2: Template Customization
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Customize Your Template</h3>
                <Button variant="outline" size="sm" onClick={startOver}>
                  Start Over
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-zinc-700 mb-1">Tool Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={customizations.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={customizations.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="targetAudience" className="block text-sm font-medium text-zinc-700 mb-1">Target Audience</label>
                    <select
                      id="targetAudience"
                      name="targetAudience"
                      value={customizations.targetAudience}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="beginners">Beginners</option>
                      <option value="intermediate">Intermediate Users</option>
                      <option value="advanced">Advanced Users</option>
                      <option value="professional">Professionals</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="complexity" className="block text-sm font-medium text-zinc-700 mb-1">Complexity</label>
                    <select
                      id="complexity"
                      name="complexity"
                      value={customizations.complexity}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="simple">Simple</option>
                      <option value="standard">Standard</option>
                      <option value="detailed">Detailed</option>
                      <option value="comprehensive">Comprehensive</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="includeBranding"
                      checked={customizations.includeBranding}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Include Branding</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="includeResourceLinks"
                      checked={customizations.includeResourceLinks}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Include Resource Links</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t flex justify-end">
                <Button 
                  variant="primary" 
                  onClick={handleSubmitCustomizations}
                  className="flex items-center"
                >
                  <Settings size={16} className="mr-2" /> Generate Tool
                </Button>
              </div>
            </div>
          ) : (
            // Step 3: Generation Results
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Your Tool Is Ready</h3>
                <Button variant="outline" size="sm" onClick={startOver}>
                  Create Another Tool
                </Button>
              </div>
              
              {errorMessage ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-100 text-red-700">
                    {errorMessage}
                  </div>
                  <Button variant="outline" onClick={startOver}>
                    Try Again
                  </Button>
                </div>
              ) : !generationComplete ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <RefreshCw size={32} className="text-blue-600 animate-spin mb-4" />
                  <p className="text-zinc-600">Generating your custom tool...</p>
                  <p className="text-sm text-zinc-500 mt-2">This typically takes 15-30 seconds</p>
                </div>
              ) : (
                <div>
                  <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-100 flex items-start">
                    <Check size={20} className="text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-800 mb-1">Tool Successfully Generated!</h4>
                      <p className="text-green-700 text-sm">Your custom {customizations.title} is ready to download and use.</p>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-50 border rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-lg">{generatedTool?.title || customizations.title}</h4>
                        <p className="text-sm text-zinc-600 mt-1">{generatedTool?.description || customizations.description}</p>
                        <div className="flex mt-4 space-x-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Target: {customizations.targetAudience}</span>
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">Complexity: {customizations.complexity}</span>
                          {customizations.includeBranding && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Branded</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button 
                          variant="outline" 
                          className="flex items-center"
                          onClick={() => navigate('/generated-tools')}
                        >
                          <ExternalLink size={16} className="mr-2" /> View All
                        </Button>
                        
                        <Button 
                          variant="primary" 
                          className="flex items-center"
                          as="a"
                          href={generatedTool?.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download size={16} className="mr-2" /> Download
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                      <li>Download your tool and review it to make sure it meets your needs</li>
                      <li>Add your branding and customize it further as needed</li>
                      <li>Move to the next step to integrate monetization strategies</li>
                      <li>View all your generated tools in the <a href="/generated-tools" className="text-blue-600 underline">tool library</a></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
