/* eslint-disable prettier/prettier */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { z } from 'zod'
import { checkSessionIdExist } from '../middlewares/check-session-id-exist'

export async function transactionRoutes(app: FastifyInstance) {

    // TODO: LISTA AS TRANSAÇÕES
    app.get('/', { preHandler: [checkSessionIdExist] }, async (request) => {
        const {sessionId} = request.cookies
        const transaction = await knex('transactions')
        .where('session_id', sessionId)
        .select('*')    
        return {
            transaction
        }
    })
    
    // TODO: LISTA UMA ÚNICA TRANSAÇÃO
    app.get('/:id', { preHandler: [checkSessionIdExist] }, async (request) => {
        const getTransactionsParamsSchema = z.object({
            id: z.string().uuid(),
        })
        const {id} = getTransactionsParamsSchema.parse(request.params)
        const {sessionId} = request.cookies
        const transaction = await knex('transactions')
        .where({
            id,
            session_id: sessionId
        })
        .first()
        return {
            transaction
        }
    })
    
    // TODO: SOMA OS VALORES DE AMOUNT
    app.get('/summary', { preHandler: [checkSessionIdExist] }, async (request) => {
        const {sessionId} = request.cookies
        const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', {as: 'amount'})
        .first()
        return summary
    })
    
    // TODO: CRIA UMA NOVA TRANSAÇÃO
    app.post('/', async (request, reply) => {
            const createTransactionBodySchema = z.object({
                title: z.string(),
                amount: z.number(),
                type: z.enum(['debit', 'credit']),
            })
            const {title, amount, type} = createTransactionBodySchema.parse(request.body)

            // Valida o usuário pelo id no cookies
            let sessionId = request.cookies.sessionId

            // Se nao tiver o id do cookie, vai criar e será valido por 7 dias.
            if(!sessionId){
                sessionId = crypto.randomUUID()
                reply.cookie('sessionId', sessionId, {
                    path: '/', // ESSE PATH ESPECIFICA QUAIS ROTAS IRÃO PODER ACESSAR ESTE COOKIE
                    maxAge: 60 * 60 * 24 * 7 // 7 DIAS
                })
            }
            await knex('transactions')
            .insert({
                id: crypto.randomUUID(),
                title,
                amount: type === 'credit' ? amount : amount * -1,
                session_id: sessionId
            })
            return reply.status(201).send()
    })
}
