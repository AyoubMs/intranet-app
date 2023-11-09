<script setup>

const props = defineProps({
    links: Object
})
console.log(props.links)

</script>

<template>
  <div class="flex justify-end mt-3 mx-auto">
    <div v-for="(link, index) in links"
         class="border w-6 text-center"
         :class="{
                '!bg-cyan-500 !text-white': link?.active,
                'hover:bg-cyan-500 hover:text-white cursor-pointer': link?.url && !link?.active,
                }"
         @click="$emit('fetching', link)">
      <div v-if="index === 0"><i class="fa-solid fa-chevron-left"></i></div>
      <div v-else-if="index > 0 && Number(link?.label)">{{ link?.label }}</div>
      <div v-else-if="link?.label === '...'">...</div>
      <div v-else-if="!Number(link?.label) && link?.label !== '...'"><i
          class="fa-solid fa-chevron-right"></i></div>
    </div>
  </div>
</template>
