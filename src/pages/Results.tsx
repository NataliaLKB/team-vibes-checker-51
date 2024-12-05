import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const responses = location.state?.responses;

  if (!responses) {
    return (
      <div className="min-h-screen bg-secondary p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">No Results Found</h1>
        <Button onClick={() => navigate('/')}>Return to Health Check</Button>
      </div>
    );
  }

  const getMoodEmoji = (value: string) => {
    switch (value) {
      case 'sad':
        return '😢';
      case 'neutral':
        return '😐';
      case 'happy':
        return '😊';
      default:
        return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Your Health Check Results</h1>
          <p className="text-gray-600">Thank you for your feedback, {responses.name}!</p>
        </div>

        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Team Morale</h2>
            <p className="text-3xl">{getMoodEmoji(responses.morale)}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Communication</h2>
            <p className="text-3xl">{getMoodEmoji(responses.communication)}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Productivity</h2>
            <p className="text-3xl">{getMoodEmoji(responses.productivity)}</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button onClick={() => navigate('/')}>Submit Another Response</Button>
        </div>
      </div>
    </div>
  );
};

export default Results;