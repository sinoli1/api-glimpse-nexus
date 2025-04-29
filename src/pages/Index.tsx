
import React, { useRef } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Dashboard, { DashboardRef } from '@/components/dashboard/Dashboard';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const dashboardRef = useRef<DashboardRef>(null);
  
  const handleRefresh = () => {
    toast({
      title: "Dashboard refreshing",
      description: "Fetching the latest data from all APIs..."
    });
    
    // Call the fetchData method on the Dashboard component
    if (dashboardRef.current) {
      dashboardRef.current.fetchData();
    }
  };
  
  return (
    <div className="min-h-screen bg-background pb-12">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 pt-8">
        <div className="flex justify-between items-start mb-4">
          <DashboardHeader />
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="mt-2 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
        
        <Dashboard ref={dashboardRef} />
      </div>
    </div>
  );
};

export default Index;
