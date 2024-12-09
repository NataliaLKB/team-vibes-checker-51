import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface HealthCheck {
  name: string;
  morale: { mood: string; value: number };
  communication: { mood: string; value: number };
  productivity: { mood: string; value: number };
  timestamp: string;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentResponse = location.state?.responses;
  const [recentResponses, setRecentResponses] = useState<HealthCheck[]>([]);
  
  useEffect(() => {
    const fetchRecentResponses = async () => {
      try {
        const { data, error } = await supabase
          .from('health_checks')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(5);

        if (error) throw error;

        setRecentResponses(data || []);
      } catch (error) {
        console.error('Error fetching health checks:', error);
        toast({
          title: "Error",
          description: "Failed to load recent health checks.",
          variant: "destructive",
        });
      }
    };

    fetchRecentResponses();

    // Set up real-time subscription
    const subscription = supabase
      .channel('health_checks_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'health_checks' 
        }, 
        async () => {
          // Refetch data when changes occur
          await fetchRecentResponses();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (!currentResponse && recentResponses.length === 0) {
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
          <p className="text-gray-600">
            {currentResponse 
              ? `Thank you for your feedback, ${currentResponse.name}!`
              : 'Recent submissions from the team'}
          </p>
        </div>

        {recentResponses.map((response, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold">{response.name}'s Feedback</h2>
              <span className="text-sm text-gray-500">
                {new Date(response.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Team Morale</h3>
                <Progress value={response.morale.value} className="w-full" />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Communication</h3>
                <Progress value={response.communication.value} className="w-full" />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Productivity</h3>
                <Progress value={response.productivity.value} className="w-full" />
              </div>
            </div>
          </div>
        ))}

        <div className="text-center mt-8">
          <Button onClick={() => navigate('/')}>Submit Another Response</Button>
        </div>
      </div>
    </div>
  );
};

export default Results;