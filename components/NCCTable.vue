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

const openModal = (state, demand) => {
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

function isITAgentFunc(roleName) {
    return roleName?.toLowerCase()?.includes('informaticien') || roleName?.toLowerCase()?.includes('stagiaire it') || roleName?.toLowerCase()?.includes('admin') || roleName?.toLowerCase()?.includes('miner') || roleName?.toLowerCase()?.includes('sys') && roleName?.toLowerCase()?.includes('info')
}

function isRespITFunc(roleName) {
    return roleName?.toLowerCase()?.includes('responsable it');
}

function isDeveloperFunc(roleName) {
    return roleName?.toLowerCase().includes('dev')
}

function isAgentMG(roleName) {
    return roleName?.toLowerCase().includes('agent') && roleName?.toLowerCase().includes('moyens')
}

function isRespMG(roleName) {
    return roleName?.toLowerCase().includes('responsable') && roleName?.toLowerCase().includes('moyens')
}

function isInfirmiereDeTravailFunc(roleName) {
    return roleName?.toLowerCase().includes('infirm')
}

function isChargeMissionAupresDirection(roleName) {
    return roleName?.toLowerCase().includes('charg') && roleName?.toLowerCase().includes('direction')
}

function isDirectorFunc(roleName) {
    return roleName?.toLowerCase() === 'directeur'
}

function isChargeCommMktgFunc(roleName) {
    return roleName?.toLowerCase()?.includes('charg') && roleName?.toLowerCase()?.includes('marketing')
}

function isChargeFormationFunc(roleName) {
    return roleName?.toLowerCase()?.includes('charg') && roleName?.toLowerCase()?.includes('formation')
}

function isChargeQualiteProcessFunc(roleName) {
    return roleName?.toLowerCase().includes('charg') && roleName?.toLowerCase().includes('process')
}

function isChargeRecrutementFunc(roleName) {
    return roleName?.toLowerCase().includes('charg') && roleName?.toLowerCase().includes('recrutement')
}

function isCoordinatorQualiteFormationFunc(roleName) {
    return roleName?.toLowerCase()?.includes('coordinateur') && roleName?.toLowerCase()?.includes('qualit') && roleName?.toLowerCase()?.includes('formation')
}

function isResponsableFormationFunc(roleName) {
    return roleName?.toLowerCase()?.includes('responsable') && roleName?.toLowerCase()?.includes('formation') && roleName?.toLowerCase().indexOf('formation') === 12
}

function isDataProtectionOfficerFunc(roleName) {
    return roleName?.toLowerCase().includes('data') && roleName?.toLowerCase().includes('officer') && roleName?.toLowerCase().includes('protection')
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
    const isRespIT = roleName?.toLowerCase()?.includes('responsable it');
    const validatedByRespIT = demand?.demand?.etat_demande === 'validated by resp it'
    const validatedByCoordinatorQualiteFormation = demand?.demand?.etat_demande === 'validated by coordinateur qualite formation'
    const validatedByResponsableQualiteFormation = demand?.demand?.etat_demande === 'validated by responsable qualite formation'
    const isCoordinatorQualiteFormation = roleName?.toLowerCase()?.includes('coordinateur') && roleName?.toLowerCase()?.includes('qualit') && roleName?.toLowerCase()?.includes('formation')
    const isResponsableQualiteFormation = roleName?.toLowerCase()?.includes('responsable') && roleName?.toLowerCase()?.includes('qualit') && roleName?.toLowerCase()?.includes('formation')
    if (!demand) {
        return isSupervisor || isOpsManager || isWfm || isRespIT || isChargeRH || isRespRH || isCoordinatorQualiteFormation || isResponsableQualiteFormation
    }
    if (isResponsableQualiteFormation && demand) {
        return (created && isChargeFormationFunc(demand?.user?.role?.name)) || (created && isChargeQualiteProcessFunc(demand?.user?.role?.name)) || (created && isChargeRecrutementFunc(demand?.user?.role?.name)) || (created && isResponsableFormationFunc(demand?.user?.role?.name))
    }
    if (isCoordinatorQualiteFormation && demand) {
        return (created && isCoordinatorQualiteFormation && isChargeFormationFunc(demand?.user?.role?.name)) || (created && isChargeQualiteProcessFunc(demand?.user?.role?.name))
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
        return (validatedByOpsManager && isChargeRH && isAgentFunc(demand?.user?.role?.name)) || (validatedByAgentWFM && isChargeRH && isSupervisorFunc(demand?.user?.role?.name)) || (validatedByCoordinatorWFM && isRespRH && isSupervisorFunc(demand?.user?.role?.name)) || (validatedByDirector && isWFMAgentFunc(demand?.user?.role?.name) && isRespRH) || (created && isCoordinatorWFM(demand?.user?.role?.name) && isRespRH) || (validatedByCoordinatorWFM && (isSupervisorFunc(demand?.user?.role?.name) || isWFMAgentFunc(demand?.user?.role?.name)) && isChargeRH) || (created && isRespRH && isChargeRHFunc(demand?.user?.role?.name)) || (validatedByRespIT && isChargeRH) || (validatedByDirector && isRespRH && isRespITFunc(demand?.user?.role?.name)) || (created && isRespRH && isRespITFunc(demand?.user?.role?.name)) || (created && isRespRH && isDeveloperFunc(demand?.user?.role?.name)) || (created && isRespRH && isAgentMG(demand?.user?.role?.name)) || ((created || validatedByDirector) && isRespRH && isRespMG(demand?.user?.role?.name)) || (created && isRespRH && isInfirmiereDeTravailFunc(demand?.user?.role?.name)) || (validatedByDirector && isRespRH && isChargeMissionAupresDirection(demand?.user?.role?.name)) || (validatedByDirector && isChargeRH && isChargeCommMktgFunc(demand?.user?.role?.name)) || (validatedByResponsableQualiteFormation && isRespRH && isChargeFormationFunc(demand?.user?.role?.name)) || (validatedByCoordinatorQualiteFormation && isChargeRH && isChargeFormationFunc(demand?.user?.role?.name)) || (validatedByCoordinatorQualiteFormation && isChargeRH && isChargeQualiteProcessFunc(demand?.user?.role?.name)) || (validatedByResponsableQualiteFormation && isRespRH && isChargeQualiteProcessFunc(demand?.user?.role?.name)) || (validatedByResponsableQualiteFormation && isRespRH && isChargeRecrutementFunc(demand?.user?.role?.name)) || (validatedByDirector && isRespRH && isCoordinatorQualiteFormationFunc(demand?.user?.role?.name)) || (validatedByResponsableQualiteFormation && isRespRH && isResponsableFormationFunc(demand?.user?.role?.name)) || (validatedByDirector && isRespRH && isDataProtectionOfficerFunc(demand?.user?.role?.name))
    }
    if (isDirector && demand) {
        return (created && !isDirectorFunc(demand?.user?.role?.name))
    }
    if (isRespIT && demand) {
        return (created && isITAgentFunc(demand?.user?.role?.name))
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
    const isCanceled = demand?.demand?.etat_demande?.toLowerCase()?.includes('canceled')
    if (isRejected || isClosed || isCanceled) {
        return ""
    }
    return "(en cours)"
}

const demandeCongeInputStore = useDemandeCongeInputStore()

console.log(props.type)

function getSoldeCPDifference(demandeCongeLog) {
    return parseInt(demandeCongeLog?.nouveau_solde_cp) - parseInt(demandeCongeLog?.demande_conge_stack?.solde_cp)
}

function getSoldeRJFDifference(demandeCongeLog) {
    return parseInt(demandeCongeLog?.nouveau_solde_rjf) - parseInt(demandeCongeLog?.demande_conge_stack?.solde_rjf)
}

function getSoldeTotalDifference(demandeCongeLog) {
    const nouveauSoldeTotal = parseInt(demandeCongeLog?.nouveau_solde_rjf) + parseInt(demandeCongeLog?.nouveau_solde_cp)
    const ancienSoldeTotal = parseInt(demandeCongeLog?.demande_conge_stack?.solde_rjf) + parseInt(demandeCongeLog?.demande_conge_stack?.solde_cp)
    return nouveauSoldeTotal - ancienSoldeTotal
}

</script>

<template>
    <div v-if="inputStore.loadingTable">Loading...</div>
    <table
        v-if="(userStore.users?.data || demandeCongeInputStore.demandesCongeLogs) && !inputStore.loadingTable || type === 'demandesConges'"
        class="table-auto mx-auto bg-white">
        <thead>
        <tr class="border-2" v-if="type === 'suiviSolde'">
            <th class="px-2 border-2">Date Modification</th>
            <th class="px-2 border-2">Modifié par</th>
            <th class="px-2 border-2">Commentaire</th>
            <th class="px-2 border-2">Solde CP</th>
            <th class="px-2 border-2">Solde RJF</th>
            <th class="px-2 border-2">Solde Total</th>
        </tr>
        <tr class="border-2" v-if="type === 'demandesConges'">
            <th class="px-2 border-2">Matricule</th>
            <th class="px-2 border-2">Nom / Prenom</th>
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
        <tr class="text-center" v-if="type === 'suiviSolde'"
            v-for="demandeCongeLog in demandeCongeInputStore.demandesCongeLogs?.data">
            <td class="px-2 border-2">{{ (new Date(demandeCongeLog?.created_at)).toISOString().split('T')[0] }}</td>
            <td class="px-2 border-2">{{ demandeCongeLog?.modifier?.first_name }}
                {{ demandeCongeLog?.modifier?.last_name }}
            </td>
            <td class="px-2 border-2">
                {{ demandeCongeLog?.demande_conge_stack?.modification_conge_comment?.comment_on_solde }}
            </td>
            <td class="px-2 border-2">
                <div class="flex">
                    <span class="mx-3 flex items-center text-xs" :class="[{'text-green-500': getSoldeCPDifference(demandeCongeLog) > 0}, {'text-red-500': getSoldeCPDifference(demandeCongeLog) < 0}]">
                        <span class="mx-1">{{ getSoldeCPDifference(demandeCongeLog) }}</span>
                        <i class="fa-solid text-xs" :class="[{'fa-arrow-up text-green-500': getSoldeCPDifference(demandeCongeLog) > 0}, {'fa-arrow-down text-red-500': getSoldeCPDifference(demandeCongeLog) < 0}]"></i>
                    </span>
                    {{ demandeCongeLog?.nouveau_solde_cp }}
                </div>
            </td>
            <td class="px-2 border-2">
                <div class="flex">
                    <span class="mx-3 flex items-center text-xs" :class="[{'text-green-500': getSoldeRJFDifference(demandeCongeLog) > 0}, {'text-red-500': getSoldeRJFDifference(demandeCongeLog) < 0}]">
                        <span class="mx-1">{{ getSoldeRJFDifference(demandeCongeLog) }}</span>
                        <i class="fa-solid text-xs" :class="[{'fa-arrow-up text-green-500': getSoldeRJFDifference(demandeCongeLog) > 0}, {'fa-arrow-down text-red-500': getSoldeRJFDifference(demandeCongeLog) < 0}]"></i>
                    </span>
                    {{ demandeCongeLog?.nouveau_solde_rjf }}
                </div>
            </td>
            <td class="px-2 border-2">
                <div class="flex">
                    <span class="mx-3 flex items-center text-xs" :class="[{'text-green-500': getSoldeTotalDifference(demandeCongeLog) > 0}, {'text-red-500': getSoldeTotalDifference(demandeCongeLog) < 0}]">
                        <span class="mx-1">{{ getSoldeTotalDifference(demandeCongeLog) }}</span>
                        <i class="fa-solid text-xs" :class="[{'fa-arrow-up text-green-500': getSoldeTotalDifference(demandeCongeLog) > 0}, {'fa-arrow-down text-red-500': getSoldeTotalDifference(demandeCongeLog) < 0}]"></i>
                    </span>
                    {{ parseInt(demandeCongeLog?.nouveau_solde_rjf) + parseInt(demandeCongeLog?.nouveau_solde_cp) }}
                </div>
            </td>
        </tr>
        <tr class="text-center" v-for="(demand) in demandInputStore.demands?.data" v-if="type === 'demandesConges'">
            <td class="px-2 border-2">{{ demand?.user?.matricule }}</td>
            <td class="px-2 border-2">{{ demand?.user?.first_name }} {{ demand?.user?.last_name }}</td>
            <td class="px-2 border-2">{{ demand?.user?.role?.name }}</td>
            <td class="px-2 border-2">{{ demand?.date_demande }}</td>
            <td class="px-2 border-2">{{ demand?.date_retour }}</td>
            <td class="px-2 border-2">{{ demand?.periode }}</td>
            <td class="px-2 border-2">{{ demand?.demand?.etat_demande }}
                {{ !getProfileConditionForCancel(demand) ? '' : "(proprietary)" }} {{ getState(demand) }}
            </td>
            <td class="px-2 border-2">{{ demand?.nombre_jours }}</td>
            <td class="px-2 border-2">{{ demand?.type_demande?.name }}</td>
            <td class="px-2 border-2" v-if="showAcceptOrReject(demand)">
                <ButtonWithIcon
                    classes="mr-auto bg-cyan-600 hover:bg-cyan-700 focus:bg-cyan-700 active:bg-cyan-900 focus:ring-cyan-500"
                    @click.prevent="openModal('accept', demand)">
                    Accept
                </ButtonWithIcon>
            </td>
            <td class="px-2 border-2" v-if="showAcceptOrReject(demand)">
                <ButtonWithIcon
                    classes="mr-auto bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:ring-red-500"
                    @click.prevent="openModal('reject', demand)">
                    Reject
                </ButtonWithIcon>
            </td>
            <td class="px-2 border-2" v-if="getProfileConditionForCancel(demand)">
                <ButtonWithIcon
                    classes="mr-auto bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:ring-red-500"
                    @click.prevent="openModal('cancel', demand)">
                    Cancel
                </ButtonWithIcon>
            </td>
            <Modal :show="showModal" :accept="accept" :reject="reject" :cancel="cancel"
                   :demande-conge-data="selectedDemand"
                   @close="closeModal()"/>
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
