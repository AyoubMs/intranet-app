<script setup lang="ts">
import FormInput from "~/components/FormInput.vue";
import {useSoldeInputStore} from "~/stores/SoldeInputStore";
import {useUserStore} from "~/stores/UserStore";
import InputType from "~/components/InputType.vue";
import RadioOrCheckboxInput from "~/components/RadioOrCheckboxInput.vue";
import {useTeamStore} from "~/stores/TeamStore";
import {useLanguagesStore} from "~/stores/LanguagesStore";
import {useProfilesStore} from "~/stores/ProfilesStore";
import {useAuth} from "~/composables/useAuth";
import {useDemandeCongeInputStore} from "~/stores/DemandeCongeInputStore";
import {SymbolKind} from "vscode-languageserver-types";
import Number = SymbolKind.Number;

const props = defineProps({
  accept: Boolean,
  reject: Boolean,
  cancel: Boolean,
  show: Boolean,
  edit: Boolean,
  affectation: Boolean,
  deactivation: Boolean,
  increaseSolde: Boolean,
  demandeConge: Boolean,
  user: Object,
  filterData: Object,
  demandeCongeData: Object,
})

let inputStore = useSoldeInputStore()

let userStore = useUserStore()

let teamStore = useTeamStore()

const {$apiFetch} = useNuxtApp()

let addOrEditFormData = ref({
  past_matricule: props.user?.matricule,
  matricule: null,
  email_1: null,
  nom: null,
  prenom: null,
  date_mep: null,
  sexe: null,
  date_entree_formation: null,
  type_identite: null,
  cin_number: null,
  passport_number: null,
  carte_sejour_number: null,
  langue_principale: null,
  nationalite: null,
  date_naissance: null,
  sourcing_provider: null,
  situation_familiale: null,
  phone_1: null,
  photo: null,
  phone_2: null,
  nombre_enfants: null,
  cnss_number: null,
  address: null,
  comment: null,
  solde_cp: props.edit ? props.user?.solde_cp : null,
  solde_rjf: props.edit ? props.user?.solde_rjf : null,
  edit_email: props.edit,
  edit_matricule: props.edit
})

let affectationFormData = ref({
  matricule: null,
  name: null,
  profile: null,
  teams: null,
  date_entree_formation: null,
  principal_operation: null,
})

let deactivationFormData = ref({
  matricule: null,
  name: null,
  date_depart: null,
  type_depart: null,
  raison_depart: null,
  comment: null
})

const demandeCongeForm = ref({
  matricule: null,
  date_retour: null,
  solde: 0,
  date_debut: null,
  date_fin: null,
  nombre_jours: null,
  type_conge: null
})

const refreshDemandeCongeForm = () => {
  demandeCongeForm.value.date_retour = null
  demandeCongeForm.value.date_debut = null
  demandeCongeForm.value.date_fin = null
  demandeCongeForm.value.nombre_jours = null
  demandeCongeForm.value.type_conge = null
  nbrJrsDemandesConfirmed.value = null
}

let cinNumber: any = ref(props.user?.identity_types?.filter((data: any) => data?.name === 'CIN')[0]?.identity_number)
let passportNumber: any = ref(props.user?.identity_types?.filter((data: any) => data?.name === 'Passeport')[0]?.identity_number)
let carteSejourNumber: any = ref(props.user?.identity_types?.filter((data: any) => data?.name === 'Carte sejour')[0]?.identity_number);

watch(userStore.addingUserErrors, () => {
  console.log(userStore.addingUserErrors)
}, {deep: true})

watch(affectationFormData, () => {
  console.log(affectationFormData.value)
}, {deep: true})

watch(inputStore, () => {
  console.log(inputStore.injectionErrors)
}, {deep: true});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit('close');
  userStore.refreshAddingUserErrors()
  userStore.refreshEditingUserErrors()
  inputStore.refreshInjectionErrors()
  teamStore.refreshAffectationTeams();
  refreshDemandeCongeForm();
  inputStore.checkFile = false;
}

const sendFormDataToBackend = async () => {
  inputStore.beginSendingUserData()
  await userStore.addUser($apiFetch, addOrEditFormData.value).then(() => {
    inputStore.finishSendingUserData();
    if (!Object.entries(userStore.addingUserErrors).length) {
      teamStore.refreshAffectationTeams();
      closeModal();
    }
  }).catch(err => {
    console.log(err)
  })
}

