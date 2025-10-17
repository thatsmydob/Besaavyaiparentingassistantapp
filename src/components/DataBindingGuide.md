# Data Binding Guide - Recall Detail Flow

This document outlines the data binding structure for the 3-step recall detail flow simulation.

## Data Keys

The following data keys are bound throughout the recall detail screens:

### Core Product Data
- **{product_name}** - Product name (e.g., "DreamGlide Baby Rocker")
- **{model_number}** - Model number (e.g., "DG-2024-PRO")
- **{brand}** - Brand name (optional, e.g., "BabySafe")

### Safety Information
- **{hazard}** - Hazard details and description
- **{severity}** - Severity level (Critical, High, Medium, Low)
- **{description}** - Brief recall description
- **{affected_units}** - Number of affected units (optional)

### Manufacturer Data
- **{manufacturer}** - Manufacturer/company name
- **{contactPhone}** - Manufacturer contact phone
- **{contactEmail}** - Manufacturer contact email
- **{contactWebsite}** - Manufacturer website URL

### Action Items
- **{actions[]}** - Array of action steps to take
  - Each action is a string describing what the user should do
  - Displayed as a numbered checklist in Step 2
  - Shown as completed items in Step 3

## Data Flow Through Screens

### Step 1: "Do You Have This?" (RecallDetailStep1)
Binds:
- {product_name}
- {brand} (if available)
- {model_number}
- {hazard}
- {severity}
- {description}
- {affected_units}
- Image (from Unsplash or placeholder)

### Step 2: "Action Guide" (RecallDetailStep2)
Binds:
- {product_name}
- {brand}
- {model_number}
- {actions[]} - Displayed as interactive checklist
- {manufacturer}
- {contactPhone}
- {contactEmail}
- {contactWebsite}

Note: Step 2 uses a fixed 3-step checklist:
1. Stop using the product immediately
2. Verify your model number
3. Contact manufacturer for remedy

### Step 3: "Completion Overlay" (RecallDetailStep3)
Binds:
- {product_name}
- {brand}
- {model_number}
- Completed actions (fixed 3-step summary)

## Using the Data Simulation Panel

1. **Access**: Click the floating indigo settings button (⚙️) in the bottom-right corner of the Safety Screen

2. **Input Data**: Fill in the placeholder fields:
   - Product Name
   - Brand (optional)
   - Model Number
   - Hazard Details
   - Severity Level (dropdown)
   - Description
   - Affected Units (optional)
   - Manufacturer
   - Contact Info (phone, email, website)
   - Action Steps (add/remove as needed)

3. **Preview**: Click "Preview Recall" to open the RecallDetailModal with your test data

4. **Reset**: Click "Reset" to restore default simulation data

## Example Data Structure

```typescript
{
  product_name: "DreamGlide Baby Rocker",
  brand: "BabySafe",
  model_number: "DG-2024-PRO",
  hazard: "Improper assembly can lead to rocker instability and potential tip-over hazard",
  severity: "High",
  description: "The rocker may tip over if not properly assembled, posing a fall hazard to infants.",
  affected_units: "~45,000 units sold nationwide",
  manufacturer: "BabySafe Industries",
  contactPhone: "1-800-BABY-SAFE",
  contactEmail: "recall@babysafe.com",
  contactWebsite: "https://www.babysafe.com/recalls",
  actions: [
    "Immediately stop using the rocker and place it out of reach",
    "Check the model number on the bottom label against the recall list",
    "Contact BabySafe Industries for a free repair kit or full refund"
  ],
  date: "2024-10-15"
}
```

## Visual Simulation Testing

The Data Simulation Panel allows you to:

✅ Test different recall scenarios
✅ Verify data binding across all 3 steps
✅ Preview how different severity levels affect UI
✅ Test with/without optional fields (brand, affected units)
✅ Validate action step display and formatting
✅ Test manufacturer contact information display
✅ Simulate real-world recall data

## Notes

- All fields support real-time editing
- Changes are immediately reflected when you click "Preview Recall"
- The simulation data persists within the session
- Product images use Unsplash placeholders in simulation mode
- Toast notification confirms when test data is loaded
