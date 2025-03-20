
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HealthCheck, HealthCheckResponse } from '@/types/health-check';
import HealthCheckGroup from '@/components/HealthCheckGroup';
import { ThemeToggle } from '@/components/ThemeToggle';

interface GroupedHealthChecks {
  [date: string]: HealthCheck[];
}

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const isDarkNow = document.documentElement.classList.contains('dark');
          setTheme(isDarkNow ? 'dark' : 'light');
        }
      });
    });
    observer.observe(document.documentElement, {
      attributes: true
    });
    return () => observer.disconnect();
  }, []);
  
  const fetchHealthChecks = async () => {
    try {
      const { data, error } = await supabase
        .from('health_checks')
        .select()
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      const typedData = data?.map(item => ({
        ...item,
        morale: item.morale as unknown as HealthCheckResponse,
        communication: item.communication as unknown as HealthCheckResponse,
        productivity: item.productivity as unknown as HealthCheckResponse,
        why: item.why || null,
      })) || [];
      
      setHealthChecks(typedData);
    } catch (error) {
      console.error('Error fetching health checks:', error);
      toast({
        title: "Error",
        description: "Failed to load recent health checks.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('health_checks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHealthChecks(prevChecks => prevChecks.filter(check => check.id !== id));
      
      toast({
        title: "Success",
        description: "Health check record deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting health check:', error);
      toast({
        title: "Error",
        description: "Failed to delete health check record.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time parts to compare dates properly
    const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayWithoutTime = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (dateWithoutTime.getTime() === todayWithoutTime.getTime()) {
      return 'Today';
    } else if (dateWithoutTime.getTime() === yesterdayWithoutTime.getTime()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString();
  };

  const groupHealthChecksByDate = (checks: HealthCheck[]): GroupedHealthChecks => {
    return checks.reduce((groups: GroupedHealthChecks, check) => {
      const date = formatDate(check.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(check);
      return groups;
    }, {});
  };

  useEffect(() => {
    fetchHealthChecks();

    const channel = supabase
      .channel('health_checks_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'health_checks' 
        }, 
        () => {
          fetchHealthChecks();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (healthChecks.length === 0) {
    return (
      <div className="min-h-screen bg-secondary dark:bg-gray-900 p-8 text-center">
        <div className={`${theme === 'light' ? 'bg-white' : 'bg-darkBlue-DEFAULT dark:bg-gray-900'} text-white py-4 px-8 shadow-md dark:shadow-black/30 mb-8`}>
          <div className="max-w-6xl mx-auto flex items-center">
            <div className="flex-1">
              <img src="/lovable-uploads/c8b4cabf-f0ee-4d05-883b-4070fbf16a5e.png" alt="SmartShift Logo" className="h-6" />
            </div>
            <h1 className={`text-lg font-normal flex-1 text-center ${theme === 'light' ? 'text-[#333333]' : 'text-slate-50'}`}>Team Health Check</h1>
            <div className="flex-1 flex justify-end">
              <ThemeToggle />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">No Results Found</h1>
        <Button onClick={() => navigate('/')}>Return to Health Check</Button>
      </div>
    );
  }

  const groupedHealthChecks = groupHealthChecksByDate(healthChecks);

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900 p-8">
      <div className={`${theme === 'light' ? 'bg-white' : 'bg-darkBlue-DEFAULT dark:bg-gray-900'} text-white py-4 px-8 shadow-md dark:shadow-black/30 mb-8`}>
        <div className="max-w-6xl mx-auto flex items-center">
          <div className="flex-1">
            <img src="/lovable-uploads/c8b4cabf-f0ee-4d05-883b-4070fbf16a5e.png" alt="SmartShift Logo" className="h-6" />
          </div>
          <h1 className={`text-lg font-normal flex-1 text-center ${theme === 'light' ? 'text-[#333333]' : 'text-slate-50'}`}>Team Health Check</h1>
          <div className="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[#00ced1] dark:text-[#00ced1]">Health Check Results</h1>
          <p className="text-gray-600 dark:text-gray-300">Recent submissions from the team</p>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => navigate('/')}>Submit Another Response</Button>
          </div>
        </div>

        {Object.entries(groupedHealthChecks).map(([date, checks]) => (
          <HealthCheckGroup
            key={date}
            date={date}
            checks={checks}
            onDelete={handleDeleteRecord}
          />
        ))}
      </div>
    </div>
  );
};

export default Results;
