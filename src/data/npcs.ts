
import { NPC } from '../types/Game';
import { availableBugs } from './bugs';

export const generateNPC = (level: number, bossWins: number = 0): NPC => {
  const isBoss = level % 10 === 0;
  
  const bugPool = availableBugs.filter(bug => {
    if (isBoss) return true; // Bosses can have any bug
    if (level <= 3) return bug.rarity === 'common' || bug.rarity === 'uncommon';
    if (level <= 6) return bug.rarity !== 'legendary';
    return true;
  });

  const selectedBug = bugPool[Math.floor(Math.random() * bugPool.length)];
  
  // Significantly reduced multipliers to make NPCs easier
  const baseMultiplier = 1 + (level - 1) * 0.1; // Reduced from 0.2 to 0.1
  const bossMultiplier = isBoss ? 1.2 + (bossWins * 0.15) : 1; // Reduced from 1.5 and 0.3 to 1.2 and 0.15
  const badgeMultiplier = 1 + (bossWins * 0.08); // Reduced from 0.15 to 0.08
  const levelMultiplier = baseMultiplier * bossMultiplier * badgeMultiplier;
  
  // Apply a global difficulty reduction of 20%
  const difficultyReduction = 0.8;
  const finalMultiplier = levelMultiplier * difficultyReduction;
  
  const scaledBug = {
    ...selectedBug,
    armor: Math.max(Math.floor(selectedBug.armor * finalMultiplier), Math.floor(selectedBug.armor * 0.5)), // Minimum 50% of original
    strength: Math.max(Math.floor(selectedBug.strength * finalMultiplier), Math.floor(selectedBug.strength * 0.5)),
    health: Math.max(Math.floor(selectedBug.health * finalMultiplier), Math.floor(selectedBug.health * 0.5)),
    speed: Math.max(Math.floor(selectedBug.speed * finalMultiplier), Math.floor(selectedBug.speed * 0.5))
  };

  const regularNames = [
    'Bug Hunter Jake', 'Trainer Sarah', 'Expert Mike', 'Master Chen', 
    'Elite Rosa', 'Champion Alex', 'Legend Diana', 'Grand Master Kai'
  ];

  const bossNames = [
    'Boss Titan', 'Boss Thunder', 'Boss Venom', 'Boss Inferno', 'Boss Frost',
    'Boss Shadow', 'Boss Storm', 'Boss Quake', 'Boss Blaze', 'Final Boss Omega'
  ];

  const names = isBoss ? bossNames : regularNames;
  const nameIndex = isBoss ? Math.min(Math.floor(level / 10) - 1, names.length - 1) : Math.min(level - 1, names.length - 1);

  return {
    id: `${isBoss ? 'boss' : 'npc'}-${level}`,
    name: names[nameIndex],
    level,
    bug: scaledBug,
    avatar: `photo-1582562124811-c09040d0a901`,
    isBoss
  };
};
