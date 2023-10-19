<script setup>
import {useInputStore} from "~/stores/InputStore.js";
import {useLanguagesStore} from "~/stores/LanguagesStore.js";

const props = defineProps({
    val: String,
    modelValue: String,
    type: String,
    errors: Object,
    data: String
})

const {$apiFetch} = useNuxtApp()

const inputStore = useInputStore()
const languageStore = useLanguagesStore()
const emits = defineEmits(['update:modelValue'])

onMounted(async () => {
    if (props.val.includes('identity')) {
        await inputStore.fetchIdentityTypes($apiFetch)
        emits('update:modelValue', inputStore.identityTypes[0]);
    } else if (props.val.includes('language')) {
        await languageStore.fetchLanguages($apiFetch, '')
        emits('update:modelValue', languageStore.languages[0])
    } else if (props.val.includes('sourcing')) {
        await inputStore.fetchSourcingTypes($apiFetch)
        emits('update:modelValue', inputStore.sourcingTypes[0])
    } else if (props.val.includes('nationalities')) {
        await inputStore.fetchNationalities($apiFetch)
        emits('update:modelValue', inputStore.nationalities[0]);
    } else if (props.val.includes('fournisseur')) {
        await inputStore.fetchSourcingProviders($apiFetch)
        emits('update:modelValue', inputStore.sourcingProviders[0]);
    } else if (props.val.includes('situation familiale')) {
        await inputStore.fetchFamilySituations($apiFetch)
        emits('update:modelValue', inputStore.familySituations[0])
    }

    emits('update:modelValue', props.data)
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
    return item;
}

const getType = (val) => {
    if (val.includes('nombre enfants') || val.includes('Numéro CNSS') || val.includes('téléphone')) {
        return 'number';
    } else if (val.includes('date')) {
        return 'date';
    } else {
        return 'text'
    }
}

</script>

<template>
    <div class="w-1/2 mx-3" :class="{'mx-6': val.includes('comment'), 'mx-3': !val.includes('comment')}">
        <label class="block mb-2 font-bold capitalize text-xs text-gray-700"
               :for="val"
        >
            {{ val }}
        </label>
        <div v-if="errors && !modelValue" v-for="error in errors" class="text-xs text-red-500">{{ error }}</div>
        <input v-if="type !== 'select' && !val.includes('address') && !val.includes('comment')"
               class="rounded-md border border-gray-400 p-2 w-full"
               :type="getType(val)"
               :name="val"
               :id="val"
               :value="modelValue"
               @input="$emit('update:modelValue', $event.target.value)"
               required
        />
        <textarea v-if="val.includes('address') || val.includes('comment')"
                  class="w-full border border-black p-1 rounded-md"
                  @input="$emit('update:modelValue', $event.target.value)" :value="modelValue"></textarea>
        <select class="border w-full p-2 border-black rounded-md" v-if="type === 'select'"
                @change="$emit('update:modelValue', $event.target.value)" :value="modelValue">
            <option v-for="item in getItems(val)">{{ getItemOption(item, val) }}</option>
        </select>
    </div>
</template>
