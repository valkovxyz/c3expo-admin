import { BlobStorageService } from '../../utils/blob-storage'

export default defineEventHandler(async (event) => {
    try {
        const blobService = new BlobStorageService()
        const files = await blobService.listFiles()
        return files
    } catch (error) {
        console.error('Error listing files:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error listing files'
        })
    }
})