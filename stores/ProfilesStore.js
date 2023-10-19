import {defineStore} from "pinia";

let profiles = ref(null)
let selectedProfiles = ref([])


export let useProfilesStore = defineStore('profiles', {
    state() {
        return {
            profiles, selectedProfiles
        }
    },

    actions: {
        async fetchProfiles(fetchFunc, search='') {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'profile', search}
            }).then((data) => {
                this.profiles = data;
            }).catch((err) => console.log(err));
        },
        selectProfile(profileData) {
            this.selectedProfiles.push(profileData)
        },
        removeProfile(profileData) {
            this.selectedProfiles = this.selectedProfiles.filter((data) => data !== profileData)
        }
    }
})
