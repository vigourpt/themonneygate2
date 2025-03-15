import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserGuardContext } from "app";
import { Button } from "components/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "components/Card";
import { useGeneratedToolsStore, GeneratedTool } from "utils/generatedToolsStore";
import { EmbedCodeGenerator } from "components/EmbedCodeGenerator";
import { ArrowLeft, Download, FileSpreadsheet, FileText, Calculator, Trash2, RefreshCw, Clock, Share2, Code, DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function GeneratedTools() {
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  const { tools, loading, error, getUserTools, deleteGeneratedTool } = useGeneratedToolsStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showEmbedCode, setShowEmbedCode] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getUserTools(user.uid);
    }
  }, [user, getUserTools]);

  const getFileIcon = (fileType: string) => {
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

  const getFileTypeLabel = (fileType: string, fileFormat: string) => {
    switch (fileType) {
      case 'spreadsheet':
        return `Excel ${fileFormat.toUpperCase()}`;
      case 'document':
        return `Document ${fileFormat.toUpperCase()}`;
      case 'calculator':
        return `Calculator ${fileFormat.toUpperCase()}`;
      default:
        return fileFormat.toUpperCase();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDeleteTool = async (toolId: string) => {
    if (!user) return;
    
    try {
      setDeletingId(toolId);
      await deleteGeneratedTool(user.uid, toolId);
    } catch (error) {
      console.error('Error deleting tool:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleShareTool = (tool: GeneratedTool) => {
    // Copy download URL to clipboard
    navigator.clipboard.writeText(tool.downloadUrl);
    alert('Download link copied to clipboard!');
  };
  
  const toggleEmbedCode = (toolId: string) => {
    if (showEmbedCode === toolId) {
      setShowEmbedCode(null);
    } else {
      setShowEmbedCode(toolId);
    }
  };

  return (
    <div className="container max-w-6xl px-4 py-10 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Generated Tools</h1>
          <p className="text-zinc-600">Download, share, or manage your created financial tools</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <Button variant="primary" onClick={() => navigate("/tool-generator")}>
            Create New Tool
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-3" />
          <span>Loading your tools...</span>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-6 text-red-600">
              <p>An error occurred while loading your tools. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      ) : tools.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Generated Tools Yet</h3>
              <p className="text-zinc-500 mb-6">You haven't generated any financial tools yet. Start creating to build your library.</p>
              <Button variant="primary" onClick={() => navigate("/tool-generator")}>
                Create Your First Tool
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="p-4 bg-zinc-50 border-b">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-zinc-100 mr-3">
                    {getFileIcon(tool.fileType)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{tool.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {getFileTypeLabel(tool.fileType, tool.fileFormat)} • {formatFileSize(tool.fileSize)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-zinc-600 mb-4 line-clamp-2">{tool.description}</p>
                
                <div className="flex items-center text-xs text-zinc-500 mb-4">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Created {formatDistanceToNow(tool.createdAt, { addSuffix: true })}</span>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-2 mb-2">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="col-span-3"
                      as="a"
                      href={tool.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4 mr-1.5" /> Download
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="col-span-2"
                      onClick={() => navigate(`/tool-monetization?id=${tool.id}`)}
                    >
                      <DollarSign className="h-4 w-4 mr-1.5" /> Monetize
                    </Button>
                  </div>
                  <div className="flex space-x-2">

                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleEmbedCode(tool.id)}
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleShareTool(tool)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTool(tool.id)}
                      disabled={deletingId === tool.id}
                      className={deletingId === tool.id ? "opacity-70" : ""}
                    >
                      {deletingId === tool.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  </div>
                  
                  {showEmbedCode === tool.id && (
                    <EmbedCodeGenerator tool={tool} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
