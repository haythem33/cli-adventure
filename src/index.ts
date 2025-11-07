#!/usr/bin/env node

import { AdventureEngine } from './modlets/game';
import { CLIManager } from './modlets/cli';
import { mysteriousForestAdventure } from './modlets/story';

/**
 * Main entry point for the CLI Adventure Game
 */
async function main(): Promise<void> {
  try {
    // Check command line arguments
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      showHelp();
      return;
    }
    
    if (args.includes('--version') || args.includes('-v')) {
      showVersion();
      return;
    }

    // Initialize CLI manager and game engine
    const cli = new CLIManager();
    const engine = new AdventureEngine(mysteriousForestAdventure, cli);
    
    // Start the adventure
    await engine.startAdventure();
    
  } catch (error) {
    console.error('❌ An error occurred:', error);
    process.exit(1);
  }
}

/**
 * Show help information
 */
function showHelp(): void {
  console.log(`
CLI Adventure Game - Choose Your Own Adventure

Usage:
  cli-adventure              Start the adventure game
  cli-adventure --help       Show this help message
  cli-adventure --version    Show version information

About:
  An interactive text-based adventure game where your choices matter.
  Navigate through a mysterious forest, make crucial decisions, and
  discover multiple endings based on your actions.

Controls:
  - Use arrow keys to navigate menu options
  - Press Enter to select
  - Follow the on-screen prompts

Features:
  - Multiple story paths and endings
  - Character stats and inventory system
  - Immersive storytelling with consequences
  - Colorful CLI interface

Happy adventuring! 🗡️✨
`);
}

/**
 * Show version information
 */
function showVersion(): void {
  const packageJson = require('../package.json');
  console.log(`CLI Adventure Game v${packageJson.version}`);
}

/**
 * Handle graceful shutdown
 */
function setupGracefulShutdown(): void {
  process.on('SIGINT', () => {
    console.log('\n\n👋 Thanks for playing! Adventure awaits another day...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n\n👋 Adventure interrupted. Until next time!');
    process.exit(0);
  });
}

// Set up graceful shutdown handlers
setupGracefulShutdown();

// Run the main function
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}