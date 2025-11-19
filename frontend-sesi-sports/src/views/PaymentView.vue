<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="payment-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <i class="pi pi-chevron-left"></i>
        </button>
        <img src="/sesi-sports-logo.png" alt="SESI Sports" class="header-logo" />
      </div>
      <div class="header-actions">
        <button class="profile-btn" @click="handleProfileClick">
          <i class="pi pi-user"></i>
        </button>
        <button class="logout-btn" @click="handleAuthClick">
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
                v-if="space.photos && space.photos[currentImageIndex]" 
                :src="space.photos[currentImageIndex]" 
                :alt="space.name || 'Espaço'"
                class="space-detail-image"
              />
              <div v-else class="space-detail-placeholder">
                <i class="pi pi-image"></i>
                <span>Foto não disponível</span>
              </div>
              
              <!-- Image Counter -->
              <div v-if="space.photos && space.photos.length > 1" class="image-counter">
                {{ currentImageIndex + 1 }} / {{ space.photos.length }}
              </div>

              <!-- Navigation buttons on hover -->
              <div v-if="space.photos && space.photos.length > 1" class="image-nav-overlay">
                <button 
                  class="image-nav-btn image-nav-prev"
                  @click="previousMainImage"
                  :disabled="currentImageIndex === 0"
                >
                  <i class="pi pi-chevron-left"></i>
                </button>
                <button 
                  class="image-nav-btn image-nav-next"
                  @click="nextMainImage"
                  :disabled="currentImageIndex === space.photos.length - 1"
                >
                  <i class="pi pi-chevron-right"></i>
                </button>
              </div>
            </div>

            <!-- Thumbnails -->
            <div v-if="space.photos && space.photos.length > 1" class="thumbnails-container">
              <div 
                v-for="(photo, index) in space.photos" 
                :key="index"
                class="thumbnail-item"
                :class="{ active: currentImageIndex === index }"
                @click="currentImageIndex = index"
              >
                <img :src="photo" :alt="`${space.name} - Imagem ${index + 1}`" />
              </div>
            </div>

            <div class="space-info-section">
              <p class="space-description-text">
                {{ space.description || 'Espaço amplo e bem localizado, com excelente iluminação natural, estrutura moderna e fácil acesso a transporte público. O local oferece conforto e praticidade, copa e área para recepção ou sala de espera.' }}
              </p>

              <!-- Features Grid -->
              <div class="features-list">
                <div class="feature-row" v-if="getSpaceFeatures().length > 0">
                  <div 
                    class="feature-item-detail"
                    v-for="(feature, index) in getSpaceFeatures().slice(0, 4)" 
                    :key="index"
                  >
                    <i :class="feature.icon + ' feature-icon-blue'"></i>
                    <span>{{ feature.name }}</span>
                  </div>
                </div>
                <!-- Fallback se não houver features específicas -->
                <div class="feature-row" v-else>
                  <div class="feature-item-detail">
                    <i class="pi pi-shield feature-icon-blue"></i>
                    <span>Piso antiderrapante</span>
                  </div>
                  <div class="feature-item-detail">
                    <i class="accessibility-icon feature-icon-blue"></i>
                    <span>Acessibilidade</span>
                  </div>
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
                  <span class="detail-label">Horário:</span>
                  <span class="detail-value">{{ reservationData.startTime }} - {{ reservationData.endTime }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Horas totais:</span>
                  <span class="detail-value">{{ getFormattedHours() }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Espaço:</span>
                  <span class="detail-value">{{ space.name || 'Espaço Esportivo' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Tipo:</span>
                  <span class="detail-value">{{ space.type || space.category || 'Esporte' }}</span>
                </div>
                <div class="detail-item" v-if="space.modality">
                  <span class="detail-label">Modalidade:</span>
                  <span class="detail-value">{{ space.modality }}</span>
                </div>
                <div class="detail-item" v-if="reservationData.isRecurrent">
                  <span class="detail-label">Recorrência:</span>
                  <span class="detail-value">{{ getRecurrenceText() }}</span>
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
                <div 
                  class="payment-method-card" 
                  :class="{ active: selectedPaymentMethod === 'pix' }"
                  @click="selectedPaymentMethod = 'pix'; console.log('PIX selecionado:', selectedPaymentMethod)"
                >
                  <div class="payment-card-icon pix-icon"></div>
                </div>
              </div>
            </div>

            <!-- Payment Summary -->
            <div class="payment-summary-section">
              <div class="payment-summary-item">
                <i class="pi pi-credit-card payment-summary-icon"></i>
                <div class="payment-summary-text">
                  <div class="payment-summary-title">
                    <span v-if="reservationData.isRecurrent">
                      Você pagará em 1x de R$ {{ finalPrice }} ({{ getFormattedHours() }} x 4 semanas)
                    </span>
                    <span v-else>
                      Você pagará em 1x de R$ {{ finalPrice }} ({{ getFormattedHours() }} x R$ {{ space.pricePerHour || space.price || '50' }})
                    </span>
                  </div>
                  <div class="payment-summary-subtitle">{{ getPaymentMethodText() }}</div>
                </div>
                <button class="payment-edit-btn" @click="editPaymentData">Alterar pagamento</button>
              </div>

              <div class="customer-info-item">
                <i class="pi pi-user customer-info-icon"></i>
                <div class="customer-info-text">
                  <div class="customer-info-title">
                    {{ getUserDisplayName() }} | {{ getPayerTypeText() }}
                  </div>
                  <div class="customer-info-subtitle">CPF {{ getFormattedCPF() }}</div>
                </div>
                <button class="customer-edit-btn" @click="editCustomerData">Editar dados</button>
              </div>

              <div class="user-review-section">
                <h3 class="user-review-title">Revisar Aluno Cadastrado</h3>
                <p class="user-review-subtitle">Analise e confirme os dados que será habilitado para este local</p>
                
                <div class="user-review-item">
                  <i class="pi pi-user user-review-icon"></i>
                  <div class="user-review-text">
                    <div class="user-review-name">
                      {{ getStudentDisplayName() }} | {{ getStudentRelationshipText() }}
                    </div>
                    <div class="user-review-cpf">CPF {{ getStudentFormattedCPF() }}</div>
                  </div>
                  <button class="user-edit-btn" @click="editStudentData">Editar aluno</button>
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

    <!-- Customer Edit Modal -->
    <div v-if="showCustomerEditModal" class="modal-overlay" @click="closeCustomerModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Editar Dados do Pagador</h3>
          <button @click="closeCustomerModal" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveCustomerData" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nome Completo</label>
              <input 
                type="text" 
                v-model="editingCustomer.name" 
                class="form-input"
                placeholder="Digite o nome completo"
                required
              />
            </div>
            <div class="form-group">
              <label>CPF</label>
              <input 
                type="text" 
                v-model="editingCustomer.cpf" 
                class="form-input"
                placeholder="000.000.000-00"
                @input="formatCPF"
                required
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Email</label>
              <input 
                type="email" 
                v-model="editingCustomer.email" 
                class="form-input"
                placeholder="email@exemplo.com"
                required
              />
            </div>
            <div class="form-group">
              <label>Telefone</label>
              <input 
                type="text" 
                v-model="editingCustomer.phone" 
                class="form-input"
                placeholder="(00) 00000-0000"
                @input="formatPhone"
                required
              />
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="cancelCustomerEdit">
              Cancelar
            </button>
            <button type="submit" class="submit-btn">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Student Edit Modal -->
    <div v-if="showStudentEditModal" class="modal-overlay" @click="closeStudentModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Editar Dados do Aluno</h3>
          <button @click="closeStudentModal" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveStudentData" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nome Completo</label>
              <input 
                type="text" 
                v-model="editingStudent.name" 
                class="form-input"
                placeholder="Digite o nome completo"
                required
              />
            </div>
            <div class="form-group">
              <label>CPF</label>
              <input 
                type="text" 
                v-model="editingStudent.cpf" 
                class="form-input"
                placeholder="000.000.000-00"
                @input="formatStudentCPF"
                required
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Data de Nascimento</label>
              <input 
                type="date" 
                v-model="editingStudent.birthDate" 
                class="form-input"
                required
              />
            </div>
            <div class="form-group">
              <label>Parentesco</label>
              <select v-model="editingStudent.relationship" class="form-input" required>
                <option value="">Selecione o parentesco</option>
                <option value="proprio">Próprio usuário</option>
                <option value="filho">Filho(a)</option>
                <option value="conjuge">Cônjuge</option>
                <option value="pai">Pai</option>
                <option value="mae">Mãe</option>
                <option value="irmao">Irmão/Irmã</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="cancelStudentEdit">
              Cancelar
            </button>
            <button type="submit" class="submit-btn">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Payment Edit Modal -->
    <div v-if="showPaymentEditModal" class="modal-overlay" @click="closePaymentModal">
      <div class="modal-content modal-content-large" @click.stop>
        <div class="modal-header">
          <h3>Editar Dados de Pagamento</h3>
          <button @click="closePaymentModal" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="savePaymentMethodData" class="modal-form">
          <!-- Payment Method Selection -->
          <div class="form-group">
            <label>Método de Pagamento</label>
            <div class="payment-methods-edit-grid">
              <div 
                class="payment-method-edit-card" 
                :class="{ active: editingPayment.method === 'mastercard' }"
                @click="editingPayment.method = 'mastercard'"
              >
                <div class="payment-card-icon mastercard-icon"></div>
                <span>Mastercard</span>
              </div>
              <div 
                class="payment-method-edit-card" 
                :class="{ active: editingPayment.method === 'visa' }"
                @click="editingPayment.method = 'visa'"
              >
                <div class="payment-card-icon visa-icon"></div>
                <span>Visa</span>
              </div>
              <div 
                class="payment-method-edit-card" 
                :class="{ active: editingPayment.method === 'pix' }"
                @click="editingPayment.method = 'pix'"
              >
                <div class="payment-card-icon pix-icon"></div>
                <span>PIX</span>
              </div>
            </div>
          </div>

          <!-- Card Details (only for card payments) -->
          <div v-if="editingPayment.method === 'mastercard' || editingPayment.method === 'visa'" class="card-details-section">
            <h4 class="card-details-title">Dados do Cartão</h4>
            
            <div class="form-group">
              <label>Número do Cartão</label>
              <input 
                type="text" 
                v-model="editingPayment.cardNumber" 
                class="form-input"
                placeholder="0000 0000 0000 0000"
                @input="formatCardNumber"
                maxlength="19"
                required
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Data de Expiração</label>
                <input 
                  type="text" 
                  v-model="editingPayment.expiryDate" 
                  class="form-input"
                  placeholder="MM/AA"
                  @input="formatExpiryDate"
                  maxlength="5"
                  required
                />
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input 
                  type="text" 
                  v-model="editingPayment.cvv" 
                  class="form-input"
                  placeholder="123"
                  maxlength="4"
                  required
                />
              </div>
            </div>
            
            <div class="form-group">
              <label>Nome no Cartão</label>
              <input 
                type="text" 
                v-model="editingPayment.cardholderName" 
                class="form-input"
                placeholder="Nome como está no cartão"
                required
              />
            </div>
          </div>

          <!-- PIX Details -->
          <div v-if="editingPayment.method === 'pix'" class="pix-details-section">
            <h4 class="pix-details-title">Pagamento via PIX</h4>
            <p class="pix-details-description">
              O pagamento será processado via PIX. Você receberá um QR Code para efetuar o pagamento.
            </p>
            <div class="pix-advantages">
              <div class="pix-advantage-item">
                <i class="pi pi-check-circle"></i>
                <span>Pagamento instantâneo</span>
              </div>
              <div class="pix-advantage-item">
                <i class="pi pi-shield"></i>
                <span>100% seguro</span>
              </div>
              <div class="pix-advantage-item">
                <i class="pi pi-clock"></i>
                <span>Disponível 24/7</span>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="cancelPaymentEdit">
              Cancelar
            </button>
            <button type="submit" class="submit-btn">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Auth Modal -->
    <AuthModal 
      v-model:visible="showAuthModal" 
      @authenticated="handleAuthenticated"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSpacesStore } from '../stores/spaces.js';
import { useAuthStore } from '../stores/auth.js';
import { useReservationsStore } from '../stores/reservations.js';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import AuthModal from '../components/auth/AuthModal.vue';
import ProfileView from './ProfileView.vue';

// Stores
const spacesStore = useSpacesStore();
const authStore = useAuthStore();
const reservationsStore = useReservationsStore();
const router = useRouter();
const route = useRoute();

// Reactive data
const space = ref({});
const reservationData = ref({});
const selectedPaymentMethod = ref('');
const savePaymentData = ref(false);
const isProcessing = ref(false);
const showProfileModal = ref(false);
const showAuthModal = ref(false);
const showPaymentProcessingModal = ref(false);
const showSuccessModal = ref(false);
const paymentStatus = ref(''); // 'processing', 'success', 'error'

// Image gallery
const currentImageIndex = ref(0);

// Customer and student data
const showCustomerEditModal = ref(false);
const showStudentEditModal = ref(false);
const showPaymentEditModal = ref(false);
const customerData = ref({
  name: '',
  cpf: '',
  email: '',
  phone: ''
});
const studentData = ref({
  name: '',
  cpf: '',
  birthDate: '',
  relationship: ''
});
const paymentData = ref({
  method: 'mastercard',
  cardNumber: '**** **** **** 5555',
  cardholderName: 'MARCOS DA SILVA SANTOS',
  expiryDate: '12/28',
  cvv: '***'
});
const editingCustomer = ref({});
const editingStudent = ref({});
const editingPayment = ref({});

// Computed
const isLoggedIn = computed(() => authStore.isAuthenticated);
const finalPrice = computed(() => {
  const hours = parseFloat(reservationData.value.hours) || 1;
  const pricePerHour = parseFloat(space.value.pricePerHour) || parseFloat(space.value.price) || 50;
  const totalPrice = hours * pricePerHour;
  
  // Se é recorrente, calcular para múltiplas semanas (exemplo: 4 semanas)
  if (reservationData.value.isRecurrent) {
    const weeks = 4; // Padrão de 4 semanas
    return (totalPrice * weeks).toFixed(2);
  }
  
  return totalPrice.toFixed(2);
});

const pricePerSession = computed(() => {
  const hours = parseFloat(reservationData.value.hours) || 1;
  const pricePerHour = parseFloat(space.value.pricePerHour) || parseFloat(space.value.price) || 50;
  return (hours * pricePerHour).toFixed(2);
});

// Função auxiliar para obter o preço total (usada na navegação PIX)
const getTotalPrice = () => {
  return finalPrice.value;
};

// Methods
const goBack = () => {
  router.go(-1);
};

const handleProfileClick = () => {
  if (isLoggedIn.value) {
    router.push('/profile');
  } else {
    showAuthModal.value = true;
  }
};

const handleAuthClick = () => {
  if (isLoggedIn.value) {
    authStore.logout();
    router.push('/');
  } else {
    showAuthModal.value = true;
  }
};

const handleAuthenticated = () => {
  showAuthModal.value = false;
  showProfileModal.value = true;
};

const getSpaceFeatures = () => {
  const features = [];
  
  // Mapear características do espaço para ícones
  const featureMap = {
    'Acessível': { name: 'Acessibilidade', icon: 'accessibility-icon' },
    'Acessibilidade': { name: 'Acessibilidade', icon: 'accessibility-icon' },
    'Sistema de segurança': { name: 'Segurança', icon: 'pi pi-shield' },
    'Segurança': { name: 'Segurança', icon: 'pi pi-shield' },
    'Material esportivo': { name: 'Bolas no local', icon: 'pi pi-circle' },
    'Equipamentos': { name: 'Equipamentos', icon: 'pi pi-cog' },
    'Vestiário': { name: 'Vestiário', icon: 'pi pi-building' },
    'Lanchonete': { name: 'Lanchonete', icon: 'pi pi-shopping-cart' },
    'Cobertura': { name: 'Cobertura', icon: 'pi pi-home' },
    'Iluminação LED': { name: 'Iluminação LED', icon: 'pi pi-sun' },
    'Arquibancada': { name: 'Arquibancada', icon: 'pi pi-users' },
    'Climatização': { name: 'Climatização', icon: 'pi pi-refresh' }
  };
  
  // Adicionar características baseadas nos benefícios do espaço
  if (space.value.benefits && Array.isArray(space.value.benefits)) {
    space.value.benefits.forEach(benefit => {
      if (featureMap[benefit]) {
        features.push(featureMap[benefit]);
      }
    });
  }
  
  // Se não há benefícios, usar características padrão
  if (features.length === 0) {
    features.push(
      { name: 'Piso antiderrapante', icon: 'pi pi-shield' },
      { name: 'Acessibilidade', icon: 'accessibility-icon' },
      { name: 'Material esportivo', icon: 'pi pi-circle' },
      { name: 'Segurança', icon: 'pi pi-lock' }
    );
  }
  
  return features.slice(0, 4); // Máximo 4 características
};

const getRecurrenceText = () => {
  if (!reservationData.value.isRecurrent) return '';
  
  const dayNames = {
    '0': 'Domingo',
    '1': 'Segunda-feira', 
    '2': 'Terça-feira',
    '3': 'Quarta-feira',
    '4': 'Quinta-feira',
    '5': 'Sexta-feira',
    '6': 'Sábado'
  };
  
  const dayName = dayNames[reservationData.value.recurrenceDay] || 'Semanal';
  return `Semanal - ${dayName}`;
};

const getFormattedHours = () => {
  const hours = reservationData.value.hours || '2';
  // Remove 'h' se já existir e adiciona apenas um 'h'
  const cleanHours = hours.toString().replace(/h+$/i, '');
  return `${cleanHours}h`;
};

// Image gallery functions
const nextMainImage = () => {
  if (space.value.photos && currentImageIndex.value < space.value.photos.length - 1) {
    currentImageIndex.value++;
  }
};

const previousMainImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

// Customer data functions
const getUserDisplayName = () => {
  if (authStore.isAuthenticated && authStore.currentUser) {
    return authStore.currentUser.name || 'Usuário';
  }
  return customerData.value.name || 'Marcos da Silva Santos';
};

const getFormattedCPF = () => {
  if (authStore.isAuthenticated && authStore.currentUser) {
    return formatCPFDisplay(authStore.currentUser.cpf) || '000.000.000-00';
  }
  return formatCPFDisplay(customerData.value.cpf) || '000.000.000-00';
};

const getPayerTypeText = () => {
  return 'Mercado como igual ao pagador';
};

const getPaymentMethodText = () => {
  if (paymentData.value.method === 'pix') {
    return 'PIX - Pagamento instantâneo';
  } else if (paymentData.value.method === 'visa') {
    return `Visa ${paymentData.value.cardNumber}`;
  } else {
    return `Mastercard ${paymentData.value.cardNumber}`;
  }
};

// Student data functions
const getStudentDisplayName = () => {
  if (studentData.value.name) {
    return studentData.value.name;
  }
  if (authStore.isAuthenticated && authStore.currentUser) {
    return authStore.currentUser.name || 'Usuário';
  }
  return 'Marcos da Silva Santos';
};

const getStudentFormattedCPF = () => {
  if (studentData.value.cpf) {
    return formatCPFDisplay(studentData.value.cpf);
  }
  if (authStore.isAuthenticated && authStore.currentUser) {
    return formatCPFDisplay(authStore.currentUser.cpf) || '000.000.000-00';
  }
  return '000.000.000-00';
};

const getStudentRelationshipText = () => {
  const relationships = {
    'proprio': 'Próprio usuário',
    'filho': 'Filho(a)',
    'conjuge': 'Cônjuge',
    'pai': 'Pai',
    'mae': 'Mãe',
    'irmao': 'Irmão/Irmã',
    'outro': 'Outro'
  };
  return relationships[studentData.value.relationship] || 'Mercado como igual ao pagador';
};

// Formatting functions
const formatCPFDisplay = (cpf) => {
  if (!cpf) return '';
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length === 11) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
  }
  return cpf;
};

const formatCPF = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    editingCustomer.value.cpf = value;
  }
};

