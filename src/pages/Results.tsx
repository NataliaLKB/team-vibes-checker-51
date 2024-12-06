import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface HealthCheck {
  name: string;
  morale: string;
  communication: string;
  productivity: string;
  timestamp: string;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentResponse = location.state?.responses;
  
  // Get all responses from localStorage
  const allResponses: HealthCheck[] = JSON.parse(localStorage.getItem('healthChecks') || '[]');
  
  // Sort responses by timestamp, most recent first
  const sortedResponses = [...allResponses].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Filter responses from the last 5 minutes
  const recentResponses = sortedResponses.filter(response => {
    const responseTime = new Date(response.timestamp).getTime();
    const fiveMinutesAgo = new Date().getTime() - 5 * 60 * 1000;
    return responseTime > fiveMinutesAgo;
  });

  const getMoodValue = (mood: string): number => {
    switch (mood) {
      case 'happy':
        return 100;
      case 'neutral':
        return 50;
      case 'sad':
        return 20;
      default:
        return 0;
    }
  };

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
          <div key={index} className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold">{response.name}'s Feedback</h2>
              <span className="text-sm text-gray-500">
                {new Date(response.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Team Morale</h3>
                <Progress value={getMoodValue(response.morale)} className="w-full" />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Communication</h3>
                <Progress value={getMoodValue(response.communication)} className="w-full" />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Productivity</h3>
                <Progress value={getMoodValue(response.productivity)} className="w-full" />
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