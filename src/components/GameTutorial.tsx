
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronRight, ChevronLeft, User, Bug, ArrowUp, TrendingUp, Trophy, Award, Sword, Shield, Zap } from 'lucide-react';

interface GameTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  currentStep?: number;
  gameState: any;
}

const GameTutorial: React.FC<GameTutorialProps> = ({ 
  isOpen, 
  onClose, 
  onComplete, 
  currentStep = 0,
  gameState 
}) => {
  const [step, setStep] = useState(currentStep);

  const tutorialSteps = [
    {
      title: "🎉 Welcome to Super Bug Adventure! 🎉",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-8xl mb-4">🐛✨</div>
            <p className="text-2xl font-bold text-purple-800">Ready for an amazing bug-catching adventure?</p>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-[1.5rem] border-4 border-purple-300">
            <p className="text-lg font-bold text-purple-800 mb-4">🎯 Your Mission:</p>
            <ul className="text-purple-700 space-y-2 text-lg">
              <li>🎣 Catch amazing bugs from around the world</li>
              <li>⚔️ Train and battle with your bugs</li>
              <li>🏆 Defeat bosses to earn special badges</li>
              <li>👑 Become the Ultimate Bug Champion!</li>
            </ul>
          </div>
          <div className="text-center bg-yellow-100 p-4 rounded-[1.5rem] border-4 border-yellow-300">
            <p className="text-xl font-black text-yellow-800">🌟 First, let's sign you up! 🌟</p>
          </div>
        </div>
      )
    },
    {
      title: "👤 Step 1: Sign Up & Sign In",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-[1.5rem] border-4 border-green-300">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-8 h-8 text-green-600" />
              <p className="text-2xl font-black text-green-800">Create Your Account!</p>
            </div>
            <p className="text-lg text-green-700 mb-4">Look for the login button in the top right corner and create your account to save your progress!</p>
            <div className="bg-white p-4 rounded-lg border-2 border-green-200">
              <p className="font-bold text-green-800">✅ Why sign up?</p>
              <ul className="text-green-700 mt-2 space-y-1">
                <li>• Save your bug collection</li>
                <li>• Track your achievements</li>
                <li>• Never lose your progress</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "🎣 Step 2: Catch Your First 5 Bugs!",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-[1.5rem] border-4 border-blue-300">
            <div className="flex items-center gap-3 mb-4">
              <Bug className="w-8 h-8 text-blue-600" />
              <p className="text-2xl font-black text-blue-800">Time to Catch Bugs!</p>
            </div>
            <p className="text-lg text-blue-700 mb-4">Go to the "🎣 Catch Bugs" tab and catch 5 amazing bugs!</p>
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200 space-y-3">
              <p className="font-bold text-blue-800">🎯 How to catch bugs:</p>
              <ol className="text-blue-700 space-y-1">
                <li>1. Click "Search for Bugs!" button</li>
                <li>2. Wait for 3 bugs to appear</li>
                <li>3. Choose one bug to catch</li>
                <li>4. Hope for success! (Higher level = better catch rate)</li>
                <li>5. Repeat until you have 5 bugs!</li>
              </ol>
            </div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-[1.5rem] border-4 border-yellow-300">
            <p className="text-lg font-black text-yellow-800 text-center">
              🌟 Current Bugs: {gameState?.playerBugs?.length || 0}/5 🌟
            </p>
          </div>
        </div>
      )
    },
    {
      title: "🆓 Step 3: Release 4 Bugs for Points!",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-[1.5rem] border-4 border-orange-300">
            <div className="flex items-center gap-3 mb-4">
              <ArrowUp className="w-8 h-8 text-orange-600" />
              <p className="text-2xl font-black text-orange-800">Release Bugs for Points!</p>
            </div>
            <p className="text-lg text-orange-700 mb-4">Go to "🆓 Release" tab and release 4 of your bugs to earn points!</p>
            <div className="bg-white p-4 rounded-lg border-2 border-orange-200 space-y-3">
              <p className="font-bold text-orange-800">💰 Why release bugs?</p>
              <ul className="text-orange-700 space-y-1">
                <li>• Earn points to level up your remaining bugs!</li>
                <li>• Higher rarity bugs give more points</li>
                <li>• Points are essential for making bugs stronger</li>
              </ul>
              <p className="font-bold text-orange-800 mt-3">🎯 Keep your best bug for leveling up!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "📈 Step 4: Level Up Your Champion Bug!",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-[1.5rem] border-4 border-green-300">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <p className="text-2xl font-black text-green-800">Power Up Your Bug!</p>
            </div>
            <p className="text-lg text-green-700 mb-4">Go to "📈 Level Up" tab and use your points to make your remaining bug stronger!</p>
            <div className="bg-white p-4 rounded-lg border-2 border-green-200 space-y-3">
              <p className="font-bold text-green-800">⚡ Leveling up increases:</p>
              <ul className="text-green-700 space-y-1">
                <li>• 🛡️ Armor (+10%)</li>
                <li>• ⚔️ Strength (+10%)</li>
                <li>• ❤️ Health (+10%)</li>
                <li>• ⚡ Speed (+10%)</li>
              </ul>
              <p className="font-bold text-green-800 mt-3">💡 Higher level bugs are much stronger in battle!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "🏠 Step 5: View Your Collection!",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-[1.5rem] border-4 border-purple-300">
            <div className="flex items-center gap-3 mb-4">
              <Bug className="w-8 h-8 text-purple-600" />
              <p className="text-2xl font-black text-purple-800">Your Bug Collection!</p>
            </div>
            <p className="text-lg text-purple-700 mb-4">Go to "🏠 Collection" tab to see all your caught bugs!</p>
            <div className="bg-white p-4 rounded-lg border-2 border-purple-200 space-y-3">
              <p className="font-bold text-purple-800">✨ In your collection you can:</p>
              <ul className="text-purple-700 space-y-1">
                <li>• View all your bugs and their stats</li>
                <li>• See bug levels and rarity</li>
                <li>• Select a bug for battle by clicking on it</li>
                <li>• Admire your amazing collection!</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "⚔️ Step 6: Enter the Battle Arena!",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-100 to-pink-100 p-6 rounded-[1.5rem] border-4 border-red-300">
            <div className="flex items-center gap-3 mb-4">
              <Sword className="w-8 h-8 text-red-600" />
              <p className="text-2xl font-black text-red-800">Time to Battle!</p>
            </div>
            <p className="text-lg text-red-700 mb-4">Select your leveled-up bug and go to "⚔️ Battle Arena"!</p>
            <div className="bg-white p-4 rounded-lg border-2 border-red-200 space-y-3">
              <p className="font-bold text-red-800">🎯 Battle Mechanics:</p>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <Sword className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <p className="font-bold text-red-700">⚔️ Attack</p>
                  <p className="text-sm text-red-600">Deal damage</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="font-bold text-blue-700">🛡️ Defense</p>
                  <p className="text-sm text-blue-600">Block & counter</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="font-bold text-yellow-700">⚡ Speed</p>
                  <p className="text-sm text-yellow-600">Fast attacks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "🧠 Step 7: Master Battle Strategy!",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-[1.5rem] border-4 border-purple-300">
            <p className="text-2xl font-black text-purple-800 mb-4">🧠 Battle Strategy Guide!</p>
            <div className="bg-white p-4 rounded-lg border-2 border-purple-200 space-y-4">
              <div>
                <p className="font-bold text-purple-800">💥 How Combat Works:</p>
                <ul className="text-purple-700 space-y-1 mt-2">
                  <li>• Both you and enemy choose actions simultaneously</li>
                  <li>• Different combinations create different outcomes</li>
                  <li>• Stunned bugs skip their next turn</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-purple-800">🎯 Winning Combinations:</p>
                <ul className="text-purple-700 space-y-1 mt-2">
                  <li>• 🛡️ Defense vs ⚔️ Attack = You counter and stun enemy!</li>
                  <li>• ⚡ Speed vs 🛡️ Defense = You dodge and stun enemy!</li>
                  <li>• ⚔️ Attack vs ⚡ Speed = You hit the slow enemy!</li>
                </ul>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg border-2 border-yellow-300">
                <p className="font-bold text-yellow-800">💡 Pro Tip: Watch for patterns and adapt your strategy!</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "🏪 Step 8: Visit the Trophy Shop!",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-[1.5rem] border-4 border-yellow-300">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <p className="text-2xl font-black text-yellow-800">Spend Your Trophies!</p>
            </div>
            <p className="text-lg text-yellow-700 mb-4">After winning battles, visit "🏪 Trophy Shop" to buy upgrades!</p>
            <div className="bg-white p-4 rounded-lg border-2 border-yellow-200 space-y-3">
              <p className="font-bold text-yellow-800">🛒 Available Upgrades:</p>
              <ul className="text-yellow-700 space-y-1">
                <li>• 🎯 Better Catch Rates - Easier to catch bugs</li>
                <li>• 🍀 Rare Bug Luck - Find rare bugs more often</li>
                <li>• 💪 Bug Strength Boost - All bugs get stronger</li>
              </ul>
              <div className="bg-orange-100 p-3 rounded-lg border-2 border-orange-200">
                <p className="font-bold text-orange-800">💰 Trophies earned from winning battles!</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "🏆 Step 9: Collect Badges & Become Champion!",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gold-100 to-yellow-100 p-6 rounded-[1.5rem] border-4 border-gold-300">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-gold-600" />
              <p className="text-2xl font-black text-gold-800">The Ultimate Goal!</p>
            </div>
            <p className="text-lg text-gold-700 mb-4">Check "🏆 Badges" tab to see your progress toward becoming champion!</p>
            <div className="bg-white p-4 rounded-lg border-2 border-gold-200 space-y-3">
              <p className="font-bold text-gold-800">👑 Badge System:</p>
              <ul className="text-gold-700 space-y-1">
                <li>• Every 10th level is a BOSS battle</li>
                <li>• Defeat bosses to earn special badges</li>
                <li>• Collect all 10 badges to become Ultimate Champion!</li>
                <li>• Each badge makes you stronger for the next challenge</li>
              </ul>
              <div className="bg-purple-100 p-3 rounded-lg border-2 border-purple-200">
                <p className="font-bold text-purple-800 text-center">🎯 Current Badges: {gameState?.badges || 0}/10</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "🎉 You're Ready to Play!",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-8xl mb-4">🏆✨</div>
            <p className="text-3xl font-black text-purple-800 mb-4">Congratulations!</p>
            <p className="text-xl text-purple-700">You now know everything about Super Bug Adventure!</p>
          </div>
          <div className="bg-gradient-to-r from-rainbow-100 to-pink-100 p-6 rounded-[1.5rem] border-4 border-rainbow-300">
            <p className="text-2xl font-black text-center text-purple-800 mb-4">🎯 Your Journey Begins Now!</p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                <p className="font-bold text-blue-800">🎣 Catch Bugs</p>
                <p className="text-sm text-blue-600">Build your collection</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                <p className="font-bold text-green-800">📈 Level Up</p>
                <p className="text-sm text-green-600">Make them stronger</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-red-200">
                <p className="font-bold text-red-800">⚔️ Battle</p>
                <p className="text-sm text-red-600">Defeat opponents</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                <p className="font-bold text-purple-800">👑 Win Badges</p>
                <p className="text-sm text-purple-600">Become champion</p>
              </div>
            </div>
          </div>
          <div className="text-center bg-yellow-100 p-4 rounded-[1.5rem] border-4 border-yellow-300">
            <p className="text-2xl font-black text-yellow-800">Good luck, Bug Trainer! 🍀</p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
      onClose();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto border-8 border-purple-400 rounded-[2rem] bg-gradient-to-br from-purple-50 to-pink-50">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-3xl font-black text-purple-800">
            <span>{tutorialSteps[step].title}</span>
            <Badge variant="outline" className="text-xl px-4 py-2 border-2 border-purple-300">
              {step + 1} / {tutorialSteps.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {tutorialSteps[step].content}
        </div>
        
        <div className="flex justify-between items-center pt-6 border-t-4 border-purple-200">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={step === 0}
            className="flex items-center gap-2 text-lg px-6 py-3 font-bold border-2 border-purple-300 rounded-[1.5rem]"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full ${
                  index === step ? 'bg-purple-500' : 
                  index < step ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button 
            onClick={nextStep}
            className="flex items-center gap-2 text-lg px-6 py-3 font-black bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-[1.5rem] border-none shadow-xl transform hover:scale-105 transition-all"
          >
            {step === tutorialSteps.length - 1 ? '🎮 Start Playing!' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameTutorial;
