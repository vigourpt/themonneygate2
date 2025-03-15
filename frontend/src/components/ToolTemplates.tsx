import React, { useState } from "react";
import { Calculator, FileSpreadsheet, FileText, Download, Eye } from "lucide-react";
import { Button } from "components/Button";
import { Card, CardContent } from "components/Card";

interface ToolTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: "spreadsheet" | "template" | "calculator";
  previewUrl: string;
}

export function ToolTemplates() {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  
  const templates: ToolTemplate[] = [
    {
      id: "savings-tracker",
      title: "Savings Goal Tracker",
      description: "Track progress towards multiple savings goals with visual indicators",
      icon: <FileSpreadsheet className="h-6 w-6" />,
      type: "spreadsheet",
      previewUrl: "/assets/savings-tracker-preview.jpg"
    },
    {
      id: "debt-payoff",
      title: "Debt Payoff Planner",
      description: "Compare different debt payoff strategies and create a personalized plan",
      icon: <Calculator className="h-6 w-6" />,
      type: "calculator",
      previewUrl: "/assets/debt-payoff-preview.jpg"
    },
    {
      id: "mortgage-letter",
      title: "Mortgage Hardship Letter",
      description: "Professionally formatted template for requesting mortgage forbearance",
      icon: <FileText className="h-6 w-6" />,
      type: "template",
      previewUrl: "/assets/mortgage-letter-preview.jpg"
    },
    {
      id: "budget-template",
      title: "Monthly Budget Spreadsheet",
      description: "Comprehensive budget template with expense categorization and analysis",
      icon: <FileSpreadsheet className="h-6 w-6" />,
      type: "spreadsheet",
      previewUrl: "/assets/budget-template-preview.jpg"
    },
  ];
  
  // In a real app, these would be actual download actions
  const handleDownload = (templateId: string) => {
    console.log(`Downloading template: ${templateId}`);
    // Would trigger actual download here
  };
  
  const handlePreview = (templateId: string) => {
    setActiveTemplate(activeTemplate === templateId ? null : templateId);
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Example Tool Templates</h3>
        <Button variant="outline" size="sm">
          View All Templates
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-md bg-blue-100 text-blue-600 mr-3">
                    {template.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{template.title}</h4>
                    <span className="text-xs text-zinc-500 capitalize">{template.type}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {activeTemplate === template.id && (
              <div className="w-full bg-zinc-100 h-32 flex items-center justify-center border-b">
                {/* In a real app, this would show an actual preview */}
                <div className="text-zinc-400 flex flex-col items-center">
                  <FileText size={24} />
                  <span className="text-xs mt-1">Preview not available in demo</span>
                </div>
              </div>
            )}
            
            <CardContent className="p-4">
              <p className="text-xs text-zinc-600 mb-4">{template.description}</p>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handlePreview(template.id)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  {activeTemplate === template.id ? "Hide Preview" : "Preview"}
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleDownload(template.id)}
                >
                  <Download className="h-3 w-3 mr-1" /> Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 mt-6 border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">How to Use These Templates</h4>
        <p className="text-sm text-blue-700">These templates are examples of the free content you can create to attract traffic. After downloading, customize them with your branding and affiliate links to high-value services.</p>
      </div>
    </div>
  );
}
