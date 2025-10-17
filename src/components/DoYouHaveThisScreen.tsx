/**
 * DoYouHaveThis Screen Component
 * 
 * Relevance check screen for recalled products
 * Allows users to confirm if they own a specific recalled product
 * Uses same styling as recall detail modal for consistency
 */
import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Camera, Keyboard } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface DoYouHaveThisScreenProps {
  recall?: {
    id: string;
    productName: string;
    model: string;
    image: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    confidence: number;
    matchBasis: string;
    manufacturer: string;
    date: string;
  };
  onConfirm?: (hasProduct: boolean) => void;
  onClose?: () => void;
  onNavigateToActionGuide?: () => void;
}

export function DoYouHaveThisScreen({ recall, onConfirm, onClose, onNavigateToActionGuide }: DoYouHaveThisScreenProps) {
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | 'unsure' | null>(null);
  const [showNoConfirmation, setShowNoConfirmation] = useState(false);

  // Demo recall data if none provided
  const defaultRecall = {
    id: '1',
    productName: 'DreamNest Baby Crib',
    model: 'DN-2024-CR',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
    severity: 'Critical' as const,
    confidence: 98,
    matchBasis: 'UPC',
    manufacturer: 'DreamNest Inc.',
    date: '2024-01-15'
  };

  const currentRecall = recall || defaultRecall;

  const handleConfirm = (hasProduct: boolean) => {
    if (onConfirm) {
      onConfirm(hasProduct);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <h1 className="text-xl font-semibold text-foreground">Do You Have This?</h1>
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

      {/* Calm Gray Banner */}
      <div className="px-6 pt-4 pb-6">
        <div className="text-center py-2">
          <p className="font-medium" style={{ fontSize: '14px', color: '#666' }}>
            Check if this affects you
          </p>
        </div>
      </div>

      {/* Large Product Image - 600x600px center-aligned */}
      <div className="flex justify-center px-6 mb-6">
        <div className="w-full max-w-[600px] aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-soft">
          <img
            src={currentRecall.image}
            alt={currentRecall.productName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Product Details Card */}
      <div className="px-6">
        <Card className="bg-white rounded-2xl shadow-soft p-4 space-y-4">
          {/* Product Info */}
          <div className="space-y-2">
            {/* Product Name - 18px bold */}
            <h2 className="font-semibold text-foreground" style={{ fontSize: '18px' }}>
              {currentRecall.productName}
            </h2>
            
            {/* Model Number - 14px medium gray */}
            <p className="font-medium" style={{ fontSize: '14px', color: '#666' }}>
              Model: {currentRecall.model}
            </p>
            
            {/* Helper Link - blue text, underlined */}
            <button className="text-primary underline" style={{ fontSize: '14px' }}>
              Where to find this model number?
            </button>
            
            {/* Trust Line - 12px gray */}
            <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
              Match basis: {currentRecall.matchBasis} • Confidence {currentRecall.confidence}%
            </p>
          </div>

          {/* Severity Badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant={currentRecall.severity === 'Critical' ? 'destructive' : 'default'}
              className={cn(
                "text-xs px-3 py-1",
                currentRecall.severity === 'High' && "bg-orange-100 text-orange-700 hover:bg-orange-100",
                currentRecall.severity === 'Medium' && "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
              )}
            >
              {currentRecall.severity} Risk
            </Badge>
            <span className="text-xs text-muted-foreground">
              Issued {new Date(currentRecall.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Manufacturer Info */}
          <div className="bg-muted/30 rounded-xl p-3">
            <p className="text-sm text-muted-foreground">
              Manufacturer: <span className="font-medium text-foreground">{currentRecall.manufacturer}</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Relevance Question - Centered */}
      <div className="px-6 mt-6">
        <h3 className="text-center font-semibold" style={{ fontSize: '18px', color: '#333' }}>
          Do you have this exact product?
        </h3>
      </div>

      {/* Primary Actions - Two Buttons */}
      <div className="px-6 mt-6 space-y-4">
        {/* Yes Button - Amber */}
        <button
          onClick={() => {
            setSelectedOption('yes');
            handleConfirm(true);
            // Navigate to Action Guide with slide animation
            if (onNavigateToActionGuide) {
              onNavigateToActionGuide();
            }
          }}
          className="w-full h-14 font-semibold transition-all hover:opacity-90 active:scale-98"
          style={{
            backgroundColor: '#FFC95E',
            color: '#333',
            borderRadius: '12px',
            fontSize: '16px'
          }}
        >
          Yes, we have this
        </button>

        {/* No Button - Green */}
        <button
          onClick={() => {
            setSelectedOption('no');
            handleConfirm(false);
            // Show confirmation modal
            setShowNoConfirmation(true);
          }}
          className="w-full h-14 font-semibold transition-all hover:opacity-90 active:scale-98"
          style={{
            backgroundColor: '#C3E6C3',
            color: '#333',
            borderRadius: '12px',
            fontSize: '16px'
          }}
        >
          No, we don't
        </button>
      </div>

      {/* Footer Link - More Details */}
      <div className="px-6 mt-4 text-center">
        <button
          className="font-medium"
          style={{ fontSize: '14px', color: '#007AFF' }}
        >
          More details →
        </button>
      </div>

      {/* "No" Confirmation Modal Overlay */}
      {showNoConfirmation && (
        <div 
          className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50 animate-in fade-in duration-200"
          onClick={() => {
            setShowNoConfirmation(false);
            if (onClose) onClose();
          }}
        >
          <Card 
            className="max-w-sm w-full bg-white shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4 text-center">
              {/* Checkmark Icon */}
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>

              {/* Confirmation Message */}
              <div className="space-y-2">
                <p className="font-semibold text-foreground" style={{ fontSize: '18px' }}>
                  Thanks for checking
                </p>
                <p className="text-sm text-muted-foreground">
                  We'll continue to monitor for you.
                </p>
              </div>

              {/* Close Button */}
              <Button
                onClick={() => {
                  setShowNoConfirmation(false);
                  if (onClose) onClose();
                }}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
                style={{ borderRadius: '12px' }}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
