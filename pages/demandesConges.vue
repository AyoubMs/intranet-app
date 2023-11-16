<script setup lang="ts">

import ButtonWithIcon from "~/components/ButtonWithIcon.vue";
import InputType from "~/components/InputType.vue";
import {definePageMeta, useAuth} from "#imports";
import {useDemandeCongeInputStore} from "~/stores/DemandeCongeInputStore";
import {useSoldeInputStore} from "~/stores/SoldeInputStore";
import Pagination from "~/pages/Pagination.vue";
import FormInput from "~/components/FormInput.vue";
import Modal from "~/components/Modal.vue";
import {useTeamStore} from "~/stores/TeamStore";
import {useUserStore} from "~/stores/UserStore";

definePageMeta({
  middleware: ['auth']
})

const {$apiFetch} = useNuxtApp()

const demandeCongeInputStore = useDemandeCongeInputStore()
const soldeInputStore = useSoldeInputStore()

let demandForm = ref({
  date_demande_debut: null,
  date_demande_fin: null,
  date_debut_conge_debut: null,
  date_debut_conge_fin: null,
  date_fin_conge_debut: null,
  date_fin_conge_fin: null,
  matricule: null
})

const searchBackend = async () => {
  demandForm.value = {
    date_demande_debut: demandeCongeInputStore.dateDemandeDebut,
    date_demande_fin: demandeCongeInputStore.dateDemandeFin,
    date_debut_conge_debut: demandeCongeInputStore.dateDebutCongeDebut,
    date_debut_conge_fin: demandeCongeInputStore.dateDebutCongeFin,
    date_fin_conge_debut: demandeCongeInputStore.dateFinCongeDebut,
    date_fin_conge_fin: demandeCongeInputStore.dateFinCongeFin,
    matricule: demandeCongeInputStore.matricule
  }

  console.log(demandeCongeInputStore.demands)
  soldeInputStore.loadTableData()
  await demandeCongeInputStore.sendFormDataToBackend($apiFetch, demandForm.value).catch(err => console.log(err))
  soldeInputStore.finishLoadingTableData()
}

const exportFunc = async () => {
  await demandeCongeInputStore.exportFile($apiFetch, demandForm.value).catch(err => console.log(err));
}

const fetchDemandsPartial = async ({url, active}: { url: any, active: boolean }) => {
  if (url && !active) {
    let page = url.split('=')[1]
    soldeInputStore.loadTableData();
    await demandeCongeInputStore.fetchDemands($apiFetch, demandForm.value, page).catch(err => console.log(err))
    soldeInputStore.finishLoadingTableData()
  }
}

let showModal = ref(false)

let loadedTable = ref(false)

const {setUser} = useAuth()

const newDemand = async () => {
  showModal.value = true;
}

const closeModal = () => {
  showModal.value = false;
}

let userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchUser($apiFetch, setUser).catch(err => console.log(err))
  await searchBackend()
})

</script>

<template>
  <Title>Demandes de congés</Title>

  <h1 class="font-bold text-3xl mx-3 py-4 my-2">Saisie / Suivi des demandes</h1>
  <div class="h-1/6 mt-4 mx-3">
    <div class="bg-cyan-600 rounded-t-md p-4 text-white text-2xl">Rechercher</div>
    <div class="bg-white pl-4 pt-2 pb-1">
      <div class="flex flex-col">
        <div class="flex w-full">
          <InputType val="date_demande_debut" type="date" title="demandé entre le"/>
          <InputType val="date_demande_fin" type="date" title="Et le"/>
          <InputType val="date_debut_conge_debut" type="date" title="date début entre le"/>
          <InputType val="date_debut_conge_fin" type="date" title="Et le"/>
          <InputType val="date_fin_conge_debut" type="date" title="Date fin entre le"/>
          <InputType val="date_fin_conge_fin" type="date" title="Et le"/>
        </div>
        <div class="flex">
          <InputType type="number" title="matricule" val="demandeCongesMatricule"/>
        </div>
      </div>
      <div class="flex bg-gray-100 mr-3 p-3">
        <ButtonWithIcon
                        classes="mr-auto bg-cyan-600 hover:bg-cyan-700 focus:bg-cyan-700 active:bg-cyan-900 focus:ring-cyan-500"
                        :disabled="(Number(userStore.user?.solde_cp) + Number(userStore.user?.solde_rjf) === 0)"
                        @click.prevent="newDemand()">
          <i class="fa-solid fa-paper-plane mr-3"></i>
          Nouvelle Demande
        </ButtonWithIcon>
        <div>
          <ButtonWithIcon
              classes="ml-auto bg-cyan-600 hover:bg-cyan-700 focus:bg-cyan-700 active:bg-cyan-900 focus:ring-cyan-500 mx-3"
              @click.prevent="exportFunc()">Exporter
          </ButtonWithIcon>
          <ButtonWithIcon
              classes="ml-auto bg-cyan-600 hover:bg-cyan-700 focus:bg-cyan-700 active:bg-cyan-900 focus:ring-cyan-500"
              @click.prevent="searchBackend()">Valider
          </ButtonWithIcon>
        </div>
      </div>
    </div>
    <div class="p-3 bg-white mt-6">
      <div v-if="soldeInputStore.loadingTable">Loading...</div>
      <NCCTable v-if="!soldeInputStore.loadingTable" type="demandesConges"/>
      <Pagination :links="demandeCongeInputStore.demands?.links" @fetching="fetchDemandsPartial"/>
    </div>

    <Modal :show="showModal" :demandeConge="showModal" @close="closeModal()"/>
  </div>
</template>

<style scoped>

</style>
