import {defineStore} from "pinia";

let user = ref(null)
let users = ref(null)
let searchedUser = ref('')
let addingUserErrors = ref([])
let editingUserErrors = ref([])
let deactivatingUserErrors = ref([])


export let useUserStore = defineStore('user', {
    state() {
        return {
            user, users, searchedUser, addingUserErrors, editingUserErrors, deactivatingUserErrors
        }
    },

    actions: {
        async increaseSoldes(fetchFunc) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'inject_solde'}
            }).catch(err => console.log(err))
        },
        async deactivateUser(fetchFunc, body) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'deactivate_user', body}
            }).then(data => {
                switch(typeof(data)) {
                    case 'object':
                        this.deactivatingUserErrors = data;
                        break;
                    case 'string':
                        this.deactivatingUserErrors = [];
                        break;
                }
            }).catch(err => console.log(err))
        },
        async affectUser(fetchFunc, body) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'affect_user', body}
            }).catch(err => console.log(err))
        },
        async editUser(fetchFunc, body) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'edit_user', body}
            }).then(data => {
                switch(typeof(data)) {
                    case 'object':
                        this.editingUserErrors = data;
                        break;
                    case 'string':
                        this.editingUserErrors = [];
                        break;
                }
            }).catch(err => console.log(err))
        },
        async addUser(fetchFunc, body) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'add_user', body}
            }).then(data => {
                switch(typeof(data)) {
                    case 'object':
                        this.addingUserErrors = data;
                        break;
                    case 'string':
                        this.addingUserErrors = [];
                        break;
                }
            }).catch(err => console.log(err))
        },
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
        },
        refreshAddingUserErrors() {
            this.addingUserErrors = [];
        },
        refreshEditingUserErrors() {
            this.editingUserErrors = [];
        }
    }
})
