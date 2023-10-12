<script setup lang="ts">

import {definePageMeta} from "#imports";
import ButtonWithIcon from "~/components/ButtonWithIcon.vue";
import InputType from "~/components/InputType.vue";
import RadioInput from "~/components/RadioInput.vue";
import {useTeamStore} from "~/stores/TeamStore";
import {useProfilesStore} from "~/stores/ProfilesStore";
import {useLanguagesStore} from "~/stores/LanguagesStore";
import {useInputStore} from "~/stores/InputStore";
import NCCTable from "~/components/NCCTable.vue";
import {useUserStore} from "~/stores/UserStore";

definePageMeta({
  middleware: ['auth']
})

const {$apiFetch}: any = useNuxtApp()

let userStore = useUserStore()

let teamStore = useTeamStore()

let profilesStore = useProfilesStore()

let languageStore = useLanguagesStore()

let inputStore = useInputStore()

let filterData = ref({
  teams: teamStore.selectedTeams,
  languages: languageStore.selectedLanguages,
  profiles: profilesStore.selectedProfiles,
  dateDebut: inputStore.dateDebut,
  dateFin: inputStore.dateFin,
  status: inputStore.status
})

onMounted(async () => {
  await teamStore.fetchTeams($apiFetch, inputStore.status)
  await profilesStore.fetchProfiles($apiFetch)
  await languageStore.fetchLanguages($apiFetch)
  await userStore.fetchUsers($apiFetch, inputStore.status, filterData.value)
  console.log(userStore.users)
})

const searchBackend = async () => {
  filterData.value = {
    teams: teamStore.selectedTeams,
    languages: languageStore.selectedLanguages,
    profiles: profilesStore.selectedProfiles,
    dateDebut: inputStore.dateDebut,
    dateFin: inputStore.dateFin,
    status: inputStore.status
  }
  inputStore.loadTableData();
  await userStore.fetchUsers($apiFetch, inputStore.status, filterData.value)
  inputStore.finishLoadingTableData()
  console.log(userStore.users)
}

let typeStatus = [
  {
    title: 'Tous les utilisateurs',
    val: 'all_users'
  },
  {
    title: 'Utilisateurs Actifs',
    val: 'active_users'
  },
  {
    title: 'Utilisateurs Inactifs',
    val: 'inactive_users'
  }
]

</script>

<template>
  <Title>Soldes</Title>
  <div class="p-6">
    <h1 class="font-bold text-3xl">Gestion des utilisateurs</h1>
    <div class="flex mt-6">
      <ButtonWithIcon
          classes="mr-auto bg-cyan-600 hover:bg-cyan-700 focus:bg-cyan-700 active:bg-cyan-900 focus:ring-cyan-500"
          icon-class="fa-solid fa-user-plus">
        Nouvel Utilisateur
      </ButtonWithIcon>

      <ButtonWithIcon
          classes="bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:ring-cyan-500"
          icon-class="fa-regular fa-file-excel">
        Augmenter Soldes
      </ButtonWithIcon>
    </div>
    <div class="h-1/6 mt-4">
      <div class="bg-cyan-600 rounded-t-md p-4 text-white text-2xl">Rechercher</div>
      <div class="bg-white pl-4 pt-2 pb-1">
        <div class="flex">
          <div class="flex w-full">
            <InputType val="date_mep_debut" type="date" title="Date MEP entre le"/>
            <InputType val="date_mep_fin" type="date" title="Et le"/>
          </div>
          <div class="flex w-full">
            <div class="mb-6">
              <label class="block mb-2 uppercase font-bold text-xs text-gray-700 mx-3"
                     for="statut"
              >
                Statut
              </label>
              <div class="flex">
                <RadioInput v-for="elem in typeStatus" :title="elem.title" :val="elem.val"/>
              </div>
            </div>
          </div>
        </div>
        <div class="flex">
          <InputType val="team" type="text" title="Team" :data="teamStore.teams"/>
          <div class="flex w-1/2">
            <InputType val="profile" type="text" title="Profile" :data="profilesStore.profiles"/>
            <InputType val="language" type="text" title="Langue principale"
                       :data="languageStore.languages"/>
          </div>
        </div>
        <div class="flex bg-gray-100 mr-3 p-3">
          <ButtonWithIcon
              classes="ml-auto bg-cyan-600 hover:bg-cyan-700 focus:bg-cyan-700 active:bg-cyan-900 focus:ring-cyan-500"
              @click.prevent="searchBackend()">Valider
          </ButtonWithIcon>
        </div>
      </div>
    </div>
  </div>
  <div class="p-6">
    <NCCTable />
  </div>
</template>

