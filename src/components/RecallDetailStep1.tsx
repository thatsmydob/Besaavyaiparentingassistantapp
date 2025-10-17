/**
 * RecallDetailStep1 Component (recall_detail_step1)
 * "Do You Have This?" - Product Confirmation Screen
 * 
 * First step in the recall detail flow
 * Allows users to confirm if they own the recalled product
 * 
 * DESIGN SPECS:
 * - Frame width: 420px
 * - Background: #FAFAFA (matches parent)
 * - Category header with emoji
 * - Responsive image carousel (max 35vh, ~220-260px)
 * - Horizontal swipeable carousel with pagination dots (up to 3 images)
 * - Overlay severity badge & confidence chip on image (top-right)
 * - 16px rounded corners, light shadow
 * - Product Name + Model snaps immediately beneath carousel
 * - Collapsible "More details" metadata
 * - "Why this matters" section with hazard summary
 * - Two CTA buttons: "Yes, I have this" (primary) / "No, I don't" (secondary)
 */
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Badge } from './ui/badge';

interface RecallDetailStep1Props {
  recall: {
    id: string;
    productName: string;
    brand?: string;
    model: string;
    image: string;
    images?: string[]; // Optional array for carousel (up to 3 images)
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    date: string;
    confidence: number;
    reason: string;
    description: string;
    hazard_details?: string;
    affected_units?: string;
    manufacturer: string;
    recall_type?: 'product' | 'food' | 'drug' | 'vehicle';
    food_label_image?: string;
    lot_number?: string;
    expiry_date?: string;
    dosage?: string;
    vin?: string;
    remedy_type?: string[];
  };
  onConfirm: (hasProduct: boolean) => void;
}

