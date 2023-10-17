import {defineStore} from "pinia";

let languages = ref(null)
let selectedLanguages = ref([])


export let useLanguagesStore = defineStore('languages', {
    state() {
        return {
            languages, selectedLanguages, loadingLanguages: false
        }
    },

    actions: {
        async fetchLanguages(fetchFunc, search) {
            await fetchFunc('/data', {
                method: 'POST',
                body: {type: 'language', search}
            }).then((data) => {
                this.languages = data;
            }).catch((err) => console.log(err));
        },
        selectLanguage(languageData) {
            this.selectedLanguages.push(languageData)
        },
        removeLanguage(languageData) {
            this.selectedLanguages = this.selectedLanguages.filter((data) => data !== languageData)
        },
        loadLanguagesData() {
            this.loadingLanguages = true;
        },
        finishLoadingLanguagesData() {
            this.loadingSourcingProviders = false;
        },
    }
})
