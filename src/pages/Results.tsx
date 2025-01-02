import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HealthCheck } from '@/types/health-check';
import HealthCheckGroup from '@/components/HealthCheckGroup';

interface GroupedHealthChecks {
  [date: string]: HealthCheck[];
}

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  
  const fetchHealthChecks = async () => {
    try {
      const { data, error } = await supabase
        .from('health_checks')
        .select()
        .order('timestamp', { ascending: false })
        .limit(5);

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
      <div className="min-h-screen bg-secondary p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">No Results Found</h1>
        <Button onClick={() => navigate('/')}>Return to Health Check</Button>
      </div>
    );
  }

  const groupedHealthChecks = groupHealthChecksByDate(healthChecks);

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Health Check Results</h1>
          <p className="text-gray-600">Recent submissions from the team</p>
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