
import React from 'react';
import DashboardCard from './DashboardCard';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface IncidentProps {
  created: string;
  resolved: string | null;
}

interface AlertProps {
  Title: string;
  AlertMessage: string;
  CustomerName?: string;
  DeviceName?: string;
  Severity: string;
  incidents: IncidentProps[];
}

interface AlertCardProps {
  title: string;
  alerts: Record<string, AlertProps>;
  className?: string;
}

const AlertCard: React.FC<AlertCardProps> = ({ title, alerts, className }) => {
  const alertsArray = Object.entries(alerts).map(([id, alert]) => ({
    id,
    ...alert
  }));

  const getSeverityClass = (severity: string) => {
    const lowerSeverity = severity.toLowerCase();
    if (lowerSeverity === 'critical') return 'border-l-status-critical';
    if (lowerSeverity === 'warning') return 'border-l-status-warning';
    if (lowerSeverity === 'information') return 'border-l-tech-blue';
    return 'border-l-status-unknown';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPp');
    } catch {
      return dateString;
    }
  };
  
  return (
    <DashboardCard 
      title={title}
      description={`${alertsArray.length} active alerts`}
      className={cn('h-full', className)}
    >
      <div className="space-y-4">
        {alertsArray.map((alert) => {
          const latestIncident = alert.incidents && alert.incidents[0];
          
          return (
            <div 
              key={alert.id}
              className={cn(
                "flex flex-col p-3 bg-secondary/50 rounded-md border-l-4",
                getSeverityClass(alert.Severity)
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold">{alert.Title}</span>
                <span className="text-xs bg-secondary py-0.5 px-2 rounded-full">
                  {alert.Severity}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{alert.AlertMessage}</p>
              {(alert.DeviceName || alert.CustomerName) && (
                <p className="text-xs text-muted-foreground mb-2">
                  {alert.DeviceName && <span className="font-medium">{alert.DeviceName}</span>}
                  {alert.DeviceName && alert.CustomerName && <span> | </span>}
                  {alert.CustomerName && <span>{alert.CustomerName}</span>}
                </p>
              )}
              {latestIncident && (
                <div className="text-xs text-muted-foreground">
                  <span>Created: {formatDate(latestIncident.created)}</span>
                  {latestIncident.resolved && (
                    <span> | Resolved: {formatDate(latestIncident.resolved)}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {alertsArray.length === 0 && (
          <div className="text-center p-4 text-muted-foreground">
            No active alerts
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default AlertCard;
