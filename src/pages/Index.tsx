import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HealthCheckCard } from '@/components/HealthCheckCard';
import { Comments } from '@/components/Comments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface HealthCheckResponse {
  mood: string;
  value: number;
}

interface Responses {
  name: string;
  morale: HealthCheckResponse;
  communication: HealthCheckResponse;
  productivity: HealthCheckResponse;
}

const Index = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [responses, setResponses] = useState<Responses>({
    name: '',
    morale: { mood: '', value: 0 },
    communication: { mood: '', value: 0 },
    productivity: { mood: '', value: 0 },
  });
  
  const { toast } = useToast();

  const handleResponse = (category: 'morale' | 'communication' | 'productivity', mood: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [category]: { mood, value }
    }));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (Object.values(responses).slice(1).every(r => r.mood)) {
      const finalResponses = {
        name,
        morale: responses.morale,
        communication: responses.communication,
        productivity: responses.productivity,
      };

      try {
        const { error } = await supabase
          .from('health_checks')
          .insert([finalResponses]);

        if (error) throw error;

        toast({
          title: "Health check submitted!",
          description: `Thank you for participating, ${name}! 🌟`,
        });
        
        console.log('Saved responses:', finalResponses);
        
        navigate('/results', { state: { responses: finalResponses } });
        
        setName('');
        setResponses({
          name: '',
          morale: { mood: '', value: 0 },
          communication: { mood: '', value: 0 },
          productivity: { mood: '', value: 0 },
        });
      } catch (error) {
        console.error('Error saving health check:', error);
        toast({
          title: "Error",
          description: "Failed to save your health check. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Incomplete submission",
        description: "Please provide feedback for all categories.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Team Health Check</h1>
          <p className="text-gray-600">How are we doing today? Let us know with some fun reactions! 😊</p>
        </div>

        <div className="grid gap-8">
          <div className="animate-scale-in">
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-md mx-auto"
            />
          </div>

          <HealthCheckCard
            title="Team Morale"
            description="How's the team spirit today?"
            onSelect={(mood, value) => handleResponse('morale', mood, value)}
          />
          
          <HealthCheckCard
            title="Communication"
            description="How well are we communicating?"
            onSelect={(mood, value) => handleResponse('communication', mood, value)}
          />
          
          <HealthCheckCard
            title="Productivity"
            description="How productive do you feel?"
            onSelect={(mood, value) => handleResponse('productivity', mood, value)}
          />

          <Comments />

          <div className="text-center">
            <Button 
              size="lg"
              onClick={handleSubmit}
              className="px-8"
            >
              Submit Health Check
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;