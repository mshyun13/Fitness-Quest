export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('challenges').del()
  await knex('completions').del()
  await knex('achievements').del()
  await knex('achievements_user').del()
  await knex('posts').del()

  // Inserts seed entries
  await knex('users').insert([
    {
      id: 1,
      auth_id: 'google-oauth2|102349456663427950864',
      name: 'Callum',
      xp: 0,
      level: 1,
      rank: 'Bronze',
      str: 0,
      dex: 0,
      int: 0,
      missed: 0,
      class: 'warrior',
      appearance: 1,
      gender: 'male',
    },
    {
      id: 2,
      auth_id: 'google-oauth2|10214110612085501758',
      name: 'Ben',
      xp: 0,
      level: 1,
      rank: 'Bronze',
      str: 0,
      dex: 0,
      int: 0,
      missed: 0,
      class: 'rogue',
      appearance: 1,
      gender: 'male',
    },
    {
      id: 3,
      auth_id: 'google-oauth2|103269307431160616510',
      name: 'Mark',
      xp: 0,
      level: 1,
      rank: 'Diamond',
      str: 0,
      dex: 0,
      int: 0,
      missed: 0,
      class: 'mage',
      appearance: 1,
      gender: 'male',
    },
  ])

  await knex('challenges').insert([
    {
      id: 1,
      title: "Pushin' Through",
      description: '10 pushups',
      xp_reward: 50,
      attribute: 'str',
      difficulty: 'easy',
    },
    // more challenges seed
    {
      id: 2,
      title: 'Dodge Rolling for Dummies',
      description: '20m shuttle run (6 repetitions)',
      xp_reward: 75,
      attribute: 'dex',
      difficulty: 'medium',
    },
    {
      id: 3,
      title: 'The Kings Gambit',
      description: 'win 3 chess games in a row',
      xp_reward: 100,
      attribute: 'int',
      difficulty: 'hard',
    },
    {
      id: 4,
      title: 'Unskippable Cutscene',
      description: 'Force yourself through a leg day',
      xp_reward: 75,
      attribute: 'str',
      difficulty: 'medium',
    },
    {
      id: 5,
      title: 'Newfound Power!',
      description:
        'Complete any PERSONALLY CHALLENGING workout circuit, must attempt to PR any two exercises',
      xp_reward: 100,
      attribute: 'str',
      difficulty: 'hard',
    },
    {
      id: 6,
      title: 'Blazing a Trail',
      description: "Go on a walk you haven't been on before",
      xp_reward: 50,
      attribute: 'dex',
      difficulty: 'easy',
    },
    {
      id: 7,
      title: 'Feel the Burnnnn',
      description:
        'Set a personal record or go to failure on any cardio machine (EG. stairmaster)',
      xp_reward: 100,
      attribute: 'dex',
      difficulty: 'hard',
    },
    {
      id: 8,
      title: 'Thirst for Knowledge',
      description:
        'Read or watch an informative piece that introduces you to something new',
      xp_reward: 50,
      attribute: 'int',
      difficulty: 'easy',
    },
    {
      id: 9,
      title: 'Into the Archives',
      description:
        "Quiz yourself on something you haven't studied for at least a month until complete recall",
      xp_reward: 75,
      attribute: 'int',
      difficulty: 'medium',
    },
    {
      id: 10,
      title: 'How Puzzling...',
      description:
        'Complete any of the New York Times daily puzzle games, such as Wordle',
      xp_reward: 75,
      attribute: 'int',
      difficulty: 'medium',
    },
    {
      id: 11,
      title: 'Loosen up!',
      description:
        'Spend at least 30 minutes doing stretches and/or movements to work on range of motion',
      xp_reward: 50,
      attribute: 'dex',
      difficulty: 'easy',
    },
    {
      id: 12,
      title: 'Home Improvement',
      description:
        'Complete a de-cluttering/rearranging task, has to feel at least slightly strenuous',
      xp_reward: 50,
      attribute: 'str',
      difficulty: 'easy',
    },
    {
      id: 13,
      title: 'Feed the Mind, Feed the Soul',
      description: '10 minutes of silent meditation',
      xp_reward: 50,
      attribute: 'int',
      difficulty: 'easy',
    },
    {
      id: 14,
      title: 'The Keeper of Balance',
      description:
        'Complete a workout where you do at least 3 extra reps per set with your weaker arm',
      xp_reward: 75,
      attribute: 'str',
      difficulty: 'medium',
    },
    {
      id: 15,
      title: 'Accelerate!',
      description:
        'Complete a timed jog around your neighborhood, aim to increase pace each time',
      xp_reward: 75,
      attribute: 'dex',
      difficulty: 'medium',
    },
    {
      id: 16,
      title: 'Winning is Everything!',
      description:
        'Host the most competitive game night possible with the smartest people you know',
      xp_reward: 100,
      attribute: 'int',
      difficulty: 'hard',
    },
    {
      id: 17,
      title: 'Pushing the Boundaries',
      description: 'Complete 40 pushups in as few sets as possible',
      xp_reward: 100,
      attribute: 'str',
      difficulty: 'hard',
    },
    {
      id: 18,
      title: 'Return to Nature',
      description: 'Go on a full day hike!',
      xp_reward: 100,
      attribute: 'dex',
      difficulty: 'hard',
    },
    {
      id: 19,
      title: 'Ultimate Move!',
      description: 'Record a 1 rep max for bench press, squat and deadlift',
      xp_reward: 100,
      attribute: 'str',
      difficulty: 'hard',
    },
    {
      id: 20,
      title: 'Reach for the Stars!',
      description:
        'Incorporate 20 pull ups into a workout (use resistance bands if needed)',
      xp_reward: 75,
      attribute: 'str',
      difficulty: 'medium',
    },
    {
      id: 21,
      title: 'Friendly Rivalries',
      description:
        'Challenge a mate to a contest of strength (EG. arm wrestling)',
      xp_reward: 50,
      attribute: 'str',
      difficulty: 'easy',
    },
    {
      id: 22,
      title: 'A Spark of Creativity',
      description: 'Create a fun or purposeful art piece',
      xp_reward: 50,
      attribute: 'int',
      difficulty: 'easy',
    },
    {
      id: 23,
      title: 'Speaking in Tongues',
      description: "Complete a lesson for a language you don't speak",
      xp_reward: 75,
      attribute: 'int',
      difficulty: 'medium',
    },
    {
      id: 24,
      title: 'Tavern Legend',
      description: 'Win a pub quiz',
      xp_reward: 100,
      attribute: 'int',
      difficulty: 'hard',
    },
    {
      id: 25,
      title: 'Fleet Footwork',
      description:
        'Complete a low intensity running session focusing solely on form',
      xp_reward: 50,
      attribute: 'dex',
      difficulty: 'easy',
    },
    {
      id: 26,
      title: 'Well-Oiled Machine',
      description: 'Complete a plyometric workout',
      xp_reward: 75,
      attribute: 'dex',
      difficulty: 'medium',
    },
    {
      id: 27,
      title: 'Against the Current',
      description: 'Swim laps untill fatigued',
      xp_reward: 100,
      attribute: 'dex',
      difficulty: 'hard',
    },
  ])

  await knex('completions').insert([
    {
      user_id: 3,
      challenge_id: 1,
      completed_at: knex.fn.now(),
      status: 'completed',
    },
  ])

  await knex('achievements').insert([
    {
      id: 1,
      title: 'First Time for Everything',
      description: 'Leveled up for the first time',
      reward: 20,
    },
    {
      id: 2,
      title: 'Path of the Warrior',
      description: 'Reach level 5 as the warrior class',
      reward: 20,
    },
    {
      id: 3,
      title: 'Path of the Mage',
      description: 'Reach level 5 as the mage class',
      reward: 20,
    },
    {
      id: 4,
      title: 'Path of the Rogue',
      description: 'Reach level 5 as the rogue class',
      reward: 20,
    },
    {
      id: 5,
      title: 'Adept Warrior',
      description: 'Reach silver rank as the warrior class',
      reward: 50,
    },
    {
      id: 6,
      title: 'Adept Mage',
      description: 'Reach silver rank as the mage class',
      reward: 50,
    },
    {
      id: 7,
      title: 'Adept Rogue',
      description: 'Reach silver rank as the rogue class',
      reward: 50,
    },
    {
      id: 8,
      title: 'Consistency is Key',
      description: 'Complete at least 1 challenge, for 5 days in a row',
      reward: 30,
    },
    {
      id: 9,
      title: 'Hot Streak!',
      description: 'Complete at least 1 challenge, for 10 days in a row',
      reward: 50,
    },
    {
      id: 10,
      title: 'Peak Physical Form',
      description: 'Complete 100 total challenges',
      reward: 100,
    },
  ])

  // await knex('achievements_user').insert([
  //   {
  //     id: 1,
  //     user_id: 1,
  //   },
  //   {
  //     id: 2,
  //     user_id: 1,
  //   },
  //   {
  //     id: 5,
  //     user_id: 1,
  //   },
  // ])

  await knex('posts').insert([
    {
      id: 1,
      user_id: 1,
      content: 'Add posts with the button above',
    },
  ])
  // await knex('sidequests').insert([
  //   {
  //     id: 1,
  //     user_id: 1,
  //     title: 'test quest',
  //     description: 'this is a test of the side quests',
  //     attribute: 'int',
  //     completed_at: knex.fn.now(),
  //   },
  // ])
}
