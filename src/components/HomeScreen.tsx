/**
 * HomeScreen Component
 * 
 * Main dashboard screen displaying:
 * - Personalized welcome message
 * - Safety Status Card (top priority, first visible card)
 *   - All-clear state: green/blue gradient with checkmark
 *   - Urgent state: red tint with warning icon and pulse animation
 *   - Last checked timestamp
 * - Today's summary with feeding, sleep, and activity stats
 * - AI-powered smart insights
 * - Quick action buttons for common tasks
 * - Daily AI-generated tip
 * - Product scanner integration
 * 
 * Global Layout System:
 * - 24px (space-y-6) spacing between sections
 * - 16px (p-4) internal card padding
 * - 16px (rounded-lg) rounded corners
 * - Soft white background (bg-white)
 * - Light shadows (shadow-soft: y=2px blur=8px opacity=12%)
 * - Clean vertical hierarchy with calm, trust-first aesthetic
 */
import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Droplets,
  Clock,
  TrendingUp,
  Star,
  ChevronRight,
  Activity,
  Coffee,
  ChevronDown,
  Plus,
  Scan,
  Sparkles,
  Brain,
  AlertCircle,
  ShieldCheck,
  AlertTriangle,
  Shield,
  Camera,
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ProductScanner } from "./ProductScanner";
import { AIService, SmartInsight } from "./services/aiService";
import { cn } from "./ui/utils";

