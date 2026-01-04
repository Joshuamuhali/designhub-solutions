# Database Setup Instructions

## 🚀 Quick Setup Guide

### 1. **Go to Supabase SQL Editor**
1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Copy and paste the contents of `supabase-schema.sql`

### 2. **Run the Schema**
1. Paste the SQL code into the editor
2. Click **Run** to execute all queries
3. Wait for all tables to be created

### 3. **Verify Tables Created**
You should see these tables in your database:
- ✅ `users` - User management
- ✅ `leads` - Contact form submissions & sales leads
- ✅ `tasks` - Task management
- ✅ `commissions` - Sales commissions
- ✅ `invoices` - Financial invoices
- ✅ `expenses` - Expense tracking
- ✅ `projects` - Project management
- ✅ `support_tickets` - Customer support
- ✅ `campaigns` - Marketing campaigns
- ✅ `audit_logs` - System audit logs

## 🎯 **What This Fixes**

### **Contact Form Integration**
The 404 error you're seeing is because the `leads` table doesn't exist yet. After running the schema:

- ✅ Contact form submissions will be saved as leads
- ✅ Leads will appear in Sales Head Dashboard
- ✅ Sales reps can manage their assigned leads
- ✅ Real-time lead tracking across all dashboards

### **Dashboard Functionality**
All dashboards will now work with real data:
- **SuperAdmin Dashboard** - System stats, users, audit logs
- **Admin Dashboard** - Department stats, team management
- **Sales Head Dashboard** - Team performance, sales pipeline
- **Sales Rep Dashboard** - Personal leads, tasks, commissions
- **Finance Dashboard** - Invoices, expenses, financial reports
- **Marketing Dashboard** - Campaigns, lead sources, content
- **Support Dashboard** - Tickets, agents, customer satisfaction

## 🔧 **Sample Data**

The schema includes sample users for testing:
- **admin@designhub.co.zm** (SuperAdmin)
- **sales@designhub.co.zm** (Sales Head)
- **rep@designhub.co.zm** (Sales Rep)

## 📱 **Testing the System**

1. **Test Contact Form**: Visit `http://localhost:8080/contact`
2. **Submit a Lead**: Fill out and submit the form
3. **Check Dashboards**: Login and view leads in sales dashboards
4. **Verify Data**: Ensure leads appear correctly

## 🚨 **Troubleshooting**

### **If you still get 404 errors:**
1. Verify tables were created in Supabase
2. Check table names match exactly (case-sensitive)
3. Ensure RLS policies are set correctly
4. Verify Supabase URL and keys in `.env` file

### **Common Issues:**
- **404 on leads**: Table doesn't exist → Run schema
- **Permission errors**: RLS policies missing → Check policies
- **Connection errors**: Wrong Supabase URL/key → Verify `.env`

## 🎉 **After Setup**

Once the schema is running:
- ✅ Contact form will create leads automatically
- ✅ All dashboards will display real data
- ✅ Lead management will work seamlessly
- ✅ Sales team can track and convert leads

The lead generation system will be fully operational!
