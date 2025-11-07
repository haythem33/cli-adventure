/**
 * CLI-related type definitions
 */

/**
 * Type for different display styles
 */
export type DisplayStyle = 'normal' | 'highlight' | 'warning' | 'success' | 'error';

/**
 * Interface for CLI display utilities
 */
export interface CLIDisplay {
  showText(text: string, style?: DisplayStyle): void;
  showTitle(title: string): void;
  showChoices(choices: any[]): void;
  clear(): void;
}
