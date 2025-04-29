
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DashboardSummary from './DashboardSummary';
import UptimeMonitorCard from './UptimeMonitorCard';
import ServiceStatusCard from './ServiceStatusCard';
import DeviceStatusCard from './DeviceStatusCard';
import AlertCard from './AlertCard';
import EmailCard from './EmailCard';
import { Server, Cloud, Rss } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Base API URL
const API_BASE_URL = 'http://10.200.0.189:5000';

interface EmailData {
  Remitente: string;
  Destinatario: string;
  FechaEnvio: string;
  Estado: string;
  Cuerpo: string;
}

interface UptimeMonitor {
  friendly_name: string;
  monitor_down: number;
  monitor_total: number;
  monitors_id: Record<string, {
    friendly_name: string;
    status: string;
    url: string;
  }>;
}

interface AteraAlert {
  AlertCategoryID: string;
  AlertMessage: string;
  CustomerName: string;
  DeviceGuid: string;
  DeviceName: string;
  Severity: string;
  Title: string;
  incidents?: { created: string; resolved: string | null }[];
}

interface ArubaDevice {
  device_name: string;
  status: string;
  model?: string;
  ip_address?: string;
  seconds_since_last_communication?: number;
  last_communication_datetime?: string;
}

interface ArubaData {
  devices_problem: ArubaDevice[];
  site_id: string;
  site_name: string;
  total_devices: number;
  total_devices_problem: number;
}

interface DashboardData {
  uptime: {
    monitors: UptimeMonitor[];
  };
  gmail: Record<string, EmailData>;
  atera: {
    alerts: Record<string, AteraAlert>;
  };
  aruba: {
    data: ArubaData[];
    timestamp: string;
  };
  rss: {
    services: Record<string, string>;
    timestamp: string;
  };
}

export interface DashboardRef {
  fetchData: () => Promise<void>;
}

const Dashboard = forwardRef<DashboardRef>((props, ref) => {
  const [data, setData] = useState<DashboardData>({
    uptime: { monitors: [] },
    gmail: {},
    atera: { alerts: {} },
    aruba: { data: [], timestamp: '' },
    rss: { services: {}, timestamp: '' }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Parallel API requests for better performance
      const [uptimeRes, gmailRes, ateraRes, arubaRes, rssRes] = await Promise.all([
        fetch(`${API_BASE_URL}/uptime`),
        fetch(`${API_BASE_URL}/gmail`),
        fetch(`${API_BASE_URL}/atera`),
        fetch(`${API_BASE_URL}/aruba`),
        fetch(`${API_BASE_URL}/rss`)
      ]);
      
      // Check if any request failed
      if (!uptimeRes.ok || !gmailRes.ok || !ateraRes.ok || !arubaRes.ok || !rssRes.ok) {
        throw new Error('One or more API requests failed');
      }
      
      // Parse JSON responses
      const [uptimeData, gmailData, ateraData, arubaData, rssData] = await Promise.all([
        uptimeRes.json(),
        gmailRes.json(),
        ateraRes.json(),
        arubaRes.json(),
        rssRes.json()
      ]);
      
      // Update state with fetched data
      setData({
        uptime: uptimeData,
        gmail: gmailData,
        atera: ateraData,
        aruba: arubaData,
        rss: rssData
      });
      
      setError(null);
      console.log('Data fetched successfully');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again.');
      toast({
        title: "Error fetching data",
        description: "Couldn't connect to the API endpoints. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Expose fetchData method to parent component
  useImperativeHandle(ref, () => ({
    fetchData,
  }));

  useEffect(() => {
    fetchData();
    
    // Fetch new data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate summary data
  const summaryData = {
    uptimeMonitors: {
      total: data.uptime.monitors?.reduce((acc, monitor) => acc + monitor.monitor_total, 0) || 0,
      down: data.uptime.monitors?.reduce((acc, monitor) => acc + monitor.monitor_down, 0) || 0
    },
    emailsCount: Object.values(data.gmail || {}).filter(email => (email as EmailData).Estado?.toLowerCase() === 'failed').length,
    alertsCount: Object.keys(data.atera?.alerts || {}).length,
    devicesProblems: data.aruba?.data?.reduce((acc, site) => acc + site.total_devices_problem, 0) || 0,
    servicesDown: Object.values(data.rss?.services || {}).filter(status => status !== 'Up').length,
    servicesTotal: Object.keys(data.rss?.services || {}).length,
    timestamp: data.rss?.timestamp || data.aruba?.timestamp
  };
  
  // Transform services data for the ServiceStatusCard
  const servicesData = Object.entries(data.rss?.services || {}).map(([name, status]) => ({
    name,
    status: status as string
  }));

  // For the first monitor in the uptime data
  const firstMonitor = data.uptime.monitors?.[0];

  // Transform Atera alerts to match AlertCard's expected format
  const transformedAlerts = Object.entries(data.atera?.alerts || {}).reduce((acc, [id, alert]) => {
    acc[id] = {
      ...alert,
      incidents: alert.incidents || [{ created: new Date().toISOString(), resolved: null }]
    };
    return acc;
  }, {} as Record<string, AteraAlert>);

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="bg-destructive/20 border border-destructive text-destructive p-4 rounded-md">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="bg-primary/10 border border-primary text-primary p-4 rounded-md">
          Loading dashboard data...
        </div>
      )}
      
      <DashboardSummary data={summaryData} />
      
      <Tabs defaultValue="infrastructure" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="infrastructure" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Infrastructure</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Rss className="h-4 w-4" />
            <span>Services & Communication</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="infrastructure" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {firstMonitor && (
              <UptimeMonitorCard 
                title={firstMonitor.friendly_name}
                monitorsDown={firstMonitor.monitor_down}
                monitorsTotal={firstMonitor.monitor_total}
                monitors={firstMonitor.monitors_id}
              />
            )}
            
            {data.aruba?.data?.[0] && (
              <DeviceStatusCard 
                title={data.aruba.data[0].site_name}
                totalDevices={data.aruba.data[0].total_devices}
                problemDevices={data.aruba.data[0].devices_problem}
              />
            )}
            
            <AlertCard 
              title="Active Alerts"
              alerts={transformedAlerts}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ServiceStatusCard 
              title="External Services"
              services={servicesData}
            />
            
            <EmailCard 
              title="Recent Emails"
              emails={data.gmail || {}}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
