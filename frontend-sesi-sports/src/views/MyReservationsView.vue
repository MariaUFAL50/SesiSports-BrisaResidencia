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
        <h1 class="text-xl font-semibold text-gray-800">Minhas Reservas</h1>
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
          <i :class="authStore.isAuthenticated ? 'pi pi-sign-out' : 'pi pi-sign-in'"></i>
          {{ authStore.isAuthenticated ? 'Sair' : 'Entrar' }}
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Verificar se o usuário está logado -->
      <div v-if="!authStore.isAuthenticated" class="text-center py-12">
        <i class="pi pi-lock text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-600 mb-4">Acesso Restrito</h2>
        <p class="text-gray-500 mb-6">Você precisa fazer login para visualizar suas reservas.</p>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          @click="showAuthModal = true"
        >
          Fazer Login
        </button>
      </div>

      <!-- Lista de Reservas -->
      <div v-else>
        <div v-if="userReservations.length === 0" class="text-center py-12">
          <i class="pi pi-calendar text-6xl text-gray-400 mb-4"></i>
          <h2 class="text-2xl font-semibold text-gray-600 mb-4">Nenhuma Reserva Encontrada</h2>
          <p class="text-gray-500 mb-6">Você ainda não fez nenhuma reserva de espaço esportivo.</p>
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            @click="router.push('/')"
          >
            Fazer Nova Reserva
          </button>
        </div>

        <div v-else class="space-y-6">
          <!-- Filtros -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
            <div class="flex gap-4 flex-wrap">
              <select
                v-model="statusFilter"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os Status</option>
                <option value="Pendente">Pendente</option>
                <option value="Aprovada">Aprovada</option>
                <option value="Rejeitada">Rejeitada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <!-- Lista de Reservas -->
          <div class="space-y-4">
            <div
              v-for="reservation in filteredReservations"
              :key="reservation.id"
              class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">{{ reservation.spaceName }}</h3>
                    <p class="text-gray-600">Reserva #{{ reservation.id }}</p>
                  </div>
                  <span
                    :class="getStatusBadgeClass(reservation.status)"
                    class="px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ reservation.status }}
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <i class="pi pi-calendar text-blue-500 mr-2"></i>
                    <span class="text-gray-700">{{ formatDate(reservation.date) }}</span>
                  </div>
                  <div>
                    <i class="pi pi-clock text-green-500 mr-2"></i>
                    <span class="text-gray-700">{{ reservation.startTime }} - {{ reservation.endTime }}</span>
                  </div>
                  <div>
                    <i class="pi pi-user text-purple-500 mr-2"></i>
                    <span class="text-gray-700">{{ reservation.userName }}</span>
                  </div>
                  <div>
                    <i class="pi pi-plus text-orange-500 mr-2"></i>
                    <span class="text-gray-700">{{ formatDate(reservation.createdAt) }}</span>
                  </div>
                </div>

                <div v-if="reservation.purpose" class="mb-4">
                  <p class="text-sm text-gray-600">
                    <strong>Finalidade:</strong> {{ reservation.purpose }}
                  </p>
                </div>

                <!-- Ações -->
                <div class="flex gap-3 pt-4 border-t border-gray-100">
                  <!-- Cancelar reserva -->
                  <button
                    v-if="reservation.status === 'Aprovada' || reservation.status === 'Pendente'"
                    @click="cancelReservation(reservation.id)"
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i class="pi pi-times mr-2"></i>
                    Cancelar
                  </button>

                  <!-- Ver detalhes -->
                  <button
                    @click="viewReservationDetails(reservation)"
                    class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i class="pi pi-eye mr-2"></i>
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Auth Modal -->
    <AuthModal
      v-if="showAuthModal"
      @close="showAuthModal = false"
      @login-success="handleLoginSuccess"
    />

    <!-- Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showDetailsModal = false"
    >
      <div
        class="bg-white rounded-lg max-w-md w-full mx-4 p-6"
        @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Detalhes da Reserva</h3>
          <button
            @click="showDetailsModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div v-if="selectedReservation" class="space-y-3">
          <div>
            <strong>Espaço:</strong> {{ selectedReservation.spaceName }}
          </div>
          <div>
            <strong>Data:</strong> {{ formatDate(selectedReservation.date) }}
          </div>
          <div>
            <strong>Horário:</strong> {{ selectedReservation.startTime }} - {{ selectedReservation.endTime }}
          </div>
          <div>
            <strong>Status:</strong> 
            <span :class="getStatusBadgeClass(selectedReservation.status)" class="px-2 py-1 rounded text-sm ml-2">
              {{ selectedReservation.status }}
            </span>
          </div>
          <div>
            <strong>Criada em:</strong> {{ formatDate(selectedReservation.createdAt) }}
          </div>
          <div v-if="selectedReservation.purpose">
            <strong>Finalidade:</strong> {{ selectedReservation.purpose }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useReservationsStore } from '../stores/reservations.js';
