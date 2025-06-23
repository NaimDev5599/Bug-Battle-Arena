
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronRight, ChevronLeft, Zap, Shield, Sword, Heart } from 'lucide-react';

interface BattleTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const BattleTutorial: React.FC<BattleTutorialProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to Bug Battle Arena! 🎮",
      content: (
        <div className="space-y-4">
          <p className="text-lg">Let's learn how to battle with your bugs!</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold text-blue-800">🎯 Your Goal:</p>
            <p className="text-blue-700">Defeat NPCs to earn trophies and advance to the next level!</p>
          </div>
        </div>
      )
    },
    {
      title: "Understanding Bug Stats 📊",
      content: (
        <div className="space-y-4">
          <p>Each bug has 4 important stats that determine battle outcomes:</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-blue-100 p-3 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-800">Armor</p>
                <p className="text-sm text-blue-600">Reduces incoming damage</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-red-100 p-3 rounded-lg">
              <Sword className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-800">Strength</p>
                <p className="text-sm text-red-600">Determines attack power</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-pink-100 p-3 rounded-lg">
              <Heart className="w-5 h-5 text-pink-600" />
              <div>
                <p className="font-semibold text-pink-800">Health</p>
                <p className="text-sm text-pink-600">Bug's vitality (not used in battle calc)</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-yellow-100 p-3 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-800">Speed</p>
                <p className="text-sm text-yellow-600">Determines turn order</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "How Battle Works ⚔️",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold text-green-800 mb-2">🏆 Battle Formula:</p>
            <p className="text-green-700">Your Power = Strength - (Enemy Armor × 0.1)</p>
            <p className="text-green-700">Enemy Power = Enemy Strength - (Your Armor × 0.1)</p>
            <p className="text-green-700 font-semibold mt-2">Higher power wins!</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="font-semibold text-yellow-800">💡 Strategy Tip:</p>
            <p className="text-yellow-700">Balance strength for offense and armor for defense!</p>
          </div>
        </div>
      )
    },
    {
      title: "Level Up & Progression 🌟",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="font-semibold text-purple-800 mb-2">📈 As you progress:</p>
            <ul className="text-purple-700 space-y-1">
              <li>• NPCs get stronger each level</li>
              <li>• Every 10th level is a BOSS battle</li>
              <li>• Defeat bosses to earn special badges</li>
              <li>• Use points to upgrade your abilities</li>
            </ul>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="font-semibold text-orange-800">🎁 Rewards:</p>
            <p className="text-orange-700">Win battles to earn trophies and advance!</p>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Battle! 🚀",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-xl font-bold text-gray-800">You're ready to start your bug battle journey!</p>
            <p className="text-gray-600 mt-2">Select your bug and face your first opponent!</p>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
            <p className="font-semibold text-gray-800 text-center">Good luck, Bug Trainer! 🍀</p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{tutorialSteps[currentStep].title}</span>
            <Badge variant="outline">
              {currentStep + 1} / {tutorialSteps.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {tutorialSteps[currentStep].content}
        </div>
        
        <div className="flex justify-between items-center pt-4">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button 
            onClick={nextStep}
            className="flex items-center gap-2"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Start Playing!' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BattleTutorial;
