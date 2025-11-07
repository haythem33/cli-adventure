/**
 * Smoke Tests - Basic tests to ensure all modules can be imported and instantiated
 * These tests verify that the basic structure and imports work correctly
 */

import { describe, it, expect } from '@jest/globals';
import { AdventureEngine } from '../modlets/game';
import { CLIManager } from '../modlets/cli';
import { mysteriousForestAdventure } from '../modlets/story';

describe('Smoke Tests - Module Loading', () => {
  describe('CLIManager Smoke Test', () => {
    it('should import and instantiate CLIManager without errors', () => {
      expect(() => {
        const cli = new CLIManager();
        expect(cli).toBeDefined();
        expect(cli).toBeInstanceOf(CLIManager);
      }).not.toThrow();
    });

    it('should have all required methods', () => {
      const cli = new CLIManager();
      expect(typeof cli.showText).toBe('function');
      expect(typeof cli.showTitle).toBe('function');
      expect(typeof cli.showChoices).toBe('function');
      expect(typeof cli.clear).toBe('function');
      expect(typeof cli.askForName).toBe('function');
      expect(typeof cli.askForChoice).toBe('function');
      expect(typeof cli.askPlayAgain).toBe('function');
      expect(typeof cli.showStats).toBe('function');
      expect(typeof cli.showWelcome).toBe('function');
      expect(typeof cli.showEnding).toBe('function');
      expect(typeof cli.pause).toBe('function');
    });
  });

  describe('AdventureEngine Smoke Test', () => {
    it('should import and instantiate AdventureEngine without errors', () => {
      expect(() => {
        const cli = new CLIManager();
        const engine = new AdventureEngine(mysteriousForestAdventure, cli);
        expect(engine).toBeDefined();
        expect(engine).toBeInstanceOf(AdventureEngine);
      }).not.toThrow();
    });

    it('should have all required methods', () => {
      const cli = new CLIManager();
      const engine = new AdventureEngine(mysteriousForestAdventure, cli);
      expect(typeof engine.startAdventure).toBe('function');
      expect(typeof engine.getGameState).toBe('function');
      expect(typeof engine.loadGameState).toBe('function');
      expect(typeof engine.getStoryInfo).toBe('function');
    });

    it('should initialize with correct game state', () => {
      const cli = new CLIManager();
      const engine = new AdventureEngine(mysteriousForestAdventure, cli);
      const gameState = engine.getGameState();
      
      expect(gameState).toBeDefined();
      expect(gameState.currentNodeId).toBe('start');
      expect(gameState.isGameOver).toBe(false);
      expect(gameState.inventory).toEqual([]);
      expect(gameState.visitedNodes).toEqual([]);
      expect(gameState.stats).toHaveProperty('health');
      expect(gameState.stats).toHaveProperty('courage');
      expect(gameState.stats).toHaveProperty('wisdom');
    });
  });

  describe('Story Data Smoke Test', () => {
    it('should import story data without errors', () => {
      expect(mysteriousForestAdventure).toBeDefined();
      expect(mysteriousForestAdventure.title).toBe('The Mysterious Forest');
      expect(mysteriousForestAdventure.startNodeId).toBe('start');
    });

    it('should have valid story structure', () => {
      expect(mysteriousForestAdventure.nodes).toBeDefined();
      expect(typeof mysteriousForestAdventure.nodes).toBe('object');
      expect(mysteriousForestAdventure.nodes['start']).toBeDefined();
      expect(Array.isArray(mysteriousForestAdventure.nodes['start'].choices)).toBe(true);
    });

    it('should have valid initial state', () => {
      expect(mysteriousForestAdventure.initialState).toBeDefined();
      expect(mysteriousForestAdventure.initialState.stats).toHaveProperty('health');
      expect(mysteriousForestAdventure.initialState.stats.health).toBeGreaterThan(0);
      expect(Array.isArray(mysteriousForestAdventure.initialState.inventory)).toBe(true);
    });
  });

  describe('Types Smoke Test', () => {
    it('should have properly typed story nodes', () => {
      const startNode = mysteriousForestAdventure.nodes['start'];
      expect(startNode.id).toBeDefined();
      expect(typeof startNode.id).toBe('string');
      expect(startNode.text).toBeDefined();
      expect(typeof startNode.text).toBe('string');
      expect(Array.isArray(startNode.choices)).toBe(true);
    });

    it('should have properly typed choices', () => {
      const startNode = mysteriousForestAdventure.nodes['start'];
      const firstChoice = startNode.choices[0];
      expect(firstChoice.text).toBeDefined();
      expect(typeof firstChoice.text).toBe('string');
      expect(firstChoice.nextNodeId).toBeDefined();
      expect(typeof firstChoice.nextNodeId).toBe('string');
    });
  });
});
