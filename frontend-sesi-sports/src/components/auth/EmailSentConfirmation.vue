<template>
  <div class="w-full text-center">
    <!-- Success Icon -->
    <div class="mb-6">
      <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <i class="pi pi-check text-green-600 text-2xl"></i>
      </div>
      <h3 class="text-2xl font-bold text-gray-800 mb-2">E-mail enviado!</h3>
      <p class="text-gray-600 text-sm">Enviamos um link de recuperação para:</p>
      <p class="text-blue-600 font-semibold mt-1">{{ email }}</p>
    </div>

    <!-- Instructions -->
    <div class="bg-blue-50 rounded-lg p-4 mb-6 text-left">
      <h4 class="font-semibold text-blue-800 mb-2">Próximos passos:</h4>
      <ul class="text-sm text-blue-700 space-y-1">
        <li class="flex items-start">
          <span class="mr-2">1.</span>
          <span>Verifique sua caixa de entrada e spam</span>
        </li>
        <li class="flex items-start">
          <span class="mr-2">2.</span>
          <span>Clique no link recebido para redefinir sua senha</span>
        </li>
        <li class="flex items-start">
          <span class="mr-2">3.</span>
          <span>O link expira em 30 minutos por segurança</span>
        </li>
      </ul>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-4">
      <!-- Resend Button -->
      <button
        type="button"
        @click="handleResendEmail"
        class="login-btn login-btn-blue w-full"
        :disabled="isResending || countdown > 0"
      >
        <span v-if="isResending">Reenviando...</span>
        <span v-else-if="countdown > 0">Reenviar em {{ countdown }}s</span>
        <span v-else>REENVIAR E-MAIL</span>
      </button>

      <!-- Back to Login -->
      <button
        type="button"
        @click="emit('backToLogin')"
        class="w-full py-3 text-blue-600 hover:text-blue-800 transition-colors"
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

    <!-- Help Section -->
    <div class="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
      <p class="font-medium mb-2">Não recebeu o e-mail?</p>
      <ul class="text-xs space-y-1">
        <li>• Verifique a pasta de spam/lixo eletrônico</li>
        <li>• Confirme se o e-mail está digitado corretamente</li>
        <li>• Aguarde alguns minutos - pode haver atraso na entrega</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  email: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['backToLogin', 'emailResent']);

const isResending = ref(false);
const error = ref('');
const successMessage = ref('');
const countdown = ref(0);
let countdownInterval = null;

onMounted(() => {
  // Iniciar countdown de 60 segundos para reenvio
  startCountdown(60);
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

const startCountdown = (seconds) => {
  countdown.value = seconds;
  countdownInterval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
};

const handleResendEmail = async () => {
  if (countdown.value > 0) return;
  
  isResending.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    // Simular reenvio do email
    await simulateEmailResend(props.email);
    
    successMessage.value = 'E-mail reenviado com sucesso!';
    startCountdown(60); // Reiniciar countdown
    
    // Limpar mensagem de sucesso após 3 segundos
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
    
  } catch (err) {
    error.value = err.message || 'Erro ao reenviar e-mail. Tente novamente.';
  } finally {
    isResending.value = false;
  }
};

// Simular reenvio de email
const simulateEmailResend = async (email) => {
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
        reject(new Error('Erro interno. Tente novamente mais tarde.'));
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

/* Blue Button */
.login-btn-blue {
  background-color: #2563eb;
  color: white;
}

.login-btn-blue:hover:not(:disabled) {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}
</style>
