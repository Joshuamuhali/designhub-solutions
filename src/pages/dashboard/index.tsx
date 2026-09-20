import { Routes, Route } from 'react-router-dom';
import { RequireRole } from '@/components/RequireRole';
import type { Role } from '@/contexts/AuthContext';
import Overview from './Overview';
import Timeline from './Timeline';
import Files from './Files';
import Billing from './Billing';
import Messages from './Messages';
import Analytics from './Analytics';

// Role-based dashboards
import { SuperAdminHome } from './homes/SuperAdminHome';
import AdminDashboard from './AdminDashboard';
import SalesHeadDashboard from './SalesHeadDashboard';
import SalesRepDashboard from './SalesRepDashboard';
import FinanceDashboard from './FinanceDashboard';
import MarketingDashboard from './MarketingDashboard';
import SupportDashboard from './SupportDashboard';

import OfferingsManagement from './OfferingsManagement';
import ProjectWorkspace from './ProjectWorkspace';
import FinanceManagement from './FinanceManagement';

export default function DashboardRoutes() {
  return (
    <Routes>
      {/* Default dashboard - accessible to all authenticated users */}
      <Route path="/" element={<Overview />} />
      <Route path="timeline" element={<Timeline />} />
      <Route path="files" element={<Files />} />
      <Route path="billing" element={<Billing />} />
      <Route path="messages" element={<Messages />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="offerings" element={<OfferingsManagement />} />
      <Route path="projects" element={<ProjectWorkspace />} />
      <Route path="projects/:projectId" element={<ProjectWorkspace />} />
      <Route path="finance-management" element={<FinanceManagement />} />
      
      {/* Role-based dashboards with access control */}
      <Route
        path="superadmin"
        element={
          <RequireRole allow={['super_admin' as Role]}>
            <SuperAdminHome />
          </RequireRole>
        }
      />
      <Route 
        path="admin" 
        element={
          <RequireRole allow={['admin' as Role, 'super_admin' as Role]}>
            <AdminDashboard />
          </RequireRole>
        } 
      />
      <Route 
        path="sales-head" 
        element={
          <RequireRole allow={['sales_head' as Role, 'admin' as Role, 'super_admin' as Role]}>
            <SalesHeadDashboard />
          </RequireRole>
        } 
      />
      <Route 
        path="sales-rep" 
        element={
          <RequireRole allow={['sales_rep' as Role, 'sales_head' as Role, 'admin' as Role, 'super_admin' as Role]}>
            <SalesRepDashboard />
          </RequireRole>
        } 
      />
      <Route 
        path="finance" 
        element={
          <RequireRole allow={['finance' as Role, 'admin' as Role, 'super_admin' as Role]}>
            <FinanceDashboard />
          </RequireRole>
        } 
      />
      <Route 
        path="marketing" 
        element={
          <RequireRole allow={['marketing' as Role, 'admin' as Role, 'super_admin' as Role]}>
            <MarketingDashboard />
          </RequireRole>
        } 
      />
      <Route 
        path="support" 
        element={
          <RequireRole allow={['support' as Role, 'admin' as Role, 'super_admin' as Role]}>
            <SupportDashboard />
          </RequireRole>
        } 
      />
    </Routes>
  );
}
