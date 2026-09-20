import { Link } from 'react-router-dom';
import { WidgetShell } from './WidgetShell';
import type { BusinessStats } from '../services/superAdminStats';

interface BusinessZoneProps {
  business: BusinessStats;
}

export function BusinessZone({ business }: BusinessZoneProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Revenue by month - simplified bar chart */}
      <WidgetShell>
        <h3 className="font-medium mb-4">Revenue — last 6 months</h3>
        <div className="space-y-2">
          {business.revenueByMonth.map((item) => {
            const maxValue = Math.max(...business.revenueByMonth.map(r => r.amount));
            const width = maxValue > 0 ? (item.amount / maxValue) * 100 : 0;
            return (
              <div key={item.month} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-16">{item.month}</span>
                <div className="flex-1 bg-gray-100 rounded h-6 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded" 
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-20 text-right">
                  ${item.amount.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </WidgetShell>

      {/* Pipeline by stage */}
      <WidgetShell>
        <h3 className="font-medium mb-4">Pipeline by stage</h3>
        <div className="space-y-2">
          {business.pipelineByStage.map((item) => {
            const maxValue = Math.max(...business.pipelineByStage.map(r => r.value));
            const width = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            return (
              <div key={item.stage} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-24 capitalize">{item.stage}</span>
                <div className="flex-1 bg-gray-100 rounded h-6 overflow-hidden">
                  <div 
                    className="bg-green-500 h-full rounded" 
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-24 text-right">
                  ${item.value.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </WidgetShell>

      {/* Top clients */}
      <WidgetShell>
        <h3 className="font-medium mb-4">Top clients</h3>
        <div className="space-y-2">
          {business.topClients.map((client, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
              <span className="text-sm">{client.name}</span>
              <span className="text-sm font-medium">${client.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <Link to="/dashboard/projects" className="text-sm text-blue-600 hover:underline mt-4 block">
          View all clients →
        </Link>
      </WidgetShell>

      {/* Recent wins */}
      <WidgetShell>
        <h3 className="font-medium mb-4">Recent wins</h3>
        <div className="space-y-2">
          {business.recentWins.map((win, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
              <div>
                <p className="text-sm font-medium">{win.title}</p>
                <p className="text-xs text-gray-500">{new Date(win.closedAt).toLocaleDateString()}</p>
              </div>
              <span className="text-sm font-medium text-green-600">${win.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <Link to="/dashboard/projects" className="text-sm text-blue-600 hover:underline mt-4 block">
          View all wins →
        </Link>
      </WidgetShell>
    </div>
  );
}
