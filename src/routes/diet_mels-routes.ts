/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exist'

export async function dietMelsRoutes(app: FastifyInstance) {

    // TODO: LISTA AS TRANSAÇÕES
    // app.get('/', { preHandler: [checkSessionIdExist] }, async (request) => {
    //     const {sessionId} = request.cookies
    //     const transaction = await knex('transactions')
    //     .where('session_id', sessionId)
    //     .select('*')    
    //     return {
    //         transaction
    //     }
    // })
    
    // TODO: LISTA UMA ÚNICA TRANSAÇÃO
    // app.get('/:id', { preHandler: [checkSessionIdExist] }, async (request) => {
    //     const getMelsParamsSchema = z.object({
    //         id: z.string().uuid(),
    //     })
    //     const {id} = getMelsParamsSchema.parse(request.params)
    //     const {sessionId} = request.cookies
    //     const transaction = await knex('record_meal')
    //     .where({
    //         id,
    //         session_id: sessionId
    //     })
    //     .first()
    //     return {
    //         transaction
    //     }
    // })
    
    // TODO: SOMA OS VALORES DE AMOUNT
    // app.get('/summary', { preHandler: [checkSessionIdExist] }, async (request) => {
    //     const {sessionId} = request.cookies
    //     const summary = await knex('transactions')
    //     .where('session_id', sessionId)
    //     .sum('amount', {as: 'amount'})
    //     .first()
    //     return summary
    // })
    
    // TODO: CRIA UMA NOVA TRANSAÇÃO
    // app.post('/', async (request, reply) => {
    //     const createDietBodySchema = z.object({
    //         first_name: z.string(),
    //         last_name: z.string(),
    //         email: z.string(),
    //     })
    //     const { first_name, last_name, email } = createDietBodySchema.parse(request.body)
        
    //     // Valida o usuário pelo id no cookies
    //     let sessionId = request.cookies.sessionId

    //     // Se nao tiver o id do cookie, vai criar e será valido por 7 dias.
    //     if(!sessionId){
    //         sessionId = crypto.randomUUID()
    //         reply.cookie('sessionId', sessionId, {
    //             path: '/', // ESSE PATH ESPECIFICA QUAIS ROTAS IRÃO PODER ACESSAR ESTE COOKIE
    //             maxAge: 60 * 60 * 24 * 7 // 7 DIAS
    //         })
    //     }
    //     await knex('user_diet').insert({
    //         id: crypto.randomUUID(),
    //         first_name,
    //         last_name,
    //         email,
    //         session_id: sessionId
    //     })
    //     return reply.status(201).send()
    // })
    app.post('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {

        const createDietBodySchema = z.object({
            title: z.string(),
            description: z.string(),
            isOnDiet: z.boolean(),
            date: z.coerce.date(),
        })

        const {title, description, isOnDiet, date} = createDietBodySchema.parse(request.body)

        await knex('meals')
        .insert({
            id: crypto.randomUUID(),
            title,
            description,
            is_on_diet: isOnDiet,
            date: date.getTime(),
            users_id: request.users?.id,
        })
        return reply.status(201).send()
    })
}
