import {defineStore} from "pinia";

let user = ref(null)

export let useUserStore = defineStore('user', {
    state() {
        return {
            user
        }
    },

    actions: {
        async fetchUser(fetchFunc, func) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'user'}
            }).then((data) => {
                func(data);
                this.user = JSON.parse(data);
            }).catch((err) => console.log(err))
        }
    }
})
