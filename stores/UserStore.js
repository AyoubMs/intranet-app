import {defineStore} from "pinia";

let user = ref(null)
let users = ref(null)

export let useUserStore = defineStore('user', {
    state() {
        return {
            user, users
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
        },
        async fetchUsers(fetchFunc, status, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'users', status, data}
            }).then((data) => {
                this.users = data;
            }).catch((err) => console.log(err));
        }
    }
})
