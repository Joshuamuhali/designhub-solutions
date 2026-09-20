import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { WidgetShell } from './WidgetShell';
import type { PulseStats } from '../services/superAdminStats';

interface PulseCardsProps {
  pulse: PulseStats;
}

export function PulseCards({ pulse }: PulseCardsProps) {
  const cards = [
    {
      label: 'Revenue MTD',
      value: `$${pulse.revenueMTD.toLocaleString()}`,
      icon: TrendingUp,
      trend: 'up',
      href: '/dashboard/finance-management',
    },
    {
      label: 'Pipeline Value',
      value: `$${pulse.pipelineValue.toLocaleString()}`,
      icon: TrendingUp,
      trend: 'up',
      href: '/dashboard/projects',
    },
    {
      label: 'Active Projects',
      value: pulse.activeProjects.toString(),
      icon: Minus,
      trend: 'neutral',
      href: '/dashboard/projects',
    },
    {
      label: 'Overdue Invoices',
      value: `${pulse.overdueInvoices.count} · $${pulse.overdueInvoices.amount.toLocaleString()}`,
      icon: TrendingDown,
      trend: 'down',
      href: '/dashboard/finance-management',
      critical: pulse.overdueInvoices.count > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isCritical = card.critical;
        return (
          <Link key={card.label} to={card.href}>
            <WidgetShell className={`hover:shadow-sm transition ${isCritical ? 'border-red-200' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className={`text-3xl font-semibold mt-2 ${isCritical ? 'text-red-600' : ''}`}>
                    {card.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${
                  card.trend === 'up' ? 'bg-green-50 text-green-600' :
                  card.trend === 'down' ? 'bg-red-50 text-red-600' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </WidgetShell>
          </Link>
        );
      })}
    </div>
  );
}
