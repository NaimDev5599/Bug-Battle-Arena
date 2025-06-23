import React, { useState, useEffect } from 'react';
import { Bug, NPC, BattleResult } from '../types/Game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Sword, Heart, Zap, Leaf, Crown, Moon, Sparkles, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import BattleTutorial from './BattleTutorial';

interface BattleArenaProps {
  playerBug: Bug;
  npc: NPC;
  onBattleComplete: (result: BattleResult) => void;
  isFirstBattle?: boolean;
}

const BattleArena: React.FC<BattleArenaProps> = ({ playerBug, npc, onBattleComplete, isFirstBattle = false }) => {
  const [battling, setBattling] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  useEffect(() => {
    if (isFirstBattle && !tutorialCompleted) {
      const hasSeenTutorial = localStorage.getItem('bugBattleTutorialCompleted');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      } else {
        setTutorialCompleted(true);
      }
    }
  }, [isFirstBattle, tutorialCompleted]);

  const handleTutorialComplete = () => {
    localStorage.setItem('bugBattleTutorialCompleted', 'true');
    setTutorialCompleted(true);
    toast.success('Tutorial completed! You\'re ready to battle!');
  };

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

  const calculateBattleResult = (): BattleResult => {
    const playerPower = playerBug.strength - (npc.bug.armor * 0.1);
    const npcPower = npc.bug.strength - (playerBug.armor * 0.1);
    
    const playerEffectivePower = Math.max(playerPower, playerBug.strength * 0.3);
    const npcEffectivePower = Math.max(npcPower, npc.bug.strength * 0.3);
    
    const winner = playerEffectivePower > npcEffectivePower ? 'player' : 'npc';
    const damage = Math.abs(playerEffectivePower - npcEffectivePower);
    
    const result: BattleResult = {
      winner,
      playerBug,
      npcBug: npc.bug,
      damage: Math.round(damage)
    };

    if (winner === 'player' && npc.isBoss) {
      result.badgeEarned = true;
    }
    
    return result;
  };

  const startBattle = async () => {
    setBattling(true);
    setBattleLog([]);
    
    const log = [
      `${playerBug.name} enters the battle!`,
      `${npc.name} sends out ${npc.bug.name}!`,
      npc.isBoss ? 'Boss battle begins!' : 'Battle begins!'
    ];
    
    for (let i = 0; i < log.length; i++) {
      setTimeout(() => {
        setBattleLog(prev => [...prev, log[i]]);
      }, i * 1000);
    }
    
    setTimeout(() => {
      const result = calculateBattleResult();
      const finalLog = result.winner === 'player' 
        ? `${playerBug.name} wins the battle!${result.badgeEarned ? ' Badge earned!' : ''}`
        : `${npc.bug.name} defeats ${playerBug.name}!`;
      
      setBattleLog(prev => [...prev, finalLog]);
      
      setTimeout(() => {
        setBattling(false);
        onBattleComplete(result);
        
        if (result.winner === 'player') {
          if (result.badgeEarned) {
            toast.success(`Victory! You defeated ${npc.name} and earned a badge!`);
          } else {
            toast.success(`Victory! You defeated ${npc.name}!`);
          }
        } else {
          toast.error(`Defeat! ${npc.name} was too strong!`);
        }
      }, 2000);
    }, 4000);
  };

  const PlayerIcon = getIcon(playerBug.icon);
  const NPCIcon = getIcon(npc.bug.icon);

  return (
    <>
      <BattleTutorial 
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
      />
      
      <div className="space-y-4">
        {isFirstBattle && tutorialCompleted && (
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg border-2 border-blue-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-blue-800">🎯 First Battle!</p>
                <p className="text-blue-600">Apply what you learned in the tutorial!</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowTutorial(true)}
                className="flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Review Tutorial
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Player Bug */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-green-600">Your Bug</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <PlayerIcon className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="font-bold">{playerBug.name}</h3>
                <p className="text-sm text-gray-600">{playerBug.type}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-1 justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>{playerBug.armor}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <Sword className="w-4 h-4 text-red-600" />
                    <span>{playerBug.strength}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <Heart className="w-4 h-4 text-pink-600" />
                    <span>{playerBug.health}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span>{playerBug.speed}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NPC Bug */}
          <Card className={`${npc.isBoss ? 'border-purple-400 bg-purple-50' : 'border-red-200'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className={npc.isBoss ? 'text-purple-600' : 'text-red-600'}>
                  {npc.name}
                </span>
                <Badge variant="outline">Level {npc.level}</Badge>
                {npc.isBoss && <Badge className="bg-purple-500">BOSS</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <NPCIcon className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="font-bold">{npc.bug.name}</h3>
                <p className="text-sm text-gray-600">{npc.bug.type}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-1 justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>{npc.bug.armor}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <Sword className="w-4 h-4 text-red-600" />
                    <span>{npc.bug.strength}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <Heart className="w-4 h-4 text-pink-600" />
                    <span>{npc.bug.health}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span>{npc.bug.speed}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Battle Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              {npc.isBoss ? 'Boss Battle Arena' : 'Battle Arena'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg min-h-32 mb-4">
              {battleLog.map((log, index) => (
                <p key={index} className="text-sm mb-1 animate-fade-in">
                  {log}
                </p>
              ))}
              {battleLog.length === 0 && (
                <p className="text-gray-500 text-center">
                  {npc.isBoss ? 'Ready for boss battle!' : 'Ready to battle!'}
                </p>
              )}
            </div>
            
            <Button 
              onClick={startBattle} 
              disabled={battling || (isFirstBattle && !tutorialCompleted)}
              className="w-full"
              size="lg"
            >
              {battling ? 'Battling...' : npc.isBoss ? 'Start Boss Battle!' : 'Start Battle!'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BattleArena;
