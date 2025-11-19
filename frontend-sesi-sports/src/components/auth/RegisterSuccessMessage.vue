<template>
  <div class="flex flex-col items-center justify-center text-center gap-4 py-8">
    <div class="relative w-24 h-24">
      <img src="/envelope-icon.svg" alt="Ícone de Envelope" class="w-full h-full text-blue-600" />
      <div class="absolute bottom-0 right-0 w-8 h-8 bg-primary-green rounded-full flex items-center justify-center border-2 border-white">
        <i class="pi pi-check text-white text-lg"></i>
      </div>
    </div>

    <h2 class="text-xl font-semibold text-text-dark mt-4">Cadastro Realizado</h2>
    <p class="text-sm text-gray-600">
      Acesse o seu e-mail para concluir o cadastro.
    </p>

    <Button
      label="OK"
      class="w-full p-3 bg-primary-green text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-200 mt-4"
      @click="handleOk"
      :disabled="authStore.isLoading"
    />
    <div v-if="authStore.error" class="text-red-500 text-sm text-center mt-2">
      {{ authStore.error }}
    </div>
  </div>
</template>

<script setup>
// defineEmits é um macro, não precisa ser importado explicitamente
import Button from 'primevue/button';
import { useAuthStore } from '../../stores/auth'; // Importa a store Pinia

const emit = defineEmits(['goToVerification']);
const authStore = useAuthStore();

const handleOk = async () => {
  // Neste ponto, assumimos que o e-mail de verificação já foi "enviado"
  // pela ação `registerUser` na `auth.js` quando o usuário clicou em "Cadastrar-se" na tela de endereço.
  console.log('RegisterSuccessMessage: Botão OK clicado, avançando para verificação de código');
  emit('goToVerification'); // Avança para a tela de verificação do código
};
</script>