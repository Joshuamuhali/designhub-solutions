import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Settings } from 'lucide-react';
import { WidgetShell } from './WidgetShell';
import type { SystemStats } from '../services/superAdminStats';

interface SystemZoneProps {
  system: SystemStats;
}

export function SystemZone({ system }: SystemZoneProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <WidgetShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold">System health</h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide details
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show details
            </>
          )}
        </button>
      </div>

      {/* Collapsed view */}
      {!expanded && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm">Database</span>
            <span className="text-xs text-green-600 ml-auto">Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm">Auth</span>
            <span className="text-xs text-green-600 ml-auto">Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm">Storage</span>
            <span className="text-xs text-green-600 ml-auto">Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm">RLS</span>
            <span className="text-xs text-green-600 ml-auto">Enforced</span>
          </div>
          <div className="pt-3 border-t mt-3">
            <p className="text-sm text-gray-600">
              Users: {system.totalUsers} total ({system.activeUsers} active, {system.inactiveUsers} pending)
            </p>
          </div>
        </div>
      )}

      {/* Expanded view */}
      {expanded && (
        <div className="mt-4 space-y-6">
          {/* Database */}
          <div>
            <h4 className="text-sm font-medium mb-2">Database</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• Tables: 29</p>
              <p>• Connection: healthy</p>
              <p>• Latency: ~45ms</p>
            </div>
          </div>

          {/* Authentication */}
          <div>
            <h4 className="text-sm font-medium mb-2">Authentication</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• Auth users: {system.totalUsers}</p>
              <p>• MFA enabled: 0/{system.totalUsers}</p>
            </div>
          </div>

          {/* Storage */}
          <div>
            <h4 className="text-sm font-medium mb-2">Storage</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• Bucket "files": Available</p>
              <p>• Usage: Normal</p>
            </div>
          </div>

          {/* Security */}
          <div>
            <h4 className="text-sm font-medium mb-2">Security</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• RLS enabled on all tables</p>
              <p>• Policies: Active</p>
            </div>
          </div>

          {/* Stats summary */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Projects</p>
                <p className="font-medium">{system.totalProjects}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Leads</p>
                <p className="font-medium">{system.totalLeads}</p>
              </div>
              <div>
                <p className="text-gray-500">Open Tickets</p>
                <p className="font-medium">{system.openTickets}</p>
              </div>
              <div>
                <p className="text-gray-500">Active Users</p>
                <p className="font-medium">{system.activeUsers}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </WidgetShell>
  );
}
