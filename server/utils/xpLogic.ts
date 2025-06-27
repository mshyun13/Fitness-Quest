export const XP_FOR_LEVELING = 10 // XP required to go from Level 1 to Level 2
export const GROWTH_FACTOR = 1.05 // How much XP required increases per level (1.05 = 5% increase)

// Calculates XP required to reach the start of a given level
export function getXpForLeveling(level: number): number {
  if (level <= 1) {
    return 0 // Level 1 requires 0 XP to start
  }
  let xpRequired = 0
  for (let i = 1; i < level; i++) {
    xpRequired += calculateXpToCompleteLevel(i)
  }
  return Math.floor(xpRequired)
}

// Calculates XP required to complete a level to reach the next one
export function calculateXpToCompleteLevel(level: number): number {
  if (level < 1) {
    return 0
  }
  // Starting XP * (Growth Factor)^(Level - 1)
  return XP_FOR_LEVELING * Math.pow(GROWTH_FACTOR, level - 1)
}

// Determines the level of a user based on their total XP
export function getLevelFromTotalXp(totalXp: number): number {
  let level = 1
  let accumulatedXpForNextLevel = 0 // Total XP needed to reach the next level

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const xpToCompleteCurrentLevel = calculateXpToCompleteLevel(level)

    // If current level is 1 and XP is less than 10, stay at Level 1, else move to the next level
    if (totalXp < accumulatedXpForNextLevel + xpToCompleteCurrentLevel) {
      break // If not enough XP for the next level
    }
    accumulatedXpForNextLevel += xpToCompleteCurrentLevel
    level++
  }
  return level
}
