import {afterAll, beforeAll, expect, describe, it, beforeEach} from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import {execSync} from 'node:child_process'
describe('Transactions routes', () => {
    //Vai se executado antes de todos os teste
    beforeAll(async () => {
        await app.ready()//Vai remover o valor valido quando a bliblioteca fastify terminar de carregar os plugin
    })
    
    //Depois que os testes executem será fechada a aplicação
    afterAll(async () => {
        await app.close() //Vai fechar a aplicação ou seja remover da memoria 
    })
    
    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    it('Should be able create an new transaction', async () => {
        const response = await request(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        })
        expect(response.statusCode).toEqual(201)
    })
    it('Should be able to list all transaction', async () =>{
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        })

        const cookie = createTransactionResponse.get('Set-Cookie')

        const response = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookie)

        expect(response.statusCode).toEqual(200)
        expect(response.body.transaction).toEqual([
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            })
        ])
    })
    it('Should be able to get specific transaction', async () =>{
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        })

        const cookie = createTransactionResponse.get('Set-Cookie')
        
        const response = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookie)
        
        const transactionsId = response.body.transaction[0].id

        const getTransactionResponse = await request(app.server)
        .get(`/transactions/${transactionsId}`)
        .set('Cookie', cookie)

        expect(getTransactionResponse.statusCode).toEqual(200)
        expect(getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            })
        )
    })
    it('Should be able to get the summary', async () =>{
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        })

        const cookie = createTransactionResponse.get('Set-Cookie')

        await request(app.server)
        .post('/transactions')
        .set('Cookie', cookie)
        .send({
            title: 'Debit Transactions',
            amount: 2000,
            type: 'debit'
        })
        const summaryResponse = await request(app.server)
        .get('/transactions/summary')
        .set('Cookie', cookie)

        expect(summaryResponse.statusCode).toEqual(200)
        // return console.log(summaryResponse.body)
        expect(summaryResponse.body).toEqual({
                amount: 3000,
            })
    })
})
