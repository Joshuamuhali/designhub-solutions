import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PulseCards } from '../super-admin/components/PulseCards';
import { AttentionZone } from '../super-admin/components/AttentionZone';
import { BusinessZone } from '../super-admin/components/BusinessZone';
import { OperationsZone } from '../super-admin/components/OperationsZone';
import { SystemZone } from '../super-admin/components/SystemZone';
import {
  fetchPulse,
  fetchBusiness,
  fetchOperations,
  fetchSystem,
  type PulseStats,
  type BusinessStats,
  type OperationsStats,
  type SystemStats,
} from '../super-admin/services/superAdminStats';
import { fetchAttentionItems, type AttentionItem } from '../super-admin/services/attentionService';

export function SuperAdminHome() {
  const { profile } = useAuth();

  const [pulse, setPulse] = useState<PulseStats | null>(null);
  const [business, setBusiness] = useState<BusinessStats | null>(null);
  const [operations, setOperations] = useState<OperationsStats | null>(null);
  const [system, setSystem] = useState<SystemStats | null>(null);
  const [attention, setAttention] = useState<AttentionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const [p, b, o, s, a] = await Promise.all([
          fetchPulse(),
          fetchBusiness(),
          fetchOperations(),
          fetchSystem(),
          fetchAttentionItems(),
        ]);
        if (!alive) return;
        setPulse(p);
        setBusiness(b);
        setOperations(o);
        setSystem(s);
        setAttention(a);
      } catch (err: any) {
        if (!alive) return;
        setError(err.message ?? 'Failed to load dashboard');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Zone 1 — Header */}
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {greeting}, {profile?.full_name?.split(' ')[0] ?? 'Owner'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            {attention.length > 0 && (
              <> · {attention.length} item{attention.length > 1 ? 's' : ''} need your attention</>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <QuickAction label="New Project" href="/dashboard/projects" />
          <QuickAction label="Invite User" href="/dashboard/superadmin" variant="outline" />
          <QuickAction label="Reports" href="/dashboard/finance-management" variant="outline" />
        </div>
      </header>

      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {error}
        </div>
      )}

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-8">
          {/* Zone 2 — Pulse */}
          <section>
            <PulseCards pulse={pulse!} />
          </section>

          {/* Zone 3 — Attention */}
          <section>
            <AttentionZone items={attention} />
          </section>

          {/* Zone 4 — Business */}
          <section>
            <h2 className="text-lg font-medium mb-4">Business</h2>
            <BusinessZone business={business!} />
          </section>

          {/* Zone 5 — Operations */}
          <section>
            <h2 className="text-lg font-medium mb-4">Operations</h2>
            <OperationsZone operations={operations!} />
          </section>

          {/* Zone 6 — System */}
          <section>
            <SystemZone system={system!} />
          </section>
        </div>
      )}
    </div>
  );
}

// --- Small helpers ---

function QuickAction({
  label,
  href,
  variant = 'primary',
}: {
  label: string;
  href: string;
  variant?: 'primary' | 'outline';
}) {
  const cls =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'border border-gray-300 text-gray-700 hover:bg-gray-50';
  return (
    <Link to={href} className={`px-3 py-2 rounded text-sm font-medium ${cls}`}>
      {label}
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
