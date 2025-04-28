
import React from 'react';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface DeviceProps {
  device_name: string;
  status: string;
  model?: string;
  ip_address?: string;
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
  
  return (
    <DashboardCard 
      title={title}
      description={`${problemDevices.length} of ${totalDevices} devices with issues`}
      className={cn('h-full', className)}
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
      <div className="space-y-3">
        {problemDevices.map((device) => (
          <div 
            key={device.device_name}
            className="flex justify-between items-center p-3 bg-secondary/50 rounded-md"
          >
            <div className="flex flex-col">
              <span className="font-medium">{device.device_name}</span>
              <span className="text-xs text-muted-foreground">{device.model || ''} {device.ip_address || ''}</span>
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
