import { connectToDatabase } from '../../db/mongoose'
import { Vacancy } from '../../models/Vacancy'
import { verifyAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    await connectToDatabase()

    // GET метод
    if (event.node.req.method === 'GET') {
        try {
            const vacancies = await Vacancy.find().sort({ createdAt: -1 })
            return vacancies
        } catch (error) {
            console.error('Error fetching vacancies:', error)
            throw createError({
                statusCode: 500,
                statusMessage: 'Error fetching vacancies'
            })
        }
    }

    // POST метод
    if (event.node.req.method === 'POST') {
        try {
            const auth = verifyAuth(event)
            const body = await readBody(event)

            const vacancy = new Vacancy(body)
            await vacancy.save()

            return vacancy
        } catch (error) {
            console.error('Error creating vacancy:', error)
            if (error.statusCode === 401) {
                throw error
            }
            throw createError({
                statusCode: 500,
                statusMessage: 'Error creating vacancy'
            })
        }
    }
})