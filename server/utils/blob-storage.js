// server/utils/blob-storage.js
import { put, del, list } from '@vercel/blob';

export class BlobStorageService {
    constructor() {
        this.config = useRuntimeConfig();
        if (!this.config.blobReadWriteToken) {
            console.warn('BLOB_READ_WRITE_TOKEN is not set');
        }
    }

    async uploadFile(file, customFilename) {
        try {
            // Создаем читаемый поток из файла
            const fileStream = file.filepath ? await import('fs').then(fs => fs.createReadStream(file.filepath)) : file;

            const blob = await put(customFilename || file.originalFilename, fileStream, {
                access: 'public',
                token: this.config.blobReadWriteToken,
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
            console.error('Blob upload error:', error);
            throw new Error('Failed to upload file');
        }
    }

    async listFiles(options = {}) {
        try {
            const { blobs } = await list({
                token: this.config.blobReadWriteToken,
                ...options
            });
            return blobs.map(blob => ({
                url: blob.url,
                pathname: blob.pathname,
                contentType: blob.contentType,
                size: blob.size,
                uploadedAt: blob.uploadedAt
            }));
        } catch (error) {
            console.error('Blob list error:', error);
            throw new Error('Failed to list files');
        }
    }

    async deleteFile(pathname) {
        try {
            await del(pathname, {
                token: this.config.blobReadWriteToken
            });
        } catch (error) {
            console.error('Blob delete error:', error);
            throw new Error('Failed to delete file');
        }
    }
}