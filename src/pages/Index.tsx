import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HealthCheckCard from '@/components/HealthCheckCard';
import { Comments } from '@/components/Comments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HealthCheckResponse {
  mood: string;
  value: number;
}

interface Responses {
  name: string;
  morale: HealthCheckResponse;
  communication: HealthCheckResponse;
  productivity: HealthCheckResponse;
  why: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [responses, setResponses] = useState<Responses>({
    name: '',
    morale: {
      mood: '',
      value: 0
    },
    communication: {
      mood: '',
      value: 0
    },
    productivity: {
      mood: '',
      value: 0
    },
    why: ''
  });
  const {
    toast
  } = useToast();

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

  const handleResponse = (category: 'morale' | 'communication' | 'productivity', mood: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [category]: {
        mood,
        value
      }
    }));
  };

  const handleCommentChange = (comment: string) => {
    setResponses(prev => ({
      ...prev,
      why: comment
    }));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name before submitting.",
        variant: "destructive"
      });
      return;
    }
    if (!responses.why.trim()) {
      toast({
        title: "Comments required",
        description: "Please share why you feel this way before submitting.",
        variant: "destructive"
      });
      return;
    }
    if (Object.values(responses).slice(1, -1).every(r => r.mood)) {
      const finalResponses = {
        name,
        morale: responses.morale as unknown as Json,
        communication: responses.communication as unknown as Json,
        productivity: responses.productivity as unknown as Json,
        why: responses.why
      };
      try {
        const {
          error
        } = await supabase.from('health_checks').insert([finalResponses]);
        if (error) throw error;
        toast({
          title: "Health check submitted!",
          description: `Thank you for participating, ${name}! 🌟`
        });
        console.log('Saved responses:', finalResponses);
        navigate('/results', {
          state: {
            responses: finalResponses
          }
        });
        setName('');
        setResponses({
          name: '',
          morale: {
            mood: '',
            value: 0
          },
          communication: {
            mood: '',
            value: 0
          },
          productivity: {
            mood: '',
            value: 0
          },
          why: ''
        });
      } catch (error) {
        console.error('Error saving health check:', error);
        toast({
          title: "Error",
          description: "Failed to save your health check. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Incomplete submission",
        description: "Please provide feedback for all categories.",
        variant: "destructive"
      });
    }
  };

  return <div className="min-h-screen bg-[#f5f4f5] text-foreground">
      <div className={`${theme === 'light' ? 'bg-white' : 'bg-darkBlue-DEFAULT dark:bg-gray-900'} text-white py-4 px-8 shadow-md dark:shadow-black/30 mb-8`}>
        <div className="max-w-6xl mx-auto flex items-center">
          <div className="flex-1">
            <img 
              src="/lovable-uploads/c8b4cabf-f0ee-4d05-883b-4070fbf16a5e.png" 
              alt="SmartShift Logo" 
              className="h-6" 
            />
          </div>
          <h1 className={`text-lg font-normal flex-1 text-center ${theme === 'light' ? 'text-[#333333]' : 'text-slate-50'}`}>Team Health Check</h1>
          <div className="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-darkBlue-DEFAULT text-[#00ced1]">How are we doing this week?</h2>
          <p className="text-gray-600 dark:text-gray-300">Let us know below! 😊</p>
        </div>

        <div className="grid gap-8">
          <div className="animate-scale-in">
            <Input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} className="max-w-md mx-auto border-primary focus-visible:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400" />
          </div>

          <HealthCheckCard title="How are you feeling this week?" description="Share your overall mood and energy level with the team" onSelect={(mood, value) => handleResponse('morale', mood, value)} />
          
          <HealthCheckCard title="Communication" description="How well are we communicating?" onSelect={(mood, value) => handleResponse('communication', mood, value)} />
          
          <HealthCheckCard title="Productivity" description="How productive do you feel?" onSelect={(mood, value) => handleResponse('productivity', mood, value)} />

          <Comments onCommentChange={handleCommentChange} />

          <div className="text-center">
            <Button size="lg" onClick={handleSubmit} className="px-8 bg-primary hover:bg-primary/90 text-slate-950">
              Submit Health Check
            </Button>
          </div>
        </div>
      </div>
    </div>;
};

export default Index;
