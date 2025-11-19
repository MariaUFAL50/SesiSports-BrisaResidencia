<template>
  <div class="w-full">
    <form @submit.prevent="handleLogin" class="w-full">
      <!-- CPF Field -->
      <div class="mb-6">
        <label for="cpf" class="block text-sm font-medium text-gray-700 mb-3">CPF</label>
        <InputMask
          id="cpf"
          v-model="v$.cpf.$model"
          mask="999.999.999-99"
          placeholder="000.000.000-00"
          class="login-input"
          :class="{'error': v$.cpf.$error}"
          @blur="v$.cpf.$touch"
          inputmode="text"
        />
        <span v-if="v$.cpf.$error" class="text-red-500 text-xs mt-1 block">
          {{ v$.cpf.$errors[0].$message }}
        </span>
      </div>

      <!-- Password Field -->
      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-3">Senha</label>
        <InputText
          id="password"
          type="password"
          v-model="v$.password.$model"
          placeholder=""
          class="login-input"
          :class="{'error': v$.password.$error}"
          @blur="v$.password.$touch"
          autocomplete="current-password"
        />
        <span v-if="v$.password.$error" class="text-red-500 text-xs mt-1 block">
          {{ v$.password.$errors[0].$message }}
        </span>
      </div>

      <!-- Forgot Password Link -->
      <div class="text-right mb-8">
        <button
          type="button"
          @click="emit('showForgotPassword')"
          class="text-sm text-blue-600 hover:underline focus:outline-none"
        >
          Esqueceu sua senha?
        </button>
      </div>

      <!-- ENTRAR Button (Green) -->
      <button
        type="submit"
        class="login-btn login-btn-green w-full mb-6"
        :disabled="authStore.isLoading || (v$.$invalid && v$.$dirty)"
      >
        <span v-if="authStore.isLoading">Entrando...</span>
        <span v-else>ENTRAR</span>
      </button>

      <!-- Divider -->
      <div class="flex items-center w-full mb-6">
        <hr class="border-gray-300 flex-grow"/>
        <span class="mx-4 text-gray-700 text-sm">ou</span>
        <hr class="border-gray-300 flex-grow"/>
      </div>

      <!-- CADASTRAR-SE Button (Blue) -->
      <button
        type="button"
        class="login-btn login-btn-blue w-full mb-5"
        @click="emit('switchToRegister')"
        :disabled="authStore.isLoading"
      >
        CADASTRAR-SE
      </button>

      <!-- Google Button -->
      <button
        type="button"
        class="login-btn login-btn-google w-full"
        @click="handleGoogleLogin"
        :disabled="authStore.isLoading"
      >
        <i class="fab fa-google mr-2"></i>
        ENTRE COM O GOOGLE
      </button>

      <!-- Error Message -->
      <div v-if="authStore.error" class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm text-center mt-4">
        <strong>Erro:</strong> {{ authStore.error }}
      </div>

      <!-- Test Credentials Info (Development Only) -->
      <div class="mt-6 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
        <p class="font-semibold mb-2">🔑 Credenciais de Teste:</p>
        <div class="space-y-1">
          <p><strong>Cliente:</strong> CPF: 529.982.247-25 | Senha: Senha@123</p>
          <p><strong>Técnico:</strong> CPF: 111.222.333-44 | Senha: Senha@123</p>
          <p><strong>Admin:</strong> CPF: 999.888.777-66 | Senha: Senha@123</p>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import InputMask from 'primevue/inputmask';
import InputText from 'primevue/inputtext';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
import { isValidCpf } from '../../utils/validation';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const emit = defineEmits(['switchToRegister', 'loginSuccess', 'showForgotPassword']);

const loginData = reactive({
  cpf: '',
  password: '',
});

const rules = {
  cpf: {
    required: helpers.withMessage('CPF é obrigatório', required),
    // isValidCpf: isValidCpf, // Temporariamente desabilitado
  },
  password: {
    required: helpers.withMessage('Senha é obrigatória', required),
    minLength: helpers.withMessage('A senha deve ter no mínimo 6 caracteres', minLength(6)),
  },
};

const v$ = useVuelidate(rules, loginData);

const handleLogin = async () => {
  v$.value.$touch();
  const isFormValid = await v$.value.$validate();

  if (isFormValid) {
    console.log('LoginForm: Dados de login válidos, tentando login...');
    const success = await authStore.login(loginData);

    if (success) {
      emit('loginSuccess');
    }
  } else {
    console.log('LoginForm: Formulário de login inválido.');
  }
};

const handleGoogleLogin = () => {
  console.log('LoginForm: Login com Google clicado!');
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

/* Green Button (ENTRAR) */
.login-btn-green {
  background-color: #22c55e;
  color: white;
}

.login-btn-green:hover:not(:disabled) {
  background-color: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
}

/* Blue Button (CADASTRAR-SE) */
.login-btn-blue {
  background-color: #2563eb;
  color: white;
}

.login-btn-blue:hover:not(:disabled) {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

/* Google Button */
.login-btn-google {
  background-color: #2563eb;
  color: white;
  font-size: 14px;
}

.login-btn-google:hover:not(:disabled) {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

.login-btn-google i {
  margin-right: 8px;
}

/* PrimeVue Input Overrides */
:deep(.p-inputmask),
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

:deep(.p-inputmask::placeholder),
:deep(.p-inputtext::placeholder) {
  color: #9ca3af !important;
  opacity: 1 !important;
}

:deep(.p-inputmask:focus),
:deep(.p-inputtext:focus) {
  border-color: #3b82f6 !important;
  background-color: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-1px) !important;
}

:deep(.p-inputmask.error),
:deep(.p-inputtext.error) {
  border-color: #ef4444 !important;
  background-color: #fef2f2 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
}

/* Font Awesome Icons */
.fab {
  font-family: "Font Awesome 5 Brands" !important;
}
</style>
