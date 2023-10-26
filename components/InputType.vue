<script setup>
import DropdownElement from "~/components/DropdownElement.vue";
import {useTeamStore} from "~/stores/TeamStore.js";
import {useProfilesStore} from "~/stores/ProfilesStore.js";
import {useLanguagesStore} from "~/stores/LanguagesStore.js";
import {useInputStore} from "~/stores/InputStore.js";
import {debounce, forEach} from "lodash";
import {useUserStore} from "~/stores/UserStore.js";

const props = defineProps({
  title: String,
  val: String,
  type: String,
  affectation: Boolean,
  user: Object
})

const {$apiFetch} = useNuxtApp()

let openDropDown = ref(false);

let teamStore = useTeamStore()

let profilesStore = useProfilesStore()

let languageStore = useLanguagesStore()

onMounted(async () => {
  switch (props.val) {
    case 'team':
      await teamStore.fetchTeams($apiFetch, inputStore.status, '', props.affectation).catch(err => console.log(err))
        props.user?.managers?.forEach((item) => {
          item?.operations?.forEach((operation) => {
            if (!teamStore.selectedAffectationTeams.includes(operation?.name)) {
              teamStore.selectAffectationTeam(operation?.name);
            }
          })
          item?.operations?.forEach((operation) => {
            const team = `${operation?.name} / ${item?.first_name} ${item?.last_name} / ${item?.team_type ? item?.team_type?.name : 'Customer Service'}`;
            console.log(teamStore.selectedAffectationTeams)
            if (!teamStore.selectedAffectationTeams.includes(team)) {
              teamStore.selectAffectationTeam(team)
            }
          })
        })
      console.log(props.user);
      break;
    case 'profile':
      await profilesStore.fetchProfiles($apiFetch).catch(err => console.log(err))
      break;
    case 'language':
      await languageStore.fetchLanguages($apiFetch, '').catch(err => console.log(err))
      break;
  }
})


let getTag = (tag, type) => {
  switch (type) {
    case 'team':
      return tag?.operation;
    case 'profile':
      return tag;
    case 'language':
      return tag;
  }
}

let getDropDownElements = (type) => {
  switch (type) {
    case 'team':
      if (!props.affectation) {
        return teamStore.selectedTeams;
      } else if (props.affectation) {
        return teamStore.selectedAffectationTeams;
      }
      break;
    case 'profile':
      return profilesStore.selectedProfiles;
    case 'language':
      return languageStore.selectedLanguages;
  }
}

let selectSingleItem = (input, type) => {
  switch (type) {
    case 'team':
      switch (typeof (input?.operation)) {
        case 'string':
          if (!teamStore.selectedTeams.includes(input.operation) && !props.affectation) {
            teamStore.selectTeam(input.operation);
          } else if (!teamStore.selectedAffectationTeams.includes(input.operation) && props.affectation) {
            teamStore.selectAffectationTeam(input.operation);
          }
          break;
        case 'undefined':
          if (!teamStore.selectedTeams.includes(input.join('')) && !props.affectation) {
            teamStore.selectTeam(input.join(''))
          } else if (!teamStore.selectedTeams.includes(input.join('')) && props.affectation) {
            teamStore.selectAffectationTeam(input.join(''))
          }
          break;
      }
      break;
    case 'profile':
      if (!profilesStore.selectedProfiles.includes(input)) {
        profilesStore.selectProfile(input)
      }
      break;
    case 'language':
      if (!languageStore.selectedLanguages.includes(input)) {
        languageStore.selectLanguage(input)
      }
      break;
  }
}

let inputStore = useInputStore();

watch(inputStore, async function () {
  if (props.val === 'team') {
    await teamStore.fetchTeams($apiFetch, inputStore.status, '', props.affectation)
  }
}, {deep: true})

let searchInput = ref(null)

watch(searchInput, function () {
  searchDropDown()
}, {deep: true})

const closeDropDown = () => {
  setTimeout(() => {
    openDropDown.value = false;
  }, 500)
}

let controlWithSearch = ref(true)

