
import React, { useState } from 'react';
import { Bug, NPC, BattleResult, BattleAction, BattleTurn } from '../types/Game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Sword, Heart, Zap, Leaf, Crown, Moon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import BattleGuide from './BattleGuide';
import BossVictoryModal from './BossVictoryModal';

interface TacticalBattleArenaProps {
  playerBug: Bug;
  npc: NPC;
  onBattleComplete: (result: BattleResult) => void;
}

const TacticalBattleArena: React.FC<TacticalBattleArenaProps> = ({ 
  playerBug, 
  npc, 
  onBattleComplete 
}) => {
  const [battling, setBattling] = useState(false);
  const [battleTurns, setBattleTurns] = useState<BattleTurn[]>([]);
  const [playerHealth, setPlayerHealth] = useState(playerBug.health);
  const [npcHealth, setNPCHealth] = useState(npc.bug.health);
  const [playerStunned, setPlayerStunned] = useState(false);
  const [npcStunned, setNPCStunned] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [battleAnimation, setBattleAnimation] = useState('');
  const [showBossVictory, setShowBossVictory] = useState(false);
  const [playerAction, setPlayerAction] = useState<BattleAction | null>(null);
  const [npcAction, setNPCAction] = useState<BattleAction | null>(null);

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

  const getActionIcon = (action: BattleAction) => {
    switch (action) {
      case 'attack': return <Sword className="w-6 h-6 text-red-500" />;
      case 'defense': return <Shield className="w-6 h-6 text-blue-500" />;
      case 'speed': return <Zap className="w-6 h-6 text-yellow-500" />;
    }
  };

  const highlightPlayerBug = (text: string): JSX.Element => {
    const highlightedText = text.replace(
      new RegExp(playerBug.name, 'g'),
      `**${playerBug.name}**`
    );
    
    const parts = highlightedText.split('**');
    
    return (
      <>
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            return (
              <span key={index} className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-2 py-1 rounded-lg font-black border-2 border-blue-300">
                🐛 {part} 🐛
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  };

  const resetBattle = () => {
    setPlayerHealth(playerBug.health);
    setNPCHealth(npc.bug.health);
    setPlayerStunned(false);
    setNPCStunned(false);
    setBattleTurns([]);
    setCurrentTurn(1);
    setBattling(false);
    setBattleAnimation('');
    setPlayerAction(null);
    setNPCAction(null);
  };

  const getNPCAction = (): BattleAction => {
    const actions: BattleAction[] = ['attack', 'defense', 'speed'];
    
    if (npc.isBoss) {
      if (Math.random() < 0.3) {
        return actions[Math.floor(Math.random() * actions.length)];
      }
    }
    
    return actions[Math.floor(Math.random() * actions.length)];
  };

  const processTurn = (selectedPlayerAction: BattleAction) => {
    if (battling) return;
    
    setBattling(true);
    const selectedNPCAction = getNPCAction();
    setPlayerAction(selectedPlayerAction);
    setNPCAction(selectedNPCAction);
    setBattleAnimation('animate-pulse');
    
    setTimeout(() => {
      let result = '';
      let newPlayerHealth = playerHealth;
      let newNPCHealth = npcHealth;
      let newPlayerStunned = false;
      let newNPCStunned = false;

      const npcDamageMultiplier = npc.isBoss ? 0.8 : 1.0;

      if (playerStunned) {
        result = `${playerBug.name} is stunned and cannot act! `;
        newPlayerStunned = false;
        
        if (selectedNPCAction === 'attack') {
          const damage = Math.max(npc.bug.strength - playerBug.armor * 0.1, npc.bug.strength * 0.3) * npcDamageMultiplier;
          newPlayerHealth = Math.max(0, playerHealth - Math.round(damage));
          result += `${npc.bug.name} attacks for ${Math.round(damage)} damage!`;
          setBattleAnimation('animate-bounce');
        } else if (selectedNPCAction === 'defense') {
          result += `${npc.bug.name} strengthens its defense!`;
        } else {
          result += `${npc.bug.name} increases its speed!`;
        }
      } else if (npcStunned) {
        result = `${npc.bug.name} is stunned and cannot act! `;
        newNPCStunned = false;
        
        if (selectedPlayerAction === 'attack') {
          const damage = Math.max(playerBug.strength - npc.bug.armor * 0.1, playerBug.strength * 0.3);
          newNPCHealth = Math.max(0, npcHealth - Math.round(damage));
          result += `${playerBug.name} attacks for ${Math.round(damage)} damage!`;
          setBattleAnimation('animate-bounce');
        }
      } else {
        if (selectedPlayerAction === 'attack' && selectedNPCAction === 'attack') {
          setBattleAnimation('animate-ping');
          const playerDamage = Math.max(playerBug.strength - npc.bug.armor * 0.1, playerBug.strength * 0.3);
          const npcDamage = Math.max(npc.bug.strength - playerBug.armor * 0.1, npc.bug.strength * 0.3) * npcDamageMultiplier;
          newPlayerHealth = Math.max(0, playerHealth - Math.round(npcDamage));
          newNPCHealth = Math.max(0, npcHealth - Math.round(playerDamage));
          result = `Both bugs clash! Each takes damage!`;
        }
        else if (selectedPlayerAction === 'defense' && selectedNPCAction === 'attack') {
          newNPCStunned = true;
          const counterDamage = Math.max(playerBug.strength - npc.bug.armor * 0.1, playerBug.strength * 0.3);
          newNPCHealth = Math.max(0, npcHealth - Math.round(counterDamage));
          result = `${playerBug.name} blocks the attack and counter-attacks for ${Math.round(counterDamage)} damage! ${npc.bug.name} is stunned!`;
          setBattleAnimation('animate-spin');
        }
        else if (selectedPlayerAction === 'attack' && selectedNPCAction === 'defense') {
          if (npc.bug.armor >= playerBug.strength) {
            newPlayerStunned = true;
            result = `${npc.bug.name}'s armor blocks the attack and stuns ${playerBug.name}!`;
            setBattleAnimation('animate-spin');
          } else {
            result = `${npc.bug.name} blocks the attack!`;
          }
        }
        else if (selectedPlayerAction === 'speed' && selectedNPCAction === 'defense') {
          newNPCStunned = true;
          result = `${playerBug.name} dodges and stuns ${npc.bug.name}!`;
          setBattleAnimation('animate-bounce');
        }
        else if (selectedPlayerAction === 'defense' && selectedNPCAction === 'speed') {
          newPlayerStunned = true;
          result = `${npc.bug.name} dodges and stuns ${playerBug.name}!`;
          setBattleAnimation('animate-bounce');
        }
        else if (selectedPlayerAction === 'attack' && selectedNPCAction === 'speed') {
          const damage = Math.max(playerBug.strength - npc.bug.armor * 0.1, playerBug.strength * 0.3);
          newNPCHealth = Math.max(0, npcHealth - Math.round(damage));
          result = `${npc.bug.name} is too slow! Takes ${Math.round(damage)} damage!`;
          setBattleAnimation('animate-pulse');
        }
        else if (selectedPlayerAction === 'speed' && selectedNPCAction === 'attack') {
          const damage = Math.max(npc.bug.strength - playerBug.armor * 0.1, npc.bug.strength * 0.3) * npcDamageMultiplier;
          newPlayerHealth = Math.max(0, playerHealth - Math.round(damage));
          result = `${playerBug.name} is too slow! Takes ${Math.round(damage)} damage!`;
          setBattleAnimation('animate-pulse');
        }
        else if (selectedPlayerAction === selectedNPCAction) {
          result = `Both bugs use the same strategy! Nothing happens!`;
        }
      }

      const turn: BattleTurn = {
        playerAction: selectedPlayerAction,
        npcAction: selectedNPCAction,
        result,
        playerHealth: newPlayerHealth,
        npcHealth: newNPCHealth,
        playerStunned: newPlayerStunned,
        npcStunned: newNPCStunned
      };

      setBattleTurns(prev => [...prev, turn]);
      setPlayerHealth(newPlayerHealth);
      setNPCHealth(newNPCHealth);
      setPlayerStunned(newPlayerStunned);
      setNPCStunned(newNPCStunned);
      setCurrentTurn(prev => prev + 1);

      setTimeout(() => setBattleAnimation(''), 1000);

      if (newPlayerHealth <= 0 || newNPCHealth <= 0) {
        const winner = newPlayerHealth > 0 ? 'player' : 'npc';
        const trophiesEarned = winner === 'player' ? npc.level : 0;
        const isBossWin = winner === 'player' && npc.isBoss;
        
        setTimeout(() => {
          if (isBossWin) {
            setShowBossVictory(true);
          }
          
          onBattleComplete({
            winner,
            playerBug,
            npcBug: npc.bug,
            damage: 0,
            trophiesEarned,
            badgeEarned: isBossWin
          });
          
          if (winner === 'player') {
            if (!isBossWin) {
              toast.success(`Victory! Earned ${trophiesEarned} trophies!`);
            }
          } else {
            toast.error('Defeat! Better luck next time!');
          }
          
          resetBattle();
        }, 2000);
      } else {
        setBattling(false);
        setPlayerAction(null);
        setNPCAction(null);
      }
    }, 1500);
  };

  const PlayerIcon = getIcon(playerBug.icon);
  const NPCIcon = getIcon(npc.bug.icon);

  return (
    <>
      <BossVictoryModal 
        isOpen={showBossVictory}
        onClose={() => setShowBossVictory(false)}
        bossName={npc.name}
        badgesEarned={1}
      />
      
      <div className={`space-y-4 p-2 sm:p-6 bg-gradient-to-br ${npc.isBoss ? 'from-purple-100 to-pink-200' : 'from-blue-50 to-purple-50'} rounded-2xl border-4 ${npc.isBoss ? 'border-purple-400' : 'border-blue-300'} shadow-2xl`}>
        
        <BattleGuide />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Player Bug */}
          <Card className={`border-4 border-green-400 rounded-2xl shadow-xl transform transition-all ${playerStunned ? 'bg-red-200 rotate-1' : 'hover:scale-105'} ${battleAnimation}`}>
            <CardHeader className="bg-gradient-to-r from-green-200 to-emerald-300 rounded-t-2xl border-b-4 border-green-400 p-3">
              <CardTitle className="flex items-center gap-2 text-green-800 font-black text-lg">
                <span>🐛 Your Bug</span>
                {playerStunned && <Badge variant="destructive" className="animate-bounce text-sm px-2 py-1">😵 Stunned</Badge>}
                {playerAction && (
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded">
                    {getActionIcon(playerAction)}
                    <span className="text-sm font-bold">{playerAction}</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-3 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full flex items-center justify-center shadow-xl border-4 border-green-500">
                  <PlayerIcon className="w-10 h-10 sm:w-16 sm:h-16 text-green-800" />
                </div>
                <h3 className="font-black text-lg sm:text-xl text-green-900 mb-2">{playerBug.name}</h3>
                <p className="text-sm text-green-700 mb-3 font-bold">{playerBug.type}</p>
                
                {/* Health Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="font-black text-lg">{playerHealth}/{playerBug.health}</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-3 border-2 border-gray-400">
                    <div 
                      className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(playerHealth / playerBug.health) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-200 p-2 rounded-xl border-2 border-blue-300 shadow-lg">
                    <Shield className="w-4 h-4 text-blue-700 mx-auto mb-1" />
                    <div className="text-xs font-bold text-blue-700">Def</div>
                    <div className="font-black text-blue-900 text-sm">{playerBug.armor}</div>
                  </div>
                  <div className="bg-red-200 p-2 rounded-xl border-2 border-red-300 shadow-lg">
                    <Sword className="w-4 h-4 text-red-700 mx-auto mb-1" />
                    <div className="text-xs font-bold text-red-700">Att</div>
                    <div className="font-black text-red-900 text-sm">{playerBug.strength}</div>
                  </div>
                  <div className="bg-yellow-200 p-2 rounded-xl border-2 border-yellow-300 shadow-lg">
                    <Zap className="w-4 h-4 text-yellow-700 mx-auto mb-1" />
                    <div className="text-xs font-bold text-yellow-700">Spd</div>
                    <div className="font-black text-yellow-900 text-sm">{playerBug.speed}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NPC Bug */}
          <Card className={`border-4 ${npc.isBoss ? 'border-purple-400 bg-gradient-to-br from-purple-100 to-pink-200' : 'border-red-400'} rounded-2xl shadow-xl transform transition-all ${npcStunned ? 'bg-red-200 -rotate-1' : 'hover:scale-105'} ${battleAnimation}`}>
            <CardHeader className={`bg-gradient-to-r ${npc.isBoss ? 'from-purple-200 to-pink-300 border-b-4 border-purple-400' : 'from-red-200 to-pink-200 border-b-4 border-red-400'} rounded-t-2xl p-3`}>
              <CardTitle className={`flex items-center gap-2 ${npc.isBoss ? 'text-purple-800' : 'text-red-800'} font-black text-lg`}>
                <span>{npc.isBoss ? '👑' : '🎯'} {npc.name}</span>
                <Badge variant="outline" className="bg-white text-sm px-2 py-1 font-bold">Lv{npc.level}</Badge>
                {npc.isBoss && <Badge className="bg-purple-600 text-white text-sm px-2 py-1 animate-pulse">BOSS</Badge>}
                {npcStunned && <Badge variant="destructive" className="animate-bounce text-sm px-2 py-1">😵 Stunned</Badge>}
                {npcAction && (
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded">
                    {getActionIcon(npcAction)}
                    <span className="text-sm font-bold">{npcAction}</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-center">
                <div className={`w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-3 bg-gradient-to-br ${npc.isBoss ? '  from-purple-300 to-pink-400 border-4 border-purple-500' : 'from-red-300 to-pink-400 border-4 border-red-500'} rounded-full flex items-center justify-center shadow-xl`}>
                  <NPCIcon className={`w-10 h-10 sm:w-16 sm:h-16 ${npc.isBoss ? 'text-purple-800' : 'text-red-800'}`} />
                </div>
                <h3 className={`font-black text-lg sm:text-xl ${npc.isBoss ? 'text-purple-900' : 'text-red-900'} mb-2`}>{npc.bug.name}</h3>
                <p className={`text-sm ${npc.isBoss ? 'text-purple-700' : 'text-red-700'} mb-3 font-bold`}>{npc.bug.type}</p>
                
                {/* Health Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="font-black text-lg">{npcHealth}/{npc.bug.health}</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-3 border-2 border-gray-400">
                    <div 
                      className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(npcHealth / npc.bug.health) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-200 p-2 rounded-xl border-2 border-blue-300 shadow-lg">
                    <Shield className="w-4 h-4 text-blue-700 mx-auto mb-1" />
                    <div className="text-xs font-bold text-blue-700">Def</div>
                    <div className="font-black text-blue-900 text-sm">{npc.bug.armor}</div>
                  </div>
                  <div className="bg-red-200 p-2 rounded-xl border-2 border-red-300 shadow-lg">
                    <Sword className="w-4 h-4 text-red-700 mx-auto mb-1" />
                    <div className="text-xs font-bold text-red-700">Att</div>
                    <div className="font-black text-red-900 text-sm">{npc.bug.strength}</div>
                  </div>
                  <div className="bg-yellow-200 p-2 rounded-xl border-2 border-yellow-300 shadow-lg">
                    <Zap className="w-4 h-4 text-yellow-700 mx-auto mb-1" />
                    <div className="text-xs font-bold text-yellow-700">Spd</div>
                    <div className="font-black text-yellow-900 text-sm">{npc.bug.speed}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Battle Actions */}
        <Card className={`border-4 ${npc.isBoss ? 'border-purple-400 bg-gradient-to-r from-purple-100 to-pink-200' : 'border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50'} rounded-2xl shadow-xl`}>
          <CardHeader className={`bg-gradient-to-r ${npc.isBoss ? 'from-purple-200 to-pink-300 border-b-4 border-purple-400' : 'from-purple-100 to-pink-100 border-b-4 border-purple-300'} rounded-t-2xl p-3`}>
            <CardTitle className={`text-center text-xl sm:text-2xl ${npc.isBoss ? 'text-purple-800' : 'text-purple-700'} font-black`}>
              {npc.isBoss ? '👑 BOSS BATTLE' : '⚔️ BATTLE ARENA'} - Turn {currentTurn}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <Button 
                onClick={() => processTurn('attack')}
                disabled={battling || playerHealth <= 0 || npcHealth <= 0}
                className="flex flex-col items-center gap-2 h-16 sm:h-20 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-2xl text-white transform hover:scale-105 transition-all shadow-xl border-4 border-red-300 text-lg font-black"
              >
                <Sword className="w-6 h-6" />
                <span>⚔️ ATTACK</span>
              </Button>
              <Button 
                onClick={() => processTurn('defense')}
                disabled={battling || playerHealth <= 0 || npcHealth <= 0}
                className="flex flex-col items-center gap-2 h-16 sm:h-20 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-2xl text-white transform hover:scale-105 transition-all shadow-xl border-4 border-blue-300 text-lg font-black"
              >
                <Shield className="w-6 h-6" />
                <span>🛡️ DEFEND</span>
              </Button>
              <Button 
                onClick={() => processTurn('speed')}
                disabled={battling || playerHealth <= 0 || npcHealth <= 0}
                className="flex flex-col items-center gap-2 h-16 sm:h-20 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 rounded-2xl text-white transform hover:scale-105 transition-all shadow-xl border-4 border-yellow-300 text-lg font-black"
              >
                <Zap className="w-6 h-6" />
                <span>⚡ SPEED</span>
              </Button>
            </div>
            
            {/* Battle Log */}
            <div className="bg-white p-4 rounded-2xl min-h-32 border-4 border-purple-300 shadow-inner">
              <h4 className="font-black text-purple-800 mb-3 text-center text-lg">📜 Battle Log 📜</h4>
              {battleTurns.slice(-2).map((turn, index) => (
                <p key={index} className="text-sm sm:text-base mb-2 p-3 bg-purple-100 rounded-xl animate-fade-in border-2 border-purple-200 font-bold">
                  <strong className="text-purple-700">Turn {battleTurns.length - 1 + index}:</strong> {highlightPlayerBug(turn.result)}
                </p>
              ))}
              {battleTurns.length === 0 && (
                <p className="text-gray-600 text-center italic text-lg">
                  {npc.isBoss ? '👑 Choose your move against this boss! 👑' : '🎮 Choose your action to battle! 🎮'}
                </p>
              )}
            </div>
            
            {(playerHealth <= 0 || npcHealth <= 0) && (
              <Button onClick={resetBattle} className="w-full mt-4 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl text-white font-black text-lg transform hover:scale-105 transition-all shadow-xl border-4 border-green-300">
                🎯 New Battle 🎯
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TacticalBattleArena;
