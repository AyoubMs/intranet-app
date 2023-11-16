<template>
  <button :class="[classes, {'!bg-gray-300': disabled}]"
      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150" :disabled="disabled">
    <i :class="[iconClass]" class="mr-2"></i>
    <slot></slot>
  </button>
</template>
<script setup>
let props = defineProps({
    iconClass: String,
    classes: String,
    disabled: Boolean
})
</script>
