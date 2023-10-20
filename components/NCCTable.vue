<script setup>
import {useUserStore} from "~/stores/UserStore.js";
import {useInputStore} from "~/stores/InputStore.js";
import Actions from "~/components/Actions.vue";

let inputStore = useInputStore()

let userStore = useUserStore()

</script>

<template>
    <div v-if="inputStore.loadingTable">Loading...</div>
    <table v-if="userStore.users?.data && !inputStore.loadingTable" class="table-auto mx-auto bg-white">
        <thead>
        <tr class="border-2">
            <th class="px-2 border-2">Photo</th>
            <th class="px-2 border-2">Matricule</th>
            <th class="px-2 border-2">Nom / Prènom</th>
            <th class="px-2 border-2">fonction</th>
            <th class="px-2 border-2">Opération</th>
            <th class="px-2 border-2">Team</th>
            <th class="px-2 border-2">Departement</th>
            <th class="px-2 border-2">Langue principale</th>
            <th class="px-2 border-2">Solde CP</th>
            <th class="px-2 border-2">Solde RJF</th>
            <th class="px-2 border-2"></th>
        </tr>
        </thead>
        <tbody class="border-2">
        <tr class="text-center" v-if="userStore.searchedUser !== 'null'">
            <td class="px-2 border-2"></td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.matricule }}</td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.first_name }} / {{
                    userStore.searchedUser?.last_name
                }}
            </td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.role?.name }}</td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.operation?.name }}</td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.team_type?.name }}</td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.department?.name }}</td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.primary_language?.name }}</td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.solde_cp }}</td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.solde_rjf }}</td>
            <Actions :user="userStore.searchedUser" />
        </tr>
        <tr class="text-center" v-if="userStore.searchedUser === 'null'" v-for="user in userStore.users?.data">
            <td class="px-2 border-2"></td>
            <td class="px-2 border-2">{{ user?.matricule }}</td>
            <td class="px-2 border-2">{{ user?.first_name }} / {{ user?.last_name }}</td>
            <td class="px-2 border-2">{{ user?.role?.name }}</td>
            <td class="px-2 border-2">{{ user?.operation?.name }}</td>
            <td class="px-2 border-2">{{ user?.team_type?.name }}</td>
            <td class="px-2 border-2">{{ user?.department?.name }}</td>
            <td class="px-2 border-2">{{ user?.primary_language?.name }}</td>
            <td class="px-2 border-2">{{ user?.solde_cp }}</td>
            <td class="px-2 border-2">{{ user?.solde_rjf }}</td>
            <Actions :user="user" />
        </tr>
        </tbody>
    </table>
</template>
