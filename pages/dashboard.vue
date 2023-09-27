<script setup lang="ts">
import {definePageMeta} from "#imports";
import CardContainer from "~/Components/CardContainer.vue";
import DashboardElement from "~/Components/DashboardElement.vue";
import DemandCard from "~/pages/DemandCard.vue";

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
        footer: 'Traiter les demandes'
    },
    {
        textColor: 'text-white',
        classIcon: 'fa-solid fa-rotate',
        classFooter: 'hover:bg-[#006ee5]',
        classHover: 'bg-[#0069d9]',
        classElem: 'bg-[#007bff]',
        quantity: 0,
        title: 'Demandes recours à traiter',
        footer: 'Traiter les demandes'
    },
    {
        textColor: 'text-white',
        classIcon: 'fa-solid fa-triangle-exclamation',
        classFooter: 'bg-[#616970]',
        classHover: 'hover:bg-[#5C646A]',
        classElem: 'bg-[#6C757D]',
        quantity: 0,
        title: 'Demandes annulées à traiter',
        footer: 'Traiter les demandes d\'annulation'
    },
    {
        textColor: 'text-white',
        classIcon: 'fa-solid fa-square-check',
        classFooter: 'bg-[#24963E]',
        classHover: 'hover:bg-[#228E3B]',
        classElem: 'bg-[#28A745]',
        quantity: 0,
        title: 'Demandes validées',
        footer: 'Consulter'
    },
    {
        textColor: 'text-white',
        classIcon: 'fa-solid fa-circle-minus',
        classFooter: 'bg-[#C6303E]',
        classHover: 'hover:bg-[#BB2D3B]',
        classElem: 'bg-[#DC3545]',
        quantity: 0,
        title: 'Demandes rejetées',
        footer: 'Consulter'
    },
    {
        textColor: 'text-white',
        classIcon: 'fa-solid fa-circle-info',
        classFooter: 'bg-[#1591A5]',
        classHover: 'hover:bg-[#148A9D]',
        classElem: 'bg-[#17A2B8]',
        quantity: 0,
        title: 'Total des demandes traitées',
        footer: 'Consulter'
    },
]

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
                <template #footer><span class="font-bold">{{ dashboardElement['quantity'] }}</span> {{ dashboardElement['jours'] ? 'jours' : '' }}</template>
            </DashboardElement>
        </CardContainer>
        <CardContainer>
            <DemandCard v-for="demandCard in demandCards" :text-color="demandCard['textColor']" :class-icon="demandCard['classIcon']"
                        :class-footer="demandCard['classFooter']" :class-hover="demandCard['classHover']" :class-elem="demandCard['classElem']">
                <template #body>
                    <div class="ml-3 mt-3 mb-6">
                        <span class="text-3xl font-bold">{{ demandCard['quantity'] }}</span>
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

