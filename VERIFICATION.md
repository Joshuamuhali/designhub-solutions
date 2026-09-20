# Service Inquiries Verification

## Step 1: Run the Supabase SQL Setup

Before testing, run the SQL in `supabase-service-inquiries.sql` in your Supabase SQL Editor to create the `service_inquiries` table with proper RLS policies and UTM tracking columns.

## Verification SQL Query

Run this query in your Supabase SQL Editor to verify inquiries are being saved correctly with UTM attribution:

```sql
SELECT 
  service_title,
  service_category,
  service_type,
  service_price,
  selected_addons,
  client_name,
  client_phone,
  source_page,
  utm_source,
  utm_medium,
  utm_campaign,
  status,
  created_at
FROM service_inquiries 
ORDER BY created_at DESC 
LIMIT 20;
```

## Service Landing Pages Verification

### Test 1: Service Landing Page Loads
1. Navigate to `/solutions`
2. Click on any service card
3. Verify it redirects to `/services/[slug]` (e.g., `/services/business-audit`)
4. Verify the page shows:
   - Service category badge
   - Service type badge (Standard/Subscription/Bundle)
   - Service title
   - Service headline (if exists)
   - Service price
   - Service description
   - Inclusions list
   - Add-ons section (if applicable)
   - Target audience (if applicable)

### Test 2: WhatsApp Button on Landing Page
1. Navigate to a service landing page (e.g., `/services/business-audit`)
2. Click "Immediate WhatsApp"
3. Verify it opens WhatsApp with pre-filled message including service name and price
4. Message format: "Hi Designhub! I'm interested in the [Service Name] ([Price])."

### Test 3: Inquiry Form on Landing Page
1. Navigate to a service landing page
2. Click "Send Inquiry to Our Team"
3. Verify modal opens with service details pre-populated
4. Fill in required fields
5. Click "Send Inquiry"
6. Verify success message appears
7. Run verification SQL query
8. Confirm row exists with correct `source_page` = `/services/[slug]`

### Test 4: UTM Parameter Capture
1. Navigate to a service landing page with UTM params:
   `/services/business-audit?utm_source=facebook&utm_medium=cpc&utm_campaign=website_ads`
2. Click "Send Inquiry to Our Team"
3. Fill in required fields and submit
4. Run verification SQL query
5. Confirm row exists with:
   - `utm_source` = "facebook"
   - `utm_medium` = "cpc"
   - `utm_campaign` = "website_ads"

### Test 5: 404 for Invalid Slug
1. Navigate to `/services/invalid-slug-that-does-not-exist`
2. Verify 404 page appears with "Service Not Found" message
3. Verify "Browse All Services" button redirects to `/solutions`

