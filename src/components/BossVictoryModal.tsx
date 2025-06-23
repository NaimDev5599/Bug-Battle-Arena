
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Trophy, Sparkles } from 'lucide-react';

interface BossVictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bossName: string;
  badgesEarned: number;
}

const BossVictoryModal: React.FC<BossVictoryModalProps> = ({ 
  isOpen, 
  onClose, 
  bossName, 
  badgesEarned 
}) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
      // Auto close after celebration
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-8 border-yellow-400 rounded-3xl bg-gradient-to-br from-yellow-100 via-orange-200 to-red-200 max-w-lg">
        <div className="text-center p-6">
          <div className={`${showAnimation ? 'animate-bounce' : ''} mb-6`}>
            <Crown className="w-24 h-24 text-yellow-600 mx-auto mb-4" />
            <div className="text-6xl mb-4">🎊</div>
          </div>
          
          <h2 className="text-4xl font-black text-yellow-800 mb-4 drop-shadow-lg">
            🏆 BOSS DEFEATED! 🏆
          </h2>
          
          <div className="bg-gradient-to-r from-purple-200 to-pink-200 p-6 rounded-2xl border-4 border-purple-400 mb-6">
            <p className="text-2xl font-black text-purple-800 mb-2">
              You defeated {bossName}!
            </p>
            <div className="flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <span className="text-xl font-black text-yellow-700">
                Badge #{badgesEarned} Earned!
              </span>
              <Sparkles className="w-8 h-8 text-pink-500" />
            </div>
          </div>

          <div className="text-lg text-orange-700 font-bold mb-6">
            🌟 You are one step closer to becoming the Ultimate Champion! 🌟
          </div>

          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-xl px-8 py-4 rounded-2xl transform hover:scale-110 transition-all shadow-xl"
          >
            ✨ Continue Adventure ✨
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BossVictoryModal;
