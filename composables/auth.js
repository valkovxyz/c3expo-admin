export const useAuth = () => {
    const token = useCookie('dashboard_token')
    const router = useRouter()

    const isAuthenticated = computed(() => !!token.value)

    const logout = () => {
        token.value = null
        router.push('/login')
    }

    const checkAuth = () => {
        if (!token.value) {
            router.push('/login')
            return false
        }
        return true
    }

    return {
        token,
        isAuthenticated,
        logout,
        checkAuth
    }
}