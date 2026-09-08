-- SCHEMAS & TABLES FOR CRM-DRIVEN SERVICES AND PRODUCTS LANDING PAGE ENGINE

-- 1. Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL DEFAULT 'digital',
    short_description TEXT NOT NULL,
    full_description TEXT,
    price DECIMAL(10,2),
    price_type TEXT NOT NULL DEFAULT 'starting_at' CHECK (price_type IN ('fixed', 'starting_at', 'range', 'custom')),
    pricing_details TEXT,
    turnaround_time TEXT DEFAULT '5-7 business days',
    intake_status TEXT DEFAULT 'Open for Intake' CHECK (intake_status IN ('Open for Intake', 'Limited Slots', 'Waitlist Only')),
    hero_headline TEXT,
    hero_subheadline TEXT,
    problem_statement TEXT,
    solution_statement TEXT,
    benefits JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    process JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    cta_text TEXT DEFAULT 'Express Interest',
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL DEFAULT 'branding',
    short_description TEXT NOT NULL,
    full_description TEXT,
    price DECIMAL(10,2),
    price_type TEXT NOT NULL DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'starting_at', 'range', 'custom')),
    pricing_details TEXT,
    turnaround_time TEXT DEFAULT '3-5 business days',
    intake_status TEXT DEFAULT 'In Stock & Ready' CHECK (intake_status IN ('In Stock & Ready', 'Pre-Order', 'Limited Stock')),
    hero_headline TEXT,
    hero_subheadline TEXT,
    problem_statement TEXT,
    solution_statement TEXT,
    benefits JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    process JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    cta_text TEXT DEFAULT 'Order / Express Interest',
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enhance leads table with attribution fields
ALTER TABLE leads ADD COLUMN IF NOT EXISTS offering_type TEXT CHECK (offering_type IN ('service', 'product', 'general'));
ALTER TABLE leads ADD COLUMN IF NOT EXISTS offering_id UUID;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS offering_slug TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS landing_page TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign TEXT;

-- 4. Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Allow public to read published services & products
CREATE POLICY "Public can view published services" ON services
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all services" ON services
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('admin', 'super_admin', 'sales_head', 'marketing')
    );

CREATE POLICY "Public can view published products" ON products
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all products" ON products
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('admin', 'super_admin', 'sales_head', 'marketing')
    );

