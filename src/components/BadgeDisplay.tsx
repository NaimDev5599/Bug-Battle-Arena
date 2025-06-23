
import React from 'react';
import { badges } from '../data/badges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BadgeDisplayProps {
  earnedBadges: number;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ earnedBadges }) => {
  return (
    <Card className="border-4 border-yellow-300 rounded-3xl shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-t-3xl">
        <CardTitle className="text-2xl text-center text-yellow-700">
          🏆 Badge Collection 🏆
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-5 gap-4">
          {badges.map((badge, index) => {
            const isEarned = index < earnedBadges;
            return (
              <div
                key={badge.id}
                className={`relative flex flex-col items-center p-4 rounded-2xl transform transition-all duration-300 ${
                  isEarned 
                    ? `bg-gradient-to-br ${badge.gradient} shadow-lg animate-pulse hover:scale-110` 
                    : 'bg-gray-200 grayscale opacity-50'
                }`}
              >
                <div className={`text-4xl mb-2 ${isEarned ? 'animate-bounce' : ''}`}>
                  {isEarned ? badge.icon : '❓'}
                </div>
                <Badge 
                  className={`text-xs px-2 py-1 rounded-xl font-bold ${
                    isEarned 
                      ? 'bg-white text-gray-800 shadow-md' 
                      : 'bg-gray-400 text-gray-600'
                  }`}
                >
                  {isEarned ? badge.name : '???'}
                </Badge>
                {isEarned && (
                  <p className="text-xs text-center text-gray-700 mt-1 font-medium">
                    {badge.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          <p className="text-lg font-bold text-yellow-700">
            🎯 Progress: {earnedBadges}/10 Badges Earned! 🎯
          </p>
          {earnedBadges === 10 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-rainbow-400 to-yellow-400 rounded-2xl animate-bounce">
              <p className="text-2xl font-bold text-white">
                🎉 CHAMPION! You've collected all badges! 🎉
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeDisplay;
