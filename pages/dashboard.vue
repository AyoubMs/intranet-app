<script setup lang="ts">
import {definePageMeta} from "#imports";
import CardContainer from "~/Components/CardContainer.vue";
import DashboardElement from "~/Components/DashboardElement.vue";
import DemandCard from "~/pages/DemandCard.vue";

definePageMeta({
    middleware: ["auth"]
})

</script>

<template>
    <Title>Dashboard</Title>
    <div class="p-4">
        <div class="font-bold text-3xl">Tableaux de bord</div>
        <CardContainer>
            <DashboardElement :class-elem="'bg-[#17a2b8]'">
                <template #icon>
                    <i class="fa-regular fa-calendar-days text-4xl" style="color: #ffffff;"></i>
                </template>
                <template #type>Solde CP</template>
                <template #footer><span class="font-bold">0</span> jours</template>
            </DashboardElement>
            <DashboardElement :class-elem="'bg-red-600'">
                <template #icon>
                    <i class="fa-regular fa-calendar-days text-4xl" style="color: #ffffff;"></i>
                </template>
                <template #type>Solde RJF</template>
                <template #footer><span class="font-bold">0</span> jours</template>
            </DashboardElement>
            <DashboardElement :class-elem="'bg-green-600'">
                <template #icon>
                    <i class="fa-regular fa-file-word text-4xl" style="color: #ffffff;"></i>
                </template>
                <template #type>Mes demandes en cours</template>
                <template #footer><span class="font-bold">0</span></template>
            </DashboardElement>
            <DashboardElement :class-elem="'bg-yellow-600'">
                <template #icon>
                    <i class="fa-solid fa-folder-open text-4xl" style="color: #ffffff;"></i>
                </template>
                <template #type>Total de mes demandes</template>
                <template #footer><span class="font-bold">0</span></template>
            </DashboardElement>
        </CardContainer>
        <CardContainer>
            <DemandCard :text-color="'text-black'" :class-icon="'fa-solid fa-envelope'" :class-footer="'bg-[#e5ad06]'" :class-hover="'hover:bg-[#d9a406]'" :class-elem="'bg-[#FFC107]'">
                <template #body>
                    <div class="ml-3 mt-3 mb-6">
                        <span class="text-3xl font-bold">0</span>
                        <div>Demandes non-traitées</div>
                    </div>
                </template>
                <template #footer>
                    Traiter les demandes
                </template>
            </DemandCard>
            <DemandCard :text-color="'text-white'" :class-icon="'fa-solid fa-rotate'" :class-hover="'bg-[#0069d9]'" :class-footer="'hover:bg-[#006ee5]'" :class-elem="'bg-[#007bff]'">
                <template #body>
                    <div class="ml-3 mt-3 mb-6">
                        <span class="text-3xl font-bold">0</span>
                        <div>Demandes recours à traiter</div>
                    </div>
                </template>
                <template #footer>
                    Traiter les demandes
                </template>
            </DemandCard>
            <DemandCard :text-color="'text-white'" :class-icon="'fa-solid fa-triangle-exclamation'" :class-footer="'bg-[#616970]'" :class-hover="'hover:bg-[#5C646A]'" :class-elem="'bg-[#6C757D]'">
                <template #body>
                    <div class="ml-3 mt-3 mb-6">
                        <span class="text-3xl font-bold">0</span>
                        <div>Demandes annulées à traiter</div>
                    </div>
                </template>
                <template #footer>
                    Traiter les demandes d'annulation
                </template>
            </DemandCard>
            <DemandCard :text-color="'text-white'" :class-icon="'fa-solid fa-square-check'" :class-footer="'bg-[#24963E]'" :class-hover="'hover:bg-[#228E3B]'" :class-elem="'bg-[#28A745]'">
                <template #body>
                    <div class="ml-3 mt-3 mb-6">
                        <span class="text-3xl font-bold">0</span>
                        <div>Demandes validées</div>
                    </div>
                </template>
                <template #footer>
                    Consulter
                </template>
            </DemandCard>
            <DemandCard :text-color="'text-white'" :class-icon="'fa-solid fa-circle-minus'" :class-footer="'bg-[#C6303E]'" :class-hover="'hover:bg-[#BB2D3B]'" :class-elem="'bg-[#DC3545]'">
                <template #body>
                    <div class="ml-3 mt-3 mb-6">
                        <span class="text-3xl font-bold">0</span>
                        <div>Demandes rejetées</div>
                    </div>
                </template>
                <template #footer>
                    Consulter
                </template>
            </DemandCard>
            <DemandCard :text-color="'text-white'" :class-icon="'fa-solid fa-circle-info'" :class-footer="'bg-[#1591A5]'" :class-hover="'hover:bg-[#148A9D]'" :class-elem="'bg-[#17A2B8]'">
                <template #body>
                    <div class="ml-3 mt-3 mb-6">
                        <span class="text-3xl font-bold">0</span>
                        <div>Total des demandes traitées</div>
                    </div>
                </template>
                <template #footer>
                    Consulter
                </template>
            </DemandCard>
        </CardContainer>
    </div>
</template>

