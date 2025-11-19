<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <h3 class="text-2xl font-bold text-gray-800 mb-2">Esqueceu sua senha?</h3>
      <p class="text-gray-600 text-sm">Digite seu e-mail para receber um link de recuperação</p>
    </div>

    <form @submit.prevent="handleForgotPassword" class="w-full">
      <!-- Email Field -->
      <div class="mb-6">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-3">E-mail</label>
        <InputText
          id="email"
          type="email"
          v-model="v$.email.$model"
          placeholder="seu.email@exemplo.com"
          class="login-input"
          :class="{'error': v$.email.$error}"
          @blur="v$.email.$touch"
          autocomplete="email"
        />
        <span v-if="v$.email.$error" class="text-red-500 text-xs mt-1 block">
          {{ v$.email.$errors[0].$message }}
        </span>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="login-btn login-btn-green w-full mb-6"
        :disabled="isLoading || (v$.$invalid && v$.$dirty)"
      >
        <span v-if="isLoading">Enviando...</span>
        <span v-else>ENVIAR LINK DE RECUPERAÇÃO</span>
      </button>

      <!-- Back to Login Link -->
      <div class="text-center">
        <button
          type="button"
          @click="emit('backToLogin')"
          class="text-sm text-blue-600 hover:underline focus:outline-none"
        >
          ← Voltar para o login
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="text-red-500 text-sm text-center mt-4 p-3 bg-red-50 rounded-lg">
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="text-green-600 text-sm text-center mt-4 p-3 bg-green-50 rounded-lg">
        {{ successMessage }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import InputText from 'primevue/inputtext';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';

const emit = defineEmits(['backToLogin', 'emailSent']);

const isLoading = ref(false);
const error = ref('');
const successMessage = ref('');

const forgotPasswordData = reactive({
  email: '',
});

const rules = {
  email: {
    required: helpers.withMessage('E-mail é obrigatório', required),
    email: helpers.withMessage('Digite um e-mail válido', email),
  },
};

const v$ = useVuelidate(rules, forgotPasswordData);

const handleForgotPassword = async () => {
  v$.value.$touch();
  const isFormValid = await v$.value.$validate();

  if (isFormValid) {
    isLoading.value = true;
    error.value = '';
    successMessage.value = '';

    try {
      // Simular envio do email (aqui você integraria com sua API)
      await simulateEmailSend(forgotPasswordData.email);
      
      successMessage.value = 'Link de recuperação enviado com sucesso!';
      
      // Após 2 segundos, emitir evento para mostrar tela de confirmação
      setTimeout(() => {
        emit('emailSent', forgotPasswordData.email);
      }, 2000);
      
    } catch (err) {
      error.value = err.message || 'Erro ao enviar e-mail de recuperação. Tente novamente.';
    } finally {
      isLoading.value = false;
    }
  }
};

// Simular envio de email
const simulateEmailSend = async (email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simular validação de email
      const validEmails = [
        'usuario@teste.com',
        'joao.silva@sesi.com',
        'admin@sesi-sports.com',
        'teste@email.com'
      ];
      
      if (validEmails.includes(email)) {
        resolve();
      } else {
        reject(new Error('E-mail não encontrado em nossa base de dados.'));
      }
    }, 1500);
  });
};
</script>

<style scoped>
/* Login Button Base */
.login-btn {
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Green Button */
.login-btn-green {
  background-color: #22c55e;
  color: white;
}

.login-btn-green:hover:not(:disabled) {
  background-color: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
}

/* PrimeVue Input Overrides */
:deep(.p-inputtext) {
  width: 100% !important;
  padding: 16px 20px !important;
  border: 1px solid #d1d5db !important;
  border-radius: 8px !important;
  font-size: 16px !important;
  color: #374151 !important;
  background-color: #f9fafb !important;
  transition: all 0.3s ease !important;
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  outline: none !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  height: 56px !important;
  min-height: 56px !important;
}

:deep(.p-inputtext::placeholder) {
  color: #9ca3af !important;
  opacity: 1 !important;
}

:deep(.p-inputtext:focus) {
  border-color: #3b82f6 !important;
  background-color: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-1px) !important;
}

:deep(.p-inputtext.error) {
  border-color: #ef4444 !important;
  background-color: #fef2f2 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
}
</style>
