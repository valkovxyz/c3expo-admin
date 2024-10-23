import { connectToDatabase } from '../../db/mongoose';
import { Topic } from '../../models/Topic';

export default defineEventHandler(async (event) => {
    await connectToDatabase();

    const topicName = event.context.params.topicName;
    const body = await readBody(event);

    try {
        const updatedTopic = await Topic.findOneAndUpdate(
            { topicName },
            { $set: body },
            { new: true, upsert: true }
        );
        return updatedTopic;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Error updating topic',
        });
    }
});