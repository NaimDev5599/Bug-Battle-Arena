
import React, { useState } from 'react';
import { Bug, GameState } from '../types/Game';
import { availableBugs } from '../data/bugs';
import BugEncounter from './BugEncounter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, Sword, Heart, Zap, Leaf, Crown, Moon, Sparkles, PartyPopper, X } from 'lucide-react';
import { toast } from 'sonner';

interface BugCatcherProps {
  onBugCaught: (bug: Bug) => void;
  playerLevel: number;
  upgrades?: GameState['upgrades'];
}

const BugCatcher: React.FC<BugCatcherProps> = ({ 
  onBugCaught, 
  playerLevel, 
  upgrades = { catchChance: 0, rareBugLuck: 0, bugStrength: 0 }
}) => {
  const [searching, setSearching] = useState(false);
  const [encounteredBugs, setEncounteredBugs] = useState<Bug[]>([]);
  const [showEncounter, setShowEncounter] = useState(false);
  const [attempting, setAttempting] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showFailAnimation, setShowFailAnimation] = useState(false);
  const [lastCaughtBug, setLastCaughtBug] = useState<Bug | null>(null);

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

  const getRarityRates = () => {
    const luckBonus = upgrades.rareBugLuck * 0.5;
    
    return {
      common: Math.max(85 - luckBonus * 2, 70),
      uncommon: 13,
      rare: Math.min(1.8 + luckBonus, 6),
      legendary: Math.min(0.2 + luckBonus * 0.5, 2)
    };
  };

  const generateBugByRarity = () => {
    const rarityWeights = getRarityRates();
    
    const totalWeight = Object.values(rarityWeights).reduce((sum, weight) => sum + weight, 0);
    const random = Math.random() * totalWeight;
    
    let currentWeight = 0;
    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      currentWeight += weight;
      if (random <= currentWeight) {
        const bugsOfRarity = availableBugs.filter(bug => bug.rarity === rarity);
        return bugsOfRarity[Math.floor(Math.random() * bugsOfRarity.length)];
      }
    }
    
    return availableBugs.filter(bug => bug.rarity === 'common')[0];
  };

  const searchForBugs = async () => {
    setSearching(true);
    setShowEncounter(false);

    setTimeout(() => {
      const selectedBugs = Array.from({ length: 3 }, () => generateBugByRarity());
      
      setEncounteredBugs(selectedBugs);
      setSearching(false);
      setShowEncounter(true);
    }, 2000);
  };

  const continueSearch = () => {
    searchForBugs();
  };

  const attemptCatch = async (selectedBug: Bug) => {
    setAttempting(true);
    
    // Calculate catch rate with upgrades
    const baseRate = {
      common: 80,
      uncommon: 60,
      rare: 40,
      legendary: 20
    }[selectedBug.rarity];
    
    const levelBonus = Math.min(playerLevel * 5, 30);
    const upgradeBonus = upgrades.catchChance * 5;
    const catchRate = Math.min(baseRate + levelBonus + upgradeBonus, 95);
    
    setTimeout(() => {
      const success = Math.random() * 100 < catchRate;
      
      if (success) {
        const enhancedBug = {
          ...selectedBug,
          strength: Math.floor(selectedBug.strength * (1 + upgrades.bugStrength * 0.1))
        };
        onBugCaught({ ...enhancedBug, id: `${enhancedBug.id}-${Date.now()}` });
        setLastCaughtBug(enhancedBug);
        setShowSuccessAnimation(true);
        toast.success(`🎉 Successfully caught ${selectedBug.name}! 🎉`, {
          description: `Amazing! ${selectedBug.name} joined your collection!`
        });
        
        setTimeout(() => setShowSuccessAnimation(false), 3000);
      } else {
        setShowFailAnimation(true);
        toast.error(`💨 ${selectedBug.name} escaped! Try again! 💨`, {
          description: `Don't give up! Level up for better catch rates!`
        });
        
        setTimeout(() => setShowFailAnimation(false), 3000);
      }
      
      setAttempting(false);
      setShowEncounter(false);
      setEncounteredBugs([]);
    }, 1000);
  };

  if (showEncounter && !attempting) {
    return (
      <Card className="border-8 border-cyan-400 rounded-[2rem] shadow-2xl bg-gradient-to-br from-cyan-100 to-blue-200">
        <CardHeader className="bg-gradient-to-r from-cyan-200 to-blue-300 rounded-t-[2rem] border-b-4 border-cyan-400">
          <CardTitle className="text-3xl font-black text-cyan-800">🔍 Bug Encounter! 🔍</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <BugEncounter 
            bugs={encounteredBugs}
            onSelect={attemptCatch}
            onContinueSearch={continueSearch}
            playerLevel={playerLevel}
          />
        </CardContent>
      </Card>
    );
  }

  const rarityRates = getRarityRates();

  return (
    <div className="relative">
      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-gradient-to-r from-green-300 to-emerald-400 p-12 rounded-[3rem] border-8 border-green-500 shadow-2xl animate-scale-in text-center">
            <PartyPopper className="w-24 h-24 text-green-800 mx-auto mb-6 animate-bounce" />
            <h2 className="text-6xl font-black text-green-900 mb-4">🎉 SUCCESS! 🎉</h2>
            <p className="text-3xl font-bold text-green-800 mb-4">
              You caught {lastCaughtBug?.name}!
            </p>
            <div className="text-8xl animate-pulse">✨🐛✨</div>
          </div>
        </div>
      )}

      {/* Failure Animation Overlay */}
      {showFailAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-gradient-to-r from-red-300 to-pink-400 p-12 rounded-[3rem] border-8 border-red-500 shadow-2xl animate-scale-in text-center">
            <X className="w-24 h-24 text-red-800 mx-auto mb-6 animate-bounce" />
            <h2 className="text-6xl font-black text-red-900 mb-4">💨 ESCAPED! 💨</h2>
            <p className="text-3xl font-bold text-red-800 mb-4">
              The bug got away!
            </p>
            <div className="text-8xl animate-pulse">😅💔</div>
          </div>
        </div>
      )}

      <Card className="border-8 border-rainbow-400 rounded-[2rem] shadow-2xl bg-gradient-to-br from-rainbow-100 via-pink-200 to-yellow-200">
        <CardHeader className="bg-gradient-to-r from-rainbow-200 via-pink-300 to-yellow-300 rounded-t-[2rem] border-b-8 border-rainbow-400">
          <CardTitle className="text-4xl font-black text-center text-purple-900">
            🎪✨ SUPER BUG HUNTER ARENA ✨🎪
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 space-y-8">
          <div className="text-center">
            <p className="text-2xl text-purple-800 font-black mb-4">
              🌟 Search the magical wilderness for amazing bugs! 🌟
            </p>
            <p className="text-xl text-purple-700 font-bold">
              🎯 You'll encounter 3 incredible bugs and can choose one to catch! 🎯
            </p>
          </div>
          
          {/* Available Bugs Preview - Much Bigger and More Colorful */}
          <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 p-8 rounded-[2rem] border-8 border-blue-400 shadow-2xl">
            <h4 className="font-black mb-6 text-blue-900 text-center text-3xl">🔍 Amazing Bugs You Might Discover! 🔍</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {availableBugs.slice(0, 12).map((bug) => {
                const IconComponent = getIcon(bug.icon);
                return (
                  <div key={bug.id} className="flex flex-col items-center gap-3 bg-white p-6 rounded-[1.5rem] border-4 border-gray-300 shadow-xl transform hover:scale-110 transition-all hover:shadow-2xl">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br shadow-xl border-4 ${
                      bug.rarity === 'common' ? 'from-gray-400 to-gray-600 border-gray-500' :
                      bug.rarity === 'uncommon' ? 'from-green-400 to-emerald-600 border-green-500' :
                      bug.rarity === 'rare' ? 'from-blue-400 to-cyan-600 border-blue-500' : 'from-purple-400 to-pink-600 border-purple-500'
                    }`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-gray-800 mb-2">{bug.name}</p>
                      <Badge className={`text-sm font-bold px-3 py-1 ${
                        bug.rarity === 'common' ? 'bg-gray-500' :
                        bug.rarity === 'uncommon' ? 'bg-green-500' :
                        bug.rarity === 'rare' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}>
                        {bug.rarity}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {searching && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="text-3xl text-blue-800 font-black animate-pulse">
                  🔍 Searching for magical bugs... ✨
                </p>
              </div>
            </div>
          )}
          
          <div className="bg-gradient-to-r from-blue-200 to-purple-200 p-8 rounded-[2rem] border-6 border-blue-400 shadow-xl space-y-4">
            <h4 className="text-2xl font-black text-blue-900 text-center">📊 Your Bug Hunter Stats 📊</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-[1.5rem] border-4 border-blue-300 text-center shadow-lg">
                <p className="text-lg font-black text-blue-800">🎯 Level</p>
                <p className="text-3xl font-black text-blue-900">{playerLevel}</p>
              </div>
              <div className="bg-white p-4 rounded-[1.5rem] border-4 border-green-300 text-center shadow-lg">
                <p className="text-lg font-black text-green-800">📈 Catch Bonus</p>
                <p className="text-3xl font-black text-green-900">+{Math.min(playerLevel * 5, 30) + upgrades.catchChance * 5}%</p>
              </div>
              <div className="bg-white p-4 rounded-[1.5rem] border-4 border-purple-300 text-center shadow-lg">
                <p className="text-lg font-black text-purple-800">🍀 Luck Boost</p>
                <p className="text-3xl font-black text-purple-900">+{upgrades.rareBugLuck * 10}%</p>
              </div>
              <div className="bg-white p-4 rounded-[1.5rem] border-4 border-red-300 text-center shadow-lg">
                <p className="text-lg font-black text-red-800">💪 Power Boost</p>
                <p className="text-3xl font-black text-red-900">+{upgrades.bugStrength * 10}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-200 to-orange-200 p-8 rounded-[2rem] border-6 border-yellow-400 shadow-xl">
            <h4 className="font-black mb-6 text-yellow-900 text-center text-2xl">🎲 Bug Rarity Encounter Rates 🎲</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-[1.5rem] border-4 border-gray-300 shadow-lg">
                <Badge className="bg-gray-500 text-white text-lg px-4 py-2">Common</Badge>
                <span className="font-black text-2xl text-gray-800">{rarityRates.common.toFixed(1)}%</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-[1.5rem] border-4 border-green-300 shadow-lg">
                <Badge className="bg-green-500 text-white text-lg px-4 py-2">Uncommon</Badge>
                <span className="font-black text-2xl text-green-800">{rarityRates.uncommon.toFixed(1)}%</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-[1.5rem] border-4 border-blue-300 shadow-lg">
                <Badge className="bg-blue-500 text-white text-lg px-4 py-2">Rare</Badge>
                <span className="font-black text-2xl text-blue-800">{rarityRates.rare.toFixed(1)}%</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-[1.5rem] border-4 border-purple-300 shadow-lg">
                <Badge className="bg-purple-500 text-white text-lg px-4 py-2">Legendary</Badge>
                <span className="font-black text-2xl text-purple-800">{rarityRates.legendary.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={searchForBugs} 
            disabled={searching || attempting}
            className="w-full h-20 text-3xl font-black bg-gradient-to-r from-rainbow-500 via-pink-600 to-yellow-600 hover:from-rainbow-600 hover:via-pink-700 hover:to-yellow-700 rounded-[2rem] border-8 border-rainbow-300 shadow-2xl transform hover:scale-105 transition-all animate-pulse"
            size="lg"
          >
            {searching ? '🔍 Searching for Magic Bugs... ✨' : '🎪 START EPIC BUG HUNT! 🎪'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BugCatcher;
