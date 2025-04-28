
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

const DashboardHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="font-bold text-2xl md:text-3xl">API Glimpse Nexus</h1>
        <p className="text-muted-foreground">Monitor your services in real-time</p>
      </div>
      <div className="text-right">
        <div className="text-muted-foreground text-sm">{format(currentTime, 'EEEE')}</div>
        <div className="text-lg font-mono font-medium">{format(currentTime, 'h:mm:ss a')}</div>
        <div className="text-xs text-muted-foreground">{format(currentTime, 'PPP')}</div>
      </div>
    </div>
  );
};

export default DashboardHeader;