const updateUser = async () => {
  inputStore.beginSendingUserData()
  await userStore.editUser($apiFetch, addOrEditFormData.value).then(async () => {
    inputStore.finishSendingUserData();
    if (!Object.entries(userStore.editingUserErrors).length) {
      teamStore.refreshAffectationTeams();
      closeModal()
      await refreshTableData();
    }
  }).catch(err => {
    console.log(err)
  })
  console.log(addOrEditFormData.value)
}

const toggleField = (field: any) => {
  if (field === 'matricule') {
    addOrEditFormData.value.edit_matricule = !addOrEditFormData.value.edit_matricule
  } else if (field === 'email1') {
    addOrEditFormData.value.edit_email = !addOrEditFormData.value.edit_email
  }
}

const languageStore = useLanguagesStore()
const profilesStore = useProfilesStore()
const demandesCongeInputStore = useDemandeCongeInputStore()

let filterData = ref({
  teams: teamStore.selectedTeams,
  languages: languageStore.selectedLanguages,
  profiles: profilesStore.selectedProfiles,
  dateDebut: inputStore.dateDebut,
  dateFin: inputStore.dateFin,
  status: inputStore.status
})

let demandForm = ref({
  date_demande_debut: null,
  date_demande_fin: null,
  date_debut_conge_debut: null,
  date_debut_conge_fin: null,
  date_fin_conge_debut: null,
  date_fin_conge_fin: null,
  matricule: null
})

async function refreshTableData() {
  inputStore.loadTableData();
  filterData.value = {
    teams: teamStore.selectedTeams,
    languages: languageStore.selectedLanguages,
    profiles: profilesStore.selectedProfiles,
    dateDebut: inputStore.dateDebut,
    dateFin: inputStore.dateFin,
    status: inputStore.status
  }
  await userStore.fetchUsers($apiFetch, inputStore.status, filterData.value, inputStore.pageIndex).catch(err => console.log(err))
  inputStore.finishLoadingTableData();
}

const sendAffectationDataToBackend = async () => {
  affectationFormData.value.teams = [...teamStore.selectedAffectationTeams]
  console.log(teamStore.selectedTeams)
  inputStore.beginSendingUserData();
  await userStore.affectUser($apiFetch, affectationFormData.value).then(() => {
    inputStore.finishSendingUserData();
    teamStore.refreshAffectationTeams();
    closeModal();
  }).catch(err => {
    console.log(err)
  })
  teamStore.refreshAffectationTeams();
  await refreshTableData();
}

const deactivateUserInTheBackend = async () => {
  inputStore.beginSendingUserData();
  await userStore.deactivateUser($apiFetch, deactivationFormData.value).then(async () => {
    inputStore.finishSendingUserData();
    if (!Object.entries(userStore.deactivatingUserErrors).length) {
      teamStore.refreshAffectationTeams();
      closeModal()
      await refreshTableData()
    }
  }).catch(err => {
    console.log(err)
  })
  console.log(userStore.deactivatingUserErrors)
}

const triggerSoldeInjectionInTheBackend = async () => {
  inputStore.beginSendingUserData()
  await userStore.increaseSoldes($apiFetch).then(async () => {
    inputStore.finishSendingUserData();
    teamStore.refreshAffectationTeams();
    closeModal()
    await refreshTableData()
  }).catch(err => {
    console.log(err)
  })
}

const demandeCongeInputStore = useDemandeCongeInputStore()

const soldeInputStore = useSoldeInputStore()

const refreshDemandsTable = async () => {
  demandForm.value = {
    date_demande_debut: demandeCongeInputStore.dateDemandeDebut,
    date_demande_fin: demandeCongeInputStore.dateDemandeFin,
    date_debut_conge_debut: demandeCongeInputStore.dateDebutCongeDebut,
    date_debut_conge_fin: demandeCongeInputStore.dateDebutCongeFin,
    date_fin_conge_debut: demandeCongeInputStore.dateFinCongeDebut,
    date_fin_conge_fin: demandeCongeInputStore.dateFinCongeFin,
    matricule: demandeCongeInputStore.matricule
  }
  refreshDemandeCongeForm()
  soldeInputStore.loadTableData()
  await demandeCongeInputStore.fetchDemands($apiFetch, demandForm.value, inputStore.pageIndex)
  soldeInputStore.finishLoadingTableData()
}

