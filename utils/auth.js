export const useAuth = () => {
    const getToken = () => {
        if (process.client) {
            return localStorage.getItem('dashboard_token')
        }
        return null
    }

    const setToken = (token) => {
        if (process.client) {
            localStorage.setItem('dashboard_token', token)
        }
    }

    const removeToken = () => {
        if (process.client) {
            localStorage.removeItem('dashboard_token')
        }
    }

    const checkAuth = () => {
        if (process.client) {
            return !!localStorage.getItem('dashboard_token')
        }
        return false
    }

    return {
        getToken,
        setToken,
        removeToken,
        checkAuth
    }
}