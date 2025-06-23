
import React from 'react';
import { Bug } from '../types/Game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Coins } from 'lucide-react';
import { toast } from 'sonner';

interface BugLevelingProps {
  bugs: Bug[];
  points: number;
  onLevelUp: (bug: Bug, cost: number) => void;
}

const BugLeveling: React.FC<BugLevelingProps> = ({ bugs, points, onLevelUp }) => {
  const getLevelUpCost = (bug: Bug): number => {
    const currentLevel = bug.level || 1;
    return currentLevel * 20;
  };

  const handleLevelUp = (bug: Bug) => {
    const cost = getLevelUpCost(bug);
    if (points >= cost) {
      onLevelUp(bug, cost);
      toast.success(`${bug.name} leveled up!`, { duration: 1000 });
    } else {
      toast.error(`Not enough points! Need ${cost} points.`, { duration: 1000 });
    }
  };

  if (bugs.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No bugs available to level up</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Level Up Bugs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold">Available Points: {points}</span>
          </div>
        </div>
        <div className="space-y-4">
          {bugs.map((bug) => {
            const cost = getLevelUpCost(bug);
            const canAfford = points >= cost;
            const currentLevel = bug.level || 1;
            
            return (
              <div key={bug.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-lg font-semibold">{bug.name}</div>
                  <Badge variant="outline">Level {currentLevel}</Badge>
                  <Badge className={`${
                    bug.rarity === 'common' ? 'bg-gray-500' :
                    bug.rarity === 'uncommon' ? 'bg-green-500' :
                    bug.rarity === 'rare' ? 'bg-blue-500' : 
                    bug.rarity === 'legendary' ? 'bg-purple-500' :
                    bug.rarity === 'epic' ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}>
                    {bug.rarity}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Coins className="w-4 h-4" />
                    <span className="font-semibold">{cost}</span>
                  </div>
                  <Button 
                    onClick={() => handleLevelUp(bug)}
                    disabled={!canAfford}
                    variant={canAfford ? "default" : "outline"}
                    size="sm"
                  >
                    Level Up
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BugLeveling;
