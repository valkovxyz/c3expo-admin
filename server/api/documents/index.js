import { connectToDatabase } from '../../db/mongoose'
import { Document } from '../../models/Document'
import { verifyAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    try {
        await connectToDatabase()

        // GET method - List all documents ordered by their position
        if (event.node.req.method === 'GET') {
            const documents = await Document.find()
                .sort({ order: 1, createdAt: -1 })
                .lean() // Use lean() for better performance
                .exec()

            return documents
        }

        // POST method - Create new document
        if (event.node.req.method === 'POST') {
            const auth = verifyAuth(event)
            const body = await readBody(event)

            // Get the highest order value efficiently
            const highestDoc = await Document.findOne()
                .sort({ order: -1 })
                .select('order')
                .lean()
                .exec()

            const document = new Document({
                ...body,
                order: (highestDoc?.order || 0) + 1
            })

            await document.save()
            return document.toObject() // Convert to plain object
        }

        throw createError({
            statusCode: 405,
            statusMessage: 'Method not allowed'
        })
    } catch (error) {
        console.error('Documents API error:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Internal server error'
        })
    }
})