/**
 * RecallDetailStep2 Component (recall_detail_step2)
 * "Action Guide" - Step-by-step checklist to resolve recall
 * 
 * Second step in the recall detail flow
 * Provides actionable steps with checkboxes
 * 
 * DESIGN SPECS:
 * - Frame width: 420px
 * - Background: #FAFAFA (matches parent)
 * - Header: "Let's handle this together."
 * - 3-step checklist (Stop use, Verify model, Contact manufacturer)
 * - Primary CTA: "Mark as Done" (navigates to Step 3)
 * - Secondary CTA: "Save Details"
 */
import React, { useState } from 'react';
import { Phone, Mail, ExternalLink, ChevronLeft, Download, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { cn } from './ui/utils';

interface RecallDetailStep2Props {
  recall: {
    id: string;
    productName: string;
    brand?: string;
    model: string;
    manufacturer: string;
    actions: string[];
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    contactInfo?: {
      phone?: string;
      email?: string;
      website?: string;
    };
    hours_available?: string;
    vin_check_url?: string;
    recall_type?: 'product' | 'food' | 'drug' | 'vehicle';
    hazard_details?: string;
    description?: string;
  };
  onComplete: () => void;
  onBack?: () => void;
  onShowVisualGuide?: () => void;
}

export function RecallDetailStep2({ recall, onComplete, onBack, onShowVisualGuide }: RecallDetailStep2Props) {
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [isWhyMattersExpanded, setIsWhyMattersExpanded] = useState(false);
  const [expandedStepId, setExpandedStepId] = useState<number | null>(null);
  const [isContactExpanded, setIsContactExpanded] = useState(false);

  // Fixed 3-step checklist
  const steps = [
    {
      id: 1,
      label: 'Stop using the product immediately',
      description: 'For your baby\'s safety, discontinue use right away',
      icon: '⚠️'
    },
    {
      id: 2,
      label: 'Verify your model number',
      description: 'Check if your specific model is affected',
      icon: '🔍',
      hasVisualGuide: true
    },
    {
      id: 3,
      label: 'Contact manufacturer for remedy',
      description: 'Get your refund, replacement, or repair',
      icon: '📞'
    }
  ];

  const totalSteps = steps.length;
  const allStepsComplete = checkedSteps.length === totalSteps;

  const toggleStep = (stepId: number) => {
    setCheckedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const toggleStepExpansion = (stepId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedStepId(expandedStepId === stepId ? null : stepId);
  };

  const handleSaveDetails = () => {
    toast.success('Recall details saved to your Safety tab', {
      duration: 2500,
      style: {
        background: '#DBEAFE',
        color: '#1E40AF',
        border: '1px solid #93C5FD',
        fontSize: '14px',
      },
    });
  };

  const handleMarkAsDone = () => {
    if (allStepsComplete) {
      onComplete(); // Navigate to Step 3
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ paddingBottom: 'clamp(16px, 3vh, 24px)' }}>
      {/* Header with Back Button */}
      <div className="px-5 flex-shrink-0" style={{ paddingTop: 'clamp(16px, 3vh, 24px)', paddingBottom: 'clamp(12px, 2vh, 16px)' }}>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-colors mb-3"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        
        {/* Main Header */}
        <h2 style={{ fontSize: 'clamp(18px, 2.5vh, 20px)', fontWeight: 600, color: '#212121', lineHeight: '1.3' }}>
          Let's handle this together.
        </h2>
        
        {/* Progress Indicator */}
        <p style={{ fontSize: 'clamp(12px, 1.6vh, 13px)', color: '#888888', marginTop: '4px' }}>
          Step 2 of 3
        </p>
      </div>

      <div className="px-5 flex-1 min-h-0 overflow-y-auto" style={{ 
        paddingTop: 'clamp(12px, 2vh, 16px)',
        paddingBottom: 'clamp(12px, 2vh, 16px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(12px, 2vh, 16px)'
      }}>
        {/* Product Context */}
        <div className="space-y-1 flex-shrink-0">
          <p style={{ fontSize: 'clamp(13px, 1.8vh, 14px)', fontWeight: 600, color: '#424242' }}>
            {recall.brand && <span>{recall.brand} </span>}
            {recall.productName}
          </p>
          <p style={{ fontSize: 'clamp(11px, 1.5vh, 12px)', color: '#888888' }}>
            Model: {recall.model}
          </p>
        </div>

        {/* WHY THIS MATTERS - Collapsible, 2 lines max */}
        {(recall.hazard_details || recall.description) && (
          <div
            className="rounded-xl flex-shrink-0"
            style={{ 
              backgroundColor: '#DBEAFE',
              padding: 'clamp(10px, 1.5vh, 12px)'
            }}
          >
            <div className="space-y-2">
              <h3 style={{ fontSize: 'clamp(12px, 1.6vh, 13px)', fontWeight: 600, color: '#424242' }}>
                Why this matters
              </h3>
              
              <p 
                style={{ 
                  fontSize: 'clamp(11px, 1.5vh, 12px)', 
                  color: '#555555', 
                  lineHeight: '1.5',
                  display: '-webkit-box',
                  WebkitLineClamp: isWhyMattersExpanded ? 'unset' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: isWhyMattersExpanded ? 'visible' : 'hidden'
                }}
              >
                {recall.hazard_details || recall.description}
              </p>
              
              {(recall.hazard_details || recall.description).length > 120 && (
                <button
                  onClick={() => setIsWhyMattersExpanded(!isWhyMattersExpanded)}
                  style={{ fontSize: 'clamp(11px, 1.5vh, 12px)', fontWeight: 500, color: '#4f46e5' }}
                  className="hover:underline"
                >
                  {isWhyMattersExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          </div>
        )}

        <Separator className="bg-gray-200 flex-shrink-0" />

        {/* What you should do - Compact Checklist */}
        <div className="space-y-2 flex-shrink-0">
          <h3 style={{ fontSize: 'clamp(13px, 1.8vh, 14px)', fontWeight: 600, color: '#424242' }}>
            What you should do
          </h3>

          {steps.map((step, index) => {
            const isChecked = checkedSteps.includes(step.id);
            const isExpanded = expandedStepId === step.id;
            
            return (
              <div
                key={step.id}
                className="rounded-lg border transition-all duration-200"
                style={{
                  borderColor: isChecked ? '#4f46e5' : '#E5E7EB',
                  backgroundColor: isChecked ? '#EEF2FF' : '#FFFFFF',
                  maxHeight: isExpanded ? '200px' : '48px',
                  overflow: 'hidden'
                }}
              >
                {/* Compact Header - Adaptive height */}
                <button
                  onClick={() => toggleStep(step.id)}
                  className="w-full flex items-center gap-2 text-left px-3 py-2.5 hover:bg-gray-50/50 transition-colors"
                  style={{ 
                    minHeight: 'clamp(44px, 6vh, 48px)', 
                    maxHeight: 'clamp(44px, 6vh, 48px)' 
                  }}
                >
                  {/* Checkbox */}
                  <Checkbox
                    checked={isChecked}
                    className={cn(
                      "w-5 h-5 rounded-md border-2 flex-shrink-0",
                      isChecked && "bg-[#4f46e5] border-[#4f46e5]"
                    )}
                  />

                  {/* Icon */}
                  <span style={{ fontSize: 'clamp(14px, 2vh, 16px)' }} className="flex-shrink-0">{step.icon}</span>

                  {/* Step Label */}
                  <div className="flex-1 min-w-0">
                    <p 
                      style={{ 
                        fontSize: 'clamp(12px, 1.6vh, 13px)', 
                        fontWeight: 600, 
                        color: isChecked ? '#4f46e5' : '#424242',
                        lineHeight: '1.3',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {step.label}
                    </p>
                  </div>

                  {/* Expand Toggle */}
                  <button
                    onClick={(e) => toggleStepExpansion(step.id, e)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </button>

                {/* Expanded Content - Shows when tapped */}
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-2 border-t border-gray-100">
                    <p style={{ fontSize: 'clamp(11px, 1.5vh, 12px)', color: '#888888', lineHeight: '1.5', paddingTop: '8px' }}>
                      {step.description}
                    </p>
                    
                    {/* Visual Guide link on step 2 */}
                    {step.hasVisualGuide && onShowVisualGuide && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowVisualGuide();
                        }}
                        style={{ fontSize: 'clamp(11px, 1.5vh, 12px)', fontWeight: 500, color: '#4f46e5' }}
                        className="hover:underline flex items-center gap-1"
                      >
                        Visual Guide
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>



        {/* Vehicle VIN Check - if applicable */}
        {recall.recall_type === 'vehicle' && recall.vin_check_url && (
          <div className="rounded-lg flex-shrink-0" style={{ padding: 'clamp(10px, 1.5vh, 12px)', backgroundColor: '#EFF6FF' }}>
            <a
              href={recall.vin_check_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between hover:underline"
            >
              <div>
                <p style={{ fontSize: 'clamp(11px, 1.5vh, 12px)', fontWeight: 600, color: '#1E40AF' }}>
                  Check your VIN online
                </p>
                <p style={{ fontSize: 'clamp(10px, 1.4vh, 11px)', color: '#3B82F6' }}>
                  Verify if your vehicle is affected
                </p>
              </div>
              <ExternalLink className="w-4 h-4" style={{ color: '#4f46e5' }} />
            </a>
          </div>
        )}

        {/* Manufacturer Contact - Accordion/Collapsible */}
        <div 
          className="rounded-lg border border-gray-200 overflow-hidden flex-shrink-0"
          style={{ backgroundColor: isContactExpanded ? '#FEF3C7' : '#FFFFFF' }}
        >
          {/* Accordion Header */}
          <button
            onClick={() => setIsContactExpanded(!isContactExpanded)}
            className="w-full flex items-center justify-between hover:bg-gray-50 transition-colors"
            style={{ padding: 'clamp(10px, 1.5vh, 12px)' }}
          >
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" style={{ color: '#92400E' }} />
              <span style={{ fontSize: 'clamp(12px, 1.6vh, 13px)', fontWeight: 600, color: '#424242' }}>
                Need help contacting the company?
              </span>
            </div>
            {isContactExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {/* Accordion Content */}
          {isContactExpanded && (
            <div className="px-3 pb-3 space-y-3 border-t border-amber-100">
              {/* Company name */}
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#212121', paddingTop: '8px' }}>
                {recall.manufacturer}
              </p>

              {/* Contact Information */}
              <div className="space-y-2">
                {/* Phone number */}
                {recall.contactInfo?.phone && (
                  <a
                    href={`tel:${recall.contactInfo.phone}`}
                    className="flex items-center gap-2 hover:underline"
                    style={{ fontSize: '12px', color: '#92400E', fontWeight: 500 }}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{recall.contactInfo.phone}</span>
                  </a>
                )}

                {/* Email */}
                {recall.contactInfo?.email && (
                  <a
                    href={`mailto:${recall.contactInfo.email}`}
                    className="flex items-center gap-2 hover:underline"
                    style={{ fontSize: '12px', color: '#92400E', fontWeight: 500 }}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{recall.contactInfo.email}</span>
                  </a>
                )}

                {/* Website link */}
                {recall.contactInfo?.website && (
                  <a
                    href={recall.contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline"
                    style={{ fontSize: '12px', color: '#92400E', fontWeight: 500 }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Visit manufacturer site</span>
                  </a>
                )}
              </div>

              {/* Quick Contact Buttons */}
              <div className="flex gap-2">
                {/* Call Now - Primary button */}
                {recall.contactInfo?.phone && (
                  <Button
                    variant="default"
                    className="flex-1 rounded-lg min-h-[40px]"
                    style={{ backgroundColor: '#92400E', fontSize: '12px', fontWeight: 600 }}
                    onClick={() => window.location.href = `tel:${recall.contactInfo?.phone}`}
                  >
                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                    Call Now
                  </Button>
                )}

                {/* Email - Secondary button if email exists */}
                {recall.contactInfo?.email && (
                  <Button
                    variant="outline"
                    className="flex-1 rounded-lg min-h-[40px]"
                    style={{ fontSize: '12px', fontWeight: 600, borderColor: '#92400E', color: '#92400E' }}
                    onClick={() => window.location.href = `mailto:${recall.contactInfo?.email}`}
                  >
                    <Mail className="w-3.5 h-3.5 mr-1.5" />
                    Email
                  </Button>
                )}
              </div>

              {/* Hours available */}
              {recall.hours_available && (
                <p 
                  className="text-center" 
                  style={{ fontSize: '11px', color: '#92400E', opacity: 0.8 }}
                >
                  📅 {recall.hours_available}
                </p>
              )}
            </div>
          )}
        </div>

        {/* CTA Buttons - Always Visible */}
        <div className="space-y-2 pt-2 flex-shrink-0">
          {/* Progress Indicator - Compact */}
          <div className="flex items-center justify-center gap-2 pb-1">
            <span style={{ fontSize: 'clamp(11px, 1.5vh, 12px)', fontWeight: 500, color: '#888888' }}>
              {checkedSteps.length}/{totalSteps} steps completed
            </span>
            {allStepsComplete && (
              <span style={{ fontSize: 'clamp(11px, 1.5vh, 12px)', fontWeight: 600, color: '#059669' }}>
                ✓
              </span>
            )}
          </div>

          {/* Primary CTA: Mark as Done */}
          <Button
            onClick={handleMarkAsDone}
            disabled={!allStepsComplete}
            className="w-full rounded-xl transition-all duration-300"
            style={{ 
              backgroundColor: allStepsComplete ? '#059669' : '#E5E7EB',
              color: allStepsComplete ? '#FFFFFF' : '#9CA3AF',
              fontSize: 'clamp(13px, 1.8vh, 14px)', 
              fontWeight: 600,
              cursor: allStepsComplete ? 'pointer' : 'not-allowed',
              minHeight: 'clamp(44px, 6vh, 48px)'
            }}
          >
            {allStepsComplete ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Done
              </>
            ) : (
              'Complete all steps to continue'
            )}
          </Button>
          
          {/* Secondary CTA: Save Details */}
          <Button
            onClick={handleSaveDetails}
            variant="outline"
            className="w-full rounded-xl"
            style={{ 
              fontSize: 'clamp(12px, 1.6vh, 13px)', 
              fontWeight: 600, 
              borderColor: '#4f46e5',
              color: '#4f46e5',
              minHeight: 'clamp(40px, 5.5vh, 44px)'
            }}
          >
            <Download className="w-3.5 h-3.5 mr-2" />
            Save Details
          </Button>
        </div>

        {/* Reassurance Text */}
        <div className="text-center pt-2 flex-shrink-0">
          <p style={{ fontSize: 'clamp(12px, 1.6vh, 13px)', fontStyle: 'italic', color: '#6D6D6D', lineHeight: '1.5' }}>
            You're doing great. Emma's safety comes first.
          </p>
        </div>
      </div>
    </div>
  );
}
