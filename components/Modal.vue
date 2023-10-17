<script setup lang="ts">
import FormInput from "~/components/FormInput.vue";
import {useInputStore} from "~/stores/InputStore";

const props = defineProps({
    show: Boolean
})

let inputStore = useInputStore()

let formData = ref({
    matricule: '',
    email_1: '',
    nom: '',
    email_2: '',
    prenom: '',
    date_mep: '',
    sexe: '',
    date_entree_formation: '',
    type_identite: 'CIN',
    num_identite: '',
    langue_principale: '',
    nationalite: 'Afghane',
    date_naissance: '',
    sourcing_type: 'Sourcing gratuit',
    sourcing_provider: 'AARRAS Fouad',
    situation_familiale: 'Célibataire',
    phone_1: '',
    photo: '',
    phone_2: '',
    nombre_enfants: '',
    nv_solde_rjf: '',
    nv_solde_cp: '',
    cnss_number: '',
    address: '',
    comment: ''
})

onMounted(() => {
    console.log(formData.value)
})

watch(formData, () => {
    console.log(formData.value)
}, { deep: true })

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

        <div class="p-3 flex">
            <FormInput v-model="formData.matricule" val="matricule"/>
            <FormInput v-model="formData.email_1" val="e-mail 1"/>
        </div>

        <div class="p-3 flex">
            <FormInput v-model="formData.nom" val="nom"/>
            <FormInput v-model="formData.email_2" val="e-mail 2"/>
        </div>

        <div class="p-3 flex">
            <FormInput v-model="formData.prenom" val="prenom"/>
            <FormInput v-model="formData.date_mep" val="date mep"/>
        </div>

        <div class="p-3 flex">
            <div class="w-1/2 flex items-center mx-3">
                <RadioInput v-model="formData.sexe" val="sexe_homme" />
                <RadioInput v-model="formData.sexe" val="sexe_femme" />
            </div>
            <FormInput v-model="formData.date_entree_formation" val="date début formation"/>
        </div>

        <div class="p-3 flex">
            <FormInput v-model="formData.type_identite" type="select" val="identity type"/>
            <FormInput v-model="formData.langue_principale" type="select" val="principal language"/>
        </div>

        <div class="p-3 flex">
            <FormInput v-model="formData.num_identite" val="identity number"/>
            <FormInput v-model="formData.sourcing_type" type="select" val="type sourcing"/>
        </div>

        <div class="p-3 flex">
            <FormInput v-model="formData.nationalite" type="select" val="nationalities"/>
            <FormInput v-model="formData.sourcing_provider" type="select" val="fournisseur"/>
        </div>

        <div class="p-3 flex">
            <FormInput v-model="formData.date_naissance" val="date_naissance"/>
            <FormInput v-model="formData.photo" val="photo"/>
        </div>

        <div class="p-3 flex">
            <FormInput v-model="formData.situation_familiale" val="situation familiale" type="select"/>
            <FormInput v-model="formData.photo" val="nombre enfants"/>
        </div>

        <div class="p-3 flex">
            <FormInput v-model="formData.phone_1" val="téléphone 1" />
            <FormInput v-model="formData.cnss_number" val="Numéro CNSS"/>
        </div>

        <div class="p-3 flex">
            <FormInput v-model="formData.phone_2" val="téléphone 2" />
            <FormInput v-model="formData.address" val="address"/>
        </div>
        <FormInput v-model="formData.comment" val="comment" />

        <footer class="flex mx-6 my-3 bg-gray-200 p-3">
            <button class="mr-auto text-black bg-gray-100 p-2 rounded-md" @click.prevent="$emit('close')">Cancel</button>
            <button class="bg-cyan-500 text-white p-2 rounded-md">Valider</button>
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
