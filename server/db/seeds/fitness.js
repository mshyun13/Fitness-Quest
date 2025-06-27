export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('challenges').del()
  await knex('completions').del()
  await knex('achievements').del()
  await knex('achievements_user').del()

  // Inserts seed entries
  await knex('users').insert([
    {
      id: 1,
      auth_id: 'google-oauth2|102349456663427950864',
      name: 'Callum',
      xp: 56,
      level: 99,
      rank: 'Master',
      str: 99,
      dex: 45,
      int: 10,
      missed: 0,
      class: 'warrior',
      appearance: 3,
    },
    {
      id: 2,
      auth_id: 'github|204113180',
      name: 'Ben',
      xp: 20,
      level: 99,
      rank: 'Master',
      str: 99,
      dex: 99,
      int: 99,
      missed: 0,
      class: 'rogue',
      appearance: 3,
    },
    {
      id: 3,
      auth_id: 'google-oauth2|103269307431160616510',
      name: 'Mark',
      xp: 77,
      level: 99,
      rank: 'Master',
      str: 99,
      dex: 99,
      int: 99,
      missed: 0,
      class: 'mage',
      appearance: 3,
    },
  ])

  await knex('challenges').insert([
    {
      id: 1,
      title: 'Challenge 1',
      description: '10 pushups',
      xp_reward: 25,
      attribute: 'str',
      difficulty: 'easy',
    },
    // more challenges seed
    {
      id: 2,
      title: 'Challenge 2',
      description: '20m shuttle run (6 repetitions)',
      xp_reward: 30,
      attribute: 'dex',
      difficulty: 'medium',
    },
    {
      id: 3,
      title: 'Challenge 3',
      description: 'win 3 chess games in a row',
      xp_reward: 40,
      attribute: 'int',
      difficulty: 'hard',
    },
  ])

  await knex('completions').insert([
    {
      user_id: 2,
      challenge_id: 1,
      completed_at: knex.fn.now(),
      status: 'completed',
    },
    {
      user_id: 2,
      challenge_id: 2,
      completed_at: knex.fn.now(),
      status: 'missed',
    },
    {
      user_id: 2,
      challenge_id: 3,
      completed_at: knex.fn.now(),
      status: 'completed',
    },
  ])

  await knex('achievements').insert([
    {
      id: 1,
      title: 'First Time for Everything',
      description: 'leveled up for the first time',
      reward: 20,
    },
  ])

  await knex('achievements_user').insert([
    {
      id: 1,
      user_id: 1,
    },
  ])
}
