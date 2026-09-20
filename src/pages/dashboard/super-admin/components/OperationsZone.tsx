import { Link } from 'react-router-dom';
import { AlertTriangle, Clock } from 'lucide-react';
import { WidgetShell } from './WidgetShell';
import type { OperationsStats } from '../services/superAdminStats';

interface OperationsZoneProps {
  operations: OperationsStats;
}

export function OperationsZone({ operations }: OperationsZoneProps) {
  const statusColors: Record<string, string> = {
    'in_progress': 'bg-blue-500',
    'internal_review': 'bg-yellow-500',
    'client_review': 'bg-purple-500',
    'completed': 'bg-green-500',
    'on_hold': 'bg-gray-400',
    'cancelled': 'bg-red-500',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Projects by status */}
      <WidgetShell>
        <h3 className="font-medium mb-4">Projects — status mix</h3>
        <div className="space-y-3">
          {operations.projectsByStatus.map((item) => (
            <div key={item.status} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${statusColors[item.status] || 'bg-gray-400'}`} />
              <span className="text-sm capitalize flex-1">{item.status.replace('_', ' ')}</span>
              <span className="text-sm font-medium">{item.count}</span>
            </div>
          ))}
        </div>
        <Link to="/dashboard/projects" className="text-sm text-blue-600 hover:underline mt-4 block">
          View all projects →
        </Link>
      </WidgetShell>

      {/* Team workload */}
      <WidgetShell>
        <h3 className="font-medium mb-4">Team workload</h3>
        <div className="space-y-3">
          {operations.teamWorkload.map((person) => (
            <div key={person.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{person.name}</span>
                <span className={person.utilization >= 90 ? 'text-red-600 font-medium' : ''}>
                  {person.utilization}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded h-2 overflow-hidden">
                <div 
                  className={`h-full rounded ${
                    person.utilization >= 90 ? 'bg-red-500' :
                    person.utilization >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${person.utilization}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <Link to="/dashboard/superadmin" className="text-sm text-blue-600 hover:underline mt-4 block">
          View team →
        </Link>
      </WidgetShell>

      {/* Projects at risk */}
      <WidgetShell className="border-orange-200">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <h3 className="font-medium text-orange-900">Projects at risk</h3>
        </div>
        <div className="space-y-2">
          {operations.projectsAtRisk.length === 0 ? (
            <p className="text-sm text-gray-500">No projects at risk</p>
          ) : (
            operations.projectsAtRisk.map((project) => (
              <Link key={project.id} to={`/dashboard/projects/${project.id}`}>
                <div className="p-2 rounded bg-orange-50 hover:bg-orange-100 transition">
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="text-xs text-orange-700 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {project.daysLate} days late
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </WidgetShell>

      {/* Recent activity */}
      <WidgetShell>
        <h3 className="font-medium mb-4">Recent activity</h3>
        <div className="space-y-2">
          {operations.recentActivity.map((activity, idx) => (
            <div key={idx} className="text-sm">
              <p className="font-mono text-xs text-gray-600">{activity.action}</p>
              <p className="text-xs text-gray-500">{activity.resource || 'System'}</p>
              <p className="text-xs text-gray-400">{new Date(activity.at).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <Link to="/dashboard/superadmin" className="text-sm text-blue-600 hover:underline mt-4 block">
          View activity feed →
        </Link>
      </WidgetShell>
    </div>
  );
}
