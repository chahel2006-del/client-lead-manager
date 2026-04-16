import React from 'react';
import { cn } from '../lib/utils';

export function StatusBadge({ label, color, className }) {
  const themes = {
    error: "bg-error-50 text-error-700 border-error-500/10",
    warning: "bg-warning-50 text-warning-700 border-warning-500/10",
    success: "bg-success-50 text-success-700 border-success-500/10",
    primary: "bg-primary-50 text-primary-700 border-primary-500/10",
    muted: "bg-gray-50 text-gray-700 border-gray-500/10",
  };

  const dots = {
    error: "bg-error-500",
    warning: "bg-warning-500",
    success: "bg-success-500",
    primary: "bg-primary-500",
    muted: "bg-gray-500",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-sm",
      themes[color] || themes.muted,
      className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dots[color] || dots.muted)} />
      {label}
    </span>
  );
}
