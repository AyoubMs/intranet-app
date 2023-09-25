<script setup lang="ts">

import {useAuth} from "~/composables/useAuth";
import Cookies from "js-cookie";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const {$apiFetch}: any = useNuxtApp()

const user = ref(null)
// const headers = Headers()

const {removeUser, setUser} = useAuth()

const route = useRoute()

onMounted(async () => {
  if (route.path !== '/') {
    await $apiFetch('/user').then((data: any) => {
      setUser(data);
      console.log("here")
      user.value = data;
    }).catch((err: any) => console.log(err))
  }
})

async function logout() {
  try {
    await $apiFetch('/logout', {
      method: 'POST'
    })
  } catch (err: any) {
    console.log(err)
  } finally {
    removeUser();
    Cookies.remove('XSRF-TOKEN');
    window.location.pathname = '/'
  }
}

console.log(user)

</script>

<template>
  <div class="bg-gray-100 w-screen" :class="{'flex': $route.path !== '/'}">
    <nav class="border-r w-1/6 h-screen bg-white flex" v-if="$route.path !== '/'">
      <div>
        <div class="border-b">
          <NuxtLink to="/dashboard"><img src="~/assets/images/logo.png" class="my-4 mr-auto w-[18rem]"/>
          </NuxtLink>
        </div>
        <div class="border-b">
          <div class="my-4 flex ml-6 items-center">
            <div>
              <img class="rounded-full object-cover border mr-4"
                   style="max-width: 30px !important; height: 30px !important;"
                   src="~/assets/images/logo.png"
                   alt=""/>
            </div>
            <div>
              {{ JSON.parse(user)?.name }}
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="flex-col w-screen justify-center items-center bg-gray-100 min-h-screen text-gray-900">
      <div class="bg-white w-full flex pr-10 pl-4">
        <div class="mr-auto"><font-awesome-icon icon="bars" /></div>
        <div class="cursor-pointer" @click.prevent="logout">Logout</div>
      </div>
      <slot/>
    </div>
  </div>
</template>

<style scoped>

</style>
