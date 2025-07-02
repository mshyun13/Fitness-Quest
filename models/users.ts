export interface User {
  id: number
  auth_id: string
  name: string
  xp: number
  level: number
  rank: string
  str: number
  dex: number
  int: number
  missed: number
  class: string
  appearance: number
  gender: string
}

export interface UserData {
  auth_id: string
  name: string
  class: string
  gender: string
  appearance?: number
  rank: string
}

export interface UpdateUser {
  id: number
  auth_id?: string
  name?: string
  xp?: number
  level?: number
  rank?: string
  str?: number
  dex?: number
  int?: number
  missed?: number
  class?: string
  appearance?: number
  gender?: string
}
