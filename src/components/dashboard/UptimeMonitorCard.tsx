
import React from 'react';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';

interface MonitorProps {
  friendly_name: string;
  status: string;
  url: string;
}

interface UptimeMonitorCardProps {
  title: string;
  monitorsDown: number;
  monitorsTotal: number;
  monitors: Record<string, MonitorProps>;
  className?: string;
}

const UptimeMonitorCard: React.FC<UptimeMonitorCardProps> = ({ 
  title,
  monitorsDown,
  monitorsTotal,
  monitors,
  className 
}) => {
  const upPercentage = ((monitorsTotal - monitorsDown) / monitorsTotal) * 100;
  
  return (
    <DashboardCard 
      title={title}
      description={`${monitorsDown} of ${monitorsTotal} down`}
      className={cn('h-full', className)}
      footer={
        <div className="w-full">
          <div className="flex justify-between text-xs mb-1">
            <span>Uptime</span>
            <span>{upPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={upPercentage} className="h-1.5" />
        </div>
      }
    >
      <div className="space-y-3">
        {Object.entries(monitors).map(([id, monitor]) => (
          <div 
            key={id}
            className="flex justify-between items-center p-3 bg-secondary/50 rounded-md"
          >
            <div className="flex flex-col">
              <span className="font-medium">{monitor.friendly_name}</span>
              <span className="text-xs text-muted-foreground truncate">{monitor.url}</span>
            </div>
            <StatusBadge status={monitor.status} />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default UptimeMonitorCard;
