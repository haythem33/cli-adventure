/**
 * Game-related type definitions
 */

/**
 * Represents a choice that the player can make in the story
 */
export interface Choice {
  /** The text displayed to the player for this choice */
  text: string;
  /** The ID of the story node this choice leads to */
  nextNodeId: string;
  /** Optional requirement that must be met to show this choice */
  requirement?: string;
  /** Optional consequence of choosing this option */
  consequence?: {
    /** Items to add to inventory */
    addToInventory?: string[];
    /** Items to remove from inventory */
    removeFromInventory?: string[];
    /** Stats to modify */
    modifyStats?: { [key: string]: number };
  };
}

/**
 * Represents a node in the story tree
 */
export interface StoryNode {
  /** Unique identifier for this story node */
  id: string;
  /** The main text content of this story node */
  text: string;
  /** Available choices from this node */
  choices: Choice[];
  /** Whether this is an ending node */
  isEnding?: boolean;
  /** Type of ending (if this is an ending node) */
  endingType?: 'good' | 'bad' | 'neutral';
  /** Optional requirements to access this node */
  requirements?: string[];
}

/**
 * Represents the current state of the game
 */
export interface GameState {
  /** Current story node ID */
  currentNodeId: string;
  /** Player's inventory */
  inventory: string[];
  /** Player statistics */
  stats: { [key: string]: number };
  /** History of visited nodes */
  visitedNodes: string[];
  /** Whether the game has ended */
  isGameOver: boolean;
  /** Player's name (if collected) */
  playerName?: string;
}

/**
 * Configuration for the entire adventure story
 */
export interface AdventureStory {
  /** Title of the adventure */
  title: string;
  /** Description of the adventure */
  description: string;
  /** Starting node ID */
  startNodeId: string;
  /** All story nodes */
  nodes: { [key: string]: StoryNode };
  /** Initial game state */
  initialState: Omit<GameState, 'currentNodeId' | 'visitedNodes' | 'isGameOver'>;
}
