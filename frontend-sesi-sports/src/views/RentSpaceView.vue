<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <!-- Back Button -->
        <Button
          icon="pi pi-chevron-left"
          class="back-btn"
          @click="goBack"
        />
        <img src="/sesi-sports-logo.png" alt="SESI Sports Logo" class="h-8" />
      </div>
      <div class="flex items-center gap-3">
        <!-- Profile Icon -->
        <button
          class="profile-btn"
          @click="handleProfileClick"
          :title="isLoggedIn ? 'Meu Perfil' : 'Fazer Login para acessar perfil'"
        >
          <div v-if="authStore.isAuthenticated && authStore.getUserProfilePhoto" class="profile-photo-mini">
            <img :src="authStore.getUserProfilePhoto" alt="Perfil" class="profile-photo-img" />
          </div>
          <i v-else class="pi pi-user"></i>
        </button>
        <!-- Auth Button -->
        <button
          :class="['header-btn', { 'logout-btn': isLoggedIn }]"
          @click="handleAuthClick"
        >
          {{ isLoggedIn ? 'Sair' : 'Entrar' }}
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <!-- Title -->
        <h1 class="page-title">Lorem ipsum</h1>

        <!-- Form Container -->
        <div class="form-container">
          <!-- Dados Pessoais Section -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-number">1</div>
              <h2 class="section-title">Dados pessoais</h2>
            </div>

            <div class="form-grid">
              <!-- CPF -->
              <div class="form-field">
                <label class="form-label required">CPF</label>
                <InputText
                  v-model="personalForm.cpf"
                  placeholder=""
                  class="form-input"
                  maxlength="14"
                  @input="formatCPF"
                />
              </div>

              <!-- Celular -->
              <div class="form-field">
                <label class="form-label required">Celular</label>
                <InputText
                  v-model="personalForm.phone"
                  placeholder=""
                  class="form-input"
                  maxlength="15"
                  @input="formatPhone"
                />
              </div>

              <!-- Nome Completo -->
              <div class="form-field full-width">
                <label class="form-label required">Nome Completo</label>
                <InputText
                  v-model="personalForm.fullName"
                  placeholder=""
                  class="form-input"
                />
              </div>

              <!-- Melhor e-mail -->
              <div class="form-field full-width">
                <label class="form-label">Melhor e-mail</label>
                <InputText
                  v-model="personalForm.email"
                  placeholder=""
                  class="form-input"
                  type="email"
                />
              </div>
            </div>
          </div>

          <!-- Endereço Section -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-number">2</div>
              <h2 class="section-title">Endereço</h2>
            </div>

            <div class="form-grid">
              <!-- CEP -->
              <div class="form-field">
                <label class="form-label">CEP</label>
                <InputText
                  v-model="addressForm.cep"
                  placeholder=""
                  class="form-input"
                  maxlength="9"
                  @input="formatCEP"
                  @blur="searchCEP"
                />
              </div>

              <!-- Rua -->
              <div class="form-field">
                <label class="form-label">Rua</label>
                <InputText
                  v-model="addressForm.street"
                  placeholder=""
                  class="form-input"
                />
              </div>

              <!-- Número -->
              <div class="form-field">
                <label class="form-label">Número</label>
                <InputText
                  v-model="addressForm.number"
                  placeholder=""
                  class="form-input"
                />
              </div>

              <!-- Complemento -->
              <div class="form-field">
                <label class="form-label">Complemento</label>
                <InputText
                  v-model="addressForm.complement"
                  placeholder=""
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <!-- Continue Button -->
          <div class="form-actions">
            <Button
              label="Continuar"
              class="continue-btn"
              @click="handleContinue"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Auth Modal -->
    <AuthModal 
      :is-visible="showAuthModal" 
      @update:is-visible="showAuthModal = $event"
      @login-success="handleLoginSuccess"
      @register-success="handleRegisterSuccess"
    />

    <!-- Terms Modal -->
    <TermsModal 
      :is-visible="showTermsModal" 
      @update:is-visible="showTermsModal = $event"
      @proceed-to-payment="handleProceedToPayment"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { redirectBasedOnUserType } from '../utils/navigationUtils.js';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import AuthModal from '../components/auth/AuthModal.vue';
import TermsModal from '../components/TermsModal.vue';

const router = useRouter();
const showAuthModal = ref(false);
const showTermsModal = ref(false);
const isLoggedIn = ref(false); // Estado de login

const personalForm = reactive({
  cpf: '',
  phone: '',
  fullName: '',
  email: ''
});

const addressForm = reactive({
  cep: '',
  street: '',
  number: '',
  complement: ''
});

const goBack = () => {
  router.back();
};

const formatCPF = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  personalForm.cpf = value;
};

const formatPhone = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  value = value.replace(/(\d{2})(\d)/, '($1) $2');
  value = value.replace(/(\d{5})(\d)/, '$1-$2');
  personalForm.phone = value;
};

const formatCEP = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  value = value.replace(/(\d{5})(\d)/, '$1-$2');
  addressForm.cep = value;
};

const searchCEP = async () => {
  const cep = addressForm.cep.replace(/\D/g, '');
  
  if (cep.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        addressForm.street = data.logradouro;
        // Pode preencher outros campos se necessário
      }
    } catch (error) {
      console.log('Erro ao buscar CEP:', error);
    }
  }
};

