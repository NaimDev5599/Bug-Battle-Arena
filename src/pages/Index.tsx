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
import { Trophy, Bug as BugIcon, Sword, Coins, Award, User, HelpCircle, LogOut, QrCode } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 flex items-center justify-center">
        <div className="text-xl sm:text-2xl font-black text-purple-800">🐛 Loading Bug Adventure... 🐛</div>
      </div>
    );
  }

  if (showAuthPage) {
    return <AuthPage onBack={() => setShowAuthPage(false)} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 p-4 flex items-center justify-center">
        <Card className="border-4 sm:border-6 border-purple-400 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-200 max-w-md w-full">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-purple-800 mb-4">
                🎮 Welcome to Bug Adventure! 🎮
              </h1>
              <p className="text-base sm:text-lg font-bold text-purple-700">
                🌟 Choose how you want to play! 🌟
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setShowAuthPage(true)}
                className="w-full h-16 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl transform hover:scale-105 transition-all shadow-xl"
              >
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  <div className="text-base sm:text-lg font-black">🔐 Sign Up / Sign In</div>
                  <div className="text-xs sm:text-sm opacity-90">Save your progress forever!</div>
                </div>
              </Button>

              <Button
                onClick={() => {}} // This will show the game in anonymous mode
                variant="outline"
                className="w-full h-16 sm:h-20 bg-gradient-to-r from-orange-200 to-yellow-200 hover:from-orange-300 hover:to-yellow-300 border-4 border-orange-400 text-orange-800 rounded-2xl transform hover:scale-105 transition-all shadow-xl"
              >
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <div className="text-base sm:text-lg font-black">🎯 Play Anonymously</div>
                  <div className="text-xs sm:text-sm">Quick play - progress not saved</div>
                </div>
              </Button>

              <Button
                onClick={() => setShowQRCode(!showQRCode)}
                variant="outline"
                className="w-full h-12 bg-gradient-to-r from-blue-200 to-purple-200 hover:from-blue-300 hover:to-purple-300 border-2 border-blue-400 text-blue-800 rounded-2xl transform hover:scale-105 transition-all shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  <div className="text-sm font-bold">📱 Mobile QR Code</div>
                </div>
              </Button>

              {showQRCode && (
                <div className="bg-white p-4 rounded-2xl border-2 border-blue-300 text-center">
                  <p className="text-sm font-bold text-blue-800 mb-2">Scan to play on mobile:</p>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 break-all">
                      {window.location.href}
                    </p>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    📱 Open in mobile browser for best vertical/horizontal play experience!
                  </p>
                </div>
              )}
            </div>

            <div className="bg-blue-100 p-3 sm:p-4 rounded-2xl border-2 border-blue-300 mt-4">
              <p className="text-xs sm:text-sm text-blue-800 font-bold text-center">
                💡 Tip: Sign up to keep your bug collection and progress safe!
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
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 p-2 sm:p-4 animate-fade-in">
      <GameTutorial 
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
        gameState={gameState}
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 bg-gradient-to-r from-rainbow-200 via-yellow-200 to-pink-200 p-3 sm:p-6 rounded-2xl border-2 sm:border-4 border-yellow-300 shadow-xl transform hover:scale-105 transition-all">
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <div className="animate-spin-slow text-xl sm:text-2xl">🎪</div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 animate-bounce drop-shadow-lg">
              🐛✨ BUG ADVENTURE ✨🐛
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <Button 
                onClick={() => setShowTutorial(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-none rounded-2xl font-black text-xs sm:text-base px-2 sm:px-6 py-1 sm:py-3 transform hover:scale-110 transition-all shadow-xl"
              >
                <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                📚 Help
              </Button>
              {user && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-300 to-emerald-400 px-2 sm:px-6 py-1 sm:py-3 rounded-2xl border-2 sm:border-4 border-green-500 shadow-lg transform hover:scale-110 transition-all">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-green-700" />
                    <span className="font-black text-green-800 text-xs sm:text-base">Hi, Bug Trainer! 🎉</span>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    size="sm"
                    variant="outline"
                    className="bg-gradient-to-r from-red-200 to-pink-200 hover:from-red-300 hover:to-pink-300 border-2 border-red-400 text-red-800 rounded-2xl font-black transform hover:scale-110 transition-all text-xs p-1 sm:p-2"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-purple-800 font-black mb-2 sm:mb-4 drop-shadow-md">🌟 Catch bugs, train them, and battle bosses! 🌟</p>
          
          {isGameComplete && (
            <div className="mt-2 sm:mt-4 p-3 sm:p-6 bg-gradient-to-r from-rainbow-300 via-yellow-300 to-pink-300 border-2 sm:border-4 border-yellow-500 rounded-2xl animate-pulse shadow-xl">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-yellow-900">🎊 ULTIMATE CHAMPION! 🎊</h2>
              <p className="text-base sm:text-lg lg:text-xl text-yellow-800 font-bold">⭐ You collected all 10 badges! ⭐</p>
            </div>
          )}
          
          {/* Enhanced Stats */}
          <div className="flex justify-center gap-1 sm:gap-2 mt-2 sm:mt-4 flex-wrap">
            <Badge className="flex items-center gap-1 text-xs sm:text-base p-1 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl shadow-xl transform hover:scale-110 transition-all border-2 border-blue-300">
              <BugIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              🐛 {gameState.playerBugs.length}
            </Badge>
            <Badge className="flex items-center gap-1 text-xs sm:text-base p-1 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl transform hover:scale-110 transition-all border-2 border-green-300">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
              🏆 {gameState.victories}
            </Badge>
            <Badge className="flex items-center gap-1 text-xs sm:text-base p-1 sm:p-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl shadow-xl transform hover:scale-110 transition-all border-2 border-red-300">
              <Sword className="w-3 h-3 sm:w-4 sm:h-4" />
              ⚔️ Lv{gameState.currentNPCLevel}
            </Badge>
            <Badge className="flex items-center gap-1 text-xs sm:text-base p-1 sm:p-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-2xl shadow-xl transform hover:scale-110 transition-all border-2 border-yellow-300">
              <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
              💰 {gameState.points}
            </Badge>
            <Badge className="flex items-center gap-1 text-xs sm:text-base p-1 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl shadow-xl transform hover:scale-110 transition-all border-2 border-purple-300">
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              🥇 {gameState.badges}/10
            </Badge>
          </div>

          {currentNPC.isBoss && (
            <div className="mt-2 sm:mt-4 p-2 sm:p-4 bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 border-2 sm:border-4 border-purple-500 rounded-2xl animate-pulse shadow-xl">
              <p className="text-base sm:text-lg lg:text-2xl text-purple-900 font-black">
                🔥 BOSS BATTLE READY! 🔥<br/>
                💪 Defeat {currentNPC.name} for a badge! 💪
              </p>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-4 bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl p-1 sm:p-2 border-2 sm:border-4 border-purple-400 shadow-xl">
            <TabsTrigger value="collection" className="rounded-xl font-black text-purple-800 text-xs sm:text-sm p-1 sm:p-2">🏠 Home</TabsTrigger>
            <TabsTrigger value="catcher" className="rounded-xl font-black text-purple-800 text-xs sm:text-sm p-1 sm:p-2">🎣 Catch</TabsTrigger>
            <TabsTrigger value="battle" disabled={!gameState.selectedBug} className="rounded-xl font-black text-purple-800 text-xs sm:text-sm p-1 sm:p-2">
              ⚔️ Battle
            </TabsTrigger>
            <TabsTrigger value="release" className="rounded-xl font-black text-purple-800 text-xs sm:text-sm p-1 sm:p-2">🆓 Release</TabsTrigger>
            <TabsTrigger value="levelup" className="rounded-xl font-black text-purple-800 text-xs sm:text-sm p-1 sm:p-2 hidden lg:block">📈 Level</TabsTrigger>
            <TabsTrigger value="shop" className="rounded-xl font-black text-purple-800 text-xs sm:text-sm p-1 sm:p-2 hidden lg:block">🏪 Shop</TabsTrigger>
            <TabsTrigger value="badges" className="rounded-xl font-black text-purple-800 text-xs sm:text-sm p-1 sm:p-2 hidden lg:block">🏆 Badges</TabsTrigger>
          </TabsList>

          {/* Mobile-specific additional tabs for smaller screens */}
          {(activeTab === 'levelup' || activeTab === 'shop' || activeTab === 'badges') && (
            <div className="lg:hidden mb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl p-1 border-2 border-purple-400 shadow-xl">
                  <TabsTrigger value="levelup" className="rounded-xl font-black text-purple-800 text-xs p-1">📈 Level</TabsTrigger>
                  <TabsTrigger value="shop" className="rounded-xl font-black text-purple-800 text-xs p-1">🏪 Shop</TabsTrigger>
                  <TabsTrigger value="badges" className="rounded-xl font-black text-purple-800 text-xs p-1">🏆 Badges</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          <TabsContent value="collection">
            <Card className="border-2 sm:border-4 border-green-400 rounded-2xl shadow-xl bg-gradient-to-br from-green-100 to-emerald-200">
              <CardHeader className="bg-gradient-to-r from-green-200 to-emerald-300 rounded-t-2xl border-b-2 sm:border-b-4 border-green-400 p-3 sm:p-6">
                <CardTitle className="flex items-center justify-between text-lg sm:text-2xl text-green-800 font-black">
                  <span>🐛 Your Bug Collection 🐛</span>
                  <Button 
                    variant="outline" 
                    onClick={resetGame}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-none rounded-2xl font-black transform hover:scale-110 transition-all shadow-xl text-xs sm:text-base px-2 sm:px-6 py-1 sm:py-3"
                  >
                    🔄 Reset
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                {sortedBugs.length === 0 ? (
                  <div className="text-center py-6 sm:py-12">
                    <BugIcon className="w-12 h-12 sm:w-24 sm:h-24 text-green-600 mx-auto mb-4 animate-bounce" />
                    <p className="text-lg sm:text-2xl text-green-700 mb-2 font-black">🌟 No bugs yet! 🌟</p>
                    <p className="text-base sm:text-lg text-green-600 font-bold">🎣 Go catch some bugs!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                    {sortedBugs.map((bug) => (
                      <BugCard
                        key={bug.id}
                        bug={bug}
                        onClick={() => handleBugSelect(bug)}
                        isSelected={gameState.selectedBug?.id === bug.id}
                        compact={true}
                      />
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
              <Card className="border-2 sm:border-4 border-yellow-300 rounded-2xl shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="text-center py-6 sm:py-12">
                  <Sword className="w-12 h-12 sm:w-20 sm:h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
                  <p className="text-base sm:text-xl text-yellow-600 font-bold">⚔️ Select a bug to battle! ⚔️</p>
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
