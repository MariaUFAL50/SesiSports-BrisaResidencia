<template>
  <div class="verification-container">
    <!-- Ícone com badge de sucesso -->
    <div class="icon-container">
      <div class="envelope-icon">
        <img src="/envelope-icon.svg" alt="Ícone de Envelope" />
      </div>
      <div class="success-badge">
        <i class="pi pi-check"></i>
      </div>
    </div>

    <!-- Título e descrição -->
    <div class="content-section">
      <h2 class="title">Cadastro Realizado</h2>
      <p class="description">
        Acesse o seu e-mail e verifique o código para o primeiro acesso.
      </p>
    </div>

    <!-- Campo de código -->
    <div class="code-section">
      <label class="code-label">Código</label>
      <div class="code-inputs">
        <InputText
          v-for="(digit, index) in codeDigits"
          :key="index"
          v-model="codeDigits[index].digit"
          @input="handleCodeInput(index, $event.target.value)"
          @keydown.backspace="handleBackspace(index, $event)"
          :maxlength="1"
          class="code-input"
          :ref="el => { if (el) codeInputs[index] = el }"
        />
      </div>
    </div>

    <!-- Botão OK -->
    <Button
      label="OK"
      class="ok-button"
      @click="handleVerifyCode"
      :disabled="authStore.isLoading"
    />
    
    <!-- Mensagem de erro -->
    <div v-if="authStore.error" class="auth-error">
      {{ authStore.error }}
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

import { useAuthStore } from '../../stores/auth';
const authStore = useAuthStore();

const emit = defineEmits(['verificationComplete']);

const codeLength = 4; // Define o número de dígitos para o código
const codeDigits = reactive(Array(codeLength).fill('').map(() => ({ digit: '' })));
const codeInputs = ref([]); // Para acessar os elementos InputText diretamente para foco

// Lógica para auto-foco no próximo campo após digitar um dígito
const handleCodeInput = (index, value) => {
  codeDigits[index].digit = value.charAt(0); // Garante que apenas um caractere seja armazenado

  if (value && index < codeLength - 1) {
    nextTick(() => {
      codeInputs.value[index + 1]?.focus();
    });
  }
};

// Lógica para apagar dígito e mover o foco para trás com Backspace
const handleBackspace = (index, event) => {
  if (!codeDigits[index].digit && index > 0) {
    nextTick(() => {
      codeInputs.value[index - 1]?.focus();
    });
  }
};

const handleVerifyCode = async () => {
  console.log('RegisterVerificationCode: Iniciando verificação de código...');
  console.log('RegisterVerificationCode: Estado dos campos:', codeDigits);
  
  // Verifica se todos os campos estão preenchidos
  const allFilled = codeDigits.every(d => d.digit && d.digit.trim() !== '');
  console.log('RegisterVerificationCode: Todos os campos preenchidos?', allFilled);

  if (!allFilled) {
    console.log('RegisterVerificationCode: Nem todos os campos estão preenchidos');
    return;
  }

  const fullCode = codeDigits.map(d => d.digit).join('');
  console.log('RegisterVerificationCode: Código digitado:', fullCode);
  
  if (fullCode.length !== 4) {
    console.log('RegisterVerificationCode: Código deve ter 4 dígitos');
    return;
  }

  authStore.updateVerificationCode(fullCode); // Salva o código completo na store

  console.log('RegisterVerificationCode: Chamando authStore.verifyEmailCode()...');
  const success = await authStore.verifyEmailCode(); // Chama a ação de verificação na store
  console.log('RegisterVerificationCode: Resultado da verificação:', success);

  if (success) {
    console.log('RegisterVerificationCode: Emitindo evento verificationComplete...');
    emit('verificationComplete'); // Emite um evento de sucesso de verificação para o AuthModal
  } else {
    console.log('RegisterVerificationCode: Verificação falhou - código incorreto');
  }
};
</script>

<style scoped>
/* Container principal da tela de verificação */
.verification-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 24px;
  padding: 32px 24px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

/* Container do ícone com badge */
.icon-container {
  position: relative;
  width: 96px;
  height: 96px;
  margin-bottom: 8px;
}

/* Ícone do envelope */
.envelope-icon {
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.envelope-icon img {
  width: 96px;
  height: 96px;
  object-fit: contain;
}

/* Badge de sucesso (check verde) */
.success-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 32px;
  height: 32px;
  background-color: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.success-badge i {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

/* Seção de conteúdo */
.content-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

/* Título principal */
.title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
  margin: 0;
}

/* Descrição */
.description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
  max-width: 280px;
}

/* Seção do código */
.code-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

/* Label do código */
.code-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  text-align: center;
}

/* Container dos inputs do código */
.code-inputs {
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* Estilos para inputs de código individuais */
.code-input {
  width: 48px !important;
  height: 48px !important;
  text-align: center !important;
  font-size: 20px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  border: 1px solid #d1d5db !important;
  background-color: white !important;
  transition: all 0.2s ease !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Estados do input de código */
.code-input-normal {
  border-color: #d1d5db !important;
}

.code-input-error {
  border-color: #ef4444 !important;
  background-color: #fef2f2 !important;
}

/* Focus state para inputs de código */
.code-input:focus {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
}

/* Mensagem de erro */
.error-message {
  color: #ef4444;
  font-size: 12px;
  text-align: center;
  margin-top: 4px;
}

/* Botão OK */
.ok-button {
  width: 100% !important;
  height: 48px !important;
  background-color: #10b981 !important;
  color: white !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  border: none !important;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
  outline: none !important;
  box-shadow: none !important;
  margin-top: 8px;
}

.ok-button:hover {
  background-color: #059669 !important;
}

.ok-button:disabled {
  background-color: #9ca3af !important;
  cursor: not-allowed;
}

/* Mensagem de erro da autenticação */
.auth-error {
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
}

/* Override específicos para PrimeVue */
:deep(.p-inputtext) {
  width: 48px !important;
  height: 48px !important;
  text-align: center !important;
  font-size: 20px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  border: 1px solid #d1d5db !important;
  background-color: white !important;
  transition: all 0.2s ease !important;
  outline: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

:deep(.p-inputtext:focus) {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
  background-color: white !important;
}

:deep(.p-inputtext:enabled:hover) {
  border-color: #10b981 !important;
}

:deep(.p-button) {
  width: 100% !important;
  height: 48px !important;
  background-color: #10b981 !important;
  color: white !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  border: none !important;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
  outline: none !important;
  box-shadow: none !important;
  padding: 12px 24px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.p-button:enabled:hover) {
  background-color: #059669 !important;
  box-shadow: none !important;
  transform: none !important;
}

:deep(.p-button:focus) {
  box-shadow: none !important;
  outline: none !important;
}

:deep(.p-button:disabled) {
  background-color: #9ca3af !important;
  color: white !important;
  cursor: not-allowed !important;
}

/* Responsividade */
@media (max-width: 480px) {
  .verification-container {
    padding: 24px 16px;
  }
  
  .code-inputs {
    gap: 8px;
  }
  
  .code-input {
    width: 40px !important;
    height: 40px !important;
    font-size: 18px !important;
  }
  
  :deep(.p-inputtext) {
    width: 40px !important;
    height: 40px !important;
    font-size: 18px !important;
  }
}
</style>