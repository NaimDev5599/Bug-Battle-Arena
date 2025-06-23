
export interface Bug {
  id: string;
  name: string;
  type: string;
  armor: number;
  strength: number;
  health: number;
  speed: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'epic' | 'mythical';
  icon: string;
  description: string;
  level?: number;
}

export interface NPC {
  id: string;
  name: string;
  level: number;
  bug: Bug;
  avatar: string;
  isBoss?: boolean;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}

export interface BattleResult {
  winner: 'player' | 'npc';
  playerBug: Bug;
  npcBug: Bug;
  damage: number;
  trophiesEarned?: number;
  badgeEarned?: boolean;
}

export interface GameState {
  playerBugs: Bug[];
  currentNPCLevel: number;
  victories: number;
  selectedBug: Bug | null;
  points: number;
  trophies: number;
  badges: number;
  bossWins: number;
  upgrades: {
    catchChance: number;
    rareBugLuck: number;
    bugStrength: number;
  };
}

export type BattleAction = 'attack' | 'defense' | 'speed';

export interface BattleTurn {
  playerAction: BattleAction;
  npcAction: BattleAction;
  result: string;
  playerHealth: number;
  npcHealth: number;
  playerStunned: boolean;
  npcStunned: boolean;
}
