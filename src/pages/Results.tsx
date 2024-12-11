import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HealthCheckCard } from '@/components/HealthCheckCard';
import { groupHealthChecksByDate } from '@/utils/health-check';
import type { HealthCheck } from '@/types/health-check';

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
        morale: item.morale as unknown as HealthCheck['morale'],
        communication: item.communication as unknown as HealthCheck['communication'],
        productivity: item.productivity as unknown as HealthCheck['productivity'],
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
          <div key={date} className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">{date}</h2>
            {checks.map((check) => (
              <HealthCheckCard
                key={check.id}
                healthCheck={check}
                onDelete={handleDeleteRecord}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;