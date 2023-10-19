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
    matricule: null,
    email_1: null,
    nom: null,
    email_2: null,
    prenom: null,
    date_mep: null,
    sexe: null,
    date_entree_formation: null,
    type_identite: null,
    num_identite: null,
    langue_principale: null,
    nationalite: null,
    date_naissance: null,
    sourcing_type: null,
    sourcing_provider: null,
    situation_familiale: null,
    phone_1: null,
    photo: null,
    phone_2: null,
    nombre_enfants: null,
    cnss_number: null,
    address: null,
    comment: null,
})

onMounted(() => {

    console.log(props.user)
})

watch(formData, () => {
    console.log(formData.value)
}, {deep: true})

const emit = defineEmits(["close"]);

const sendFormDataToBackend = async () => {
    inputStore.beginSendingUserData()
    await userStore.addUser($apiFetch, formData.value).then(() => {
        inputStore.finishSendingUserData();
        if (!Object.entries(userStore.addingUserErrors).length) {
            emit('close');
        }
    }).catch(err => {
        console.log(err)
    })
}

const updateUser = () => {
}

</script>

<template>
    <div v-if="show" class="modal-mask overflow-y-auto">
        <div class="modal-container">
            <header class="text-white bg-blue-300 p-3">
                <div class="flex items-center">
                    <div class="mr-auto text-2xl">
                        Informations utilisateur
                    </div>
                    <i class="fa-solid fa-x cursor-pointer" @click.prevent="$emit('close')"></i>
                </div>
            </header>

            <div v-if="inputStore.sendingUser">Loading...</div>
            <div v-if="!inputStore.sendingUser">
                <div class="p-3 flex">
                    <FormInput v-model="formData.matricule" :data="user?.matricule"
                               :errors="userStore.addingUserErrors?.matricule" val="matricule"/>
                    <FormInput v-model="formData.email_1" :data="user?.email_1"
                               :errors="userStore.addingUserErrors?.email_1" val="e-mail 1"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.nom" :data="user?.first_name" :errors="userStore.addingUserErrors?.nom"
                               val="nom"/>
                    <FormInput v-model="formData.email_2" :data="user?.email_2" val="e-mail 2"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.prenom" :data="user?.last_name"
                               :errors="userStore.addingUserErrors?.prenom" val="prenom"/>
                    <FormInput v-model="formData.date_mep" val="date mep"/>
                </div>

                <div class="p-3 flex">
                    <div class="w-1/2 flex items-center mx-3">
                        <RadioInput v-model="formData.sexe" :data="user?.Sexe" val="sexe_homme"/>
                        <RadioInput v-model="formData.sexe" :data="user?.Sexe" val="sexe_femme"/>
                    </div>
                    <FormInput v-model="formData.date_entree_formation" :data="user?.date_entree_formation"
                               val="date début formation"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.langue_principale" :data="user?.primary_language?.name" type="select"
                               val="principal language"/>
                    <FormInput v-model="formData.num_identite" :data="user?.identity_num" val="identity number CIN"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.langue_principale" :data="user?.primary_language?.name"
                               val="identity number Passport"/>
                    <FormInput v-model="formData.num_identite" :data="user?.identity_num"
                               val="identity number Carte sèjour"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.nationalite" :data="user?.nationality?.name" type="select"
                               val="nationalities"/>
                    <FormInput v-model="formData.sourcing_provider" :data="user?.sourcing_type?.name" type="select"
                               val="fournisseur"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.date_naissance" :data="user?.date_naissance" val="date_naissance"/>
                    <FormInput v-model="formData.photo" :data="user?.photo" val="photo"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.situation_familiale" :data="user?.family_situation?.name"
                               val="situation familiale" type="select"/>
                    <FormInput v-model="formData.nombre_enfants" :data="user?.nombre_enfants" val="nombre enfants"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.phone_1" :data="user?.phone_1" val="téléphone 1"/>
                    <FormInput v-model="formData.cnss_number" :data="user?.cnss_number" val="Numéro CNSS"/>
                </div>

                <div class="p-3 flex">
                    <FormInput v-model="formData.phone_2" :data="user?.phone_2" val="téléphone 2"/>
                    <FormInput v-model="formData.address" :data="user?.address" val="address"/>
                </div>

                <FormInput v-model="formData.comment" :data="user?.comment?.comment" val="comment"/>
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
