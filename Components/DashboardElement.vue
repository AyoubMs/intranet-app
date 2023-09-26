<template>
  <div class="bg-white w-[24rem] mr-2 flex rounded-md">
    <div :class=[classElem] class="my-4 mx-3 w-1/6 h-[4rem] rounded-md text-center flex items-center justify-center">
        <slot name="icon"></slot>
    </div>
    <div class="mt-4">
      <div>
          <slot name="type"></slot>
      </div>
      <div class="text-xs">
          <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
    classElem: String
})
</script>
