<script setup>
import {useInputStore} from "~/stores/InputStore.js";
import {useLanguagesStore} from "~/stores/LanguagesStore.js";

const props = defineProps({
    val: String,
    modelValue: String,
    type: String,
})

const {$apiFetch} = useNuxtApp()

const inputStore = useInputStore()
const languageStore = useLanguagesStore()

onMounted(async () => {
    inputStore.loadFormData();
    await inputStore.fetchIdentityTypes($apiFetch)
    await languageStore.fetchLanguages($apiFetch, '')
    await inputStore.fetchSourcingTypes($apiFetch)
    await inputStore.fetchNationalities($apiFetch)
    await inputStore.fetchSourcingProviders($apiFetch)
    await inputStore.fetchFamilySituations($apiFetch)
    inputStore.finishLoadingFormData();
    console.log(inputStore.familySituations)
})

const getItems = (type) => {
    if (type.includes('identity')) {
        return inputStore.identityTypes;
    } else if (type.includes('language')) {
        return languageStore.languages;
    } else if (type.includes('sourcing')) {
        return inputStore.sourcingTypes;
    } else if (type.includes('nationalities')) {
        return inputStore.nationalities;
    } else if (type.includes('fournisseur')) {
        return inputStore.sourcingProviders;
    } else if (type.includes('situation familiale')) {
        return inputStore.familySituations;
    }
}

const getItemOption = (item, type) => {
    if (type.includes('identity')) {
        return item?.name;
    } else {
        return item;
    }
}

const getLoadingState = (val) => {
    return inputStore.loadingForm;
}

</script>

<template>
    <div class="w-1/2 mx-3">
        <label class="block mb-2 font-bold capitalize text-xs text-gray-700"
               :for="val"
        >
            {{ val }}
        </label>
        <input v-if="!val.includes('date') && type !== 'select' && !val.includes('address') && !val.includes('comment')" class="rounded-md border border-gray-400 p-2 w-full"
               type="text"
               :name="val"
               :id="val"
               @input="$emit('update:modelValue', $event.target.value)"
               required
        />
        <textarea v-if="val.includes('address') || val.includes('comment')" class="w-full border border-black p-1 rounded-md" @input="$emit('update:modelValue', $event.target.value)"></textarea>
        <input v-if="val.includes('date') && type !== 'select'" class="border border-gray-400 p-2 w-full rounded-md"
               type="date"
               :name="val"
               :id="val"
               @input="$emit('update:modelValue', $event.target.value)"
               required
        />
        <select class="border w-full p-2 border-black rounded-md" v-if="!getLoadingState(val) && type === 'select'" @change="$emit('update:modelValue', $event.target.value)">
            <option v-for="item in getItems(val)">{{ getItemOption(item, val) }}</option>
        </select>
        <div v-if="getLoadingState(val) && type === 'select'">Loading...</div>
    </div>
</template>
