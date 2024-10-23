import { connectToDatabase } from '../../db/mongoose';
import { Topic } from '../../models/Topic';

export default defineEventHandler(async (event) => {
    await connectToDatabase();

    const topicName = event.context.params.topicName;

    if (!topicName) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Topic name is required',
        });
    }

    if (event.node.req.method === 'GET') {
        try {
            const topic = await Topic.findOne({ topicName });
            if (!topic) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Topic not found',
                });
            }
            return topic;
        } catch (error) {
            console.error('Error fetching topic:', error);
            throw createError({
                statusCode: 500,
                statusMessage: 'Error fetching topic',
            });
        }
    } else if (event.node.req.method === 'PUT') {
        const body = await readBody(event);
        const { language, title, content } = body;

        if (!language || !title || !content) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Language, title, and content are required',
            });
        }

        try {
            const updateQuery = {
                [`content.${language}.title`]: title,
                [`content.${language}.text`]: content,
            };

            const updatedTopic = await Topic.findOneAndUpdate(
                { topicName },
                { $set: updateQuery },
                { new: true, upsert: true }
            );

            return updatedTopic;
        } catch (error) {
            console.error('Error updating topic:', error);
            throw createError({
                statusCode: 500,
                statusMessage: 'Error updating topic',
            });
        }
    }

    throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed',
    });
});