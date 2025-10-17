/**
 * Be-Saavy - AI-Powered Parenting Assistant
 * 
 * Main application component managing:
 * - Navigation between 6 main screens (Home, AI Assistant, Safety, Baby Profile, Wellness, Settings)
 * - Enhanced header with contextual descriptions
 * - Touch-optimized bottom navigation bar
 * - Smooth screen transitions
 * - Accessibility features (ARIA labels, touch targets)
 * - Mobile-first responsive design
 * - Headspace-inspired calm aesthetic
 */
import React, { useState } from 'react';
import { Home, MessageCircle, Shield, Baby, Scan, Settings } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { cn } from './components/ui/utils';
import { HomeScreen } from './components/HomeScreen';
import { AIAssistantScreen } from './components/AIAssistantScreen';
import { SafetyScreen } from './components/SafetyScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ProductScanner } from './components/ProductScanner';
import { ActionGuideScreen } from './components/ActionGuideScreen';
import { DoYouHaveThisScreen } from './components/DoYouHaveThisScreen';

type Screen = 'home' | 'safety' | 'scan' | 'assistant' | 'settings' | 'action-guide' | 'do-you-have-this';

const navigation = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: Home, 
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    description: 'Daily overview and insights'
  },
  { 
    id: 'safety', 
    label: 'Safety', 
    icon: Shield, 
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    description: 'Keep your baby safe'
  },
  { 
    id: 'scan', 
    label: 'Scan', 
    icon: Scan, 
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Scan products for safety'
  },
  { 
    id: 'assistant', 
    label: 'Ask AI', 
    icon: MessageCircle, 
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    description: 'Get instant parenting guidance'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    description: 'Customize your experience'
  },
] as const;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('safety');
  const [showScanner, setShowScanner] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedRecallData, setSelectedRecallData] = useState<any>(null);

  const navigateToScreen = (screen: Screen, direction: 'left' | 'right' = 'left') => {
    if (isTransitioning) return; // Prevent double navigation
    
    setIsTransitioning(true);
    setSlideDirection(direction);
    
    setTimeout(() => {
      setCurrentScreen(screen);
      setSlideDirection(null);
      setIsTransitioning(false);
    }, 200);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'safety':
        return (
          <SafetyScreen 
            onNavigateToDoYouHaveThis={(recall) => {
              setSelectedRecallData(recall);
              navigateToScreen('do-you-have-this', 'left');
            }}
          />
        );
      case 'scan':
        return null; // Scan opens as modal
      case 'assistant':
        return <AIAssistantScreen />;
      case 'settings':
        return <SettingsScreen />;
      
      // Recall Flow: Step 1 - User confirms if they have the recalled product
      case 'do-you-have-this':
        return (
          <DoYouHaveThisScreen
            recall={selectedRecallData ? {
              id: selectedRecallData.id,
              productName: selectedRecallData.productName,
              model: selectedRecallData.model,
              image: selectedRecallData.image,
              severity: selectedRecallData.severity,
              confidence: selectedRecallData.confidence,
              matchBasis: selectedRecallData.matchBasis,
              manufacturer: selectedRecallData.manufacturer,
              date: selectedRecallData.date
            } : undefined}
            onClose={() => navigateToScreen('safety', 'right')}
            onNavigateToActionGuide={() => navigateToScreen('action-guide', 'left')}
            onConfirm={(hasProduct) => {
              console.log('User confirmed:', hasProduct ? 'Has product' : 'Does not have product');
            }}
          />
        );
      
      // Recall Flow: Step 2 - Guide user through resolution steps
      case 'action-guide':
        return (
          <ActionGuideScreen
            recall={selectedRecallData ? {
              id: selectedRecallData.id,
              productName: selectedRecallData.productName,
              model: selectedRecallData.model,
              manufacturer: selectedRecallData.manufacturer,
              severity: selectedRecallData.severity
            } : undefined}
            onClose={() => navigateToScreen('safety', 'right')}
            onResolved={() => {
              // Mark recall as resolved - this would update state/database in production
              console.log('Recall marked as resolved for:', selectedRecallData?.productName);
              // Navigate back to safety screen
              navigateToScreen('safety', 'right');
            }}
          />
        );
      default:
        return <HomeScreen />;
    }
  };

  const currentNav = navigation.find(nav => nav.id === currentScreen);

  return (
    <div className="h-screen bg-background flex flex-col max-w-md mx-auto overflow-hidden">
      {/* Enhanced Header with Better Visual Hierarchy */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-md border-b border-border/50 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          {/* App Logo with Gentle Animation */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary via-primary-light to-secondary flex items-center justify-center animate-breath shadow-md">
            <Baby className="w-5 h-5 text-white" />
          </div>
          
          {/* App Title and Context */}
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground">Be-Saavy</h1>
            <p className="text-sm text-muted-foreground leading-tight">
              {currentNav?.description || 'Your AI parenting companion'}
            </p>
          </div>
          
          {/* Visual Indicator for Current Screen */}
          <div className={cn(
            "w-3 h-3 rounded-full transition-colors duration-300",
            currentNav?.bgColor || 'bg-primary/20'
          )} />
        </div>
      </div>

      {/* Screen Content with Smooth Transitions */}
      <div className="flex-1 overflow-auto">
        <div 
          className={cn(
            "transition-all ease-in-out h-full",
            slideDirection === 'left' && "animate-slide-out-left",
            slideDirection === 'right' && "animate-slide-out-right"
          )}
          style={{
            transitionDuration: slideDirection ? '200ms' : '300ms'
          }}
        >
          {renderScreen()}
        </div>
      </div>

      {/* Fixed Bottom Navigation - 5 Tabs */}
      <div className="flex-shrink-0 bg-white/95 backdrop-blur-md border-t border-border/50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        {/* Navigation Items */}
        <div className="flex items-center justify-around px-2 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'scan') {
                    setShowScanner(true);
                  } else {
                    setCurrentScreen(item.id as Screen);
                  }
                }}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-3 rounded-2xl transition-all duration-300 touch-target relative overflow-hidden group",
                  "hover:scale-105 active:scale-95",
                  isActive 
                    ? `${item.bgColor} ${item.color} shadow-sm` 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
                aria-label={`Navigate to ${item.label}: ${item.description}`}
                role="tab"
                aria-selected={isActive}
              >
                {/* Background Effect for Active State */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-2xl" />
                )}
                
                {/* Icon with Gentle Animation */}
                <Icon 
                  className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    isActive && "animate-gentle-bounce"
                  )} 
                />
                
                {/* Label with Better Typography */}
                <span className="text-xs font-medium leading-tight">
                  {item.label}
                </span>
                
                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-current rounded-full animate-pulse-gentle" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Safe Area for iPhone X+ Bottom Bar */}
        <div className="h-safe-area-inset-bottom bg-white/95" />
      </div>

      {/* Product Scanner Modal */}
      <ProductScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onProductScanned={(product, assessment) => {
          console.log("Product scanned:", product, assessment);
          setShowScanner(false);
        }}
      />

      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        richColors
        closeButton
      />
    </div>
  );
}