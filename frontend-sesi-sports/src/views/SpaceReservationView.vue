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
      <!-- Profile and Auth buttons like HomeView -->
      <div class="flex items-center gap-3">
        <!-- Profile Icon -->
        <button
          :class="['profile-btn', { 'profile-btn-authenticated': authStore.isAuthenticated }]"
          @click="handleProfileClick"
          :title="authStore.isAuthenticated ? `Ir para perfil de ${authStore.currentUser?.name}` : 'Fazer Login para acessar perfil'"
        >
          <div v-if="authStore.isAuthenticated && authStore.getUserProfilePhoto" class="profile-photo-mini">
            <img :src="authStore.getUserProfilePhoto" alt="Perfil" class="profile-photo-img" />
          </div>
          <i v-else class="pi pi-user"></i>
        </button>
        <!-- Auth Button -->
        <button
          :class="['header-btn', { 'logout-btn': authStore.isAuthenticated }]"
          @click="handleAuthClick"
          :title="authStore.isAuthenticated ? 'Sair da conta' : 'Entrar na sua conta'"
        >
          <span v-if="authStore.isAuthenticated">Sair</span>
          <span v-else>Entrar</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Space Title -->
      <h1 class="space-title">{{ space.name }}</h1>
      
      <!-- Two Column Layout -->
      <div class="space-layout">
        <!-- Left Column - Images -->
        <div class="images-column">
          <!-- Main Image -->
          <div class="main-image-container">
            <img :src="selectedImage" :alt="space.name" class="main-image" />
            
            <!-- Image Counter -->
            <div v-if="space.photos && space.photos.length > 1" class="image-counter">
              {{ getCurrentImageIndex() + 1 }} / {{ space.photos.length }}
            </div>

            <!-- Navigation buttons on hover -->
            <div v-if="space.photos && space.photos.length > 1" class="image-nav-overlay">
              <button 
                class="image-nav-btn image-nav-prev"
                @click="previousImage"
                :disabled="getCurrentImageIndex() === 0"
              >
                <i class="pi pi-chevron-left"></i>
              </button>
              <button 
                class="image-nav-btn image-nav-next"
                @click="nextImage"
                :disabled="getCurrentImageIndex() === space.photos.length - 1"
              >
                <i class="pi pi-chevron-right"></i>
              </button>
            </div>
          </div>
          
          <!-- Image Thumbnails -->
          <div class="thumbnails-grid" v-if="space.photos && space.photos.length > 1">
            <div 
              v-for="(photo, index) in space.photos" 
              :key="index"
              class="thumbnail-item"
              :class="{ active: selectedImage === photo }"
              @click="selectedImage = photo"
            >
              <img :src="photo" :alt="`${space.name} foto ${index + 1}`" />
            </div>
          </div>
        </div>

        <!-- Right Column - Info and Actions -->
        <div class="info-column">
          <!-- Description -->
          <div class="space-description">
            <p>{{ space.description }}</p>
          </div>

          <!-- Rent Button -->
          <div class="rent-button-section">
            <Button
              label="Alugar"
              class="rent-btn-main"
              @click="handleRent"
            />
          </div>

          <!-- Information Grid -->
          <div class="info-section">
            <h3 class="info-section-title">Informações</h3>
            <div class="info-grid-layout">
              <!-- Acessibilidade -->
              <div class="info-card">
                <div class="info-icon-wrapper">
                  <i class="accessibility-icon info-icon-blue"></i>
                </div>
                <div class="info-text-wrapper">
                  <h4 class="info-card-title">Acessibilidade</h4>
                  <p class="info-card-text">Espaço adaptado para pessoas com deficiência.</p>
                </div>
              </div>

              <!-- Segurança -->
              <div class="info-card">
                <div class="info-icon-wrapper">
                  <i class="pi pi-shield info-icon-blue"></i>
                </div>
                <div class="info-text-wrapper">
                  <h4 class="info-card-title">Segurança</h4>
                  <p class="info-card-text">Sistema de segurança e monitoramento 24h.</p>
                </div>
              </div>

              <!-- Material Esportivo -->
              <div class="info-card" v-if="space.benefits?.includes('Bolas') || space.benefits?.includes('Material esportivo')">
                <div class="info-icon-wrapper">
                  <i class="pi pi-home info-icon-blue"></i>
                </div>
                <div class="info-text-wrapper">
                  <h4 class="info-card-title">Bolas no local</h4>
                  <p class="info-card-text">Material esportivo disponível para uso.</p>
                </div>
              </div>

              <!-- Piso Antiderrapante -->
              <div class="info-card" v-if="space.benefits?.includes('Piso antiderrapante')">
                <div class="info-icon-wrapper">
                  <i class="pi pi-car info-icon-blue"></i>
                </div>
                <div class="info-text-wrapper">
                  <h4 class="info-card-title">Piso antiderrapante</h4>
                  <p class="info-card-text">Superficie segura e antiderrapante.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reservation Section -->
      <div class="reservation-section">
        <h3 class="reservation-title">Fazer Reserva</h3>
        
        <!-- Date and Time Selection -->
        <div class="reservation-form">
          <div class="form-row">
            <div class="form-field">
              <label class="form-label">Data</label>
              <input
                type="date"
                v-model="reservationForm.startDate"
                :min="minDateString"
                :max="maxDateString"
                class="form-input"
                @change="validateDateRules"
              />
            </div>
            
            <div class="form-field">
              <label class="form-label">Horário de início</label>
              <select
                v-model="reservationForm.startTime"
                class="form-select"
                @change="updateEndTimeOptions"
              >
                <option value="">Selecione</option>
                <option v-for="time in timeOptions" :key="time" :value="time">
                  {{ time }}
                </option>
              </select>
            </div>
            
            <div class="form-field">
              <label class="form-label">Horário de fim</label>
              <select
                v-model="reservationForm.endTime"
                class="form-select"
                :disabled="!reservationForm.startTime"
              >
                <option value="">Selecione</option>
                <option v-for="time in availableEndTimes" :key="time" :value="time">
                  {{ time }}
                </option>
              </select>
            </div>
          </div>

          <!-- Time Slots -->
          <div class="time-slots">
            <div class="time-slot-group">
              <span class="time-slot" :class="{ active: selectedSlot === 'morning' }" @click="selectTimeSlot('morning')">
                Toda (manhã)
              </span>
              <span class="time-slot" :class="{ active: selectedSlot === 'afternoon' }" @click="selectTimeSlot('afternoon')">
                Toda (tarde)
              </span>
              <span class="time-slot" :class="{ active: selectedSlot === 'evening' }" @click="selectTimeSlot('evening')">
                Toda (noite)
              </span>
            </div>
          </div>

          <!-- Recurrence Toggle -->
          <div class="recurrence-toggle">
            <Checkbox 
              v-model="isRecurrent" 
              inputId="recurrence"
              class="recurrence-checkbox"
            />
            <label for="recurrence" class="recurrence-label">
              Reserva recorrente (semanal)
            </label>
          </div>

          <!-- Recurrence Configuration -->
          <div v-if="isRecurrent" class="recurrence-config">
            <div class="form-row">
              <div class="form-field">
                <label class="form-label">Data final</label>
                <input
                  type="date"
                  v-model="reservationForm.endDate"
                  :min="reservationForm.startDate || minDateString"
                  :max="maxDateString"
                  class="form-input"
                  @change="validateDateRules"
                />
              </div>
              
              <div class="form-field">
                <label class="form-label">Dia da semana</label>
                <select v-model="reservationForm.recurrenceDay" class="form-select">
                  <option value="">Selecione o dia</option>
                  <option value="0">Domingo</option>
                  <option value="1">Segunda-feira</option>
                  <option value="2">Terça-feira</option>
                  <option value="3">Quarta-feira</option>
                  <option value="4">Quinta-feira</option>
                  <option value="5">Sexta-feira</option>
                  <option value="6">Sábado</option>
                </select>
              </div>
            </div>

            <!-- Warning Alert -->
            <div class="warning-alert" v-if="showDateWarning">
              <i class="pi pi-exclamation-triangle warning-icon"></i>
              <span>Atenção: existem datas indisponíveis dentro do intervalo escolhido</span>
              <div class="warning-dates">
                <span class="warning-date">11/11/2025</span>
                <span class="warning-separator">até</span>
                <span class="warning-date">15/11/2025</span>
              </div>
            </div>
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
      @proceed-to-payment="handleTermsAccepted"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSpacesStore } from '../stores/spaces.js';
