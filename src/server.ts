/* eslint-disable prettier/prettier */
import fastify from 'fastify'
import { env } from './env'
import { transactionRoutes } from './routes/transactions'
import Cookie from '@fastify/cookie'
// import crypto from 'node:crypto'

const app = fastify()

// IMPORTANTE LEVAR EM CONSIDERAÇÃO SEMPRE A ORDEM DOS PLUGINS

app.register(Cookie)
app.register(transactionRoutes, {
  prefix: 'transactions'
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running.')
  })
