<script setup>
import {useUserStore} from "~/stores/UserStore.js";
import {useInputStore} from "~/stores/InputStore.js";

let inputStore = useInputStore()

let userStore = useUserStore()

</script>

<template>
  <div v-if="inputStore.loadingTable">Loading...</div>
  <table v-if="userStore.users?.data && !inputStore.loadingTable" class="table-auto mx-auto">
    <thead>
    <tr class="border-2">
      <th class="px-2 border-2">Photo</th>
      <th class="px-2 border-2">Matricule</th>
      <th class="px-2 border-2">Nom / Prènom</th>
      <th class="px-2 border-2">Télephone</th>
      <th class="px-2 border-2">E-mail</th>
      <th class="px-2 border-2">Num. CNSS</th>
      <th class="px-2 border-2">fonction</th>
      <th class="px-2 border-2">Opération</th>
      <th class="px-2 border-2">Team</th>
      <th class="px-2 border-2">Departement</th>
      <th class="px-2 border-2">Langue</th>
    </tr>
    </thead>
    <tbody class="border-2">
    <tr class="text-center" v-for="user in userStore.users?.data">
      <td class="px-2 border-2"></td>
      <td class="px-2 border-2">{{ user?.matricule }}</td>
      <td class="px-2 border-2">{{ user?.first_name }} / {{ user?.last_name }}</td>
      <td class="px-2 border-2">{{ user?.phone }}</td>
      <td class="px-2 border-2">{{ user?.email }}</td>
      <td class="px-2 border-2">{{ user?.cnss_number }}</td>
      <td class="px-2 border-2">{{ user?.role?.name }}</td>
      <td class="px-2 border-2">{{ user?.operation?.name }}</td>
      <td class="px-2 border-2">{{ user?.team_type?.name }}</td>
      <td class="px-2 border-2">{{ user?.department?.name }}</td>
      <td class="px-2 border-2">{{ user?.language?.name }}</td>
    </tr>
    </tbody>
  </table>
</template>
