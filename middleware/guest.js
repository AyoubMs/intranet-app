import {useAuth} from "~/composables/useAuth.js";

export default defineNuxtRouteMiddleware((to, from) => {
    const {isLoggedIn} = useAuth()
    console.log(isLoggedIn.value)
    if (isLoggedIn.value && process.client) {
        window.location.pathname = '/dashboard'
    }
})
