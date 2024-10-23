import { connectToDatabase } from '../../db/mongoose';
import { User } from '../../models/User';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    await connectToDatabase();

    const body = await readBody(event);
    const { username, password } = body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Username already exists',
            });
        }

        const user = new User({ username, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, useRuntimeConfig().jwtSecret, { expiresIn: '1d' });

        return { token };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Error registering user',
        });
    }
});