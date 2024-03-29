/* eslint-disable prettier/prettier */
import {config} from 'dotenv'

import { z } from 'zod'

if(process.env.NODE_ENV === 'test'){
    config({path: '.env.test'})
}else{
    config()
}

/* O schema diz o formato que vou receber dos dados em nossa aplicação */
const envSchema = z.object({
    DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333) // COERSE VAI TRANFORMAR EM UM NUMERO SE NAO PASSA UMA STRING 3333
})

const _env = envSchema.safeParse(process.env)

if(_env.success === false){
    
    console.error('Invalid environment variables!', _env.error.format())

    throw new Error('Invalid environment variables!')
}
export const env = _env.data
