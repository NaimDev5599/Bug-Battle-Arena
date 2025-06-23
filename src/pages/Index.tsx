import React, { useState, useEffect } from 'react';
import { Bug, BattleResult } from '../types/Game';
import { generateNPC } from '../data/npcs';
import BugCard from '../components/BugCard';
import TacticalBattleArena from '../components/TacticalBattleArena';
import BugCatcher from '../components/BugCatcher';
import BugRelease from '../components/BugRelease';
import BugLeveling from '../components/BugLeveling';
import TrophyShop from '../components/TrophyShop';
import BadgeDisplay from '../components/BadgeDisplay';
import GameTutorial from '../components/GameTutorial';
import AuthPage from '../components/AuthPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Bug as BugIcon, Sword, Coins, Award, User, HelpCircle, LogOut, QrCode, Sparkles, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useGameData } from '@/hooks/useGameData';
import { sortBugsByLevelAndRarity } from '@/utils/bugSorting';

const Index = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { gameState, setGameState, loading: gameLoading, saveGameProgress, saveBug, deleteBug, updateBugLevel } = useGameData();
  
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [currentNPC, setCurrentNPC] = useState(generateNPC(1, 0));
  const [activeTab, setActiveTab] = useState('collection');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    setCurrentNPC(generateNPC(gameState.currentNPCLevel, gameState.bossWins));
  }, [gameState.currentNPCLevel, gameState.bossWins]);

  useEffect(() => {
    const hasSeenGameTutorial = localStorage.getItem('gameMainTutorialCompleted');
    if (!hasSeenGameTutorial && gameState.playerBugs.length === 0 && user) {
      setShowTutorial(true);
    }
  }, [gameState.playerBugs.length, user]);

  // Hide auth page when user signs in
  useEffect(() => {
    if (user && showAuthPage) {
      setShowAuthPage(false);
    }
  }, [user, showAuthPage]);

  const handleTutorialComplete = () => {
    localStorage.setItem('gameMainTutorialCompleted', 'true');
    toast.success('🎉 Tutorial completed! Welcome to your bug adventure! 🎉');
  };

  const handleBugCaught = async (bug: Bug) => {
    const newBug = { ...bug, id: `${bug.id}-${Date.now()}`, level: 1 };
    
    if (user) {
      await saveBug(newBug);
    } else {
      // For anonymous users, update local state
      setGameState(prev => ({
        ...prev,
        playerBugs: [...prev.playerBugs, newBug]
      }));
    }
  };

  const handleBugSelect = (bug: Bug) => {
    setGameState(prev => ({
      ...prev,
      selectedBug: bug
    }));
    setActiveTab('battle');
  };

  const handleBattleComplete = async (result: BattleResult) => {
    if (result.winner === 'player') {
      const levelUpPoints = Math.floor(gameState.victories / 2) * 10;
      const isBossWin = currentNPC.isBoss;
      
      const newState = {
        victories: gameState.victories + 1,
        currentNPCLevel: gameState.currentNPCLevel + 1,
        trophies: gameState.trophies + (result.trophiesEarned || 0),
        points: gameState.points + levelUpPoints,
        badges: isBossWin ? gameState.badges + 1 : gameState.badges,
        bossWins: isBossWin ? gameState.bossWins + 1 : gameState.bossWins
      };

      setGameState(prev => ({ ...prev, ...newState }));

      if (user) {
        await saveGameProgress(newState);
      }

      if (isBossWin && newState.badges >= 10) {
        toast.success('🏆 CONGRATULATIONS! You have collected all 10 badges and become the Ultimate Champion! 🏆');
      }
    }
  };

  const handleBugRelease = async (bug: Bug, points: number) => {
    if (user) {
      await deleteBug(bug.id);
      const newState = { points: gameState.points + points };
      setGameState(prev => ({ ...prev, ...newState }));
      await saveGameProgress(newState);
    } else {
      setGameState(prev => ({
        ...prev,
        playerBugs: prev.playerBugs.filter(b => b.id !== bug.id),
        points: prev.points + points,
        selectedBug: prev.selectedBug?.id === bug.id ? null : prev.selectedBug
      }));
    }
  };

  const handleBugLevelUp = async (bug: Bug, cost: number) => {
    const newLevel = (bug.level || 1) + 1;
    const newStats = {
      armor: Math.floor(bug.armor * 1.1),
      strength: Math.floor(bug.strength * 1.1),
      health: Math.floor(bug.health * 1.1),
      speed: Math.floor(bug.speed * 1.1)
    };

    if (user) {
      await updateBugLevel(bug.id, newLevel, newStats);
      const newState = { points: gameState.points - cost };
      setGameState(prev => ({ ...prev, ...newState }));
      await saveGameProgress(newState);
    } else {
      setGameState(prev => ({
        ...prev,
        playerBugs: prev.playerBugs.map(b => 
          b.id === bug.id 
            ? { ...b, level: newLevel, ...newStats }
            : b
        ),
        points: prev.points - cost,
        selectedBug: prev.selectedBug?.id === bug.id 
          ? { ...prev.selectedBug, level: newLevel, ...newStats }
          : prev.selectedBug
      }));
    }
  };

  const handleUpgrade = async (upgradeType: keyof typeof gameState.upgrades, cost: number) => {
    const newUpgrades = {
      ...gameState.upgrades,
      [upgradeType]: gameState.upgrades[upgradeType] + 1
    };
    
    const newState = {
      trophies: gameState.trophies - cost,
      upgrades: newUpgrades
    };

    setGameState(prev => ({ ...prev, ...newState }));

    if (user) {
      await saveGameProgress(newState);
    }
  };

  const resetGame = async () => {
    const defaultState = {
      playerBugs: [],
      currentNPCLevel: 1,
      victories: 0,
      selectedBug: null,
      points: 0,
      trophies: 0,
      badges: 0,
      bossWins: 0,
      upgrades: {
        catchChance: 0,
        rareBugLuck: 0,
        bugStrength: 0
      }
    };

    setGameState(defaultState);
    setActiveTab('collection');

    if (user) {
      await saveGameProgress(defaultState);
    }

    toast.success('🎮 Game reset! Start your new adventure! 🎮');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const sortedBugs = sortBugsByLevelAndRarity(gameState.playerBugs);

  if (authLoading || gameLoading) {
    return (
      <div className="min-h-screen game-background flex items-center justify-center safe-area">
        <div className="text-center animate-bounce-in">
          <div className="loading-spinner mx-auto mb-6"></div>
          <div className="text-2xl font-black bubble-text animate-float">
            🐛✨ Loading Bug Adventure... ✨🐛
          </div>
          <div className="mt-4 text-lg font-bold text-purple-700 animate-wiggle">
            Get ready for an amazing journey! 🚀
          </div>
        </div>
      </div>
    );
  }

  if (showAuthPage) {
    return <AuthPage onBack={() => setShowAuthPage(false)} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen game-background p-4 flex items-center justify-center safe-area app-container">
        <Card className="border-8 border-purple-500 rounded-[2rem] bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 max-w-md w-full animate-bounce-in cartoon-shadow">
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-wiggle">🎮</div>
              <h1 className="text-3xl font-black bubble-text mb-4 animate-float">
                Welcome to Bug Adventure!
              </h1>
              <div className="flex justify-center space-x-2 mb-4">
                <Star className="w-6 h-6 text-yellow-500 animate-sparkle" />
                <Sparkles className="w-6 h-6 text-pink-500 animate-sparkle" style={{animationDelay: '0.5s'}} />
                <Star className="w-6 h-6 text-blue-500 animate-sparkle" style={{animationDelay: '1s'}} />
              </div>
              <p className="text-lg font-bold text-purple-700 animate-float" style={{animationDelay: '0.5s'}}>
                Choose how you want to play!
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setShowAuthPage(true)}
                variant="success"
                size="mobile"
                className="w-full h-16 animate-glow"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <User className="w-6 h-6" />
                    <Zap className="w-5 h-5 animate-sparkle" />
                  </div>
                  <div className="text-lg font-black">🔐 Sign Up / Sign In</div>
                  <div className="text-sm opacity-90">Save your progress forever!</div>
                </div>
              </Button>

              <Button
                onClick={() => {}} // This will show the game in anonymous mode
                variant="warning"
                size="mobile"
                className="w-full h-16"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="text-lg font-black">🎯 Play Anonymously</div>
                  <div className="text-sm opacity-90">Quick play - progress not saved</div>
                </div>
              </Button>

              <Button
                onClick={() => setShowQRCode(!showQRCode)}
                variant="outline"
                size="mobile"
                className="w-full"
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  <div className="font-bold">📱 Mobile QR Code</div>
                </div>
              </Button>

              {showQRCode && (
                <div className="bg-white p-4 rounded-2xl border-4 border-blue-500 text-center cartoon-shadow animate-bounce-in">
                  <p className="text-sm font-bold text-blue-800 mb-2">Scan to play on mobile:</p>
                  <div className="bg-gray-100 p-4 rounded-lg cartoon-border">
                    <p className="text-xs text-gray-600 break-all font-mono">
                      {window.location.href}
                    </p>
                  </div>
                  <p className="text-xs text-blue-600 mt-2 font-bold">
                    📱 Perfect for mobile gaming experience! 📱
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-2xl border-4 border-blue-400 mt-6 cartoon-shadow animate-float">
              <p className="text-sm text-blue-800 font-black text-center">
                💡 Tip: Sign up to keep your bug collection and progress safe! 💡
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const playerLevel = Math.floor(gameState.victories / 2) + 1;
  const isGameComplete = gameState.badges >= 10;

  return (
    <div className="min-h-screen game-background mobile-scroll safe-area app-container">
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <GameTutorial 
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
        gameState={gameState}
      />
      
      <div className="max-w-6xl mx-auto p-2 sm:p-4">
        {/* Enhanced Mobile Header */}
        <div className="text-center mb-6 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200 p-4 sm:p-6 rounded-[2rem] border-6 border-purple-500 cartoon-shadow animate-bounce-in">
          <div className="flex justify-between items-center mb-4">
            <div className="animate-wiggle text-2xl">🎪</div>
            <h1 className="text-2xl sm:text-4xl font-black bubble-text animate-float drop-shadow-lg">
              🐛✨ BUG ADVENTURE ✨🐛
            </h1>
            <div className="flex flex-col items-center gap-2">
              <Button 
                onClick={() => setShowTutorial(true)}
                variant="outline"
                size="sm"
                className="animate-glow"
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                📚
              </Button>
              {user && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-emerald-500 px-3 py-2 rounded-2xl border-3 border-green-600 cartoon-shadow animate-float">
                    <User className="w-4 h-4 text-white" />
                    <span className="font-black text-white text-sm">Hi! 🎉</span>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    size="sm"
                    variant="destructive"
                    className="p-2"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-lg font-black text-purple-800 mb-4 cartoon-text animate-float" style={{animationDelay: '0.5s'}}>
            🌟 Catch bugs, train them, and battle bosses! 🌟
          </p>
          
          {isGameComplete && (
            <div className="mt-4 p-6 animate-rainbow border-6 border-yellow-500 rounded-[2rem] animate-bounce cartoon-shadow">
              <h2 className="text-2xl font-black text-white cartoon-text animate-wiggle">🎊 ULTIMATE CHAMPION! 🎊</h2>
              <p className="text-lg text-white font-bold cartoon-text">⭐ You collected all 10 badges! ⭐</p>
            </div>
          )}
          
          {/* Enhanced Mobile Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
            <Badge className="flex flex-col items-center gap-1 p-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl cartoon-shadow transform hover:scale-105 transition-all animate-float">
              <BugIcon className="w-5 h-5" />
              <span className="font-black">🐛 {gameState.playerBugs.length}</span>
            </Badge>
            <Badge className="flex flex-col items-center gap-1 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl cartoon-shadow transform hover:scale-105 transition-all animate-float" style={{animationDelay: '0.2s'}}>
              <Trophy className="w-5 h-5" />
              <span className="font-black">🏆 {gameState.victories}</span>
            </Badge>
            <Badge className="flex flex-col items-center gap-1 p-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl cartoon-shadow transform hover:scale-105 transition-all animate-float" style={{animationDelay: '0.4s'}}>
              <Sword className="w-5 h-5" />
              <span className="font-black">⚔️ Lv{gameState.currentNPCLevel}</span>
            </Badge>
            <Badge className="flex flex-col items-center gap-1 p-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-2xl cartoon-shadow transform hover:scale-105 transition-all animate-float" style={{animationDelay: '0.6s'}}>
              <Coins className="w-5 h-5" />
              <span className="font-black">💰 {gameState.points}</span>
            </Badge>
            <Badge className="flex flex-col items-center gap-1 p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl cartoon-shadow transform hover:scale-105 transition-all animate-float col-span-2 sm:col-span-1" style={{animationDelay: '0.8s'}}>
              <Award className="w-5 h-5" />
              <span className="font-black">🥇 {gameState.badges}/10</span>
            </Badge>
          </div>

          {currentNPC.isBoss && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 border-6 border-purple-600 rounded-[2rem] animate-glow cartoon-shadow">
              <p className="text-xl text-white font-black cartoon-text animate-wiggle">
                🔥 BOSS BATTLE READY! 🔥<br/>
                💪 Defeat {currentNPC.name} for a badge! 💪
              </p>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-4 bg-gradient-to-r from-purple-300 to-pink-300 rounded-[2rem] p-2 border-4 border-purple-500 cartoon-shadow">
            <TabsTrigger value="collection" className="rounded-2xl font-black text-purple-800 text-sm p-2 touch-target">🏠</TabsTrigger>
            <TabsTrigger value="catcher" className="rounded-2xl font-black text-purple-800 text-sm p-2 touch-target">🎣</TabsTrigger>
            <TabsTrigger value="battle" disabled={!gameState.selectedBug} className="rounded-2xl font-black text-purple-800 text-sm p-2 touch-target">⚔️</TabsTrigger>
            <TabsTrigger value="release" className="rounded-2xl font-black text-purple-800 text-sm p-2 touch-target">🆓</TabsTrigger>
            <TabsTrigger value="levelup" className="rounded-2xl font-black text-purple-800 text-sm p-2 touch-target hidden lg:block">📈</TabsTrigger>
            <TabsTrigger value="shop" className="rounded-2xl font-black text-purple-800 text-sm p-2 touch-target hidden lg:block">🏪</TabsTrigger>
            <TabsTrigger value="badges" className="rounded-2xl font-black text-purple-800 text-sm p-2 touch-target hidden lg:block">🏆</TabsTrigger>
          </TabsList>

          {/* Mobile-specific additional tabs for smaller screens */}
          {(activeTab === 'levelup' || activeTab === 'shop' || activeTab === 'badges') && (
            <div className="lg:hidden mb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-purple-300 to-pink-300 rounded-[2rem] p-2 border-4 border-purple-500 cartoon-shadow">
                  <TabsTrigger value="levelup" className="rounded-2xl font-black text-purple-800 text-sm p-2 touch-target">📈</TabsTrigger>
                  <TabsTrigger value="shop" className="rounded-2xl font-black text-purple-800 text-sm p-2 touch-target">🏪</TabsTrigger>
                  <TabsTrigger value="badges" className="rounded-2xl font-black text-purple-800 text-sm p-2 touch-target">🏆</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          <TabsContent value="collection">
            <Card className="border-6 border-green-500 rounded-[2rem] bg-gradient-to-br from-green-100 to-emerald-200 animate-bounce-in">
              <CardHeader className="bg-gradient-to-r from-green-300 to-emerald-400 rounded-t-[2rem] border-b-4 border-green-500 p-4">
                <CardTitle className="flex items-center justify-between text-xl text-white cartoon-text">
                  <span className="animate-float">🐛 Your Bug Collection 🐛</span>
                  <Button 
                    variant="destructive" 
                    onClick={resetGame}
                    size="sm"
                    className="animate-wiggle"
                  >
                    🔄 Reset
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {sortedBugs.length === 0 ? (
                  <div className="text-center py-12 animate-bounce-in">
                    <BugIcon className="w-24 h-24 text-green-600 mx-auto mb-4 animate-wiggle" />
                    <p className="text-2xl text-green-700 mb-2 font-black cartoon-text animate-float">🌟 No bugs yet! 🌟</p>
                    <p className="text-lg text-green-600 font-bold animate-float" style={{animationDelay: '0.5s'}}>🎣 Go catch some bugs!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {sortedBugs.map((bug, index) => (
                      <div key={bug.id} className="animate-bounce-in" style={{animationDelay: `${index * 0.1}s`}}>
                        <BugCard
                          bug={bug}
                          onClick={() => handleBugSelect(bug)}
                          isSelected={gameState.selectedBug?.id === bug.id}
                          compact={true}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges">
            <BadgeDisplay earnedBadges={gameState.badges} />
          </TabsContent>

          <TabsContent value="catcher">
            <BugCatcher 
              onBugCaught={handleBugCaught} 
              playerLevel={playerLevel}
              upgrades={gameState.upgrades}
            />
          </TabsContent>

          <TabsContent value="battle">
            {gameState.selectedBug ? (
              <TacticalBattleArena
                playerBug={gameState.selectedBug}
                npc={currentNPC}
                onBattleComplete={handleBattleComplete}
              />
            ) : (
              <Card className="border-6 border-yellow-500 rounded-[2rem] bg-gradient-to-br from-yellow-100 to-orange-100 animate-bounce-in">
                <CardContent className="text-center py-12">
                  <Sword className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-wiggle" />
                  <p className="text-xl text-yellow-600 font-black cartoon-text animate-float">⚔️ Select a bug to battle! ⚔️</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="release">
            <BugRelease
              bugs={sortedBugs}
              onRelease={handleBugRelease}
              playerLevel={playerLevel}
            />
          </TabsContent>

          <TabsContent value="levelup">
            <BugLeveling
              bugs={sortedBugs}
              points={gameState.points}
              onLevelUp={handleBugLevelUp}
            />
          </TabsContent>

          <TabsContent value="shop">
            <TrophyShop
              gameState={gameState}
              onUpgrade={handleUpgrade}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;