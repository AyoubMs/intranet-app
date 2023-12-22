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
let typesConge = ref([])
let demandesCongeLogs = ref([])

export let useDemandeCongeInputStore = defineStore('demandeCongeInput', {
    state() {
        return {
            dateDemandeDebut, dateDemandeFin, dateDebutCongeDebut, dateDebutCongeFin, dateFinCongeDebut, dateFinCongeFin, matricule, demands, demandeConge, latestDemand, affectedDemands, typesConge, demandesCongeLogs
        }
    },

    actions: {
        async getDemandesCongeLogs(fetchFunc) {
            await fetchFunc('/data', {
                method: "POST",
                body: {type: 'get_demandes_conge_logs'}
            }).then(data => {
                this.demandesCongeLogs = data
            }).catch(err => console.log(err))
        },
        async refreshDemandData(fetchFunc, data) {
            await fetchFunc('/data', {
                method: "POST",
                body: {type: 'refresh_demand_data', data}
            }).catch(err => console.log(err))
        },
        async getAllTypesConge(fetchFunc) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'type_demand_conge'}
            }).then((data) => {
                this.typesConge = data
            })
        },
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
        async acceptDemandResponsableQualiteFormation(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'accept_demand_responsable_qualite_formation', data}
            }).catch(err => console.log(err))
        },
        async acceptDemandCoordinatorQualiteFormation(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'accept_demand_coordinator_qualite_formation', data}
            }).catch(err => console.log(err))
        },
        async acceptDemandOpsManager(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'accept_demand_ops_manager', data}
            }).catch(err => console.log(err))
        },
        async acceptDemandITResponsable(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'accept_demand_it_responsable', data}
            }).catch(err => console.log(err))
        },
        async acceptDemandSupervisor(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'accept_demand_supervisor', data}
            }).catch(err => console.log(err))
        },
        async acceptDemandVigie(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'accept_demand_vigie', data}
            }).catch(err => console.log(err))
        },
        async acceptDemandCPS(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'accept_demand_cps', data}
            }).catch(err => console.log(err))
        },
        async acceptDemandCCI(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'accept_demand_cci', data}
            }).catch(err => console.log(err))
        },
        async acceptDemandCoordinatorVigie(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'accept_demand_coordinator_vigie', data}
            }).catch(err => console.log(err))
        },
        async acceptDemandCoordinatorCPS(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'accept_demand_coordinator_cps', data}
            }).catch(err => console.log(err))
        },
        async acceptDemandHeadOfOperationalExcellence(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'accept_demand_head_of_operational_excellence', data}
            }).catch(err => console.log(err))
        },
        async acceptDemandRespRHOrChargeRHOrClose(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'accept_demand_responsable_rh_or_charge_rh_or_close', data}
            }).catch(err => console.log(err))
        },
        async acceptDemandDirector(fetchFunc, data) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'accept_demand_director', data}
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