-- 6. Insert Default Seed Services
INSERT INTO services (name, slug, category, short_description, full_description, price, price_type, pricing_details, turnaround_time, intake_status, hero_headline, hero_subheadline, problem_statement, solution_statement, benefits, features, process, faqs, cta_text, status)
VALUES
(
    'Web Design & Development',
    'web-design',
    'digital',
    'High-converting, responsive business websites built for trust, speed, and real lead generation.',
    'We build modern, custom websites designed around your brand strategy, user experience, and growth goals. No generic templates—just clean code, smooth animations, and high conversion structures.',
    4500.00,
    'starting_at',
    'Includes custom UI/UX design, responsive layout, SEO optimization, and CMS integration.',
    '7-14 business days',
    'Open for Intake',
    'Your Business Needs More Than a Website. It Needs a Growth Engine.',
    'Professional, fast, and secure websites engineered to turn visitors into paying clients.',
    'Most business websites look outdated, load slowly, or fail to convert visitors into inquiries. Your prospective clients make judgment calls in seconds based on your digital presence.',
    'We design bespoke web platforms crafted specifically for your industry, combining high-end design aesthetics with optimized lead capture forms and seamless mobile performance.',
    '[{"title": "Increased Credibility", "desc": "Establish instant trust with prospective clients through world-class visual presentation."}, {"title": "Mobile-First Speed", "desc": "Lightning-fast page speeds optimized for mobile browsing and search engines."}, {"title": "Seamless CRM Sync", "desc": "Inquiries route directly into your Designhub CRM pipeline automatically."}]'::jsonb,
    '[{"title": "Custom UI/UX Design", "desc": "Tailored visually to match your identity."}, {"title": "SEO Infrastructure", "desc": "Built with search engine best practices from day one."}, {"title": "Lead Management System", "desc": "Connected directly to your lead dashboard."}]'::jsonb,
    '[{"step": 1, "title": "Discovery & Brief", "desc": "We analyze your audience and project goals."}, {"step": 2, "title": "Design & Prototype", "desc": "Interactive layout preview for your review."}, {"step": 3, "title": "Development", "desc": "Clean code construction & CRM integration."}, {"step": 4, "title": "Launch & Handover", "desc": "Final quality checks and domain launch."}]'::jsonb,
    '[{"q": "How long does a website project take?", "a": "Standard business websites are completed within 7–14 business days depending on feature requirements."}, {"q": "Do I need technical skills to update content?", "a": "Not at all. We provide intuitive management tools and support."}]'::jsonb,
    'Get Started with Web Design',
    'published'
),
(
    'Company Profile Design',
    'company-profile',
    'branding',
    'Persuasive, publication-ready corporate profiles crafted for tenders, proposals, and investors.',
    'Win high-value bids and present your organization with authoritative clarity. We write, structure, and design company profiles that convey scale, reliability, and expertise.',
    2500.00,
    'starting_at',
    'Includes professional copywriting review, custom layout design, print-ready PDF, and digital interactive version.',
    '3-5 business days',
    'Open for Intake',
    'Win More Tenders & Partnerships with an Authoritative Company Profile.',
    'Corporate documentation engineered to communicate capability, compliance, and corporate prestige.',
    'Submitting a poorly formatted company profile costs businesses major contracts. Decision makers judge your operational capacity by the caliber of your presentation.',
    'We translate your history, team, and services into a structured, highly persuasive document tailored to procurement boards and enterprise clients.',
    '[{"title": "Tender Ready", "desc": "Formatted specifically to meet corporate and government tender standards."}, {"title": "Professional Copywriting", "desc": "Refined wording that highlights your competitive advantages."}, {"title": "Dual Delivery", "desc": "Provided in ultra-high resolution print PDF and light web-optimized PDF."}]'::jsonb,
    '[{"title": "Custom Layout", "desc": "No standard templates—100% unique design."}, {"title": "Infographics & Org Charts", "desc": "Clear visual representation of your structure."}, {"title": "Interactive Digital PDF", "desc": "Clickable links for website and email attachments."}]'::jsonb,
    '[{"step": 1, "title": "Information Intake", "desc": "Fill in your key business details."}, {"step": 2, "title": "Content Drafting", "desc": "Our copywriters polish your messaging."}, {"step": 3, "title": "Design & Layout", "desc": "Visual synthesis and branding application."}, {"step": 4, "title": "Final Delivery", "desc": "Receive print and digital packages."}]'::jsonb,
    '[{"q": "What information do I need to provide?", "a": "Your company background, services, past projects, vision, and logo. We handle the rest!"}, {"q": "Can I request revisions?", "a": "Yes, all company profile packages include 2 full rounds of revisions."}]'::jsonb,
    'Request Company Profile',
    'published'
),
(
    'Brand Identity & Logo Design',
    'logo-design',
    'branding',
    'Distinctive corporate identity systems, brand guidelines, and vector logos built to scale.',
    'Your visual identity is the foundation of your company image. We craft memorable logos and full brand guideline systems that work seamlessly across digital, print, and physical collateral.',
    1800.00,
    'starting_at',
    'Includes logo concepts, brand style guide, font pairings, color codes, and full vector file kit.',
    '4-7 business days',
    'Open for Intake',
    'Build a Brand Image People Recognize and Remember.',
    'Strategic brand identity design that sets you apart from competitors.',
    'Generic stock logos make businesses look amateurish and unmemorable.',
    'We create iconic visual identities rooted in your brand positioning, delivering complete design systems.',
    '[{"title": "Full Vector Kit", "desc": "Vector EPS, SVG, PNG, PDF files for all use cases."}, {"title": "Brand Guidelines", "desc": "Complete rules for color, typography, and logo usage."}, {"title": "Copyright Ownership", "desc": "Full legal commercial rights transfer upon completion."}]'::jsonb,
    '[{"title": "Multiple Concepts", "desc": "Explore multiple creative directions."}, {"title": "Typography Pairings", "desc": "Curated primary and secondary font stacks."}, {"title": "Social Media Avatars", "desc": "Ready-to-use profile icons for all platforms."}]'::jsonb,
    '[{"step": 1, "title": "Creative Brief", "desc": "Tell us about your brand values."}, {"step": 2, "title": "Concept Exploration", "desc": "We present initial logo directions."}, {"step": 3, "title": "Refinement", "desc": "Polishing the chosen concept."}, {"step": 4, "title": "Brand Guide", "desc": "Full vector asset delivery."}]'::jsonb,
    '[{"q": "Do I own the full copyright to my logo?", "a": "Yes! Once project payment is complete, 100% intellectual property ownership is transferred to you."}]'::jsonb,
    'Start Brand Project',
    'published'
),
(
    'Social Media Growth Management',
    'social-media-management',
    'marketing',
    'Consistent, high-impact social media content creation, strategy, and lead generation campaigns.',
    'Turn social channels into reliable customer acquisition engines. We plan, write, design, and manage your content strategy across Facebook, LinkedIn, Instagram, and TikTok.',
    3500.00,
    'starting_at',
    'Monthly subscription plan covering custom graphics, copywriting, scheduling, and performance analytics.',
    'Monthly Managed',
    'Limited Slots',
    'Stop Posting Aimlessly. Start Building a Consistent Brand Following.',
    'Data-driven social management designed to build authority and drive inquiries.',
    'Maintaining social media consistency while managing business operations is exhausting and often yields poor ROI.',
    'We handle end-to-end content production, visual design, and audience engagement so you stay top of mind.',
    '[{"title": "Custom Graphics", "desc": "On-brand visual posts, carousels, and stories."}, {"title": "Engaging Captions", "desc": "Copywriting tailored to provoke engagement and inquiries."}, {"title": "Monthly Reports", "desc": "Clear analytics tracking audience growth and lead conversions."}]'::jsonb,
    '[{"title": "Content Calendar", "desc": "Approved 1 month in advance."}, {"title": "Targeted Campaign Strategy", "desc": "Aligned with your active product promotions."}]'::jsonb,
    '[{"step": 1, "title": "Strategy Call", "desc": "Define target audience and campaign goals."}, {"step": 2, "title": "Content Plan", "desc": "Develop monthly editorial calendar."}, {"step": 3, "title": "Design & Copy", "desc": "Produce visual assets and copy."}, {"step": 4, "title": "Publish & Optimize", "desc": "Manage channel and track leads."}]'::jsonb,
    '[{"q": "Can I review content before it goes live?", "a": "Yes! All posts are submitted to you for approval via your client portal prior to publishing."}]'::jsonb,
    'Explore Social Management',
    'published'
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description,
    price = EXCLUDED.price,
    hero_headline = EXCLUDED.hero_headline,
    benefits = EXCLUDED.benefits,
    faqs = EXCLUDED.faqs,
    updated_at = NOW();

-- 7. Insert Default Seed Products
INSERT INTO products (name, slug, category, short_description, full_description, price, price_type, pricing_details, turnaround_time, intake_status, hero_headline, hero_subheadline, problem_statement, solution_statement, benefits, features, process, faqs, cta_text, status)
VALUES
(
    'Business-Ready Startup Kit',
    'business-ready-kit',
    'packages',
    'All-in-one corporate identity package: Logo Design, Business Cards, Letterhead, and 10-Page Company Profile.',
    'Everything you need to launch or rebrand your enterprise seamlessly in one comprehensive bundle.',
    5500.00,
    'fixed',
    'Complete bundle saving over 25% compared to purchasing services individually.',
    '5-7 business days',
    'In Stock & Ready',
    'Launch Your Business with Complete Corporate Authority.',
    'Everything your business needs to look professional from Day One.',
    'Piecing together logos, business cards, profile documents, and letterheads from separate vendors leads to inconsistent branding and high costs.',
    'The Business-Ready Startup Kit bundles all essential brand identity items into a single, cohesive project delivered in 5–7 days.',
    '[{"title": "Complete Brand Identity", "desc": "Unified visual theme across logo, stationery, and corporate profile."}, {"title": "Bundle Discount", "desc": "Save over K2,000 compared to individual service orders."}, {"title": "Priority Delivery", "desc": "Fast-track 5–7 day turnaround."}]'::jsonb,
    '[{"title": "Vector Logo Package", "desc": "Includes all vector source files."}, {"title": "Company Profile (10-Page)", "desc": "Tender-ready corporate booklet."}, {"title": "Business Cards & Stationery", "desc": "Print-ready graphics with custom QR codes."}]'::jsonb,
    '[{"step": 1, "title": "Express Interest", "desc": "Submit your company name and details."}, {"step": 2, "title": "Brand Consultation", "desc": "Confirm color preferences and goals."}, {"step": 3, "title": "Production", "desc": "We build your entire asset suit."}, {"step": 4, "title": "Final Handover", "desc": "Receive full print and digital assets."}]'::jsonb,
    '[{"q": "Can I customize what is included in the kit?", "a": "Yes, optional add-ons like domain setup or social banners can be added upon consultation."}]'::jsonb,
    'Order Startup Kit',
    'published'
),
(
    'Custom Branded Metal Keychains',
    'custom-branded-keychains',
    'merchandise',
    'Premium die-cast metal keychains with custom logo engraving or enamel color infills.',
    'High-grade promotional merchandise that your clients keep for years. Durable, beautifully finished metal keychains customized with your company logo and contact info.',
    175.00,
    'starting_at',
    'Minimum order quantity: 20 units. Volume discounts apply for orders of 50+ or 100+ units.',
    '3-5 business days',
    'In Stock & Ready',
    'Keep Your Brand in Your Client’s Hands Every Single Day.',
    'Durable, premium metallic keychains engraved with your custom corporate logo.',
    'Paper business cards get lost or thrown away, leaving your brand forgotten after initial meetings.',
    'Custom metallic keychains provide a tactile, long-lasting promotional gift that stays attached to your customer keys daily.',
    '[{"title": "Premium Durability", "desc": "Die-cast metallic construction resistant to scratching and wear."}, {"title": "Laser Engraved Logo", "desc": "Precision engraving or enamel color infill for sharp logo representation."}, {"title": "Volume Discounts", "desc": "Reduced unit pricing for bulk business orders."}]'::jsonb,
    '[{"title": "Custom Packaging", "desc": "Available in individual black presentation boxes."}, {"title": "Double-Sided Option", "desc": "Engrave logo on front and phone/website on back."}]'::jsonb,
    '[{"step": 1, "title": "Select Quantity", "desc": "Indicate how many units you need."}, {"step": 2, "title": "Upload Logo", "desc": "Send your vector logo or high-res graphic."}, {"step": 3, "title": "Digital Mockup", "desc": "Approve digital 3D proof before production."}, {"step": 4, "title": "Production & Dispatch", "desc": "Crafted and delivered directly to your door."}]'::jsonb,
    '[{"q": "What is the minimum order quantity?", "a": "Our minimum order quantity for custom metallic keychains is 20 units."}, {"q": "Do you offer sample proofs?", "a": "Yes, we send a digital 3D sample mockup for your review prior to mass production."}]'::jsonb,
    'Order Custom Keychains',
    'published'
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description,
    price = EXCLUDED.price,
    hero_headline = EXCLUDED.hero_headline,
    benefits = EXCLUDED.benefits,
    faqs = EXCLUDED.faqs,
    updated_at = NOW();
