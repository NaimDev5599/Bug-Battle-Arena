
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Bug, GameState } from '@/types/Game';
import { toast } from 'sonner';

export const useGameData = () => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>({
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
  });
  const [loading, setLoading] = useState(true);

  // Load game data when user changes
  useEffect(() => {
    if (user) {
      loadGameData();
    } else {
      // Reset to default state when no user
      setGameState({
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
      });
      setLoading(false);
    }
  }, [user]);

  const loadGameData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Loading game data for user:', user.id);

      // Load game progress
      const { data: progressData, error: progressError } = await supabase
        .from('game_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (progressError) {
        console.error('Error loading game progress:', progressError);
        toast.error('Failed to load game progress');
        return;
      }

      console.log('Game progress data:', progressData);

      // Load user bugs
      const { data: bugsData, error: bugsError } = await supabase
        .from('user_bugs')
        .select('*')
        .eq('user_id', user.id)
        .order('caught_at', { ascending: false });

      if (bugsError) {
        console.error('Error loading bugs:', bugsError);
        toast.error('Failed to load bug collection');
        return;
      }

      console.log('Bugs data:', bugsData);

      // Convert bugs data with proper type conversion through unknown
      const playerBugs: Bug[] = bugsData?.map(bugRow => ({
        ...(bugRow.bug_data as unknown as Bug),
        id: bugRow.id,
        level: bugRow.level
      })) || [];

      // Parse upgrades with proper type conversion and fallback
      const upgrades = (progressData?.upgrades as unknown as { catchChance: number; rareBugLuck: number; bugStrength: number; }) || {
        catchChance: 0,
        rareBugLuck: 0,
        bugStrength: 0
      };

      // Update game state
      setGameState(prev => ({
        ...prev,
        playerBugs,
        currentNPCLevel: progressData?.current_npc_level || 1,
        victories: progressData?.victories || 0,
        points: progressData?.points || 0,
        trophies: progressData?.trophies || 0,
        badges: progressData?.badges || 0,
        bossWins: progressData?.boss_wins || 0,
        upgrades
      }));

    } catch (error) {
      console.error('Error in loadGameData:', error);
      toast.error('Failed to load game data');
    } finally {
      setLoading(false);
    }
  };

  const saveGameProgress = async (newState: Partial<GameState>) => {
    if (!user) {
      console.error('No user found, cannot save game progress');
      return;
    }

    try {
      console.log('Saving game progress for user:', user.id);
      console.log('New state to save:', newState);

      const progressData = {
        user_id: user.id,
        current_npc_level: newState.currentNPCLevel !== undefined ? newState.currentNPCLevel : gameState.currentNPCLevel,
        victories: newState.victories !== undefined ? newState.victories : gameState.victories,
        points: newState.points !== undefined ? newState.points : gameState.points,
        trophies: newState.trophies !== undefined ? newState.trophies : gameState.trophies,
        badges: newState.badges !== undefined ? newState.badges : gameState.badges,
        boss_wins: newState.bossWins !== undefined ? newState.bossWins : gameState.bossWins,
        upgrades: newState.upgrades || gameState.upgrades,
        updated_at: new Date().toISOString()
      };

      console.log('Progress data to save:', progressData);

      const { error } = await supabase
        .from('game_progress')
        .upsert(progressData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error saving game progress:', error);
        toast.error(`Failed to save game progress: ${error.message}`);
        return;
      }

      console.log('Game progress saved successfully');
    } catch (error) {
      console.error('Error in saveGameProgress:', error);
      toast.error('Failed to save game progress');
    }
  };

  const saveBug = async (bug: Bug) => {
    if (!user) {
      console.error('No user found, cannot save bug');
      return;
    }

    try {
      console.log('Saving bug for user:', user.id);
      console.log('Bug to save:', bug);

      const { error } = await supabase
        .from('user_bugs')
        .insert({
          user_id: user.id,
          bug_data: bug as unknown as any,
          level: bug.level || 1
        });

      if (error) {
        console.error('Error saving bug:', error);
        toast.error(`Failed to save bug: ${error.message}`);
        return;
      }

      console.log('Bug saved successfully');
      // Reload game data to get the updated bug list
      await loadGameData();
    } catch (error) {
      console.error('Error in saveBug:', error);
      toast.error('Failed to save bug');
    }
  };

  const deleteBug = async (bugId: string) => {
    if (!user) {
      console.error('No user found, cannot delete bug');
      return;
    }

    try {
      console.log('Deleting bug:', bugId, 'for user:', user.id);

      const { error } = await supabase
        .from('user_bugs')
        .delete()
        .eq('id', bugId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting bug:', error);
        toast.error(`Failed to release bug: ${error.message}`);
        return;
      }

      console.log('Bug deleted successfully');
      // Update local state
      setGameState(prev => ({
        ...prev,
        playerBugs: prev.playerBugs.filter(b => b.id !== bugId),
        selectedBug: prev.selectedBug?.id === bugId ? null : prev.selectedBug
      }));
    } catch (error) {
      console.error('Error in deleteBug:', error);
      toast.error('Failed to release bug');
    }
  };

  const updateBugLevel = async (bugId: string, newLevel: number, newStats: Partial<Bug>) => {
    if (!user) {
      console.error('No user found, cannot update bug level');
      return;
    }

    try {
      console.log('Updating bug level:', bugId, 'to level:', newLevel, 'for user:', user.id);

      // Get current bug data
      const currentBug = gameState.playerBugs.find(b => b.id === bugId);
      if (!currentBug) {
        console.error('Bug not found:', bugId);
        return;
      }

      const updatedBugData = { ...currentBug, ...newStats, level: newLevel };

      const { error } = await supabase
        .from('user_bugs')
        .update({
          bug_data: updatedBugData as unknown as any,
          level: newLevel
        })
        .eq('id', bugId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating bug level:', error);
        toast.error(`Failed to level up bug: ${error.message}`);
        return;
      }

      console.log('Bug level updated successfully');
      // Update local state
      setGameState(prev => ({
        ...prev,
        playerBugs: prev.playerBugs.map(b => 
          b.id === bugId ? updatedBugData : b
        ),
        selectedBug: prev.selectedBug?.id === bugId ? updatedBugData : prev.selectedBug
      }));
    } catch (error) {
      console.error('Error in updateBugLevel:', error);
      toast.error('Failed to level up bug');
    }
  };

  return {
    gameState,
    setGameState,
    loading,
    saveGameProgress,
    saveBug,
    deleteBug,
    updateBugLevel,
    loadGameData
  };
};