const sendDemandeCongeFormDataToTheBackend = async () => {
  inputStore.beginSendingUserData()
  await demandesCongeInputStore.createNewDemand($apiFetch, demandeCongeForm.value).then(async () => {
    inputStore.finishLoadingTableData();
    closeModal();
    await refreshDemandsTable()
    await userStore.fetchUser($apiFetch, setUser).catch(err => console.log(err))
    // await demandesCongeInputStore.getLatestDemand($apiFetch, demandeCongeForm.value).catch(err => console.log(err))
    inputStore.finishSendingUserData()
  }).catch(err => console.log(err))
}

let nbrJrsDemandesConfirmed = ref(null)

// const isSendingAcceptationData = ref(false)

const sendAcceptationDataToBackend = async () => {
  // console.log(props.demandeCongeData)
  let dataObj = {
    ...props.demandeCongeData,
    nombre_jours_confirmed: nbrJrsDemandesConfirmed.value
  };

  inputStore.beginSendingUserData();
  if (isOpsManager) {
    await demandeCongeInputStore.acceptDemandOpsManager($apiFetch, dataObj).then().catch(err => console.log(err))
  } else if (isRespIT) {
    await demandeCongeInputStore.acceptDemandITResponsable($apiFetch, dataObj).then().catch(err => console.log(err))
  } else if (isSupervisor) {
    await demandeCongeInputStore.acceptDemandSupervisor($apiFetch, dataObj).then().catch(err => console.log(err))
  } else if (isVigie) {
    await demandeCongeInputStore.acceptDemandVigie($apiFetch, dataObj).then().catch(err => console.log(err))
  } else if (isCPS) {
    await demandeCongeInputStore.acceptDemandCPS($apiFetch, dataObj).then().catch(err => console.log(err))
  } else if (isCCI) {
    await demandeCongeInputStore.acceptDemandCCI($apiFetch, dataObj).then().catch(err => console.log(err))
  } else if (isCoordinatorVigie) {
    await demandeCongeInputStore.acceptDemandCoordinatorVigie($apiFetch, dataObj).then().catch(err => console.log(err))
  } else if (isCoordinatorCPS) {
    await demandeCongeInputStore.acceptDemandCoordinatorCPS($apiFetch, dataObj).then().catch(err => console.log(err))
  } else if (isHeadOfOperationalExcellence) {
    await demandeCongeInputStore.acceptDemandHeadOfOperationalExcellence($apiFetch, dataObj).then().catch(err => console.log(err))
  } else if (isRespRH || isChargeRH) {
    await demandeCongeInputStore.acceptDemandRespRHOrChargeRHOrClose($apiFetch, dataObj).then().catch(err => console.log(err))
  } else if (isDirector) {
    await demandeCongeInputStore.acceptDemandDirector($apiFetch, dataObj).then().catch(err => console.log(err))
  }
  await demandeCongeInputStore.refreshDemandData($apiFetch, dataObj).then(async () => {
    inputStore.finishSendingUserData()
    closeModal();
    await refreshDemandsTable();
  }).catch(err => console.log(err))
}

const sendCancelingDataToBackend = async () => {
  inputStore.beginSendingUserData()
  await demandeCongeInputStore.cancelDemand($apiFetch, props.demandeCongeData).then(async () => {
    inputStore.finishSendingUserData();
    closeModal();
    await refreshDemandsTable()
  }).catch(err => console.log(err))
}

const sendRejectionDataToBackend = async () => {
  inputStore.beginSendingUserData();
  await demandeCongeInputStore.rejectDemand($apiFetch, props.demandeCongeData).then(async () => {
    inputStore.finishSendingUserData();
    closeModal();
    await refreshDemandsTable();
    // await demandesCongeInputStore.getLatestDemand($apiFetch, demandeCongeForm.value).then(() => {
    // }).catch(err => console.log(err))
  }).catch(err => console.log(err))
}

