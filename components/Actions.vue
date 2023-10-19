<script setup>
import Modal from "~/components/Modal.vue";

const props = defineProps({
    user: Object
})

let showModal = ref(false);

const toggleModal = () => {
    showModal.value = true;
}

</script>

<template>
  <td class="px-2 border-2 py-1 flex flex-col">
      <button class="text-white bg-cyan-500 rounded-md px-1" @click.prevent="toggleModal()"><i class="fa-solid fa-pen-to-square"></i>Editer</button>
      <button class="text-white bg-green-500 rounded-md px-1 mt-2"><i class="fa-solid fa-lock-open"></i>affectation</button>
      <button class="text-white bg-red-500 rounded-md px-1 mt-2"><i class="fa-solid fa-trash-can"></i>Désactiver</button>
  </td>
    <Modal v-if="showModal" :show="showModal" @close="showModal = false" :edit="true" :user="user" />
</template>
