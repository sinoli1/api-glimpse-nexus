
import React from 'react';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Clock } from 'lucide-react';

interface DeviceProps {
  device_name: string;
  status: string;
  model?: string;
  ip_address?: string;
  seconds_since_last_communication?: number;
  last_communication_datetime?: string;
}

interface DeviceStatusCardProps {
  title: string;
  totalDevices: number;
  problemDevices: DeviceProps[];
  className?: string;
}

const DeviceStatusCard: React.FC<DeviceStatusCardProps> = ({ 
  title, 
  totalDevices, 
  problemDevices, 
  className 
}) => {
  const healthyPercentage = ((totalDevices - problemDevices.length) / totalDevices) * 100;
  const isAllDown = totalDevices > 0 && problemDevices.length === totalDevices;
  
  // Function to format downtime duration
  const formatDowntime = (seconds: number | undefined): string => {
    if (!seconds) return 'Unknown';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };
  
  return (
    <DashboardCard 
      title={title}
      description={`${problemDevices.length} of ${totalDevices} devices with issues`}
      className={cn(
        'h-full', 
        isAllDown ? 'border-2 border-status-critical' : '',
        className
      )}
      footer={
        <div className="w-full">
          <div className="flex justify-between text-xs mb-1">
            <span>Health</span>
            <span>{healthyPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={healthyPercentage} className="h-1.5" />
        </div>
      }
    >
      {isAllDown && (
        <div className="mb-3 flex items-center gap-2 p-2 bg-red-50 text-red-700 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span className="font-medium text-sm">Critical: All devices down!</span>
        </div>
      )}
      <div className="space-y-3">
        {problemDevices.map((device) => (
          <div 
            key={device.device_name}
            className="flex justify-between items-center p-3 bg-secondary/50 rounded-md"
          >
            <div className="flex flex-col">
              <span className="font-medium">{device.device_name}</span>
              <span className="text-xs text-muted-foreground">{device.model || ''} {device.ip_address || ''}</span>
              {device.seconds_since_last_communication && (
                <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                  <Clock className="h-3 w-3" />
                  <span>Down for {formatDowntime(device.seconds_since_last_communication)}</span>
                </div>
              )}
              {device.last_communication_datetime && !device.seconds_since_last_communication && (
                <div className="text-xs text-muted-foreground mt-1">
                  Last seen: {device.last_communication_datetime}
                </div>
              )}
            </div>
            <StatusBadge status={device.status} />
          </div>
        ))}
        {problemDevices.length === 0 && (
          <div className="text-center p-4 text-muted-foreground">
            No device problems detected
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default DeviceStatusCard;
