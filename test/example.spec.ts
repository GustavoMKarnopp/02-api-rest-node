import {afterAll, beforeAll, expect, test} from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

//Vai se executado antes de todos os teste
beforeAll(async () => {
    await app.ready()//Vai remover o valor valido quando a bliblioteca fastify terminar de carregar os plugin
})

//Depois que os testes executem será fechada a aplicação
afterAll(async () => {
    await app.close() //Vai fechar a aplicação ou seja remover da memoria 
})

test('User can create an new transaction', async () => {
    const response = await request(app.server)
    .post('/transactions')
    .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
    })
    expect(response.statusCode).toEqual(201)
})