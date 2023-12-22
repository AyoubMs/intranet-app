<script setup lang="ts">

import {useAuth} from "~/composables/useAuth";
import Cookies from "js-cookie";
import NavElement from "~/components/NavElement.vue";
import {useUserStore} from "~/stores/UserStore";

const {$apiFetch}: any = useNuxtApp()

let openNav = ref(false)

let user = useUserStore()

const {removeUser, setUser} = useAuth()

const route = useRoute()

onMounted(async () => {
    if (route.path !== '/' && !userStore.user) {
        await user.fetchUser($apiFetch, setUser);
    }
})

async function logout() {
    try {
        await $apiFetch('/logout', {
            method: 'POST',
            body: {user: JSON.stringify(user)}
        })
    } catch (err: any) {
        console.log(err)
    } finally {
        removeUser();
        window.location.pathname = '/'
    }
}

const navRoutes = ref({
    'Tableau de bord': {
        openRoute: false,
        icon: 'fa-solid fa-gauge',
        items: [
            {
                title: 'Suivi des soldes',
                icon: 'fa-solid fa-gauge',
                link: '/soldes'
            },
            {
                title: 'Lectures publications',
                icon:
                    'fa-solid fa-gauge',
                link:
                    '#'
            }
            ,
            {
                title: 'Gérer mes tokens',
                icon:
                    'fa-solid fa-gauge',
                link:
                    '#'
            }
            ,
            {
                title: 'Gestion des Questionnaires',
                icon:
                    'fa-solid fa-gauge',
                link:
                    '#'
            }
        ]
    },
    'Administration': {
        openRoute: false,
        icon: 'fa-regular fa-file',
        items: [
            {
                title: 'Gestion des employés',
                icon: 'fa-solid fa-users',
                link: '#'
            },
            {
                title: 'Jours fériés',
                icon:
                    'fa-regular fa-calendar-xmark',
                link:
                    '#'
            }
            ,
            {
                title: 'Présence jours fériés',
                icon:
                    'fa-solid fa-gauge',
                link:
                    '#'
            }
            ,
            {
                title: "Droits d'accès",
                icon:
                    'fa-solid fa-lock',
                link:
                    '#'
            }
            ,
            {
                title: "Validation des changements de profils",
                icon:
                    'fa-solid fa-address-card',
                link:
                    '#'
            }
        ]
    },
    'Demandes congés': {
        openRoute: false,
        icon: 'fa-solid fa-folder',
        items: [
            {
                title: 'Suivi du solde (CP & RJF)',
                icon: 'fa-solid fa-rotate-left',
                link: '/suiviSolde'
            },
            {
                title: 'Saisie/Suivi des demandes',
                icon:
                    'fa-solid fa-pen-to-square',
                link:
                    '/demandesConges'
            }
            ,
            {
                title: 'Demandes annulées',
                icon:
                    'fa-solid fa-database',
                link:
                    '#'
            }
            ,
            {
                title: 'Demandes recours',
                icon:
                    'fa-solid fa-circle-minus',
                link:
                    '#'
            }
            ,
            {
                title: 'Historique des demandes',
                icon:
                    'fa-solid fa-rotate-left',
                link:
                    '#'
            }
        ]
    },
    'Documents administratif': {
        openRoute: false,
        icon: 'fa-regular fa-newspaper',
        items: [
            {
                title: 'Demandes documents',
                icon: 'fa-regular fa-file',
                link: '#'
            },
            {
                title: 'Traitement des documents',
                icon:
                    'fa-regular fa-square-check',
                link:
                    '#'
            }
        ]
    },
    'NCC awards': {
        openRoute: false,
        icon: 'fa-regular fa-newspaper',
        items: [
            {
                title: 'My NCC awards',
                icon: 'fa-regular fa-file',
                link: '#'
            }
        ]
    },
    'Briefing': {
        openRoute: false,
        icon: 'fa-regular fa-newspaper',
        items: [
            {
                title: 'Mes Briefs',
                icon: 'fa-regular fa-file',
                link: '#'
            }
        ]
    },
    'Documents utiles': {
        openRoute: false,
        icon: 'fa-regular fa-file',
        items: [
            {
                title: 'Documents GDPR',
                icon: 'fa-regular fa-file',
                link: '#'
            },
            {
                title: 'Autres documents',
                icon:
                    'fa-solid fa-clock-rotate-left',
                link:
                    '#'
            }
        ]
    },
    'Trombinoscope': {icon: 'fa-solid fa-users'},
    'Paramètres': {
        openRoute: false,
        icon: 'fa-solid fa-gear',
        items: [
            {
                title: 'Workflows',
                icon: 'fa-regular fa-file',
                link: '#'
            }
        ]
    }
})

