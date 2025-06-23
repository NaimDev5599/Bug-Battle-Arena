
import React from 'react';
import { Bug } from '../types/Game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Coins, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';
import { getRarityMultiplier } from '@/utils/bugSorting';

interface BugReleaseProps {
  bugs: Bug[];
  onRelease: (bug: Bug, points: number) => void;
  playerLevel: number;
}

const BugRelease: React.FC<BugReleaseProps> = ({ bugs, onRelease, playerLevel }) => {
  const getReleasePoints = (bug: Bug): number => {
    const basePoints = {
      common: 10,
      uncommon: 25,
      rare: 50,
      legendary: 100,
      epic: 200,
      mythical: 500
    }[bug.rarity];
    
    const levelBonus = (bug.level || 1) * 5;
    const playerBonus = Math.floor(playerLevel * 2);
    
    // Apply 3x multiplier as mentioned in Index.tsx
    return (basePoints + levelBonus + playerBonus) * 3;
  };

  const handleRelease = (bug: Bug) => {
    const points = getReleasePoints(bug);
    onRelease(bug, points);
    toast.success(`Released ${bug.name} and earned ${points} points!`, {
      description: `+${points} points added to your total!`,
      duration: 1000
    });
  };

  if (bugs.length === 0) {
    return (
      <Card className="border-8 border-orange-400 rounded-[2rem] shadow-2xl bg-gradient-to-br from-orange-100 to-yellow-200">
        <CardContent className="text-center py-16">
          <div className="text-8xl mb-6">🐛</div>
          <p className="text-3xl text-orange-700 font-black">🌟 No bugs available to release! 🌟</p>
          <p className="text-xl text-orange-600 font-bold mt-4">🎣 Go catch some bugs first!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-8 border-orange-400 rounded-[2rem] shadow-2xl bg-gradient-to-br from-orange-100 to-yellow-200">
      <CardHeader className="bg-gradient-to-r from-orange-200 to-yellow-300 rounded-t-[2rem] border-b-4 border-orange-400">
        <CardTitle className="flex items-center gap-3 text-3xl text-orange-800 font-black">
          <ArrowUp className="w-8 h-8" />
          🆓 Release Bugs for Points! 🆓
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="bg-gradient-to-r from-blue-200 to-purple-200 p-6 rounded-[1.5rem] mb-8 border-4 border-blue-300 shadow-lg">
          <p className="text-2xl text-blue-800 font-black text-center">
            💰 Release bugs to earn points for leveling up! 💰
          </p>
          <p className="text-lg text-blue-700 font-bold text-center mt-2">
            💎 Higher rarity = More points! 💎
          </p>
        </div>
        
        <div className="space-y-6">
          {bugs.map((bug) => {
            const pointsToEarn = getReleasePoints(bug);
            return (
              <div key={bug.id} className="flex items-center justify-between p-6 border-6 rounded-[1.5rem] bg-gradient-to-r from-white to-yellow-50 border-yellow-300 shadow-xl transform hover:scale-105 transition-all">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-black text-gray-800">{bug.name}</div>
                  <Badge className={`text-lg px-4 py-2 font-black ${
                    bug.rarity === 'common' ? 'bg-gray-500' :
                    bug.rarity === 'uncommon' ? 'bg-green-500' :
                    bug.rarity === 'rare' ? 'bg-blue-500' : 
                    bug.rarity === 'legendary' ? 'bg-purple-500' :
                    bug.rarity === 'epic' ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}>
                    {bug.rarity}
                  </Badge>
                  {bug.level && bug.level > 1 && (
                    <Badge variant="outline" className="text-lg px-4 py-2 font-bold border-2">Level {bug.level}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-yellow-700 bg-gradient-to-r from-yellow-200 to-orange-200 px-6 py-3 rounded-[1.5rem] border-4 border-yellow-400 shadow-lg">
                    <Coins className="w-6 h-6" />
                    <span className="font-black text-2xl">{pointsToEarn}</span>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="lg" className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-none rounded-[1.5rem] font-black text-lg px-6 py-3 transform hover:scale-110 transition-all shadow-xl">
                        🆓 Release
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-4 border-red-300 rounded-[1.5rem]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black text-red-800">
                          🚨 Are you sure you want to release {bug.name}? 🚨
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-lg font-bold text-red-700">
                          This action cannot be undone. You will receive <strong className="text-2xl text-green-600">{pointsToEarn} points</strong> for releasing this bug.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="font-bold">❌ Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleRelease(bug)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-black"
                        >
                          ✅ Yes, Release for {pointsToEarn} Points
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BugRelease;
