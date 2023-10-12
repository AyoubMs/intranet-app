import {defineStore} from "pinia";

let teams = ref(null)
let selectedTeams = ref([])


export let useTeamStore = defineStore('teams', {
    state() {
        return {
            teams, selectedTeams
        }
    },

    actions: {
        async fetchTeams(fetchFunc, status = 'active_users', search = '') {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'team', status, search}
            }).then((data) => {
                this.teams = data;
            }).catch((err) => console.log(err));
        },
        selectTeam(teamData) {
            this.selectedTeams.push(teamData)
        },
        removeTeam(teamData) {
            this.selectedTeams = this.selectedTeams.filter((data) => data !== teamData)
        }
    }
})
