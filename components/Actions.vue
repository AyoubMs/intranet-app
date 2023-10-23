<script setup>
import Modal from "~/components/Modal.vue";

const props = defineProps({
    user: Object
})

let showModal = ref(false);
let affectation = ref(false);

const toggleModal = () => {
    showModal.value = true;
}

const toggleModalWithAffectation = () => {
    affectation.value = true;
    console.log(affectation.value)
}


const toggleModalWithVariable = () => {
    if (showModal.value) {
        showModal.value = false;
    } else if (affectation.value) {
        affectation.value = false;
    }
}


</script>

<template>
  <td class="px-2 border-2 py-1 flex flex-col">
      <button class="text-white bg-cyan-500 rounded-md px-1" @click.prevent="toggleModal()"><i class="fa-solid fa-pen-to-square"></i>Editer</button>
      <button class="text-white bg-green-500 rounded-md px-1 mt-2" @click.prevent="toggleModalWithAffectation()"><i class="fa-solid fa-lock-open"></i>affectation</button>
      <button class="text-white bg-red-500 rounded-md px-1 mt-2"><i class="fa-solid fa-trash-can"></i>Désactiver</button>
  </td>
    <Modal v-if="showModal || affectation" :show="showModal || affectation" @close="toggleModalWithVariable()" :edit="showModal" :affectation="affectation" :user="user" />
</template>
