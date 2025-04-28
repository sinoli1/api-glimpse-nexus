
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DashboardSummary from './DashboardSummary';
import UptimeMonitorCard from './UptimeMonitorCard';
import ServiceStatusCard from './ServiceStatusCard';
import DeviceStatusCard from './DeviceStatusCard';
import AlertCard from './AlertCard';
import EmailCard from './EmailCard';
import { Server, Cloud, Rss } from 'lucide-react';

// Mock data for initial rendering
const mockData = {
  uptime: {
    monitors: [
      {
        custom_url: "https://norterodados.quaga.com",
        friendly_name: "Norte Rodados",
        monitor_down: 0,
        monitor_total: 3,
        monitors_id: {
          "778112150": {
            friendly_name: "NR - Resistencia",
            incidents: [],
            status: "Up",
            url: "190.7.18.186"
          },
          "778112151": {
            friendly_name: "NR - Garupá",
            incidents: [],
            status: "Up",
            url: "67d406d0afbd.sn.mynetname.net"
          },
          "778181054": {
            friendly_name: "NR - Ramirez",
            incidents: [],
            status: "Up",
            url: "3b020293f4dc.sn.mynetname.net"
          }
        }
      }
    ]
  },
  gmail: {
    "abril nuevo": {
      Cuerpo: "",
      Destinatario: "gp@quaga.com",
      Estado: "Success",
      FechaEnvio: "27 Apr 2025 21:02:25 -0300",
      Remitente: "alertas@quaga.net"
    }
  },
  atera: {
    alerts: {
      "59525": {
        AlertCategoryID: "Availability",
        AlertMessage: "Estado de la máquina Desconocido: el agente no ha establecido la comunicación dentro del intervalo esperado.",
        CustomerName: "Innocente",
        DeviceGuid: "7eb234fd-27b4-4e32-9e06-5646200ea20b",
        DeviceName: "REPOSITORIO",
        Severity: "Critical",
        Title: "Machine status unknown",
        incidents: [
          {
            created: "2025-04-07 19:50:21",
            resolved: null
          }
        ]
      }
    }
  },
  aruba: {
    data: [
      {
        devices_problem: [
          {
            condition: "offline",
            device_name: "CNM4JSS1MM",
            device_type: "accessPoint",
            ip_address: "172.16.181.198",
            last_communication_datetime: "07/03/2025 09:06:28",
            mac_address: "cc:d0:83:c3:0a:54",
            model: "AP-305",
            operational_state: "down",
            seconds_since_last_communication: 4454048,
            severity: "poor",
            status: "down"
          }
        ],
        site_id: "483d4346-41d2-431f-be16-5af07d873ba2",
        site_name: "Milano Donovan 63 (sin conectar por cierre de sucursal).",
        total_devices: 1,
        total_devices_problem: 1
      }
    ],
    timestamp: "2025-04-27 22:20:36"
  },
  rss: {
    services: {
      AnyDesk: "Up",
      Freshdesk: "Up",
      "Google Cloud": "Up",
      "Google Workspace": "Up",
      NextDNS: "Up",
      "No-IP": "Up",
      Slack: "Up",
      UptimeRobot: "Up"
    },
    timestamp: "2025-04-27 22:20:08"
  }
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For demo purposes - in real app, this would be a real API call
  const fetchData = async () => {
    setLoading(true);
    try {
      // In production, replace with real API calls
      // const uptimeResponse = await fetch('http://10.200.0.189:5000/uptime');
      // const uptimeData = await uptimeResponse.json();
      // ...other API calls
      
      // For demo, we're just using the mock data
      setData(mockData);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Fetch new data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate summary data
  const summaryData = {
    uptimeMonitors: {
      total: data.uptime.monitors.reduce((acc, monitor) => acc + monitor.monitor_total, 0),
      down: data.uptime.monitors.reduce((acc, monitor) => acc + monitor.monitor_down, 0)
    },
    emailsCount: Object.keys(data.gmail).length,
    alertsCount: Object.keys(data.atera.alerts).length,
    devicesProblems: data.aruba.data.reduce((acc, site) => acc + site.total_devices_problem, 0),
    servicesDown: Object.values(data.rss.services).filter(status => status !== 'Up').length,
    servicesTotal: Object.keys(data.rss.services).length,
    timestamp: data.rss.timestamp || data.aruba.timestamp
  };
  
  // Transform services data for the ServiceStatusCard
  const servicesData = Object.entries(data.rss.services).map(([name, status]) => ({
    name,
    status: status as string
  }));

  // For the first monitor in the uptime data
  const firstMonitor = data.uptime.monitors[0];

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="bg-destructive/20 border border-destructive text-destructive p-4 rounded-md">
          {error}
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
            <UptimeMonitorCard 
              title={firstMonitor.friendly_name}
              monitorsDown={firstMonitor.monitor_down}
              monitorsTotal={firstMonitor.monitor_total}
              monitors={firstMonitor.monitors_id}
            />
            
            <DeviceStatusCard 
              title={data.aruba.data[0].site_name}
              totalDevices={data.aruba.data[0].total_devices}
              problemDevices={data.aruba.data[0].devices_problem}
            />
            
            <AlertCard 
              title="Active Alerts"
              alerts={data.atera.alerts}
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
              emails={data.gmail}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
