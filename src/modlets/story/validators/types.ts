/**
 * Story validator types
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface StoryValidationOptions {
  checkMissingNodes?: boolean;
  checkCircularReferences?: boolean;
  checkUnreachableNodes?: boolean;
}
