import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const topicSchema = new mongoose.Schema({
    topicName: { type: String, required: true, unique: true },
    content: {
        en: {
            title: String,
            content: String
        },
        de: {
            title: String,
            content: String
        }
    }
});

const Topic = mongoose.model('Topic', topicSchema);

const initialTopics = [
    {
        topicName: 'our-mission',
        content: {
            en: { title: 'Our Mission', content: '' },
            de: { title: 'Unsere Mission', content: '' }
        }
    },
    {
        topicName: 'our-vision',
        content: {
            en: { title: 'Our Vision', content: '' },
            de: { title: 'Unsere Vision', content: '' }
        }
    },
    {
        topicName: 'heritage',
        content: {
            en: { title: 'Heritage', content: '' },
            de: { title: 'Erbe', content: '' }
        }
    },
    {
        topicName: 'ceo-statement',
        content: {
            en: { title: 'CEO Statement', content: '' },
            de: { title: 'Vorstandserklärung', content: '' }
        }
    },
    {
        topicName: 'our-expertise',
        content: {
            en: { title: 'Our Expertise', content: '' },
            de: { title: 'Unsere Expertise', content: '' }
        }
    },
    {
        topicName: 'world-wide-network',
        content: {
            en: { title: 'World Wide Network', content: '' },
            de: { title: 'Weltweites Netzwerk', content: '' }
        }
    },
    {
        topicName: 'exhibition-booth',
        content: {
            en: { title: 'Exhibition Booth', content: '' },
            de: { title: 'Messestand', content: '' }
        }
    },
    {
        topicName: 'references',
        content: {
            en: { title: 'References', content: '' },
            de: { title: 'Referenzen', content: '' }
        }
    }
];

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

async function initDatabase() {
    await connectToDatabase();

    for (const topic of initialTopics) {
        await Topic.findOneAndUpdate(
            { topicName: topic.topicName },
            topic,
            { upsert: true, new: true }
        );
    }

    console.log('Database initialized with predefined topics');
    await mongoose.connection.close();
    process.exit(0);
}

initDatabase().catch(error => {
    console.error('Error initializing database:', error);
    process.exit(1);
});