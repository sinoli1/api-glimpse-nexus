
import React from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Dashboard from '@/components/dashboard/Dashboard';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  
  const handleRefresh = () => {
    toast({
      title: "Dashboard refreshing",
      description: "Fetching the latest data from all APIs..."
    });
    // In a real app, this would trigger a refresh of the data
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
            className="mt-2"
          >
            Refresh Data
          </Button>
        </div>
        
        <Dashboard />
      </div>
    </div>
  );
};

export default Index;
