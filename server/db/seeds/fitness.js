export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('challenges').del()
  await knex('completions').del()

  // Inserts seed entries
  await knex('users').insert([
    {
      id: 'google-oauth2|102349456663427950864',
      name: 'Callum',
      xp: 56,
      level: 99,
      rank: 'Master',
      str: 99,
      dex: 99,
      int: 99,
      missed: 0,
      class: 'warrior',
      appearance: 3,
    },
    {
      id: 'github|204113180',
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
      id: 'google-oauth2|103269307431160616510',
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
  ])

  await knex('completions').insert([
    {
      user_id: 'github|204113180',
      challenge_id: 1,
      completed_at: knex.fn.now(),
      status: 'completed',
    },
  ])
}
