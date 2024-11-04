// server/api/documents/reorder.put.js
import { connectToDatabase } from '../../db/mongoose'
import { Document } from '../../models/Document'
import { verifyAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== 'PUT') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method not allowed'
        })
    }

    try {
        await connectToDatabase()
        const auth = verifyAuth(event)
        const { documents } = await readBody(event)

        if (!Array.isArray(documents) || documents.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid input format'
            })
        }

        // Use transaction for atomic updates
        const session = await mongoose.startSession()
        await session.withTransaction(async () => {
            // Batch update for better performance
            const bulkOps = documents.map((doc, index) => ({
                updateOne: {
                    filter: { _id: doc._id },
                    update: {
                        $set: {
                            order: index,
                            updatedAt: new Date()
                        }
                    }
                }
            }))

            await Document.bulkWrite(bulkOps, { session })
        })

        await session.endSession()
        return { message: 'Documents reordered successfully' }
    } catch (error) {
        console.error('Reorder documents API error:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Internal server error'
        })
    }
})