<script setup>
import {useUserStore} from "~/stores/UserStore.js";
import {useSoldeInputStore} from "~/stores/SoldeInputStore.js";
import Actions from "~/components/Actions.vue";
import {useDemandeCongeInputStore} from "~/stores/DemandeCongeInputStore.js";
import ButtonWithIcon from "~/components/ButtonWithIcon.vue";

const props = defineProps({
    type: String
})

let inputStore = useSoldeInputStore()

let userStore = useUserStore()
let demandInputStore = useDemandeCongeInputStore()

let showModal = ref(false)
let accept = ref(false)
let reject = ref(false)
let cancel = ref(false)
let selectedDemand = ref(null)

const openModal = async (state, demand) => {
    selectedDemand.value = demand
    showModal.value = true;
    if (state === 'accept') {
        accept.value = true;
    } else if (state === 'reject') {
        reject.value = true
    } else if (state === 'cancel') {
        cancel.value = true
    }
}

const closeModal = () => {
    showModal.value = false;
    accept.value = false;
    reject.value = false;
}

function isSupervisorFunc(roleName) {
    return roleName?.toLowerCase().includes('superviseur');
}

function isCoordinatorWFM(roleName) {
    return roleName?.toLowerCase()?.includes('coordinateur vigie') || roleName?.toLowerCase()?.includes('coordinateur cps')
}

function isAgentFunc(roleName) {
    return roleName?.toLowerCase().includes('conseiller') || roleName?.toLowerCase().includes('agent')
}

function isWFMAgentFunc(roleName) {
    return roleName?.toLowerCase()?.includes('statis') || roleName?.toLowerCase() === 'vigie' || roleName?.toLowerCase().includes('incoh')
}

function isChargeRHFunc(roleName) {
    return roleName?.toLowerCase()?.includes('chargé') && roleName?.toLowerCase()?.includes('rh')
}

const showAcceptOrReject = (demand) => {
    const userId = userStore.user?.id;
    const roleName = userStore.user?.role?.name;
    const isSupervisor = isSupervisorFunc(roleName);
    const isWfm = roleName?.toLowerCase()?.includes('statis') || roleName?.toLowerCase()?.includes('cps') || roleName?.toLowerCase().includes('vigie') || roleName?.toLowerCase()?.includes('incoh') || roleName?.toLowerCase()?.includes('head of ')
    const isOpsManager = roleName?.toLowerCase().includes('opération');
    const isHR = roleName?.toLowerCase().includes('rh') || roleName?.toLowerCase()?.includes('humain')
    const isDirector = roleName?.toLowerCase() === 'directeur'
    const isCoordinatorVigie = roleName?.toLowerCase()?.includes('coordinateur vigie')
    const isCoordinatorCPS = roleName?.toLowerCase()?.includes('coordinateur cps')
    const validatedBySupervisor = demand?.demand?.etat_demande === 'validated by supervisor'
    const created = demand?.demand?.etat_demande === 'created'
    const validatedByWfm = demand?.demand?.etat_demande === 'validated by wfm' || demand?.demand?.etat_demande === 'validated by vigie' || demand?.demand?.etat_demande === 'validated by coordinateur vigie' || demand?.demand?.etat_demande === 'validated by cci' || demand?.demand?.etat_demande === 'validated by cps' || demand?.demand?.etat_demande === 'validated by coordinateur cps' || demand?.demand?.etat_demande === 'validated by head of operational excellence'
    const validatedByAgentWFM = demand?.demand?.etat_demande === 'validated by vigie' || demand?.demand?.etat_demande === 'validated by cps'
    const validatedByCoordinatorWFM = demand?.demand?.etat_demande === 'validated by coordinateur vigie' || demand?.demand?.etat_demande === 'validated by coordinateur cps'
    const validatedByOpsManager = demand?.demand?.etat_demande === 'validated by ops manager'
    const validatedByDirector = demand?.demand?.etat_demande === 'validated by director'
    const isChargeRH = roleName?.toLowerCase()?.includes('chargé rh')
    const isRespRH = roleName?.toLowerCase()?.includes('responsable rh')
    if (!demand) {
        return isSupervisor || isOpsManager || isWfm
    }
    if (isSupervisor && demand && demand?.user_id !== userId && !isSupervisorFunc(demand?.user?.role?.name)) {
        return created
    }
    if (isOpsManager && demand && demand?.user_id !== userId) {
        return (created && !isAgentFunc(demand?.user?.role?.name)) || (validatedByWfm && !isSupervisorFunc(demand?.user?.role?.name))
    }
    if (isWfm && demand) {
        return (validatedBySupervisor && !isCoordinatorVigie && !isCoordinatorCPS) || (validatedByOpsManager && isSupervisorFunc(demand.user?.role?.name) && !isCoordinatorVigie && !isCoordinatorCPS) || (created && demand?.user_id !== userId && !isSupervisorFunc(demand?.user?.role?.name) && !isAgentFunc(demand?.user?.role?.name)) || (validatedByDirector && isSupervisorFunc(demand?.user?.role?.name))
    }
    if (isHR && demand && demand?.user_id !== userId) {
        return (validatedByOpsManager && !isSupervisorFunc(demand?.user?.role?.name)) || (validatedByAgentWFM && isChargeRH && isSupervisorFunc(demand?.user?.role?.name)) || (validatedByCoordinatorWFM && isRespRH && isSupervisorFunc(demand?.user?.role?.name)) || (validatedByDirector && isWFMAgentFunc(demand?.user?.role?.name) && isRespRH) || (created && isCoordinatorWFM(demand?.user?.role?.name) && isRespRH) || (validatedByCoordinatorWFM && isChargeRH) || (created && isRespRH && isChargeRHFunc(demand?.user?.role?.name))
    }
    if (isDirector && demand) {
        return created
    }
}

