/* eslint-disable prettier/prettier */
import fastify from 'fastify'
import { transactionRoutes } from './routes/transactions'
import Cookie from '@fastify/cookie'
// import crypto from 'node:crypto'

export const app = fastify()

// IMPORTANTE LEVAR EM CONSIDERAÇÃO SEMPRE A ORDEM DOS PLUGINS

app.register(Cookie)
app.register(transactionRoutes, {
  prefix: 'transactions',
})
