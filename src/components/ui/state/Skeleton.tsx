import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circular' | 'card';
}

export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        variant === 'text' && 'h-4 w-full',
        variant === 'circular' && 'h-10 w-10 rounded-full',
        variant === 'card' && 'h-24 w-full',
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <Skeleton className="h-5 w-1/3" variant="text" />
      <Skeleton className="h-4 w-full" variant="text" />
      <Skeleton className="h-4 w-2/3" variant="text" />
      <div className="pt-4">
        <Skeleton className="h-9 w-24" variant="default" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4 p-4 border-b border-border">
        <Skeleton className="h-4 w-1/4" variant="text" />
        <Skeleton className="h-4 w-1/3" variant="text" />
        <Skeleton className="h-4 w-1/4" variant="text" />
        <Skeleton className="h-4 w-1/6" variant="text" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4">
          <Skeleton className="h-4 w-1/4" variant="text" />
          <Skeleton className="h-4 w-1/3" variant="text" />
          <Skeleton className="h-4 w-1/4" variant="text" />
          <Skeleton className="h-4 w-1/6" variant="text" />
        </div>
      ))}
    </div>
  );
}
