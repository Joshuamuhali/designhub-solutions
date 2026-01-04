# Admin User Setup Guide

This guide will help you create admin and super admin users to test the dashboards.

## 🚀 Quick Setup

### Method 1: Using the Setup Script (Recommended)

1. **Setup Database First**
   ```bash
   # Run the database schema
   # Open supabase-schema.sql in your Supabase SQL Editor and execute it
   ```

2. **Create Super Admin User**
   - Open your browser and go to your Supabase project
   - Open browser console (F12)
   - Copy and paste the contents of `setup-admin.js`
   - Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_SERVICE_ROLE_KEY`
   - Run `createSuperAdmin()`

3. **Login Credentials**
   - 📧 Email: `designhubzm@gmail.com`
   - 🔑 Password: `admin123456`
   - 🌐 Login at: `http://localhost:8080/login`

### Method 2: Manual Creation

#### Step 1: Create Super Admin via Supabase Dashboard

1. Go to your Supabase project
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"**
4. Enter:
   - Email: `designhubzm@gmail.com`
   - Password: `admin123456`
   - Toggle **"Auto confirm"**
5. Click **"Add user"**

#### Step 2: Create User Profile in Database

Run this SQL in Supabase SQL Editor:

```sql
-- Get the user ID from the created user first
-- Then insert into users table
INSERT INTO users (
  id, 
  email, 
  full_name, 
  role, 
  status, 
  created_at,
  last_login
) VALUES (
  'USER_ID_FROM_AUTH', -- Replace with actual user ID
  'designhubzm@gmail.com',
  'Super Admin',
  'super_admin',
  'active',
  NOW(),
  NOW()
);
```

## 👥 Creating Additional Users

Once you have super admin access, you can create users through the dashboard:

### Via Super Admin Dashboard

1. Login as super admin
2. Navigate to **Dashboard** → **Super Admin Dashboard**
3. Go to **Users** tab
4. Click **"Create User"**
5. Fill in the form:
   - Email address
   - Full name
   - Role (Admin, Sales Head, Sales Rep, Client)
   - Password (min 6 characters)
6. Click **"Create User"**

### Via Admin Dashboard

1. Login as admin
2. Navigate to **Dashboard** → **Admin Dashboard**
3. Go to **Team Management** tab
4. Click **"Add Team Member"**
5. Fill in the form (limited roles: Sales Head, Sales Rep, Client)

## 🎭 User Roles and Permissions

### Super Admin
- ✅ Create all user types
- ✅ Manage system settings
- ✅ View all dashboards
- ✅ Access audit logs
- ✅ Full system control

### Admin
- ✅ Create limited users (Sales Head, Sales Rep, Client)
- ✅ Manage team members
- ✅ View department analytics
- ✅ Approve activities
- ❌ Cannot create other admins

### Sales Head
- ✅ View sales team performance
- ✅ Manage sales pipeline
- ✅ Assign leads to reps
- ✅ View sales reports
- ❌ Cannot create users

### Sales Representative
- ✅ View assigned leads
- ✅ Update lead status
- ✅ Manage tasks
- ✅ View personal metrics
- ❌ Cannot create users

### Client
- ✅ View own projects
- ✅ Submit project consultations
- ✅ View invoices
- ✅ Communicate with team
- ❌ Cannot access dashboards

## 🔧 Testing Different Dashboards

### Test Users to Create:

1. **Sales Head**
   - Email: `sales.head@designhub.co.zm`
   - Password: `sales123`
   - Role: `sales_head`

2. **Sales Representative**
   - Email: `sales.rep@designhub.co.zm`
   - Password: `sales123`
   - Role: `sales_rep`

3. **Client**
   - Email: `client@designhub.co.zm`
   - Password: `client123`
   - Role: `client`

### Dashboard URLs:
- Super Admin: `http://localhost:8080/dashboard` (auto-routes to super admin)
- Admin: `http://localhost:8080/dashboard` (auto-routes to admin)
- Sales Head: `http://localhost:8080/dashboard` (auto-routes to sales head)
- Sales Rep: `http://localhost:8080/dashboard` (auto-routes to sales rep)
- Client: `http://localhost:8080/dashboard` (auto-routes to client overview)

## 🧪 Testing the Project Consultation Flow

1. **Submit Project Consultation**
   - Go to `http://localhost:8080/contact`
   - Fill out the comprehensive form
   - Submit the form

2. **Check Sales Dashboards**
   - Login as Sales Head or Sales Rep
   - Go to **Sales Pipeline** tab
   - You should see the new lead with all project details

3. **Verify Data Flow**
   - Services selected should appear as badges
   - Timeline information should be displayed
   - Budget should be shown
   - Additional notes should be visible

## 🐛 Troubleshooting

### Common Issues:

1. **"User creation failed"**
   - Check Supabase service role key permissions
   - Ensure database schema is properly set up
   - Verify email is not already in use

2. **"Cannot access dashboard"**
   - Check user role in database
   - Ensure routing logic is working
   - Verify authentication state

3. **"No leads showing in sales dashboard"**
   - Check if leads table exists
   - Verify data was inserted correctly
   - Check API calls in browser network tab

### Reset Everything:
```sql
-- Clear all users (be careful!)
DELETE FROM users;
-- Then recreate super admin using the setup script
```

## 🎯 Next Steps

Once you have users created:

1. ✅ Test the project consultation form
2. ✅ Verify data appears in sales dashboards
3. ✅ Test different user roles and permissions
4. ✅ Explore all dashboard features
5. ✅ Test lead management workflows

You're now ready to test the complete system! 🚀