import { redirectBasedOnUserType } from '../utils/navigationUtils.js';
import Button from 'primevue/button';
import AuthModal from '../components/auth/AuthModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const reservationsStore = useReservationsStore();

const showAuthModal = ref(false);
const showDetailsModal = ref(false);
const selectedReservation = ref(null);
const statusFilter = ref('');

// Computed para reservas do usuário
const userReservations = computed(() => {
  if (!authStore.isAuthenticated || !authStore.currentUser) {
    return [];
  }
  return reservationsStore.getUserReservations(authStore.currentUser.id);
});

// Computed para reservas filtradas
const filteredReservations = computed(() => {
  if (!statusFilter.value) {
    return userReservations.value;
  }
  return userReservations.value.filter(reservation => reservation.status === statusFilter.value);
});

// Funções utilitárias
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  // Se for ISO string (com T), extrair apenas a parte da data
  if (dateString.includes('T')) {
    dateString = dateString.split('T')[0];
  }
  
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const getStatusBadgeClass = (status) => {
  const classes = {
    'Pendente': 'bg-yellow-100 text-yellow-800',
    'Aprovada': 'bg-green-100 text-green-800',
    'Rejeitada': 'bg-red-100 text-red-800',
    'Cancelada': 'bg-gray-100 text-gray-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

// Ações
const goBack = () => {
  router.back();
};

const handleProfileClick = () => {
  if (authStore.isAuthenticated) {
    redirectBasedOnUserType(authStore.currentUser, router);
  } else {
    showAuthModal.value = true;
  }
};

const handleAuthClick = () => {
  if (authStore.isAuthenticated) {
    authStore.logout();
    router.push('/');
  } else {
    showAuthModal.value = true;
  }
};

const handleLoginSuccess = () => {
  showAuthModal.value = false;
  // Recarregar reservas se necessário
};

const cancelReservation = (reservationId) => {
  const result = reservationsStore.cancelReservation(reservationId);
  if (result.success) {
    alert(result.message);
  } else {
    alert(result.message);
  }
};

const viewReservationDetails = (reservation) => {
  selectedReservation.value = reservation;
  showDetailsModal.value = true;
};

onMounted(() => {
  // Carregar reservas se necessário
  console.log('Carregando reservas do usuário...');
});
</script>

<style scoped>
.back-btn {
  background-color: #164194 !important;
  color: white !important;
  border: none !important;
  border-radius: 50% !important;
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  padding: 0 !important;
}

.back-btn:hover {
  background-color: #0d2d6b !important;
}

.profile-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  background-color: white;
  color: #6b7280;
  transition: all 0.3s ease;
  cursor: pointer;
}

.profile-btn:hover {
  border-color: #164194;
  color: #164194;
}

.profile-btn-authenticated {
  border-color: #10b981;
  color: #10b981;
}

.profile-photo-mini {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
}

.profile-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #164194;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.header-btn:hover {
  background-color: #0d2d6b;
}

.logout-btn {
  background-color: #dc2626;
}

.logout-btn:hover {
  background-color: #b91c1c;
}
</style>