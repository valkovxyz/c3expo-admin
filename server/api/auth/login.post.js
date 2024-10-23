import { connectToDatabase } from '../../db/mongoose.js';
import { User } from '../../models/User';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    await connectToDatabase();

    const body = await readBody(event);
    const { username, password } = body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid username or password',
            });
        }

        const config = useRuntimeConfig();
        const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1d' });

        setCookie(event, 'dashboard_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            domain: process.env.NODE_ENV === 'production' ? '.domain.com' : undefined
        });

        return { success: true };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Error logging in',
        });
    }
});