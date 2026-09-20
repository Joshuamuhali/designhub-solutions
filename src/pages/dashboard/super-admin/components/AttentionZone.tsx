import { Link } from 'react-router-dom';
import { AlertTriangle, UserPlus, Receipt, LifeBuoy, CheckCircle } from 'lucide-react';
import { WidgetShell } from './WidgetShell';
import type { AttentionItem } from '../services/attentionService';

interface AttentionZoneProps {
  items: AttentionItem[];
}

const iconMap: Record<string, any> = {
  receipt: Receipt,
  'user-plus': UserPlus,
  'alert-triangle': AlertTriangle,
  'life-buoy': LifeBuoy,
};

export function AttentionZone({ items }: AttentionZoneProps) {
  if (items.length === 0) {
    return (
      <WidgetShell className="bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium text-green-900">All clear</p>
            <p className="text-sm text-green-700">Nothing needs your decision right now.</p>
          </div>
        </div>
      </WidgetShell>
    );
  }

  return (
    <WidgetShell className="border-orange-200">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-600" />
        <h3 className="font-semibold text-orange-900">
          Needs your attention ({items.length})
        </h3>
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const Icon = iconMap[item.icon] || AlertTriangle;
          const severityColors = {
            critical: 'border-red-200 bg-red-50 hover:bg-red-100',
            warning: 'border-orange-200 bg-orange-50 hover:bg-orange-100',
            info: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
          };
          return (
            <Link key={item.id} to={item.href}>
              <div className={`p-3 rounded-lg border transition ${severityColors[item.severity]}`}>
                <div className="flex items-start gap-3">
                  <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.title}</p>
                    {item.detail && (
                      <p className="text-xs text-gray-600 mt-1">{item.detail}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </WidgetShell>
  );
}
