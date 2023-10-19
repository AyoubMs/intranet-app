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
import {debounce} from "lodash";
import Modal from "~/components/Modal.vue";

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

let newUser = () => {
    showModal.value = true;
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
                                   for="status"
                            >
                                Status
                            </label>
                            <div class="flex">
                                <RadioInput v-for="elem in typeStatus" :title="elem.title" :val="elem.val"/>
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
        <NCCTable/>
        <div v-if="userStore.searchedUser === 'null'" class="flex justify-end mt-3 mx-auto">
            <div v-for="(link, index) in userStore.users?.links"
                 class="border w-6 text-center"
                 :class="{
                '!bg-cyan-500 !text-white': link?.active,
                'hover:bg-cyan-500 hover:text-white cursor-pointer': link?.url && !link?.active,
                }"
                 @click="fetchUsersPartial(link)">
                <div v-if="index == 0"><i class="fa-solid fa-chevron-left"></i></div>
                <div v-else-if="index > 0 && Number(link?.label)">{{ link?.label }}</div>
                <div v-else-if="link?.label === '...'">...</div>
                <div v-else-if="!Number(link?.label) && link?.label !== '...'"><i
                    class="fa-solid fa-chevron-right"></i></div>
            </div>
        </div>
    </div>

    <Modal :show="showModal" @close="showModal = false"/>
</template>

