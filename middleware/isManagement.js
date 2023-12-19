import {useAuth} from "~/composables/useAuth.js";
import Cookies from "js-cookie";
import {navigateTo} from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
    const {getUser} = useAuth()


    if (process.client) {
        const user = JSON.parse(getUser().name)
        const roleName = user.role?.name;
        const isHR = roleName?.toLowerCase().includes('rh') || roleName?.toLowerCase()?.includes('humain');
        if (!isHR) {
            window.location.pathname = '/dashboard'
        }
    }
})
