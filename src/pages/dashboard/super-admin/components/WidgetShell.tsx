import { ReactNode } from 'react';

interface WidgetShellProps {
  children: ReactNode;
  className?: string;
}

export function WidgetShell({ children, className = '' }: WidgetShellProps) {
  return (
    <div className={`bg-white border rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}
