<script setup>

import {useSoldeInputStore} from "~/stores/SoldeInputStore.js";

const props = defineProps({
    links: Object
})
const emits = defineEmits(['fetching'])
const inputStore = useSoldeInputStore()
console.log(props.links)
const fetchPageWithLink = (link) => {
    emits('fetching', link)
    inputStore.updatePageIndex(link?.label)
}

</script>

<template>
  <div class="flex justify-end mt-3 mx-auto">
    <div v-for="(link, index) in links"
         class="border w-6 text-center"
         :class="{
                '!bg-cyan-500 !text-white': link?.active,
                'hover:bg-cyan-500 hover:text-white cursor-pointer': link?.url && !link?.active,
                }"
         @click="fetchPageWithLink(link)">
      <div v-if="index === 0"><i class="fa-solid fa-chevron-left"></i></div>
      <div v-else-if="index > 0 && parseInt(link?.label)">{{ link?.label }}</div>
      <div v-else-if="link?.label === '...'">...</div>
      <div v-else-if="!parseInt(link?.label) && link?.label !== '...'"><i
          class="fa-solid fa-chevron-right"></i></div>
    </div>
  </div>
</template>
