/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { z } from 'zod'

export async function dietUserRoutes(app: FastifyInstance) {
    
    // TODO: CRIA UMA NOVA TRANSAÇÃO
    app.post('/', async (request, reply) => {
        const createDietBodySchema = z.object({
            first_name: z.string(),
            last_name: z.string(),
            email: z.string(),
        })
        const { first_name, last_name, email } = createDietBodySchema.parse(request.body)
        
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
        await knex('user_diet').insert({
            id: crypto.randomUUID(),
            first_name,
            last_name,
            email,
            session_id: sessionId
        })
        return reply.status(201).send()
    })
}
