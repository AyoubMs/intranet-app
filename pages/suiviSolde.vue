<script setup>

import {useDemandeCongeInputStore} from "~/stores/DemandeCongeInputStore.js";
import {useSoldeInputStore} from "~/stores/SoldeInputStore.js";

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

</script>

<template>
<h1 class="font-bold text-3xl my-6 mx-6">Historique des Soldes CP & RJF</h1>
    <div class="bg-white">
        <div class="py-12" v-if="demandeCongeInputStore.demandesCongeLogs">
            <NCCTable type="suiviSolde" />
        </div>
    </div>
</template>

<style scoped>

</style>
