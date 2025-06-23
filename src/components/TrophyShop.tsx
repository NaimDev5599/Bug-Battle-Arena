
import React from 'react';
import { GameState } from '../types/Game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Star, Sword } from 'lucide-react';
import { toast } from 'sonner';

interface TrophyShopProps {
  gameState: GameState;
  onUpgrade: (upgradeType: keyof GameState['upgrades'], cost: number) => void;
}

const TrophyShop: React.FC<TrophyShopProps> = ({ gameState, onUpgrade }) => {
  const getUpgradeCost = (baseLevel: number, currentLevel: number): number => {
    return baseLevel + (currentLevel * 2);
  };

  const upgrades = [
    {
      key: 'catchChance' as const,
      name: 'Catch Master',
      description: 'Increase catch chance by 5%',
      icon: Target,
      baseCost: 3,
      maxLevel: 50,
      currentLevel: gameState.upgrades.catchChance
    },
    {
      key: 'rareBugLuck' as const,
      name: 'Lucky Hunter',
      description: 'Better chance to find rare bugs',
      icon: Star,
      baseCost: 5,
      maxLevel: 50,
      currentLevel: gameState.upgrades.rareBugLuck
    },
    {
      key: 'bugStrength' as const,
      name: 'Power Boost',
      description: 'Increase all bug strength by 10%',
      icon: Sword,
      baseCost: 4,
      maxLevel: 50,
      currentLevel: gameState.upgrades.bugStrength
    }
  ];

  const handleUpgrade = (upgradeType: keyof GameState['upgrades'], cost: number) => {
    if (gameState.trophies >= cost) {
      onUpgrade(upgradeType, cost);
      toast.success(`Upgraded ${upgrades.find(u => u.key === upgradeType)?.name}!`);
    } else {
      toast.error(`Not enough trophies! Need ${cost} trophies.`);
    }
  };

  return (
    <Card className="border-4 border-yellow-300 rounded-3xl shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-t-3xl">
        <CardTitle className="flex items-center gap-2 text-2xl text-yellow-700">
          <Trophy className="w-8 h-8" />
          🏆 Trophy Shop 🏆
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-200">
          <div className="flex items-center gap-3 justify-center">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <span className="font-bold text-2xl text-yellow-700">Available Trophies: {gameState.trophies}</span>
          </div>
        </div>
        <div className="space-y-4">
          {upgrades.map((upgrade) => {
            const cost = getUpgradeCost(upgrade.baseCost, upgrade.currentLevel);
            const canAfford = gameState.trophies >= cost;
            const isMaxLevel = upgrade.currentLevel >= upgrade.maxLevel;
            const IconComponent = upgrade.icon;
            
            return (
              <div key={upgrade.key} className="flex items-center justify-between p-4 border-2 border-purple-200 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-purple-700">{upgrade.name}</div>
                    <div className="text-sm text-purple-600">{upgrade.description}</div>
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                    Level {upgrade.currentLevel}/{upgrade.maxLevel}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-2 rounded-xl border border-yellow-200">
                    <Trophy className="w-5 h-5" />
                    <span className="font-bold text-lg">{cost}</span>
                  </div>
                  <Button 
                    onClick={() => handleUpgrade(upgrade.key, cost)}
                    disabled={!canAfford || isMaxLevel}
                    variant={canAfford && !isMaxLevel ? "default" : "outline"}
                    size="lg"
                    className={`rounded-2xl font-bold ${canAfford && !isMaxLevel ? 'bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white transform hover:scale-110' : ''}`}
                  >
                    {isMaxLevel ? '✨ Max ✨' : '⬆️ Upgrade'}
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

export default TrophyShop;
