import {useAuth} from "~/composables/useAuth.js";
import Cookies from "js-cookie";

export default defineNuxtRouteMiddleware((to, from) => {
    const {isLoggedIn} = useAuth()

    setTimeout(() => {
        if (!Cookies.get('XSRF-TOKEN') || !isLoggedIn.value) {
            // window.location.pathname = '/'
            return navigateTo('/')
        }
    }, Cookies.get('XSRF-TOKEN') ? 3000 : 0)
})
