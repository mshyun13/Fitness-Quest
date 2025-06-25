/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.string('id').primary().unique()
      table.string('name')
      table.integer('xp')
      table.integer('level')
      table.string('rank')
      table.integer('str')
      table.integer('dex')
      table.integer('int')
      table.integer('missed')
      table.string('class')
      table.integer('appearance')
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
