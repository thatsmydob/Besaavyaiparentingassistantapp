/**
 * DataSimulationPanel Component
 * Visual simulation panel for testing recall data binding
 * 
 * Allows inputting custom data to test the 3-step recall flow:
 * - {product_name}
 * - {model_number}
 * - {hazard}
 * - {manufacturer}
 * - {actions[]}
 * 
 * DESIGN SPECS:
 * - Slide-in drawer from bottom
 * - Input fields for all data keys
 * - Real-time preview button
 * - Reset functionality
 */
import React, { useState } from 'react';
import { Settings2, X, Eye, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';

interface SimulationData {
  product_name: string;
  model_number: string;
  hazard: string;
  manufacturer: string;
  actions: string[];
  brand?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  date: string;
  description: string;
  affected_units?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactWebsite?: string;
}

interface DataSimulationPanelProps {
  onPreview: (data: SimulationData) => void;
}

export function DataSimulationPanel({ onPreview }: DataSimulationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Default simulation data
  const defaultData: SimulationData = {
    product_name: 'DreamGlide Baby Rocker',
    model_number: 'DG-2024-PRO',
    hazard: 'Improper assembly can lead to rocker instability and potential tip-over hazard',
    manufacturer: 'BabySafe Industries',
    actions: [
      'Immediately stop using the rocker and place it out of reach',
      'Check the model number on the bottom label against the recall list',
      'Contact BabySafe Industries for a free repair kit or full refund'
    ],
    brand: 'BabySafe',
    severity: 'High',
    date: '2024-10-15',
    description: 'The rocker may tip over if not properly assembled, posing a fall hazard to infants.',
    affected_units: '~45,000 units sold nationwide',
    contactPhone: '1-800-BABY-SAFE',
    contactEmail: 'recall@babysafe.com',
    contactWebsite: 'https://www.babysafe.com/recalls'
  };

  const [simulationData, setSimulationData] = useState<SimulationData>(defaultData);

  const handleReset = () => {
    setSimulationData(defaultData);
  };

  const handleAddAction = () => {
    setSimulationData(prev => ({
      ...prev,
      actions: [...prev.actions, '']
    }));
  };

  const handleRemoveAction = (index: number) => {
    setSimulationData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const handleActionChange = (index: number, value: string) => {
    setSimulationData(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => i === index ? value : action)
    }));
  };

  const handlePreview = () => {
    onPreview(simulationData);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-20 right-4 z-50 rounded-full shadow-lg"
          style={{ 
            backgroundColor: '#4f46e5', 
            color: '#ffffff',
            border: 'none',
            width: '56px',
            height: '56px',
            padding: 0
          }}
        >
          <Settings2 className="w-5 h-5" />
        </Button>
      </SheetTrigger>

      <SheetContent 
        side="bottom" 
        className="h-[85vh] rounded-t-3xl"
        style={{ backgroundColor: '#FAFAFA' }}
      >
        <SheetHeader className="px-2">
          <SheetTitle style={{ fontSize: '18px', fontWeight: 600, color: '#212121' }}>
            Data Simulation Panel
          </SheetTitle>
          <SheetDescription style={{ fontSize: '13px', color: '#888888' }}>
            Test recall data binding across all 3 steps
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(85vh-180px)] mt-6">
          <div className="px-2 space-y-5">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="product_name" style={{ fontSize: '13px', fontWeight: 600, color: '#424242' }}>
                Product Name <span style={{ color: '#888888' }}>{'{product_name}'}</span>
              </Label>
              <Input
                id="product_name"
                value={simulationData.product_name}
                onChange={(e) => setSimulationData(prev => ({ ...prev, product_name: e.target.value }))}
                placeholder="Enter product name..."
                className="rounded-xl"
                style={{ fontSize: '14px' }}
              />
            </div>

            {/* Brand (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="brand" style={{ fontSize: '13px', fontWeight: 600, color: '#424242' }}>
                Brand <span style={{ color: '#888888', fontWeight: 400 }}>(optional)</span>
              </Label>
              <Input
                id="brand"
                value={simulationData.brand || ''}
                onChange={(e) => setSimulationData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="Enter brand name..."
                className="rounded-xl"
                style={{ fontSize: '14px' }}
              />
            </div>

            {/* Model Number */}
            <div className="space-y-2">
              <Label htmlFor="model_number" style={{ fontSize: '13px', fontWeight: 600, color: '#424242' }}>
                Model Number <span style={{ color: '#888888' }}>{'{model_number}'}</span>
              </Label>
              <Input
                id="model_number"
                value={simulationData.model_number}
                onChange={(e) => setSimulationData(prev => ({ ...prev, model_number: e.target.value }))}
                placeholder="Enter model number..."
                className="rounded-xl"
                style={{ fontSize: '14px' }}
              />
            </div>

            <Separator className="bg-gray-200" />

            {/* Hazard */}
            <div className="space-y-2">
              <Label htmlFor="hazard" style={{ fontSize: '13px', fontWeight: 600, color: '#424242' }}>
                Hazard Details <span style={{ color: '#888888' }}>{'{hazard}'}</span>
              </Label>
              <Textarea
                id="hazard"
                value={simulationData.hazard}
                onChange={(e) => setSimulationData(prev => ({ ...prev, hazard: e.target.value }))}
                placeholder="Describe the safety hazard..."
                className="rounded-xl min-h-[80px]"
                style={{ fontSize: '14px' }}
              />
            </div>

            {/* Severity */}
            <div className="space-y-2">
              <Label htmlFor="severity" style={{ fontSize: '13px', fontWeight: 600, color: '#424242' }}>
                Severity Level
              </Label>
              <select
                id="severity"
                value={simulationData.severity}
                onChange={(e) => setSimulationData(prev => ({ ...prev, severity: e.target.value as any }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                style={{ fontSize: '14px', backgroundColor: '#ffffff' }}
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" style={{ fontSize: '13px', fontWeight: 600, color: '#424242' }}>
                Description
              </Label>
              <Textarea
                id="description"
                value={simulationData.description}
                onChange={(e) => setSimulationData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the recall..."
                className="rounded-xl min-h-[60px]"
                style={{ fontSize: '14px' }}
              />
            </div>

            {/* Affected Units */}
            <div className="space-y-2">
              <Label htmlFor="affected_units" style={{ fontSize: '13px', fontWeight: 600, color: '#424242' }}>
                Affected Units <span style={{ color: '#888888', fontWeight: 400 }}>(optional)</span>
              </Label>
              <Input
                id="affected_units"
                value={simulationData.affected_units || ''}
                onChange={(e) => setSimulationData(prev => ({ ...prev, affected_units: e.target.value }))}
                placeholder="e.g., ~45,000 units sold nationwide"
                className="rounded-xl"
                style={{ fontSize: '14px' }}
              />
            </div>

            <Separator className="bg-gray-200" />

            {/* Manufacturer */}
            <div className="space-y-2">
              <Label htmlFor="manufacturer" style={{ fontSize: '13px', fontWeight: 600, color: '#424242' }}>
                Manufacturer <span style={{ color: '#888888' }}>{'{manufacturer}'}</span>
              </Label>
              <Input
                id="manufacturer"
                value={simulationData.manufacturer}
                onChange={(e) => setSimulationData(prev => ({ ...prev, manufacturer: e.target.value }))}
                placeholder="Enter manufacturer name..."
                className="rounded-xl"
                style={{ fontSize: '14px' }}
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <Label style={{ fontSize: '13px', fontWeight: 600, color: '#424242' }}>
                Contact Information
              </Label>
              
              <Input
                placeholder="Phone: 1-800-XXX-XXXX"
                value={simulationData.contactPhone || ''}
                onChange={(e) => setSimulationData(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="rounded-xl"
                style={{ fontSize: '14px' }}
              />
              
              <Input
                placeholder="Email: recall@company.com"
                value={simulationData.contactEmail || ''}
                onChange={(e) => setSimulationData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="rounded-xl"
                style={{ fontSize: '14px' }}
              />
              
              <Input
                placeholder="Website: https://..."
                value={simulationData.contactWebsite || ''}
                onChange={(e) => setSimulationData(prev => ({ ...prev, contactWebsite: e.target.value }))}
                className="rounded-xl"
                style={{ fontSize: '14px' }}
              />
            </div>

            <Separator className="bg-gray-200" />

            {/* Actions Array */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label style={{ fontSize: '13px', fontWeight: 600, color: '#424242' }}>
                  Action Steps <span style={{ color: '#888888' }}>{'{actions[]}'}</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddAction}
                  className="rounded-lg"
                  style={{ fontSize: '12px', height: '32px' }}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Step
                </Button>
              </div>

              {simulationData.actions.map((action, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <Label style={{ fontSize: '12px', color: '#888888' }}>
                      Step {index + 1}
                    </Label>
                    <Textarea
                      value={action}
                      onChange={(e) => handleActionChange(index, e.target.value)}
                      placeholder={`Action step ${index + 1}...`}
                      className="rounded-xl min-h-[60px]"
                      style={{ fontSize: '14px' }}
                    />
                  </div>
                  {simulationData.actions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAction(index)}
                      className="mt-6 rounded-lg"
                      style={{ color: '#DC2626' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" style={{ fontSize: '13px', fontWeight: 600, color: '#424242' }}>
                Recall Date
              </Label>
              <Input
                id="date"
                type="date"
                value={simulationData.date}
                onChange={(e) => setSimulationData(prev => ({ ...prev, date: e.target.value }))}
                className="rounded-xl"
                style={{ fontSize: '14px' }}
              />
            </div>

            {/* Spacer for bottom buttons */}
            <div className="h-8" />
          </div>
        </ScrollArea>

        {/* Fixed bottom action buttons */}
        <div 
          className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white/95 backdrop-blur-sm rounded-t-xl"
          style={{ borderColor: '#E5E7EB' }}
        >
          <div className="flex gap-3">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 rounded-xl min-h-[48px]"
              style={{ fontSize: '14px', fontWeight: 600, borderColor: '#888888', color: '#555555' }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <Button
              onClick={handlePreview}
              className="flex-1 rounded-xl min-h-[48px]"
              style={{ backgroundColor: '#4f46e5', fontSize: '14px', fontWeight: 600 }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Recall
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
