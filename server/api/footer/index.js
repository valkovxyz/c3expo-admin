// server/api/footer/index.js
import { connectToDatabase } from '../../db/mongoose'
import { Footer } from '../../models/Footer'
import { verifyAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    await connectToDatabase()

    // GET метод
    if (event.node.req.method === 'GET') {
        try {
            let footer = await Footer.findOne()
            if (!footer) {
                // Создаем дефолтные значения, если футер еще не существует
                footer = new Footer({
                    email: 'contact@example.com',
                    phone: '+1234567890',
                    website: 'https://example.com'
                })
                await footer.save()
            }
            return footer
        } catch (error) {
            console.error('Error fetching footer:', error)
            throw createError({
                statusCode: 500,
                statusMessage: 'Error fetching footer data'
            })
        }
    }

    // PUT метод
    if (event.node.req.method === 'PUT') {
        try {
            const auth = verifyAuth(event)
            const body = await readBody(event)

            let footer = await Footer.findOne()
            if (!footer) {
                footer = new Footer(body)
            } else {
                footer.email = body.email
                footer.phone = body.phone
                footer.website = body.website
            }

            await footer.save()
            return footer
        } catch (error) {
            console.error('Error updating footer:', error)
            throw createError({
                statusCode: 500,
                statusMessage: 'Error updating footer data'
            })
        }
    }

    throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
    })
})