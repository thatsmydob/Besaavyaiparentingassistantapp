/**
 * ActionGuide Screen Component
 * 
 * Guided resolution screen for handling recalled products
 * Provides step-by-step checklist to help parents take action
 * Uses same styling as recall detail modal for consistency
 */
import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle2, ExternalLink, Phone } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { cn } from './ui/utils';

interface ActionGuideScreenProps {
  recall?: {
    id: string;
    productName: string;
    model: string;
    manufacturer: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
  };
  onClose?: () => void;
  onResolved?: () => void; // Callback when recall is marked as resolved
}

export function ActionGuideScreen({ recall, onClose, onResolved }: ActionGuideScreenProps) {
  const [checkedSteps, setCheckedSteps] = useState<string[]>(['step1']); // Step 1 checked by default
  const [showModelGuide, setShowModelGuide] = useState(false);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);

  // Demo recall data if none provided
  const defaultRecall = {
    id: '1',
    productName: 'DreamNest Baby Crib',
    model: 'DN-2024-CR',
    manufacturer: 'DreamNest Inc.',
    severity: 'Critical' as const
  };

  const currentRecall = recall || defaultRecall;

  const steps = [
    {
      id: 'step1',
      label: 'Stop using the product immediately',
      locked: true, // Checked by default, cannot uncheck
      description: 'For your baby\'s safety, discontinue use right away'
    },
    {
      id: 'step2',
      label: 'Check model number',
      action: 'Visual guide',
      description: 'Verify you have the recalled model'
    },
    {
      id: 'step3',
      label: 'Contact manufacturer',
      description: 'Get your refund or replacement'
    }
  ];

  // Show completion overlay when all steps are done
  useEffect(() => {
    if (checkedSteps.length === steps.length) {
      const timer = setTimeout(() => {
        setShowCompletionOverlay(true);
      }, 500); // Small delay for smooth transition
      return () => clearTimeout(timer);
    }
  }, [checkedSteps.length, steps.length]);

  const toggleStep = (stepId: string) => {
    if (stepId === 'step1') return; // Step 1 cannot be unchecked
    
    setCheckedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">Action Guide</h1>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Main Card - Matches recall detail modal style */}
      <Card className="bg-white rounded-2xl shadow-soft p-4 space-y-6">
        {/* Header Section */}
        <div className="space-y-3">
          {/* Title - 20px bold #333 */}
          <h2 className="font-bold" style={{ fontSize: '20px', color: '#333' }}>
            Let's handle this together
          </h2>

          {/* Pill Label - Amber background */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5" style={{ 
            backgroundColor: '#FFF3CD',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '14px' }}>⚠️</span>
            <span className="font-medium" style={{ fontSize: '14px', color: '#856404' }}>
              Important
            </span>
          </div>

          {/* Product Reference */}
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              Product: <span className="font-medium text-foreground">{currentRecall.productName}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Model: <span className="font-medium text-foreground">{currentRecall.model}</span>
            </p>
          </div>
        </div>

        {/* Checklist Section - Rounded card container */}
        <div className="bg-muted/20 rounded-2xl p-4 space-y-4">
          <h3 className="font-semibold text-foreground">Action Steps</h3>

          {/* Checklist Items */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isChecked = checkedSteps.includes(step.id);
              
              return (
                <div key={step.id}>
                  <div
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer",
                      isChecked 
                        ? "bg-blue-50/50 border border-blue-100" 
                        : "bg-white border border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"
                    )}
                    onClick={() => toggleStep(step.id)}
                  >
                    {/* Large Checkbox */}
                    <div className="pt-0.5">
                      <Checkbox
                        checked={isChecked}
                        disabled={step.locked}
                        className={cn(
                          "w-6 h-6 rounded-md border-2",
                          isChecked && "bg-blue-600 border-blue-600",
                          step.locked && "opacity-100"
                        )}
                      />
                    </div>

                    {/* Label and Description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        {/* Step Label - 16px semibold */}
                        <p className="font-semibold" style={{ fontSize: '16px', color: '#333' }}>
                          Step {index + 1}: {step.label}
                        </p>

                        {/* Action Link */}
                        {step.action && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (step.id === 'step2') {
                                setShowModelGuide(!showModelGuide);
                              }
                            }}
                            className="text-blue-600 font-medium flex items-center gap-1 hover:underline flex-shrink-0"
                            style={{ fontSize: '14px' }}
                          >
                            {step.action}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mt-1">
                        {step.description}
                      </p>

                      {/* Visual Guide (Step 2) */}
                      {step.id === 'step2' && showModelGuide && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                          <p className="text-sm font-medium text-foreground mb-2">
                            Where to find the model number:
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1.5">
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              <span>Check the bottom or back of the product</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              <span>Look for a white or silver label/sticker</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              <span>Model number format: DN-2024-CR</span>
                            </li>
                          </ul>
                        </div>
                      )}

                      {/* Contact Info (Step 3) */}
                      {step.id === 'step3' && (
                        <div className="mt-3 space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-700"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call {currentRecall.manufacturer}
                          </Button>
                          <p className="text-xs text-muted-foreground px-1">
                            Reference recall code: {currentRecall.id.toUpperCase()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Indicator - Removed to use bottom progress bar instead */}

        {/* Completion Message */}
        {checkedSteps.length === steps.length && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">
                All steps completed
              </p>
              <p className="text-sm text-green-700 mt-1">
                You've taken the right steps to keep your baby safe. We'll monitor this recall for any updates.
              </p>
            </div>
          </div>
        )}

        {/* Manufacturer Contact Card */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold" style={{ fontSize: '16px', color: '#333' }}>
            Manufacturer Contact
          </h3>
          
          <div className="space-y-2">
            <p className="text-sm text-foreground">
              Call: <span className="font-medium">1-888-555-NEST (6378)</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Best time to call: Mon-Fri, 9AM-5PM EST
            </p>
          </div>

          <Button
            className="w-full h-12 bg-primary hover:bg-primary/90 rounded-xl"
            onClick={() => {
              // Call functionality
              window.location.href = 'tel:+18885556378';
            }}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </Button>

          <p className="text-xs text-muted-foreground text-center pt-1">
            We verified this number with CPSC.
          </p>
        </div>
      </Card>

      {/* Support Message */}
      <div className="mt-6 text-center">
        <p className="italic" style={{ fontSize: '14px', color: '#666' }}>
          You're doing great. Emma's safety comes first.
        </p>
      </div>

      {/* Save + Reminder Buttons */}
      <div className="mt-6 flex items-center gap-4">
        <Button
          variant="outline"
          className="flex-1 h-12 font-medium"
          style={{ borderRadius: '8px' }}
          onClick={() => {
            // Save details functionality
          }}
        >
          Save Details
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-12 font-medium"
          style={{ borderRadius: '8px' }}
          onClick={() => {
            // Set reminder functionality
          }}
        >
          Set Reminder
        </Button>
      </div>

      {/* Additional Resources */}
      <Card className="mt-6 bg-white rounded-2xl shadow-soft p-4">
        <h3 className="font-semibold text-foreground mb-3">Need More Help?</h3>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-auto py-3 px-3 hover:bg-blue-50"
          >
            <div className="flex-1">
              <p className="font-medium text-foreground">CPSC Safety Hotline</p>
              <p className="text-sm text-muted-foreground">1-800-638-2772 • Available 24/7</p>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-auto py-3 px-3 hover:bg-blue-50"
          >
            <div className="flex-1">
              <p className="font-medium text-foreground">Report a Safety Issue</p>
              <p className="text-sm text-muted-foreground">Submit concerns directly to CPSC</p>
            </div>
          </Button>
        </div>
      </Card>

      {/* Bottom Progress Bar */}
      <div className="mt-6 space-y-2">
        <p className="text-sm text-center text-muted-foreground">
          Step {checkedSteps.length} of {steps.length}
        </p>
        <div 
          className="w-full rounded"
          style={{ 
            backgroundColor: '#F3F4F6',
            height: '6px',
            borderRadius: '4px'
          }}
        >
          <div
            className="transition-all duration-500"
            style={{ 
              backgroundColor: '#3B82F6',
              height: '6px',
              borderRadius: '4px',
              width: `${(checkedSteps.length / steps.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Completion Overlay */}
      {checkedSteps.length === steps.length && (
        <div 
          className="fixed inset-0 bg-black/20 flex items-center justify-center p-6 z-50 animate-in fade-in duration-300"
          onClick={() => setShowCompletionOverlay(false)}
        >
          <Card 
            className="max-w-md w-full shadow-2xl"
            style={{ backgroundColor: '#E7F8E7' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4 text-center">
              {/* Success Message */}
              <div className="space-y-2">
                <p className="font-semibold" style={{ fontSize: '18px', color: '#333' }}>
                  ✅ Great job — Emma's environment is safer now.
                </p>
                <p className="text-sm text-muted-foreground">
                  This recall has been marked as resolved.
                </p>
              </div>

              {/* Completed Steps Summary */}
              <div className="bg-white/60 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">
                  What you accomplished:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Stopped using the recalled product</span>
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Verified model number</span>
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Contacted manufacturer</span>
                  </li>
                </ul>
              </div>

              {/* Back Button */}
              <Button
                onClick={() => {
                  setShowCompletionOverlay(false);
                  // Mark recall as resolved and navigate back
                  if (onResolved) onResolved();
                  if (onClose) onClose();
                }}
                className="w-full h-12 bg-green-700 hover:bg-green-800 text-white"
                style={{ borderRadius: '12px' }}
              >
                Back to Safety Center
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
