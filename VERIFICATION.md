# Service Inquiries Verification

## Step 1: Run the Supabase SQL Setup

Before testing, run the SQL in `supabase-service-inquiries.sql` in your Supabase SQL Editor to create the `service_inquiries` table with proper RLS policies.

## Verification SQL Query

Run this query in your Supabase SQL Editor to verify inquiries are being saved correctly:

```sql
SELECT 
  service_title,
  service_category,
  service_type,
  service_price,
  selected_addons,
  client_name,
  client_phone,
  client_email,
  business_name,
  status,
  created_at
FROM service_inquiries 
ORDER BY created_at DESC 
LIMIT 20;
```

## Manual Test Checklist

### Test 1: Standard Service Inquiry
1. Navigate to `/solutions`
2. Find a Standard service (e.g., "Professional Website" in DIGITAL category)
3. Click "Send Inquiry to Our Team"
4. Verify modal shows:
   - Service category (e.g., "DIGITAL")
   - Service title (e.g., "Professional Website")
   - Service price (e.g., "K7,500")
   - Optional add-ons checkboxes (if applicable)
5. Fill in required fields:
   - Full Name: "Test User"
   - Phone Number: "+260971234567"
6. Optionally select add-ons
7. Click "Send Inquiry"
8. Verify success message appears
9. Run verification SQL query
10. Confirm row exists with:
    - `service_type` = "Standard"
    - `service_title` = "Professional Website"
    - `service_price` = "K7,500"
    - `client_name` = "Test User"
    - `client_phone` = "+260971234567"
    - `status` = "new"

### Test 2: Subscription Service Inquiry
1. Navigate to `/solutions`
2. Find a Subscription service (e.g., any service with `billingType: 'monthly'`)
3. Click "Send Inquiry to Our Team"
4. Verify modal shows service details
5. Fill in required fields
6. Click "Send Inquiry"
7. Run verification SQL query
8. Confirm row exists with:
    - `service_type` = "Subscription"
    - Correct service title and price

### Test 3: Value Bundle Inquiry
1. Navigate to `/solutions`
2. Scroll to "Value Bundles" section
3. Click "Send Inquiry to Our Team" on a bundle
4. Verify modal shows:
   - Service category: "Bundle"
   - Bundle name and price
   - No add-ons section (bundles don't have add-ons)
5. Fill in required fields
6. Click "Send Inquiry"
7. Run verification SQL query
8. Confirm row exists with:
    - `service_type` = "Bundle"
    - Correct bundle name and price
    - `selected_addons` = empty array `{}`

### Test 4: Add-ons Selection
1. Navigate to `/solutions`
2. Find a service with add-ons (e.g., "Professional Website")
3. Click "Send Inquiry to Our Team"
4. Select 2-3 add-ons
5. Fill in required fields
6. Click "Send Inquiry"
7. Run verification SQL query
8. Confirm `selected_addons` array contains the selected add-on names

### Test 5: Error Handling
1. Navigate to `/solutions`
2. Click "Send Inquiry to Our Team"
3. Click "Send Inquiry" without filling required fields
4. Verify browser validation prevents submission
5. Try again with invalid Supabase connection (temporarily disconnect)
6. Verify error message appears with retry option

### Test 6: Keyboard Accessibility
1. Navigate to `/solutions`
2. Click "Send Inquiry to Our Team"
3. Press `Escape` key
4. Verify modal closes
5. Click "Send Inquiry to Our Team" again
6. Press `Tab` to navigate through form fields
7. Verify focus stays within modal (focus trap)
8. Press `Shift+Tab` to navigate backwards
9. Verify focus stays within modal

### Test 7: Mobile Responsiveness
1. Open browser in mobile view (or use mobile device)
2. Navigate to `/solutions`
3. Click "Send Inquiry to Our Team"
4. Verify modal is fully visible and scrollable
5. Verify all form fields are accessible
6. Test submission on mobile

## Expected Data Schema

Each inquiry row should contain:

| Field | Type | Example |
|-------|------|---------|
| id | uuid | `550e8400-e29b-41d4-a716-446655440000` |
| created_at | timestamptz | `2026-09-18 22:00:00+00` |
| service_category | text | `"DIGITAL"` |
| service_type | text | `"Standard"` \| `"Subscription"` \| `"Bundle"` |
| service_title | text | `"Professional Website"` |
| service_price | text | `"K7,500"` |
| selected_addons | text[] | `{"Domain Registration", "SSL Certificate"}` |
| client_name | text | `"John Doe"` |
| client_phone | text | `"+260971234567"` |
| client_email | text | `"john@example.com"` (nullable) |
| business_name | text | `"My Company Ltd"` (nullable) |
| message | text | `"Need urgent delivery"` (nullable) |
| status | text | `"new"` |
| source_page | text | `"/solutions"` |

## Troubleshooting

### No inquiries appearing in database
- Check that `supabase-service-inquiries.sql` was run
- Verify RLS policies are enabled
- Check browser console for errors
- Verify Supabase URL and anon key in `.env`

### Add-ons not saving
- Verify the service has `addons` array in products data
- Check that checkboxes are being toggled
- Verify `selected_addons` is being passed to Supabase

### Service type incorrect
- Check `billingType` in products data
- Verify logic in `handleInquirySubmit` function
- For bundles, verify `isBundle` state is set correctly