export function HomeScreen() {
  const [showAllInsights, setShowAllInsights] = useState(false);
  const [showAllActions, setShowAllActions] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [smartInsights, setSmartInsights] = useState<
    SmartInsight[]
  >([]);
  const [dailyTip, setDailyTip] = useState("");
  const [recallSummary, setRecallSummary] = useState({
    urgent: 0,
    recent: 0,
  });
  const [lastAction, setLastAction] = useState<string | null>(null);

  const currentTime = new Date().getHours();
  const isNight = currentTime >= 18 || currentTime <= 6;
  const timeOfDay = isNight
    ? "evening"
    : currentTime < 12
      ? "morning"
      : "afternoon";

  // Load AI insights on component mount
  useEffect(() => {
    const profile = AIService.getBabyProfile();
    const insights = AIService.generateSmartInsights(profile);
    const tip = AIService.getDailyTip(profile);
    const summary = AIService.getRecallSummary();

    setSmartInsights(insights);
    setDailyTip(tip);
    setRecallSummary({
      urgent: summary.urgent,
      recent: summary.recent,
    });
  }, []);

  const todaysStats = [
    {
      icon: Droplets,
      value: "6",
      label: "Feedings",
      sublabel: "Last: 2h ago",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "stable",
    },
    {
      icon: Clock,
      value: "11h",
      label: "Sleep",
      sublabel: "Quality: Good",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "up",
    },
    {
      icon: Activity,
      value: "4",
      label: "Activities",
      sublabel: "Tummy time",
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "up",
    },
  ];

  const quickActions = [
    {
      icon: Droplets,
      title: "Log Feeding",
      subtitle: "Bottle or breast",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      priority: "high",
      action: () => setLastAction('feed'),
    },
    {
      icon: Moon,
      title: "Sleep Timer",
      subtitle: "Start nap/bedtime",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      priority: "high",
      action: () => setLastAction('sleep'),
    },
    {
      icon: Scan,
      title: "Scan Product",
      subtitle: "Check safety",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      priority: "high",
      action: () => setShowScanner(true),
    },
    {
      icon: TrendingUp,
      title: "Milestone",
      subtitle: "Track development",
      color: "text-green-600",
      bgColor: "bg-green-50",
      priority: "medium",
      action: () => setLastAction('milestone'),
    },
    {
      icon: Star,
      title: "Ask AI",
      subtitle: "Get instant help",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      priority: "medium",
    },
    {
      icon: Shield,
      title: "Safety Checklist",
      subtitle: "Check outlets, anchors, gates",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      priority: "medium",
    },
  ];

  const displayedActions = showAllActions
    ? quickActions
    : quickActions.slice(0, 4);
  const displayedInsights = showAllInsights
    ? smartInsights
    : smartInsights.slice(0, 2);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "developmental":
        return "🧠";
      case "safety":
        return "🛡️";
      case "feeding":
        return "🍎";
      case "sleep":
        return "😴";
      case "wellness":
        return "💚";
      default:
        return "💡";
    }
  };

  const getInsightColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "from-orange-50 via-red-50 to-pink-50";
      case "medium":
        return "from-blue-50 via-indigo-50 to-purple-50";
      case "low":
        return "from-green-50 via-emerald-50 to-teal-50";
      default:
        return "from-gray-50 to-slate-50";
    }
  };

  const hasUrgentRecalls = recallSummary.urgent > 0;
  const lastCheckedMinutes = 3; // Could be dynamic based on actual data

  return (
    <div className="p-6 space-y-6 pb-24 bg-background">
      {/* Minimal Greeting + Baby Snapshot */}
      <div className="space-y-0.5">
        <p className="text-foreground">
          Good {timeOfDay}, Sarah {isNight ? '🌙' : '☀️'}
        </p>
        <p className="text-muted-foreground text-sm">
          Emma is 8 months old and growing beautifully
        </p>
      </div>

      {/* Safety Status Card - Top Priority */}
      <Card
        className={cn(
          "p-4 rounded-lg shadow-soft transition-all duration-300",
          hasUrgentRecalls
            ? "bg-red-50 border-red-200 border"
            : "bg-gradient-to-br from-green-50 to-blue-50 border-green-200 border"
        )}
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasUrgentRecalls ? (
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center animate-pulse-gentle">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
              )}
              <div className="space-y-0.5 flex-1">
                {hasUrgentRecalls ? (
                  <>
                    <h3 className="font-semibold text-red-800">
                      {recallSummary.urgent} urgent recall{recallSummary.urgent === 1 ? '' : 's'} found
                    </h3>
                    <p className="text-sm text-red-700">
                      Review now to keep Emma safe
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-green-800">
                      ✅ All clear — Emma's products are verified safe
                    </h3>
                    <p className="text-sm text-green-700">
                      Next scan tonight at 10 PM
                    </p>
                  </>
                )}
              </div>
            </div>
            {hasUrgentRecalls && (
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white text-xs flex-shrink-0"
              >
                Review
              </Button>
            )}
          </div>
          
          {/* Monitoring Information */}
          <div className="flex items-center gap-2 pt-1.5 border-t border-current/10">
            <span className={cn(
              "text-xs",
              hasUrgentRecalls ? "text-red-600" : "text-green-600"
            )}>
              Monitoring 12 products across FDA, CPSC, and NHTSA databases
            </span>
          </div>
        </div>
      </Card>

      {/* Today's Summary - Enhanced Visual Design */}
      <Card className="p-4 bg-white rounded-lg shadow-soft">
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">
            Today's Summary
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {todaysStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center space-y-1.5"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center mx-auto",
                      stat.bgColor,
                    )}
                  >
                    <Icon
                      className={cn("w-5 h-5", stat.color)}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xl font-semibold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs font-medium text-foreground">
                      {stat.label}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[11px] text-primary hover:text-primary hover:bg-primary/5 mx-auto"
                  >
                    + Log
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Safety Subtext */}
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              No recalls linked to Emma's feeding products today
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Actions - 2x3 Grid */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={index}
                className="p-4 bg-white rounded-lg shadow-soft hover:shadow-md transition-all duration-300 cursor-pointer group active:scale-95"
                onClick={action.action}
              >
                <div className="space-y-2">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300",
                      action.bgColor,
                      "group-hover:scale-110",
                    )}
                  >
                    <Icon
                      className={cn("w-5 h-5", action.color)}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {action.title}
                    </h4>
                    <p className="text-[13px] text-muted-foreground/70">
                      {action.subtitle}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Smart Insights - Two Card Stack */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">
          Smart Insights
        </h3>

        <div className="space-y-4">
          {/* Card 1: Urgent Product Recall Alert */}
          <Card className="p-4 bg-gradient-to-br from-red-50 to-amber-50 rounded-lg shadow-soft border-0 relative">
            {/* Badge in top-right corner */}
            <Badge className="absolute top-3 right-3 bg-red-600 text-white text-[10px] px-2 py-0.5">
              98% match
            </Badge>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 space-y-1 pr-16">
                <h4 className="text-[14px] font-semibold text-foreground">
                  Urgent Product Recall Alert
                </h4>
                <p className="text-[13px] text-muted-foreground leading-tight line-clamp-1">
                  2 products in your home have been recalled
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-700 hover:text-red-600 p-0 h-auto font-medium -ml-1 text-[13px]"
                  onClick={() => setLastAction('recall')}
                >
                  View recalls →
                </Button>
              </div>
            </div>
          </Card>

          {/* Card 2: Development Tip */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg shadow-soft border-0">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-[14px] font-semibold text-foreground">
                  Development Tip
                </h4>
                <p className="text-[13px] text-muted-foreground leading-tight line-clamp-1">
                  Emma is ready for soft finger foods like banana
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-emerald-700 hover:text-emerald-600 p-0 h-auto font-medium -ml-1 text-[13px]"
                >
                  View ideas →
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Safe Product of the Week */}
      <Card className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg shadow-soft border-0">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="text-[14px] font-semibold text-foreground">
              Safe Product of the Week
            </h4>
            <p className="text-[13px] text-muted-foreground leading-tight">
              This week's verified-safe brand: <span className="font-medium text-foreground">Little Nest Bottles</span> — No recalls in 24 months
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-green-700 hover:text-green-600 p-0 h-auto font-medium -ml-1 text-[13px]"
            >
              View details →
            </Button>
          </div>
        </div>
      </Card>

      {/* Contextual Encouragement Card */}
      <Card className="p-4 bg-gradient-to-br from-[#FFF9F3] to-white rounded-lg shadow-soft border-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <p className="text-[13px] text-foreground leading-snug">
              {lastAction === 'feed' 
                ? "You're doing an amazing job keeping Emma nourished 🍼"
                : lastAction === 'recall'
                ? "You acted fast — that's great parenting 💪"
                : lastAction === 'sleep'
                ? "Consistent sleep routines help Emma thrive — you're doing great 😴"
                : lastAction === 'milestone'
                ? "Tracking Emma's progress shows how much you care ❤️"
                : "You're doing an amazing job, Sarah. Every day with Emma is a gift 💙"
              }
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-orange-700 hover:text-orange-600 p-0 h-auto font-medium -ml-1"
            >
              Learn more →
            </Button>
          </div>
        </div>
      </Card>

      {/* Product Scanner Modal */}
      <ProductScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onProductScanned={(product, assessment) => {
          console.log("Product scanned:", product, assessment);
          // Could trigger notifications or add to inventory
        }}
      />

      {/* Floating Action Button - Safety Scan */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowScanner(true)}
              className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-50"
              style={{
                boxShadow: '0 4px 10px rgba(59, 130, 246, 0.15)',
              }}
              aria-label="Scan a product for safety"
            >
              <Camera className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-foreground text-background">
            <p>Scan a product for safety</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}