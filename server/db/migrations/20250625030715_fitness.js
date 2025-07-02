/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary()
      table.string('auth_id').unique()
      table.string('name')
      table.integer('xp').defaultTo(0)
      table.integer('level').defaultTo(1)
      table.string('rank').defaultTo('')
      table.integer('str').defaultTo(0)
      table.integer('dex').defaultTo(0)
      table.integer('int').defaultTo(0)
      table.integer('missed').defaultTo(0)
      table.string('class')
      table.integer('appearance').defaultTo(1)
      table.string('gender')
    })
    .createTable('challenges', (table) => {
      table.increments('id').primary()
      table.string('title')
      table.string('description')
      table.integer('xp_reward')
      table.enum('attribute', ['str', 'dex', 'int'])
      table.enum('difficulty', ['easy', 'medium', 'hard', 'rand'])
    })
    .createTable('completions', (table) => {
      table.increments('id').primary()
      table.integer('user_id').references('id').inTable('users')
      table.integer('challenge_id').references('id').inTable('challenges')
      table.datetime('completed_at')
      table.enum('status', ['completed', 'missed'])
    })
    .createTable('achievements', (table) => {
      table.increments('id').primary()
      table.string('title')
      table.string('description')
      table.integer('reward')
    })
    .createTable('achievements_user', (table) => {
      table.integer('id').references('id').inTable('achievements')
      table.integer('user_id').references('id').inTable('users')
    })
    .createTable('sidequests', (table) => {
      table.increments('id').primary()
      table.integer('user_id').references('id').inTable('users')
      table.string('title')
      table.string('description')
      table.enum('attribute', ['str', 'dex', 'int'])
      table.datetime('completed_at')
    })
    .createTable('posts', (table) => {
      table.increments('id')
      table.integer('user_id').references('id').inTable('users')
      table.string('content')
      table.timestamp('date').defaultTo(knex.fn.now())
    })
}

export async function down(knex) {
  return knex.schema
    .dropTable('users')
    .dropTable('challenges')
    .dropTable('completions')
    .dropTable('achievements')
    .dropTable('achievements_user')
    .dropTable('sidequests')
    .dropTable('posts')
}
