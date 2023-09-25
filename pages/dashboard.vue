<script setup lang="ts">
import {definePageMeta} from "#imports";

definePageMeta({
    middleware: ["auth"]
})

</script>

<template>
  <Title>Dashboard</Title>
Hello from dashboard
</template>

<style scoped>

</style>
