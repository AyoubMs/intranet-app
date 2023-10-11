<script setup>
import {useInputStore} from "~/stores/InputStore.js";
import {useTeamStore} from "~/stores/TeamStore.js";
import {useLanguagesStore} from "~/stores/LanguagesStore.js";
import {useProfilesStore} from "~/stores/ProfilesStore.js";

const props = defineProps({
  title: String,
  val: String,
})

const {$apiFetch} = useNuxtApp()

let inputStore = useInputStore()
let teamStore = useTeamStore()
let languageStore = useLanguagesStore()
let profileStore = useProfilesStore()

let selectStatus = async (val) => {
  inputStore.assignStatus(val);
}
</script>

<template>
  <div class="flex mx-2">
    <input class="border border-gray-400 p-2 mx-1"
           type="radio"
           :name="val"
           :id="val"
           @click="selectStatus(val)"
           :checked="inputStore.status === val"
           required
    />
      {{ title }}
  </div>
</template>
