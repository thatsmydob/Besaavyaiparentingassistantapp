/**
 * RecallDetailModal Component - 3-Step Flow Orchestrator
 * 
 * Manages the flow between three recall detail screens:
 * - Step 1: Do You Have This? (recall_detail_step1)
 * - Step 2: Action Guide (recall_detail_step2)
 * - Step 3: Completion Overlay (recall_detail_step3)
 * 
 * All frames have identical width (420px) and background color for smooth transitions
 * Uses Motion for smooth slide animations between steps
 * 
 * DESIGN CONSISTENCY:
 * - Max width: 420px
 * - Background: #FAFAFA (calm gray)
 * - Rounded corners: 16px
 * - Smooth 300ms transitions (ease-in-out)
 * 
 * PROGRESS TRACKING:
 * - Sticky progress bar shows current step
 * - Auto-advances based on user actions
 * - Can navigate back to previous steps
 */
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { cn } from './ui/utils';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

// Import the three step components
import { RecallDetailStep1 } from './RecallDetailStep1';
import { RecallDetailStep2 } from './RecallDetailStep2';
import { RecallDetailStep3 } from './RecallDetailStep3';

interface RecallDetailModalProps {
  recall: {
    id: string;
    productName: string;
    brand?: string;
    model: string;
    image: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    date: string;
    confidence: number;
    reason: string;
    description: string;
    hazard_details?: string;
    affected_units?: string;
    manufacturer: string;
    actions: string[];
    remedy_type?: string[];
    hours_available?: string;
    recall_type?: 'product' | 'food' | 'drug' | 'vehicle';
    food_label_image?: string;
    lot_number?: string;
    expiry_date?: string;
    dosage?: string;
    vin?: string;
    vin_check_url?: string;
    contactInfo?: {
      phone?: string;
      email?: string;
      website?: string;
    };
    officialLinks?: {
      cpsc?: string;
      fda?: string;
      nhtsa?: string;
      manufacturer?: string;
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onShowVisualGuide?: () => void;
  onReportIssue?: (recall: any) => void;
}

export function RecallDetailModal({ recall, isOpen, onClose, onCloseWithSuccess, onShowVisualGuide, onReportIssue }: RecallDetailModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  
  // Reset to step 1 when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSlideDirection('forward');
    }
  }, [isOpen]);
  
  if (!recall) return null;

  // Navigation handlers
  const handleStep1Confirm = (hasProduct: boolean) => {
    if (hasProduct) {
      // User has the product - navigate to Step 2 (Action Guide)
      setSlideDirection('forward');
      setCurrentStep(2);
    } else {
      // User doesn't have product - show toast and close modal
      toast.success("Thanks, we'll keep monitoring for you.", {
        duration: 2000,
        style: {
          background: '#D1FAE5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
          fontSize: '14px',
        },
      });
      
      // Close modal after a brief delay to let user see the toast
      setTimeout(() => {
        onClose();
      }, 300);
    }
  };

  const handleStep2Complete = () => {
    setSlideDirection('forward');
    setCurrentStep(3);
  };

  const handleStep3Done = () => {
    onClose();
  };

  const handleBackToStep1 = () => {
    setSlideDirection('backward');
    setCurrentStep(1);
  };

  const handleBackToStep2 = () => {
    setSlideDirection('backward');
    setCurrentStep(2);
  };

  // Slide animation variants
  const slideVariants = {
    enter: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  // Progress steps for sticky bar
  const progressSteps = [
    { number: 1, label: 'Check Product' },
    { number: 2, label: 'Take Action' },
    { number: 3, label: 'Done' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-[420px] overflow-hidden p-0 rounded-2xl"
        style={{ 
          backgroundColor: '#FAFAFA',
          height: 'min(90vh, 100dvh - 80px)', // Dynamic height accounting for bottom nav
          maxHeight: '90vh'
        }}
      >
        {/* Hidden accessibility labels */}
        <VisuallyHidden.Root>
          <DialogTitle>{recall.productName} Recall - Step {currentStep} of 3</DialogTitle>
          <DialogDescription>
            {currentStep === 1 && 'Confirm if you have this recalled product'}
            {currentStep === 2 && 'Follow action steps to resolve the recall'}
            {currentStep === 3 && 'Recall resolution completed'}
          </DialogDescription>
        </VisuallyHidden.Root>

        <div className="relative h-full flex flex-col">
          {/* Close Button - Floating top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Sticky Progress Tracker */}
          <div
            className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex-shrink-0"
            style={{ 
              padding: 'clamp(10px, 2vh, 16px) 20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="flex items-center justify-between gap-2">
              {progressSteps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex items-center gap-2 flex-1">
                    {/* Step indicator */}
                    <motion.div
                      className="relative flex items-center justify-center flex-shrink-0"
                      animate={{
                        scale: currentStep === step.number ? 1 : 0.85,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                          currentStep === step.number
                            ? "bg-[#4f46e5] shadow-md shadow-indigo-200"
                            : currentStep > step.number
                            ? "bg-emerald-500"
                            : "bg-gray-200"
                        )}
                      >
                        {currentStep > step.number ? (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: currentStep === step.number ? '#ffffff' : '#888888'
                            }}
                          >
                            {step.number}
                          </span>
                        )}
                      </div>
                      
                      {/* Active indicator pulse */}
                      {currentStep === step.number && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-[#4f46e5]"
                          initial={{ scale: 1, opacity: 0.3 }}
                          animate={{ scale: 1.4, opacity: 0 }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                    
                    {/* Step label */}
                    <motion.span
                      animate={{
                        fontWeight: currentStep === step.number ? 600 : 400,
                        color: currentStep === step.number ? '#212121' : '#888888'
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {step.label}
                    </motion.span>
                  </div>
                  
                  {/* Connector line between steps */}
                  {index < progressSteps.length - 1 && (
                    <div className="relative h-[2px] flex-shrink-0" style={{ width: '24px' }}>
                      <div className="absolute inset-0 bg-gray-200" />
                      <motion.div
                        className="absolute inset-0 bg-[#4f46e5]"
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: currentStep > step.number ? 1 : 0
                        }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        style={{ transformOrigin: 'left' }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Current step label below */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 text-center"
            >
              <p style={{ fontSize: '11px', color: '#888888' }}>
                Step {currentStep} of {progressSteps.length}
              </p>
            </motion.div>
          </div>

          {/* Animated Step Content Container - Flexible height */}
          <div className="relative overflow-hidden flex-1 min-h-0">
            <AnimatePresence mode="wait" custom={slideDirection}>
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ 
                    duration: 0.2, 
                    ease: 'easeInOut' // Smart Animate 200ms ease-in-out
                  }}
                  className="absolute inset-0 overflow-y-auto"
                  style={{ 
                    scrollbarWidth: 'thin',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  <RecallDetailStep1
                    recall={recall}
                    onConfirm={handleStep1Confirm}
                  />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ 
                    duration: 0.2, 
                    ease: 'easeInOut' // Smart Animate 200ms ease-in-out
                  }}
                  className="absolute inset-0 overflow-y-auto"
                  style={{ 
                    scrollbarWidth: 'thin',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  <RecallDetailStep2
                    recall={recall}
                    onComplete={handleStep2Complete}
                    onBack={handleBackToStep1}
                    onShowVisualGuide={onShowVisualGuide}
                  />
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ 
                    duration: 0.2, 
                    ease: 'easeInOut' // Smart Animate 200ms ease-in-out
                  }}
                  className="absolute inset-0 overflow-y-auto"
                  style={{ 
                    scrollbarWidth: 'thin',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  <RecallDetailStep3
                    recall={{
                      id: recall.id,
                      productName: recall.productName,
                      brand: recall.brand,
                      model: recall.model,
                      actions: recall.actions,
                    }}
                    onClose={() => {
                      // Close with success callback if available (from Step 3 completion)
                      if (onCloseWithSuccess) {
                        onCloseWithSuccess();
                      } else {
                        onClose();
                      }
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
