<script setup>

import {useDemandeCongeInputStore} from "~/stores/DemandeCongeInputStore.js";
import {useSoldeInputStore} from "~/stores/SoldeInputStore.js";
import Pagination from "~/components/Pagination.vue";

const {$apiFetch} = useNuxtApp()

const demandeCongeInputStore = useDemandeCongeInputStore()

let inputStore = useSoldeInputStore()


onMounted(async () => {
    inputStore.loadTableData();
    await demandeCongeInputStore.getDemandesCongeLogs($apiFetch).then(() => {
        inputStore.finishLoadingTableData()
    }).catch(err => console.log(err))
    console.log(demandeCongeInputStore.demandesCongeLogs)
})

const fetchDemandesCongesLogsPartial = async (url) => {
    let page = url?.url?.split('=')[1]
    inputStore.loadTableData();
    await demandeCongeInputStore.getDemandesCongeLogsPartial($apiFetch, page).then(() => {
        inputStore.finishLoadingTableData()
    }).catch(err => console.log(err))
}

</script>

<template>
    <Title>Suivi du Solde</Title>
    <h1 class="font-bold text-3xl my-6 mx-6">Historique des Soldes CP & RJF</h1>
    <div class="bg-white">
        <div class="py-12" v-if="demandeCongeInputStore.demandesCongeLogs">
            <NCCTable type="suiviSolde"/>
        </div>
        <div class="mx-12 my-6 pb-6">
            <Pagination :links="demandeCongeInputStore.demandesCongeLogs?.links" @fetching="fetchDemandesCongesLogsPartial" />
        </div>
    </div>
</template>

<style scoped>

</style>