export function RecallDetailStep1({ recall, onConfirm }: RecallDetailStep1Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Build image array (up to 3 images)
  // Priority: custom images array > food label image > default image
  const images = recall.images && recall.images.length > 0
    ? recall.images.slice(0, 3)
    : [
        recall.recall_type === 'food' && recall.food_label_image 
          ? recall.food_label_image 
          : recall.image
      ];

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return { bg: '#DC2626', text: '#FFFFFF' };
      case 'High':
        return { bg: '#EA580C', text: '#FFFFFF' };
      case 'Medium':
        return { bg: '#D97706', text: '#FFFFFF' };
      case 'Low':
        return { bg: '#65A30D', text: '#FFFFFF' };
      default:
        return { bg: '#6B7280', text: '#FFFFFF' };
    }
  };

  // Get category header label based on recall type
  const getCategoryHeader = (type?: string) => {
    switch (type) {
      case 'food':
        return { emoji: '🔴', label: 'Do Not Consume' };
      case 'drug':
        return { emoji: '🧴', label: 'Medical Product Recall' };
      case 'vehicle':
        return { emoji: '🚗', label: 'Vehicle Safety Recall' };
      case 'product':
      default:
        return { emoji: '⚠️', label: 'Stop Using Product' };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const categoryHeader = getCategoryHeader(recall.recall_type);

  const severityColor = getSeverityColor(recall.severity);

  return (
    <div className="h-full flex flex-col" style={{ paddingBottom: 'clamp(16px, 3vh, 24px)' }}>
      {/* Category Header Label */}
      <div className="px-5 flex-shrink-0" style={{ paddingTop: 'clamp(16px, 3vh, 24px)', paddingBottom: 'clamp(12px, 2vh, 16px)' }}>
        <div 
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ 
            backgroundColor: recall.recall_type === 'food' ? '#FEF3C7' : '#DBEAFE',
            fontSize: '13px',
            fontWeight: 600,
            color: recall.recall_type === 'food' ? '#92400E' : '#1E40AF'
          }}
        >
          <span>{categoryHeader.emoji}</span>
          <span>{categoryHeader.label}</span>
        </div>
      </div>

      {/* Responsive Image Carousel - Adaptive to viewport height */}
      <div className="w-full px-5 pb-4 flex-shrink-0">
        <div 
          className="relative rounded-2xl overflow-hidden shadow-md"
          style={{ 
            height: 'clamp(200px, 30vh, 280px)',
            backgroundColor: '#F3F4F6'
          }}
        >
          {/* Swipeable Image Container */}
          <div
            className="relative w-full h-full"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Images with smooth transition */}
            <div 
              className="flex h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {images.map((img, index) => (
                <div key={index} className="min-w-full h-full flex-shrink-0">
                  <img
                    src={img}
                    alt={`${recall.productName} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            {/* Overlay Badges - Top Right Corner */}
            <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
              {/* Severity Badge */}
              <div
                className="px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm"
                style={{
                  backgroundColor: severityColor.bg,
                  fontSize: '11px',
                  fontWeight: 600,
                  color: severityColor.text,
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {recall.severity} Risk
              </div>

              {/* Confidence Chip */}
              <div
                className="px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#4f46e5',
                  border: '1px solid rgba(79, 70, 229, 0.2)'
                }}
              >
                {recall.confidence}% match
              </div>
            </div>
          </div>

          {/* Pagination Dots - Below Carousel */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className="transition-all duration-300"
                  style={{
                    width: currentImageIndex === index ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: currentImageIndex === index 
                      ? '#FFFFFF' 
                      : 'rgba(255, 255, 255, 0.5)',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Container - Responsive padding */}
      <div className="px-5 flex-1 min-h-0 overflow-y-auto" style={{ 
        paddingTop: 'clamp(12px, 2.5vh, 20px)',
        paddingBottom: 'clamp(12px, 2.5vh, 20px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(16px, 2.5vh, 20px)'
      }}>
        {/* Product Title & Model - Snaps immediately beneath carousel */}
        <div className="space-y-1 flex-shrink-0">
          <h2 style={{ fontSize: 'clamp(15px, 2vh, 16px)', fontWeight: 600, color: '#212121' }}>
            {recall.brand && <span>{recall.brand} </span>}
            {recall.productName}
          </h2>
          
          {/* Model Number */}
          <p style={{ fontSize: 'clamp(12px, 1.6vh, 13px)', color: '#6D6D6D', fontWeight: 500 }}>
            Model: {recall.model}
          </p>
        </div>

        {/* More Details - Collapsible Section for Metadata */}
        <Collapsible open={showMoreDetails} onOpenChange={setShowMoreDetails} className="flex-shrink-0">
          <CollapsibleTrigger asChild>
            <button
              className="flex items-center gap-2 hover:underline"
              style={{ fontSize: 'clamp(12px, 1.6vh, 13px)', fontWeight: 500, color: '#4f46e5' }}
            >
              <span>More details</span>
              {showMoreDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pt-3">
            <div className="space-y-2 p-3 rounded-lg bg-gray-50">
              {/* Manufacturer */}
              <div className="flex justify-between">
                <span style={{ fontSize: '12px', color: '#888888' }}>Manufacturer:</span>
                <span style={{ fontSize: '12px', color: '#555555', fontWeight: 500 }}>{recall.manufacturer}</span>
              </div>
              
              {/* Issue Date */}
              <div className="flex justify-between">
                <span style={{ fontSize: '12px', color: '#888888' }}>Issued:</span>
                <span style={{ fontSize: '12px', color: '#555555', fontWeight: 500 }}>{formatDate(recall.date)}</span>
              </div>
              
              {/* Affected Units */}
              {recall.affected_units && (
                <div className="flex justify-between">
                  <span style={{ fontSize: '12px', color: '#888888' }}>Affected units:</span>
                  <span style={{ fontSize: '12px', color: '#555555', fontWeight: 500 }}>{recall.affected_units}</span>
                </div>
              )}
              
              {/* Remedy Type */}
              {recall.remedy_type && recall.remedy_type.length > 0 && (
                <div className="flex justify-between">
                  <span style={{ fontSize: '12px', color: '#888888' }}>Remedy:</span>
                  <span style={{ fontSize: '12px', color: '#555555', fontWeight: 500 }}>{recall.remedy_type.join(', ')}</span>
                </div>
              )}
              
              {/* Drug-specific fields */}
              {recall.recall_type === 'drug' && (
                <>
                  {recall.lot_number && (
                    <div className="flex justify-between">
                      <span style={{ fontSize: '12px', color: '#888888' }}>Lot Number:</span>
                      <span style={{ fontSize: '12px', color: '#555555', fontWeight: 500 }}>{recall.lot_number}</span>
                    </div>
                  )}
                  {recall.expiry_date && (
                    <div className="flex justify-between">
                      <span style={{ fontSize: '12px', color: '#888888' }}>Expiry:</span>
                      <span style={{ fontSize: '12px', color: '#555555', fontWeight: 500 }}>{recall.expiry_date}</span>
                    </div>
                  )}
                  {recall.dosage && (
                    <div className="flex justify-between">
                      <span style={{ fontSize: '12px', color: '#888888' }}>Dosage:</span>
                      <span style={{ fontSize: '12px', color: '#555555', fontWeight: 500 }}>{recall.dosage}</span>
                    </div>
                  )}
                </>
              )}
              
              {/* Vehicle-specific: VIN */}
              {recall.recall_type === 'vehicle' && recall.vin && (
                <div className="flex justify-between">
                  <span style={{ fontSize: '12px', color: '#888888' }}>VIN:</span>
                  <span style={{ fontSize: '12px', color: '#555555', fontWeight: 500 }}>{recall.vin}</span>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Divider */}
        <Separator className="bg-gray-200 flex-shrink-0" />

        {/* WHY THIS MATTERS - Calm light blue background */}
        <div
          className="space-y-3 rounded-2xl flex-shrink-0"
          style={{
            backgroundColor: '#DBEAFE',
            padding: 'clamp(12px, 2vh, 16px)'
          }}
        >
          <div className="space-y-3">
            {/* Section header */}
            <h3 style={{ fontSize: 'clamp(13px, 1.8vh, 14px)', fontWeight: 500, color: '#424242' }}>
              Why this matters
            </h3>
            
            {/* Hazard details with Read more functionality */}
            <div className="space-y-2">
              <p 
                style={{ 
                  fontSize: 'clamp(12px, 1.6vh, 13px)', 
                  fontWeight: 400, 
                  color: '#555555', 
                  lineHeight: '1.6',
                  display: '-webkit-box',
                  WebkitLineClamp: isExpanded ? 'unset' : 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: isExpanded ? 'visible' : 'hidden'
                }}
              >
                {recall.hazard_details || recall.description}
              </p>
              
              {/* Read more link - only show if text is long */}
              {(recall.hazard_details || recall.description).length > 180 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{ fontSize: 'clamp(12px, 1.6vh, 13px)', fontWeight: 500, color: '#4f46e5' }}
                  className="hover:underline"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <Separator className="bg-gray-200 flex-shrink-0" />

        {/* Confirmation Question */}
        <div className="space-y-4 flex-shrink-0">
          <h3 style={{ fontSize: 'clamp(15px, 2vh, 16px)', fontWeight: 600, color: '#212121', textAlign: 'center' }}>
            Do you have this product?
          </h3>
          
          {/* CTA Buttons */}
          <div className="space-y-2">
            {/* Yes Button - Primary */}
            <Button
              onClick={() => onConfirm(true)}
              className="w-full rounded-xl"
              style={{ 
                backgroundColor: '#4f46e5', 
                fontSize: 'clamp(13px, 1.8vh, 14px)', 
                fontWeight: 600,
                minHeight: 'clamp(44px, 6vh, 48px)'
              }}
            >
              Yes, I have this
            </Button>
            
            {/* No Button - Secondary */}
            <Button
              onClick={() => onConfirm(false)}
              variant="outline"
              className="w-full rounded-xl"
              style={{ 
                fontSize: 'clamp(13px, 1.8vh, 14px)', 
                fontWeight: 600, 
                borderColor: '#e0e0e0',
                minHeight: 'clamp(44px, 6vh, 48px)'
              }}
            >
              No, I don't have this
            </Button>
          </div>
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
