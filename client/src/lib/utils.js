import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getLeadStatus(nextFollowUpDate, currentStatus) {
  if (currentStatus === 'converted') return { label: 'Converted', color: 'success' };
  
  if (!nextFollowUpDate) return { label: 'On Track', color: 'success' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(nextFollowUpDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: 'Overdue', color: 'error' };
  if (diffDays <= 2) return { label: 'Due Soon', color: 'warning' };
  return { label: 'On Track', color: 'success' };
}
