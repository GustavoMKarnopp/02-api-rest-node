/* eslint-disable prettier/prettier */
import fastify from 'fastify'
import { dietUserRoutes } from './routes/diet_user-routes'
import { dietMelsRoutes } from './routes/diet_mels-routes'
import Cookie from '@fastify/cookie'
// import crypto from 'node:crypto'

export const app = fastify()

// IMPORTANTE LEVAR EM CONSIDERAÇÃO SEMPRE A ORDEM DOS PLUGINS

app.register(Cookie)
app.register(dietUserRoutes, { prefix: 'diet' })
app.register(dietMelsRoutes, { prefix: 'mels' })
