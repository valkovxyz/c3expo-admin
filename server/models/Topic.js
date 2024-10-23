import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
    topicName: { type: String, required: true, unique: true },
    content: {
        en: {
            title: String,
            text: String
        },
        de: {
            title: String,
            text: String
        }
    },
    defaultColor: { type: String, default: '#36e4da' }
});

export const Topic = mongoose.models.Topic || mongoose.model('Topic', topicSchema);