const sendDataToBackend = () => {
  if (props.edit) {
    return updateUser();
  } else if (props.affectation) {
    return sendAffectationDataToBackend();
  } else if (props.deactivation) {
    return deactivateUserInTheBackend();
  } else if (props.increaseSolde) {
    return triggerSoldeInjectionInTheBackend();
  } else if (props.demandeConge) {
    return sendDemandeCongeFormDataToTheBackend()
  } else if (props.accept) {
    return sendAcceptationDataToBackend()
  } else if (props.cancel) {
    return sendCancelingDataToBackend()
  } else if (props.reject) {
    return sendRejectionDataToBackend()
  } else if (!props.edit && !props.affectation && !props.deactivation && !props.increaseSolde && !props.demandeConge && !props.reject && !props.accept && !props.cancel) {
    return sendFormDataToBackend()
  }
}

const getTitle = () => {
  if (props.affectation) {
    return 'Affectation profil/fonction'
  } else if (props.deactivation) {
    return 'Départ employé'
  } else if (props.increaseSolde) {
    return 'Augmenter Soldes'
  } else if (props.demandeConge) {
    return 'Fiche demande congé'
  } else if (props.accept) {
    return 'Accepter la demande de congés'
  } else if (props.reject) {
    return 'Refuser la demande de congés'
  } else if (props.cancel) {
    return 'Annuler la demande de congés'
  } else {
    return 'Informations utilisateur'
  }
}

let increaseSoldeFormData = ref({
  increaseSoldeFile: null
})

const {setUser} = useAuth()

onMounted(async () => {
  await userStore.fetchUser($apiFetch, setUser).then(() => {
    if (userStore.user?.role?.name?.includes('Conseiller') || userStore.user?.role?.name?.includes('FR') || userStore.user?.role?.name?.includes('NL')
    ) {
      demandeCongeForm.value.matricule = userStore.user?.matricule;
    }
  }).catch(err => console.log(err))
  console.log(props.demandeCongeData)
})

// watch(demandeCongeForm, () => {
//     console.log(demandeCongeForm.value)
// }, {deep: true})

const getValidationState = () => {
  if (props.affectation || props.edit || deactivationFormData.value?.date_depart) {
    return false
  }
  if (props.accept) {
    console.log(props.demandeCongeData?.type_demande?.name)
    return !props.accept || !nbrJrsDemandesConfirmed.value || props.demandeCongeData?.type_demande?.name === null
  } else if (props.reject) {
    return !props.reject
  } else if (props.cancel) {
    return !props.cancel
  }
  if (!props.demandeConge) {
    return !inputStore.checkFile
  } else {
    return Object.values(demandeCongeForm.value).includes(null) || Object.values(demandeCongeForm.value).includes("")
  }
}

// const getMinDate = (date_retour: any | null | undefined = undefined, date_debut: any = false) => {
//     let date = new Date(date_retour)
//     if (date_retour && date_debut) {
//         return date.toISOString().split('T')[0]
//     } else if (!date_retour) {
//         if (demandesCongeInputStore.latestDemand?.date_retour) {
//             date = new Date(demandesCongeInputStore.latestDemand?.date_retour)
//             date.setDate(date.getDate() + 1)
//             return date.toISOString().split('T')[0]
//         } else {
//             date = new Date()
//             date.setDate(date.getDate() + 1)
//             return date.toISOString().split('T')[0]
//         }
//     }
// }
//
// const getMaxDate = () => {
//     const date = new Date(getMinDate(demandeCongeForm?.value?.date_debut, true))
//     date.setDate(date.getDate() + demandeCongeForm.value.solde)
//     return date.toISOString().split('T')[0]
// }
//
// const getMaxFinDate = () => {
//     const date = new Date(getMinDate())
//     date.setDate(date.getDate() + 5)
//     return date.toISOString().split('T')[0]
// }

const getDateRetourMinDate = (date_min: any) => {
  let date = new Date(date_min)
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
}