const searchDropDown = () => {
  debounce(async () => {
    controlWithSearch.value = false
    switch (props.val) {
      case 'team':
        await teamStore.fetchTeams($apiFetch, inputStore.status, searchInput.value, props.affectation)
        break;
      case 'profile':
        await profilesStore.fetchProfiles($apiFetch, searchInput.value)
        break;
      case 'language':
        await languageStore.fetchLanguages($apiFetch, searchInput.value)
        break;
    }
    controlWithSearch.value = true
  }, 1000)()
}

const getLoadingState = (type) => {
  if (type === 'team') {
    return !inputStore.loadingTeams;
  } else {
    return true;
  }
}

const getDataByVal = (val) => {
  switch (val) {
    case 'team':
      if (props.affectation) {
        return teamStore.affectationTeams;
      } else {
        return teamStore.teams
      }
    case 'profile':
      return profilesStore.profiles;
    case 'language':
      return languageStore.languages
  }
}

</script>

<template>
  <div class="mb-6 w-1/2 mx-2">
    <div class="block mb-2 uppercase font-bold text-xs text-gray-700">
      {{ title }}
    </div>
    <input v-if="type === 'date' && val === 'date_mep_debut'" class="border border-gray-400 p-2 w-full"
           :type="type"
           :name="val"
           :id="val"
           v-model="inputStore.dateDebut"
           required
    />
    <input v-if="type === 'date' && val === 'date_mep_fin'" class="border border-gray-400 p-2 w-full"
           :type="type"
           :name="val"
           :id="val"
           v-model="inputStore.dateFin"
           required
    />
    <div v-if="!getDataByVal(val) && type !== 'date'">Loading...</div>
    <div class="w-full flex flex-col items-center mx-auto justify-end"
         v-if="getDataByVal(val) && type !== 'date' ">
      <div class="!w-full">
        <div class="w-full svelte-1l8159u">
          <div class="my-2 p-1 flex border border-gray-200 bg-white rounded svelte-1l8159u">
            <div class="flex flex-auto flex-wrap">
              <DropdownElement :elements="getDropDownElements(val)" :val="val" :affectation="affectation"/>
              <div class="flex-1">
                <input :type="type" :name="val" :id="val"
                       class="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800 rounded !border-transparent !ring-transparent"
                       @click="openDropDown = true" @focusout="closeDropDown()" v-model="searchInput">
              </div>
            </div>
            <div
                class="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200 svelte-1l8159u"
                @click="openDropDown = !openDropDown">
              <button class="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none">
                <i class="fa-solid fa-chevron-up text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="shadow bg-white z-40 h-40 w-full lef-0 rounded max-h-select overflow-y-auto svelte-5uyqqj"
           v-if="openDropDown">
        <div v-if="!controlWithSearch">Loading...</div>
        <div v-if="inputStore.loadingTeams && val === 'team'">Loading...</div>
        <div class="flex flex-col w-full" v-if="controlWithSearch && getLoadingState(val)">
          <div v-for="(item, index) in getDataByVal(val)" :key="index"
               class="w-full border-gray-100 rounded-t border-b">
            <div class="w-full items-center flex">
              <div :class="{'font-bold uppercase': val==='team'}"
                   class="hover:bg-teal-100 cursor-pointer mx-2 leading-6"
                   @click="selectSingleItem(item, val)">{{ getTag(item, val) }}
              </div>
            </div>
            <div v-if="val === 'team'" v-for="user in item?.users"
                 class="hover:bg-teal-100 cursor-pointer w-full items-center flex"
                 @click="selectSingleItem([item?.operation, ` / ${user?.first_name} ${user?.last_name} ${user?.team_type !== null ? `/ ${user?.team_type?.name}` : '/ Customer Service'}`], 'team')">
              <div class="mx-2 leading-6">{{ item?.operation }} / {{ user?.first_name }}
                {{ user?.last_name }} <span
                    v-if="user?.team_type !== null"> / {{ user?.team_type?.name }}</span><span
                    v-else> / Customer Service</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
