import {defineStore} from "pinia";

let dateDebut = ref(null)
let dateFin = ref(null)
let identityTypes = ref(null)
let sourcingTypes = ref(null)
let sourcingProviders = ref(null)
let nationalities = ref(null)
let familySituations = ref(null)
let showModal = ref(false);

export let useInputStore = defineStore('inputs', {
    state() {
        return {
            dateDebut, dateFin, status: 'active_users', loadingTable: false, loadingTeams: false, sexe: 'homme', identityTypes, sourcingTypes, sourcingProviders, nationalities, familySituations, sendingUser: false, showModal
        }
    },

    actions: {
        async fetchFamilySituations(fetchFunc) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'family_situations'}
            }).then((data) => {
                this.familySituations = data;
            }).catch(err => console.log(err))
        },
        async fetchSourcingProviders(fetchFunc) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'sourcing_providers'}
            }).then((data) => {
                this.sourcingProviders = data;
            }).catch(err => console.log(err))
        },
        async fetchNationalities(fetchFunc) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'nationalities'}
            }).then((data) => {
                this.nationalities = data;
            }).catch(err => console.log(err))
        },
        async fetchSourcingTypes(fetchFunc) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'sourcing_types'}
            }).then((data) => {
                this.sourcingTypes = data;
            }).catch(err => console.log(err))
        },
        async fetchIdentityTypes(fetchFunc) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'identities'}
            }).then((data) => {
                this.identityTypes = data;
            }).catch(err => console.log(err))
        },
        assignStatus(data) {
            this.status = data;
        },
        assignSexe(data) {
            this.sexe = data;
        },
        loadTeamsData() {
            this.loadingTeams = true;
        },
        finishLoadingTeamsData() {
            this.loadingTeams = false;
        },
        loadTableData() {
            this.loadingTable = true;
        },
        finishLoadingTableData() {
            this.loadingTable = false;
        },
        beginSendingUserData() {
            this.sendingUser = true;
        },
        finishSendingUserData() {
            this.sendingUser = false;
        },
    }
})
