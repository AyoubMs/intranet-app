import { defineNuxtPlugin } from '#app'
import Cookies from 'js-cookie'
import {ofetch} from "ofetch";

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig()

    nuxtApp.provide(
        'apiFetch',
        async (url, options = {}, secure = false ) => {
            return await ofetch(url, {
                baseURL: !secure ? 'http://localhost:8000' : 'https://intranet.test',
                retry: 3,
                retryDelay: 500,
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'),
                },
                method: options?.method,
                body: options?.body
            })
        }
    )
})
