<template>
    <div class="mx-2 flex mb-2 py-2 px-2 cursor-pointer font-bold text-gray-700 hover:text-white hover:bg-cyan-700">
        <div class="mr-4">
            <slot name="icon"></slot>
        </div>
        <div class="mr-auto">
            <slot></slot>
        </div>
        <div>
            <slot name="chevron"></slot>
        </div>
    </div>
</template>
<script setup>
const emit = defineEmits(['click'])
</script>
