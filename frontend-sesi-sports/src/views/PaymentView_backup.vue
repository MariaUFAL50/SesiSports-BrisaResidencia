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
    <main class="payment-main">
      <div class="payment-container">
        <!-- Page Title -->
        <h1 class="payment-page-title">Detalhes da locação</h1>

        <!-- Content Layout -->
        <div class="payment-content-layout">
          <!-- Left Column - Space Details -->
          <div class="space-details-column">
            <div class="space-image-container">
              <img 
                v-if="space.photos && space.photos[0]" 
                :src="space.photos[0]" 
                :alt="space.name || 'Espaço'"
                class="space-detail-image"
              />
              <div v-else class="space-detail-placeholder">
                <i class="pi pi-image"></i>
                <span>Foto não disponível</span>
              </div>
            </div>

            <div class="space-info-section">
              <p class="space-description-text">
                {{ space.description || 'Espaço amplo e bem localizado, com excelente iluminação natural, estrutura moderna e fácil acesso a transporte público. O local oferece conforto e praticidade, copa e área para recepção ou sala de espera.' }}
              </p>

              <!-- Features Grid -->
              <div class="features-list">
                <div class="feature-row">
                  <div class="feature-item-detail">
                    <i class="pi pi-shield feature-icon-blue"></i>
                    <span>Piso antiderrapante</span>
                  </div>
                  <div class="feature-item-detail">
                    <i class="pi pi-wheelchair feature-icon-blue"></i>
                    <span>Acessibilidade</span>
                  </div>
                </div>
                <div class="feature-row">
                  <div class="feature-item-detail">
                    <i class="pi pi-home feature-icon-blue"></i>
                    <span>Bolas no local</span>
                  </div>
                  <div class="feature-item-detail">
                    <i class="pi pi-shield feature-icon-blue"></i>
                    <span>Segurança</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Booking and Payment Details -->
          <div class="booking-payment-column">
            <!-- Booking Details Section -->
            <div class="details-section">
              <h2 class="details-section-title">
                <span class="section-number-badge">1</span>
                Dados da reserva
              </h2>
              
              <div class="booking-details-grid">
                <div class="detail-item">
                  <span class="detail-label">Data:</span>
                  <span class="detail-value">{{ reservationData.date }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Tipo:</span>
                  <span class="detail-value">{{ space.type || 'Esporte' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Horas totais:</span>
                  <span class="detail-value">{{ reservationData.hours }}h</span>
                </div>
              </div>
            </div>

            <!-- Payment Method Section -->
            <div class="details-section">
              <h2 class="details-section-title">
                <span class="section-number-badge">2</span>
                Método de pagamento
              </h2>
              
              <div class="payment-methods-grid">
                <div 
                  class="payment-method-card" 
                  :class="{ active: selectedPaymentMethod === 'mastercard' }"
                  @click="selectedPaymentMethod = 'mastercard'"
                >
                  <div class="payment-card-icon mastercard-icon"></div>
                </div>
                <div 
                  class="payment-method-card" 
                  :class="{ active: selectedPaymentMethod === 'visa' }"
                  @click="selectedPaymentMethod = 'visa'"
                >
                  <div class="payment-card-icon visa-icon"></div>
                </div>
              </div>
            </div>

            <!-- Payment Summary -->
            <div class="payment-summary-section">
              <div class="payment-summary-item">
                <i class="pi pi-credit-card payment-summary-icon"></i>
                <div class="payment-summary-text">
                  <div class="payment-summary-title">Você pagará em 1x de R$ {{ finalPrice }}</div>
                  <div class="payment-summary-subtitle">Nubaris ***** 5555</div>
                </div>
                <button class="payment-edit-btn">Alterar pagamento</button>
              </div>

              <div class="customer-info-item">
                <i class="pi pi-user customer-info-icon"></i>
                <div class="customer-info-text">
                  <div class="customer-info-title">Marcos da Silva Santos | Mercado como igual ao pagador</div>
                  <div class="customer-info-subtitle">CPF 000.000.000-00</div>
                </div>
                <button class="customer-edit-btn">Editar dados</button>
              </div>

              <div class="user-review-section">
                <h3 class="user-review-title">Revisar Aluno Cadastrado</h3>
                <p class="user-review-subtitle">Analise e confirme os dados que será habilitado para este local</p>
                
                <div class="user-review-item">
                  <i class="pi pi-user user-review-icon"></i>
                  <div class="user-review-text">
                    <div class="user-review-name">Marcos da Silva Santos | Mercado como igual ao pagador</div>
                    <div class="user-review-cpf">CPF 000.000.000-00</div>
                  </div>
                  <button class="user-edit-btn">Editar aluno</button>
                </div>
              </div>

              <!-- Save Payment Data Toggle -->
              <div class="save-payment-toggle">
                <Checkbox 
                  v-model="savePaymentData" 
                  inputId="savePayment"
                  class="save-payment-checkbox"
                />
                <label for="savePayment" class="save-payment-label">
                  Salvar dados de pagamento
                </label>
              </div>

              <!-- Pay Button -->
              <Button 
                class="pay-button"
                @click="processPayment"
                :disabled="!selectedPaymentMethod || isProcessing"
                :loading="isProcessing"
              >
                PAGAR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Profile Modal -->
    <Dialog
      v-model:visible="showProfileModal"
      modal
      header="Perfil do Usuário"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <ProfileView @close="showProfileModal = false" />
    </Dialog>

    <!-- Auth Modal -->
    <AuthModal 
      v-model:visible="showAuthModal" 
      @authenticated="handleAuthenticated"
    />
  </div>
</template>

<script setup>
            <!-- Booking Details -->
            <div class="booking-details">
              <h2 class="section-title">
                <span class="section-number">1</span>
                Dados da reserva
              </h2>
              
              <div class="booking-info">
                <div class="info-row">
                  <span class="info-label">Data:</span>
                  <span class="info-value">{{ reservationData.date }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Espaço:</span>
                  <span class="info-value">{{ space.name || 'Nome do espaço' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Tipo:</span>
                  <span class="info-value">{{ space.type || 'Esporte' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Modalidade:</span>
                  <span class="info-value">{{ space.modality || 'Não especificada' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Horário:</span>
                  <span class="info-value">{{ reservationData.startTime }} - {{ reservationData.endTime }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Horas totais:</span>
                  <span class="info-value">{{ reservationData.hours }}</span>
                </div>
                <div v-if="reservationData.isRecurrent" class="info-row recurrence-info">
                  <span class="info-label">Tipo:</span>
                  <span class="info-value recurrence-badge">Reserva Recorrente (Semanal)</span>
                </div>
                <div v-if="reservationData.isRecurrent && reservationData.recurrenceDay" class="info-row">
                  <span class="info-label">Dia da Semana:</span>
                  <span class="info-value">{{ getDayName(reservationData.recurrenceDay) }}</span>
                </div>
                <div v-if="reservationData.isRecurrent && reservationData.occurrences" class="info-row">
                  <span class="info-label">Total de Ocorrências:</span>
                  <span class="info-value">{{ reservationData.occurrences }}</span>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="payment-method">
              <h2 class="section-title">
                <span class="section-number">2</span>
                Método de pagamento
              </h2>
              
              <div class="payment-options">
                <div 
                  class="payment-option" 
                  :class="{ active: selectedPaymentMethod === 'mastercard' }"
                  @click="selectedPaymentMethod = 'mastercard'"
                >
                  <div class="payment-card mastercard">
                    <div class="card-logo">
                      <div class="mastercard-circles">
                        <div class="circle red"></div>
                        <div class="circle yellow"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div 
                  class="payment-option" 
                  :class="{ active: selectedPaymentMethod === 'visa' }"
                  @click="selectedPaymentMethod = 'visa'"
                >
                  <div class="payment-card visa">
                    <span class="visa-text">****</span>
                  </div>
                </div>
                <div 
                  class="payment-option" 
                  :class="{ active: selectedPaymentMethod === 'pix' }"
                  @click="selectedPaymentMethod = 'pix'"
                >
                  <div class="payment-card pix">
                    <i class="pi pi-qrcode pix-icon-btn"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Summary -->
            <div class="payment-summary">
              <!-- Card Details -->
              <div class="card-details">
                <div class="card-info">
                  <div v-if="selectedPaymentMethod === 'mastercard'" class="mastercard-icon">
                    <div class="mastercard-circles small">
                      <div class="circle red"></div>
                      <div class="circle yellow"></div>
                    </div>
                  </div>
                  <div v-else-if="selectedPaymentMethod === 'visa'" class="visa-icon">
                    <span class="visa-small">****</span>
                  </div>
                  <div v-else-if="selectedPaymentMethod === 'pix'" class="pix-icon">
                    <i class="pi pi-qrcode"></i>
                  </div>
                  <div class="card-text">
                    <div v-if="selectedPaymentMethod === 'pix'" class="card-number">
                      Pagamento via PIX - Instantâneo
                    </div>
                    <div v-else class="card-number">
                      {{ getCardDisplayText() }}
                    </div>
                    <div v-if="selectedPaymentMethod !== 'pix'" class="card-holder">
                      {{ cardData.holder || 'Adicione seu cartão' }}
                    </div>
                    <div v-else class="card-holder">
                      Pagamento seguro e instantâneo
                    </div>
                  </div>
                  <button v-if="selectedPaymentMethod !== 'pix'" class="edit-link" @click="openCardModal">
                    Alterar pagamento
                  </button>
                  <span v-else class="pix-instruction">
                    Clique em pagar para gerar o QR code
                  </span>
                </div>
              </div>

              <!-- Billing Info -->
              <div class="billing-info">
                <div class="billing-icon">
                  <i class="pi pi-file-text"></i>
                </div>
                <div class="billing-text">
                  <div v-if="!showEditBilling">
                    <div class="billing-name">{{ billingData.name }}</div>
                    <div class="billing-cpf">CPF {{ billingData.cpf }}</div>
                  </div>
                  <div v-else class="edit-form">
                    <input 
                      v-model="billingData.name" 
                      type="text" 
                      placeholder="Nome completo"
                      class="edit-input"
                    />
                    <input 
                      v-model="billingData.cpf" 
                      type="text" 
                      placeholder="CPF"
                      class="edit-input"
                    />
                  </div>
                </div>
                <button class="edit-link" @click="toggleEditBilling">
                  {{ showEditBilling ? 'Salvar' : 'Editar dados' }}
                </button>
              </div>

              <!-- Review Section -->
              <div class="review-section">
                <div class="review-label">Revisar Aluno Cadastrado</div>
                <div class="review-text">Analise e confirme os dados que será cadastrado para esta turma.</div>
              </div>

              <!-- Student Info -->
              <div class="student-info">
                <div class="student-icon">
                  <i class="pi pi-user"></i>
                </div>
                <div class="student-text">
                  <div v-if="!showEditStudent">
                    <div class="student-name">{{ studentData.name }}</div>
                    <div class="student-cpf">CPF {{ studentData.cpf }}</div>
                  </div>
                  <div v-else class="edit-form">
                    <input 
                      v-model="studentData.name" 
                      type="text" 
                      placeholder="Nome do aluno"
                      class="edit-input"
                    />
                    <input 
                      v-model="studentData.cpf" 
                      type="text" 
                      placeholder="CPF do aluno"
                      class="edit-input"
                    />
                    <label class="checkbox-label">
                      <input 
                        type="checkbox" 
                        v-model="studentData.sameAsPayer"
                        @change="handleSameAsPayerChange"
                      />
                      <span>Mesmo dados do pagador</span>
                    </label>
                  </div>
                </div>
                <button class="edit-link" @click="toggleEditStudent">
                  {{ showEditStudent ? 'Salvar' : 'Editar aluno' }}
                </button>
              </div>

              <!-- Save Payment Info -->
              <div class="save-payment">
                <div class="toggle-container">
                  <input 
                    type="checkbox" 
                    id="save-payment-toggle" 
                    v-model="savePaymentData"
                    class="toggle-input"
                  />
                  <label for="save-payment-toggle" class="toggle-label">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <span class="save-payment-text">Salvar dados de pagamento</span>
              </div>

              <!-- Payment Button -->
              <div class="payment-action">
                <button class="payment-btn" @click="processPayment">
                  PAGAR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Auth Modal -->
    <div v-if="showAuthModal" class="modal-overlay" @click="showAuthModal = false">
      <div class="modal-container" @click.stop>
        <!-- Modal content would go here -->
        <p>Auth Modal Placeholder</p>
      </div>
    </div>

    <!-- Space Profile Modal -->
    <div v-if="showSpaceProfileModal" class="modal-overlay" @click="closeSpaceProfileModal">
      <div class="space-profile-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="pi pi-home"></i>
            {{ space.name || 'Perfil do Espaço' }}
          </h3>
          <button @click="closeSpaceProfileModal" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- Image Gallery -->
          <div class="space-gallery" v-if="space.photos && space.photos.length > 0">
            <div class="main-image">
              <img :src="selectedSpaceImage" :alt="space.name" class="gallery-main-img" />
            </div>
            <div class="gallery-thumbnails" v-if="space.photos.length > 1">
              <div 
                v-for="(photo, index) in space.photos" 
                :key="index"
                class="thumbnail"
                :class="{ active: selectedSpaceImage === photo }"
                @click="selectedSpaceImage = photo"
              >
                <img :src="photo" :alt="`Foto ${index + 1}`" />
              </div>
            </div>
          </div>
          
          <!-- Placeholder quando não há fotos -->
          <div v-else class="modal-image-placeholder">
            <i class="pi pi-image" style="color: #9ca3af !important;"></i>
            <span>Nenhuma foto disponível</span>
          </div>

          <!-- Space Details -->
          <div class="space-info">
            <div class="info-section">
              <h4 class="info-title">Descrição</h4>
              <p class="info-text">{{ space.description || 'Descrição não disponível.' }}</p>
            </div>

            <div class="info-section">
              <h4 class="info-title">Detalhes</h4>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Modalidade:</span>
                  <span class="detail-value">{{ space.modality || 'Não especificada' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Tipo:</span>
                  <span class="detail-value">{{ space.type || 'Não especificado' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Endereço:</span>
                  <span class="detail-value">{{ space.address || 'Endereço não informado' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Valor por hora:</span>
                  <span class="detail-value">R$ {{ space.hourlyRate?.toFixed(2) || '0,00' }}</span>
                </div>
              </div>
            </div>

            <!-- Features -->
            <div class="info-section" v-if="space.benefits && space.benefits.length > 0">
              <h4 class="info-title">Benefícios e Equipamentos</h4>
              <div class="benefits-grid">
                <div 
                  v-for="benefit in space.benefits" 
                  :key="benefit"
                  class="benefit-item"
                >
                  <i :class="getBenefitIcon(benefit)" class="benefit-icon"></i>
                  <span>{{ benefit }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeSpaceProfileModal" class="close-modal-btn">
            Fechar
          </button>
        </div>
      </div>
    </div>

    <!-- Card Edit Modal -->
    <div v-if="showCardModal" class="modal-overlay" @click="closeCardModal">
      <div class="card-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="pi pi-credit-card"></i>
            Dados do Cartão
          </h3>
          <button @click="closeCardModal" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveCardData" class="card-form">
            <div class="form-group">
              <label for="cardNumber">Número do Cartão</label>
              <input 
                id="cardNumber"
                v-model="cardData.number" 
                type="text" 
                placeholder="0000 0000 0000 0000"
                class="form-input"
                maxlength="19"
                @input="formatCardNumber"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="cardHolder">Nome do Portador</label>
              <input 
                id="cardHolder"
                v-model="cardData.holder" 
                type="text" 
                placeholder="Nome como está no cartão"
                class="form-input"
                required
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="cardExpiry">Validade</label>
                <input 
                  id="cardExpiry"
                  v-model="cardData.expiry" 
                  type="text" 
                  placeholder="MM/AA"
                  class="form-input"
                  maxlength="5"
                  @input="formatExpiry"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="cardCvv">CVV</label>
                <input 
                  id="cardCvv"
                  v-model="cardData.cvv" 
                  type="text" 
                  placeholder="123"
                  class="form-input"
                  maxlength="4"
                  required
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="installments">Parcelas</label>
              <select id="installments" v-model="cardData.installments" class="form-select">
                <option value="1">1x - À vista</option>
                <option value="2">2x de R$ 87,25</option>
                <option value="3">3x de R$ 58,17</option>
                <option value="6">6x de R$ 29,08</option>
                <option value="12">12x de R$ 14,54</option>
              </select>
            </div>
          </form>
        </div>
        
        <div class="modal-footer">
          <button @click="closeCardModal" class="cancel-btn">
            Cancelar
          </button>
          <button @click="saveCardData" class="save-btn">
            Salvar Cartão
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { redirectBasedOnUserType } from '../utils/navigationUtils.js';
import { useSpacesStore } from '../stores/spaces.js';
import { useAuthStore } from '../stores/auth.js';
import { useReservationsStore } from '../stores/reservations.js';
import { useTechnicianStore } from '../stores/technician.js';
import Button from 'primevue/button';

const router = useRouter();
const route = useRoute();
const spacesStore = useSpacesStore();
const authStore = useAuthStore();
const reservationsStore = useReservationsStore();
const technicianStore = useTechnicianStore();

const showAuthModal = ref(false);
const showSpaceProfileModal = ref(false);
const selectedSpaceImage = ref('');
const savePaymentData = ref(true);
// Get login state from authStore
const isLoggedIn = computed(() => authStore.isLoggedIn);

// Payment and user data
const selectedPaymentMethod = ref('mastercard');
const showEditPayment = ref(false);
const showEditBilling = ref(false);
const showEditStudent = ref(false);
const showCardModal = ref(false);

// Card data
const cardData = ref({
  number: '',
  holder: '',
  expiry: '',
  cvv: '',
  installments: 1
});

// User data
const billingData = ref({
  name: 'Marcia da Silva Santos',
  cpf: '000.000.000-00'
});

const studentData = ref({
  name: 'Marcia da Silva Santos',
  cpf: '000.000.000-00',
  sameAsPayer: true
});

// Space data from store
const space = ref({});
const reservationData = ref({});

// Load space data when component mounts
onMounted(async () => {
  // Carregar dados do usuário logado se disponível
  if (authStore.isAuthenticated && authStore.currentUser) {
    billingData.value.name = authStore.currentUser.fullName || '';
    billingData.value.cpf = authStore.currentUser.cpf || '';
    
    // Preencher dados do estudante com os mesmos dados por padrão
    studentData.value.name = authStore.currentUser.fullName || '';
    studentData.value.cpf = authStore.currentUser.cpf || '';
  }

  const spaceId = route.params.id || route.query.spaceId;
  if (spaceId) {
    const foundSpace = spacesStore.getSpaceById(parseInt(spaceId));
    if (foundSpace) {
      space.value = foundSpace;
      // Set first image as selected for modal
      if (foundSpace.photos && foundSpace.photos.length > 0) {
        selectedSpaceImage.value = foundSpace.photos[0];
      }
    }
  }
  
  // Get reservation data from route query or state
  reservationData.value = {
    date: route.query.date || '11/11/2025',
    startTime: route.query.startTime || '08:00',
    endTime: route.query.endTime || '15:00',
    hours: route.query.hours || '7h',
    isRecurrent: route.query.isRecurrent === 'true',
    recurrenceType: route.query.recurrenceType || 'none',
    recurrenceDay: route.query.recurrenceDay || ''
  };
});

const goBack = () => {
  // Tenta voltar uma página no histórico
  if (window.history.length > 1) {
    router.back();
  } else {
    // Se não há histórico, vai para a página de reserva do espaço
    const spaceId = route.params.id || route.query.spaceId;
    if (spaceId) {
      router.push(`/space-reservation/${spaceId}`);
    } else {
      // Como último recurso, vai para a página inicial
      router.push('/');
    }
  }
};

const processPayment = () => {
  console.log('Processando pagamento...');
  console.log('Método selecionado:', selectedPaymentMethod.value);
  console.log('Dados de cobrança:', billingData.value);
  console.log('Dados do aluno:', studentData.value);
  
  // Criar dados da reserva
  const reservationData = {
    spaceId: currentSpace.value?.id || 1,
    spaceName: currentSpace.value?.name || 'Espaço',
    date: route.query.date || new Date().toISOString().split('T')[0],
    startTime: route.query.startTime || '14:00',
    endTime: route.query.endTime || '16:00',
    userId: authStore.currentUser?.id || 'current-user',
    userName: authStore.currentUser?.name || studentData.value.name,
    userEmail: authStore.currentUser?.email || studentData.value.email || 'email@exemplo.com'
  };

  // Adicionar reserva ao store (status será "Pendente" por padrão)
  const newReservation = reservationsStore.addReservation(reservationData);
  
  // Sincronizar com agenda do técnico
  technicianStore.syncUserReservations();
  
  if (selectedPaymentMethod.value === 'pix') {
    alert(`Reserva criada com sucesso! Número da reserva: ${newReservation.id}. Status: ${newReservation.status}. Redirecionando para pagamento PIX...`);
  } else {
    alert(`Reserva criada com sucesso! Número da reserva: ${newReservation.id}. Status: ${newReservation.status}. Pagamento processado!`);
  }

  // Redirecionar para página inicial ou de reservas
  router.push('/');
};

// Payment and user data functions
const toggleEditBilling = () => {
  showEditBilling.value = !showEditBilling.value;
  if (!showEditBilling.value) {
    console.log('Dados de cobrança salvos:', billingData.value);
  }
};

const toggleEditStudent = () => {
  showEditStudent.value = !showEditStudent.value;
  if (!showEditStudent.value) {
    console.log('Dados do aluno salvos:', studentData.value);
  }
};

const handleSameAsPayerChange = () => {
  if (studentData.value.sameAsPayer) {
    studentData.value.name = billingData.value.name;
    studentData.value.cpf = billingData.value.cpf;
  }
};

// Card modal functions
const openCardModal = () => {
  showCardModal.value = true;
};

const closeCardModal = () => {
  showCardModal.value = false;
};

const saveCardData = () => {
  if (!cardData.value.number || !cardData.value.holder || !cardData.value.expiry || !cardData.value.cvv) {
    alert('Por favor, preencha todos os campos do cartão.');
    return;
  }
  
  console.log('Dados do cartão salvos:', cardData.value);
  closeCardModal();
  alert('Cartão salvo com sucesso!');
};

const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\s/g, '').replace(/\D/g, '');
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
  cardData.value.number = value;
};

const formatExpiry = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  cardData.value.expiry = value;
};

const getCardDisplayText = () => {
  if (!cardData.value.number) {
    return `${selectedPaymentMethod.value === 'visa' ? 'Visa' : 'Mastercard'} - Adicione seu cartão`;
  }
  
  const lastFour = cardData.value.number.slice(-4);
  const brand = selectedPaymentMethod.value === 'visa' ? 'Visa' : 'Mastercard';
  const installmentText = cardData.value.installments > 1 
    ? `${cardData.value.installments}x de R$ ${(174.50 / cardData.value.installments).toFixed(2)}`
    : 'À vista - R$ 174,50';
  
  return `${brand} **** ${lastFour} - ${installmentText}`;
};

const handleProfileClick = () => {
  console.log('handleProfileClick executado');
  console.log('isLoggedIn:', isLoggedIn.value);
  console.log('authStore.isAuthenticated:', authStore.isAuthenticated);
  console.log('authStore.currentUser:', authStore.currentUser);
  
  if (isLoggedIn.value) {
    console.log('Usuário logado, redirecionando...');
    const userType = authStore.currentUser?.type || 'client';
    console.log('Tipo do usuário:', userType);
    redirectBasedOnUserType(userType, router);
  } else {
    console.log('Usuário não logado, abrindo modal de auth...');
    showAuthModal.value = true;
  }
};

const handleAuthClick = () => {
  if (isLoggedIn.value) {
    authStore.logout();
    console.log('Usuário deslogado');
  } else {
    showAuthModal.value = true;
  }
};

const getDayName = (dayNumber) => {
  const days = {
    '0': 'Domingo',
    '1': 'Segunda-feira',
    '2': 'Terça-feira',
    '3': 'Quarta-feira',
    '4': 'Quinta-feira',
    '5': 'Sexta-feira',
    '6': 'Sábado'
  };
  return days[dayNumber] || 'Dia não especificado';
};

// Space Profile Modal Functions
const openSpaceProfileModal = () => {
  showSpaceProfileModal.value = true;
  console.log('Abrindo modal de perfil do espaço:', space.value);
};

const closeSpaceProfileModal = () => {
  showSpaceProfileModal.value = false;
};

// Function to get benefit icons
const getBenefitIcon = (benefit) => {
  const iconMap = {
    'Piso antiderrapante': 'pi pi-shield',
    'Piso oficial': 'pi pi-check',
    'Grama sintética': 'pi pi-star',
    'Areia importada': 'pi pi-sun',
    'Piso saibro': 'pi pi-circle',
    'Acessível': 'pi pi-wheelchair',
    'Sistema de segurança': 'pi pi-shield',
    'Segurança': 'pi pi-shield', 
    'Material esportivo': 'pi pi-home',
    'Equipamentos': 'pi pi-cog',
    'Vestiário': 'pi pi-user',
    'Chuveiro': 'pi pi-refresh',
    'Iluminação LED': 'pi pi-sun',
    'Iluminação noturna': 'pi pi-moon',
    'Lanchonete': 'pi pi-shopping-cart',
    'Bar na praia': 'pi pi-glass',
    'Aquecida': 'pi pi-sun',
    'Climatização': 'pi pi-refresh',
    'Cronometragem': 'pi pi-clock',
    'Salva-vidas': 'pi pi-heart',
    'Área VIP': 'pi pi-star',
    'Placar eletrônico': 'pi pi-desktop',
    'Sistema de som': 'pi pi-volume-up'
  };
  
  return iconMap[benefit] || 'pi pi-check';
};
</script>

<style scoped>
/* Header Styles */
.back-btn {
  background: #3b82f6 !important;
  border: none !important;
  border-radius: 6px !important;
  color: white !important;
  padding: 8px !important;
  width: 40px !important;
  height: 40px !important;
}

.profile-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.profile-btn:hover {
  background: #e5e7eb;
}

.profile-photo-mini {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.profile-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-btn {
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.header-btn:hover {
  background: #16a34a;
}

.logout-btn {
  background: #ef4444;
}

.logout-btn:hover {
  background: #dc2626;
}

/* Main Layout */
.payment-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #f9fafb;
  min-height: calc(100vh - 80px);
}

.payment-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.payment-page-title {
  font-size: 2rem;
  font-weight: 400;
  color: #374151;
  margin-bottom: 2rem;
  text-align: left;
}

/* Content Layout */
.payment-content-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

/* Left Column - Space Details */
.space-details-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.space-image-container {
  width: 100%;
  aspect-ratio: 16/9;
  max-height: 300px;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
}

.space-detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.space-detail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 0.9rem;
}

.space-detail-placeholder i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.space-info-section {
  flex: 1;
}

.space-description-text {
  color: #6b7280;
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

/* Features List */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.feature-item-detail {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #374151;
}

.feature-icon-blue {
  color: #3b82f6;
  font-size: 1.1rem;
  width: 20px;
  flex-shrink: 0;
}

/* Right Column - Booking and Payment */
.booking-payment-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Details Sections */
.details-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.details-section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
}

.section-number-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 700;
}

/* Booking Details Grid */
.booking-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #6b7280;
}

.detail-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

/* Payment Methods */
.payment-methods-grid {
  display: flex;
  gap: 1rem;
}

.payment-method-card {
  width: 80px;
  height: 50px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.payment-method-card:hover {
  border-color: #3b82f6;
}

.payment-method-card.active {
  border-color: #1d4ed8;
  background: #eff6ff;
}

.payment-card-icon {
  width: 60px;
  height: 35px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.mastercard-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 50'%3E%3Crect width='80' height='50' fill='%23000'/%3E%3Ccircle cx='30' cy='25' r='15' fill='%23ff5f00'/%3E%3Ccircle cx='50' cy='25' r='15' fill='%23eb001b'/%3E%3C/svg%3E");
}

.visa-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 50'%3E%3Crect width='80' height='50' fill='%231a1f71'/%3E%3Ctext x='40' y='30' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EVISA%3C/text%3E%3C/svg%3E");
}

/* Payment Summary Section */
.payment-summary-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.payment-summary-item,
.customer-info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.payment-summary-icon,
.customer-info-icon {
  color: #6b7280;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.payment-summary-text,
.customer-info-text {
  flex: 1;
}

.payment-summary-title,
.customer-info-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.payment-summary-subtitle,
.customer-info-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
}

.payment-edit-btn,
.customer-edit-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.8rem;
  cursor: pointer;
  text-decoration: underline;
  flex-shrink: 0;
}

.payment-edit-btn:hover,
.customer-edit-btn:hover {
  color: #1d4ed8;
}

/* User Review Section */
.user-review-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
}

.user-review-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.user-review-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.user-review-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f9fafb;
}

.user-review-icon {
  color: #6b7280;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.user-review-text {
  flex: 1;
}

.user-review-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.user-review-cpf {
  font-size: 0.8rem;
  color: #6b7280;
}

.user-edit-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.8rem;
  cursor: pointer;
  text-decoration: underline;
  flex-shrink: 0;
}

.user-edit-btn:hover {
  color: #1d4ed8;
}

/* Save Payment Toggle */
.save-payment-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
}

.save-payment-label {
  font-size: 0.9rem;
  color: #374151;
  cursor: pointer;
}

.save-payment-checkbox {
  margin: 0;
}

/* Pay Button */
.pay-button {
  background: #22c55e !important;
  color: white !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 1rem 2rem !important;
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  width: 100% !important;
  margin-top: 1rem !important;
}

.pay-button:hover {
  background: #16a34a !important;
}

.pay-button:disabled {
  background: #9ca3af !important;
  cursor: not-allowed !important;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .payment-content-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .booking-details-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .feature-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .payment-main {
    padding: 1rem;
  }
  
  .payment-container {
    padding: 1rem;
  }
  
  .payment-page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .booking-details-grid {
    grid-template-columns: 1fr;
  }
  
  .payment-methods-grid {
    flex-direction: column;
    align-items: center;
  }
}
}

.modal-image-placeholder i.pi.pi-image.pi-image.pi-image {
  color: #9ca3af !important;
}

/* Header Styles */
.profile-btn {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 50%;
  padding: 8px;
  width: 40px;
  height: 40px;
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.profile-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
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
  background-color: #164194;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  height: 40px;
  min-width: 80px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.header-btn:hover {
  background-color: #113375;
}

.logout-btn {
  background-color: #dc2626;
}

.logout-btn:hover {
  background-color: #b91c1c;
}

/* Main Content */
.page-title {
  font-size: 32px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 32px;
  text-align: left;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background-color: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Space Section */
.space-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.space-name {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
}

.space-image {
  width: 100%;
  height: 200px;
  background-color: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.space-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.space-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #9ca3af;
  font-size: 14px;
}

.space-placeholder i {
  font-size: 32px;
  color: #9ca3af !important; /* Força a cor cinza */
}

/* Forçar cor cinza para ícones pi-image especificamente - múltiplos seletores */
.space-placeholder i.pi.pi-image,
.space-placeholder .pi.pi-image,
i.pi.pi-image.pi-image,
.pi.pi-image {
  color: #9ca3af !important;
}

/* Sobrescrever qualquer estilo do PrimeVue com pseudo-elementos */
.space-placeholder .pi::before,
.space-placeholder i.pi::before,
i.pi.pi-image::before {
  color: #9ca3af !important;
}

.space-description {
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
  margin: 0;
  text-align: justify;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

.feature-icon {
  color: #4CAF50;
  font-size: 16px;
}

/* Booking Section */
.booking-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.section-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #164194;
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
}

/* Booking Details */
.booking-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.info-label {
  font-size: 14px;
  color: #6b7280;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.recurrence-info {
  background-color: #f0f9ff;
  border-radius: 6px;
  padding: 8px 12px;
  margin-top: 8px;
}

.recurrence-badge {
  background-color: #164194;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

/* Payment Method */
.payment-options {
  display: flex;
  gap: 16px;
}

.payment-option {
  padding: 4px;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-option.active {
  border-color: #164194;
}

.payment-card {
  width: 80px;
  height: 50px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.payment-card.mastercard {
  background: linear-gradient(135deg, #ff5f00 0%, #eb001b 50%, #f79e1b 100%);
}

.payment-card.visa {
  background-color: #1a1f71;
  color: white;
}

.payment-card.pix {
  background-color: white;
  border: 2px solid #00BB8B;
  color: #00BB8B;
  font-weight: bold;
}

.pix-icon-btn {
  font-size: 24px;
  color: #00BB8B;
}

.pix-text {
  font-size: 14px;
  font-weight: bold;
}

.pix-icon {
  color: #00BB8B;
  font-size: 18px;
}

.visa-icon {
  color: #1a1f71;
  font-size: 12px;
}

.visa-small {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  font-weight: bold;
}

.mastercard-circles {
  display: flex;
  align-items: center;
  gap: -8px;
}

.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  opacity: 0.8;
}

.circle.red {
  background-color: #eb001b;
  z-index: 1;
}

.circle.yellow {
  background-color: #f79e1b;
  margin-left: -8px;
}

.visa-text {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
}

/* Payment Summary */
.payment-summary {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card-details {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mastercard-icon {
  display: flex;
  align-items: center;
}

.mastercard-icon .mastercard-circles.small {
  transform: scale(0.6);
}

.mastercard-icon .mastercard-circles.small .circle {
  width: 16px;
  height: 16px;
}

.card-text {
  flex: 1;
}

.card-number {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.card-holder {
  font-size: 12px;
  color: #6b7280;
}

.edit-link {
  background: none;
  border: none;
  color: #164194;
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.edit-link:hover {
  color: #113375;
}

.pix-instruction {
  font-size: 12px;
  color: #00BB8B;
  font-weight: 500;
  font-style: italic;
}

/* Billing Info */
.billing-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.billing-icon {
  color: #6b7280;
  font-size: 18px;
}

.billing-text {
  flex: 1;
}

.billing-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.billing-cpf {
  font-size: 12px;
  color: #6b7280;
}

/* Review Section */
.review-section {
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
}

.review-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.review-text {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

/* Student Info */
.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.student-icon {
  color: #6b7280;
  font-size: 18px;
}

.student-text {
  flex: 1;
}

.student-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.student-cpf {
  font-size: 12px;
  color: #6b7280;
}

/* Edit Forms */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.edit-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  transition: border-color 0.2s ease;
}

.edit-input:focus {
  outline: none;
  border-color: #164194;
  box-shadow: 0 0 0 3px rgba(22, 65, 148, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #164194;
}

.same-payer {
  color: #4CAF50;
  font-size: 12px;
  font-weight: normal;
}

/* Save Payment Toggle */
.save-payment {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
}

.toggle-container {
  position: relative;
}

.toggle-input {
  display: none;
}

.toggle-label {
  display: block;
  width: 44px;
  height: 24px;
  background-color: #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked + .toggle-label {
  background-color: #4CAF50;
}

.toggle-input:checked + .toggle-label .toggle-slider {
  transform: translateX(20px);
}

.save-payment-text {
  font-size: 14px;
  color: #374151;
}

/* Payment Button */
.payment-action {
  margin-top: 16px;
}

.payment-btn {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 18px 16px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.payment-btn:hover {
  background-color: #388E3C;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
}

/* Space Profile Modal Styles */
.space-profile-modal {
  background-color: white;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Garantir que todos os ícones no modal tenham cor padrão cinza */
.space-profile-modal i {
  color: #6b7280 !important;
}

/* Exceção para ícones específicos que precisam de cores diferentes */
.space-profile-modal .close-btn i {
  color: #6b7280 !important;
}

.space-profile-modal .close-btn:hover i {
  color: #374151 !important;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.space-gallery {
  margin-bottom: 24px;
}

.modal-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: #f9fafb;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  margin-bottom: 24px;
  gap: 8px;
  color: #9ca3af;
  font-size: 14px;
}

.modal-image-placeholder i {
  font-size: 48px;
  color: #9ca3af !important;
}

/* Garantir que TODOS os ícones pi-image sejam cinzas */
i.pi.pi-image,
.pi.pi-image,
[class*="pi-image"] {
  color: #9ca3af !important;
}

/* Forçar também o pseudo-elemento ::before dos ícones */
i.pi.pi-image::before,
.pi.pi-image::before,
[class*="pi-image"]::before {
  color: #9ca3af !important;
}

.main-image {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.gallery-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-thumbnails {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
}

.thumbnail {
  min-width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.thumbnail.active {
  border-color: #164194;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.space-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-section {
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.info-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.info-text {
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
  margin: 0;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
}

.benefit-icon {
  color: #4CAF50;
  font-size: 16px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.close-modal-btn {
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-modal-btn:hover {
  background-color: #4b5563;
}

/* Card Modal Styles */
.card-modal {
  background-color: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.card-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-input, .form-select {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s ease;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #164194;
  box-shadow: 0 0 0 3px rgba(22, 65, 148, 0.1);
}

.form-select {
  background-color: white;
  cursor: pointer;
}

.cancel-btn {
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: #4b5563;
}

.save-btn {
  background-color: #164194;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn:hover {
  background-color: #113375;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
    margin-bottom: 24px;
  }
  
  .content-container {
    padding: 24px;
    margin: 0 -16px;
    border-radius: 0;
  }
  
  .section-title {
    font-size: 16px;
  }
  
  .booking-section {
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .payment-options {
    flex-direction: column;
    align-items: center;
  }
  
  .card-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .billing-info,
  .student-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .edit-link {
    align-self: flex-end;
  }
}
</style>
