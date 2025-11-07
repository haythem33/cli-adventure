/**
 * Story validators - Validates story structure and integrity
 * This is a nested modlet within the story modlet
 */

import { AdventureStory } from '../../game/types';
import { ValidationResult, StoryValidationOptions } from './types';

/**
 * Validates an adventure story structure
 */
export class StoryValidator {
  /**
   * Validate a story for structural integrity
   */
  static validate(
    story: AdventureStory,
    options: StoryValidationOptions = {}
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if start node exists
    if (!story.nodes[story.startNodeId]) {
      errors.push(`Start node '${story.startNodeId}' does not exist`);
    }

    // Check for missing nodes if requested
    if (options.checkMissingNodes !== false) {
      const missingNodes = this.findMissingNodes(story);
      if (missingNodes.length > 0) {
        warnings.push(`Missing nodes referenced: ${missingNodes.join(', ')}`);
      }
    }

    // Check for unreachable nodes if requested
    if (options.checkUnreachableNodes) {
      const unreachableNodes = this.findUnreachableNodes(story);
      if (unreachableNodes.length > 0) {
        warnings.push(`Unreachable nodes found: ${unreachableNodes.join(', ')}`);
      }
    }

    // Check for at least one ending
    const hasEnding = Object.values(story.nodes).some(node => node.isEnding);
    if (!hasEnding) {
      errors.push('Story has no ending nodes');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Find nodes that are referenced but don't exist
   */
  private static findMissingNodes(story: AdventureStory): string[] {
    const existingNodeIds = Object.keys(story.nodes);
    const missingNodes = new Set<string>();

    Object.values(story.nodes).forEach(node => {
      node.choices.forEach(choice => {
        if (!existingNodeIds.includes(choice.nextNodeId)) {
          missingNodes.add(choice.nextNodeId);
        }
      });
    });

    return Array.from(missingNodes);
  }

  /**
   * Find nodes that cannot be reached from the start node
   */
  private static findUnreachableNodes(story: AdventureStory): string[] {
    const reachableNodes = new Set<string>();
    const toVisit = [story.startNodeId];

    while (toVisit.length > 0) {
      const currentNodeId = toVisit.pop()!;
      if (reachableNodes.has(currentNodeId)) continue;

      reachableNodes.add(currentNodeId);
      const currentNode = story.nodes[currentNodeId];

      if (currentNode) {
        currentNode.choices.forEach(choice => {
          if (!reachableNodes.has(choice.nextNodeId)) {
            toVisit.push(choice.nextNodeId);
          }
        });
      }
    }

    return Object.keys(story.nodes).filter(nodeId => !reachableNodes.has(nodeId));
  }

  /**
   * Get story statistics
   */
  static getStatistics(story: AdventureStory): {
    totalNodes: number;
    totalChoices: number;
    endingNodes: number;
    averageChoicesPerNode: number;
  } {
    const nodes = Object.values(story.nodes);
    const totalChoices = nodes.reduce((sum, node) => sum + node.choices.length, 0);
    const endingNodes = nodes.filter(node => node.isEnding).length;

    return {
      totalNodes: nodes.length,
      totalChoices,
      endingNodes,
      averageChoicesPerNode: totalChoices / nodes.length || 0,
    };
  }
}
