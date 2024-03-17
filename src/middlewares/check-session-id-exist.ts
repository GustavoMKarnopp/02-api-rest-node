/* eslint-disable prettier/prettier */
import { FastifyReply, FastifyRequest } from 'fastify'

/* eslint-disable prettier/prettier */
export async function checkSessionIdExist(request: FastifyRequest, reply: FastifyReply) {
    const sessionId = request.cookies.sessionId
    if (!sessionId) {
        return reply.status(401).send({
        error: 'Unauthorized',
        })
    }

}
