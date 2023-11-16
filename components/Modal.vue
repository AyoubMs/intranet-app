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

const props = defineProps({
  show: Boolean,
  edit: Boolean,
  affectation: Boolean,
  deactivation: Boolean,
  increaseSolde: Boolean,
  demandeConge: Boolean,
  user: Object,
  filterData: Object
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
  date_fin: null
})

const refreshDemandeCongeForm = () => {
  demandeCongeForm.value.date_retour = null
  demandeCongeForm.value.date_debut = null
  demandeCongeForm.value.date_fin = null
}

let cinNumber: any = ref(props.user?.identity_types?.filter((data: any) => data?.name === 'CIN')[0]?.identity_number)
let passportNumber: any = ref(props.user?.identity_types?.filter((data: any) => data?.name === 'Passeport')[0]?.identity_number)
let carteSejourNumber: any = ref(props.user?.identity_types?.filter((data: any) => data?.name === 'Carte sejour')[0]?.identity_number);

onMounted(async () => {
  await userStore.fetchUser($apiFetch, setUser).then(() => {
    demandeCongeForm.value.solde = Number(userStore?.user?.solde_rjf) + Number(userStore?.user?.solde_cp)
    console.log(userStore?.user)
  }).catch(err => console.log(err))
  console.log(props.user)
})

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
  await userStore.editUser($apiFetch, addOrEditFormData.value).then(() => {
    inputStore.finishSendingUserData();
    if (!Object.entries(userStore.editingUserErrors).length) {
      teamStore.refreshAffectationTeams();
      closeModal()
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
  await userStore.fetchUsers($apiFetch, inputStore.status, filterData.value).catch(err => console.log(err))
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
  await userStore.fetchUser($apiFetch, setUser).catch(err => console.log(err))
  soldeInputStore.loadTableData()
  await demandeCongeInputStore.sendFormDataToBackend($apiFetch, demandForm.value)
  soldeInputStore.finishLoadingTableData()
}

const sendDemandeCongeFormDataToTheBackend = async () => {
  inputStore.beginSendingUserData()
  await demandesCongeInputStore.createNewDemand($apiFetch, demandeCongeForm.value).then(async () => {
    inputStore.finishLoadingTableData();
    closeModal();
    await refreshDemandsTable()
    await userStore.fetchUser($apiFetch, setUser).then((res) => {
      demandeCongeForm.value.solde = Number(userStore.user?.solde_rjf) + Number(userStore.user?.solde_cp)
    }).catch(err => console.log(err))
  }).catch(err => console.log(err))
  inputStore.finishSendingUserData()
}

const sendDataToBackend = () => {
  if (props.edit) {
    return updateUser();
  } else if (!props.edit && !props.affectation && !props.deactivation && !props.increaseSolde && !props.demandeConge) {
    return sendFormDataToBackend()
  } else if (props.affectation) {
    return sendAffectationDataToBackend();
  } else if (props.deactivation) {
    return deactivateUserInTheBackend();
  } else if (props.increaseSolde) {
    return triggerSoldeInjectionInTheBackend();
  } else if (props.demandeConge) {
    return sendDemandeCongeFormDataToTheBackend()
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
  )
    {
      demandeCongeForm.value.matricule = userStore.user?.matricule;
    }
    demandeCongeForm.value.solde = Number(userStore.user?.solde_cp ?? 0) + Number(userStore.user?.solde_rjf ?? 0);
  }).catch(err => console.log(err))
})

watch(demandeCongeForm, () => {
  console.log(demandeCongeForm.value)
}, {deep: true})

const getValidationState = () => {
  if (props.affectation || props.edit || deactivationFormData.value?.date_depart) {
    return false
  }
  if (!props.demandeConge) {
    return !inputStore.checkFile
  } else {
    return Object.values(demandeCongeForm.value).includes(null)
  }
}

const getMinDate = async (date_retour: any = undefined, date_debut: any = false) => {
  demandeCongeForm.solde = Number(userStore.user?.solde_cp) + Number(userStore.user?.solde_rjf)
  let date = new Date(date_retour)
  await demandesCongeInputStore.getLatestDemand($apiFetch, demandeCongeForm.value).catch(err => console.log(err))
  if (date_retour && date_debut) {
    return date.toISOString().split('T')[0]
  } else if (!date_retour) {
    if (demandesCongeInputStore.latestDemand?.date_retour) {
      date = new Date(demandesCongeInputStore.latestDemand?.date_retour)
      date.setDate(date.getDate() + 1)
      return date.toISOString().split('T')[0]
    } else {
      return (new Date()).toISOString().split('T')[0]
    }
  }
}

let date1 = ref()

const getMinDateValue = (date_retour: any = undefined, date_debut: any = false) => {
  getMinDate(date_retour, date_debut).then(res => {
    date1.value = res;
  })
  return date1.value
}