import { useAuthStore } from '../stores/auth.js';
import { useReservationsStore } from '../stores/reservations.js';
import { redirectBasedOnUserType } from '../utils/navigationUtils.js';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import AuthModal from '../components/auth/AuthModal.vue';
import TermsModal from '../components/TermsModal.vue';

const router = useRouter();
const route = useRoute();
const spacesStore = useSpacesStore();
const authStore = useAuthStore();
const reservationsStore = useReservationsStore();

const showAuthModal = ref(false);
const showTermsModal = ref(false);
const isRecurrent = ref(false);
const selectedSlot = ref('');
const selectedImage = ref('');

// Variáveis para o novo layout
const showDateWarning = ref(false); // Mostrar alerta de datas indisponíveis condicionalmente

// Data formatada para inputs HTML com validações de negócio
const today = new Date();

// Regra de negócio: antecedência mínima de 24 horas EXATAS
const minDate = new Date();
minDate.setHours(minDate.getHours() + 24); // 24 horas exatas
const minDateString = minDate.toISOString().split('T')[0];

// Regra de negócio: antecedência máxima de 90 dias
const maxDate = new Date();
maxDate.setDate(today.getDate() + 90);
const maxDateString = maxDate.toISOString().split('T')[0];

// Space data from store
const space = ref({});

