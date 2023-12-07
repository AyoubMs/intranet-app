<script setup lang="ts">
import {definePageMeta, useAuth} from "#imports";
import CardContainer from "~/components/CardContainer.vue";
import DashboardElement from "~/components/DashboardElement.vue";
import DemandCard from "~/components/DemandCard.vue";
import {useUserStore} from "~/stores/UserStore";
import {useDemandeCongeInputStore} from "~/stores/DemandeCongeInputStore";

definePageMeta({
  middleware: ["auth"]
})

let dashboardElements = [
  {
    classElem: 'bg-[#17a2b8]',
    icon: 'fa-regular fa-calendar-days',
    type: 'Solde CP',
    quantity: 0,
    jours: true
  },
  {
    classElem: 'bg-red-600',
    icon: 'fa-regular fa-calendar-days',
    type: 'Solde RJF',
    quantity: 0,
    jours: true
  },
  {
    classElem: 'bg-green-600',
    icon: 'fa-regular fa-file-word',
    type: 'Mes demandes en cours',
    quantity: 0,
    jours: false
  },
  {
    classElem: 'bg-yellow-600',
    icon: 'fa-solid fa-folder-open',
    type: 'Total de mes demandes',
    quantity: 0,
    jours: false
  },
]

let demandCards = [
  {
    textColor: 'text-black',
    classIcon: 'fa-solid fa-envelope',
    classFooter: 'bg-[#e5ad06]',
    classHover: 'hover:bg-[#d9a406]',
    classElem: 'bg-[#FFC107]',
    quantity: 0,
    title: 'Demandes non-traitées',
    footer: 'Traiter les demandes',
    link: '/demandesConges'
  },
  // {
  //     textColor: 'text-white',
  //     classIcon: 'fa-solid fa-rotate',
  //     classFooter: 'hover:bg-[#006ee5]',
  //     classHover: 'bg-[#0069d9]',
  //     classElem: 'bg-[#007bff]',
  //     quantity: 0,
  //     title: 'Demandes recours à traiter',
  //     footer: 'Traiter les demandes'
  // },
  // {
  //     textColor: 'text-white',
  //     classIcon: 'fa-solid fa-triangle-exclamation',
  //     classFooter: 'bg-[#616970]',
  //     classHover: 'hover:bg-[#5C646A]',
  //     classElem: 'bg-[#6C757D]',
  //     quantity: 0,
  //     title: 'Demandes annulées à traiter',
  //     footer: 'Traiter les demandes d\'annulation'
  // },
  // {
  //     textColor: 'text-white',
  //     classIcon: 'fa-solid fa-square-check',
  //     classFooter: 'bg-[#24963E]',
  //     classHover: 'hover:bg-[#228E3B]',
  //     classElem: 'bg-[#28A745]',
  //     quantity: 0,
  //     title: 'Demandes validées',
  //     footer: 'Consulter'
  // },
  // {
  //     textColor: 'text-white',
  //     classIcon: 'fa-solid fa-circle-minus',
  //     classFooter: 'bg-[#C6303E]',
  //     classHover: 'hover:bg-[#BB2D3B]',
  //     classElem: 'bg-[#DC3545]',
  //     quantity: 0,
  //     title: 'Demandes rejetées',
  //     footer: 'Consulter'
  // },
  // {
  //     textColor: 'text-white',
  //     classIcon: 'fa-solid fa-circle-info',
  //     classFooter: 'bg-[#1591A5]',
  //     classHover: 'hover:bg-[#148A9D]',
  //     classElem: 'bg-[#17A2B8]',
  //     quantity: 0,
  //     title: 'Total des demandes traitées',
  //     footer: 'Consulter'
  // },
]

const {$apiFetch} = useNuxtApp()

let userStore = useUserStore()

let demandeCongeInputStore = useDemandeCongeInputStore()
let showProcessDemandsVariable = ref(false)

const checkRoleName = () => {
  const roleName = userStore.user?.role?.name;
  const isAgent = roleName?.toLowerCase().includes('conseiller') || roleName?.toLowerCase().includes('agent')
  if (isAgent) {
    return true
  }  else {
    return false
  }
}

const {setUser} = useAuth()

onMounted(async () => {
  await userStore.fetchUser($apiFetch, setUser)
  demandCards.forEach((async (demand) => {
    if (demand.title === 'Demandes non-traitées' && !checkRoleName() && userStore.user) {
      await demandeCongeInputStore.getAffectedDemands($apiFetch, userStore.user?.matricule).catch(err => console.log(err))
      showProcessDemandsVariable.value = true
    }
  }))
})

const getDemandCardQuantity = (demandCard: any) => {
  demandCard.quantity = demandeCongeInputStore.affectedDemands === '' ? 0 : demandeCongeInputStore.affectedDemands
  return demandCard.quantity
}

const getDashboardElementQuantity = (dashboardElement: any) => {
  console.log(userStore.user)
  if (dashboardElement['type'].includes('RJF')) {
    return userStore.user?.solde_rjf
  } else if (dashboardElement['type'].includes('CP')) {
    return userStore.user?.solde_cp
  } else if (dashboardElement['type'].includes('en cours')) {
    return userStore.user?.demandes_en_cours?.length
  } else if (dashboardElement['type'].includes('Total')) {
    return userStore.user?.totalDesDemandes
  }
}

console.log(userStore.user)

</script>

<template>
  <Title>Dashboard</Title>
  <div class="p-4">
    <div class="font-bold text-3xl">Tableaux de bord</div>
    <CardContainer>
      <DashboardElement v-for="dashboardElement in dashboardElements" :class-elem="dashboardElement['classElem']">
        <template #icon>
          <i :class="[dashboardElement['icon']]" class="text-4xl" style="color: #ffffff;"></i>
        </template>
        <template #type>{{ dashboardElement['type'] }}</template>
        <template #footer><span class="font-bold">{{ getDashboardElementQuantity(dashboardElement) }}</span>
          {{ dashboardElement['jours'] ? 'jours' : '' }}
        </template>
      </DashboardElement>
    </CardContainer>
    <CardContainer v-cloak v-if="showProcessDemandsVariable">
      <DemandCard v-for="demandCard in demandCards" :text-color="demandCard['textColor']"
                  :class-icon="demandCard['classIcon']"
                  :class-footer="demandCard['classFooter']" :class-hover="demandCard['classHover']"
                  :class-elem="demandCard['classElem']" :link="demandCard['link']">
        <template #body>
          <div class="ml-3 mt-3 mb-6">
            <span class="text-3xl font-bold">{{ getDemandCardQuantity(demandCard) }}</span>
            <div>{{ demandCard['title'] }}</div>
          </div>
        </template>
        <template #footer>
          {{ demandCard['footer'] }}
        </template>
      </DemandCard>
    </CardContainer>
  </div>
</template>

