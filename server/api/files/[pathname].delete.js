import { verifyAuth } from '../../utils/auth'
import { BlobStorageService } from '../../utils/blob-storage'

export default defineEventHandler(async (event) => {
    // Проверяем авторизацию для удаления
    const auth = verifyAuth(event)

    const pathname = event.context.params.pathname;

    try {
        const blobService = new BlobStorageService();
        await blobService.deleteFile(pathname);

        return { message: 'File deleted successfully' };
    } catch (error) {
        console.error('Error deleting file:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error deleting file'
        });
    }
})