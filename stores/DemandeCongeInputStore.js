import {defineStore} from "pinia";
import {useUserStore} from "~/stores/UserStore.js";

let dateDemandeDebut = ref(null)
let dateDemandeFin = ref(null)
let dateDebutCongeDebut = ref(null)
let dateDebutCongeFin = ref(null)
let dateFinCongeDebut = ref(null)
let dateFinCongeFin = ref(null)
let matricule = ref(null)
let latestDemand = ref(null)
let affectedDemands = ref(null)
let demandeConge = ref(null)
let demands = ref([])

export let useDemandeCongeInputStore = defineStore('demandeCongeInput', {
    state() {
        return {
            dateDemandeDebut, dateDemandeFin, dateDebutCongeDebut, dateDebutCongeFin, dateFinCongeDebut, dateFinCongeFin, matricule, demands, demandeConge, latestDemand, affectedDemands
        }
    },

    actions: {
        async rejectDemand(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'reject_demand', data}
            }).then((res) => {
                const userStore = useUserStore()
                userStore.assignUser(res)
            }).catch(err => console.log(err))
        },
        async cancelDemand(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'cancel_demand', data}
            }).then((res) => {
                const userStore = useUserStore()
                userStore.assignUser(res)
            }).catch(err => console.log(err))
        },
        async acceptDemand(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'accept_demand', data}
            }).then((res) => {

            }).catch(err => console.log(err))
        },
        async getAffectedDemands(fetchFunc, data) {
          await fetchFunc('/data', {
              method: 'POST',
              body: {type: 'affected_demands', data}
          }).then((res) => {
              console.log(res)
              this.affectedDemands = res
          }).catch(err => console.log(err))
        },
        async getLatestDemand(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'latest_demand', data}
            }).then((res) => {
                console.log(res, "getLatestDemand")
                this.latestDemand = res
            }).catch(err => console.log(err))
        },
        async createNewDemand(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'create_demand', data}
            }).then((res) => {

            }).catch(err => console.log(err))
        },
        async exportFile(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'export_demands', data}
            }).then((res) => {
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(res)
                link.download = 'demands.xlsx'
                link.click()
                console.log(res)
            }).catch(err => console.log(err))
        },
        async sendFormDataToBackend(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'search_demands', data}
            }).then((res) => {
                this.demands = res;
                console.log(this.demands)
            }).catch(err => console.log(err))
        },
        async fetchDemands(fetchFunc, data, page= 1) {
            await fetchFunc(`/data?page=${page}`, {
                method: 'POST',
                body: {type: 'search_demands', data}
            }).then((res) => {
                this.demands = res;
            }).catch(err => console.log(err))
        }
    }
})
