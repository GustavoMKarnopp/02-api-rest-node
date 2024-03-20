/* eslint-disable prettier/prettier */
// FastifyRequestContext
import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    users?: {
      id: string
      session_id: string
      first_name: string,
      last_name: string,
      email: string,
      created_at: string
      updated_at: string
    }
  }
}
