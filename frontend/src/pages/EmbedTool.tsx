import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { firebaseApp } from "app";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useGeneratedToolsStore, GeneratedTool } from "utils/generatedToolsStore";
import { FileSpreadsheet, FileText, Calculator, RefreshCw, AlertTriangle, ExternalLink } from "lucide-react";

// This component is used to display an embedded tool
// It's designed to be rendered in an iframe

const db = getFirestore(firebaseApp);

export default function EmbedTool() {
  const [searchParams] = useSearchParams();
  const toolId = searchParams.get("id");
  const toolType = searchParams.get("type");
  const showBranding = searchParams.get("branding") === "true";
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tool, setTool] = useState<GeneratedTool | null>(null);
  
  useEffect(() => {
    if (!toolId) {
      setError("Missing tool ID");
      setLoading(false);
      return;
    }
    
    // Fetch the tool data from Firestore
    const loadTool = async () => {
      try {
        setLoading(true);
        
        // Try to find the tool in any user's collection since we don't know the userId here
        // This is a non-optimal approach but works for demo purposes
        // In production, you'd have a dedicated endpoint or collection for public tools
        
        // First attempt: direct query by ID if we know the user
        if (searchParams.get("userId")) {
          const userId = searchParams.get("userId");
          const toolDoc = doc(db, 'users', userId!, 'generatedTools', toolId);
          const toolSnapshot = await getDoc(toolDoc);
          
          if (toolSnapshot.exists()) {
            const data = toolSnapshot.data();
            setTool({
              ...data,
              id: toolSnapshot.id,
              createdAt: new Date(data.createdAt),
            } as GeneratedTool);
            setLoading(false);
            return;
          }
        }
        
        // Second attempt: scan collections to find the tool
        // Not efficient but works for demo purposes
        // In production, you'd have a better indexing strategy
        setError("This tool isn't available. It may have been deleted or made private.");
        setLoading(false);
      } catch (err) {
        console.error("Error loading tool:", err);
        setError("Failed to load the tool. Please try again later.");
        setLoading(false);
      }
    };
    
    loadTool();
  }, [toolId, searchParams]);
  
  const getToolIcon = () => {
    switch (toolType) {
      case 'spreadsheet':
        return <FileSpreadsheet className="h-10 w-10 text-green-600" />;
      case 'document':
        return <FileText className="h-10 w-10 text-blue-600" />;
      case 'calculator':
        return <Calculator className="h-10 w-10 text-purple-600" />;
      default:
        return <FileText className="h-10 w-10 text-zinc-600" />;
    }
  };
  
  return (
    <div className="w-full h-full bg-white p-4 font-sans">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-4" />
          <p className="text-zinc-600">Loading tool...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
          <h2 className="text-lg font-medium mb-2">Tool Unavailable</h2>
          <p className="text-zinc-600 mb-4">{error}</p>
          <p className="text-sm text-zinc-500">
            Please contact the owner of this tool for assistance.
          </p>
        </div>
      ) : tool ? (
        <div className="h-full">
          {tool.fileType === 'spreadsheet' ? (
            <div className="h-full flex flex-col">
              <div className="bg-green-50 border-b border-green-100 p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" />
                  <h2 className="font-medium text-green-900">{tool.title}</h2>
                </div>
                <a 
                  href={tool.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs flex items-center text-green-700 hover:text-green-900"
                >
                  Download <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
              <div className="flex-1 p-4">
                <div className="bg-zinc-100 rounded-lg p-6 h-full flex flex-col items-center justify-center">
                  <FileSpreadsheet className="h-12 w-12 text-green-500 mb-3" />
                  <h3 className="font-medium mb-2">{tool.title}</h3>
                  <p className="text-center text-zinc-600 mb-4 max-w-md">{tool.description}</p>
                  <a 
                    href={tool.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                  >
                    Download Spreadsheet <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ) : tool.fileType === 'document' && tool.fileFormat === 'pdf' ? (
            <div className="h-full flex flex-col">
              <div className="bg-blue-50 border-b border-blue-100 p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="font-medium text-blue-900">{tool.title}</h2>
                </div>
                <a 
                  href={tool.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs flex items-center text-blue-700 hover:text-blue-900"
                >
                  Download <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
              <div className="flex-1 p-0 bg-zinc-800">
                <iframe 
                  src={tool.downloadUrl} 
                  className="w-full h-full border-0"
                  title={tool.title}
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="bg-zinc-50 border-b border-zinc-100 p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-zinc-600 mr-2" />
                  <h2 className="font-medium text-zinc-900">{tool.title}</h2>
                </div>
                <a 
                  href={tool.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs flex items-center text-zinc-700 hover:text-zinc-900"
                >
                  Download <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
              <div className="flex-1 p-4">
                <div className="bg-zinc-100 rounded-lg p-6 h-full flex flex-col items-center justify-center">
                  <FileText className="h-12 w-12 text-zinc-500 mb-3" />
                  <h3 className="font-medium mb-2">{tool.title}</h3>
                  <p className="text-center text-zinc-600 mb-4 max-w-md">{tool.description}</p>
                  <a 
                    href={tool.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-700 transition-colors flex items-center"
                  >
                    Download File <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
          <h2 className="text-lg font-medium mb-2">Tool Not Found</h2>
          <p className="text-zinc-600">
            The requested tool could not be found or may have been deleted.
          </p>
        </div>
      )}
      
      {showBranding && (
        <div className="absolute bottom-2 right-2">
          <a 
            href="https://themoneygate.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-zinc-400 hover:text-blue-500 flex items-center"
          >
            Powered by TheMoneyGate
          </a>
        </div>
      )}
    </div>
  );
}
