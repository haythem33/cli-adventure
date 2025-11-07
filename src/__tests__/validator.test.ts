/**
 * Tests for Story Validator (nested modlet)
 * Demonstrates testing the nested modlet functionality
 */

import { describe, it, expect } from '@jest/globals';
import { StoryValidator } from '../modlets/story/validators';
import { mysteriousForestAdventure } from '../modlets/story';
import { AdventureStory } from '../modlets/game/types';

describe('Story Validator Tests (Nested Modlet)', () => {
  describe('Story Validation', () => {
    it('should validate the mysterious forest adventure', () => {
      const result = StoryValidator.validate(mysteriousForestAdventure);
      
      expect(result).toBeDefined();
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    it('should detect missing start node', () => {
      const invalidStory: AdventureStory = {
        title: 'Invalid Story',
        description: 'Test story',
        startNodeId: 'nonexistent',
        nodes: {
          start: {
            id: 'start',
            text: 'Start',
            choices: [],
          },
        },
        initialState: {
          inventory: [],
          stats: {},
          playerName: '',
        },
      };

      const result = StoryValidator.validate(invalidStory);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Start node 'nonexistent' does not exist");
    });

    it('should detect missing ending nodes', () => {
      const storyWithoutEnding: AdventureStory = {
        title: 'No Ending Story',
        description: 'Test story',
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            text: 'Start',
            choices: [],
          },
        },
        initialState: {
          inventory: [],
          stats: {},
          playerName: '',
        },
      };

      const result = StoryValidator.validate(storyWithoutEnding);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Story has no ending nodes');
    });

    it('should warn about missing referenced nodes', () => {
      const storyWithMissingNode: AdventureStory = {
        title: 'Missing Node Story',
        description: 'Test story',
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            text: 'Start',
            choices: [
              {
                text: 'Go to missing node',
                nextNodeId: 'missing',
              },
            ],
            isEnding: true,
            endingType: 'good',
          },
        },
        initialState: {
          inventory: [],
          stats: {},
          playerName: '',
        },
      };

      const result = StoryValidator.validate(storyWithMissingNode);
      expect(result.isValid).toBe(true); // Valid but with warnings
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('Missing nodes referenced');
    });

    it('should detect unreachable nodes when requested', () => {
      const storyWithUnreachable: AdventureStory = {
        title: 'Unreachable Node Story',
        description: 'Test story',
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            text: 'Start',
            choices: [],
            isEnding: true,
            endingType: 'good',
          },
          unreachable: {
            id: 'unreachable',
            text: 'Cannot reach here',
            choices: [],
            isEnding: true,
            endingType: 'bad',
          },
        },
        initialState: {
          inventory: [],
          stats: {},
          playerName: '',
        },
      };

      const result = StoryValidator.validate(storyWithUnreachable, {
        checkUnreachableNodes: true,
      });
      
      expect(result.warnings.some(w => w.includes('Unreachable nodes'))).toBe(true);
    });
  });

  describe('Story Statistics', () => {
    it('should calculate story statistics', () => {
      const stats = StoryValidator.getStatistics(mysteriousForestAdventure);
      
      expect(stats.totalNodes).toBeGreaterThan(0);
      expect(stats.totalChoices).toBeGreaterThan(0);
      expect(stats.endingNodes).toBeGreaterThan(0);
      expect(stats.averageChoicesPerNode).toBeGreaterThan(0);
    });

    it('should correctly count ending nodes', () => {
      const stats = StoryValidator.getStatistics(mysteriousForestAdventure);
      
      const endingNodes = Object.values(mysteriousForestAdventure.nodes).filter(
        node => node.isEnding
      );
      
      expect(stats.endingNodes).toBe(endingNodes.length);
    });

    it('should calculate average choices correctly', () => {
      const simpleStory: AdventureStory = {
        title: 'Simple Story',
        description: 'Test',
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            text: 'Start',
            choices: [
              { text: 'Choice 1', nextNodeId: 'end' },
              { text: 'Choice 2', nextNodeId: 'end' },
            ],
          },
          end: {
            id: 'end',
            text: 'End',
            choices: [],
            isEnding: true,
            endingType: 'good',
          },
        },
        initialState: {
          inventory: [],
          stats: {},
          playerName: '',
        },
      };

      const stats = StoryValidator.getStatistics(simpleStory);
      expect(stats.averageChoicesPerNode).toBe(1); // (2 + 0) / 2 = 1
    });
  });

  describe('Validator Integration with Story', () => {
    it('should validate that the main story is structurally sound', () => {
      const result = StoryValidator.validate(mysteriousForestAdventure, {
        checkMissingNodes: true,
        checkUnreachableNodes: false,
      });

      // Main story should have no critical errors
      expect(result.isValid).toBe(true);
      
      // But may have warnings about incomplete paths (which is expected)
      if (result.warnings.length > 0) {
        console.log(`Story has ${result.warnings.length} warning(s): ${result.warnings.join('; ')}`);
      }
    });
  });
});
