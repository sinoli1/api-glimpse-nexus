
import React from 'react';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

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
  const isAllDown = monitorsDown === monitorsTotal && monitorsTotal > 0;
  const downMonitors = Object.entries(monitors).filter(([_, monitor]) => 
    monitor.status.toLowerCase() === 'down'
  );
  
  return (
    <DashboardCard 
      title={title}
      description={`${monitorsDown} of ${monitorsTotal} down`}
      className={cn(
        'h-full', 
        isAllDown ? 'border-2 border-status-critical' : '',
        className
      )}
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
      {isAllDown && (
        <div className="mb-3 flex items-center gap-2 p-2 bg-red-50 text-red-700 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span className="font-medium text-sm">Critical: All monitors down!</span>
        </div>
      )}
      
      <div className="space-y-3">
        {downMonitors.length > 0 ? (
          downMonitors.map(([id, monitor]) => (
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
          ))
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            No down monitors detected
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default UptimeMonitorCard;