const isHR = userStore.user?.role?.name?.toLowerCase().includes('rh') || userStore.user?.role?.name?.toLowerCase()?.includes('humain')
const isOpsManager = userStore.user?.role?.name?.toLowerCase().includes('opération');
const isCoordinatorVigie = userStore.user?.role?.name?.toLowerCase()?.includes('coordinateur vigie')
const isCoordinatorCPS = userStore.user?.role?.name?.toLowerCase()?.includes('coordinateur cps')
const isRespIT = userStore.user?.role?.name?.toLowerCase()?.includes('responsable it');
const isSupervisor = userStore?.user?.role?.name?.toLowerCase().includes('superviseur')
const isVigie = userStore.user?.role?.name?.toLowerCase().includes('vigie');
const isCPS = userStore.user?.role?.name?.toLowerCase()?.includes('statis')
const isCCI = userStore.user?.role?.name?.toLowerCase().includes('incoh')
const isHeadOfOperationalExcellence = userStore.user?.role?.name?.toLowerCase()?.includes('head of operational excellence')
const isChargeRH = userStore.user?.role?.name?.toLowerCase()?.includes('chargé rh')
const isRespRH = userStore.user?.role?.name?.toLowerCase()?.includes('responsable rh')
const isDirector = userStore.user?.role?.name?.toLowerCase() === 'directeur'
const isWfm = userStore.user?.role?.name?.toLowerCase()?.includes('statis') || userStore.user?.role?.name?.toLowerCase()?.includes('cps') || userStore.user?.role?.name?.toLowerCase().includes('vigie') || userStore.user?.role?.name?.toLowerCase().includes('correction')

watch(demandeCongeForm, () => {
  let dateDebut, dateFin, dateRetour;
  const soldeTotal = parseInt(userStore.user?.solde_cp) + parseInt(userStore.user?.solde_rjf)
  if (demandeCongeForm.value.date_debut) {
    dateDebut = new Date(demandeCongeForm.value.date_debut)
  }
  if (demandeCongeForm.value.date_fin) {
    dateFin = new Date(demandeCongeForm.value.date_fin)
  }
  if (demandeCongeForm.value.date_retour) {
    dateRetour = new Date(demandeCongeForm.value.date_retour)
  }
  if (dateFin && dateDebut && dateDebut.getDate() > dateFin.getDate()) {
    demandeCongeForm.value.date_fin = null
  }
  if (dateRetour && dateDebut && dateDebut.getDate() > dateRetour.getDate()) {
    demandeCongeForm.value.date_retour = null
  }
  if ((demandeCongeForm.value?.nombre_jours ?? 0) > soldeTotal && demandeCongeForm.value.type_conge === 'conge paye') {
    demandeCongeForm.value.type_conge = null;
  }
  console.log(demandeCongeForm.value)
}, {deep: true})

const getState = (demand) => {
  const isRejected = demand?.demand?.etat_demande?.toLowerCase()?.includes('rejected')
  const isClosed = demand?.demand?.etat_demande?.toLowerCase()?.includes('closed')
  if (isRejected || isClosed) {
    return ""
  }
  return "(en cours)"
}

watch(nbrJrsDemandesConfirmed, () => {
  let soldeTotal = parseInt(props.demandeCongeData?.user?.solde_cp) + parseInt(props.demandeCongeData?.user?.solde_rjf)
  if (props.demandeCongeData?.type_demande?.name === 'conge paye') {
    if (parseInt(nbrJrsDemandesConfirmed.value) > soldeTotal || parseInt(nbrJrsDemandesConfirmed.value) < 0) {
      nbrJrsDemandesConfirmed.value = null
    }
  }
}, {deep: true})

const getSoldeTotal = (demand) => {
  return parseInt(demand?.user?.solde_cp) + parseInt(demand?.user?.solde_rjf)
}

</script>

