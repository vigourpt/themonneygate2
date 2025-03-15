import React from "react";
import { ArrowRight, Check, Clock, Lock } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ProcessFlowDiagramProps {
  steps: Step[];
  completedSteps: number[];
  currentlyWorking: number;
  onSelectStep: (stepId: number) => void;
}

export function ProcessFlowDiagram({ 
  steps, 
  completedSteps, 
  currentlyWorking,
  onSelectStep
}: ProcessFlowDiagramProps) {
  return (
    <div className="w-full overflow-auto py-6">
      <div className="min-w-[768px]">
        <div className="flex items-start">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isActive = currentlyWorking === step.id;
            const isLocked = !isCompleted && !isActive;
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
                  {/* Step Circle with Icon */}
                  <button
                    onClick={() => onSelectStep(step.id)}
                    className={`relative flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all ${isCompleted 
                      ? 'bg-green-100 text-green-600 border-2 border-green-400' 
                      : isActive
                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-400' 
                        : 'bg-zinc-100 text-zinc-400 border-2 border-zinc-200'}`}
                  >
                    {isCompleted ? (
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    ) : isActive ? (
                      <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                        <Clock className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="absolute -top-1 -right-1 bg-zinc-300 rounded-full p-1">
                        <Lock className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <div className="text-lg font-semibold">{step.id}</div>
                  </button>
                  
                  {/* Step Title and Description */}
                  <div className="text-center px-2">
                    <h3 className={`font-medium text-sm ${isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-zinc-500'}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{step.description}</p>
                  </div>
                </div>
                
                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="flex items-center self-center pt-8">
                    <ArrowRight className={`h-5 w-5 ${isCompleted ? 'text-green-500' : 'text-zinc-300'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Flow Connection Line */}
        <div className="relative h-1 bg-zinc-200 mt-8 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-500" 
            style={{ 
              width: `${(Math.max(...completedSteps) / steps.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
