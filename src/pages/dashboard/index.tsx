import { Routes, Route } from 'react-router-dom';
import Overview from './Overview';
import Timeline from './Timeline';
import Files from './Files';
import Billing from './Billing';
import Messages from './Messages';
import Analytics from './Analytics';

// Role-based dashboards
import SuperAdminDashboard from './SuperAdminDashboard';
import AdminDashboard from './AdminDashboard';
import SalesHeadDashboard from './SalesHeadDashboard';
import SalesRepDashboard from './SalesRepDashboard';
import FinanceDashboard from './FinanceDashboard';
import MarketingDashboard from './MarketingDashboard';
import SupportDashboard from './SupportDashboard';

export default function DashboardRoutes() {
  return (
    <Routes>
      {/* Default dashboard */}
      <Route path="/" element={<Overview />} />
      <Route path="timeline" element={<Timeline />} />
      <Route path="files" element={<Files />} />
      <Route path="billing" element={<Billing />} />
      <Route path="messages" element={<Messages />} />
      <Route path="analytics" element={<Analytics />} />
      
      {/* Role-based dashboards */}
      <Route path="superadmin" element={<SuperAdminDashboard />} />
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="sales-head" element={<SalesHeadDashboard />} />
      <Route path="sales-rep" element={<SalesRepDashboard />} />
      <Route path="finance" element={<FinanceDashboard />} />
      <Route path="marketing" element={<MarketingDashboard />} />
      <Route path="support" element={<SupportDashboard />} />
    </Routes>
  );
}
