import {defineStore} from "pinia";

let teams = ref(null)
let selectedTeams = ref([])
let affectationTeams = ref([])
let selectedAffectationTeams = ref([])

export let useTeamStore = defineStore('teams', {
    state() {
        return {
            teams, selectedTeams, affectationTeams, selectedAffectationTeams
        }
    },

    actions: {
        async fetchTeams(fetchFunc, status = 'active_users', search = '', affectation = false) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'team', status, search}
            }).then((data) => {
                if (affectation) {
                    this.affectationTeams = data;
                } else {
                    this.teams = data;
                }
            }).catch((err) => console.log(err));
        },
        selectTeam(teamData) {
            this.selectedTeams.push(teamData)
        },
        removeTeam(teamData) {
            this.selectedTeams = this.selectedTeams.filter((data) => data !== teamData)
        },
        refreshAffectationTeams() {
            this.selectedAffectationTeams = [];
        },
        selectAffectationTeam(teamData) {
            this.selectedAffectationTeams.push(teamData)
        },
        removeAffectationTeam(teamData) {
            this.selectedAffectationTeams = this.selectedAffectationTeams.filter((data) => data !== teamData)
        }
    }
})
