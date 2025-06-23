
import { Bug } from '../types/Game';

export const sortBugsByLevelAndRarity = (bugs: Bug[]): Bug[] => {
  const rarityOrder = {
    'mythical': 6,
    'epic': 5,
    'legendary': 4,
    'rare': 3,
    'uncommon': 2,
    'common': 1
  };

  return [...bugs].sort((a, b) => {
    // First sort by level (highest first)
    const levelA = a.level || 1;
    const levelB = b.level || 1;
    
    if (levelA !== levelB) {
      return levelB - levelA;
    }
    
    // Then sort by rarity (highest first)
    const rarityA = rarityOrder[a.rarity] || 0;
    const rarityB = rarityOrder[b.rarity] || 0;
    
    if (rarityA !== rarityB) {
      return rarityB - rarityA;
    }
    
    // Finally sort by name alphabetically
    return a.name.localeCompare(b.name);
  });
};

export const getRarityMultiplier = (rarity: Bug['rarity']): number => {
  switch (rarity) {
    case 'common': return 1;
    case 'uncommon': return 1.5;
    case 'rare': return 2.5;
    case 'legendary': return 4;
    case 'epic': return 6;
    case 'mythical': return 10;
    default: return 1;
  }
};
