<script setup>
import {useTeamStore} from "~/stores/TeamStore.js";
import {useProfilesStore} from "~/stores/ProfilesStore.js";
import {useLanguagesStore} from "~/stores/LanguagesStore.js";

const props = defineProps({
  elements: Object,
  val: String,
})

let teamStore = useTeamStore()
let profilesStore = useProfilesStore()
let languageStore = useLanguagesStore()

const removeItem = (data, type) => {
  switch (type) {
    case 'team':
      teamStore.removeTeam(data)
      break;
    case 'profile':
      profilesStore.removeProfile(data)
      break;
    case 'language':
      languageStore.removeLanguage(data)
      break;
  }
}

</script>

<template>
  <div v-for="element in elements"
       class="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-teal-700 bg-teal-100 border border-teal-300">
    <div class="text-xs font-normal leading-none max-w-full flex-initial">{{ element }}</div>
    <div class="flex flex-auto flex-row-reverse cursor-pointer" @click="removeItem(element, val)">
      <i class="fa-solid fa-x text-xs ml-2"></i>
    </div>
  </div>
</template>
