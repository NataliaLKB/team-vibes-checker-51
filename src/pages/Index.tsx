import React, { useState } from 'react';
import { HealthCheckCard } from '@/components/HealthCheckCard';
import { Comments } from '@/components/Comments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [name, setName] = useState('');
  const [responses, setResponses] = useState({
    name: '',
    morale: '',
    communication: '',
    productivity: '',
  });
  
  const { toast } = useToast();

  const handleResponse = (category: keyof typeof responses, mood: string) => {
    setResponses(prev => ({
      ...prev,
      [category]: mood
    }));
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (Object.values(responses).slice(1).every(r => r)) {
      const finalResponses = {
        ...responses,
        name: name,
        timestamp: new Date().toISOString(),
      };

      // Save to localStorage
      const existingResponses = JSON.parse(localStorage.getItem('healthChecks') || '[]');
      existingResponses.push(finalResponses);
      localStorage.setItem('healthChecks', JSON.stringify(existingResponses));

      toast({
        title: "Health check submitted!",
        description: `Thank you for participating, ${name}! 🌟`,
      });
      
      console.log('Saved responses:', finalResponses);
      
      // Reset form
      setName('');
      setResponses({
        name: '',
        morale: '',
        communication: '',
        productivity: '',
      });
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
            onSelect={(mood) => handleResponse('morale', mood)}
          />
          
          <HealthCheckCard
            title="Communication"
            description="How well are we communicating?"
            onSelect={(mood) => handleResponse('communication', mood)}
          />
          
          <HealthCheckCard
            title="Productivity"
            description="How productive do you feel?"
            onSelect={(mood) => handleResponse('productivity', mood)}
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