<template>
  <div v-if="show" class="modal-mask overflow-y-auto bg-black/[.6]"
       :class="[{'!bg-black/[.3]': (accept || reject || cancel) && !isSupervisor && !isHR && !isOpsManager}, {'!bg-black/[.1]': (accept || reject || cancel) && isOpsManager}]">
    <div class="modal-container">
      <header class="text-white bg-blue-700 p-3">
        <div class="flex items-center">
          <div class="mr-auto text-2xl">
            {{ getTitle() }}
          </div>
          <i class="fa-solid fa-x cursor-pointer" @click.prevent="closeModal()"></i>
        </div>
      </header>

      <div v-if="accept" class="text-center font-bold text-xl mt-3">Vous êtes sure d'accepter la demande de
        congés?
      </div>
      <div v-if="reject" class="text-center font-bold text-xl">Vous êtes sure de refuser la demande de congés?
      </div>
      <div v-if="cancel" class="text-center font-bold text-xl">Vous êtes sure d'annuler la demande de congés?
      </div>

      <div v-if="inputStore.sendingUser">Loading...</div>
      <div v-if="demandeConge && !inputStore.sendingUser && !accept && !reject && !cancel">
        <div class="px-3 my-3 flex">
          <FormInput :key="1" val="matricule" :disabled="!userStore.user?.role?.name?.includes('Opérations')"
                     v-model="demandeCongeForm.matricule" :data="userStore.user?.matricule"/>
          <FormInput :key="2" val="solde total" :disabled="true" v-model="demandeCongeForm.solde"/>
          <FormInput :key="3" val="date_retour" :disabled="!demandeCongeForm.date_fin"
                     :min="getDateRetourMinDate(demandeCongeForm.date_fin)"
                     v-model="demandeCongeForm.date_retour"/>
        </div>
        <div class="px-3 my-3 flex">
          <FormInput :key="1" val="date_debut"
                     v-model="demandeCongeForm.date_debut"/>
          <FormInput :key="2" val="date_fin" :disabled="!demandeCongeForm.date_debut"
                     :min="demandeCongeForm.date_debut"
                     v-model="demandeCongeForm.date_fin"/>
          <FormInput :key="3" v-model="demandeCongeForm.nombre_jours" val="nombre jours"/>
          <FormInput val="type de congé" v-model="demandeCongeForm.type_conge"
                     :nombre_jours="demandeCongeForm.nombre_jours" type="select"/>
        </div>
      </div>
      <div v-if="accept && !inputStore.sendingUser">
        <div class="flex px-3 mx-3 mt-12">
          <FormInput :model-value="props.demandeCongeData?.nombre_jours" :disabled="true"
                     val="nombre jours demandés"/>
          <FormInput v-model="nbrJrsDemandesConfirmed" val="confirmer nombre jours demandés"/>
          <FormInput val="date_debut"
                     :model-value="props.demandeCongeData?.date_debut"
                     :min="props.demandeCongeData?.date_debut"
                     :max="props.demandeCongeData?.date_debut" :disabled="false"/>
          <FormInput val="date_fin"
                     :model-value="props.demandeCongeData?.date_fin" :min="props.demandeCongeData?.date_fin"
                     :max="props.demandeCongeData?.date_fin"/>
        </div>
        <div class="flex px-3 mx-3 my-3 mb-12">
          <FormInput :model-value="getSoldeTotal(props.demandeCongeData).toString()" :disabled="true"
                     val="solde total"/>
          <FormInput val="type de congé" :model-value="props.demandeCongeData?.type_demande?.name"
                     :disabled="true" type="select"/>
          <div class="font-bold mx-auto flex flex-col w-1/3">
            <div class="text-xs">Etat Demande</div>
            <div class="my-auto">{{ props.demandeCongeData?.demand?.etat_demande }} {{
                getState(props.demandeCongeData)
              }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="increaseSolde && !inputStore.sendingUser && !demandeConge && !accept && !reject && !cancel">
        <FormInput :key="1" v-model="increaseSoldeFormData.increaseSoldeFile" val="solde">
          <div v-if="inputStore.injectionErrors?.injectionError && !edit" class="text-xs text-red-500">
            {{ inputStore.injectionErrors?.injectionError }}
          </div>
        </FormInput>
      </div>
      <div v-if="deactivation && !inputStore.sendingUser && !demandeConge && !accept && !reject && !cancel"
           class="text-left flex flex-col">
        <div class="p-6">
          <FormInput :key="1" :disabled="true" :deactivation="deactivation" :data="user?.matricule"
                     v-model="deactivationFormData.matricule" val="matricule"/>
          <FormInput :key="2" :disabled="true" :deactivation="deactivation"
                     :data="user?.first_name + ' ' + user?.last_name"
                     v-model="deactivationFormData.name" val="nom et prénom"/>
          <FormInput :key="3" :deactivation="deactivation" :data="user?.date_depart"
                     v-model="deactivationFormData.date_depart" val="date départ">
            <div v-if="userStore.deactivatingUserErrors?.date_depart && !edit"
                 v-for="error in userStore.deactivatingUserErrors?.date_depart"
                 class="text-xs text-red-500">
              {{ error }}
            </div>
          </FormInput>
          <FormInput :key="4" type="select" :deactivation="deactivation" :data="user?.motif?.name"
                     v-model="deactivationFormData.type_depart" val="type départ"/>
          <FormInput :key="5" :deactivation="deactivation" v-model="deactivationFormData.comment"
                     :data="user?.comment?.leave_comment" val="comment"/>
        </div>
      </div>
      <div v-if="affectation && !inputStore.sendingUser && !demandeConge && !accept && !reject && !cancel"
           class="text-left">
        <div class="p-3 flex">
          <FormInput :key="1" :disabled="true" :data="user?.matricule" v-model="affectationFormData.matricule"
                     val="matricule"/>
          <FormInput :key="2" type="select" v-model="affectationFormData.profile" :data="user?.role?.name"
                     val="profile"/>
        </div>

        <div class="p-3 flex">
          <FormInput :key="1" :disabled="true" :data="user?.first_name + ' ' + user?.last_name"
                     v-model="affectationFormData.name" val="name"/>
          <InputType :key="2" :user="user" :affectation="affectation" val="team" :modal="true" type="text"
                     title="Team"/>
        </div>
        <div class="p-3 flex">
          <FormInput :key="1" type="date" v-model="affectationFormData.date_entree_formation"
                     val="date début formation"/>
          <FormInput :key="2" type="select" v-model="affectationFormData.principal_operation"
                     :data="user?.operation?.name" val="operation principale"/>
        </div>
      </div>
      <div
          v-if="!accept && !reject && !cancel && !increaseSolde && !inputStore.sendingUser && !affectation && !deactivation && !demandeConge"
          class="text-left">
        <div class="p-3 flex">
          <FormInput :key="1" :disabled="addOrEditFormData.edit_matricule && edit"
                     v-model="addOrEditFormData.matricule"
                     :data="user?.matricule" val="matricule">
            <div v-if="edit">changer matricule <input type="checkbox"
                                                      :value="!addOrEditFormData.edit_matricule"
                                                      :checked="!addOrEditFormData.edit_matricule"
                                                      @click="toggleField('matricule')"/></div>
            <div v-if="userStore.addingUserErrors?.matricule && !edit"
                 v-for="error in userStore.addingUserErrors?.matricule" class="text-xs text-red-500">
              {{ error }}
            </div>
            <div v-if="userStore.editingUserErrors?.matricule && edit"
                 v-for="error in userStore.editingUserErrors?.matricule" class="text-xs text-red-500">
              {{ error }}
            </div>
          </FormInput>
          <FormInput :key="2" :disabled="addOrEditFormData.edit_email && edit"
                     v-model="addOrEditFormData.email_1"
                     :data="user?.email_1" val="e-mail">
            <div v-if="edit">changer email <input type="checkbox" :value="!addOrEditFormData.edit_email"
                                                  :checked="!addOrEditFormData.edit_email"
                                                  @click="toggleField('email1')"/></div>
            <div v-if="userStore.addingUserErrors?.email_1 && !edit"
                 v-for="error in userStore.addingUserErrors?.email_1" class="text-xs text-red-500">{{
                error
              }}
            </div>
            <div v-if="userStore.editingUserErrors?.email_1 && edit"
                 v-for="error in userStore.editingUserErrors?.email_1" class="text-xs text-red-500">{{
                error
              }}
            </div>
          </FormInput>
        </div>

        <div class="p-3 flex">
          <FormInput :key="1" v-model="addOrEditFormData.nom" :data="user?.first_name" val="nom">
            <div v-if="userStore.addingUserErrors?.nom && !edit"
                 v-for="error in userStore.addingUserErrors?.nom"
                 class="text-xs text-red-500">{{ error }}
            </div>
          </FormInput>
          <FormInput :key="2" v-model="addOrEditFormData.prenom" :data="user?.last_name" val="prenom">
            <div v-if="userStore.addingUserErrors?.prenom && !edit"
                 v-for="error in userStore.addingUserErrors?.prenom"
                 class="text-xs text-red-500">{{ error }}
            </div>
          </FormInput>
        </div>

        <div class="p-3 flex">
          <div class="w-1/2 flex items-center mx-3">
            <RadioOrCheckboxInput :key="1" v-model="addOrEditFormData.sexe" :data="user?.Sexe"
                                  val="sexe_homme"/>
            <RadioOrCheckboxInput :key="2" v-model="addOrEditFormData.sexe" :data="user?.Sexe"
                                  val="sexe_femme"/>
          </div>
          <FormInput :key="1" v-model="addOrEditFormData.date_mep" val="date mep"/>
        </div>

        <div class="p-3 flex">
          <FormInput :key="1" v-model="addOrEditFormData.langue_principale"
                     :data="user?.primary_language?.name"
                     type="select"
                     val="principal language"/>
          <FormInput :key="2" v-model="addOrEditFormData.date_entree_formation"
                     :data="user?.date_entree_formation"
                     val="date début formation"/>
        </div>

        <div class="p-3 flex">
          <FormInput :key="1" v-model="addOrEditFormData.cin_number" :data="cinNumber"
                     val="identity number CIN"/>
          <FormInput :key="2" v-model="addOrEditFormData.passport_number" :data="passportNumber"
                     val="identity number Passport"/>
        </div>

        <div class="p-3 flex">
          <FormInput :key="1" v-model="addOrEditFormData.carte_sejour_number" :data="carteSejourNumber"
                     val="identity number Carte sèjour"/>
          <FormInput :key="2" v-model="addOrEditFormData.nationalite" :data="user?.nationality?.name"
                     type="select"
                     val="nationalities"/>
        </div>

        <div class="p-3 flex">
          <FormInput :key="1" v-model="addOrEditFormData.date_naissance" :data="user?.date_naissance"
                     val="date_naissance"/>
          <FormInput :key="2" v-model="addOrEditFormData.sourcing_provider" :data="user?.sourcing_type?.name"
                     :edit="edit"
                     type="select"
                     val="fournisseur"/>
        </div>

        <div class="p-3 flex">
          <FormInput :key="1" v-model="addOrEditFormData.situation_familiale"
                     :data="user?.family_situation?.name"
                     val="situation familiale" type="select"/>
          <FormInput :key="2" v-model="addOrEditFormData.photo" :data="user?.photo" val="photo"/>
        </div>

        <div class="p-3 flex">
          <FormInput :key="1" v-model="addOrEditFormData.phone_1" :data="user?.phone_1" val="téléphone 1"/>
          <FormInput :key="2" v-model="addOrEditFormData.nombre_enfants" :data="user?.nombre_enfants"
                     val="nombre enfants"/>
        </div>

        <div class="p-3 flex">
          <FormInput :key="1" v-model="addOrEditFormData.phone_2" :data="user?.phone_2" val="téléphone 2"/>
          <FormInput :key="2" v-model="addOrEditFormData.cnss_number" :data="user?.cnss_number"
                     val="Numéro CNSS"/>
        </div>

        <div v-if="edit" class="p-3 flex">
          <FormInput :key="1" v-model="addOrEditFormData.solde_cp" :data="parseInt(user?.solde_cp)"
                     val="solde_cp"/>
          <FormInput :key="2" v-model="addOrEditFormData.solde_rjf" :data="parseInt(user?.solde_rjf)"
                     val="solde_rjf"/>
        </div>

        <div class="p-3 flex">
          <FormInput :key="1" v-model="addOrEditFormData.comment" :data="user?.comment?.comment"
                     val="comment"/>
          <FormInput :key="2" v-model="addOrEditFormData.address" :data="user?.address" val="address"/>
        </div>

      </div>

      <footer class="flex mx-6 my-3 bg-gray-200 p-3" v-if="!inputStore.sendingUser">
        <button class="mr-auto text-black bg-gray-100 p-2 rounded-md" @click.prevent="closeModal()">Cancel
        </button>
        <button class="bg-cyan-500 text-white p-2 rounded-md"
                :class="[{'!bg-gray-500': getValidationState()}, {'!bg-red-500': reject}]"
                @click.prevent="sendDataToBackend()" :disabled="getValidationState()">
          {{ reject ? 'Rejeter' : 'Valider' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
}

.modal-container {
  background: white;
  width: 80vw;
  max-width: 1000px;
}
</style>
