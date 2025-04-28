
import React from 'react';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import { cn } from '@/lib/utils';

interface ServiceProps {
  name: string;
  status: string;
}

interface ServiceStatusCardProps {
  title: string;
  services: ServiceProps[];
  className?: string;
}

const ServiceStatusCard: React.FC<ServiceStatusCardProps> = ({ title, services, className }) => {
  const allUp = services.every(service => 
    service.status.toLowerCase() === 'up' || 
    service.status.toLowerCase() === 'success'
  );
  
  return (
    <DashboardCard 
      title={title}
      description={allUp ? "All services operational" : "Some services affected"}
      className={cn('h-full', className)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {services.map((service) => (
          <div 
            key={service.name}
            className="flex justify-between items-center p-3 bg-secondary/50 rounded-md"
          >
            <span className="font-medium truncate">{service.name}</span>
            <StatusBadge status={service.status} />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default ServiceStatusCard;
