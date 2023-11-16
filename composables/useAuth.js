export function useAuth() {
    function setUser(name) {
        removeUser()
        localStorage.setItem('user', JSON.stringify({name}))
    }

    function getUser() {
        return JSON.parse(localStorage.getItem('user'))
    }

    function removeUser() {
        localStorage.removeItem('user')
    }

    const isLoggedIn = computed(() => {
        if (process.client) {
            return JSON.parse(localStorage.getItem('user'))?.name !== ''
        }
    })

    return { setUser, getUser, removeUser, isLoggedIn }
}
