import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HealthCheckResponse {
  mood: string;
  value: number;
}

interface HealthCheck {
  id: string;
  name: string;
  morale: HealthCheckResponse;
  communication: HealthCheckResponse;
  productivity: HealthCheckResponse;
  timestamp: string;
}

const Results = () => {
  const location = useLocation();
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
      
      // Convert the JSON data back to our HealthCheck type
      const typedData = data?.map(item => ({
        ...item,
        morale: item.morale as unknown as HealthCheckResponse,
        communication: item.communication as unknown as HealthCheckResponse,
        productivity: item.productivity as unknown as HealthCheckResponse,
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

  const handleClearResults = async () => {
    try {
      const { error } = await supabase
        .from('health_checks')
        .delete()
        .gt('id', '0'); // This deletes all records since UUID is always greater than '0'

      if (error) throw error;

      toast({
        title: "Success",
        description: "All health check results have been cleared.",
      });

      // Refresh the data
      fetchHealthChecks();
    } catch (error) {
      console.error('Error clearing health checks:', error);
      toast({
        title: "Error",
        description: "Failed to clear health check results.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchHealthChecks();

    // Set up real-time subscription
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
  }, [toast]);

  if (healthChecks.length === 0) {
    return (
      <div className="min-h-screen bg-secondary p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">No Results Found</h1>
        <Button onClick={() => navigate('/')}>Return to Health Check</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Health Check Results</h1>
          <p className="text-gray-600">Recent submissions from the team</p>
          <div className="mt-4 flex justify-center gap-4">
            <Button onClick={() => navigate('/')}>Submit Another Response</Button>
            <Button 
              variant="destructive" 
              onClick={handleClearResults}
            >
              Clear All Results
            </Button>
          </div>
        </div>

        {healthChecks.map((check) => (
          <div key={check.id} className="bg-white p-6 rounded-lg shadow-md space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold">{check.name}'s Feedback</h2>
              <span className="text-sm text-gray-500">
                {new Date(check.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Team Morale</h3>
                <Progress value={check.morale.value} className="w-full" />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Communication</h3>
                <Progress value={check.communication.value} className="w-full" />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Productivity</h3>
                <Progress value={check.productivity.value} className="w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;