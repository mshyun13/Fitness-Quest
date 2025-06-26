export interface ChallengeData {
  title: string
  description: string
  xp_reward: number
  attribute: string
  difficulty: string
}

export interface Challenge extends ChallengeData {
  id: number
}
