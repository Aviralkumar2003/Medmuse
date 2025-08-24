import * as React from "react"
import { cn } from "@/lib/utils"
import { Progress } from "./progress"
import { Badge } from "./badge"
import { CheckCircle, Circle, AlertCircle } from "lucide-react"

interface ProgressStep {
  id: string
  label: string
  description: string
  status: 'pending' | 'active' | 'completed' | 'error'
  required?: boolean
}

interface ProgressIndicatorProps {
  steps: ProgressStep[]
  currentStep: string
  className?: string
  showProgress?: boolean
}

export function ProgressIndicator({ 
  steps, 
  currentStep, 
  className,
  showProgress = true 
}: ProgressIndicatorProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStep)
  const completedSteps = steps.filter(step => step.status === 'completed').length
  const progressPercentage = (completedSteps / steps.length) * 100

  const getStepIcon = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'active':
        return <Circle className="h-4 w-4 text-primary fill-current" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStepColor = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-600'
      case 'active':
        return 'text-primary'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <Badge variant="secondary">
              {completedSteps}/{steps.length} completed
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      )}

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
              step.status === 'active' && "border-primary bg-primary/5",
              step.status === 'completed' && "border-green-200 bg-green-50",
              step.status === 'error' && "border-red-200 bg-red-50",
              step.status === 'pending' && "border-border bg-background"
            )}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getStepIcon(step)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={cn(
                  "text-sm font-medium",
                  getStepColor(step)
                )}>
                  {step.label}
                </h4>
                {step.required && (
                  <Badge variant="outline" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {step.description}
              </p>
            </div>

            {/* Step Number */}
            <div className="flex-shrink-0">
              <Badge 
                variant={step.status === 'active' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {index + 1}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Status */}
      {completedSteps === steps.length && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium text-green-900 text-sm">
                All steps completed!
              </p>
              <p className="text-xs text-green-700">
                You're ready to save your symptom entry.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