function layRoute(e: any, object: any) {
    if (e.target.childNodes.length > 1) {
        object.openRoute = !object.openRoute
    }
    if (openNav.value) {
        openNav.value = false;
    }
}

function controlNav() {
    openNav.value = !openNav.value
}

const userStore = useUserStore()

const getConditionOnSpecificPages = (route: any) => {
    if ((userStore.user?.role?.name.includes('Conseiller') || userStore.user?.role?.name.includes('FR') || userStore.user?.role?.name.includes('NL')) && (route['title'] === 'Suivi des soldes')) {
        return false;
    } else {
        return true;
    }
}

</script>

<template>
    <div class="bg-gray-100 w-screen overflow-hidden" :class="{'flex': $route.path !== '/'}">
        <nav class="border-r h-screen bg-white flex" :class="{'w-1/6': !openNav}" v-if="$route.path !== '/'">
            <div class="w-full overflow-y-auto">
                <div class="border-b w-full">
                    <NuxtLink to="/dashboard">
                        <img v-if="!openNav" src="~/assets/images/logo.png" class="my-4 mr-auto w-[17rem]"/>
                        <img v-if="openNav" src="~/assets/images/logo-cropped.png" class="my-4 mr-auto w-[5rem]" />
                    </NuxtLink>
                </div>
                <div class="border-b mb-3">
                    <div class="my-4 flex ml-2 items-center" :class="{'justify-center': openNav}">
                        <div>
                            <img class="rounded-full object-cover border mr-4"
                                 style="max-width: 30px !important; height: 30px !important;"
                                 src="~/assets/images/logo.png"
                                 alt=""/>
                        </div>
                        <div v-if="!openNav">
                            {{ user.user?.last_name }} {{ user.user?.first_name }}
                        </div>
                    </div>
                </div>
                <div :class="{'flex justify-center': openNav}" v-for="(obj, route) in navRoutes" @click.prevent="(e) => layRoute(e, obj)">
                    <NavElement>
                        <template #icon><i :class="[obj['icon']]"></i></template>
                        <template #default v-if="!openNav">{{ route }}</template>
                        <template v-if="!openNav" #chevron class="ml-auto mr-4">
                            <i :class="{
                            'fa-solid fa-chevron-left': (!obj['openRoute'] && obj['openRoute'] !== undefined),
                            'fa-solid fa-chevron-down': (obj['openRoute'])
                        }" class="text-xs cursor-pointer"></i>
                        </template>
                    </NavElement>
                    <div v-if="obj['openRoute']">
                        <div v-for="routeElement in obj['items']">
                            <NuxtLink v-if="getConditionOnSpecificPages(routeElement)" class="ml-10 hover:bg-gray-100 cursor-pointer mr-10 py-1 px-2 flex mb-2" :to="routeElement['link']">
                                <div class="mr-3"><i :class="[routeElement['icon']]"></i></div>
                                <div>{{ routeElement['title'] }}</div>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <div class="flex-col w-screen justify-center items-center bg-gray-100 h-screen overflow-y-auto text-gray-900">
            <div class="bg-white w-full flex pr-10 pl-4 py-4" v-if="$route.path !== '/'">
                <div class="mr-auto"><i class="fa-solid fa-bars cursor-pointer" @click.prevent="controlNav"></i></div>
                <div v-if="user.user" class="cursor-pointer" @click.prevent="logout">Logout</div>
            </div>
            <slot/>
        </div>
    </div>
</template>

