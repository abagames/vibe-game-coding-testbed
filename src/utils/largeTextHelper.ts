import { smallTextPatterns } from "./textPatternSmall.js";
import { CellAttributes } from "../core/coreTypes.js";

const CHARACTER_CELL_WIDTH = 4; // Total width for one large character (pattern + 1 space)
const CHARACTER_HEIGHT = 5; // Height of the patterns

/**
 * Calculates the Y offset needed to align the bottom of a character pattern.
 * This is used to make lowercase letters align with uppercase letters at the bottom.
 * @param patternLines The pattern lines for the character.
 * @returns The Y offset to apply when drawing the character.
 */
function calculateBottomAlignmentOffset(patternLines: string[]): number {
  // Find the last line that contains any 'l' characters
  let lastContentLine = -1;
  for (let i = patternLines.length - 1; i >= 0; i--) {
    if (patternLines[i].includes("l")) {
      lastContentLine = i;
      break;
    }
  }

  // If no content found, no offset needed
  if (lastContentLine === -1) {
    return 0;
  }

  // Calculate offset to align bottom of content with bottom of 5-line cell
  // CHARACTER_HEIGHT - 1 is the bottom line index (0-based)
  const bottomLineIndex = CHARACTER_HEIGHT - 1;
  return bottomLineIndex - lastContentLine;
}

/**
 * Retrieves the 5-line pattern for a given character.
 * Each line in the returned array represents a row of the character pattern.
 * @param char The character to get the pattern for.
 * @returns A string array representing the pattern, or null if not found.
 */
function getPatternForChar(char: string): string[] | null {
  const charCode = char.charCodeAt(0);
  const patternIndex = charCode - 33; // ASCII '!' is 33 and corresponds to index 0

  // Check if the character code is outside the expected range or if index is out of bounds
  if (patternIndex < 0 || patternIndex >= smallTextPatterns.length) {
    // Also handles charCodes less than 33
    return null;
  }

  const patternString = smallTextPatterns[patternIndex];
  // Check if a pattern string exists for this index (handles undefined/empty entries)
  if (!patternString) {
    return null;
  }

  // Patterns in smallTextPatterns have leading/trailing newlines and are 5 lines high.
  // Trim the string, then split by newline.
  const trimmedPattern = patternString.trim();
  const lines = trimmedPattern.split("\n");

  // Ensure all patterns are treated as 5 lines, padding with empty strings if necessary for parsing.
  // This also helps normalize patterns that might be shorter than 5 lines in definition.
  const fixedHeightPattern: string[] = [];
  for (let i = 0; i < CHARACTER_HEIGHT; i++) {
    fixedHeightPattern.push(lines[i] || "");
  }
  return fixedHeightPattern;
}

/**
 * Draws large text on the virtual screen using patterns.
 * Each character of the input text is rendered as a 3x5 pattern
 * within a 4x5 cell (3 for pattern, 1 for spacing).
 *
 * @param game The BaseGame instance to draw on.
 * @param text The string to draw.
 * @param startX The starting X coordinate for the top-left of the first character.
 * @param startY The starting Y coordinate for the top-left of the first character.
 * @param fillCharacter The character to use for the "pixels" of the large text.
 * @param attributes Optional CellAttributes to apply to the drawn characters.
 */
export function drawLargeText(
  drawText: (
    text: string,
    x: number,
    y: number,
    attributes?: CellAttributes
  ) => void,
  text: string,
  startX: number,
  startY: number,
  fillCharacter: string,
  attributes?: CellAttributes
): void {
  let currentX = startX;

  for (const char of text) {
    if (char === " ") {
      currentX += CHARACTER_CELL_WIDTH; // Advance for space character
      continue;
    }

    const patternLines = getPatternForChar(char);

    if (!patternLines) {
      console.warn(
        `[drawLargeText] No pattern found for character: '${char}' (ASCII: ${char.charCodeAt(
          0
        )})`
      );
      currentX += CHARACTER_CELL_WIDTH; // Skip character but advance for its cell
      continue;
    }

    // Calculate Y offset for bottom alignment (especially for lowercase letters)
    const yOffset = calculateBottomAlignmentOffset(patternLines);

    for (let lineIndex = 0; lineIndex < patternLines.length; lineIndex++) {
      const line = patternLines[lineIndex];
      for (let xOffset = 0; xOffset < line.length; xOffset++) {
        if (line[xOffset] === "l") {
          drawText(
            fillCharacter,
            currentX + xOffset,
            startY + lineIndex + yOffset,
            attributes
          );
        }
      }
    }
    currentX += CHARACTER_CELL_WIDTH; // Advance for the next character position
  }
}
