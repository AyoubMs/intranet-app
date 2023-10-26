import { defineNuxtPlugin } from '#app'
import Cookies from 'js-cookie'
import {ofetch} from "ofetch";
import {v4 as uuidv4} from 'uuid';

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig()

    if (process.client && !localStorage.getItem('uuid')) {
        localStorage.setItem('uuid', uuidv4());
    }

    nuxtApp.provide(
        'apiFetch',
        async (url, options = {}, secure = false ) => {
            if (process.client) {
                let headers = {};
                if (options?.content) {
                    headers = {
                        Accept: 'application/json',
                        // 'Content-Type': options.content,
                        'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'),
                        'laravel_session': Cookies.get('laravel_session'),
                        'uuid': localStorage.getItem('uuid')
                    }
                } else {
                    headers = {
                        Accept: 'application/json',
                        'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'),
                        'laravel_session': Cookies.get('laravel_session'),
                        'uuid': localStorage.getItem('uuid')
                    }
                }
                return await ofetch(url, {
                    baseURL: !secure ? 'http://localhost:8000' : 'https://intranet.test',
                    retry: 6,
                    retryDelay: 500,
                    credentials: 'include',
                    headers: headers,
                    method: options?.method,
                    body: options?.body,
                })
            }
        }
    )
})
