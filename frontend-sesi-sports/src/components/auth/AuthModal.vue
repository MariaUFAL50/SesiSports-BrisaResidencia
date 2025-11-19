<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    @click="handleBackdropClick"
  >
    <!-- Background Blur -->
    <div class="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
    
    <!-- Modal Content -->
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-10 min-h-[600px] flex flex-col justify-center" @click.stop>
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <img src="/sesi-sports-logo.png" alt="SESI Sports Logo" class="h-12" />
      </div>

      <!-- Login Form -->
      <div v-if="currentMode === 'login'" class="flex-1">
        <LoginForm 
          @switchToRegister="switchToRegister" 
          @loginSuccess="handleLoginSuccess"
          @showForgotPassword="showForgotPassword"
        />
      </div>

      <!-- Forgot Password Form -->
      <div v-else-if="currentMode === 'forgotPassword'" class="flex-1">
        <ForgotPasswordForm 
          @backToLogin="backToLogin"
          @emailSent="handleEmailSent"
        />
      </div>

      <!-- Email Sent Confirmation -->
      <div v-else-if="currentMode === 'emailSent'" class="flex-1">
        <EmailSentConfirmation 
          :email="sentEmail"
          @backToLogin="backToLogin"
        />
      </div>

      <!-- Register Form -->
      <div v-else-if="currentMode === 'register'" class="flex-1">
        <RegisterStepper :step="currentRegisterStep" />
        <div class="mt-4">
          <RegisterPersonalForm
            v-if="currentRegisterStep === 1"
            @nextStep="goToNextRegisterStep"
          />
          <RegisterAddressForm
            v-if="currentRegisterStep === 2"
            @registerComplete="handleInitialRegisterCompletion"
          />
          <RegisterSuccessMessage
            v-if="currentRegisterStep === 3"
            @goToVerification="goToNextRegisterStep"
          />
          <RegisterVerificationCode
            v-if="currentRegisterStep === 4"
            @verificationComplete="handleVerificationComplete"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '../../stores/auth';

import LoginForm from './LoginForm.vue';
import ForgotPasswordForm from './ForgotPasswordForm.vue';
import EmailSentConfirmation from './EmailSentConfirmation.vue';
import RegisterStepper from './RegisterStepper.vue';
import RegisterPersonalForm from './RegisterPersonalForm.vue';
import RegisterAddressForm from './RegisterAddressForm.vue';
import RegisterSuccessMessage from './RegisterSuccessMessage.vue';
import RegisterVerificationCode from './RegisterVerificationCode.vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  initialMode: {
    type: String,
    default: 'login',
  },
});

const emit = defineEmits(['update:isVisible', 'loginSuccess', 'registerSuccess']);

const authStore = useAuthStore();

const currentMode = ref(props.initialMode);
const currentRegisterStep = ref(1);
const sentEmail = ref('');

watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    currentMode.value = props.initialMode;
    currentRegisterStep.value = authStore.isEmailVerificationPending ? 3 : 1;
    if (!authStore.isEmailVerificationPending) {
       authStore.resetRegistrationData();
    }
  }
});

const handleDialogVisibilityChange = (newValue) => {
  emit('update:isVisible', newValue);
  if (!newValue && !authStore.isEmailVerificationPending) {
    authStore.resetRegistrationData();
  }
};

const handleBackdropClick = () => {
  emit('update:isVisible', false);
  if (!authStore.isEmailVerificationPending) {
    authStore.resetRegistrationData();
  }
};

const switchToRegister = () => {
  currentMode.value = 'register';
  currentRegisterStep.value = 1;
  authStore.resetRegistrationData();
  authStore.error = null; // Limpar erro ao trocar para registro
};

const showForgotPassword = () => {
  currentMode.value = 'forgotPassword';
};

const backToLogin = () => {
  currentMode.value = 'login';
  sentEmail.value = '';
};

const handleEmailSent = (email) => {
  sentEmail.value = email;
  currentMode.value = 'emailSent';
};

const goToNextRegisterStep = () => {
  console.log('AuthModal: Avançando para o próximo passo. Passo atual:', currentRegisterStep.value, '-> Próximo passo:', currentRegisterStep.value + 1);
  currentRegisterStep.value++;
};

const handleLoginSuccess = () => {
  emit('loginSuccess');
  emit('update:isVisible', false);
};

const handleInitialRegisterCompletion = () => {
  // O RegisterAddressForm já chamou authStore.registerUser()
  // e o registro foi bem-sucedido, então podemos avançar diretamente
  console.log('AuthModal: Registro inicial completo, avançando para tela de sucesso');
  goToNextRegisterStep(); // Vai para o passo 3 (RegisterSuccessMessage)
};

const handleFinalRegisterCompletion = () => {
  emit('registerSuccess');
  emit('update:isVisible', false);
};

const handleVerificationComplete = () => {
  console.log('AuthModal: Evento verificationComplete recebido!');
  console.log('AuthModal: Estado do authStore:', authStore.isAuthenticated);
  console.log('AuthModal: Usuário atual:', authStore.currentUser);
  emit('registerSuccess');
  emit('update:isVisible', false);
};
</script>

<style scoped>
/* Estilos para o modal de autenticação */
:deep(.p-dialog) {
  margin: 0 !important;
  background: transparent !important;
}

:deep(.p-dialog-content) {
  padding: 0 !important;
  border-radius: 16px !important;
  background: white !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}

:deep(.p-dialog-header) {
  padding: 32px 32px 0 32px !important;
  border: none !important;
  background: white !important;
  border-radius: 16px 16px 0 0 !important;
}

:deep(.p-dialog-mask) {
  background-color: #f7f9fc !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 16px !important;
}

.auth-modal :deep(.p-dialog) {
  max-width: 360px !important;
  width: 100% !important;
}

/* Remover o botão de fechar */
:deep(.p-dialog-header-close) {
  display: none !important;
}
</style>