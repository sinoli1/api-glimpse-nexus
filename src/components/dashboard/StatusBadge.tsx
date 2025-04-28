
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'Up' | 'Down' | 'Critical' | 'Warning' | 'Unknown';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getNormalizedStatus = (status: string): StatusType => {
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus === 'up' || lowerStatus === 'success') return 'Up';
    if (lowerStatus === 'down') return 'Down';
    if (lowerStatus === 'critical' || lowerStatus === 'poor') return 'Critical';
    if (lowerStatus === 'warning') return 'Warning';
    return 'Unknown';
  };
  
  const normalizedStatus = getNormalizedStatus(status);
  
  const getStatusClass = (status: StatusType): string => {
    switch (status) {
      case 'Up': return 'status-up';
      case 'Down': return 'status-down';
      case 'Critical': return 'status-critical';
      case 'Warning': return 'status-warning';
      default: return 'status-unknown';
    }
  };

  const getBgClass = (status: StatusType): string => {
    switch (status) {
      case 'Up': return 'bg-emerald-50 text-emerald-700';
      case 'Down': return 'bg-red-50 text-red-700';
      case 'Critical': return 'bg-purple-50 text-purple-700';
      case 'Warning': return 'bg-amber-50 text-amber-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };
  
  return (
    <span className={cn(
      'flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      getBgClass(normalizedStatus),
      className
    )}>
      <span className={cn('status-indicator mr-1.5', getStatusClass(normalizedStatus))}></span>
      {normalizedStatus}
    </span>
  );
};

export default StatusBadge;
