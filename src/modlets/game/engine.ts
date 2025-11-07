import { GameState, StoryNode, Choice, AdventureStory } from './types';
import { CLIManager } from '../cli/manager';

/**
 * Main game engine that handles the adventure game logic
 */
export class AdventureEngine {
  private gameState: GameState;
  private story: AdventureStory;
  private cli: CLIManager;

  constructor(story: AdventureStory, cli: CLIManager) {
    this.story = story;
    this.cli = cli;
    this.gameState = this.initializeGameState();
  }

  /**
   * Initialize the game state
   */
  private initializeGameState(): GameState {
    return {
      currentNodeId: this.story.startNodeId,
      inventory: [...this.story.initialState.inventory],
      stats: { ...this.story.initialState.stats },
      visitedNodes: [],
      isGameOver: false,
      playerName: this.story.initialState.playerName,
    };
  }

  /**
   * Start the adventure game
   */
  async startAdventure(): Promise<void> {
    this.cli.showWelcome();
    
    // Get player name
    this.gameState.playerName = await this.cli.askForName();
    this.cli.showText(`Welcome, ${this.gameState.playerName}! Your adventure begins now...`, 'highlight');
    
    // Show story description
    this.cli.showText(`\n${this.story.description}\n`);
    
    await this.cli.pause();
    
    // Start the main game loop
    await this.gameLoop();
  }

  /**
   * Main game loop
   */
  private async gameLoop(): Promise<void> {
    while (!this.gameState.isGameOver) {
      const currentNode = this.getCurrentNode();
      
      if (!currentNode) {
        this.cli.showText('Error: Invalid story node!', 'error');
        break;
      }

      // Add current node to visited nodes
      if (!this.gameState.visitedNodes.includes(currentNode.id)) {
        this.gameState.visitedNodes.push(currentNode.id);
      }

      // Clear screen and show current status
      this.cli.clear();
      this.cli.showStats(this.gameState.stats, this.gameState.inventory);
      
      // Display the current story text
      this.cli.showText(currentNode.text);
      
      // Check if this is an ending node
      if (currentNode.isEnding) {
        this.handleEnding(currentNode);
        break;
      }

      // Get available choices (filter by requirements)
      const availableChoices = this.getAvailableChoices(currentNode.choices);
      
      if (availableChoices.length === 0) {
        this.cli.showText('No available choices! The adventure ends here.', 'warning');
        break;
      }

      // Show choices and get player input
      this.cli.showChoices(availableChoices);
      const choiceIndex = await this.cli.askForChoice(availableChoices);
      const selectedChoice = availableChoices[choiceIndex];

      // Process the choice
      await this.processChoice(selectedChoice);
    }

    // Ask if player wants to play again
    if (await this.cli.askPlayAgain()) {
      this.resetGame();
      await this.startAdventure();
    }
  }

  /**
   * Get the current story node
   */
  private getCurrentNode(): StoryNode | undefined {
    return this.story.nodes[this.gameState.currentNodeId];
  }

  /**
   * Filter choices based on requirements
   */
  private getAvailableChoices(choices: Choice[]): Choice[] {
    return choices.filter(choice => {
      if (!choice.requirement) return true;
      
      // Check inventory requirements
      if (choice.requirement.startsWith('has_')) {
        const item = choice.requirement.substring(4);
        return this.gameState.inventory.includes(item);
      }
      
      // Check stat requirements
      if (choice.requirement.includes('>=')) {
        const [stat, value] = choice.requirement.split('>=');
        return (this.gameState.stats[stat.trim()] || 0) >= parseInt(value.trim());
      }
      
      // Check visited node requirements
      if (choice.requirement.startsWith('visited_')) {
        const nodeId = choice.requirement.substring(8);
        return this.gameState.visitedNodes.includes(nodeId);
      }
      
      return true;
    });
  }

  /**
   * Process a player's choice
   */
  private async processChoice(choice: Choice): Promise<void> {
    // Apply consequences
    if (choice.consequence) {
      // Add items to inventory
      if (choice.consequence.addToInventory) {
        choice.consequence.addToInventory.forEach(item => {
          if (!this.gameState.inventory.includes(item)) {
            this.gameState.inventory.push(item);
            this.cli.showText(`You obtained: ${item}`, 'success');
          }
        });
      }

      // Remove items from inventory
      if (choice.consequence.removeFromInventory) {
        choice.consequence.removeFromInventory.forEach(item => {
          const index = this.gameState.inventory.indexOf(item);
          if (index > -1) {
            this.gameState.inventory.splice(index, 1);
            this.cli.showText(`You lost: ${item}`, 'warning');
          }
        });
      }

      // Modify stats
      if (choice.consequence.modifyStats) {
        Object.entries(choice.consequence.modifyStats).forEach(([stat, change]) => {
          const oldValue = this.gameState.stats[stat] || 0;
          const newValue = oldValue + change;
          this.gameState.stats[stat] = Math.max(0, newValue); // Prevent negative stats
          
          if (change > 0) {
            this.cli.showText(`${stat.charAt(0).toUpperCase() + stat.slice(1)} increased by ${change}!`, 'success');
          } else if (change < 0) {
            this.cli.showText(`${stat.charAt(0).toUpperCase() + stat.slice(1)} decreased by ${Math.abs(change)}!`, 'warning');
          }
        });
      }

      // Pause to let player read consequences
      if (choice.consequence.addToInventory || choice.consequence.removeFromInventory || choice.consequence.modifyStats) {
        await this.cli.pause();
      }
    }

    // Move to next node
    this.gameState.currentNodeId = choice.nextNodeId;
    
    // Check for death conditions
    if (this.gameState.stats.health <= 0) {
      this.handleDeath();
    }
  }

  /**
   * Handle game ending
   */
  private handleEnding(node: StoryNode): void {
    this.cli.showEnding(node.endingType);
    this.gameState.isGameOver = true;
  }

  /**
   * Handle player death
   */
  private handleDeath(): void {
    this.cli.showText('\n💀 Your health has reached zero! 💀', 'error');
    this.cli.showText(`${this.gameState.playerName}, your adventure ends here...`, 'error');
    this.cli.showEnding('bad');
    this.gameState.isGameOver = true;
  }

  /**
   * Reset the game state for a new playthrough
   */
  private resetGame(): void {
    this.gameState = this.initializeGameState();
  }

  /**
   * Get current game state (for debugging or save/load functionality)
   */
  getGameState(): GameState {
    return { ...this.gameState };
  }

  /**
   * Load a specific game state (for save/load functionality)
   */
  loadGameState(state: GameState): void {
    this.gameState = { ...state };
  }

  /**
   * Get story information
   */
  getStoryInfo(): { title: string; description: string } {
    return {
      title: this.story.title,
      description: this.story.description,
    };
  }
}