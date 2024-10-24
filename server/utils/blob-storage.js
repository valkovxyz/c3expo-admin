// server/utils/blob-storage.js
import { put, del, list } from '@vercel/blob';

export class BlobStorageService {
    constructor() {
        this.config = useRuntimeConfig();
    }

    /**
     * Upload file to Vercel Blob Storage
     * @param {File} file - File to upload
     * @param {string} pathname - Custom path for the file
     * @returns {Promise<Object>} Uploaded file info
     */
    async uploadFile(file, customFilename) {
        try {
            // Используем переданное имя файла или генерируем из оригинального
            const filename = customFilename || path.basename(file.originalFilename || 'unnamed-file');

            // Создаем читаемый поток из файла
            const fileStream = file.filepath ? await import('fs').then(fs => fs.createReadStream(file.filepath)) : file;

            const blob = await put(filename, fileStream, {
                access: 'public',
                addRandomSuffix: false,
                contentType: file.mimetype || 'application/octet-stream'
            });

            return {
                url: blob.url,
                pathname: blob.pathname,
                contentType: blob.contentType,
                size: blob.size
            };
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Failed to upload file');
        }
    }


    /**
     * Delete file from Vercel Blob Storage
     * @param {string} pathname - Path to the file
     * @returns {Promise<void>}
     */
    async deleteFile(pathname) {
        try {
            await del(pathname);
        } catch (error) {
            console.error('Error deleting file:', error);
            throw new Error('Failed to delete file');
        }
    }

    /**
     * List all files in Blob Storage
     * @param {Object} options - Listing options (prefix, limit, etc.)
     * @returns {Promise<Array>} List of files
     */
    async listFiles(options = {}) {
        try {
            const { blobs } = await list(options);
            return blobs.map(blob => ({
                url: blob.url,
                pathname: blob.pathname,
                contentType: blob.contentType,
                size: blob.size,
                uploadedAt: blob.uploadedAt
            }));
        } catch (error) {
            console.error('Error listing files:', error);
            throw new Error('Failed to list files');
        }
    }
}