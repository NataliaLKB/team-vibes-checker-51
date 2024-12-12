import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

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
  why: string | null;
  timestamp: string;
}

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
          <div key={date} className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">{date}</h2>
            {checks.map((check) => (
              <div key={check.id} className="bg-white p-6 rounded-lg shadow-md space-y-6 animate-scale-in">
                <div className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold">{check.name}'s Feedback</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRecord(check.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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

                  {check.why && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Why?</h3>
                      <p className="text-gray-600">{check.why}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
