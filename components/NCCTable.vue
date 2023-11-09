<script setup>
import {useUserStore} from "~/stores/UserStore.js";
import {useSoldeInputStore} from "~/stores/SoldeInputStore.js";
import Actions from "~/components/Actions.vue";
import {useDemandeCongeInputStore} from "~/stores/DemandeCongeInputStore.js";

const props = defineProps({
  type: String
})

let inputStore = useSoldeInputStore()

let userStore = useUserStore()
let demandInputStore = useDemandeCongeInputStore()

console.log(props.type)

</script>

<template>
    <div v-if="inputStore.loadingTable">Loading...</div>
    <table v-if="userStore.users?.data && !inputStore.loadingTable || type === 'demandesConges'" class="table-auto mx-auto bg-white">
        <thead>
        <tr class="border-2" v-if="type === 'demandesConges'">
          <th class="px-2 border-2">Matricule</th>
          <th class="px-2 border-2">Date demande</th>
          <th class="px-2 border-2">Date retour</th>
          <th class="px-2 border-2">Période</th>
          <th class="px-2 border-2">Etat demande</th>
        </tr>
        <tr v-if="type === 'soldes'" class="border-2">
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
        <tr class="text-center" v-for="demand in demandInputStore.demands?.data" v-if="type === 'demandesConges'">
          <td class="px-2 border-2">{{ demand?.user?.matricule }}</td>
          <td class="px-2 border-2">{{ demand?.date_demande }}</td>
          <td class="px-2 border-2">{{ demand?.date_retour }}</td>
          <td class="px-2 border-2">{{ demand?.periode }}</td>
          <td class="px-2 border-2">{{ demand?.demand?.etat_demande }}</td>
        </tr>
        <tr class="text-center" :class="{'bg-red-100': !userStore.searchedUser?.active}" v-if="userStore.searchedUser !== 'null' && type === 'soldes'">
            <td class="px-2 border-2"></td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.matricule }}</td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.first_name }} / {{
                    userStore.searchedUser?.last_name
                }}
            </td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.role?.name }}</td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.operations?.map(data => data.name).join(',') }}</td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.team_type?.name }}</td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.department?.name }}</td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.primary_language?.name }}</td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.solde_cp }}</td>
            <td class="px-2 border-2">{{ userStore.searchedUser?.solde_rjf }}</td>
            <Actions :user="userStore.searchedUser" />
        </tr>
        <tr class="text-center" :class="{'bg-red-100': !user?.active}" v-if="userStore.searchedUser === 'null' && type === 'soldes'" v-for="user in userStore.users?.data">
            <td class="px-2 border-2"></td>
            <td class="px-2 border-2">{{ user?.matricule }}</td>
            <td class="px-2 border-2">{{ user?.first_name }} / {{ user?.last_name }}</td>
            <td class="px-2 border-2">{{ user?.role?.name }}</td>
            <td class="px-2 border-2">{{ user?.operations?.map(data => data.name).join(',') }}</td>
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
