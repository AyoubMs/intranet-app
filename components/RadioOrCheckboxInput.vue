<script setup>
import {useSoldeInputStore} from "~/stores/SoldeInputStore.js";
import {useTeamStore} from "~/stores/TeamStore.js";
import {useLanguagesStore} from "~/stores/LanguagesStore.js";
import {useProfilesStore} from "~/stores/ProfilesStore.js";

const props = defineProps({
  title: String,
  val: String,
  modelValue: String,
  data: String,
  checkbox: Boolean
})

const {$apiFetch} = useNuxtApp()

let inputStore = useSoldeInputStore()
let teamStore = useTeamStore()

const emits = defineEmits(['update:modelValue'])

onMounted(() => {
  console.log(props.data)
  inputStore.assignSexe(props.data === 'F' ? 'femme' : 'homme')
  emits('update:modelValue', inputStore.sexe)
})

const selectStatus = async (val) => {
  inputStore.assignStatus(val);
  inputStore.loadTeamsData();
  await teamStore.fetchTeams($apiFetch, inputStore.status)
  inputStore.finishLoadingTeamsData()
}

const checkSexe = () => {
  let value = props.val.split('_')[1];
  inputStore.assignSexe(value)
  return value;
}

const getType = () => {
  if (props.checkbox) {
    return 'checkbox'
  } else if (!props.checkbox) {
    return 'radio'
  }
}

const getCheckedState = () => {
  if (!props.checkbox) {
    return inputStore.status === props.val
  }
}

</script>

<template>
  <div v-if="!val?.includes('sexe')" class="flex mx-2" :class="{'font-bold': checkbox}">
    <input class="border border-gray-400 p-2 mx-1" :class="{'w-[1rem]': checkbox}"
           :type="getType()"
           :name="val"
           :id="val"
           @click="selectStatus(val)"
           :checked="getCheckedState()"
           required
    />
    {{ title }}
  </div>
  <div v-if="val.includes('sexe')" class="mb-6 flex items-center my-auto mx-auto">
    <input class="border mr-2 border-gray-400 p-2"
           type="radio"
           :name="val"
           :id="val"
           @click="$emit('update:modelValue', checkSexe())"
           :checked="val.includes(inputStore.sexe)"
           required
    />
    <label class="block mb-2 capitalize font-bold text-xs text-gray-700"
           :for="val"
    >
      {{ val.split('_')[1] }}
    </label>
  </div>
</template>
