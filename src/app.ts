/* eslint-disable prettier/prettier */
import fastify from 'fastify'
import { dietUserRoutes } from './routes/diet_user-routes'
import { dietMelsRoutes } from './routes/diet_mels-routes'
import Cookie from '@fastify/cookie'
import cors from '@fastify/cors'; // Importe o pacote cors
// import crypto from 'node:crypto'

export const app = fastify()

app.register(cors, {
    origin: ["http://localhost:8080"], // Substitua pela origem do seu front-end
    credentials: true
});
// IMPORTANTE LEVAR EM CONSIDERAÇÃO SEMPRE A ORDEM DOS PLUGINS

app.register(Cookie)
app.register(dietUserRoutes, { prefix: 'diet' })
app.register(dietMelsRoutes, { prefix: 'mels' })