const reservationForm = reactive({
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  recurrenceDay: ''
});

const timeOptions = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00'
];

// Computed para opções de horário de fim
const availableEndTimes = computed(() => {
  if (!reservationForm.startTime) return [];
  
  const startHour = parseInt(reservationForm.startTime.split(':')[0]);
  const availableTimes = [];
  
  // Gerar horários de 1 hora após o início até 22:00
  for (let hour = startHour + 1; hour <= 22; hour++) {
    availableTimes.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  
  return availableTimes;
});

// Função para atualizar opções de horário de fim
const updateEndTimeOptions = () => {
  // Limpar horário de fim se não for mais válido
  if (reservationForm.endTime && reservationForm.startTime) {
    const startHour = parseInt(reservationForm.startTime.split(':')[0]);
    const endHour = parseInt(reservationForm.endTime.split(':')[0]);
    
    if (endHour <= startHour) {
      reservationForm.endTime = '';
    }
  }
  
  // Limpar o filtro de slot quando horário for alterado manualmente
  if (selectedSlot.value && reservationForm.startTime) {
    selectedSlot.value = '';
  }
};

const goBack = () => {
  router.back();
};

const handleProfileClick = () => {
  console.log('Botão de perfil clicado!');
  console.log('Usuario autenticado:', authStore.isAuthenticated);
  console.log('Dados do usuário:', authStore.currentUser);
  
  if (authStore.isAuthenticated) {
    console.log('Redirecionando para perfil do tipo:', authStore.currentUser?.type);
    // Redirecionar baseado no tipo de usuário
    redirectBasedOnUserType(authStore.currentUser?.type, router);
  } else {
    console.log('Usuário não autenticado, abrindo modal de login');
    showAuthModal.value = true;
  }
};

const handleAuthClick = () => {
  console.log('Botão de autenticação clicado!');
  
  if (authStore.isAuthenticated) {
    console.log('Fazendo logout...');
    authStore.logout();
    console.log('Logout realizado, redirecionando para home');
    router.push('/');
  } else {
    console.log('Usuário não autenticado, abrindo modal de login');
    showAuthModal.value = true;
  }
};

const selectTimeSlot = (slot) => {
  selectedSlot.value = slot;
  
  // Definir horários sugeridos baseado no slot
  switch (slot) {
    case 'morning':
      reservationForm.startTime = '08:00';
      reservationForm.endTime = '12:00';
      break;
    case 'afternoon':
      reservationForm.startTime = '14:00';
      reservationForm.endTime = '18:00';
      break;
    case 'evening':
      reservationForm.startTime = '18:00';
      reservationForm.endTime = '22:00';
      break;
  }
};

// Função para formatar data para exibição
const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR');
};

// Função para validar regras de negócio de datas
const validateDateRules = (selectedDate) => {
  const selected = new Date(selectedDate + 'T00:00:00');
  const now = new Date();
  
  console.log('🕐 Validando regra de 24h:', {
    selectedDate: selectedDate,
    selectedDateTime: selected,
    now: now,
    diffInHours: (selected - now) / (1000 * 60 * 60)
  });
  
  // Verificar antecedência mínima de 24 horas EXATAS
  const twentyFourHoursFromNow = new Date();
  twentyFourHoursFromNow.setHours(now.getHours() + 24);
  
  if (selected < twentyFourHoursFromNow) {
    console.log('❌ Violação da regra de 24h:', {
      selected: selected,
      minimum: twentyFourHoursFromNow,
      difference: (selected - now) / (1000 * 60 * 60) + ' horas'
    });
    return 'A reserva deve ser feita com antecedência mínima de 24 horas.';
  }
  
  // Verificar antecedência máxima de 90 dias
  const maxAllowed = new Date();
  maxAllowed.setDate(now.getDate() + 90);
  if (selected > maxAllowed) {
    return 'A reserva não pode ser feita com mais de 90 dias de antecedência.';
  }
  
  console.log('✅ Data válida - mais de 24h de antecedência');
  
  // Atualizar alerta de aviso baseado na recorrência
  if (isRecurrent.value && reservationForm.startDate && reservationForm.endDate) {
    // Simular verificação de conflitos (aqui você faria a verificação real)
    const hasConflicts = Math.random() > 0.7; // 30% de chance de ter conflitos
    showDateWarning.value = hasConflicts;
  } else {
    showDateWarning.value = false;
  }
  
  return null; // Sem erros
};

