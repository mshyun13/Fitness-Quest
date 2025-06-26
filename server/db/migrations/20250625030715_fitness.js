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
      table.integer('level').defaultTo(0)
      table.string('rank').defaultTo('beginner')
      table.integer('str').defaultTo(0)
      table.integer('dex').defaultTo(0)
      table.integer('int').defaultTo(0)
      table.integer('missed').defaultTo(0)
      table.string('class')
      table.integer('appearance').defaultTo(0)
    })
    .createTable('completions', (table) => {
      table.increments('id').primary()
      table.string('user_id').references('id').inTable('users')
      table.integer('challenge_id').references('id').inTable('challenges')
      table.datetime('completed_at')
      table.enum('status', ['completed', 'missed'])
    })
    .createTable('challenges', (table) => {
      table.increments('id').primary()
      table.string('title')
      table.string('description')
      table.integer('xp_reward')
      table.enum('attribute', ['str', 'dex', 'int'])
      table.enum('difficulty', ['easy', 'medium', 'hard', 'rand'])
    })
}

export async function down(knex) {
  return knex.schema
    .dropTable('users')
    .dropTable('completions')
    .dropTable('challenges')
}
