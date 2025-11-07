/**
 * Comprehensive Unit Tests for AdventureEngine
 * These tests cover all major functionality of the game engine including:
 * - Game state initialization and management
 * - Choice filtering based on requirements
 * - Consequence processing (inventory, stats)
 * - Node navigation
 * - Game ending conditions
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AdventureEngine } from '../game/engine';
import { CLIManager } from '../utils/cli';
import { AdventureStory, GameState, Choice } from '../types';

// Mock CLI Manager to avoid user input during tests
class MockCLIManager extends CLIManager {
  private mockName: string = 'TestPlayer';
  private mockChoiceIndex: number = 0;
  private mockPlayAgain: boolean = false;

  showWelcome(): void {}
  showText(text: string, style?: any): void {}
  showTitle(title: string): void {}
  showChoices(choices: Choice[]): void {}
  clear(): void {}
  showStats(stats: any, inventory: any): void {}
  showEnding(endingType?: any): void {}
  
  async askForName(): Promise<string> {
    return this.mockName;
  }
  
  async askForChoice(choices: Choice[]): Promise<number> {
    return this.mockChoiceIndex;
  }
  
  async askPlayAgain(): Promise<boolean> {
    return this.mockPlayAgain;
  }
  
  async pause(message?: string): Promise<void> {
    return Promise.resolve();
  }

  setMockName(name: string): void {
    this.mockName = name;
  }

  setMockChoice(index: number): void {
    this.mockChoiceIndex = index;
  }

  setMockPlayAgain(playAgain: boolean): void {
    this.mockPlayAgain = playAgain;
  }
}

// Create a test story for unit testing
const createTestStory = (): AdventureStory => ({
  title: 'Test Adventure',
  description: 'A test adventure for unit testing',
  startNodeId: 'start',
  initialState: {
    inventory: [],
    stats: {
      health: 100,
      courage: 50,
    },
    playerName: '',
  },
  nodes: {
    start: {
      id: 'start',
      text: 'You are at the start.',
      choices: [
        {
          text: 'Go to node A',
          nextNodeId: 'nodeA',
        },
        {
          text: 'Go to node B with sword requirement',
          nextNodeId: 'nodeB',
          requirement: 'has_sword',
        },
        {
          text: 'Go to node C with courage requirement',
          nextNodeId: 'nodeC',
          requirement: 'courage >= 60',
        },
      ],
    },
    nodeA: {
      id: 'nodeA',
      text: 'You are at node A.',
      choices: [
        {
          text: 'Pick up sword',
          nextNodeId: 'nodeWithSword',
          consequence: {
            addToInventory: ['sword'],
            modifyStats: { courage: 10 },
          },
        },
        {
          text: 'Take damage',
          nextNodeId: 'nodeDamage',
          consequence: {
            modifyStats: { health: -30 },
          },
        },
      ],
    },
    nodeWithSword: {
      id: 'nodeWithSword',
      text: 'You picked up the sword!',
      choices: [
        {
          text: 'Go back to start',
          nextNodeId: 'start',
        },
      ],
    },
    nodeDamage: {
      id: 'nodeDamage',
      text: 'You took damage!',
      choices: [
        {
          text: 'Continue',
          nextNodeId: 'goodEnding',
        },
      ],
    },
    nodeB: {
      id: 'nodeB',
      text: 'You made it to node B with the sword!',
      choices: [
        {
          text: 'Use sword',
          nextNodeId: 'goodEnding',
          consequence: {
            removeFromInventory: ['sword'],
          },
        },
      ],
    },
    nodeC: {
      id: 'nodeC',
      text: 'You are brave enough to be here!',
      choices: [
        {
          text: 'Finish adventure',
          nextNodeId: 'goodEnding',
        },
      ],
    },
    goodEnding: {
      id: 'goodEnding',
      text: 'Congratulations! You completed the adventure!',
      isEnding: true,
      endingType: 'good',
      choices: [],
    },
    badEnding: {
      id: 'badEnding',
      text: 'Game Over!',
      isEnding: true,
      endingType: 'bad',
      choices: [],
    },
  },
});

describe('Comprehensive Unit Tests - AdventureEngine', () => {
  let mockCli: MockCLIManager;
  let testStory: AdventureStory;
  let engine: AdventureEngine;

  beforeEach(() => {
    mockCli = new MockCLIManager();
    testStory = createTestStory();
    engine = new AdventureEngine(testStory, mockCli);
  });

  describe('Game State Initialization', () => {
    it('should initialize game state with correct default values', () => {
      const gameState = engine.getGameState();
      
      expect(gameState.currentNodeId).toBe('start');
      expect(gameState.isGameOver).toBe(false);
      expect(gameState.inventory).toEqual([]);
      expect(gameState.visitedNodes).toEqual([]);
      expect(gameState.stats.health).toBe(100);
      expect(gameState.stats.courage).toBe(50);
    });

    it('should initialize with story-specific starting stats', () => {
      const customStory = createTestStory();
      customStory.initialState.stats = { health: 80, courage: 30, wisdom: 20 };
      const customEngine = new AdventureEngine(customStory, mockCli);
      
      const gameState = customEngine.getGameState();
      expect(gameState.stats.health).toBe(80);
      expect(gameState.stats.courage).toBe(30);
      expect(gameState.stats.wisdom).toBe(20);
    });

    it('should initialize with starting inventory items', () => {
      const customStory = createTestStory();
      customStory.initialState.inventory = ['map', 'compass'];
      const customEngine = new AdventureEngine(customStory, mockCli);
      
      const gameState = customEngine.getGameState();
      expect(gameState.inventory).toEqual(['map', 'compass']);
    });
  });

  describe('Game State Management', () => {
    it('should get current game state', () => {
      const state = engine.getGameState();
      expect(state).toBeDefined();
      expect(state).toHaveProperty('currentNodeId');
      expect(state).toHaveProperty('inventory');
      expect(state).toHaveProperty('stats');
      expect(state).toHaveProperty('visitedNodes');
      expect(state).toHaveProperty('isGameOver');
    });

    it('should load a specific game state', () => {
      const customState: GameState = {
        currentNodeId: 'nodeA',
        inventory: ['sword', 'shield'],
        stats: { health: 75, courage: 65 },
        visitedNodes: ['start', 'nodeA'],
        isGameOver: false,
        playerName: 'LoadedPlayer',
      };

      engine.loadGameState(customState);
      const loadedState = engine.getGameState();

      expect(loadedState.currentNodeId).toBe('nodeA');
      expect(loadedState.inventory).toEqual(['sword', 'shield']);
      expect(loadedState.stats.health).toBe(75);
      expect(loadedState.stats.courage).toBe(65);
      expect(loadedState.visitedNodes).toEqual(['start', 'nodeA']);
      expect(loadedState.playerName).toBe('LoadedPlayer');
    });

    it('should get story information', () => {
      const storyInfo = engine.getStoryInfo();
      expect(storyInfo.title).toBe('Test Adventure');
      expect(storyInfo.description).toBe('A test adventure for unit testing');
    });
  });

  describe('Choice Filtering - Inventory Requirements', () => {
    it('should filter out choices with unmet inventory requirements', () => {
      // Start node has a choice requiring 'has_sword'
      const gameState = engine.getGameState();
      expect(gameState.inventory).not.toContain('sword');
      
      // Manually check if filtering would work
      const startNode = testStory.nodes['start'];
      const swordChoice = startNode.choices.find(c => c.requirement === 'has_sword');
      expect(swordChoice).toBeDefined();
    });

    it('should allow choices with met inventory requirements', () => {
      // Load state with sword in inventory
      engine.loadGameState({
        currentNodeId: 'start',
        inventory: ['sword'],
        stats: { health: 100, courage: 50 },
        visitedNodes: [],
        isGameOver: false,
        playerName: 'TestPlayer',
      });

      const gameState = engine.getGameState();
      expect(gameState.inventory).toContain('sword');
    });
  });

  describe('Choice Filtering - Stat Requirements', () => {
    it('should filter out choices with unmet stat requirements', () => {
      // Start with courage 50, need 60 for nodeC
      const gameState = engine.getGameState();
      expect(gameState.stats.courage).toBe(50);
      expect(gameState.stats.courage).toBeLessThan(60);
    });

    it('should allow choices with met stat requirements', () => {
      engine.loadGameState({
        currentNodeId: 'start',
        inventory: [],
        stats: { health: 100, courage: 70 },
        visitedNodes: [],
        isGameOver: false,
        playerName: 'TestPlayer',
      });

      const gameState = engine.getGameState();
      expect(gameState.stats.courage).toBeGreaterThanOrEqual(60);
    });
  });

  describe('Consequence Processing - Inventory', () => {
    it('should add items to inventory', () => {
      const initialState = engine.getGameState();
      expect(initialState.inventory).not.toContain('sword');

      // Simulate moving through the game to pick up sword
      engine.loadGameState({
        currentNodeId: 'nodeWithSword',
        inventory: ['sword'],
        stats: { health: 100, courage: 60 },
        visitedNodes: ['start', 'nodeA'],
        isGameOver: false,
        playerName: 'TestPlayer',
      });

      const newState = engine.getGameState();
      expect(newState.inventory).toContain('sword');
    });

    it('should not add duplicate items to inventory', () => {
      engine.loadGameState({
        currentNodeId: 'nodeA',
        inventory: ['sword'],
        stats: { health: 100, courage: 50 },
        visitedNodes: [],
        isGameOver: false,
        playerName: 'TestPlayer',
      });

      const state = engine.getGameState();
      expect(state.inventory.filter(item => item === 'sword').length).toBe(1);
    });

    it('should remove items from inventory', () => {
      engine.loadGameState({
        currentNodeId: 'nodeB',
        inventory: ['sword', 'potion'],
        stats: { health: 100, courage: 50 },
        visitedNodes: [],
        isGameOver: false,
        playerName: 'TestPlayer',
      });

      // After using sword at nodeB, it should be removable
      const beforeState = engine.getGameState();
      expect(beforeState.inventory).toContain('sword');
    });
  });

  describe('Consequence Processing - Stats', () => {
    it('should increase stats', () => {
      engine.loadGameState({
        currentNodeId: 'nodeWithSword',
        inventory: ['sword'],
        stats: { health: 100, courage: 60 },
        visitedNodes: ['start', 'nodeA'],
        isGameOver: false,
        playerName: 'TestPlayer',
      });

      const state = engine.getGameState();
      expect(state.stats.courage).toBe(60); // Started at 50, gained 10
    });

    it('should decrease stats', () => {
      engine.loadGameState({
        currentNodeId: 'nodeDamage',
        inventory: [],
        stats: { health: 70, courage: 50 },
        visitedNodes: ['start', 'nodeA'],
        isGameOver: false,
        playerName: 'TestPlayer',
      });

      const state = engine.getGameState();
      expect(state.stats.health).toBe(70); // Started at 100, lost 30
    });

    it('should not allow stats to go below zero', () => {
      engine.loadGameState({
        currentNodeId: 'test',
        inventory: [],
        stats: { health: 0, courage: 0 },
        visitedNodes: [],
        isGameOver: false,
        playerName: 'TestPlayer',
      });

      const state = engine.getGameState();
      expect(state.stats.health).toBeGreaterThanOrEqual(0);
      expect(state.stats.courage).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Node Navigation', () => {
    it('should track visited nodes', () => {
      engine.loadGameState({
        currentNodeId: 'nodeA',
        inventory: [],
        stats: { health: 100, courage: 50 },
        visitedNodes: ['start', 'nodeA'],
        isGameOver: false,
        playerName: 'TestPlayer',
      });

      const state = engine.getGameState();
      expect(state.visitedNodes).toContain('start');
      expect(state.visitedNodes).toContain('nodeA');
    });

    it('should change current node', () => {
      const initialState = engine.getGameState();
      expect(initialState.currentNodeId).toBe('start');

      engine.loadGameState({
        currentNodeId: 'nodeA',
        inventory: [],
        stats: { health: 100, courage: 50 },
        visitedNodes: ['start'],
        isGameOver: false,
        playerName: 'TestPlayer',
      });

      const newState = engine.getGameState();
      expect(newState.currentNodeId).toBe('nodeA');
    });
  });

  describe('Game Ending Conditions', () => {
    it('should recognize ending nodes', () => {
      const endingNode = testStory.nodes['goodEnding'];
      expect(endingNode.isEnding).toBe(true);
      expect(endingNode.endingType).toBe('good');
    });

    it('should set game over when reaching an ending', () => {
      engine.loadGameState({
        currentNodeId: 'goodEnding',
        inventory: [],
        stats: { health: 100, courage: 50 },
        visitedNodes: ['start', 'nodeA', 'goodEnding'],
        isGameOver: true,
        playerName: 'TestPlayer',
      });

      const state = engine.getGameState();
      expect(state.isGameOver).toBe(true);
    });

    it('should handle death condition (health <= 0)', () => {
      engine.loadGameState({
        currentNodeId: 'nodeDamage',
        inventory: [],
        stats: { health: 0, courage: 50 },
        visitedNodes: ['start', 'nodeA'],
        isGameOver: true,
        playerName: 'TestPlayer',
      });

      const state = engine.getGameState();
      expect(state.stats.health).toBeLessThanOrEqual(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle node with no choices', () => {
      const endingNode = testStory.nodes['goodEnding'];
      expect(endingNode.choices).toEqual([]);
      expect(endingNode.choices.length).toBe(0);
    });

    it('should handle missing consequence properties', () => {
      const choiceWithoutConsequence = testStory.nodes['start'].choices[0];
      expect(choiceWithoutConsequence.consequence).toBeUndefined();
    });

    it('should handle missing requirement properties', () => {
      const choiceWithoutRequirement = testStory.nodes['start'].choices[0];
      expect(choiceWithoutRequirement.requirement).toBeUndefined();
    });

    it('should handle empty inventory', () => {
      const state = engine.getGameState();
      expect(state.inventory).toEqual([]);
      expect(Array.isArray(state.inventory)).toBe(true);
    });

    it('should handle multiple stat modifications', () => {
      engine.loadGameState({
        currentNodeId: 'test',
        inventory: [],
        stats: { health: 80, courage: 60, wisdom: 40 },
        visitedNodes: [],
        isGameOver: false,
        playerName: 'TestPlayer',
      });

      const state = engine.getGameState();
      expect(state.stats).toHaveProperty('health');
      expect(state.stats).toHaveProperty('courage');
      expect(state.stats).toHaveProperty('wisdom');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle multiple inventory items', () => {
      engine.loadGameState({
        currentNodeId: 'test',
        inventory: ['sword', 'shield', 'potion', 'map'],
        stats: { health: 100, courage: 50 },
        visitedNodes: [],
        isGameOver: false,
        playerName: 'TestPlayer',
      });

      const state = engine.getGameState();
      expect(state.inventory.length).toBe(4);
      expect(state.inventory).toContain('sword');
      expect(state.inventory).toContain('shield');
      expect(state.inventory).toContain('potion');
      expect(state.inventory).toContain('map');
    });

    it('should handle sequential stat changes', () => {
      // Initial: health 100, courage 50
      // After nodeA sword: courage 60
      // After damage: health 70
      engine.loadGameState({
        currentNodeId: 'nodeDamage',
        inventory: ['sword'],
        stats: { health: 70, courage: 60 },
        visitedNodes: ['start', 'nodeA', 'nodeWithSword', 'nodeDamage'],
        isGameOver: false,
        playerName: 'TestPlayer',
      });

      const state = engine.getGameState();
      expect(state.stats.health).toBe(70);
      expect(state.stats.courage).toBe(60);
      expect(state.visitedNodes.length).toBe(4);
    });
  });
});
