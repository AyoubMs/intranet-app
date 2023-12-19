<script setup lang="ts">

import Cookies from "js-cookie"
import {definePageMeta} from "#imports";

const {$apiFetch}: any = useNuxtApp()

async function csrf() {
  return await $apiFetch('/sanctum/csrf-cookie').catch((err: any) => console.log(err))
}

let uuid: any | null = ref(null)

onMounted(async () => {
  if (!uuid.value) {
    await csrf();
    uuid.value = await getUUID()
  }
})

async function getUUID() {
  if (process.client) {
    return localStorage.getItem('uuid')
  }
}

// async function login() {
//     await csrf();
//     if (process.client) {
//         await navigateTo(`https://intranet.test/auth/redirect?token=${localStorage.getItem('uuid')}`, {
//             external: true,
//         })
//     }
// }

</script>

<template>
  <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 min-w-[30rem]">
    <div>
      <img src="~/assets/images/logo.png" class="w-[28rem]"/>
    </div>

    <div class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
      <div class="text-center">
        Authentification
      </div>

      <form>
        <div class="text-center mt-6">
          <NuxtLink v-if="uuid"
                    class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    :to="`https://intranet.test/auth/redirect?token=${uuid}`">Go to Azure
          </NuxtLink>
          <!--                    <button class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition ease-in-out duration-150" @click.prevent="login">Log In Azure</button>-->
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>
