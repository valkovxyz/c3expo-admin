import { connectToDatabase } from '../../db/mongoose';
import { Topic } from '../../models/Topic';

export default defineEventHandler(async (event) => {
    await connectToDatabase();

    try {
        const topics = await Topic.find({}, 'topicName content.en.title content.de.title');
        return topics;
    } catch (error) {
        console.error('Error fetching topics:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error fetching topics',
        });
    }
});