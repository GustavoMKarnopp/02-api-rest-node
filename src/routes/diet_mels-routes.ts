/* eslint-disable prettier/prettier */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exist'

export async function dietMelsRoutes(app: FastifyInstance) {
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

     // TODO: LISTA TODAS AS REFEICOES
    app.get('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        const meals= await knex('meals')
        .where({ users_id: request.users?.id })
        .orderBy('date', 'desc')   
        return reply.send({ meals })
    })

     // TODO: FILTRA UMA ÚNICA REFEIÇÃO ENTRE TODAS DE ACORDO COM O ID
     app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
        const getTransactionsParamsSchema = z.object({
            id: z.string().uuid(),
        })
        const {id} = getTransactionsParamsSchema.parse(request.params)
        const uniqMels = await knex('meals')
        .where({
            id,
            users_id: request.users?.id
        })
        .first()
        return {
            uniqMels
        }
    })

    // TODO: ALTERA AS REFEIÇÕES
    app.put('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        const getMelsParamsSchema = z.object({
            id: z.string().uuid(),
        })
        const createDietBodySchema = z.object({
            title: z.string(),
            description: z.string(),
            isOnDiet: z.boolean(),
        })
        const {id} = getMelsParamsSchema.parse(request.params)
        const { title, description, isOnDiet} = createDietBodySchema.parse(request.body)
        await knex('meals')
        .where({
            id,
            users_id: request.users?.id
        })
        .update({
            title,
            description,
            is_on_diet: isOnDiet,
        })
        return reply.status(201).send()
    })

    // TODO: DELETAR AS REFEIÇÕES
    app.delete('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        const getMelsParamsSchema = z.object({id: z.string().uuid()})
        const {id} = getMelsParamsSchema.parse(request.params)    
        const validaMels = await knex('meals').where({id:id}).first()
        if(!validaMels){
            return reply.status(404).send({error:'Met not found'})
        }
        await knex('meals')
        .where({id:id})
        .delete()
        return reply.status(201).send()
    })

    // TODO: CRIA OS CALCULOS DAS MÉTRICAS

    app.get('/metrics', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        const totalDietClean = await knex('meals')
            .where({users_id: request.users?.id, is_on_diet: true})// Pegas os users_id e os is_on_diet que forem true
            .count('id', {as: 'total'})
            .first()
        const totalDietDirty = await knex('meals')
            .where({users_id: request.users?.id, is_on_diet: false})// Pegas os users_id e os is_on_diet que forem false
            .count('id', {as: 'total'})
            .first()
        const totalMels = await knex('meals')
            .where({users_id: request.users?.id})
            .orderBy('date', 'desc')
            
        const { dietClean } = totalMels.reduce((acc, meal) => {
            if(meal.is_on_diet){
                acc.current += 1
            }else{
                acc.current = 0
            }
            if(acc.current > acc.dietClean){
                acc.dietClean = acc.current
            }
            return acc
        },
        {dietClean: 0, current: 0},
        )
        return reply.send({
            totalMels: totalMels.length,
            totalDietClean: totalDietClean?.total,
            totalDietDirty: totalDietDirty?.total,
            dietClean
        })
    })
}
