// middleware/auth.js
export default defineNuxtRouteMiddleware((to) => {
    const token = useCookie('dashboard_token', {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        path: '/'
    })

    const isLoginPage = to.path === '/login'

    // Если есть токен и это страница логина - редирект на главную
    if (token.value && isLoginPage) {
        return navigateTo('/')
    }

    // Если нет токена и это не страница логина - редирект на логин
    if (!token.value && !isLoginPage) {
        return navigateTo('/login')
    }
})