<script setup lang="ts">

import {definePageMeta} from "#imports";
import ButtonWithIcon from "~/components/ButtonWithIcon.vue";
import InputType from "~/components/InputType.vue";
import RadioOrCheckboxInput from "~/components/RadioOrCheckboxInput.vue";
import {useTeamStore} from "~/stores/TeamStore";
import {useProfilesStore} from "~/stores/ProfilesStore";
import {useLanguagesStore} from "~/stores/LanguagesStore";
import {useSoldeInputStore} from "~/stores/SoldeInputStore";
import NCCTable from "~/components/NCCTable.vue";
import {useUserStore} from "~/stores/UserStore";
import {debounce} from "lodash";
import Modal from "~/components/Modal.vue";
import Pagination from "~/pages/Pagination.vue";

definePageMeta({
    middleware: ['auth', 'is-management']
})

const {$apiFetch}: any = useNuxtApp()

const createUser = ref(false)

let userStore = useUserStore()

let teamStore = useTeamStore()

let profilesStore = useProfilesStore()

let languageStore = useLanguagesStore()

let inputStore = useSoldeInputStore()

let filterData = ref({
    teams: teamStore.selectedTeams,
    languages: languageStore.selectedLanguages,
    profiles: profilesStore.selectedProfiles,
    dateDebut: inputStore.dateDebut,
    dateFin: inputStore.dateFin,
    status: inputStore.status
})

const searchUsers = ref(null)

onMounted(async () => {
    await userStore.fetchUserByRegNumber($apiFetch, searchUsers.value).catch(err => console.log(err))
    await userStore.fetchUsers($apiFetch, inputStore.status, filterData.value).catch(err => console.log(err))
});

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
    await userStore.fetchUsers($apiFetch, inputStore.status, filterData.value).catch(err => console.log(err))
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

const fetchUsersPartial = async ({url, active}: { url: any, active: boolean }) => {
    if (url && !active) {
        let page = url.split('=')[1]
        inputStore.loadTableData();
        await userStore.fetchUsers($apiFetch, inputStore.status, filterData.value, page).catch(err => console.log(err))
        inputStore.finishLoadingTableData()
    }
}

const searchUsersByRegNumber = async (regNumber: string | null) => {
    await debounce(async () => {
        inputStore.loadTableData()
        await userStore.fetchUserByRegNumber($apiFetch, regNumber).catch(err => console.log(err))
        inputStore.finishLoadingTableData()
        console.log(userStore.searchedUser)
    }, 1000)()
}

watch(searchUsers, () => {
    searchUsersByRegNumber(searchUsers.value);
})

let showModal = ref(false);
let increaseSolde = ref(false);

let newUser = () => {
    showModal.value = true;
    createUser.value = true;
}

let increasingSolde = () => {
    increaseSolde.value = true;
}

let closeModal = () => {
    if (showModal.value) {
        showModal.value = false
    } else if (increaseSolde.value) {
        increaseSolde.value = false
    }
}

</script>

<template>
    <Title>Soldes</Title>
    <div class="p-6">
        <h1 class="font-bold text-3xl">Gestion des utilisateurs</h1>
        <div class="flex mt-6">
            <ButtonWithIcon
                classes="mr-auto bg-cyan-600 hover:bg-cyan-700 focus:bg-cyan-700 active:bg-cyan-900 focus:ring-cyan-500"
                icon-class="fa-solid fa-user-plus" @click="newUser()">
                Nouvel Utilisateur
            </ButtonWithIcon>

            <ButtonWithIcon
                classes="bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:ring-cyan-500"
                icon-class="fa-regular fa-file-excel" @click="increasingSolde()">
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
                                   for="status"
                            >
                                Status
                            </label>
                            <div class="flex">
                                <RadioOrCheckboxInput v-for="elem in typeStatus" :title="elem.title" :val="elem.val"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex">
                    <InputType val="team" type="text" title="Team"/>
                    <div class="flex w-1/2">
                        <InputType val="profile" type="text" title="Profile"/>
                        <InputType val="language" type="text" title="Langue principale"/>
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
    <div class="p-6 bg-white mx-6">
        <div class="flex justify-end">
            <div class="mb-6 flex">
                <label class="block mb-2 my-auto font-bold text-gray-700 mx-4"
                       for="search"
                >
                    Search:
                </label>
                <input class="border border-gray-400 p-1 w-full"
                       type="text"
                       name="search"
                       id="search"
                       required
                       v-model="searchUsers"
                />
            </div>
        </div>
        <NCCTable type="soldes"/>
        <div v-if="userStore.searchedUser === 'null'">
            <Pagination :links="userStore.users?.links" @fetching="fetchUsersPartial" />
        </div>
    </div>

    <Modal :show="showModal || increaseSolde" :createUser="createUser" :increaseSolde="increaseSolde" @close="closeModal()"/>
</template>

