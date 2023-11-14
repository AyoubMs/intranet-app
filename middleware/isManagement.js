import {useAuth} from "~/composables/useAuth.js";
import Cookies from "js-cookie";
import {navigateTo} from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
    const {getUser} = useAuth()


    if (process.client) {
        const user = JSON.parse(getUser().name)
        if (user.role?.name.includes('Conseiller') || user.role?.name.includes('FR') || user.role?.name.includes('NL')) {
            window.location.pathname = '/dashboard'
        }
    }
})
