import { connectToDatabase } from '../../db/mongoose'
import { Vacancy } from '../../models/Vacancy'
import { verifyAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    await connectToDatabase()

    const id = event.context.params.id

    try {
        // DELETE метод
        if (event.node.req.method === 'DELETE') {
            const auth = verifyAuth(event)
            await Vacancy.findByIdAndDelete(id)
            return { message: 'Vacancy deleted successfully' }
        }

        // PUT метод
        if (event.node.req.method === 'PUT') {
            const auth = verifyAuth(event)
            const body = await readBody(event)

            const vacancy = await Vacancy.findByIdAndUpdate(id, body, {
                new: true,
                runValidators: true
            })

            if (!vacancy) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Vacancy not found'
                })
            }

            return vacancy
        }

        throw createError({
            statusCode: 405,
            statusMessage: 'Method not allowed'
        })
    } catch (error) {
        console.error(`Error handling vacancy ${id}:`, error)
        if (error.statusCode) {
            throw error
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error'
        })
    }
})