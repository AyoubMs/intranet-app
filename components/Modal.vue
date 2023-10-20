<script setup lang="ts">
import FormInput from "~/components/FormInput.vue";
import {useInputStore} from "~/stores/InputStore";
import {useUserStore} from "~/stores/UserStore";

const props = defineProps({
    show: Boolean,
    edit: Boolean,
    user: Object
})

let inputStore = useInputStore()

let userStore = useUserStore()

const {$apiFetch} = useNuxtApp()

let formData = ref({
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

let cinNumber : any = ref(props.user?.identity_types?.filter((data:any) => data?.name === 'CIN')[0]?.identity_number)
let passportNumber : any = ref(props.user?.identity_types?.filter((data:any) => data?.name === 'Passeport')[0]?.identity_number)
let carteSejourNumber : any = ref(props.user?.identity_types?.filter((data:any) => data?.name === 'Carte sejour')[0]?.identity_number);

onMounted(() => {
    console.log(props.user)
})

watch(userStore.addingUserErrors, () => {
    console.log(userStore.addingUserErrors)
}, { deep: true })

watch(formData, () => {
    console.log(formData.value)
}, {deep: true})

const emit = defineEmits(["close"]);

const closeModal = () => {
    emit('close');
    userStore.refreshAddingUserErrors()
    userStore.refreshEditingUserErrors()
}

const sendFormDataToBackend = async () => {
    inputStore.beginSendingUserData()
    await userStore.addUser($apiFetch, formData.value).then(() => {
        inputStore.finishSendingUserData();
        if (!Object.entries(userStore.addingUserErrors).length) {
            closeModal();
        }
    }).catch(err => {
        console.log(err)
    })
}

const updateUser = async () => {
    inputStore.beginSendingUserData()
    await userStore.editUser($apiFetch, formData.value).then(() => {
        inputStore.finishSendingUserData();
        if (!Object.entries(userStore.editingUserErrors).length) {
            closeModal()
        }
    }).catch(err => {
        console.log(err)
    })
    console.log(formData.value)
    console.log(userStore.editingUserErrors)
}

const toggleField = (field: any) => {
    if (field === 'matricule') {
        formData.value.edit_matricule = !formData.value.edit_matricule
    } else if (field === 'email1') {
        formData.value.edit_email = !formData.value.edit_email
    }
}

</script>

<template>
    <div v-if="show" class="modal-mask overflow-y-auto">
        <div class="modal-container">
            <header class="text-white bg-blue-700 p-3">
                <div class="flex items-center">
                    <div class="mr-auto text-2xl">
                        Informations utilisateur
                    </div>
                    <i class="fa-solid fa-x cursor-pointer" @click.prevent="closeModal()"></i>
                </div>
            </header>

            <div v-if="inputStore.sendingUser">Loading...</div>
            <div v-if="!inputStore.sendingUser">
                <div class="p-3 flex">
                    <FormInput :disabled="formData.edit_matricule && edit" v-model="formData.matricule" :data="user?.matricule" val="matricule">
                        <div v-if="edit">changer matricule <input type="checkbox" :value="!formData.edit_matricule" :checked="!formData.edit_matricule" @click="toggleField('matricule')" /></div>
                        <div v-if="userStore.addingUserErrors?.matricule && !edit" v-for="error in userStore.addingUserErrors?.matricule" class="text-xs text-red-500">{{ error }}</div>
                        <div v-if="userStore.editingUserErrors?.matricule && edit" v-for="error in userStore.editingUserErrors?.matricule" class="text-xs text-red-500">{{ error }}</div>
                    </FormInput>
                    <FormInput :disabled="formData.edit_email && edit" v-model="formData.email_1" :data="user?.email_1" val="e-mail">
                        <div v-if="edit">changer email <input type="checkbox" :value="!formData.edit_email" :checked="!formData.edit_email" @click="toggleField('email1')" /></div>
                        <div v-if="userStore.addingUserErrors?.email_1 && !edit" v-for="error in userStore.addingUserErrors?.email_1" class="text-xs text-red-500">{{ error }}</div>
                        <div v-if="userStore.editingUserErrors?.email_1 && edit" v-for="error in userStore.editingUserErrors?.email_1" class="text-xs text-red-500">{{ error }}</div>
                    </FormInput>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.nom" :data="user?.first_name" val="nom">
                        <div v-if="userStore.addingUserErrors?.nom && !edit" v-for="error in userStore.addingUserErrors?.nom" class="text-xs text-red-500">{{ error }}</div>
                    </FormInput>
                    <FormInput v-model="formData.prenom" :data="user?.last_name" val="prenom">
                        <div v-if="userStore.addingUserErrors?.prenom && !edit" v-for="error in userStore.addingUserErrors?.prenom" class="text-xs text-red-500">{{ error }}</div>
                    </FormInput>
                </div>

                <div class="p-3 flex">
                    <div class="w-1/2 flex items-center mx-3">
                        <RadioInput v-model="formData.sexe" :data="user?.Sexe" val="sexe_homme"/>
                        <RadioInput v-model="formData.sexe" :data="user?.Sexe" val="sexe_femme"/>
                    </div>
                    <FormInput v-model="formData.date_mep" val="date mep"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.langue_principale" :data="user?.primary_language?.name" type="select"
                               val="principal language"/>
                    <FormInput v-model="formData.date_entree_formation" :data="user?.date_entree_formation"
                               val="date début formation"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.cin_number" :data="cinNumber" val="identity number CIN"/>
                    <FormInput v-model="formData.passport_number" :data="passportNumber"
                               val="identity number Passport"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.carte_sejour_number" :data="carteSejourNumber"
                               val="identity number Carte sèjour"/>
                    <FormInput v-model="formData.nationalite" :data="user?.nationality?.name" type="select"
                               val="nationalities"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.date_naissance" :data="user?.date_naissance" val="date_naissance"/>
                    <FormInput v-model="formData.sourcing_provider" :data="user?.sourcing_type?.name" :edit="edit" type="select"
                               val="fournisseur"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.situation_familiale" :data="user?.family_situation?.name"
                               val="situation familiale" type="select"/>
                    <FormInput v-model="formData.photo" :data="user?.photo" val="photo"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.phone_1" :data="user?.phone_1" val="téléphone 1"/>
                    <FormInput v-model="formData.nombre_enfants" :data="user?.nombre_enfants" val="nombre enfants"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.phone_2" :data="user?.phone_2" val="téléphone 2"/>
                    <FormInput v-model="formData.cnss_number" :data="user?.cnss_number" val="Numéro CNSS"/>
                </div>

                <div v-if="edit" class="p-3 flex">
                    <FormInput v-model="formData.solde_cp" :data="Number(user?.solde_cp)" val="solde_cp" />
                    <FormInput v-model="formData.solde_rjf" :data="Number(user?.solde_rjf)" val="solde_rjf" />
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.comment" :data="user?.comment?.comment" val="comment"/>
                    <FormInput v-model="formData.address" :data="user?.address" val="address"/>
                </div>

            </div>

            <footer class="flex mx-6 my-3 bg-gray-200 p-3" v-if="!inputStore.sendingUser">
                <button class="mr-auto text-black bg-gray-100 p-2 rounded-md" @click.prevent="$emit('close')">Cancel
                </button>
                <button class="bg-cyan-500 text-white p-2 rounded-md"
                        @click.prevent="edit ? updateUser() :sendFormDataToBackend()">Valider
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