const formatStudentCPF = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    editingStudent.value.cpf = value;
  }
};

const formatPhone = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length <= 11) {
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    editingCustomer.value.phone = value;
  }
};

// Edit functions
const editCustomerData = () => {
  editingCustomer.value = {
    name: getUserDisplayName(),
    cpf: getFormattedCPF(),
    email: authStore.currentUser?.email || customerData.value.email || '',
    phone: authStore.currentUser?.phone || customerData.value.phone || ''
  };
  showCustomerEditModal.value = true;
};

const editStudentData = () => {
  editingStudent.value = {
    name: getStudentDisplayName(),
    cpf: getStudentFormattedCPF(),
    birthDate: studentData.value.birthDate || '',
    relationship: studentData.value.relationship || 'proprio'
  };
  showStudentEditModal.value = true;
};

const saveCustomerData = () => {
  customerData.value = { ...editingCustomer.value };
  showCustomerEditModal.value = false;
};

const saveStudentData = () => {
  studentData.value = { ...editingStudent.value };
  showStudentEditModal.value = false;
};

const cancelCustomerEdit = () => {
  showCustomerEditModal.value = false;
  editingCustomer.value = {};
};

const closeCustomerModal = () => {
  showCustomerEditModal.value = false;
  editingCustomer.value = {};
};

