import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import { CLIDisplay, DisplayStyle } from './types';
import { Choice } from '../game/types';

/**
 * CLI utility class for handling user input and output
 */
export class CLIManager implements CLIDisplay {
  /**
   * Display text with optional styling
   */
  showText(text: string, style: DisplayStyle = 'normal'): void {
    let styledText: string;

    switch (style) {
      case 'highlight':
        styledText = chalk.cyan(text);
        break;
      case 'warning':
        styledText = chalk.yellow(text);
        break;
      case 'success':
        styledText = chalk.green(text);
        break;
      case 'error':
        styledText = chalk.red(text);
        break;
      default:
        styledText = text;
    }

    console.log(styledText);
  }

  /**
   * Display a fancy title using figlet
   */
  showTitle(title: string): void {
    console.log(chalk.cyan(figlet.textSync(title, { horizontalLayout: 'full' })));
  }

  /**
   * Display choices to the user
   */
  showChoices(choices: Choice[]): void {
    console.log('\n' + chalk.yellow('What do you choose?'));
    choices.forEach((choice, index) => {
      console.log(chalk.white(`${index + 1}. ${choice.text}`));
    });
    console.log();
  }

  /**
   * Clear the console
   */
  clear(): void {
    console.clear();
  }

  /**
   * Get user input for name
   */
  async askForName(): Promise<string> {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your name, brave adventurer?',
        validate: (input: string) => {
          if (input.trim().length === 0) {
            return 'Please enter a valid name.';
          }
          return true;
        },
      },
    ]);
    return name.trim();
  }

  /**
   * Get user choice selection
   */
  async askForChoice(choices: Choice[]): Promise<number> {
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Select your choice:',
        choices: choices.map((choice, index) => ({
          name: `${index + 1}. ${choice.text}`,
          value: index,
        })),
      },
    ]);
    return choice;
  }

  /**
   * Ask if user wants to play again
   */
  async askPlayAgain(): Promise<boolean> {
    const { playAgain } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'playAgain',
        message: 'Would you like to play again?',
        default: true,
      },
    ]);
    return playAgain;
  }

  /**
   * Display game statistics
   */
  showStats(stats: { [key: string]: number }, inventory: string[]): void {
    console.log(chalk.blue('\n--- Your Status ---'));
    
    if (Object.keys(stats).length > 0) {
      console.log(chalk.blue('Stats:'));
      Object.entries(stats).forEach(([key, value]) => {
        console.log(chalk.white(`  ${key}: ${value}`));
      });
    }

    if (inventory.length > 0) {
      console.log(chalk.blue('Inventory:'));
      inventory.forEach(item => {
        console.log(chalk.white(`  - ${item}`));
      });
    }
    
    console.log(chalk.blue('-------------------\n'));
  }

  /**
   * Show a welcome message
   */
  showWelcome(): void {
    this.clear();
    this.showTitle('Adventure');
    console.log(chalk.cyan('Welcome to the CLI Adventure Game!'));
    console.log(chalk.white('An interactive text-based adventure where your choices matter.\n'));
  }

  /**
   * Show ending message
   */
  showEnding(endingType: 'good' | 'bad' | 'neutral' = 'neutral'): void {
    console.log('\n' + '='.repeat(50));
    
    switch (endingType) {
      case 'good':
        console.log(chalk.green('🎉 CONGRATULATIONS! 🎉'));
        console.log(chalk.green('You achieved a good ending!'));
        break;
      case 'bad':
        console.log(chalk.red('💀 GAME OVER 💀'));
        console.log(chalk.red('You reached a bad ending...'));
        break;
      default:
        console.log(chalk.blue('🏁 THE END 🏁'));
        console.log(chalk.blue('You completed the adventure!'));
    }
    
    console.log('='.repeat(50) + '\n');
  }

  /**
   * Show a pause message
   */
  async pause(message: string = 'Press Enter to continue...'): Promise<void> {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: chalk.gray(message),
      },
    ]);
  }
}