// server/api/documents/[id].js
import mongoose from 'mongoose'
import { connectToDatabase } from '../../db/mongoose'
import { Document } from '../../models/Document'
import { verifyAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    try {
        await connectToDatabase()
        const id = event.context.params.id

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid document ID'
            })
        }

        // DELETE method
        if (event.node.req.method === 'DELETE') {
            const auth = verifyAuth(event)

            try {
                // Find and delete the document
                const document = await Document.findById(id)

                if (!document) {
                    throw createError({
                        statusCode: 404,
                        statusMessage: 'Document not found'
                    })
                }

                // Delete the document
                await Document.deleteOne({ _id: id })

                // Update order of remaining documents
                await Document.updateMany(
                    { order: { $gt: document.order } },
                    { $inc: { order: -1 } }
                )

                return { message: 'Document deleted successfully' }
            } catch (error) {
                console.error('Error during document deletion:', error)
                throw error
            }
        }

        // PUT method
        if (event.node.req.method === 'PUT') {
            const auth = verifyAuth(event)
            const body = await readBody(event)

            const document = await Document.findByIdAndUpdate(
                id,
                {
                    ...body,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true,
                    lean: true
                }
            )

            if (!document) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Document not found'
                })
            }

            return document
        }

        throw createError({
            statusCode: 405,
            statusMessage: 'Method not allowed'
        })
    } catch (error) {
        console.error(`Document API error for ID ${event.context.params.id}:`, error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Internal server error'
        })
    }
})