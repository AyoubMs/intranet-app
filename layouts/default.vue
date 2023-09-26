<script setup lang="ts">

import {useAuth} from "~/composables/useAuth";
import Cookies from "js-cookie";
import NavElement from "~/Components/NavElement.vue";

const {$apiFetch}: any = useNuxtApp()

let openNav = ref(false)

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
                    '/publications'
            }
            ,
            {
                title: 'Gérer mes tokens',
                icon:
                    'fa-solid fa-gauge',
                link:
                    '/tokens'
            }
            ,
            {
                title: 'Gestion des Questionnaires',
                icon:
                    'fa-solid fa-gauge',
                link:
                    '/Questionnaires'
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
                link: '/users'
            },
            {
                title: 'Jours fériés',
                icon:
                    'fa-regular fa-calendar-xmark',
                link:
                    '/Administration/Jours/feries'
            }
            ,
            {
                title: 'Présence jours fériés',
                icon:
                    'fa-solid fa-gauge',
                link:
                    '/rh/presence/rjf'
            }
            ,
            {
                title: "Droits d'accès",
                icon:
                    'fa-solid fa-lock',
                link:
                    '/Droits/Acces'
            }
            ,
            {
                title: "Validation des changements de profils",
                icon:
                    'fa-solid fa-address-card',
                link:
                    'profilesettings/index'
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
                link: '/Utilisateur/suivi/solde'
            },
            {
                title: 'Saisie/Suivi des demandes',
                icon:
                    'fa-solid fa-pen-to-square',
                link:
                    '/Saisie/demande/conges'
            }
            ,
            {
                title: 'Demandes annulées',
                icon:
                    'fa-solid fa-database',
                link:
                    '/validation/conges'
            }
            ,
            {
                title: 'Demandes recours',
                icon:
                    'fa-solid fa-circle-minus',
                link:
                    '/validation/demandes/annules'
            }
            ,
            {
                title: 'Historique des demandes',
                icon:
                    'fa-solid fa-rotate-left',
                link:
                    '/Historique/Admin/conges'
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
                link: '/Saisie/demande/document'
            },
            {
                title: 'Traitement des documents',
                icon:
                    'fa-regular fa-square-check',
                link:
                    '/Historique/Admin/docs'
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
                link: '/recompenses'
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
                link: '/feedback'
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
                link: '/Documents'
            },
            {
                title: 'Autres documents',
                icon:
                    'fa-solid fa-clock-rotate-left',
                link:
                    '/Documents/Autres'
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
                link: '/workflow'
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
                            {{ JSON.parse(user)?.name }}
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
                        <div v-for="routeElement in obj['items']" class="ml-10 hover:bg-gray-100 cursor-pointer mr-10 py-1 px-2 flex mb-2">
                            <div class="mr-3"><i :class="[routeElement['icon']]"></i></div>
                            <div>{{ routeElement['title'] }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <div class="flex-col w-screen justify-center items-center bg-gray-100 min-h-screen text-gray-900">
            <div class="bg-white w-full flex pr-10 pl-4 py-4" v-if="$route.path !== '/'">
                <div class="mr-auto"><i class="fa-solid fa-bars cursor-pointer" @click.prevent="controlNav"></i></div>
                <div class="cursor-pointer" @click.prevent="logout">Logout</div>
            </div>
            <slot/>
        </div>
    </div>
</template>

