
import React from 'react';
import { Bug } from '../types/Game';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Sword, Heart, Zap, Leaf, Crown, Moon, Sparkles, RotateCcw } from 'lucide-react';

interface BugEncounterProps {
  bugs: Bug[];
  onSelect: (bug: Bug) => void;
  onContinueSearch: () => void;
  playerLevel: number;
}

const BugEncounter: React.FC<BugEncounterProps> = ({ bugs, onSelect, onContinueSearch, playerLevel }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return Shield;
      case 'Zap': return Zap;
      case 'Leaf': return Leaf;
      case 'Crown': return Crown;
      case 'Moon': return Moon;
      case 'Sparkles': return Sparkles;
      default: return Shield;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'legendary': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getCatchRate = (bug: Bug) => {
    const baseRate = {
      common: 80,
      uncommon: 60,
      rare: 40,
      legendary: 20
    }[bug.rarity];
    
    const levelBonus = Math.min(playerLevel * 5, 30);
    return Math.min(baseRate + levelBonus, 95);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center">Choose a bug to catch!</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bugs.map((bug) => {
          const IconComponent = getIcon(bug.icon);
          const catchRate = getCatchRate(bug);
          
          return (
            <Card key={bug.id} className="cursor-pointer transition-all duration-200 hover:scale-105">
              <CardContent className="p-4">
                <div className="text-center mb-3">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-gray-600" />
                  </div>
                  <Badge className={`${getRarityColor(bug.rarity)} mb-2`}>
                    {bug.rarity}
                  </Badge>
                </div>
                
                <h4 className="font-bold text-lg mb-1 text-center">{bug.name}</h4>
                <p className="text-sm text-gray-600 mb-3 text-center">{bug.type}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-600" />
                    <span>{bug.armor}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sword className="w-3 h-3 text-red-600" />
                    <span>{bug.strength}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-pink-600" />
                    <span>{bug.health}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-600" />
                    <span>{bug.speed}</span>
                  </div>
                </div>
                
                <div className="text-center mb-3">
                  <p className="text-xs text-green-600 font-medium">
                    Catch Rate: {catchRate}%
                  </p>
                </div>
                
                <Button 
                  onClick={() => onSelect(bug)}
                  className="w-full"
                  size="sm"
                >
                  Try to Catch
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center mt-6">
        <Button 
          onClick={onContinueSearch}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Continue Search
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          Don't like these bugs? Search for different ones!
        </p>
      </div>
    </div>
  );
};

export default BugEncounter;
