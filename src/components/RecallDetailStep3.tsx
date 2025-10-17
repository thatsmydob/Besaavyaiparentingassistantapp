/**
 * RecallDetailStep3 Component (recall_detail_step3)
 * "Completion Overlay" - Celebrates successful recall resolution
 * 
 * Final step in the recall detail flow
 * Shows completion message with list of completed actions
 * 
 * DESIGN SPECS:
 * - Frame width: 420px
 * - Background: Gradient #E8F5E9 → #FFFFFF
 * - Calm celebratory confetti animation
 * - Centered overlay with celebration message
 * - Green check bullets for completed actions
 * - Primary CTA: "Back to Safety Center" (closes modal)
 * - Secondary CTA: "Share this recall"
 * - Reassurance message below CTAs
 */
import React from 'react';
import { CheckCircle2, Share2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { CelebrationFireworks } from './CelebrationFireworks';

interface RecallDetailStep3Props {
  recall: {
    id: string;
    productName: string;
    brand?: string;
    model: string;
    actions: string[];
  };
  onClose: () => void;
}

export function RecallDetailStep3({ recall, onClose }: RecallDetailStep3Props) {
  // Fixed 3-step completion list
  const completedActions = [
    'Stopped using the product',
    'Verified your model number',
    'Contacted manufacturer for remedy'
  ];

  const handleShare = async () => {
    const shareText = `🔔 Recall Alert: ${recall.brand ? recall.brand + ' ' : ''}${recall.productName} (Model: ${recall.model}) has been recalled. Stay safe and check if you have this product!`;
    
    // Try native share if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Safety Recall Alert',
          text: shareText,
        });
        toast.success('Recall shared successfully!', {
          duration: 2000,
          style: {
            background: '#D1FAE5',
            color: '#065F46',
            border: '1px solid #A7F3D0',
            fontSize: '14px',
          },
        });
      } catch (err) {
        // User cancelled share
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('Recall details copied to clipboard!', {
          duration: 2500,
          style: {
            background: '#DBEAFE',
            color: '#1E40AF',
            border: '1px solid #93C5FD',
            fontSize: '14px',
          },
        });
      } catch (err) {
        console.error('Error copying to clipboard:', err);
        toast.error('Unable to share. Please try again.', {
          duration: 2000,
        });
      }
    }
  };

  return (
    <div 
      className="h-full flex flex-col items-center justify-center px-5 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #E8F5E9 0%, #FFFFFF 100%)',
        paddingTop: 'clamp(24px, 4vh, 32px)',
        paddingBottom: 'clamp(24px, 4vh, 32px)'
      }}
    >
      {/* Celebratory Fireworks Animation - Behind everything */}
      <CelebrationFireworks />

      {/* Light Blur Layer - Creates subtle separation while keeping fireworks visible */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          zIndex: 2,
          opacity: 0.3
        }}
      />

      {/* Centered Content Container - On top with fade-in animation */}
      <motion.div 
        className="max-w-md w-full relative"
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(20px, 3vh, 24px)',
          zIndex: 10
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Success Icon - Large animated checkmark */}
        <div className="flex justify-center">
          <div 
            className="rounded-full flex items-center justify-center animate-scale-in"
            style={{ 
              backgroundColor: '#059669',
              width: 'clamp(64px, 10vh, 80px)',
              height: 'clamp(64px, 10vh, 80px)'
            }}
          >
            <CheckCircle2 
              style={{ 
                color: '#FFFFFF', 
                strokeWidth: 2.5,
                width: 'clamp(40px, 6vh, 48px)',
                height: 'clamp(40px, 6vh, 48px)'
              }}
            />
          </div>
        </div>

        {/* Celebration Message */}
        <div className="text-center space-y-2">
          <h2 
            style={{ 
              fontSize: 'clamp(19px, 3vh, 22px)', 
              fontWeight: 700, 
              color: '#065F46',
              lineHeight: '1.3'
            }}
          >
            ✅ Great job — Emma's environment is safer now.
          </h2>
          <p 
            style={{ 
              fontSize: 'clamp(13px, 1.8vh, 14px)', 
              color: '#047857',
              lineHeight: '1.6'
            }}
          >
            You've taken all the right steps to protect your little one.
          </p>
        </div>

        {/* Product Context */}
        <div className="text-center">
          <p style={{ fontSize: 'clamp(12px, 1.6vh, 13px)', fontWeight: 600, color: '#065F46' }}>
            {recall.brand && <span>{recall.brand} </span>}
            {recall.productName}
          </p>
          <p style={{ fontSize: 'clamp(11px, 1.5vh, 12px)', color: '#059669' }}>
            Model: {recall.model}
          </p>
        </div>

        <Separator className="bg-green-200/50" />

        {/* Completed Actions List */}
        <div className="space-y-3">
          <h3 
            style={{ 
              fontSize: 'clamp(13px, 1.8vh, 14px)', 
              fontWeight: 600, 
              color: '#065F46',
              textAlign: 'center'
            }}
          >
            What you completed:
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.2vh, 10px)' }}>
            {completedActions.map((action, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl bg-white/60 backdrop-blur-sm border border-green-200/30"
                style={{ padding: 'clamp(10px, 1.5vh, 12px)' }}
              >
                {/* Green check bullet */}
                <div 
                  className="rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ 
                    backgroundColor: '#059669',
                    width: 'clamp(18px, 2.5vh, 20px)',
                    height: 'clamp(18px, 2.5vh, 20px)'
                  }}
                >
                  <CheckCircle2 
                    style={{ 
                      color: '#FFFFFF', 
                      strokeWidth: 3,
                      width: 'clamp(12px, 1.8vh, 14px)',
                      height: 'clamp(12px, 1.8vh, 14px)'
                    }}
                  />
                </div>

                {/* Action text */}
                <p 
                  style={{ 
                    fontSize: 'clamp(13px, 1.8vh, 14px)', 
                    fontWeight: 500, 
                    color: '#065F46',
                    lineHeight: '1.5',
                    flex: 1
                  }}
                >
                  {action}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-green-200/50" />

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.5vh, 12px)', paddingTop: 'clamp(8px, 1vh, 12px)' }}>
          {/* Primary CTA: Back to Safety Center */}
          <Button
            onClick={() => {
              // Trigger success callback before closing
              onClose();
            }}
            className="w-full rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            style={{ 
              backgroundColor: '#059669',
              color: '#FFFFFF',
              fontSize: 'clamp(14px, 2vh, 15px)', 
              fontWeight: 600,
              minHeight: 'clamp(48px, 6.5vh, 52px)'
            }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Safety Center
          </Button>
          
          {/* Secondary CTA: Share this recall */}
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full rounded-xl transition-all duration-300 bg-white/80 hover:bg-white backdrop-blur-sm"
            style={{ 
              fontSize: 'clamp(13px, 1.8vh, 14px)', 
              fontWeight: 600, 
              borderColor: '#059669',
              color: '#059669',
              borderWidth: '2px',
              minHeight: 'clamp(44px, 6vh, 48px)'
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share this recall
          </Button>
        </div>

        {/* Reassurance Message - Fades in after content */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p 
            style={{ 
              fontSize: 'clamp(13px, 1.8vh, 14px)',
              fontStyle: 'italic',
              color: '#047857',
              lineHeight: '1.5',
              fontWeight: 500
            }}
          >
            You just made Emma's world a little safer 💚
          </p>
        </motion.div>
      </motion.div>

      {/* Inline animation styles */}
      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
