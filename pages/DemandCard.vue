<template>
    <div :class="[classElem, textColor]" class="w-[32.4rem] flex-col">
        <div class="mr-2 flex rounded-md items-center">
            <div>
                <slot name="body"></slot>
            </div>
            <div class="ml-auto mr-4">
                <i :class="[classIcon]" class="text-7xl opacity-30"></i>
            </div>
        </div>
        <div :class="[classFooter, classHover]" class="text-center py-1 cursor-pointer">
            <slot name="footer"></slot>
            <i class="fa-solid fa-circle-right"></i>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    classElem: String,
    classFooter: String,
    textColor: String,
    classHover: String,
    classIcon: String
})
</script>