const cancelStudentEdit = () => {
  showStudentEditModal.value = false;
  editingStudent.value = {};
};

const closeStudentModal = () => {
  showStudentEditModal.value = false;
  editingStudent.value = {};
};

// Payment edit functions
const editPaymentData = () => {
  editingPayment.value = {
    method: paymentData.value.method,
    cardNumber: paymentData.value.cardNumber,
    cardholderName: paymentData.value.cardholderName,
    expiryDate: paymentData.value.expiryDate,
    cvv: paymentData.value.cvv
  };
  showPaymentEditModal.value = true;
};

const savePaymentMethodData = () => {
  paymentData.value = { ...editingPayment.value };
  selectedPaymentMethod.value = editingPayment.value.method;
  showPaymentEditModal.value = false;
};

const cancelPaymentEdit = () => {
  showPaymentEditModal.value = false;
  editingPayment.value = {};
};

const closePaymentModal = () => {
  showPaymentEditModal.value = false;
  editingPayment.value = {};
};

const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length <= 16) {
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    editingPayment.value.cardNumber = value;
  }
};

const formatExpiryDate = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length <= 4) {
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    editingPayment.value.expiryDate = value;
  }
};

const processPayment = async () => {
  console.log('processPayment chamado, método selecionado:', selectedPaymentMethod.value);
  console.log('Tipo do método:', typeof selectedPaymentMethod.value);
  console.log('Comparação PIX:', selectedPaymentMethod.value === 'pix');
  
  if (!selectedPaymentMethod.value) {
    console.log('Nenhum método selecionado');
    return;
  }
  
  // Se for PIX, navegar para a página de PIX com dados da reserva
  if (selectedPaymentMethod.value === 'pix') {
    console.log('Navegando para página PIX');
    
    const pixData = {
      spaceId: route.query.spaceId,
      spaceName: space.value?.name || 'Espaço não encontrado',
      date: route.query.date,
      startTime: route.query.startTime,
      endTime: route.query.endTime,
      purpose: route.query.purpose || 'Locação de espaço esportivo',
      isRecurrent: route.query.isRecurrent,
      recurrenceType: route.query.recurrenceType,
      totalValue: getTotalPrice(),
      hours: getFormattedHours()
    };
    
    console.log('🔍 DADOS COMPLETOS antes de navegar:');
    console.log('- Space Value:', space.value);
    console.log('- Route Query:', route.query);
    console.log('- Get Total Price:', getTotalPrice());
    console.log('- Get Formatted Hours:', getFormattedHours());
    console.log('- Pix Data Final:', pixData);
    
    router.push({
      path: '/pix-payment',
      query: pixData
    });
    return;
  }
  
  // Para cartões, processar pagamento e criar reserva
  console.log('Processando cartão');
  isProcessing.value = true;
  showPaymentProcessingModal.value = true;
  
  try {
    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('💳 Pagamento aprovado, confirmando reserva temporária...');
    
    // Tentar confirmar reserva temporária primeiro
    const tempReservationId = sessionStorage.getItem('tempReservationId');
    
    if (tempReservationId) {
      console.log('🔒 Confirmando reserva temporária:', tempReservationId);
      
      const confirmedReservation = reservationsStore.confirmTemporaryReservation(tempReservationId);
      
      if (confirmedReservation) {
        // Atualizar dados específicos do pagamento
        const paymentMethod = selectedPaymentMethod.value === 'mastercard' ? 'Mastercard' : 'Visa';
        reservationsStore.updateReservationStatus(confirmedReservation.id, 'Pendente');
        
        console.log('✅ Reserva temporária confirmada como reserva real:', confirmedReservation);
        
        // Limpar sessão
        sessionStorage.removeItem('tempReservationId');
        
        // Disparar evento para notificar outras partes do sistema
        try {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('newReservationAdded', {
              detail: { 
                reservation: confirmedReservation,
                action: 'payment_confirmed',
                paymentMethod: paymentMethod
              }
            }));
            console.log('📢 Evento "newReservationAdded" disparado para reserva confirmada:', confirmedReservation.id);
          }
        } catch (eventError) {
          console.error('❌ Erro ao disparar evento de nova reserva:', eventError);
        }
        
        showPaymentProcessingModal.value = false;
        showSuccessModal.value = true;
        return;
      }
    }
    
    // FALLBACK: Se não há reserva temporária, usar método antigo
    console.log('⚠️ Reserva temporária não encontrada, usando método tradicional...');
    
    // Criar dados da reserva
    const reservationData = {
      spaceId: parseInt(route.query.spaceId),
      spaceName: space.value?.name || 'Espaço não encontrado',
      date: route.query.date,
      startTime: route.query.startTime,
      endTime: route.query.endTime,
      userId: authStore.currentUser?.id || 'guest',
      userName: authStore.currentUser?.name || 'Usuário',
      userEmail: authStore.currentUser?.email || 'email@exemplo.com',
      purpose: route.query.purpose || 'Locação via cartão',
      paymentMethod: selectedPaymentMethod.value === 'mastercard' ? 'Mastercard' : 'Visa',
      isRecurrent: route.query.isRecurrent === 'true',
      recurrenceType: route.query.recurrenceType || 'none',
      totalValue: getTotalPrice()
    };
    
    // Criar a reserva no sistema
    const newReservation = reservationsStore.addReservation(reservationData);
    console.log('Agendamento criado:', newReservation);
    
    // =================================================================
    // CORREÇÃO: Disparar evento para notificar outras partes do sistema
    // =================================================================
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('newReservationAdded', {
          detail: { 
            reservation: newReservation,
            action: 'created' // Adiciona contexto à ação
          }
        }));
        console.log('✅ Evento global "newReservationAdded" disparado com sucesso!');
      }
    } catch (eventError) {
      console.error('❌ Erro ao disparar evento "newReservationAdded":', eventError);
    }
    // =================================================================
    // FIM DA CORREÇÃO
    // =================================================================
    
    // Fechar modal de processamento e redirecionar para sucesso
    showPaymentProcessingModal.value = false;
    
    router.push({
      name: 'home',
      query: { 
        success: 'true', 
        message: `Pagamento realizado com sucesso! Seu agendamento #${newReservation.id} foi confirmado.`,
        reservationId: newReservation.id
      }
    });
    
  } catch (error) {
    console.error('Erro no processamento do pagamento:', error);
    showPaymentProcessingModal.value = false;
    alert('Erro ao processar pagamento. Tente novamente.');
  } finally {
    isProcessing.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  console.log('PaymentView carregado, route.query:', route.query);
  
  // Carregar dados do espaço
  const spaceId = route.query.spaceId;
  console.log('spaceId recebido:', spaceId);
  
  if (spaceId) {
    // Garantir que os espaços estejam carregados
    if (spacesStore.spaces.length === 0) {
      await spacesStore.loadSpaces();
    }
    
    const foundSpace = spacesStore.getSpaceById(parseInt(spaceId));
    console.log('Espaço encontrado:', foundSpace);
    
    if (foundSpace) {
      space.value = foundSpace;
    } else {
      console.warn('Espaço não encontrado para ID:', spaceId);
      // Dados fallback
      space.value = {
        id: spaceId,
        name: 'Espaço Esportivo',
        type: 'Quadra',
        description: 'Espaço amplo e bem localizado, com excelente iluminação natural, estrutura moderna e fácil acesso a transporte público. O local oferece conforto e praticidade, copa e área para recepção ou sala de espera.',
        photos: ['/public/space-placeholder.jpg'],
        pricePerHour: 50,
        features: ['Piso antiderrapante', 'Acessibilidade', 'Bolas no local', 'Segurança']
      };
    }
  }
  
  // Carregar dados da reserva com melhor formatação
  const formatDate = (dateStr) => {
    if (!dateStr) {
      const today = new Date();
      return today.toLocaleDateString('pt-BR');
    }
    try {
      // Se já está no formato brasileiro, manter
      if (dateStr.includes('/')) {
        return dateStr;
      }
      // Se está no formato ISO, converter com timezone fix
      const date = new Date(dateStr + 'T12:00:00');
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };
  
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    // Garantir formato HH:MM
    if (timeStr.length === 5) return timeStr;
    if (timeStr.length === 2) return timeStr + ':00';
    return timeStr;
  };
  
  reservationData.value = {
    date: formatDate(route.query.date),
    startTime: formatTime(route.query.startTime),
    endTime: formatTime(route.query.endTime),
    hours: route.query.hours || '2',
    isRecurrent: route.query.isRecurrent === 'true',
    recurrenceType: route.query.recurrenceType || 'none',
    recurrenceDay: route.query.recurrenceDay || ''
  };
  
  console.log('Dados da reserva carregados:', reservationData.value);
  console.log('Dados do espaço carregados:', space.value);
  
  // Selecionar método de pagamento padrão
  selectedPaymentMethod.value = 'mastercard';
});

