import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserGuardContext } from "app";
import { MonetizationAdvisor } from "components/MonetizationAdvisor";
import { useGeneratedToolsStore } from "utils/generatedToolsStore";
import { Alert } from "components/Alert";
import { LoadingSpinner } from "components/LoadingSpinner";

export default function ToolMonetization() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  const { tools, loading, error, getUserTools } = useGeneratedToolsStore();
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const toolId = searchParams.get("id");
    if (!toolId) {
      navigate("/generated-tools");
      return;
    }

    if (user) {
      getUserTools(user.uid).then(() => {
        setIsLoading(false);
      });
    }
  }, [user, getUserTools, searchParams, navigate]);

  useEffect(() => {
    const toolId = searchParams.get("id");
    if (toolId && tools.length > 0) {
      const tool = tools.find(t => t.id === toolId);
      if (tool) {
        setSelectedTool(tool);
      } else {
        // Tool not found
        navigate("/generated-tools");
      }
    }
  }, [tools, searchParams, navigate]);

  if (isLoading || loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert 
          title="Error loading tool"
          message="There was a problem loading your tool. Please try again later."
          variant="error"
        />
      </div>
    );
  }

  if (!selectedTool) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert 
          title="Tool not found"
          message="The tool you're looking for doesn't exist or you don't have access to it."
          variant="warning"
        />
        <div className="mt-4 flex justify-center">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={() => navigate("/generated-tools")}
          >
            Back to Tools
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Monetize Your Tool</h1>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Choose and implement a monetization strategy for your tool. 
          You can track implementation progress and measure results over time.
        </p>
      </div>
      
      <MonetizationAdvisor 
        toolId={selectedTool.id} 
        tool={selectedTool}
        standalone={true}
      />
    </div>
  );
}