let date2 = ref()
const getMaxDate = () => {
  getMinDate(demandeCongeForm.value.date_debut, true).then((res) => {
    const date = new Date(res)
    date.setDate(date.getDate() + demandeCongeForm.value.solde)
    date2.value = date.toISOString().split('T')[0]
  })
  return date2.value;
}

let date3 = ref()
const getMaxFinDate = () => {
  getMinDate().then((res) => {
    const date = new Date(res)
    date.setDate(date.getDate() + 5)
    date3.value = date.toISOString().split('T')[0]
  })
  return date3.value
}

const getDateRetourMinDate = (date_min: any) => {
  let date = new Date(date_min)
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
}

</script>

<template>
  <div v-if="show" class="modal-mask overflow-y-auto">
    <div class="modal-container">
      <header class="text-white bg-blue-700 p-3">
        <div class="flex items-center">
          <div class="mr-auto text-2xl">
            {{ getTitle() }}
          </div>
          <i class="fa-solid fa-x cursor-pointer" @click.prevent="closeModal()"></i>
        </div>
      </header>

      <div v-if="inputStore.sendingUser">Loading...</div>
      <div v-if="demandeConge && !inputStore.sendingUser">
        <div class="px-3 my-3 flex">
          <FormInput val="matricule" :disabled="!userStore.user?.role?.name?.includes('Opérations')"
                     v-model="demandeCongeForm.matricule" :data="userStore.user?.matricule"/>
          <FormInput val="solde total" :disabled="true" v-model="demandeCongeForm.solde"/>
          <FormInput val="date_retour" :min="getDateRetourMinDate(demandeCongeForm.date_fin)" :max="getMaxDate()"
                     :disabled="demandeCongeForm.date_debut === null || demandeCongeForm.date_fin === null"
                     v-model="demandeCongeForm.date_retour"/>
        </div>
        <div class="px-3 my-3 flex">
          <FormInput val="date_debut" :disabled="demandeCongeForm.solde === 0" :min="getMinDateValue()"
                     v-model="demandeCongeForm.date_debut"/>
          <FormInput val="date_fin" :disabled="demandeCongeForm.solde === 0"
                     :min="getMinDateValue(demandeCongeForm.date_debut, true)" :max="getMaxDate()"
                     v-model="demandeCongeForm.date_fin"/>
        </div>
      </div>
      <div v-if="increaseSolde && !inputStore.sendingUser && !demandeConge">
        <FormInput v-model="increaseSoldeFormData.increaseSoldeFile" val="solde">
          <div v-if="inputStore.injectionErrors?.injectionError && !edit" class="text-xs text-red-500">
            {{ inputStore.injectionErrors?.injectionError }}
          </div>
        </FormInput>
      </div>
      <div v-if="deactivation && !inputStore.sendingUser && !demandeConge" class="text-left flex flex-col">
        <div class="p-6">
          <FormInput :disabled="true" :deactivation="deactivation" :data="user?.matricule"
                     v-model="deactivationFormData.matricule" val="matricule"/>
          <FormInput :disabled="true" :deactivation="deactivation"
                     :data="user?.first_name + ' ' + user?.last_name"
                     v-model="deactivationFormData.name" val="nom et prénom"/>
          <FormInput :deactivation="deactivation" :data="user?.date_depart"
                     v-model="deactivationFormData.date_depart" val="date départ">
            <div v-if="userStore.deactivatingUserErrors?.date_depart && !edit"
                 v-for="error in userStore.deactivatingUserErrors?.date_depart"
                 class="text-xs text-red-500">
              {{ error }}
            </div>
          </FormInput>
          <FormInput type="select" :deactivation="deactivation" :data="user?.motif?.name"
                     v-model="deactivationFormData.type_depart" val="type départ"/>
          <FormInput :deactivation="deactivation" v-model="deactivationFormData.comment"
                     :data="user?.comment?.leave_comment" val="comment"/>
        </div>
      </div>
      <div v-if="affectation && !inputStore.sendingUser && !demandeConge" class="text-left">
        <div class="p-3 flex">
          <FormInput :disabled="true" :data="user?.matricule" v-model="affectationFormData.matricule"
                     val="matricule"/>
          <FormInput type="select" v-model="affectationFormData.profile" :data="user?.role?.name"
                     val="profile"/>
        </div>

        <div class="p-3 flex">
          <FormInput :disabled="true" :data="user?.first_name + ' ' + user?.last_name"
                     v-model="affectationFormData.name" val="name"/>
          <InputType :user="user" :affectation="affectation" val="team" type="text" title="Team"/>
        </div>
        <div class="p-3 flex">
          <FormInput type="date" v-model="affectationFormData.date_entree_formation"
                     val="date début formation"/>
          <FormInput type="select" v-model="affectationFormData.principal_operation"
                     :data="user?.operation?.name" val="operation principale"/>
        </div>
      </div>
      <div v-if="!increaseSolde && !inputStore.sendingUser && !affectation && !deactivation && !demandeConge"
           class="text-left">
        <div class="p-3 flex">
          <FormInput :disabled="addOrEditFormData.edit_matricule && edit"
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
          <FormInput :disabled="addOrEditFormData.edit_email && edit" v-model="addOrEditFormData.email_1"
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
          <FormInput v-model="addOrEditFormData.nom" :data="user?.first_name" val="nom">
            <div v-if="userStore.addingUserErrors?.nom && !edit"
                 v-for="error in userStore.addingUserErrors?.nom"
                 class="text-xs text-red-500">{{ error }}
            </div>
          </FormInput>
          <FormInput v-model="addOrEditFormData.prenom" :data="user?.last_name" val="prenom">
            <div v-if="userStore.addingUserErrors?.prenom && !edit"
                 v-for="error in userStore.addingUserErrors?.prenom"
                 class="text-xs text-red-500">{{ error }}
            </div>
          </FormInput>
        </div>

        <div class="p-3 flex">
          <div class="w-1/2 flex items-center mx-3">
            <RadioOrCheckboxInput v-model="addOrEditFormData.sexe" :data="user?.Sexe" val="sexe_homme"/>
            <RadioOrCheckboxInput v-model="addOrEditFormData.sexe" :data="user?.Sexe" val="sexe_femme"/>
          </div>
          <FormInput v-model="addOrEditFormData.date_mep" val="date mep"/>
        </div>

        <div class="p-3 flex">
          <FormInput v-model="addOrEditFormData.langue_principale" :data="user?.primary_language?.name"
                     type="select"
                     val="principal language"/>
          <FormInput v-model="addOrEditFormData.date_entree_formation" :data="user?.date_entree_formation"
                     val="date début formation"/>
        </div>

        <div class="p-3 flex">
          <FormInput v-model="addOrEditFormData.cin_number" :data="cinNumber" val="identity number CIN"/>
          <FormInput v-model="addOrEditFormData.passport_number" :data="passportNumber"
                     val="identity number Passport"/>
        </div>

        <div class="p-3 flex">
          <FormInput v-model="addOrEditFormData.carte_sejour_number" :data="carteSejourNumber"
                     val="identity number Carte sèjour"/>
          <FormInput v-model="addOrEditFormData.nationalite" :data="user?.nationality?.name" type="select"
                     val="nationalities"/>
        </div>

        <div class="p-3 flex">
          <FormInput v-model="addOrEditFormData.date_naissance" :data="user?.date_naissance"
                     val="date_naissance"/>
          <FormInput v-model="addOrEditFormData.sourcing_provider" :data="user?.sourcing_type?.name"
                     :edit="edit"
                     type="select"
                     val="fournisseur"/>
        </div>

        <div class="p-3 flex">
          <FormInput v-model="addOrEditFormData.situation_familiale" :data="user?.family_situation?.name"
                     val="situation familiale" type="select"/>
          <FormInput v-model="addOrEditFormData.photo" :data="user?.photo" val="photo"/>
        </div>

        <div class="p-3 flex">
          <FormInput v-model="addOrEditFormData.phone_1" :data="user?.phone_1" val="téléphone 1"/>
          <FormInput v-model="addOrEditFormData.nombre_enfants" :data="user?.nombre_enfants"
                     val="nombre enfants"/>
        </div>

        <div class="p-3 flex">
          <FormInput v-model="addOrEditFormData.phone_2" :data="user?.phone_2" val="téléphone 2"/>
          <FormInput v-model="addOrEditFormData.cnss_number" :data="user?.cnss_number" val="Numéro CNSS"/>
        </div>

        <div v-if="edit" class="p-3 flex">
          <FormInput v-model="addOrEditFormData.solde_cp" :data="Number(user?.solde_cp)" val="solde_cp"/>
          <FormInput v-model="addOrEditFormData.solde_rjf" :data="Number(user?.solde_rjf)" val="solde_rjf"/>
        </div>

        <div class="p-3 flex">
          <FormInput v-model="addOrEditFormData.comment" :data="user?.comment?.comment" val="comment"/>
          <FormInput v-model="addOrEditFormData.address" :data="user?.address" val="address"/>
        </div>

      </div>

      <footer class="flex mx-6 my-3 bg-gray-200 p-3" v-if="!inputStore.sendingUser">
        <button class="mr-auto text-black bg-gray-100 p-2 rounded-md" @click.prevent="closeModal()">Cancel
        </button>
        <button class="bg-cyan-500 text-white p-2 rounded-md" :class="{'!bg-gray-500': getValidationState()}"
                @click.prevent="sendDataToBackend()" :disabled="getValidationState()">Valider
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .6);
  display: grid;
  place-items: center;
}

.modal-container {
  background: white;
  width: 80vw;
  max-width: 1000px;
}
</style>
