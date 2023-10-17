import {defineStore} from "pinia";

let user = ref(null)
let users = ref(null)
let searchedUser = ref('')

export let useUserStore = defineStore('user', {
    state() {
        return {
            user, users, searchedUser
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
        async fetchUsers(fetchFunc, status, data, page= 1) {
            await fetchFunc(`/data?page=${page}`, {
                method: 'POST',
                body: {type: 'users', status, data}
            }).then((data) => {
                this.users = data;
            }).catch((err) => console.log(err));
        },
        async fetchUserByRegNumber(fetchFunc, regNumber) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'userByRegNumber', search: regNumber}
            }).then((data) => {
                this.searchedUser = data;
            }).catch((err) => console.log(err))
        }
    }
})
