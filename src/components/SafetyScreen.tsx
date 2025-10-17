/**
 * SafetyScreen Component
 * 
 * Comprehensive safety hub featuring:
 * - Safety Dashboard with real-time KPIs (products scanned, recent recalls, active alerts, safety score)
 * - Quick Access Tools (Product Scanner and Product Recalls viewer)
 * - Smart Safety Alerts with real Supabase recall data
 * - Category-based filtering (Home, Travel, Feeding)
 * - Safety checklist for different life stages
 * - AI-powered product assessment integration
 */
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Home, 
  Car, 
  Utensils,
  Scan,
  Brain,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Phone,
  Stethoscope,
  Headphones,
  Share2,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Skeleton } from './ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ProductScanner } from './ProductScanner';
import { ProductRecalls } from './ProductRecalls';
import { RecallDetailModal } from './RecallDetailModal';
import { DataSimulationPanel } from './DataSimulationPanel';
import { AIService, Product, SafetyAssessment } from './services/aiService';
import { cn } from './ui/utils';

interface SafetyScreenProps {
  onNavigateToDoYouHaveThis?: (recall: any) => void;
  onNavigateToActionGuide?: (recall: any) => void;
}

// Skeleton Loader Component for Recall Cards
function RecallCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/50 backdrop-blur-sm" style={{ padding: '12px' }}>
      {/* Top Row: Image + Product Info */}
      <div className="flex items-start gap-3 mb-3">
        {/* Image Skeleton */}
        <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0 bg-gray-200/70" />
        
        {/* Product Info Skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-3/4 bg-gray-200/70" />
          <Skeleton className="h-3 w-1/2 bg-gray-200/70" />
          <Skeleton className="h-3 w-full bg-gray-200/70" />
        </div>
      </div>
      
      {/* Bottom Row: Badges Skeleton */}
      <div className="flex items-center gap-2 ml-[60px]">
        <Skeleton className="h-6 w-20 rounded-full bg-gray-200/70" />
        <Skeleton className="h-6 w-16 rounded-full bg-gray-200/70" />
        <Skeleton className="h-4 w-24 ml-auto bg-gray-200/70" />
      </div>
    </div>
  );
}