// Image navigation functions
const getCurrentImageIndex = () => {
  if (!space.value.photos) return 0;
  return space.value.photos.findIndex(photo => photo === selectedImage.value);
};

const nextImage = () => {
  if (!space.value.photos) return;
  const currentIndex = getCurrentImageIndex();
  if (currentIndex < space.value.photos.length - 1) {
    selectedImage.value = space.value.photos[currentIndex + 1];
  }
};

const previousImage = () => {
  if (!space.value.photos) return;
  const currentIndex = getCurrentImageIndex();
  if (currentIndex > 0) {
    selectedImage.value = space.value.photos[currentIndex - 1];
  }
};

const handleRent = () => {
  // Verificar se o usuário está autenticado
  if (!authStore.isAuthenticated) {
    alert('Você precisa estar logado para fazer uma reserva.');
    showAuthModal.value = true;
    return;
  }

  // Validação básica
  if (!reservationForm.startDate || !reservationForm.startTime || !reservationForm.endTime) {
    alert('Por favor, preencha todos os campos obrigatórios: data de início, horário de início e horário de fim.');
    return;
  }

  // Validar regras de negócio para data de início
  const dateError = validateDateRules(reservationForm.startDate);
  if (dateError) {
    alert(dateError);
    return;
  }

  // Validar data de fim se for recorrente
  if (isRecurrent.value && reservationForm.endDate) {
    const endDateError = validateDateRules(reservationForm.endDate);
    if (endDateError) {
      alert(`Data de término: ${endDateError}`);
      return;
    }
  }

  // Se recorrência está ativada, validar campos específicos
  if (isRecurrent.value) {
    if (!reservationForm.endDate) {
      alert('Para reservas recorrentes, é necessário definir a data de término.');
      return;
    }
    if (!reservationForm.recurrenceDay) {
      alert('Para reservas recorrentes, é necessário selecionar o dia da semana.');
      return;
    }
  }

  // Verificar conflitos de horário (incluindo reservas temporárias)
  const conflict = reservationsStore.checkTimeConflict(
    space.value.id,
    reservationForm.startDate,
    reservationForm.startTime,
    reservationForm.endTime
  );

  if (conflict.hasConflict) {
    const conflictReservation = conflict.conflictingReservation;
    const conflictType = conflict.conflictType === 'temporary' ? 'em processo de pagamento' : 'já confirmada';
    alert(`Conflito de horário detectado! O espaço "${conflictReservation.spaceName || space.value.name}" já está sendo reservado (${conflictType}) por ${conflictReservation.userName} no dia ${formatDateForDisplay(conflictReservation.date)} das ${conflictReservation.startTime} às ${conflictReservation.endTime}.`);
    return;
  }

  // 🔒 CRIAR RESERVA TEMPORÁRIA para evitar race condition
  console.log('🔒 Criando reserva temporária para:', {
    spaceId: space.value.id,
    spaceName: space.value.name,
    date: reservationForm.startDate,
    startTime: reservationForm.startTime,
    endTime: reservationForm.endTime,
    userId: authStore.currentUser.id,
    userName: authStore.currentUser.name,
    userEmail: authStore.currentUser.email
  });

  const tempReservation = reservationsStore.createTemporaryReservation({
    spaceId: space.value.id,
    spaceName: space.value.name,
    date: reservationForm.startDate,
    startTime: reservationForm.startTime,
    endTime: reservationForm.endTime,
    userId: authStore.currentUser.id,
    userName: authStore.currentUser.name,
    userEmail: authStore.currentUser.email,
    purpose: `Reserva de ${space.value.name}`,
    paymentMethod: 'Pendente'
  });

  // Armazenar ID da reserva temporária para usar no pagamento
  sessionStorage.setItem('tempReservationId', tempReservation.id);
  console.log('✅ Reserva temporária criada com ID:', tempReservation.id);

  // Mostrar modal de termos de compromisso
  console.log('Abrindo modal de termos de compromisso...');
  showTermsModal.value = true;
};

