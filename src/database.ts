/* eslint-disable prettier/prettier */
// TODO: CONEXÃO COM BANCO DE DADOS

import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations:{
     extension: 'ts',
     directory: './tmp/migrations'
  }
}

export const knex = setupKnex(config)
