/* eslint-disable prettier/prettier */
import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'
// import crypto from 'node:crypto'

const app = fastify()

app.get('/transaction', async () => {
  const transactions = await knex('transactions')
  .where('amount', 1000)
  .select('*')
  return transactions
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running.')
  })
