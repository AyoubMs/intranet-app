import {defineStore} from "pinia";

let dateDebut = ref(null)
let dateFin = ref(null)
let status = ref(null)


export let useInputStore = defineStore('inputs', {
    state() {
        return {
            dateDebut, dateFin, status: 'active_users'
        }
    },

    actions: {
        assignStatus(data) {
            this.status = data;
        }
    }
})
