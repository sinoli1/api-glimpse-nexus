
import React from 'react';
import DashboardCard from './DashboardCard';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

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
  // Sort alerts: Machine status unknown first, then by severity
  const alertsArray = Object.entries(alerts)
    .map(([id, alert]) => ({
      id,
      ...alert
    }))
    .sort((a, b) => {
      // Machine status unknown alerts come first
      if (a.Title === "Machine status unknown" && b.Title !== "Machine status unknown") return -1;
      if (b.Title === "Machine status unknown" && a.Title !== "Machine status unknown") return 1;
      
      // Then by severity: Critical > Warning > Information > others
      const severityOrder = { critical: 0, warning: 1, information: 2 };
      const aSeverity = (a.Severity || '').toLowerCase();
      const bSeverity = (b.Severity || '').toLowerCase();
      
      return (severityOrder[aSeverity] || 99) - (severityOrder[bSeverity] || 99);
    });

  const getSeverityClass = (severity: string, title: string) => {
    if (title === "Machine status unknown") return 'border-l-status-critical';
    
    const lowerSeverity = severity.toLowerCase();
    if (lowerSeverity === 'critical') return 'border-l-status-critical';
    if (lowerSeverity === 'warning') return 'border-l-status-warning';
    if (lowerSeverity === 'information') return 'border-l-tech-blue';
    return 'border-l-status-warning'; // Default to warning (yellow) as requested
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
          const isServerDown = alert.Title === "Machine status unknown";
          const isCritical = alert.Severity.toLowerCase() === 'critical' || isServerDown;
          // Create custom title from DeviceName and CustomerName
          const displayTitle = alert.DeviceName && alert.CustomerName 
            ? `${alert.DeviceName} | ${alert.CustomerName}`
            : alert.Title;
          
          return (
            <div 
              key={alert.id}
              className={cn(
                "flex flex-col p-3 bg-secondary/50 rounded-md border-l-4",
                getSeverityClass(alert.Severity, alert.Title),
                isServerDown ? "border-2 border-status-critical" : ""
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-1">
                  {isCritical && <AlertCircle className="h-4 w-4 text-status-critical" />}
                  <span className={cn(
                    "font-bold text-status-critical",
                    isCritical ? "text-status-critical" : ""
                  )}>
                    {displayTitle}
                  </span>
                </div>
                <span className={cn(
                  "text-xs py-0.5 px-2 rounded-full",
                  isCritical ? "bg-red-50 text-red-700" : "bg-secondary"
                )}>
                  {alert.Severity}
                </span>
              </div>
              <p className="text-sm mb-1 text-muted-foreground">
                {alert.AlertMessage}
              </p>
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