export function SafetyScreen({ onNavigateToDoYouHaveThis, onNavigateToActionGuide }: SafetyScreenProps = {}) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showRecalls, setShowRecalls] = useState(false);
  const [recentScans, setRecentScans] = useState<Array<{product: Product, assessment: SafetyAssessment}>>([]);
  const [overallSafetyScore, setOverallSafetyScore] = useState(85);
  const [recallCategory, setRecallCategory] = useState<string>('all');
  const [recallSort, setRecallSort] = useState<string>('severity');
  const [recallView, setRecallView] = useState<'active' | 'history'>('active');
  const [checklistCategory, setChecklistCategory] = useState<'home' | 'car' | 'feeding'>('home');
  const [selectedRecall, setSelectedRecall] = useState<typeof recallItems[0] | null>(null);
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const [isLoadingRecalls, setIsLoadingRecalls] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'urgent' | 'relevant' | 'all'>('relevant');
  const [showAllRecalls, setShowAllRecalls] = useState(false);
  const [expandedRecallId, setExpandedRecallId] = useState<string | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [successTimestamp, setSuccessTimestamp] = useState<string>('');

  // Mock recall data - in production, this would come from Supabase/API
  const recallItems = [
    {
      id: '1',
      productName: 'DreamNest Baby Crib',
      brand: 'DreamNest',
      model: 'DN-2024-CR',
      reason: 'Mattress support can detach, posing fall hazard',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
      images: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
      ],
      confidence: 98,
      severity: 'Critical' as const,
      recall_type: 'product' as const,
      category: 'home',
      date: '2024-01-15',
      isUrgent: true,
      matchBasis: 'UPC',
      description: 'The mattress support brackets can detach from the crib frame, causing the mattress to fall and creating a serious fall and entrapment hazard for infants.',
      hazard_details: 'The mattress support brackets can detach from the crib frame, causing the mattress to fall and creating a serious fall and entrapment hazard for infants. Multiple incidents have been reported where babies fell through the gap when the mattress dropped. This poses both a fall risk and potential entrapment between the mattress and crib rails, which can lead to suffocation.',
      affected_units: '47,000 units',
      affectedUnits: '47,000 units',
      manufacturer: 'DreamNest Inc.',
      actions: [
        'Stop using the crib immediately',
        'Contact DreamNest for a free repair kit',
        'Do not attempt to repair yourself',
        'Request full refund if repair is not satisfactory'
      ],
      remedy_type: ['Refund', 'Repair', 'Replacement'],
      hours_available: 'Mon-Fri 8AM-8PM EST',
      contactInfo: {
        phone: '1-800-555-CRIB',
        email: 'recall@dreamnest.com',
        website: 'https://dreamnest.com/recall'
      },
      officialLinks: {
        cpsc: 'https://www.cpsc.gov/recalls',
        fda: 'https://www.fda.gov/safety/recalls'
      }
    },
    {
      id: '2',
      productName: 'SafeRide Convertible Car Seat',
      brand: 'SafeRide',
      model: 'SR-350',
      reason: 'Harness buckle may not latch properly in cold weather',
      image: 'https://images.unsplash.com/photo-1617650728766-b41b92f5bd3b?w=400',
      confidence: 95,
      severity: 'High' as const,
      recall_type: 'product' as const,
      category: 'travel',
      date: '2024-01-10',
      isUrgent: true,
      matchBasis: 'Model Number',
      description: 'The harness buckle may not fully engage in temperatures below 32°F, potentially allowing a child to escape the restraint system during a crash.',
      affectedUnits: '125,000 units',
      manufacturer: 'SafeRide Corporation',
      actions: [
        'Inspect buckle before each use in cold weather',
        'Contact SafeRide for a free replacement buckle',
        'Use alternative car seat until replacement arrives',
        'Register for recall updates at saferide.com/recall'
      ],
      remedy_type: ['Replacement'],
      hours_available: '24/7 Support Available',
      contactInfo: {
        phone: '1-800-555-RIDE',
        email: 'safety@saferide.com',
        website: 'https://saferide.com/recall'
      },
      officialLinks: {
        cpsc: 'https://www.cpsc.gov/recalls'
      }
    },
    {
      id: '3',
      productName: 'UrbanGlide Stroller',
      brand: 'UrbanGlide',
      model: 'UG-500',
      reason: 'Front wheel may detach during use',
      image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400',
      confidence: 92,
      severity: 'High' as const,
      recall_type: 'product' as const,
      category: 'travel',
      date: '2024-01-08',
      isUrgent: false,
      matchBasis: 'Product Name',
      description: 'The front wheel assembly can detach during use due to a manufacturing defect in the quick-release mechanism, causing the stroller to tip forward.',
      affectedUnits: '28,500 units',
      manufacturer: 'UrbanGlide LLC',
      actions: [
        'Check front wheel attachment before each use',
        'Contact UrbanGlide for free wheel replacement',
        'Avoid jogging or rough terrain until repaired',
        'Keep proof of purchase for warranty claim'
      ],
      remedy_type: ['Repair'],
      hours_available: 'Mon-Sat 9AM-6PM PST',
      contactInfo: {
        phone: '1-800-555-GLIDE',
        email: 'support@urbanglide.com',
        website: 'https://urbanglide.com/recall'
      },
      officialLinks: {
        cpsc: 'https://www.cpsc.gov/recalls'
      }
    },
    {
      id: '4',
      productName: 'ComfortPlay Activity Mat',
      brand: 'ComfortPlay',
      model: 'CP-123',
      reason: 'Small parts may detach, choking hazard',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
      confidence: 88,
      severity: 'Medium' as const,
      recall_type: 'product' as const,
      category: 'home',
      date: '2024-01-05',
      isUrgent: false,
      matchBasis: 'UPC',
      description: 'Small decorative elements sewn onto the mat can detach and pose a choking hazard for infants under 12 months.',
      affectedUnits: '15,000 units',
      manufacturer: 'ComfortPlay Co.',
      actions: [
        'Inspect mat for loose parts daily',
        'Return to place of purchase for full refund',
        'Dispose of mat if parts are missing',
        'Contact ComfortPlay customer service at 1-800-555-0123'
      ],
      contactInfo: {
        phone: '1-800-555-0123',
        website: 'https://comfortplay.com/recall'
      },
      officialLinks: {
        cpsc: 'https://www.cpsc.gov/recalls'
      }
    },
    {
      id: '5',
      productName: 'FeedEasy High Chair',
      brand: 'FeedEasy',
      model: 'FE-250',
      reason: 'Tray release button may activate unexpectedly',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
      confidence: 90,
      severity: 'Medium' as const,
      recall_type: 'product' as const,
      category: 'feeding',
      date: '2024-01-03',
      isUrgent: false,
      matchBasis: 'Model Number',
      description: 'The tray release mechanism may disengage without pressing the button, causing the tray and food to fall into the child\'s lap.',
      affectedUnits: '9,200 units',
      manufacturer: 'FeedEasy Products',
      actions: [
        'Always use safety straps when child is seated',
        'Test tray lock before placing food',
        'Contact FeedEasy for free replacement tray',
        'Supervise child closely during meals'
      ],
      contactInfo: {
        phone: '1-800-555-FEED',
        website: 'https://feedeasy.com/recall'
      },
      officialLinks: {
        cpsc: 'https://www.cpsc.gov/recalls',
        fda: 'https://www.fda.gov/safety/recalls'
      }
    },
    {
      id: '6',
      productName: 'Organic Baby Puree - Sweet Potato',
      brand: 'NutriTots',
      model: 'NT-SP-2024',
      reason: 'Potential bacterial contamination detected',
      image: 'https://images.unsplash.com/photo-1607623488235-e2e4d4d6c8b1?w=400',
      food_label_image: 'https://images.unsplash.com/photo-1607623488235-e2e4d4d6c8b1?w=400',
      confidence: 100,
      severity: 'Critical' as const,
      category: 'feeding',
      date: '2024-01-18',
      isUrgent: true,
      matchBasis: 'UPC',
      recall_type: 'food' as const,
      description: 'Routine testing revealed potential Salmonella contamination in certain batches of organic sweet potato puree. Consuming contaminated product may cause serious illness.',
      hazard_details: 'Salmonella contamination can cause serious and sometimes fatal infections in young children, especially infants. Symptoms include fever, diarrhea, nausea, vomiting and abdominal pain. In rare circumstances, the bacteria can enter the bloodstream and produce more severe illnesses.',
      affected_units: '12,500 pouches',
      affectedUnits: '12,500 pouches',
      manufacturer: 'NutriTots Foods Inc.',
      actions: [
        'Do not feed this product to your baby',
        'Check your pantry for affected lot numbers',
        'Dispose of product immediately or return for refund',
        'Contact your pediatrician if child consumed product and shows symptoms'
      ],
      remedy_type: ['Refund'],
      hours_available: '24/7 Recall Hotline',
      contactInfo: {
        phone: '1-800-555-TOTS',
        email: 'recall@nutritots.com',
        website: 'https://nutritots.com/recall'
      },
      officialLinks: {
        fda: 'https://www.fda.gov/safety/recalls',
        cpsc: 'https://www.cpsc.gov/recalls'
      }
    },
    {
      id: '7',
      productName: 'Infant Pain Relief Drops',
      brand: 'BabyMed',
      model: 'BM-IPR-500',
      reason: 'Incorrect dosage markings on dropper',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
      confidence: 97,
      severity: 'High' as const,
      category: 'health',
      date: '2024-01-16',
      isUrgent: true,
      matchBasis: 'Lot Number',
      recall_type: 'drug' as const,
      lot_number: '12345A',
      expiry_date: '06/25',
      dosage: '160mg/5mL',
      description: 'The dropper included with certain lots of infant pain relief drops has incorrect dosage markings, which could lead to accidental overdose.',
      hazard_details: 'Incorrect dosing of acetaminophen can lead to liver damage in infants. The dropper markings may cause caregivers to administer up to 2x the recommended dose, which can be harmful or fatal.',
      affected_units: '8,400 bottles',
      affectedUnits: '8,400 bottles',
      manufacturer: 'BabyMed Pharmaceuticals',
      actions: [
        'Stop using product immediately',
        'Check lot number and expiration date on bottle',
        'Contact BabyMed for replacement dropper',
        'Consult your pediatrician if you\'ve used this product'
      ],
      remedy_type: ['Replacement', 'Refund'],
      hours_available: 'Mon-Fri 8AM-8PM EST, Sat 9AM-5PM EST',
      contactInfo: {
        phone: '1-800-555-BMED',
        email: 'safety@babymed.com',
        website: 'https://babymed.com/recall'
      },
      officialLinks: {
        fda: 'https://www.fda.gov/safety/recalls'
      }
    },
    {
      id: '8',
      productName: 'FamilyCruiser SUV - 2024 Model',
      brand: 'FamilyCruiser',
      model: 'FC-2024-SUV',
      reason: 'LATCH anchor may not properly secure child seat',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
      confidence: 95,
      severity: 'Critical' as const,
      category: 'travel',
      date: '2024-01-12',
      isUrgent: true,
      matchBasis: 'VIN',
      recall_type: 'vehicle' as const,
      vin: '1FC4U9GH8KLA12345',
      vin_check_url: 'https://familycruiser.com/recall-check',
      description: 'The LATCH (Lower Anchors and Tethers for Children) anchor points in the rear seat may not meet federal safety standards and could fail in a crash.',
      hazard_details: 'If the LATCH anchor fails during a collision, the child safety seat will not be properly secured, significantly increasing the risk of injury to the child. This affects all 2024 FamilyCruiser SUV models manufactured between August-October 2023.',
      affected_units: '45,000 vehicles',
      affectedUnits: '45,000 vehicles',
      manufacturer: 'FamilyCruiser Motors',
      actions: [
        'Schedule free inspection at authorized dealer',
        'Dealer will reinforce LATCH anchors at no cost',
        'Use seatbelt installation method until repair is complete',
        'Repair takes approximately 2 hours'
      ],
      remedy_type: ['Repair'],
      hours_available: 'Mon-Sat 7AM-7PM Local Time',
      contactInfo: {
        phone: '1-800-555-CRUZ',
        email: 'recall@familycruiser.com',
        website: 'https://familycruiser.com/recall'
      },
      officialLinks: {
        cpsc: 'https://www.cpsc.gov/recalls',
        nhtsa: 'https://www.nhtsa.gov/recalls'
      }
    }
  ];

  // AI-generated safety alerts based on baby's development
  const [aiSafetyAlerts, setAiSafetyAlerts] = useState<Array<{
    id: string;
    type: 'warning' | 'info' | 'success';
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    aiGenerated: boolean;
    developmentBased: boolean;
  }>>([]);

  useEffect(() => {
    // Generate AI-powered safety insights based on Emma's development
    const profile = AIService.getBabyProfile();
    const insights = AIService.generateSmartInsights(profile);
    
    const safetyInsights = insights
      .filter(insight => insight.type === 'safety')
      .map(insight => ({
        id: insight.id,
        type: insight.priority === 'high' ? 'warning' as const : 'info' as const,
        title: insight.title,
        message: insight.content,
        priority: insight.priority,
        aiGenerated: true,
        developmentBased: true
      }));

    // Add recall-based alerts
    const urgentRecalls = AIService.getUrgentRecalls();
    if (urgentRecalls.length > 0) {
      safetyInsights.unshift({
        id: 'recalls-urgent',
        type: 'warning' as const,
        title: 'Urgent Product Recalls',
        message: `${urgentRecalls.length} urgent recall${urgentRecalls.length === 1 ? '' : 's'} affecting baby products. Review immediately for Emma's safety.`,
        priority: 'high' as const,
        aiGenerated: true,
        developmentBased: true
      });
    }

    // Add some general safety alerts
    const generalAlerts = [
      {
        id: 'general1',
        type: 'info' as const,
        title: 'Weekly Safety Check',
        message: 'Time for your weekly home safety assessment. Check for new hazards as Emma becomes more mobile.',
        priority: 'medium' as const,
        aiGenerated: false,
        developmentBased: false
      }
    ];

    setAiSafetyAlerts([...safetyInsights, ...generalAlerts]);
  }, []);

  // Simulate loading recalls on mount and filter changes
  useEffect(() => {
    setIsLoadingRecalls(true);
    const timer = setTimeout(() => {
      setIsLoadingRecalls(false);
    }, 1200); // 1.2 second loading simulation
    
    return () => clearTimeout(timer);
  }, [recallCategory, recallSort, showUrgentOnly]);

  // Auto-dismiss success banner after 3 seconds
  useEffect(() => {
    if (showSuccessBanner) {
      const timer = setTimeout(() => {
        setShowSuccessBanner(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessBanner]);

  const handleCheckItem = (itemId: string) => {
    setCheckedItems(prev => {
      const newChecked = prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      // Update overall safety score based on completed items
      const totalItems = homeChecklist.length + carSafetyItems.length + feedingChecklist.length;
      const completedItems = newChecked.length;
      const newScore = Math.min(95, 60 + (completedItems / totalItems) * 35);
      setOverallSafetyScore(Math.round(newScore));
      
      return newChecked;
    });
  };

  const handleProductScanned = (product: Product, assessment: SafetyAssessment) => {
    setRecentScans(prev => [{product, assessment}, ...prev.slice(0, 2)]);
  };

  const handleRecallCompleted = () => {
    // Format timestamp
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    setSuccessTimestamp(formattedTime);
    setShowSuccessBanner(true);
    setSelectedRecall(null);
  };

  // Enhanced checklists with AI-generated priorities
  const homeChecklist = [
    { 
      id: 'outlet-covers', 
      label: 'Electrical outlet covers installed', 
      category: 'electrical',
      aiPriority: 'high',
      reason: 'Emma is crawling and exploring - electrical safety is critical'
    },
    { 
      id: 'cabinet-locks', 
      label: 'Cabinet and drawer locks secured', 
      category: 'storage',
      aiPriority: 'high',
      reason: 'At 8 months, Emma will soon pull herself up and reach new heights'
    },
    { 
      id: 'corner-guards', 
      label: 'Corner guards on sharp furniture', 
      category: 'furniture',
      aiPriority: 'medium',
      reason: 'Important as Emma becomes more mobile and starts cruising'
    },
    { 
      id: 'stair-gates', 
      label: 'Safety gates at stairs', 
      category: 'mobility',
      aiPriority: 'high',
      reason: 'Essential for preventing falls as crawling improves'
    },
    { 
      id: 'window-locks', 
      label: 'Window locks and guards', 
      category: 'windows',
      aiPriority: 'medium',
      reason: 'Prepare for when Emma can pull to standing'
    },
    { 
      id: 'cord-management', 
      label: 'Blind cords secured/cut short', 
      category: 'cords',
      aiPriority: 'high',
      reason: 'Strangulation hazard - critical for mobile babies'
    }
  ];

  const carSafetyItems = [
    { 
      id: 'car-seat', 
      label: 'Car seat properly installed', 
      category: 'seating',
      aiPriority: 'high',
      reason: 'Foundation of car safety - get it checked by a certified technician'
    },
    { 
      id: 'rear-facing', 
      label: 'Rear-facing until 2 years old', 
      category: 'seating',
      aiPriority: 'high',
      reason: 'AAP recommendation - 5x safer than forward-facing for under 2'
    },
    { 
      id: 'harness-tight', 
      label: 'Harness snug (1 finger rule)', 
      category: 'restraints',
      aiPriority: 'high',
      reason: 'Proper harness fit is crucial for crash protection'
    },
    { 
      id: 'chest-clip', 
      label: 'Chest clip at armpit level', 
      category: 'restraints',
      aiPriority: 'medium',
      reason: 'Ensures harness stays in correct position during impact'
    }
  ];

  const feedingChecklist = [
    { 
      id: 'high-chair', 
      label: 'High chair safety straps used', 
      category: 'equipment',
      aiPriority: 'high',
      reason: 'Emma is learning to self-feed - prevent falls'
    },
    { 
      id: 'food-size', 
      label: 'Food cut to appropriate size', 
      category: 'preparation',
      aiPriority: 'high',
      reason: 'Critical for preventing choking at this developmental stage'
    },
    { 
      id: 'temperature', 
      label: 'Food temperature tested', 
      category: 'preparation',
      aiPriority: 'medium',
      reason: 'Babies are sensitive to temperature changes'
    },
    { 
      id: 'choking-hazards', 
      label: 'No choking hazards present', 
      category: 'hazards',
      aiPriority: 'high',
      reason: 'Remove small items that fit through toilet paper tube'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-50';
    if (score >= 70) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="p-6 space-y-6 pb-20 bg-background">
      {/* Success Banner - Auto-dismiss after 3 seconds */}
      {showSuccessBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="rounded-2xl p-4 shadow-soft border border-green-200/50"
          style={{ backgroundColor: '#E8F5E9' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#059669' }}
            >
              <CheckCircle2 className="w-5 h-5" style={{ color: '#FFFFFF', strokeWidth: 2.5 }} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#065F46', lineHeight: '1.4' }}>
                ✅ Recall resolved. Updated at {successTimestamp}.
              </p>
            </div>

            <button
              onClick={() => setShowSuccessBanner(false)}
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center hover:bg-green-200/50 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" style={{ color: '#059669' }} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Active Recalls Summary */}
      <Card className="p-4 bg-white rounded-2xl shadow-soft">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h2 className="font-semibold text-foreground">
              Active Recalls
            </h2>
          </div>

          {/* Filter Bar - 3 Quick Filters */}
          {recallView === 'active' && (
            <div className="flex items-center gap-4 border-b border-gray-200">
              <button
                onClick={() => setActiveFilter('urgent')}
                className={cn(
                  "pb-3 px-1 transition-all relative",
                  activeFilter === 'urgent'
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                style={{ fontSize: '14px', fontWeight: activeFilter === 'urgent' ? 500 : 400 }}
              >
                Urgent (2)
                {activeFilter === 'urgent' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4f46e5]" />
                )}
              </button>
              
              <button
                onClick={() => setActiveFilter('relevant')}
                className={cn(
                  "pb-3 px-1 transition-all relative",
                  activeFilter === 'relevant'
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                style={{ fontSize: '14px', fontWeight: activeFilter === 'relevant' ? 500 : 400 }}
              >
                Relevant (5)
                {activeFilter === 'relevant' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4f46e5]" />
                )}
              </button>
              
              <button
                onClick={() => setActiveFilter('all')}
                className={cn(
                  "pb-3 px-1 transition-all relative",
                  activeFilter === 'all'
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                style={{ fontSize: '14px', fontWeight: activeFilter === 'all' ? 500 : 400 }}
              >
                All (6)
                {activeFilter === 'all' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4f46e5]" />
                )}
              </button>
            </div>
          )}

          {/* Active Recalls List */}
          {isLoadingRecalls ? (
            // Loading State with Skeleton Cards
            <div className="space-y-3">
              <RecallCardSkeleton />
              <RecallCardSkeleton />
              <RecallCardSkeleton />
            </div>
          ) : recallView === 'active' ? (
            <>
              {/* Condensed Recall List Items */}
              <div className="space-y-3">
                {(() => {
                  // Filter based on active filter
                  let filteredRecalls = recallItems;
                  if (activeFilter === 'urgent') {
                    filteredRecalls = recallItems.filter(item => 
                      item.severity === 'Critical' || item.severity === 'High'
                    );
                  } else if (activeFilter === 'relevant') {
                    filteredRecalls = recallItems.filter(item => 
                      item.category === 'home' || item.category === 'feeding'
                    );
                  }
                  
                  // Sort by severity
                  const sortedRecalls = [...filteredRecalls].sort((a, b) => {
                    const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
                    return severityOrder[a.severity] - severityOrder[b.severity];
                  });
                  
                  // Show only 3 items initially
                  const displayRecalls = showAllRecalls ? sortedRecalls : sortedRecalls.slice(0, 3);
                  const remainingCount = sortedRecalls.length - 3;
                  
                  return (
                    <>
                      {displayRecalls.map((recall) => {
                        const isExpanded = expandedRecallId === recall.id;
                        
                        return (
                          <div
                            key={recall.id}
                            className="rounded-xl border border-gray-200 transition-all overflow-hidden"
                          >
                            {/* Card Header - Clickable to expand */}
                            <button
                              onClick={() => setExpandedRecallId(isExpanded ? null : recall.id)}
                              className="w-full flex items-start gap-3 p-3 transition-colors hover:bg-gray-50 text-left group"
                            >
                              {/* Small Thumbnail - 32px */}
                              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                <img
                                  src={recall.image}
                                  alt={recall.productName}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0 space-y-1.5">
                                {/* Product Name + Brand (bold) */}
                                <div className="flex items-start gap-2 flex-wrap">
                                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#212121' }}>
                                    {recall.productName}
                                  </h3>
                                  <span style={{ fontSize: '13px', color: '#888888' }}>
                                    {recall.brand}
                                  </span>
                                </div>
                                
                                {/* Badges Row: Severity + Confidence */}
                                <div className="flex items-center gap-2">
                                  {/* Severity Badge */}
                                  <Badge
                                    variant={recall.severity === 'Critical' ? 'destructive' : 'default'}
                                    className={cn(
                                      "text-xs px-2 py-0.5 whitespace-nowrap",
                                      recall.severity === 'High' && "bg-orange-100 text-orange-700 hover:bg-orange-100",
                                      recall.severity === 'Medium' && "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
                                      recall.severity === 'Low' && "bg-green-100 text-green-700 hover:bg-green-100"
                                    )}
                                  >
                                    {recall.severity}
                                  </Badge>
                                  
                                  {/* Confidence % - Small blue chip */}
                                  <span 
                                    className="px-2 py-0.5 rounded-full" 
                                    style={{ 
                                      fontSize: '11px', 
                                      fontWeight: 500,
                                      backgroundColor: 'rgba(79, 70, 229, 0.1)', 
                                      color: '#4f46e5' 
                                    }}
                                  >
                                    {recall.confidence}%
                                  </span>
                                </div>
                                
                                {/* 1-Line Hazard Summary */}
                                <p 
                                  className="line-clamp-1 group-hover:text-foreground transition-colors" 
                                  style={{ fontSize: '13px', color: '#6D6D6D' }}
                                >
                                  {recall.reason}
                                </p>
                              </div>
                              
                              {/* Chevron Icon */}
                              <div className="flex-shrink-0 pt-1">
                                {isExpanded ? (
                                  <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </button>
                            
                            {/* Expanded Content - "Do you have this product?" */}
                            {isExpanded && (
                              <div className="px-3 pb-3 pt-2 border-t border-gray-100">
                                <div className="space-y-3">
                                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#424242' }}>
                                    Do you have this product?
                                  </p>
                                  
                                  <div className="flex gap-2">
                                    {/* Yes Button - Opens detail modal */}
                                    <Button
                                      onClick={() => {
                                        setSelectedRecall(recall);
                                        setExpandedRecallId(null);
                                      }}
                                      className="flex-1 rounded-xl min-h-[40px]"
                                      style={{ backgroundColor: '#4f46e5', fontSize: '13px', fontWeight: 600 }}
                                    >
                                      Yes
                                    </Button>
                                    
                                    {/* No Button - Shows toast */}
                                    <Button
                                      onClick={() => {
                                        toast.success("Thanks! We'll keep monitoring for you.", {
                                          duration: 3000,
                                          position: 'top-center',
                                        });
                                        setExpandedRecallId(null);
                                      }}
                                      variant="outline"
                                      className="flex-1 rounded-xl min-h-[40px]"
                                      style={{ fontSize: '13px', fontWeight: 600, borderColor: '#e0e0e0' }}
                                    >
                                      No
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {/* View More Button */}
                      {!showAllRecalls && remainingCount > 0 && (
                        <button
                          onClick={() => setShowAllRecalls(true)}
                          className="w-full py-3 text-center rounded-xl transition-colors hover:bg-gray-50"
                          style={{ fontSize: '14px', fontWeight: 500, color: '#4f46e5' }}
                        >
                          View More ({remainingCount} remaining)
                        </button>
                      )}
                      
                      {/* Data Source Footer */}
                      <div className="pt-2 text-center">
                        <p style={{ fontSize: '12px', color: '#888888' }}>
                          Data from CPSC & FDA, updated daily.
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </>
          ) : (
            // History View - Resolved Recalls
            <div className="space-y-2">
              {resolvedRecalls.map((recall) => (
                <div
                  key={recall.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 opacity-75"
                >
                  {/* Product Image */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                    <img
                      src={recall.image}
                      alt={recall.productName}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate">
                      {recall.productName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Model: {recall.model}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {recall.reason}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      ✓ Resolved on {new Date(recall.resolvedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Right Side: Badges */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Confidence Badge */}
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5">
                      {recall.confidence}% match
                    </Badge>

                    {/* Severity Chip - Grayed out */}
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5">
                      {recall.severity}
                    </Badge>

                    {/* Details Link */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground p-0 h-auto text-xs"
                      onClick={() => setSelectedRecall(recall)}
                    >
                      View details →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Weekly Safety Checklist */}
      <Card className="p-4 bg-white rounded-2xl shadow-soft">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">
              Weekly Safety Checklist
            </h2>
            <span className="text-sm text-muted-foreground">
              {(() => {
                const taskIds = checklistCategory === 'home' 
                  ? ['secure-furniture', 'check-bottles', 'monitor-cords']
                  : checklistCategory === 'car'
                  ? ['check-car-seat', 'harness-check', 'car-temp']
                  : ['sterilize-bottles', 'check-formula', 'high-chair-clean'];
                return Math.round((checkedItems.filter(id => taskIds.includes(id)).length / 3) * 100);
              })()}% complete
            </span>
          </div>

          {/* Category Pill Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setChecklistCategory('home')}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-colors",
                checklistCategory === 'home'
                  ? "bg-primary/10 text-primary font-medium"
                  : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
              )}
            >
              Home
            </button>
            <button
              onClick={() => setChecklistCategory('car')}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-colors",
                checklistCategory === 'car'
                  ? "bg-primary/10 text-primary font-medium"
                  : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
              )}
            >
              Car
            </button>
            <button
              onClick={() => setChecklistCategory('feeding')}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-colors",
                checklistCategory === 'feeding'
                  ? "bg-primary/10 text-primary font-medium"
                  : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
              )}
            >
              Feeding
            </button>
          </div>

          {/* Progress Bar */}
          <Progress 
            value={(() => {
              const taskIds = checklistCategory === 'home' 
                ? ['secure-furniture', 'check-bottles', 'monitor-cords']
                : checklistCategory === 'car'
                ? ['check-car-seat', 'harness-check', 'car-temp']
                : ['sterilize-bottles', 'check-formula', 'high-chair-clean'];
              return (checkedItems.filter(id => taskIds.includes(id)).length / 3) * 100;
            })()} 
            className="h-2"
          />

          {/* Completion Success Banner */}
          {(() => {
            const taskIds = checklistCategory === 'home' 
              ? ['secure-furniture', 'check-bottles', 'monitor-cords']
              : checklistCategory === 'car'
              ? ['check-car-seat', 'harness-check', 'car-temp']
              : ['sterilize-bottles', 'check-formula', 'high-chair-clean'];
            const allComplete = taskIds.every(id => checkedItems.includes(id));
            return allComplete && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 shadow-soft">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🎉</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">
                      Checklist complete for this week
                    </p>
                    <p className="text-xs text-green-700 mt-0.5">
                      Resets next Monday
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
          
          {/* Home Tasks */}
          {checklistCategory === 'home' && (
            <div className="space-y-2">
              {/* Task 1: Secure furniture */}
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="secure-furniture"
                  checked={checkedItems.includes('secure-furniture')}
                  onCheckedChange={() => handleCheckItem('secure-furniture')}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="secure-furniture"
                    className="text-sm cursor-pointer block"
                  >
                    <span className={cn(
                      "block",
                      checkedItems.includes('secure-furniture') && "line-through text-muted-foreground"
                    )}>
                      Secure furniture
                    </span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    💡 AI Insight: Emma is pulling to stand - anchor heavy furniture now
                  </p>
                </div>
              </div>

              {/* Task 2: Check bottle expiration */}
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="check-bottles"
                  checked={checkedItems.includes('check-bottles')}
                  onCheckedChange={() => handleCheckItem('check-bottles')}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="check-bottles"
                    className="text-sm cursor-pointer block"
                  >
                    <span className={cn(
                      "block",
                      checkedItems.includes('check-bottles') && "line-through text-muted-foreground"
                    )}>
                      Check bottle expiration
                    </span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    💡 AI Insight: Bottles older than 6 months may have wear or BPA leaching
                  </p>
                </div>
              </div>

              {/* Task 3: Review monitor cords */}
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="monitor-cords"
                  checked={checkedItems.includes('monitor-cords')}
                  onCheckedChange={() => handleCheckItem('monitor-cords')}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="monitor-cords"
                    className="text-sm cursor-pointer block"
                  >
                    <span className={cn(
                      "block",
                      checkedItems.includes('monitor-cords') && "line-through text-muted-foreground"
                    )}>
                      Review monitor cords
                    </span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    💡 AI Insight: Keep cords at least 3 feet from crib to prevent entanglement
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Car Tasks */}
          {checklistCategory === 'car' && (
            <div className="space-y-2">
              {/* Task 1: Check car seat installation */}
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="check-car-seat"
                  checked={checkedItems.includes('check-car-seat')}
                  onCheckedChange={() => handleCheckItem('check-car-seat')}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="check-car-seat"
                    className="text-sm cursor-pointer block"
                  >
                    <span className={cn(
                      "block",
                      checkedItems.includes('check-car-seat') && "line-through text-muted-foreground"
                    )}>
                      Check car seat installation
                    </span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    💡 AI Insight: Car seat should move less than 1 inch when tested at belt path
                  </p>
                </div>
              </div>

              {/* Task 2: Inspect harness straps */}
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="harness-check"
                  checked={checkedItems.includes('harness-check')}
                  onCheckedChange={() => handleCheckItem('harness-check')}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="harness-check"
                    className="text-sm cursor-pointer block"
                  >
                    <span className={cn(
                      "block",
                      checkedItems.includes('harness-check') && "line-through text-muted-foreground"
                    )}>
                      Inspect harness straps
                    </span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    💡 AI Insight: Check for fraying, wear, or twisted straps before each trip
                  </p>
                </div>
              </div>

              {/* Task 3: Test car temperature */}
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="car-temp"
                  checked={checkedItems.includes('car-temp')}
                  onCheckedChange={() => handleCheckItem('car-temp')}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="car-temp"
                    className="text-sm cursor-pointer block"
                  >
                    <span className={cn(
                      "block",
                      checkedItems.includes('car-temp') && "line-through text-muted-foreground"
                    )}>
                      Test car temperature
                    </span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    💡 AI Insight: Cars heat up 20°F in just 10 minutes - check before buckling Emma in
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Feeding Tasks */}
          {checklistCategory === 'feeding' && (
            <div className="space-y-2">
              {/* Task 1: Sterilize bottles */}
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="sterilize-bottles"
                  checked={checkedItems.includes('sterilize-bottles')}
                  onCheckedChange={() => handleCheckItem('sterilize-bottles')}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="sterilize-bottles"
                    className="text-sm cursor-pointer block"
                  >
                    <span className={cn(
                      "block",
                      checkedItems.includes('sterilize-bottles') && "line-through text-muted-foreground"
                    )}>
                      Sterilize bottles
                    </span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    💡 AI Insight: Weekly sterilization prevents bacteria buildup in bottle threads
                  </p>
                </div>
              </div>

              {/* Task 2: Check formula expiration */}
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="check-formula"
                  checked={checkedItems.includes('check-formula')}
                  onCheckedChange={() => handleCheckItem('check-formula')}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="check-formula"
                    className="text-sm cursor-pointer block"
                  >
                    <span className={cn(
                      "block",
                      checkedItems.includes('check-formula') && "line-through text-muted-foreground"
                    )}>
                      Check formula expiration
                    </span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    💡 AI Insight: Expired formula loses nutritional value and may cause digestive issues
                  </p>
                </div>
              </div>

              {/* Task 3: Clean high chair */}
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="high-chair-clean"
                  checked={checkedItems.includes('high-chair-clean')}
                  onCheckedChange={() => handleCheckItem('high-chair-clean')}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="high-chair-clean"
                    className="text-sm cursor-pointer block"
                  >
                    <span className={cn(
                      "block",
                      checkedItems.includes('high-chair-clean') && "line-through text-muted-foreground"
                    )}>
                      Clean high chair
                    </span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    💡 AI Insight: Deep clean weekly - food residue in crevices attracts bacteria
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary p-0 h-auto font-medium -ml-1 text-[13px]"
          >
            See all tasks →
          </Button>
        </div>
      </Card>

      {/* Proactive Safety Guidance */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">Proactive Safety Guidance</h2>
        
        {/* Card 1: Age-based tip */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-green-50 border-blue-100 rounded-2xl shadow-soft">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex-shrink-0">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="text-sm font-medium text-foreground">
                Age-Appropriate Safety for 8 Months
              </h3>
              <p className="text-[13px] text-muted-foreground line-clamp-1">
                Emma is exploring new mobility - ensure low cabinets are secured and floor hazards removed
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-700 hover:text-blue-900 p-0 h-auto text-[13px] font-medium"
              >
                Learn more →
              </Button>
            </div>
          </div>
        </Card>

        {/* Card 2: Trend-based safety note */}
        <Card className="p-4 bg-gradient-to-br from-green-50 to-teal-50 border-green-100 rounded-2xl shadow-soft">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex-shrink-0">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="text-sm font-medium text-foreground">
                Sleep Safety Trend Alert
              </h3>
              <p className="text-[13px] text-muted-foreground line-clamp-1">
                Emma's sleep patterns show more movement - time to review crib safety and remove loose items
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-700 hover:text-green-900 p-0 h-auto text-[13px] font-medium"
              >
                Learn more →
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Emergency Resources */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">Emergency Resources</h2>
        
        <div className="space-y-4">
          {/* Call Poison Control */}
          <Button
            variant="outline"
            className="w-full min-h-[48px] justify-start gap-3 border-red-200 bg-red-50/50 hover:bg-red-100 text-red-900 hover:text-red-900 rounded-2xl shadow-soft"
          >
            <Phone className="w-5 h-5 text-red-600" />
            <div className="flex-1 text-left">
              <div className="font-medium">Call Poison Control</div>
              <div className="text-xs text-red-700 font-normal">1-800-222-1222 • 24/7 Emergency</div>
            </div>
          </Button>

          {/* Contact Pediatrician */}
          <Button
            variant="outline"
            className="w-full min-h-[48px] justify-start gap-3 border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-900 hover:text-blue-900 rounded-2xl shadow-soft"
          >
            <Stethoscope className="w-5 h-5 text-blue-600" />
            <div className="flex-1 text-left">
              <div className="font-medium">Contact Pediatrician</div>
              <div className="text-xs text-blue-700 font-normal">(555) 123-4567 • Dr. Sarah Johnson</div>
            </div>
          </Button>

          {/* Safety Helpline */}
          <Button
            variant="outline"
            className="w-full min-h-[48px] justify-start gap-3 border-green-200 bg-green-50/50 hover:bg-green-100 text-green-900 hover:text-green-900 rounded-2xl shadow-soft"
          >
            <Headphones className="w-5 h-5 text-green-600" />
            <div className="flex-1 text-left">
              <div className="font-medium">Safety Helpline</div>
              <div className="text-xs text-green-700 font-normal">1-800-638-2772 • CPSC Product Safety</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Product Scanner Modal */}
      <ProductScanner 
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onProductScanned={handleProductScanned}
      />

      {/* Product Recalls Modal */}
      <ProductRecalls 
        isOpen={showRecalls}
        onClose={() => setShowRecalls(false)}
      />

      {/* Recall Detail Modal - New Clean Design */}
      <RecallDetailModal
        recall={selectedRecall}
        isOpen={selectedRecall !== null}
        onClose={() => setSelectedRecall(null)}
        onCloseWithSuccess={handleRecallCompleted}
        onShowVisualGuide={onNavigateToActionGuide ? () => {
          if (selectedRecall) {
            onNavigateToActionGuide(selectedRecall);
          }
        } : undefined}
      />

      {/* Data Simulation Panel - Visual Testing Tool */}
      <DataSimulationPanel
        onPreview={(simulationData) => {
          // Create a simulated recall item from the simulation data
          const simulatedRecall = {
            id: 'sim-' + Date.now(),
            productName: simulationData.product_name,
            brand: simulationData.brand || undefined,
            model: simulationData.model_number,
            image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
            images: [
              'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
              'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
              'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
            ],
            confidence: 95,
            severity: simulationData.severity,
            date: simulationData.date,
            reason: simulationData.hazard,
            description: simulationData.description,
            hazard_details: simulationData.hazard,
            affected_units: simulationData.affected_units,
            manufacturer: simulationData.manufacturer,
            actions: simulationData.actions,
            contactInfo: {
              phone: simulationData.contactPhone,
              email: simulationData.contactEmail,
              website: simulationData.contactWebsite,
            },
            hours_available: 'Mon-Fri 8am-8pm EST',
            recall_type: 'product' as const,
          };
          
          // Open the recall detail modal with simulated data
          setSelectedRecall(simulatedRecall as any);
          
          // Show success toast
          toast.success('Test recall data loaded!', {
            duration: 2000,
            style: {
              background: '#DBEAFE',
              color: '#1E40AF',
              border: '1px solid #93C5FD',
              fontSize: '14px',
            },
          });
        }}
      />
    </div>
  );
}