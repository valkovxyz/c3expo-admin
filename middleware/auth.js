export default defineNuxtRouteMiddleware((to) => {
    // Выполняем проверку только на клиенте
    if (process.client) {
        const token = localStorage.getItem('dashboard_token')

        // Если нет токена и пытаемся получить доступ к защищенному маршруту
        if (!token && to.path !== '/login') {
            return navigateTo('/login')
        }

        // Если есть токен и пытаемся получить доступ к странице входа
        if (token && to.path === '/login') {
            return navigateTo('/')
        }
    }
})