const handleTermsAccepted = () => {
  console.log('Termos aceitos! Redirecionando para tela de pagamento...');
  
  // Função para calcular as horas totais
  const calculateHours = () => {
    if (!reservationForm.startDate || !reservationForm.startTime || !reservationForm.endTime) {
      return '1h';
    }
    
    // Calcula horas por sessão
    const startHour = parseInt(reservationForm.startTime.split(':')[0]);
    const endHour = parseInt(reservationForm.endTime.split(':')[0]);
    const hoursPerSession = endHour - startHour;
    
    if (isRecurrent.value && reservationForm.endDate && reservationForm.recurrenceDay) {
      // Para recorrência, calcula quantas vezes o dia da semana ocorre no período
      const startDate = new Date(reservationForm.startDate);
      const endDate = new Date(reservationForm.endDate);
      const targetDay = parseInt(reservationForm.recurrenceDay);
      
      let occurrences = 0;
      let currentDate = new Date(startDate);
      
      // Conta quantas vezes o dia da semana selecionado ocorre no período
      while (currentDate <= endDate) {
        if (currentDate.getDay() === targetDay) {
          occurrences++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      const totalHours = occurrences * hoursPerSession;
      return `${totalHours}h (${occurrences} sessões)`;
    } else {
      // Para reserva única
      return `${hoursPerSession}h`;
    }
  };

  // Função para formatar a data para exibição
  const formatDateRange = () => {
    if (isRecurrent.value && reservationForm.endDate && reservationForm.recurrenceDay) {
      const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const dayName = dayNames[parseInt(reservationForm.recurrenceDay)];
      return `${reservationForm.startDate} - ${reservationForm.endDate} (Toda ${dayName})`;
    } else {
      return reservationForm.startDate;
    }
  };
  
  // Redireciona para a tela de pagamento com dados
  router.push({
    name: 'Payment',
    query: {
      spaceId: space.value.id,
      date: formatDateRange(),
      startTime: reservationForm.startTime,
      endTime: reservationForm.endTime,
      hours: calculateHours(),
      isRecurrent: isRecurrent.value ? 'true' : 'false',
      recurrenceType: isRecurrent.value ? 'weekly' : 'none',
      recurrenceDay: isRecurrent.value ? reservationForm.recurrenceDay : ''
    }
  });
};

const handleLoginSuccess = () => {
  console.log('Login realizado com sucesso na SpaceReservationView!');
  console.log('Estado de autenticação após login:', authStore.isAuthenticated);
  console.log('Usuário logado:', authStore.currentUser);
  showAuthModal.value = false;
};

const handleRegisterSuccess = () => {
  console.log('Cadastro realizado com sucesso na SpaceReservationView!');
  console.log('Estado de autenticação após cadastro:', authStore.isAuthenticated);
  console.log('Usuário cadastrado:', authStore.currentUser);
  showAuthModal.value = false;
};

// Função para obter o label do tipo de piso dinamicamente
const getFloorTypeLabel = () => {
  if (!space.value.benefits) return null;
  
  if (space.value.benefits.includes('Piso antiderrapante')) return 'Piso Antiderrapante';
  if (space.value.benefits.includes('Piso oficial')) return 'Piso Oficial';
  if (space.value.benefits.includes('Grama sintética')) return 'Grama Sintética';
  if (space.value.benefits.includes('Areia importada')) return 'Areia Importada';
  if (space.value.benefits.includes('Piso saibro')) return 'Piso Saibro';
  
  return null; // Não mostra se não tem um tipo específico
};

// Função para obter benefícios adicionais para exibir
const getDisplayableBenefits = () => {
  if (!space.value.benefits) return [];
  
  const benefitMap = {
    'Cobertura': { name: 'Cobertura', icon: 'pi pi-home', description: 'Espaço totalmente coberto.' },
    'Arquibancada': { name: 'Arquibancada', icon: 'pi pi-users', description: 'Área para espectadores.' },
    'Iluminação LED': { name: 'Iluminação', icon: 'pi pi-sun', description: 'Iluminação LED de alta qualidade.' },
    'Iluminação noturna': { name: 'Iluminação Noturna', icon: 'pi pi-moon', description: 'Preparado para jogos noturnos.' },
    'Vestiário': { name: 'Vestiário', icon: 'pi pi-building', description: 'Vestiários disponíveis.' },
    'Vestiário premium': { name: 'Vestiário Premium', icon: 'pi pi-star', description: 'Vestiários de alto padrão.' },
    'Lanchonete': { name: 'Lanchonete', icon: 'pi pi-shopping-cart', description: 'Lanchonete no local.' },
    'Bar na praia': { name: 'Bar', icon: 'pi pi-glass', description: 'Bar temático disponível.' },
    'Aquecida': { name: 'Aquecida', icon: 'pi pi-sun', description: 'Piscina com aquecimento.' },
    'Cronometragem': { name: 'Cronometragem', icon: 'pi pi-clock', description: 'Sistema de cronometragem profissional.' },
    'Salva-vidas': { name: 'Salva-vidas', icon: 'pi pi-heart', description: 'Salva-vidas sempre presente.' },
    'Climatização': { name: 'Climatização', icon: 'pi pi-refresh', description: 'Ambiente climatizado.' },
    'Área VIP': { name: 'Área VIP', icon: 'pi pi-star', description: 'Área VIP para acompanhantes.' },
    'Placar eletrônico': { name: 'Placar Eletrônico', icon: 'pi pi-desktop', description: 'Placar eletrônico profissional.' },
    'Sistema de som': { name: 'Sistema de Som', icon: 'pi pi-volume-up', description: 'Sistema de som profissional.' }
  };
  
  // Benefícios que já são mostrados separadamente
  const excludedBenefits = [
    'Acessível', 'Sistema de segurança', 'Segurança', 'Material esportivo', 'Equipamentos',
    'Piso antiderrapante', 'Piso oficial', 'Grama sintética', 'Areia importada', 'Piso saibro'
  ];
  
  return space.value.benefits
    .filter(benefit => !excludedBenefits.includes(benefit))
    .map(benefit => benefitMap[benefit])
    .filter(Boolean) // Remove undefined
    .slice(0, 4); // Máximo 4 benefícios adicionais para não sobrecarregar
};

// Watchers para limpar filtros automaticamente
watch(() => reservationForm.startTime, (newValue, oldValue) => {
  // Se o horário de início foi removido/limpo, limpar também o filtro de slot
  if (!newValue && oldValue) {
    selectedSlot.value = '';
  }
});

watch(() => reservationForm.endTime, (newValue, oldValue) => {
  // Se o horário de fim foi removido/limpo, limpar também o filtro de slot
  if (!newValue && oldValue) {
    selectedSlot.value = '';
  }
});

onMounted(() => {
  // Inicializar autenticação
  authStore.initializeAuth();
  console.log('SpaceReservationView montada!');
  console.log('Estado inicial de autenticação:', authStore.isAuthenticated);
  console.log('Usuário inicial:', authStore.currentUser);
  
  // Carregar dados do espaço baseado no ID da rota
  if (route.params.id) {
    const spaceId = parseInt(route.params.id);
    const foundSpace = spacesStore.spaces.find(s => s.id === spaceId);
    
    if (foundSpace) {
      // Mapear dados do store para o formato esperado pela view
      space.value = {
        id: foundSpace.id,
        name: foundSpace.name,
        photos: foundSpace.photos || ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop'],
        description: foundSpace.description || `Espaço ${foundSpace.type.toLowerCase()} para prática de ${foundSpace.modality.toLowerCase()}. Localizado em ${foundSpace.address}. Valor por hora: R$ ${foundSpace.hourlyRate.toFixed(2)}.`,
        accessibility: 'Espaço totalmente acessível para pessoas com deficiência.',
        security: 'Espaço com sistema de segurança e monitoramento.',
        ballsAvailable: foundSpace.benefits?.includes('Material esportivo') || foundSpace.benefits?.includes('Equipamentos') ? 'Bolas e equipamentos disponíveis.' : 'Consultar disponibilidade de materiais.',
        floorType: foundSpace.benefits?.includes('Piso antiderrapante') ? 'Piso antiderrapante de alta qualidade.' : foundSpace.benefits?.includes('Piso oficial') ? 'Piso oficial da modalidade.' : foundSpace.benefits?.includes('Grama sintética') ? 'Grama sintética de alta qualidade.' : foundSpace.benefits?.includes('Areia importada') ? 'Areia importada especial.' : foundSpace.benefits?.includes('Piso saibro') ? 'Piso saibro profissional.' : 'Piso adequado para a modalidade.',
        address: foundSpace.address,
        hourlyRate: foundSpace.hourlyRate,
        type: foundSpace.type,
        modality: foundSpace.modality,
        benefits: foundSpace.benefits || []
      };
      
      // Definir a primeira foto como selecionada
      selectedImage.value = space.value.photos[0];
      
      console.log('Espaço carregado:', space.value);
    } else {
      console.error('Espaço não encontrado com ID:', spaceId);
      // Dados padrão caso não encontre
      space.value = {
        id: spaceId,
        name: 'Espaço não encontrado',
        photos: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop'],
        description: 'Espaço não encontrado no sistema.',
        accessibility: 'Espaço totalmente acessível para pessoas com deficiência.',
        security: 'Espaço com sistema de segurança e monitoramento.',
        ballsAvailable: 'Não informado',
        floorType: 'Não informado'
      };
      selectedImage.value = space.value.photos[0];
    }
  }
});
</script>

<style scoped>
/* Header Styles */
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

/* Space Content */
.space-content {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.space-title {
  font-size: 32px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 24px;
}

.space-image-container {
  margin-bottom: 24px;
}

.space-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}

.photo-gallery {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.gallery-item {
  width: 80px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.gallery-item:hover {
  border-color: #164194;
  transform: scale(1.05);
}

.gallery-item.active {
  border-color: #164194;
  box-shadow: 0 0 0 2px rgba(22, 65, 148, 0.2);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.space-description {
  margin-bottom: 24px;
}

.space-description p {
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
}

.space-details {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.detail-item {
  margin-bottom: 8px;
  font-size: 14px;
  color: #374151;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item strong {
  color: #164194;
  font-weight: 600;
}

.rent-section {
  margin-bottom: 32px;
}

.rent-btn {
  background-color: #4CAF50 !important;
  color: white !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 12px 32px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  height: 48px !important;
  min-width: 120px !important;
  transition: all 0.2s ease !important;
}

.rent-btn:hover {
  background-color: #388E3C !important;
}

/* Information Grid */
.info-grid {
  border-top: 1px solid #e5e7eb;
  padding-top: 24px;
}

.info-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.info-icon-container {
  width: 40px;
  height: 40px;
  background-color: #164194;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon {
  color: white;
  font-size: 16px;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.info-text {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

/* Reservation Section */
.reservation-section {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

.reservation-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
}

.reservation-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #374151;
  background: white;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.form-select:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Recurrence Toggle */
.recurrence-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f0fdf4;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
}

.recurrence-label {
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}

.recurrence-config {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

/* Time Slots */
.time-slots {
  margin-top: 1rem;
}

.time-slot-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.time-slot {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: #6b7280;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  border: 1px solid transparent;
}

.time-slot:hover {
  background-color: #e5e7eb;
  border-color: #22c55e;
}

.time-slot.active {
  background-color: #22c55e;
  color: white;
  border-color: #16a34a;
}

/* Warning Alert */
.warning-alert {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.warning-icon {
  color: #f59e0b;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.warning-alert span {
  color: #92400e;
  font-size: 0.9rem;
  flex: 1;
}

.warning-dates {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #92400e;
}

.warning-date {
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #f59e0b;
  font-weight: 500;
}

.warning-separator {
  font-weight: 500;
}

/* PrimeVue Overrides */
:deep(.p-button) {
  outline: none !important;
  box-shadow: none !important;
}

:deep(.p-button:focus) {
  box-shadow: none !important;
}

:deep(.p-checkbox .p-checkbox-box) {
  border-color: #d1d5db !important;
  border-radius: 4px !important;
  width: 18px !important;
  height: 18px !important;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background-color: #4CAF50 !important;
  border-color: #4CAF50 !important;
}

:deep(.p-calendar .p-inputtext) {
  background-color: white !important;
  border: 1px solid #d1d5db !important;
  border-radius: 6px !important;
  padding: 12px 40px 12px 12px !important;
  height: 48px !important;
  font-size: 14px !important;
  color: #374151 !important;
}

:deep(.p-calendar .p-inputtext:focus) {
  border-color: #4CAF50 !important;
  box-shadow: 0 0 0 1px #4CAF50 !important;
}

/* Dropdown de horário com mesmo estilo dos inputs de data */
:deep(.date-input.p-dropdown) {
  background-color: white !important;
  border: 1px solid #d1d5db !important;
  border-radius: 6px !important;
  height: 48px !important;
  font-size: 14px !important;
  color: #374151 !important;
}

:deep(.date-input.p-dropdown:focus-within) {
  border-color: #4CAF50 !important;
  box-shadow: 0 0 0 1px #4CAF50 !important;
}

:deep(.date-input.p-dropdown .p-dropdown-label) {
  padding: 12px 40px 12px 12px !important;
  font-size: 14px !important;
  color: #374151 !important;
}

:deep(.date-input.p-dropdown .p-dropdown-label.p-placeholder) {
  color: #9CA3AF !important;
}

:deep(.date-input.p-dropdown .p-dropdown-trigger) {
  background-color: transparent !important;
  border: none !important;
  width: 24px !important;
  height: 24px !important;
  right: 8px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

:deep(.p-calendar-button) {
  background-color: transparent !important;
  border: none !important;
  position: absolute !important;
  right: 8px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 32px !important;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.p-dropdown) {
  background-color: white !important;
  border: 1px solid #d1d5db !important;
  border-radius: 6px !important;
  height: 48px !important;
}

:deep(.p-dropdown:focus) {
  border-color: #4CAF50 !important;
  box-shadow: 0 0 0 1px #4CAF50 !important;
}

:deep(.p-dropdown .p-dropdown-label) {
  padding: 12px 40px 12px 12px !important;
  font-size: 14px !important;
  color: #374151 !important;
}

:deep(.p-dropdown-trigger) {
  background-color: transparent !important;
  color: #6b7280 !important;
  border: none !important;
  position: absolute !important;
  right: 8px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 32px !important;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Warning date inputs */
:deep(.warning-date-input .p-calendar .p-inputtext) {
  height: 36px !important;
  padding: 8px 32px 8px 8px !important;
  font-size: 12px !important;
}

:deep(.warning-date-input .p-calendar-button) {
  right: 4px !important;
  width: 24px !important;
  height: 24px !important;
}

/* Container and Layout */
.container {
  max-width: 1200px;
}

/* Responsive */
@media (max-width: 1024px) {
  .grid.grid-cols-1.lg\\:grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .space-content {
    order: 1;
  }
  
  .reservation-section {
    order: 2;
  }
}

@media (max-width: 640px) {
  .date-range-grid {
    grid-template-columns: 1fr;
  }
  
  .additional-images {
    flex-wrap: wrap;
  }
  
  .warning-dates {
    flex-direction: column;
  }
  
  .warning-date-input {
    width: 100%;
  }
}

/* Basic HTML inputs styling */
.date-input-basic,
.time-select-basic {
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.2s ease;
}

.date-input-basic:focus,
.time-select-basic:focus {
  outline: none;
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
}

.time-select-basic {
  cursor: pointer;
}

.time-select-basic option {
  padding: 8px;
}

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

.profile-btn-authenticated {
  background-color: #e3f2fd !important;
  border-color: #1976d2 !important;
  color: #1976d2 !important;
}

.profile-btn-authenticated:hover {
  background-color: #bbdefb !important;
  border-color: #1565c0 !important;
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

.header-btn {
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-btn:hover {
  background-color: #1e40af;
}

.logout-btn {
  background-color: #dc2626;
}

.logout-btn:hover {
  background-color: #b91c1c;
}

/* Novo Layout - Baseado na imagem */
.space-title {
  font-size: 2rem;
  font-weight: 400;
  color: #374151;
  margin-bottom: 2rem;
}

.space-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Coluna da Esquerda - Imagens */
.images-column {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.main-image-container {
  width: 100%;
  aspect-ratio: 16/9;
  max-height: 300px;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.main-image-container:hover .image-nav-overlay {
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

.thumbnails-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.375rem;
}

.thumbnail-item {
  aspect-ratio: 16/9;
  max-height: 80px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
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

/* Coluna da Direita - Informações */
.info-column {
  padding-left: 1rem;
}

.space-description {
  margin-bottom: 1.5rem;
}

.space-description p {
  color: #6b7280;
  line-height: 1.6;
  font-size: 0.95rem;
}

.rent-button-section {
  margin-bottom: 2rem;
}

.rent-btn-main {
  background-color: #22c55e !important;
  color: white !important;
  border: none !important;
  border-radius: 6px !important;
  padding: 12px 24px !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  width: 100% !important;
}

.rent-btn-main:hover {
  background-color: #16a34a !important;
}

.info-section {
  margin-bottom: 2rem;
}

.info-section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.info-grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.info-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #eff6ff;
  border-radius: 8px;
  flex-shrink: 0;
}

.info-icon-blue {
  color: #3b82f6;
  font-size: 1.2rem;
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

.info-text-wrapper {
  flex: 1;
}

.info-card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.info-card-text {
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.4;
}

/* Seção de Recorrência */
.recurrence-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

.recurrence-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.recurrence-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recurrence-field-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
}

.recurrence-date-input,
.recurrence-time-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #374151;
  background: white;
}

.recurrence-days {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.recurrence-checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #374151;
}

.recurrence-checkbox-item input[type="checkbox"] {
  margin: 0;
}

/* Responsividade */
@media (max-width: 1024px) {
  .space-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .info-column {
    padding-left: 0;
  }
  
  .recurrence-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .info-grid-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .space-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .thumbnails-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .warning-alert {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>