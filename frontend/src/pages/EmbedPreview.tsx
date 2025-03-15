import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToolStore } from "utils/toolStore";
import { useUserGuardContext } from "app";
import { Copy, Check, ArrowLeft } from "lucide-react";
import { Button } from "components/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "components/Card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function EmbedPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserGuardContext();
  const { tools } = useToolStore();
  const [copied, setCopied] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [activeCopyType, setActiveCopyType] = useState<string | null>(null);
  
  // Get toolId from query params
  const queryParams = new URLSearchParams(location.search);
  const toolId = queryParams.get("toolId");
  
  // Find the tool
  const tool = tools.find(t => t.id === toolId);
  
  useEffect(() => {
    if (user && tool) {
      // In a real implementation, we would load the embed code from the tool
      // or generate it on the fly based on the tool's properties
      if (tool.embed_code) {
        setPreviewHtml(tool.embed_code);
      } else {
        // Fallback to a generic embed code if the tool doesn't have one
        setPreviewHtml(`
          <div class="tool-container" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">${tool.title}</h2>
            <p style="color: #666;">${tool.description}</p>
            <div class="tool-content" style="margin: 20px 0;">
              <!-- Tool content would go here -->
              <p style="font-style: italic; color: #999;">This is a placeholder for the ${tool.title} tool. The actual implementation would include interactive elements.</p>
            </div>
            <div class="tool-footer" style="font-size: 12px; color: #999; text-align: center;">
              Powered by <a href="https://www.themoneygate.com" style="color: #0066cc; text-decoration: none;">TheMoneyGate</a>
            </div>
          </div>
        `);
      }
    }
  }, [user, toolId, tool]);
  
  const handleCopyCode = (codeType: string, code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setActiveCopyType(codeType);
        toast.success("Code copied to clipboard");
        setTimeout(() => setActiveCopyType(null), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy code");
      });
  };
  
  const getIframeEmbedCode = () => {
    const encodedHtml = encodeURIComponent(previewHtml || "");
    return `<iframe src="data:text/html;charset=utf-8,${encodedHtml}" frameborder="0" width="100%" height="500"></iframe>`;
  };
  
  return (
    <div className="container max-w-6xl px-4 py-10 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tool Embed Preview</h1>
          <p className="text-zinc-600">Preview and get embed code for your tool</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/tool-generator")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tool Generator
        </Button>
      </div>
      
      {tool ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader className="bg-blue-50 border-b pb-4">
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Direct HTML Embed Code</h3>
                  <div className="relative">
                    <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto border border-gray-200 max-h-[300px]">
                      {previewHtml}
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopyCode('html', previewHtml || '')}
                    >
                      {activeCopyType === 'html' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">IFrame Embed Code</h3>
                  <div className="relative">
                    <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto border border-gray-200">
                      {getIframeEmbedCode()}
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopyCode('iframe', getIframeEmbedCode())}
                    >
                      {activeCopyType === 'iframe' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">How to Use This Embed Code</h3>
                  <p className="text-xs text-blue-700">
                    Copy the code above and paste it into your website HTML. The tool will appear wherever you place this code.
                    You can also use the iframe version if your platform doesn't support direct HTML embedding.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader className="bg-blue-50 border-b pb-4">
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See how your tool will look when embedded</CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                {previewHtml ? (
                  <div className="border rounded-lg p-4 bg-white">
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">Loading preview...</p>
                  </div>
                )}
                
                <div className="mt-6 bg-amber-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-amber-800 mb-1">Monetization Opportunity</h3>
                  <p className="text-xs text-amber-700">
                    This embedded tool creates a "Hidden Money Door" - visitors using this free tool can be introduced to higher-value
                    offerings related to {tool.category}. Consider adding affiliate links or promoting premium services.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-lg text-gray-500">Tool not found or still loading...</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/tool-generator")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tool Generator
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
