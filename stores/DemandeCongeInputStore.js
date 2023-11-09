import {defineStore} from "pinia";

let dateDemandeDebut = ref(null)
let dateDemandeFin = ref(null)
let dateDebutCongeDebut = ref(null)
let dateDebutCongeFin = ref(null)
let dateFinCongeDebut = ref(null)
let dateFinCongeFin = ref(null)
let matricule = ref(null)
let demandeConge = ref(null)
let demands = ref([])

export let useDemandeCongeInputStore = defineStore('demandeCongeInput', {
    state() {
        return {
            dateDemandeDebut, dateDemandeFin, dateDebutCongeDebut, dateDebutCongeFin, dateFinCongeDebut, dateFinCongeFin, matricule, demands, demandeConge
        }
    },

    actions: {
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
