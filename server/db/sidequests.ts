import db from './connection.ts'
import {
  checkLevelUp,
  getLevelFromTotalXp,
  getRankByLevel,
  getXpNeededForNextLevel,
} from '../utils/xpLogic.ts'
import { User } from '../../models/users.ts'
import { Knex } from 'knex'
import { addAchievements } from './achievements.ts'
import { addPost } from './posts.ts'
import { User } from '@auth0/auth0-react'

export async function getSideQuestsById(id: number) {
  const quests = await db('sidequests').where('user_id', id).select()
  return quests
}

interface SideQuestData {
  user_id: number
  title: string
  description: string
  attribute: string
  completed_at: string
}

interface UserStatUpdate {
  userNewXp: number
  userNewLevel: number
  levelUpHappened: boolean
}

export async function updateUserStats(
  trx: Knex.Transaction,
  userId: number,
  xpGain: number,
  attributeToIncrement?: 'str' | 'dex' | 'int',
): Promise<UserStatUpdate> {
  let levelUpHappened = false
  console.log(
    `[updateUserStats] Called for userId: ${userId}, xpGain: ${xpGain}, attribute: ${attributeToIncrement}`,
  )

  // Get users current XP from DB
  const user = (await trx('users')
    .where('id', userId)
    .select('xp', 'level', 'str', 'dex', 'int', 'class')
    .first()) as User

  if (!user) {
    console.error(`[updateUserStats] User Not Found for userId: ${userId}`)
    throw new Error('User Not Found')
  }

  // User stats before update
  console.log(
    `[updateUserStats] User BEFORE update (from DB): Total XP=${user.xp}, Level=${user.level}, STR=${user.str}, DEX=${user.dex}, INT=${user.int}`,
  )

  // Calculate new total xp
  let newTotalXp = (user.xp || 0) + xpGain
  console.log(
    `[updateUserStats] Calculated New Total XP after adding xpGain: ${newTotalXp}`,
  )

  // Determine new level based on new total XP
  const originalLevel = user.level || 0
  //const newCalculatedLevel = getLevelFromTotalXp(newTotalXp)
  const newCalculatedLevel = checkLevelUp(user.level, newTotalXp)

  let finalXpToStore = newTotalXp

  if (newCalculatedLevel > originalLevel) {
    console.log('level up')
    levelUpHappened = true
    finalXpToStore = newTotalXp - getXpNeededForNextLevel(user.level)
  }

  console.log(
    `xp from level ${getXpNeededForNextLevel(newCalculatedLevel - 1)}`,
  )

  let finalLevelToStore = newCalculatedLevel
  let finalRankToStore = getRankByLevel(finalLevelToStore)

  while (finalXpToStore > getXpNeededForNextLevel(finalLevelToStore)) {
    console.log('while')
    finalXpToStore =
      finalXpToStore - getXpNeededForNextLevel(finalLevelToStore - 1)
    finalLevelToStore = checkLevelUp(finalLevelToStore, finalXpToStore)
    finalRankToStore = getRankByLevel(finalLevelToStore)
  }

  const updatedAttributes = {
    str: user.str,
    dex: user.dex,
    int: user.int,
  }

  if (attributeToIncrement) {
    const currentAttributeValue = updatedAttributes[attributeToIncrement]
    let newAttributeValue = currentAttributeValue + 1

    if (newAttributeValue > 100) {
      const bonusXpFromAttribute = newAttributeValue - 100
      newAttributeValue = 1

      // Add bonus XP to total XP
      newTotalXp += bonusXpFromAttribute
      console.log(
        `[updateUserStats] Bonus XP added. Current TOTAL XP after bonus: ${newTotalXp}`,
      )

      // Recalculate level and rank based on the new total XP
      //const levelAfterBonus = getLevelFromTotalXp(newTotalXp)
      const levelAfterBonus = checkLevelUp(finalLevelToStore, newTotalXp)
      if (levelAfterBonus > finalLevelToStore) {
        levelUpHappened = true
      }
      finalXpToStore = newTotalXp - getXpNeededForNextLevel(levelAfterBonus - 1)
      finalLevelToStore = levelAfterBonus
      finalRankToStore = getRankByLevel(finalLevelToStore)
      console.log(
        `[updateUserStats] Level/Rank updated after bonus XP. New Level: ${finalLevelToStore}, New Rank: ${finalRankToStore}`,
      )
    }
    updatedAttributes[attributeToIncrement] = newAttributeValue
    console.log(
      `[updateUserStats] Attribute ${attributeToIncrement} updated to: ${updatedAttributes[attributeToIncrement]}`,
    )
  }

  console.log(
    `[updateUserStats] Final values before DB write: TOTAL XP=${finalXpToStore}, Level=${finalLevelToStore}, Rank=${finalRankToStore}`,
  )
  // if user.level < 20 and final level to store >20 add achievement
  // check class too
  checkAchievements(user.level, finalLevelToStore, userId, user)

  await trx('users').where('id', userId).update({
    xp: finalXpToStore,
    level: finalLevelToStore,
    str: updatedAttributes.str,
    dex: updatedAttributes.dex,
    int: updatedAttributes.int,
    rank: finalRankToStore,
  })

  console.log(
    `[updateUserStats] Database update command executed for userId: ${userId}`,
  )
  // --- //
  const verifiedUser = (await trx('users')
    .where('id', userId)
    .select('xp', 'level', 'str', 'dex', 'int', 'rank')
    .first()) as User
  // --- //

  console.log(
    `[updateUserStats] User stats read back (within transaction): Total XP=${verifiedUser.xp}, Level=${verifiedUser.level}, Rank=${verifiedUser.rank}`,
  )

  return {
    userNewXp: finalXpToStore,
    userNewLevel: finalLevelToStore,
    levelUpHappened: levelUpHappened,
  }
}

