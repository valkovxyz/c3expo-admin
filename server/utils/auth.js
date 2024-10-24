import jwt from 'jsonwebtoken'

export const verifyAuth = (event) => {
    const token = getCookie(event, 'dashboard_token')

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    try {
        const decoded = jwt.verify(token, useRuntimeConfig().jwtSecret)
        return decoded
    } catch (error) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid token'
        })
    }
}