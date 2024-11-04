// server/api/files/upload.post.js
import { verifyAuth } from '../../utils/auth'
import { BlobStorageService } from '../../utils/blob-storage'
import formidable from 'formidable'

// Функция для генерации уникального имени файла
const generateUniqueFileName = (originalName = '') => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)

    // Получаем расширение файла
    const lastDot = originalName.lastIndexOf('.')
    const ext = lastDot !== -1 ? originalName.slice(lastDot) : ''

    // Получаем имя файла без расширения
    const nameWithoutExt = lastDot !== -1 ? originalName.slice(0, lastDot) : originalName

    // Очищаем имя файла
    const safeName = nameWithoutExt
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

    return `${safeName}-${timestamp}-${random}${ext}`
}

export default defineEventHandler(async (event) => {
    const auth = verifyAuth(event)

    try {
        const form = formidable({
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024,
            multiples: true
        });

        const [fields, files] = await form.parse(event.node.req);
        const file = files.file[0];

        if (!file) {
            throw createError({
                statusCode: 400,
                statusMessage: 'No file provided'
            });
        }

        const safeFileName = generateUniqueFileName(file.originalFilename)
        const blobService = new BlobStorageService();
        const result = await blobService.uploadFile(file, safeFileName);

        return {
            ...result,
            originalName: file.originalFilename,
            size: file.size,
            type: file.mimetype
        };
    } catch (error) {
        console.error('Error handling file upload:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || 'Failed to upload file'
        });
    }
})