export async function addSideQuest(data: SideQuestData) {
  const { user_id, title, attribute, description, completed_at } = data
  const quest = await db('sidequests').insert({
    user_id,
    title,
    attribute,
    description,
    completed_at,
  })
  return quest
}

export async function addSideQuestXp(data: SideQuestData) {
  return db.transaction(async (trx) => {
    const SIDE_QUEST_XP = 25 // Fixed XP per SideQuest

    const { user_id, title, description, attribute, completed_at } = data

    // Insert SideQuest for DB
    await trx('sidequests').insert({
      user_id,
      title,
      description,
      attribute,
      completed_at,
    })
    await updateUserStats(
      trx,
      user_id,
      SIDE_QUEST_XP,
      attribute as 'str' | 'dex' | 'int',
    )
  })
}

// if user.level < 20 and final level to store >20 add achievement
// check class too
function checkAchievements(current, final, userId, user) {
  if (current < 2 && final >= 2) {
    addAchievements({ id: 1, user_id: userId })
    const content = 'Earned the Achievement: First Time For Everything'
    addPost({ user_id: userId, content: content })
  }
  if (current < 5 && final >= 5 && user.class == 'warrior') {
    addAchievements({ id: 2, user_id: userId })
    const content = 'Earned the Achievement: Path Of The Warrior'
    addPost({ user_id: userId, content: content })
  }
  if (current < 5 && final >= 5 && user.class == 'mage') {
    addAchievements({ id: 3, user_id: userId })
    const content = 'Earned the Achievement: Path Of The Mage'
    addPost({ user_id: userId, content: content })
  }
  if (current < 5 && final >= 5 && user.class == 'rogue') {
    addAchievements({ id: 4, user_id: userId })
    const content = 'Earned the Achievement: Path Of The Rogue'
    addPost({ user_id: userId, content: content })
  }
  if (current < 20 && final >= 20 && user.class == 'warrior') {
    addAchievements({ id: 5, user_id: userId })
    const content = 'Earned the Achievement: Adept Warrior'
    addPost({ user_id: userId, content: content })
  }
  if (current < 20 && final >= 20 && user.class == 'mage') {
    addAchievements({ id: 6, user_id: userId })
    const content = 'Earned the Achievement: Adept Mage'
    addPost({ user_id: userId, content: content })
  }
  if (current < 20 && final >= 20 && user.class == 'rogue') {
    addAchievements({ id: 7, user_id: userId })
    const content = 'Earned the Achievement: Adept Rogue'
    addPost({ user_id: userId, content: content })
  }
}