// Watcher para debug
watch(selectedPaymentMethod, (newValue, oldValue) => {
  console.log('selectedPaymentMethod mudou:', { old: oldValue, new: newValue });
}, { immediate: true });
</script>

<style scoped>
/* Header Styles */
.payment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 32px 18px 24px;
  background: #fff;
  border-bottom: 1px solid #f2f3f5;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  background-color: #164194;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
}

.back-btn:hover {
  background-color: #0f2d6b;
}

.header-logo {
  height: 32px;
  margin-left: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-btn {
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #164194;
  font-size: 1.1rem;
}

.profile-btn:hover {
  background-color: #f9fafb;
}

.logout-btn {
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0 24px;
  height: 40px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #b71c1c;
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
  position: relative;
}

.space-image-container {
  position: relative;
}

/* Image Navigation on Hover */
.image-nav-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.space-image-container:hover .image-nav-overlay {
  opacity: 1;
  pointer-events: all;
}

.image-nav-btn {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.image-nav-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.image-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.image-nav-prev {
  left: 10px;
}

.image-nav-next {
  right: 10px;
}

/* Image Counter */
.image-counter {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  z-index: 2;
}

/* Thumbnails */
.thumbnails-container {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.thumbnail-item {
  width: 60px;
  height: 60px;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s;
  flex-shrink: 0;
}

.thumbnail-item:hover {
  border-color: #3b82f6;
}

.thumbnail-item.active {
  border-color: #1d4ed8;
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-more {
  width: 60px;
  height: 60px;
  border: 2px solid #e5e7eb;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.thumbnail-more:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

/* Modal Styles - Same as TechnicianProfileView */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content-large {
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #6B7280;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #374151;
}

.modal-form {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #374151;
  background: white;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: #9CA3AF;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #F3F4F6;
}

.cancel-btn {
  background: #F3F4F6;
  color: #374151;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
  font-weight: 500;
}

.cancel-btn:hover {
  background: #E5E7EB;
}

.submit-btn {
  background: #1E40AF;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
  font-weight: 500;
}

.submit-btn:hover {
  background: #1D4ED8;
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

/* Custom Accessibility Icon */
.accessibility-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233b82f6'%3E%3Ccircle cx='12' cy='12' r='12' fill='%23147cb8'/%3E%3Cg fill='white'%3E%3Ccircle cx='12' cy='6' r='1.5'/%3E%3Cpath d='M12 8c-2 0-3.5 0.5-3.5 0.5v1c0 0 1.5-0.5 3.5-0.5s3.5 0.5 3.5 0.5v-1S14 8 12 8z'/%3E%3Cpath d='M12 10v6l-1.5 2h1l1.5-2 1.5 2h1L12 16V10z'/%3E%3Cpath d='M8 11h8v1H8z'/%3E%3C/g%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
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
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-height: 3rem;
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
  word-wrap: break-word;
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
  border-radius: 4px;
}

.mastercard-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 50'%3E%3Crect width='80' height='50' fill='%23000' rx='4'/%3E%3Ccircle cx='30' cy='25' r='15' fill='%23ff5f00'/%3E%3Ccircle cx='50' cy='25' r='15' fill='%23eb001b'/%3E%3C/svg%3E");
}

.visa-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 50'%3E%3Crect width='80' height='50' fill='%231a1f71' rx='4'/%3E%3Ctext x='40' y='30' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EVISA%3C/text%3E%3C/svg%3E");
}

.pix-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 50'%3E%3Crect width='80' height='50' fill='%2332BCAD' rx='4'/%3E%3Ctext x='40' y='30' text-anchor='middle' fill='white' font-family='Arial' font-size='12' font-weight='bold'%3EPIX%3C/text%3E%3C/svg%3E");
}

/* Payment Edit Modal Styles */
.payment-methods-edit-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
}

.payment-method-edit-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafafa;
}

.payment-method-edit-card:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.payment-method-edit-card.active {
  border-color: #1d4ed8;
  background: #eff6ff;
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.15);
}

.payment-method-edit-card span {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.card-details-section,
.pix-details-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.card-details-title,
.pix-details-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.pix-details-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 4px solid #32bcad;
}

.pix-advantages {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #f0fdfa;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #a7f3d0;
}

.pix-advantage-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #065f46;
  font-size: 0.875rem;
  font-weight: 500;
}

.pix-advantage-item i {
  color: #10b981;
  font-size: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 0.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .payment-methods-edit-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-form {
    padding: 1rem;
  }
  
  .modal-header {
    padding: 1rem;
  }
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
</style>