### Test 6: Bundle Landing Page
1. Navigate to `/solutions`
2. Scroll to "Value Bundles" section
3. Click on a bundle card
4. Verify it redirects to `/services/[bundle-slug]`
5. Verify page shows bundle details with "Bundle" type badge
6. Verify no add-ons section is shown (bundles don't have add-ons)

### Test 7: SEO Metadata
1. Navigate to a service landing page
2. Check browser tab title - should show "[Service Name] | Designhub Solutions"
3. View page source and verify:
   - `<title>` tag is updated
   - `<meta name="description">` is updated
   - `<meta property="og:title">` is updated
   - `<meta property="og:description">` is updated
   - `<meta property="og:url">` is updated to current page URL
   - `<link rel="canonical">` is updated to current page URL

## Manual Test Checklist

### Test 1: Standard Service Inquiry from Landing Page
1. Navigate to `/services/business-starter-package`
2. Click "Send Inquiry to Our Team"
3. Verify modal shows:
   - Service category: "START"
   - Service type: "Standard"
   - Service title: "Business Starter Package"
   - Service price: "From K3,500"
   - Add-ons checkboxes (Business Email Setup, Basic Logo Design)
4. Select 1-2 add-ons
5. Fill in required fields:
   - Full Name: "Test User"
   - Phone Number: "+260971234567"
6. Click "Send Inquiry"
7. Verify success message appears
8. Run verification SQL query
9. Confirm row exists with:
    - `service_type` = "Standard"
    - `service_title` = "Business Starter Package"
    - `service_price` = "From K3,500"
    - `selected_addons` contains selected add-on names
    - `client_name` = "Test User"
    - `client_phone` = "+260971234567"
    - `source_page` = "/services/business-starter-package"
    - `status` = "new"

### Test 2: Subscription Service Inquiry
1. Navigate to a service with `billingType: 'monthly'`
2. Click "Send Inquiry to Our Team"
3. Verify service type badge shows "Subscription"
4. Fill in required fields and submit
5. Run verification SQL query
6. Confirm `service_type` = "Subscription"

### Test 3: Bundle Inquiry
1. Navigate to a bundle landing page
2. Click "Send Inquiry to Our Team"
3. Verify service type badge shows "Bundle"
4. Verify no add-ons section
5. Fill in required fields and submit
6. Run verification SQL query
7. Confirm `service_type` = "Bundle" and `selected_addons` = `{}`

### Test 4: Keyboard Accessibility on Landing Page
1. Navigate to a service landing page
2. Click "Send Inquiry to Our Team"
3. Press `Escape` key - verify modal closes
4. Press `Tab` to navigate through form fields
5. Verify focus stays within modal

### Test 5: Mobile Responsiveness on Landing Page
1. Open browser in mobile view
2. Navigate to a service landing page
3. Verify all content is readable without horizontal scrolling
4. Verify CTA buttons are visible without scrolling
5. Test inquiry form on mobile

## Expected Data Schema

Each inquiry row should contain:

| Field | Type | Example |
|-------|------|---------|
| id | uuid | `550e8400-e29b-41d4-a716-446655440000` |
| created_at | timestamptz | `2026-09-18 22:00:00+00` |
| service_category | text | `"START"` |
| service_type | text | `"Standard"` \| `"Subscription"` \| `"Bundle"` |
| service_title | text | `"Business Starter Package"` |
| service_price | text | `"From K3,500"` |
| selected_addons | text[] | `{"Business Email Setup", "Basic Logo Design"}` |
| client_name | text | `"John Doe"` |
| client_phone | text | `"+260971234567"` |
| client_email | text | `"john@example.com"` (nullable) |
| business_name | text | `"My Company Ltd"` (nullable) |
| message | text | `"Need urgent delivery"` (nullable) |
| status | text | `"new"` |
| source_page | text | `"/services/business-starter-package"` |
| utm_source | text | `"facebook"` (nullable) |
| utm_medium | text | `"cpc"` (nullable) |
| utm_campaign | text | `"website_ads"` (nullable) |

## Ad Campaign Testing

### Test Facebook Ads
1. Create ad with URL: `https://yourdomain.com/services/professional-website?utm_source=facebook&utm_medium=cpc&utm_campaign=website_ads_q3_2026`
2. Click ad and navigate to landing page
3. Submit inquiry
4. Verify UTM params are captured in database

### Test Google Ads
1. Create ad with URL: `https://yourdomain.com/services/crm?utm_source=google&utm_medium=cpc&utm_campaign=crm_solution_ads`
2. Click ad and navigate to landing page
3. Submit inquiry
4. Verify UTM params are captured in database

### Test Email Campaign
1. Send email with link: `https://yourdomain.com/services/business-audit?utm_source=newsletter&utm_medium=email&utm_campaign=september_promo`
2. Click link and navigate to landing page
3. Submit inquiry
4. Verify UTM params are captured in database

## Troubleshooting

### Service landing page shows 404
- Verify the slug matches a service ID in products.ts
- Check that getServiceBySlug function is returning the service
- Verify the route is correctly set up in App.tsx

### UTM params not captured
- Verify UTM columns were added to service_inquiries table
- Check that searchParams are being read correctly
- Verify UTM values are being passed to Supabase insert

### SEO metadata not updating
- Check browser console for errors
- Verify meta tags exist in index.html
- Check that useEffect is running after service loads

### WhatsApp message incorrect
- Verify handleWhatsAppClick function uses correct phone number
- Check that service.name and service.price are being interpolated correctly