const getProfileConditionForCancel = (demand) => {
    const userId = userStore.user?.id
    if (demand?.user_id === userId) {
        return demand?.demand?.etat_demande === 'created'
    }
}

const getState = (demand) => {
    const isRejected = demand?.demand?.etat_demande?.toLowerCase()?.includes('rejected')
    const isClosed = demand?.demand?.etat_demande?.toLowerCase()?.includes('closed')
    if (isRejected || isClosed) {
        return ""
    }
    return "(en cours)"
}

console.log(props.type)

</script>

<template>
    <div v-if="inputStore.loadingTable">Loading...</div>
    <table v-if="userStore.users?.data && !inputStore.loadingTable || type === 'demandesConges'"
           class="table-auto mx-auto bg-white">
        <thead>
        <tr class="border-2" v-if="type === 'demandesConges'">
            <th class="px-2 border-2">Matricule</th>
            <th class="px-2 border-2">fonction</th>
            <th class="px-2 border-2">Date demande</th>
            <th class="px-2 border-2">Date retour</th>
            <th class="px-2 border-2">Période</th>
            <th class="px-2 border-2">Etat demande</th>
            <th class="px-2 border-2">Nombre de jours</th>
            <th class="px-2 border-2">Type de congé</th>
            <th class="px-2 border-2" v-if="showAcceptOrReject()">Accept / Cancel</th>
            <th class="px-2 border-2" v-if="showAcceptOrReject()">Reject</th>
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
        <tr class="text-center" v-for="(demand) in demandInputStore.demands?.data" v-if="type === 'demandesConges'">
            <td class="px-2 border-2">{{ demand?.user?.matricule }}</td>
            <td class="px-2 border-2">{{ demand?.user?.role?.name }}</td>
            <td class="px-2 border-2">{{ demand?.date_demande }}</td>
            <td class="px-2 border-2">{{ demand?.date_retour }}</td>
            <td class="px-2 border-2">{{ demand?.periode }}</td>
            <td class="px-2 border-2">{{ demand?.demand?.etat_demande }} {{!getProfileConditionForCancel(demand) ? '' : "(proprietary)"}} {{getState(demand)}}</td>
            <td class="px-2 border-2">{{ demand?.nombre_jours }}</td>
            <td class="px-2 border-2">{{ demand?.type_demande?.name }}</td>
            <td class="px-2 border-2" v-if="showAcceptOrReject(demand)">
                <ButtonWithIcon
                    classes="mr-auto bg-cyan-600 hover:bg-cyan-700 focus:bg-cyan-700 active:bg-cyan-900 focus:ring-cyan-500" @click.prevent="openModal('accept', demand)">
                    Accept
                </ButtonWithIcon>
            </td>
            <td class="px-2 border-2" v-if="showAcceptOrReject(demand)">
                <ButtonWithIcon
                    classes="mr-auto bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:ring-red-500" @click.prevent="openModal('reject', demand)">
                    Reject
                </ButtonWithIcon>
            </td>
            <td class="px-2 border-2" v-if="getProfileConditionForCancel(demand)">
                <ButtonWithIcon
                    classes="mr-auto bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:ring-red-500" @click.prevent="openModal('cancel', demand)">
                    Cancel
                </ButtonWithIcon>
            </td>
            <Modal :show="showModal" :accept="accept" :reject="reject" :cancel="cancel" :demande-conge-data="selectedDemand" @close="closeModal()" />
        </tr>
        <tr class="text-center" :class="{'bg-red-100': !userStore.searchedUser?.active}"
            v-if="userStore.searchedUser !== 'null' && type === 'soldes'">
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
            <Actions :user="userStore.searchedUser"/>
        </tr>
        <tr class="text-center" :class="{'bg-red-100': !user?.active}"
            v-if="userStore.searchedUser === 'null' && type === 'soldes'" v-for="user in userStore.users?.data">
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
            <Actions :user="user"/>
        </tr>
        </tbody>
    </table>
</template>
