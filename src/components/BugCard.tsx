
import React from 'react';
import { Bug } from '../types/Game';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Sword, Heart, Zap, Leaf, Crown, Moon, Sparkles } from 'lucide-react';

interface BugCardProps {
  bug: Bug;
  onClick?: () => void;
  isSelected?: boolean;
  compact?: boolean;
}

const BugCard: React.FC<BugCardProps> = ({ bug, onClick, isSelected, compact = false }) => {
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
      case 'common': return 'from-gray-400 to-gray-600';
      case 'uncommon': return 'from-green-400 to-emerald-600';
      case 'rare': return 'from-blue-400 to-cyan-600';
      case 'legendary': return 'from-purple-400 to-pink-600';
      case 'epic': return 'from-orange-400 to-red-600';
      case 'mythical': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400';
      case 'uncommon': return 'border-green-400';
      case 'rare': return 'border-blue-400';
      case 'legendary': return 'border-purple-400';
      case 'epic': return 'border-orange-400';
      case 'mythical': return 'border-yellow-400';
      default: return 'border-gray-400';
    }
  };

  const IconComponent = getIcon(bug.icon);

  if (compact) {
    return (
      <Card 
        className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg transform ${
          isSelected ? 'ring-4 ring-yellow-400 bg-gradient-to-br from-yellow-100 to-orange-200' : 'hover:rotate-1'
        } border-3 ${getRarityBorder(bug.rarity)} rounded-xl shadow-md bg-gradient-to-br from-white to-gray-100`}
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="text-center mb-2">
            <div className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-br ${getRarityColor(bug.rarity)} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
              <IconComponent className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
            <Badge className={`bg-gradient-to-r ${getRarityColor(bug.rarity)} text-white px-2 py-1 rounded-lg font-bold text-xs shadow-md border border-white`}>
              {bug.rarity.toUpperCase()}
            </Badge>
          </div>
          
          <h3 className="font-bold text-sm mb-1 text-center text-gray-800">{bug.name}</h3>
          <p className="text-xs text-gray-600 mb-2 text-center font-medium">{bug.type}</p>
          
          <div className="grid grid-cols-2 gap-1 mb-2">
            <div className="flex items-center gap-1 bg-blue-100 p-1 rounded-lg border border-blue-300">
              <Shield className="w-3 h-3 text-blue-700" />
              <span className="font-bold text-blue-800 text-xs">{bug.armor}</span>
            </div>
            <div className="flex items-center gap-1 bg-red-100 p-1 rounded-lg border border-red-300">
              <Sword className="w-3 h-3 text-red-700" />
              <span className="font-bold text-red-800 text-xs">{bug.strength}</span>
            </div>
            <div className="flex items-center gap-1 bg-pink-100 p-1 rounded-lg border border-pink-300">
              <Heart className="w-3 h-3 text-pink-700" />
              <span className="font-bold text-pink-800 text-xs">{bug.health}</span>
            </div>
            <div className="flex items-center gap-1 bg-yellow-100 p-1 rounded-lg border border-yellow-300">
              <Zap className="w-3 h-3 text-yellow-700" />
              <span className="font-bold text-yellow-800 text-xs">{bug.speed}</span>
            </div>
          </div>
          
          {bug.level && bug.level > 1 && (
            <div className="text-center mb-2">
              <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-2 py-1 rounded-lg font-bold text-xs shadow-md border border-white">
                Level {bug.level}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-2xl transform ${
        isSelected ? 'ring-8 ring-yellow-400 bg-gradient-to-br from-yellow-100 to-orange-200 animate-pulse' : 'hover:rotate-1'
      } border-6 ${getRarityBorder(bug.rarity)} rounded-[2rem] shadow-xl bg-gradient-to-br from-white to-gray-100`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className={`w-28 h-28 mx-auto mb-4 bg-gradient-to-br ${getRarityColor(bug.rarity)} rounded-full flex items-center justify-center shadow-2xl border-6 border-white transform hover:animate-spin`}>
            <IconComponent className="w-14 h-14 text-white drop-shadow-lg" />
          </div>
          <Badge className={`bg-gradient-to-r ${getRarityColor(bug.rarity)} text-white px-4 py-2 rounded-2xl font-black text-lg shadow-lg border-2 border-white`}>
            ✨ {bug.rarity.toUpperCase()} ✨
          </Badge>
        </div>
        
        <h3 className="font-black text-2xl mb-2 text-center text-gray-800 drop-shadow-md">{bug.name}</h3>
        <p className="text-lg text-gray-600 mb-4 text-center font-bold">{bug.type}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 bg-blue-100 p-3 rounded-2xl border-4 border-blue-300 shadow-lg">
            <Shield className="w-6 h-6 text-blue-700" />
            <span className="font-black text-blue-800 text-lg">{bug.armor}</span>
          </div>
          <div className="flex items-center gap-2 bg-red-100 p-3 rounded-2xl border-4 border-red-300 shadow-lg">
            <Sword className="w-6 h-6 text-red-700" />
            <span className="font-black text-red-800 text-lg">{bug.strength}</span>
          </div>
          <div className="flex items-center gap-2 bg-pink-100 p-3 rounded-2xl border-4 border-pink-300 shadow-lg">
            <Heart className="w-6 h-6 text-pink-700" />
            <span className="font-black text-pink-800 text-lg">{bug.health}</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-100 p-3 rounded-2xl border-4 border-yellow-300 shadow-lg">
            <Zap className="w-6 h-6 text-yellow-700" />
            <span className="font-black text-yellow-800 text-lg">{bug.speed}</span>
          </div>
        </div>
        
        {bug.level && bug.level > 1 && (
          <div className="text-center mb-4">
            <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-2xl font-black text-lg shadow-lg border-2 border-white animate-bounce">
              🌟 Level {bug.level} 🌟
            </Badge>
          </div>
        )}
        
        <p className="text-sm text-gray-600 text-center font-medium bg-gray-100 p-3 rounded-2xl border-2 border-gray-300">{bug.description}</p>
      </CardContent>
    </Card>
  );
};

export default BugCard;
