<script setup>
import {useSoldeInputStore} from "~/stores/SoldeInputStore.js";
import {useLanguagesStore} from "~/stores/LanguagesStore.js";
import {useProfilesStore} from "~/stores/ProfilesStore.js";

const props = defineProps({
    val: String,
    modelValue: String,
    type: String,
    data: String | Number,
    edit: Boolean,
    deactivation: Boolean,
    disabled: Boolean,
    min: Date
})

const {$apiFetch} = useNuxtApp()

const inputStore = useSoldeInputStore()
const languageStore = useLanguagesStore()
const profileStore = useProfilesStore()
const emits = defineEmits(['update:modelValue'])

onMounted(async () => {
    if (props.val?.includes('type départ')) {
        await inputStore.fetchMotifs($apiFetch)
    } else if (props.val?.includes('operation')) {
        await inputStore.fetchOperations($apiFetch)
    } else if (props.val?.includes('language')) {
        await languageStore.fetchLanguages($apiFetch, '')
        emits('update:modelValue', languageStore.languages[0])
    } else if (props.val?.includes('nationalities')) {
        await inputStore.fetchNationalities($apiFetch)
        emits('update:modelValue', inputStore.nationalities[0]);
    } else if (props.val?.includes('fournisseur')) {
        await inputStore.fetchSourcingProviders($apiFetch)
        emits('update:modelValue', inputStore.sourcingProviders[0].split(' ').filter(data => data !== '').join(' '));
    } else if (props.val?.includes('situation familiale')) {
        await inputStore.fetchFamilySituations($apiFetch)
        emits('update:modelValue', inputStore.familySituations[0])
    } else if (props.val?.includes('profile')) {
        await profileStore.fetchProfiles($apiFetch)
        emits('update:modelValue', profileStore.profiles.filter(data => data?.includes('Conseiller'))[0])
    }
    if (props.data || props.edit) {
        emits('update:modelValue', props.data)
    }
})

const getItems = (type) => {
    if (type?.includes('identity')) {
        return inputStore.identityTypes;
    } else if (type?.includes('language')) {
        return languageStore.languages;
    } else if (type?.includes('sourcing')) {
        return inputStore.sourcingTypes;
    } else if (type?.includes('nationalities')) {
        return inputStore.nationalities;
    } else if (type?.includes('fournisseur')) {
        return inputStore.sourcingProviders;
    } else if (type?.includes('situation familiale')) {
        return inputStore.familySituations;
    } else if (type?.includes('profile')) {
        return profileStore.profiles;
    } else if (type?.includes('operation')) {
        console.log(inputStore.operations)
        return inputStore.operations;
    } else if (type?.includes('type départ')) {
        return inputStore.motifs;
    }
}

const getItemOption = (item) => {
    return item;
}

const getType = (val) => {
    if (val?.includes('nombre enfants') || val?.includes('Numéro CNSS') || val?.includes('téléphone') || val?.includes('matricule')) {
        return 'number';
    } else if (val?.includes('date')) {
        return 'date';
    } else {
        return 'text'
    }
}

let imageData = ref(null)

const onInput = async (event) => {
    emits('update:modelValue', event.target.value);
}

const onChangeFile = async (event) => {
    let fd = new FormData();
    fd.append('file', event.target.files[0], event.target.files[0]?.name)
    console.log(...fd)
    inputStore.refreshInjectionErrors()
    await inputStore.sendInjectionSoldeFile($apiFetch, fd)
}

</script>

<template>
    <div class="mx-3"
         :class="{'mx-6': val?.includes('comment') && !deactivation, 'my-3': deactivation, 'w-1/2': !deactivation && val !== 'solde', 'w-1/6 mb-3': type?.includes('demandesConges'), 'w-3/4 mx-auto my-4': val=== 'solde'}">
        <div v-if="!val !== 'solde'" class="block mb-[1rem] font-bold capitalize text-xs text-gray-700">
            {{ val.split('_')[0] }} {{ val.split('_')[1] }}
        </div>
        <slot></slot>
        <input v-if="val === 'solde'" type="file" :disabled="disabled === undefined ? false : disabled"
               @change="(event) => onChangeFile(event)" />
        <input
            v-if="type !== 'select' && !val?.includes('address') && !val?.includes('comment') && val !== 'solde'"
            class="rounded-md border border-gray-400 p-2 w-full"
            :type="getType(val)"
            :name="val"
            :id="val"
            :min="min"
            :value="modelValue"
            :disabled="disabled === undefined ? false : disabled"
            @input="(event) => onInput(event)"
            required
        />
        <textarea v-if="val?.includes('address') || val?.includes('comment')"
                  class="w-full border border-black p-1 rounded-md"
                  @input="$emit('update:modelValue', $event.target.value)" :value="modelValue"></textarea>
        <select class="border w-full p-2 border-black rounded-md" v-if="type === 'select'" :value="modelValue"
                @change="$emit('update:modelValue', $event.target.value)">
            <option v-for="item in getItems(val)">{{ getItemOption(item) }}</option>
        </select>
    </div>
</template>
