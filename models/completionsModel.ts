// Matching Completions Table
export interface Completion {
  id: number
  user_id: number
  challenge_id: number
  completed_at: string
  status: 'completed' | 'missed'
}

// Completion and Challenge Data - to be showed in 'Activity Log'
export interface CompletionOfChallenge {
  completionId: number //completions.id
  completed_at: string
  status: 'completed' | 'missed'

  challengeId: number //challenges.id
  challengeTitle: string //challenges.title
  challengeDescription: string //challenges.description
  xp_reward: number
  attribute: 'str' | 'dex' | 'int'
  difficulty: 'easy' | 'medium' | 'hard' | 'rand'
}

// For when adding to DB
export interface NewCompletion {
  challengeId: number
  status: 'completed' | 'missed'
}

// New results for level and XP
export interface CompletionResult {
  userNewXp: number
  userNewLevel: number
  levelUpHappened: boolean
}
