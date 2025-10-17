/**
 * AIAssistantScreen Component
 * 
 * Interactive AI chat interface providing:
 * - Real-time parenting guidance and support
 * - Contextual suggestions based on baby's age
 * - Quick topic buttons for common questions
 * - Message history with timestamps
 * - Supportive and empathetic responses
 * - Medical source citations for safety advice
 */
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Clock, 
  Heart, 
  Mic,
  CheckCircle
} from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'checklist';
  metadata?: {
    suggestions?: string[];
    priority?: 'low' | 'medium' | 'high';
    category?: string;
  };
}

export function AIAssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi Sarah! 👋 I'm here to support you on your parenting journey with Emma. Whether you have questions about feeding, sleep, development, or just need someone to talk to - I'm here to help. What's on your mind today?",
      sender: 'ai',
      timestamp: new Date(Date.now() - 300000),
      metadata: { priority: 'medium', category: 'welcome' }
    },
    {
      id: '2',
      content: "Emma has been fussy during feeding time lately. She pushes the spoon away and starts crying. I'm worried she's not eating enough.",
      sender: 'user',
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: '3',
      content: "I understand how concerning that must feel, Sarah. Feeding fussiness at 8 months is actually quite common and often signals positive development! 🌱\n\nHere are some gentle approaches to try:\n\n• **Let Emma lead**: She might be ready to self-feed. Try offering small, soft finger foods alongside spoon feeding\n• **Check timing**: She might be overly hungry or not hungry enough. Try offering food when she's alert but calm\n• **Make it playful**: Let her explore and get messy - this is learning!\n• **Stay calm**: Babies pick up on our stress. Take deep breaths and follow her cues\n\nRemember, growth spurts and developmental leaps can temporarily affect appetite. As long as she's having wet diapers and seems generally happy, she's likely getting what she needs.\n\nWould you like specific finger food ideas, or shall we talk about reading her hunger cues?",
      sender: 'ai',
      timestamp: new Date(Date.now() - 180000),
      metadata: { 
        priority: 'high', 
        category: 'feeding',
        suggestions: ['Finger food ideas', 'Reading hunger cues', 'When to worry about eating']
      }
    },
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const quickSuggestions = [
    { text: "Sleep schedule help", category: "sleep", icon: "😴" },
    { text: "Teething remedies", category: "health", icon: "🦷" },
    { text: "Development milestones", category: "development", icon: "📈" },
    { text: "I need encouragement", category: "support", icon: "💙" }
  ];

  const handleSendMessage = (content?: string) => {
    const messageContent = content || inputValue;
    if (!messageContent.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI response with supportive, empathetic content
    setTimeout(() => {
      const supportiveResponses = [
        "That's a wonderful question, Sarah. Let me share some gentle guidance that might help...",
        "I can hear the love and care in your words. Here's what I'd suggest based on Emma's age and development...",
        "You're being such an attentive parent by noticing this. Let's explore some calming approaches together...",
        "Thank you for sharing this with me. Many parents experience similar concerns, and there are some nurturing ways to address this..."
      ];
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
        metadata: { priority: 'medium', category: 'support' }
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-calm-blue/20">
      {/* Enhanced Header */}
      <div className="p-6 bg-gradient-to-r from-primary-lightest via-secondary-lightest to-calm-blue border-b border-border/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary-light to-secondary flex items-center justify-center shadow-sm animate-breath">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">AI Assistant</h2>
            <p className="text-sm text-muted-foreground">
              Your supportive parenting companion • Always here to help
            </p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-gentle"></div>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="p-4 bg-muted/20 border-b border-border/30">
        <p className="text-xs text-muted-foreground mb-3 font-medium">Quick help with:</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {quickSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs bg-white/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 flex items-center gap-2"
              onClick={() => handleSendMessage(suggestion.text)}
            >
              <span className="text-sm">{suggestion.icon}</span>
              {suggestion.text}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-in slide-in-from-bottom-2 duration-300",
                message.sender === 'user' ? 'flex-row-reverse' : ''
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                message.sender === 'ai' 
                  ? 'bg-gradient-to-br from-primary to-secondary'
                  : 'bg-gradient-to-br from-muted to-muted-foreground/20'
              )}>
                {message.sender === 'ai' ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              
              {/* Message Content */}
              <div className={cn(
                "flex-1 max-w-[85%] space-y-2",
                message.sender === 'user' ? 'items-end' : ''
              )}>
                <Card className={cn(
                  "p-4 shadow-sm border-0 relative",
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : 'bg-white/90 backdrop-blur-sm'
                )}>
                  {/* Message Priority Indicator */}
                  {message.metadata?.priority === 'high' && message.sender === 'ai' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-white" />
                  )}
                  
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {message.content}
                  </p>
                  
                  {/* AI Message Suggestions */}
                  {message.metadata?.suggestions && (
                    <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">What would you like to explore?</p>
                      <div className="flex flex-wrap gap-2">
                        {message.metadata.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="text-xs bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20"
                            onClick={() => handleSendMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
                
                {/* Timestamp and Status */}
                <div className={cn(
                  "flex items-center gap-2 px-2 text-xs text-muted-foreground",
                  message.sender === 'user' ? 'justify-end' : ''
                )}>
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(message.timestamp)}</span>
                  {message.sender === 'user' && (
                    <CheckCircle className="w-3 h-3 text-primary" />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <Card className="p-4 bg-white/90 backdrop-blur-sm shadow-sm border-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">Thinking...</span>
                </div>
              </Card>
            </div>
          )}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Enhanced Input Area */}
      <div className="p-4 bg-white/95 backdrop-blur-md border-t border-border/30 shadow-lg">
        <div className="flex gap-3 items-end">
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Share what's on your mind..."
                className="flex-1 bg-muted/30 border-border/50 focus:border-primary/50 rounded-xl text-base py-3"
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                disabled={isTyping}
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary transition-colors p-3"
                disabled={isTyping}
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary hover:bg-primary-light text-white px-4 py-3 rounded-xl shadow-sm disabled:opacity-50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Supportive Footer */}
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
          <Heart className="w-3 h-3 text-pink-400" />
          <span>Powered by empathy and pediatric expertise</span>
        </div>
      </div>
    </div>
  );
}