
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from './StatusBadge';
import { Clock, Database, Server, BarChart, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DashboardSummaryProps {
  className?: string;
  data: {
    uptimeMonitors: { total: number, down: number }
    emailsCount: number
    alertsCount: number
    devicesProblems: number
    servicesDown: number
    servicesTotal: number
    timestamp?: string
  }
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ className, data }) => {
  const currentTime = data.timestamp ? 
    new Date(data.timestamp) : 
    new Date();
  
  const summaryItems = [
    {
      title: 'Monitors',
      icon: <BarChart className="h-4 w-4 text-tech-blue" />,
      value: `${data.uptimeMonitors.total - data.uptimeMonitors.down}/${data.uptimeMonitors.total} up`,
      status: data.uptimeMonitors.down > 0 ? 'Warning' : 'Up',
    },
    {
      title: 'Emails',
      icon: <Calendar className="h-4 w-4 text-tech-purple" />,
      value: `${data.emailsCount} sent`,
      status: 'Up',
    },
    {
      title: 'Alerts',
      icon: <Server className="h-4 w-4 text-tech-indigo" />,
      value: `${data.alertsCount} active`,
      status: data.alertsCount > 0 ? 'Critical' : 'Up',
    },
    {
      title: 'Devices',
      icon: <Database className="h-4 w-4 text-tech-teal" />,
      value: `${data.devicesProblems} issues`,
      status: data.devicesProblems > 0 ? 'Warning' : 'Up',
    },
    {
      title: 'Services',
      icon: <Clock className="h-4 w-4 text-tech-cyan" />,
      value: `${data.servicesTotal - data.servicesDown}/${data.servicesTotal} up`,
      status: data.servicesDown > 0 ? 'Down' : 'Up',
    }
  ];
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 p-4 bg-gradient-tech text-white flex flex-col justify-center items-start">
            <h2 className="text-xl font-bold">System Status</h2>
            <p className="text-sm opacity-90">
              Last updated: {format(currentTime, 'PPp')}
            </p>
          </div>
          
          <div className="flex-[3] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {summaryItems.map((item) => (
              <div key={item.title} className="p-4 border-b sm:border-b-0 sm:border-l border-border last:border-b-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-1.5 text-sm font-medium">{item.title}</span>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <div className="text-xl font-bold">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardSummary;