const handleContinue = () => {
  // Validações básicas
  if (!personalForm.cpf || !personalForm.phone || !personalForm.fullName) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  console.log('Dados do formulário:', {
    personal: personalForm,
    address: addressForm
  });

  // Abre o modal de termos de compromisso
  showTermsModal.value = true;
};

const handleProceedToPayment = () => {
  console.log('Prosseguindo para pagamento...');
  router.push('/payment');
};

const handleLoginSuccess = () => {
  console.log('Login realizado com sucesso!');
  isLoggedIn.value = true;
  showAuthModal.value = false;
};

const handleRegisterSuccess = () => {
  console.log('Cadastro realizado com sucesso!');
  isLoggedIn.value = true;
  showAuthModal.value = false;
};

const handleProfileClick = () => {
  if (isLoggedIn.value) {
    // Redirecionar baseado no tipo de usuário
    redirectBasedOnUserType(authStore.currentUser?.type, router);
  } else {
    showAuthModal.value = true;
  }
};

const handleAuthClick = () => {
  if (isLoggedIn.value) {
    isLoggedIn.value = false;
    console.log('Usuário deslogado');
  } else {
    showAuthModal.value = true;
  }
};
</script>

<style scoped>
/* Header Styles */
.profile-btn {
  background-color: transparent !important;
  border: 1px solid #d1d5db !important;
  color: #374151 !important;
  border-radius: 50% !important;
  padding: 8px !important;
  width: 40px !important;
  height: 40px !important;
  transition: all 0.2s ease !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative !important;
  overflow: hidden !important;
}

.profile-btn:hover {
  background-color: #f3f4f6 !important;
  border-color: #9ca3af !important;
}

.profile-btn i {
  font-size: 16px;
}

.profile-photo-mini {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: none;
}

.profile-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.back-btn {
  background-color: #164194 !important;
  color: white !important;
  border: none !important;
  border-radius: 50% !important;
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.back-btn:hover {
  background-color: #113375 !important;
}

.header-btn {
  background-color: #164194 !important;
  color: white !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 12px 24px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  height: 40px !important;
  min-width: 80px !important;
  transition: all 0.2s ease !important;
  cursor: pointer !important;
}

.header-btn:hover {
  background-color: #113375 !important;
}

.logout-btn {
  background-color: #dc2626 !important;
}

.logout-btn:hover {
  background-color: #b91c1c !important;
}

/* Main Content */
.container {
  max-width: 1200px;
}

.page-title {
  font-size: 32px;
  font-weight: 400;
  color: #374151;
  margin-bottom: 32px;
  text-align: left;
}

/* Form Container */
.form-container {
  background-color: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Form Sections */
.form-section {
  margin-bottom: 40px;
}

.form-section:last-of-type {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.section-number {
  width: 24px;
  height: 24px;
  background-color: #164194;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field.full-width {
  grid-column: span 2;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
}

.form-label.required::after {
  content: '*';
  color: #dc2626;
  margin-left: 2px;
}

.form-input {
  background-color: white !important;
  border: 1px solid #d1d5db !important;
  border-radius: 6px !important;
  padding: 12px !important;
  height: 48px !important;
  font-size: 14px !important;
  color: #374151 !important;
  width: 100% !important;
  transition: all 0.2s ease !important;
}

.form-input:focus {
  outline: none !important;
  border-color: #164194 !important;
  box-shadow: 0 0 0 1px #164194 !important;
}

.form-input::placeholder {
  color: #9ca3af !important;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 24px;
}

.continue-btn {
  background-color: #4CAF50 !important;
  color: white !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 14px 32px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  height: 48px !important;
  min-width: 140px !important;
  transition: all 0.2s ease !important;
}

.continue-btn:hover {
  background-color: #388E3C !important;
}

.continue-btn:focus {
  box-shadow: none !important;
  outline: none !important;
}

/* PrimeVue Overrides */
:deep(.p-button) {
  outline: none !important;
  box-shadow: none !important;
}

:deep(.p-button:focus) {
  box-shadow: none !important;
}

:deep(.p-inputtext) {
  background-color: white !important;
  border: 1px solid #d1d5db !important;
  border-radius: 6px !important;
  padding: 12px !important;
  height: 48px !important;
  font-size: 14px !important;
  color: #374151 !important;
  width: 100% !important;
  transition: all 0.2s ease !important;
}

:deep(.p-inputtext:focus) {
  outline: none !important;
  border-color: #164194 !important;
  box-shadow: 0 0 0 1px #164194 !important;
}

:deep(.p-inputtext::placeholder) {
  color: #9ca3af !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-container {
    padding: 24px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .form-field.full-width {
    grid-column: span 1;
  }
  
  .page-title {
    font-size: 24px;
    margin-bottom: 24px;
  }
  
  .section-header {
    margin-bottom: 20px;
  }
  
  .form-section {
    margin-bottom: 32px;
  }
}

@media (max-width: 480px) {
  .container {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .form-container {
    padding: 20px;
  }
  
  .page-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .continue-btn {
    width: 100%;
  }
  
  .form-actions {
    justify-content: stretch;
  }
}

/* Form validation states */
.form-input.error {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 1px #dc2626 !important;
}

.form-input.success {
  border-color: #4CAF50 !important;
  box-shadow: 0 0 0 1px #4CAF50 !important;
}

/* Loading state for continue button */
.continue-btn:disabled {
  background-color: #9ca3af !important;
  cursor: not-allowed !important;
}

.continue-btn:disabled:hover {
  background-color: #9ca3af !important;
}
</style>