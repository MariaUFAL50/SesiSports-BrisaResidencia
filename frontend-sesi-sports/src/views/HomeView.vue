<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center">
      <div class="flex items-center">
        <img src="/sesi-sports-logo.png" alt="SESI Sports Logo" class="h-8" />
      </div>
      <div class="flex items-center gap-3">
        <!-- Profile Icon -->
        <button
          class="profile-btn"
          @click="handleProfileClick"
          :title="authStore.isAuthenticated ? 'Meu Perfil' : 'Fazer Login para acessar perfil'"
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
        >
                    <span v-if="authStore.isAuthenticated">Sair</span>
          <span v-else>Entrar</span>
        </button>
      </div>
    </header>


    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Navigation Buttons -->
      <section class="flex justify-center gap-0 mb-8">
        <Button
          label="Alugar"
          :class="['nav-btn', 'nav-btn-first', { 'nav-btn-active': activeTab === 'alugar' }]"
          @click="activeTab = 'alugar'"
        />
        <Button
          label="Competições"
          :class="['nav-btn', 'nav-btn-middle', { 'nav-btn-active': activeTab === 'competicoes' }]"
          @click="handleNavigate('competicoes')"
        />
        <Button
          label="Escolinhas"
          :class="['nav-btn', 'nav-btn-last', { 'nav-btn-active': activeTab === 'escolinhas' }]"
          @click="handleNavigate('escolinhas')"
        />
      </section>

      <!-- Search Form - Layout Horizontal Compacto -->
      <section class="max-w-7xl mx-auto mb-8">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
          <!-- Filter Form -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 items-end">
            <!-- Data -->
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-2">Data</label>
              <input
                type="date"
                v-model="searchForm.date"
                :min="todayString"
                class="compact-input"
                required
              />
            </div>

            <!-- Hora Início -->
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-2">Hr Início</label>
              <select
                v-model="searchForm.startTime"
                class="compact-select"
                required
              >
                <option value="">Selecione horário</option>
                <option value="06:00">06:00</option>
                <option value="07:00">07:00</option>
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
                <option value="19:00">19:00</option>
                <option value="20:00">20:00</option>
                <option value="21:00">21:00</option>
                <option value="22:00">22:00</option>
              </select>
            </div>

            <!-- Hora Fim -->
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-2">Hr Fim</label>
              <select
                v-model="searchForm.endTime"
                :disabled="!searchForm.startTime"
                class="compact-select"
                :class="{ 'opacity-50 cursor-not-allowed': !searchForm.startTime }"
                required
              >
                <option value="">Selecione horário</option>
                <option 
                  v-for="time in availableEndTimes" 
                  :key="time" 
                  :value="time"
                >
                  {{ time }}
                </option>
              </select>
            </div>

            <!-- Tipo -->
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select v-model="searchForm.type" class="compact-select">
                <option value="">Selecione o tipo</option>
                <option 
                  v-for="type in spacesStore.availableTypes" 
                  :key="type" 
                  :value="type"
                >
                  {{ type }}
                </option>
              </select>
            </div>

            <!-- Modalidade -->
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-2">Modalidade</label>
              <select v-model="searchForm.modality" class="compact-select">
                <option value="">Selecione a modalidade</option>
                <option 
                  v-for="modality in spacesStore.availableModalities" 
                  :key="modality" 
                  :value="modality"
                >
                  {{ modality }}
                </option>
              </select>
            </div>

            <!-- Botão Buscar -->
            <div class="flex flex-col">
              <button
                @click="handleSearch"
                :disabled="!isFormValid || isSearching"
                class="compact-search-btn"
                :class="{ 'opacity-50 cursor-not-allowed': !isFormValid || isSearching }"
              >
                <span v-if="isSearching">Buscando...</span>
                <span v-else>Buscar</span>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div class="flex items-center">
              <i class="pi pi-exclamation-triangle text-red-500 mr-2 text-sm"></i>
              <span class="text-red-700 text-sm">{{ errorMessage }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Filter Tags -->
      <section v-if="(searchForm.type || searchForm.modality) && searchPerformed" class="max-w-5xl mx-auto mt-6 px-4">
        <div class="flex flex-wrap gap-2">
          <span v-if="searchForm.type" class="filter-tag" :class="availableSpaces.length > 0 ? 'filter-tag-available' : 'filter-tag-unavailable'">
            {{ searchForm.type }}
            <i class="pi pi-times ml-2 cursor-pointer" @click="removeFilter('type')"></i>
          </span>
          <span v-if="searchForm.modality" class="filter-tag" :class="availableSpaces.length > 0 ? 'filter-tag-available' : 'filter-tag-unavailable'">
            {{ searchForm.modality }}
            <i class="pi pi-times ml-2 cursor-pointer" @click="removeFilter('modality')"></i>
          </span>
        </div>
      </section>

      <!-- Search Results -->
      <section v-if="availableSpaces.length > 0" class="max-w-5xl mx-auto mt-6 px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div 
            v-for="result in availableSpaces" 
            :key="result.id"
            class="result-card"
            :class="{ 
              'result-card-available': result.status === 'Livre' && !result.isUnavailable,
              'result-card-unavailable': result.isUnavailable || result.showMaintenanceAlert
            }"
            @click="navigateToReservation(result)"
          >
            <!-- Image -->
            <div class="result-image">
              <img :src="result.photo" :alt="result.modality" />
              <!-- Status Badge -->
              <div class="absolute top-2 right-2 z-10">
                <span class="status-badge" :class="{
                  'status-available': result.status === 'Livre',
                  'status-unavailable': result.status !== 'Livre' && !result.showMaintenanceAlert,
                  'status-maintenance': result.showMaintenanceAlert
                }">
                  {{ result.status === 'Livre' ? 'Disponível' : (result.showMaintenanceAlert ? 'Manutenção' : 'Indisponível') }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="result-content">
              <h3 class="font-medium text-sm text-gray-900 mb-2">{{ result.modality }}</h3>
              
              <!-- Alerta de Manutenção -->
              <div v-if="result.showMaintenanceAlert" class="maintenance-alert mb-2">
                <div class="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <i class="pi pi-exclamation-triangle text-yellow-500 text-sm"></i>
                  <span class="text-yellow-700 text-xs font-medium">Manutenção</span>
                </div>
              </div>

              <!-- Alerta de Ocupado/Indisponível -->
              <div v-if="result.showOccupiedAlert" class="occupied-alert mb-2">
                <div class="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <i class="pi pi-times-circle text-red-500 text-sm"></i>
                  <span class="text-red-700 text-xs font-medium">Indisponível</span>
                </div>
              </div>
              
              <div class="result-info">
                <div class="result-item">
                  <i class="pi pi-clock"></i>
                  <span>{{ result.time }}</span>
                </div>
                <div class="result-item">
                  <i class="pi pi-map-marker"></i>
                  <span>{{ result.address }}</span>
                </div>
                <div class="result-item">
                  <i class="pi pi-star"></i>
                  <span>{{ result.modality }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- No Results Message -->
      <section v-else-if="searchPerformed" class="max-w-5xl mx-auto mt-6 text-center py-12 px-4">
        <div class="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <i class="pi pi-search text-4xl text-gray-400 mb-4"></i>
          <h3 class="text-xl font-medium text-gray-900 mb-2">Nenhum espaço disponível</h3>
          <p class="text-gray-600 mb-4">Não encontramos espaços para os filtros selecionados. Que tal tentar:</p>
          <div class="text-left max-w-md mx-auto mb-6">
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center">
                <i class="pi pi-calendar text-blue-500 mr-2"></i>
                Ajustar a data ou horário
              </li>
              <li class="flex items-center">
                <i class="pi pi-map-marker text-green-500 mr-2"></i>
                Experimentar outro tipo de espaço
              </li>
              <li class="flex items-center">
                <i class="pi pi-clock text-orange-500 mr-2"></i>
                Flexibilizar o período de uso
              </li>
            </ul>
          </div>
          <button @click="clearAllFilters" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Limpar filtros e ver todos
          </button>
        </div>
      </section>

      <!-- Welcome Message - Before Search -->
      <section v-else class="max-w-5xl mx-auto mt-6 text-center py-12 px-4">
        <div class="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-blue-100 p-6 md:p-8">
          <div class="mb-4">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-2">
              <i class="pi pi-search text-2xl text-green-500"></i>
            </div>
          </div>
          <h3 class="text-xl font-medium text-gray-900 mb-2">Encontre o espaço perfeito para você</h3>
          <p class="text-gray-600 mb-6">Preencha os filtros acima para descobrir espaços esportivos disponíveis na sua região e horário preferido.</p>
          <div class="flex flex-wrap justify-center gap-4 text-sm">
            <div class="flex items-center text-gray-600">
              <i class="pi pi-check text-green-500 mr-2"></i>
              <span>Reserva instantânea</span>
            </div>
            <div class="flex items-center text-gray-600">
              <i class="pi pi-check text-green-500 mr-2"></i>
              <span>Preços acessíveis</span>
            </div>
            <div class="flex items-center text-gray-600">
              <i class="pi pi-check text-green-500 mr-2"></i>
              <span>Espaços verificados</span>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Auth Modal -->
    <AuthModal 
      :is-visible="showAuthModal" 
      @update:is-visible="showAuthModal = $event"
      @login-success="handleLoginSuccess"
      @register-success="handleRegisterSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { redirectBasedOnUserType } from '../utils/navigationUtils.js';
import Button from 'primevue/button';
import AuthModal from '../components/auth/AuthModal.vue';
import { useAuthStore } from '../stores/auth.js';
import { useSpacesStore } from '../stores/spaces.js';

const router = useRouter();
const authStore = useAuthStore();
const spacesStore = useSpacesStore();

const showAuthModal = ref(false);
const activeTab = ref('alugar');
const isSearching = ref(false);
const errorMessage = ref('');
const searchPerformed = ref(false);

// Data atual para validação
const today = new Date();
const todayString = today.getFullYear() + '-' + 
  String(today.getMonth() + 1).padStart(2, '0') + '-' + 
  String(today.getDate()).padStart(2, '0');

// Função para carregar filtros salvos do localStorage
const loadSavedFilters = () => {
  console.log('Carregando filtros salvos...');
  const saved = localStorage.getItem('sesi-sports-filters');
  
  if (saved) {
    try {
      const parsedFilters = JSON.parse(saved);
      console.log('Filtros encontrados no localStorage:', parsedFilters);
      
      // Verificar se a data salva não é anterior a hoje
      if (parsedFilters.date && parsedFilters.date < todayString) {
        console.log('Data anterior detectada, atualizando para hoje');
        parsedFilters.date = todayString;
      }
      
      return parsedFilters;
    } catch (error) {
      console.error('Erro ao carregar filtros salvos:', error);
      localStorage.removeItem('sesi-sports-filters'); // Remove dados corrompidos
    }
  }
  
  console.log('Usando filtros padrão');
  return {
    date: todayString,
    startTime: '',
    endTime: '',
    type: '',
    modality: '',
  };
};

const searchForm = reactive(loadSavedFilters());

// Função para salvar filtros no localStorage
const saveFilters = () => {
  localStorage.setItem('sesi-sports-filters', JSON.stringify({
    date: searchForm.date,
    startTime: searchForm.startTime,
    endTime: searchForm.endTime,
    type: searchForm.type,
    modality: searchForm.modality,
  }));
};

// Watcher para salvar filtros automaticamente quando mudarem
// Usa debounce para evitar salvar demais e não interferir com validações
let saveTimeout;
watch(searchForm, (newValue) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    console.log('Salvando filtros no localStorage...');
    saveFilters();
  }, 500); // Aumentado para 500ms para dar mais tempo para as validações
}, { deep: true });

// Função para executar busca (chamada internamente)
const performSearch = async () => {
  if (!isFormValid.value) {
    console.log('Formulário inválido, não executando busca');
    return;
  }
  
  await handleSearch();
};

// Restaurar estado da busca quando a página carregar
onMounted(() => {
  console.log('=== INICIALIZANDO HOMEVIEW ===');
  
  // Inicializar authStore
  authStore.initializeAuth();
  console.log('AuthStore inicializado');
  
  // Inicializar spacesStore
  spacesStore.initializeSpaces();
  console.log('SpacesStore inicializado');
  
  // Se há filtros salvos e o formulário é válido, executar busca automaticamente
  if (hasActiveFilters.value && isFormValid.value) {
    console.log('Filtros ativos detectados, executando busca...');
    setTimeout(() => {
      performSearch();
    }, 100); // Aguarda um pouco para garantir que tudo foi carregado
  } else {
    console.log('Nenhum filtro ativo ou formulário inválido');
  }
  
  console.log('=== HOMEVIEW INICIALIZADO ===');
});

// Computed para validar se o formulário está válido
const isFormValid = computed(() => {
  const valid = searchForm.date && 
         searchForm.startTime && 
         searchForm.endTime && 
         isValidDate(searchForm.date) &&
         isValidTimeRange(searchForm.startTime, searchForm.endTime);
  
  console.log('Validação do formulário:', {
    date: searchForm.date,
    startTime: searchForm.startTime,
    endTime: searchForm.endTime,
    isValidDate: isValidDate(searchForm.date),
    isValidTimeRange: isValidTimeRange(searchForm.startTime, searchForm.endTime),
    finalValid: valid
  });
  
  return valid;
});

// Computed para verificar se há filtros ativos
const hasActiveFilters = computed(() => {
  const hasFilters = (searchForm.type && searchForm.type !== '') || 
                    (searchForm.modality && searchForm.modality !== '') || 
                    (searchForm.date && searchForm.date !== '' && searchForm.date !== todayString) || 
                    (searchForm.startTime && searchForm.startTime !== '' && 
                     searchForm.endTime && searchForm.endTime !== '');
  
  console.log('Verificando filtros ativos:', {
    type: searchForm.type,
    modality: searchForm.modality,
    date: searchForm.date,
    startTime: searchForm.startTime,
    endTime: searchForm.endTime,
    hasFilters
  });
  
  return hasFilters;
});

// Função para validar se a data é hoje ou no futuro
const isValidDate = (dateString) => {
  if (!dateString) return false;
  const selectedDate = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

// Computed para gerar horários disponíveis para fim baseado no início
const availableEndTimes = computed(() => {
  console.log('Calculando horários de fim para início:', searchForm.startTime);
  
  if (!searchForm.startTime) {
    console.log('Sem horário de início, retornando array vazio');
    return [];
  }
  
  const allTimes = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00', '23:00'
  ];
  
  const availableTimes = allTimes.filter(time => time > searchForm.startTime);
  console.log('Horários disponíveis para fim:', availableTimes);
  
  return availableTimes;
});

// Função para validar se o horário fim é posterior ao início
const isValidTimeRange = (startTime, endTime) => {
  console.log('Validando intervalo de tempo:', startTime, 'até', endTime);
  
  if (!startTime || !endTime) {
    console.log('Faltam horários para validar');
    return false;
  }
  
  const isValid = endTime > startTime;
  console.log('Intervalo válido:', isValid);
  
  return isValid;
};

// Watch para limpar hora fim quando hora início mudar
watch(() => searchForm.startTime, (newStartTime, oldStartTime) => {
  console.log('Hora início mudou:', oldStartTime, '->', newStartTime);
  
  if (newStartTime && searchForm.endTime) {
    // Se a hora fim não é mais válida com a nova hora início, limpar
    if (searchForm.endTime <= newStartTime) {
      console.log('Limpando hora fim pois não é mais válida');
      searchForm.endTime = '';
    }
  }
  clearErrorMessage();
});

// Watch para validar data
watch(() => searchForm.date, () => {
  clearErrorMessage();
});

// Watch para validar horário fim
watch(() => searchForm.endTime, () => {
  clearErrorMessage();
});

const clearErrorMessage = () => {
  errorMessage.value = '';
};

const typeOptions = ref([
  'Futebol',
  'Basquete', 
  'Vôlei',
  'Tênis',
  'Natação'
]);

const modalities = ref([
  'Quadra',
  'Campo', 
  'Piscina',
  'Ginásio'
]);

// Computed para obter espaços do store - só após busca válida
const availableSpaces = computed(() => {
  // Só mostra resultados se a busca foi realizada
  if (!searchPerformed.value) {
    return [];
  }

  if (!spacesStore.filteredSpaces || spacesStore.filteredSpaces.length === 0) {
    return [];
  }
  
  return spacesStore.filteredSpaces.map(space => {
    // Usar horário da busca
    let timeDisplay = `${searchForm.startTime} - ${searchForm.endTime}`;
    
    // Determinar status com base em manutenção e disponibilidade
    let displayStatus, isUnavailable, showMaintenanceAlert, showOccupiedAlert;
    
    if (space.status === 'Manutenção') {
      displayStatus = 'Indisponível';
      isUnavailable = true;
      showMaintenanceAlert = true;
      showOccupiedAlert = false;
    } else if (space.status === 'Ocupado') {
      displayStatus = 'Indisponível';
      isUnavailable = true;
      showMaintenanceAlert = false;
      showOccupiedAlert = true;
    } else if (space.status === 'Indisponível') {
      displayStatus = 'Indisponível';
      isUnavailable = true;
      showMaintenanceAlert = false;
      showOccupiedAlert = true;
    } else {
      displayStatus = 'Livre';
      isUnavailable = false;
      showMaintenanceAlert = false;
      showOccupiedAlert = false;
    }
    
    return {
      id: space.id,
      photo: space.photos?.[0] || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop',
      time: timeDisplay,
      address: space.address || 'Endereço não informado',
      modality: space.type || space.modality || 'Não informado',
      value: spacesStore.formatPrice(space.hourlyRate || 0),
      status: displayStatus,
      showMaintenanceAlert: showMaintenanceAlert,
      showOccupiedAlert: showOccupiedAlert,
      maintenanceInfo: space.maintenanceInfo || null,
      isUnavailable: isUnavailable
    };
  });
});

const handleNavigate = (destination) => {
  activeTab.value = destination;
  
  if (destination === 'alugar') {
    router.push('/alugar');
  } else {
    console.log(`Botão "${destination}" clicado. Navegação não implementada ainda.`);
  }
};

const handleSearch = async () => {
  console.log('=== INICIANDO BUSCA ===');
  console.log('Formulário atual:', { ...searchForm });
  
  // Limpar mensagem de erro anterior
  errorMessage.value = '';
  
  // Validação da data
  if (!searchForm.date) {
    errorMessage.value = 'Por favor, selecione uma data.';
    console.log('Erro: Data não selecionada');
    return;
  }

  if (!isValidDate(searchForm.date)) {
    errorMessage.value = 'A data deve ser hoje ou uma data futura.';
    console.log('Erro: Data inválida');
    return;
  }

  // Validação da hora início
  if (!searchForm.startTime) {
    errorMessage.value = 'Por favor, selecione a hora de início.';
    console.log('Erro: Hora de início não selecionada');
    return;
  }

  // Validação da hora fim
  if (!searchForm.endTime) {
    errorMessage.value = 'Por favor, selecione a hora de fim.';
    console.log('Erro: Hora de fim não selecionada');
    return;
  }

  if (!isValidTimeRange(searchForm.startTime, searchForm.endTime)) {
    errorMessage.value = 'A hora de fim deve ser posterior à hora de início.';
    console.log('Erro: Intervalo de tempo inválido');
    return;
  }

  console.log('Validações passaram, iniciando busca...');

  // Iniciar busca
  isSearching.value = true;
  
  try {
    // Aplicar filtros no store de espaços
    const filters = {
      type: searchForm.type || '',
      modality: searchForm.modality || '',
      date: searchForm.date,
      startTime: searchForm.startTime,
      endTime: searchForm.endTime
    };
    
    console.log('Aplicando filtros:', filters);
    spacesStore.updateFilters(filters);

    // Marcar que a busca foi realizada
    searchPerformed.value = true;
    
    // Simular delay de busca
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Busca concluída. Espaços encontrados:', availableSpaces.value.length);
    console.log('=== FIM DA BUSCA ===');
  } catch (error) {
    console.error('Erro na busca:', error);
    errorMessage.value = 'Erro ao buscar espaços. Tente novamente.';
  } finally {
    isSearching.value = false;
  }
};

// Função para limpar todos os filtros
const clearFilters = () => {
  searchForm.date = '';
  searchForm.startTime = '';
  searchForm.endTime = '';
  searchForm.type = '';
  searchForm.modality = '';
  errorMessage.value = '';
  searchPerformed.value = false;
  
  // Limpar filtros no store
  spacesStore.clearFilters();
  console.log('Filtros limpos');
};

// Função para limpar todos os filtros - versão melhorada
const clearAllFilters = () => {
  console.log('Limpando todos os filtros...');
  
  // Resetar formulário
  searchForm.date = todayString; // Voltar para data de hoje
  searchForm.startTime = '';
  searchForm.endTime = '';
  searchForm.type = '';
  searchForm.modality = '';
  errorMessage.value = '';
  searchPerformed.value = false;
  
  // Limpar localStorage
  localStorage.removeItem('sesi-sports-filters');
  
  // Limpar filtros no store e mostrar todos os espaços
  spacesStore.clearFilters();
  spacesStore.loadAllSpaces();
  
  console.log('Todos os filtros limpos - mostrando todos os espaços');
};

// Função para formatar data de manutenção
const formatMaintenanceDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Função para aplicar filtros rápidos
// Removida - não é mais necessária com o novo layout

const removeFilter = (filterType) => {
  switch (filterType) {
    case 'type':
      searchForm.type = '';
      break;
    case 'modality':
      searchForm.modality = '';
      break;
    case 'date':
      searchForm.date = '';
      break;
    case 'time':
      searchForm.startTime = '';
      searchForm.endTime = '';
      break;
  }
  
  // Refazer a busca com os filtros atualizados
  if (searchPerformed.value) {
    handleSearch();
  }
  
  console.log(`Filtro ${filterType} removido`);
};

// Função para formatar data para exibição
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const navigateToReservation = (space) => {
  // Não permitir clique em espaços indisponíveis ou em manutenção
  if (space.status !== 'Livre' || space.isUnavailable || space.showMaintenanceAlert) {
    console.log('Espaço indisponível, clique bloqueado');
    return;
  }
  
  console.log('Navegando para reserva do espaço:', space);
  router.push({
    name: 'SpaceReservation',
    params: { id: space.id },
    query: { 
      modality: space.modality,
      time: space.time 
    }
  });
};

const handleLoginSuccess = () => {
  showAuthModal.value = false;
};

const handleRegisterSuccess = () => {
  showAuthModal.value = false;
};

const handleProfileClick = () => {
  console.log('=== PROFILE CLICK DEBUG ===');
  console.log('authStore.isAuthenticated:', authStore.isAuthenticated);
  console.log('authStore.currentUser:', authStore.currentUser);
  console.log('localStorage user:', localStorage.getItem('sesi_sports_user'));
  
  if (!authStore.isAuthenticated) {
    console.log('Usuário não autenticado, inicializando auth...');
    authStore.initializeAuth();
    console.log('Após inicialização - isAuthenticated:', authStore.isAuthenticated);
  }
  
  if (authStore.isAuthenticated && authStore.currentUser) {
    console.log('Usuário logado, redirecionando...');
    const userType = authStore.currentUser?.type || 'client';
    console.log('Tipo do usuário:', userType);
    
    try {
      redirectBasedOnUserType(userType, router);
      console.log('Redirecionamento executado com sucesso');
    } catch (error) {
      console.error('Erro no redirecionamento:', error);
    }
  } else {
    console.log('Usuário não logado, abrindo modal de auth...');
    showAuthModal.value = true;
  }
  console.log('=== FIM PROFILE CLICK DEBUG ===');
};

const goToAdminPanel = () => {
  router.push('/admin');
};

const handleAuthClick = () => {
  if (authStore.isAuthenticated) {
    authStore.logout();
  } else {
    showAuthModal.value = true;
  }
};
</script>

<style>
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
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  border-radius: 50% !important;
  overflow: hidden !important;
  border: none !important;
}

.profile-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
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

/* Navigation Buttons */
.nav-btn {
  background-color: white !important;
  color: #374151 !important;
  border: 1px solid #e5e7eb !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  padding: 12px 24px !important;
  height: 48px !important;
  min-width: 120px !important;
  transition: all 0.2s ease !important;
  position: relative !important;
}

.nav-btn-first {
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
  border-right: none !important;
}

.nav-btn-middle {
  border-radius: 0 !important;
  border-right: none !important;
  border-left: none !important;
}

.nav-btn-last {
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
  border-left: none !important;
}

.nav-btn-active {
  background-color: #4CAF50 !important;
  color: white !important;
  border-color: #4CAF50 !important;
  z-index: 1 !important;
}

.nav-btn-active:hover {
  background-color: #388E3C !important;
  border-color: #388E3C !important;
}

.nav-btn:hover:not(.nav-btn-active) {
  background-color: #f9fafb !important;
}

/* Custom Icons */
.custom-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
}

/* Form Styles */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
}

.form-input {
  width: 100%;
  position: relative;
}

/* Calendar and Time Input Specific Styles */
.calendar-input,
.time-input {
  position: relative;
}

/* Input Field Styling */
.form-input .p-component {
  width: 100% !important;
}

/* Search Button - Modern Design */
.search-btn {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
  color: white !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 16px 40px !important;
  font-weight: 700 !important;
  font-size: 15px !important;
  height: 56px !important;
  min-width: 140px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3) !important;
  letter-spacing: 0.5px !important;
  text-transform: uppercase !important;
}

.search-btn:hover {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4) !important;
}

/* Filter Tags - Modern Design */
.filter-tag {
  display: inline-flex !important;
  align-items: center !important;
  padding: 8px 16px !important;
  background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%) !important;
  color: #64748b !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 20px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
  letter-spacing: 0.3px !important;
}

.filter-tag-active {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
  color: white !important;
  border-color: #16a34a !important;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25) !important;
}

.filter-tag-available {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
  color: white !important;
  border-color: #16a34a !important;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25) !important;
}

.filter-tag-unavailable {
  background: linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%) !important;
  color: #64748b !important;
  border-color: #e2e8f0 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
}

.filter-tag:hover {
  background: linear-gradient(145deg, #e2e8f0 0%, #cbd5e1 100%) !important;
  border-color: #cbd5e1 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.filter-tag-active:hover {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.35) !important;
}

/* Result Cards - Modern Design */
.result-card {
  position: relative;
  background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%) !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 16px !important;
  overflow: hidden !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  cursor: pointer !important;
  min-height: 200px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

.result-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  z-index: 10;
}

.result-card:hover {
  transform: translateY(-6px) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
  border-color: #22c55e !important;
}

.result-card:hover::before {
  transform: scaleX(1);
}

.result-card-available {
  cursor: pointer !important;
}

.result-card-available:hover {
  background: linear-gradient(145deg, #f8fffe 0%, #f0fdf4 100%) !important;
}

.result-card:not(.result-card-available) {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%) !important;
}

.result-card:not(.result-card-available):hover {
  transform: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  border-color: #e2e8f0 !important;
}

.result-card:not(.result-card-available)::before {
  background: linear-gradient(90deg, #dc2626, #991b1b);
}

.result-image {
  position: relative !important;
  height: 140px !important;
  overflow: hidden !important;
  background: linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%) !important;
  border-radius: 16px 16px 0 0 !important;
}

.result-image img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  transition: transform 0.4s ease !important;
}

.result-card:hover .result-image img {
  transform: scale(1.05) !important;
}

.status-badge {
  padding: 6px 16px !important;
  border-radius: 20px !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  backdrop-filter: blur(10px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s ease !important;
  white-space: nowrap !important;
  min-width: fit-content !important;
}

.status-available {
  background: rgba(34, 197, 94, 0.9) !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.status-unavailable {
  background: rgba(220, 38, 38, 0.9) !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.status-maintenance {
  background: rgba(234, 179, 8, 0.9) !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.result-content {
  padding: 18px !important;
  background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%) !important;
  border-radius: 0 0 16px 16px !important;
  margin: 0 !important;
  border-top: 1px solid #e2e8f0 !important;
}

.result-content h3 {
  font-size: 16px !important;
  font-weight: 700 !important;
  color: #1e293b !important;
  margin-bottom: 12px !important;
  letter-spacing: 0.3px !important;
}

.result-info {
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
}

.result-item {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  color: #64748b !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  transition: color 0.2s ease !important;
}

.result-item i {
  color: #22c55e !important;
  font-size: 14px !important;
  min-width: 16px !important;
}

.result-card:hover .result-item {
  color: #475569 !important;
}

.result-item i {
  width: 10px;
  height: 10px;
  color: #9ca3af;
  font-size: 10px;
}

/* PrimeVue Overrides */
:deep(.p-button) {
  outline: none !important;
  box-shadow: none !important;
}

:deep(.p-button:focus) {
  box-shadow: none !important;
}

/* Calendar Overrides - Modern Design - FORCE OVERRIDE */
:deep(.p-calendar),
:deep(.p-calendar .p-inputtext),
.p-calendar .p-inputtext,
input[type="text"] {
  background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%) !important;
  border: 2px solid #e2e8f0 !important;
  border-radius: 12px !important;
  padding: 14px 48px 14px 16px !important;
  height: 56px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  color: #1e293b !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
}

:deep(.p-calendar .p-inputtext:focus),
:deep(.p-calendar:focus-within .p-inputtext),
.p-calendar .p-inputtext:focus,
input[type="text"]:focus {
  border-color: #22c55e !important;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
  transform: translateY(-2px) !important;
  background: linear-gradient(145deg, #ffffff 0%, #f8fffe 100%) !important;
}

:deep(.p-calendar .p-inputtext:hover),
.p-calendar .p-inputtext:hover,
input[type="text"]:hover {
  border-color: #22c55e !important;
  box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.12) !important;
  transform: translateY(-1px) !important;
  background: linear-gradient(145deg, #fafafa 0%, #f0fdf4 100%) !important;
}

:deep(.p-calendar .p-inputtext::placeholder) {
  color: #9ca3af !important;
  font-weight: 400 !important;
}

/* Calendar Icon - Modern Style */
:deep(.p-calendar-button) {
  background-color: transparent !important;
  border: none !important;
  color: #6b7280 !important;
  position: absolute !important;
  right: 12px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 36px !important;
  height: 36px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
}

:deep(.p-calendar-button:hover) {
  background-color: #f3f4f6 !important;
  color: #22c55e !important;
}

/* DatePicker Panel - SUPER FORCE OVERRIDE */
:deep(.p-datepicker),
.p-datepicker,
div[data-pc-section="panel"] {
  background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%) !important;
  border: 2px solid #e2e8f0 !important;
  border-radius: 20px !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
  padding: 24px !important;
  margin-top: 12px !important;
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  backdrop-filter: blur(10px) !important;
  min-width: 320px !important;
}

/* DatePicker Header */
:deep(.p-datepicker-header) {
  background: none !important;
  border: none !important;
  padding: 0 0 16px 0 !important;
  margin-bottom: 16px !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

/* Month/Year Display */
:deep(.p-datepicker-title) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
}

:deep(.p-datepicker-month) {
  font-size: 18px !important;
  font-weight: 700 !important;
  color: #1f2937 !important;
  background: none !important;
  border: none !important;
  padding: 8px 12px !important;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
}

:deep(.p-datepicker-year) {
  font-size: 18px !important;
  font-weight: 700 !important;
  color: #6b7280 !important;
  background: none !important;
  border: none !important;
  padding: 8px 12px !important;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
}

:deep(.p-datepicker-month:hover),
:deep(.p-datepicker-year:hover) {
  background-color: #f8fafc !important;
  color: #22c55e !important;
}

/* Navigation Buttons - SUPER FORCE */
:deep(.p-datepicker-prev),
:deep(.p-datepicker-next),
.p-datepicker-prev,
.p-datepicker-next,
button[data-pc-section="previousbutton"],
button[data-pc-section="nextbutton"] {
  background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%) !important;
  border: 1px solid #cbd5e1 !important;
  color: #475569 !important;
  width: 40px !important;
  height: 40px !important;
  border-radius: 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
}

:deep(.p-datepicker-prev:hover),
:deep(.p-datepicker-next:hover),
.p-datepicker-prev:hover,
.p-datepicker-next:hover,
button[data-pc-section="previousbutton"]:hover,
button[data-pc-section="nextbutton"]:hover {
  background: linear-gradient(145deg, #22c55e 0%, #16a34a 100%) !important;
  border-color: #16a34a !important;
  color: white !important;
  transform: scale(1.1) translateY(-2px) !important;
  box-shadow: 0 8px 16px rgba(34, 197, 94, 0.3) !important;
}

/* Calendar Table */
:deep(.p-datepicker-calendar) {
  width: 100% !important;
}

/* Day Names Header */
:deep(.p-datepicker-calendar thead tr th) {
  background: none !important;
  border: none !important;
  padding: 8px 4px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #64748b !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
}

/* Calendar Days - SUPER FORCE */
:deep(.p-datepicker-calendar tbody tr td),
.p-datepicker-calendar tbody tr td,
td[data-pc-section="day"] {
  padding: 3px !important;
}

:deep(.p-datepicker-calendar tbody tr td span),
.p-datepicker-calendar tbody tr td span,
span[data-pc-section="daylabel"] {
  width: 42px !important;
  height: 42px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 12px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  color: #334155 !important;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%) !important;
  border: 1px solid transparent !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  cursor: pointer !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

/* Day Hover State - SUPER FORCE */
:deep(.p-datepicker-calendar tbody tr td span:hover),
.p-datepicker-calendar tbody tr td span:hover,
span[data-pc-section="daylabel"]:hover {
  background: linear-gradient(145deg, #22c55e 0%, #16a34a 100%) !important;
  color: white !important;
  transform: scale(1.1) translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3) !important;
  border-color: #16a34a !important;
}

/* Today - SUPER FORCE */
:deep(.p-datepicker-calendar tbody tr td.p-datepicker-today span),
.p-datepicker-calendar tbody tr td.p-datepicker-today span,
td.p-datepicker-today span[data-pc-section="daylabel"] {
  background: linear-gradient(145deg, #3b82f6 0%, #1d4ed8 100%) !important;
  color: white !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
}

/* Selected Date - SUPER FORCE */
:deep(.p-datepicker-calendar tbody tr td.p-datepicker-selected span),
.p-datepicker-calendar tbody tr td.p-datepicker-selected span,
td.p-datepicker-selected span[data-pc-section="daylabel"],
.p-datepicker-calendar tbody tr td[aria-selected="true"] span {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
  color: white !important;
  font-weight: 700 !important;
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4) !important;
  transform: scale(1.05) !important;
  border: 2px solid #16a34a !important;
}

/* Other Month Days */
:deep(.p-datepicker-calendar tbody tr td.p-datepicker-other-month span) {
  color: #d1d5db !important;
  font-weight: 400 !important;
}

:deep(.p-datepicker-calendar tbody tr td.p-datepicker-other-month span:hover) {
  background-color: #f9fafb !important;
  color: #9ca3af !important;
}

/* Disabled Dates */
:deep(.p-datepicker-calendar tbody tr td.p-disabled span) {
  color: #e5e7eb !important;
  cursor: not-allowed !important;
  opacity: 0.5 !important;
}

:deep(.p-datepicker-calendar tbody tr td.p-disabled span:hover) {
  background-color: transparent !important;
  transform: none !important;
}

/* Weekend Styling */
:deep(.p-datepicker-calendar tbody tr td:first-child span),
:deep(.p-datepicker-calendar tbody tr td:last-child span) {
  color: #dc2626 !important;
}

/* CALENDAR - DIRECT STYLES WITHOUT DEEP */
.p-calendar .p-inputtext {
  background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%) !important;
  border: 2px solid #e2e8f0 !important;
  border-radius: 12px !important;
  padding: 14px 48px 14px 16px !important;
  height: 56px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  color: #1e293b !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
}

.p-calendar .p-inputtext:focus {
  border-color: #22c55e !important;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
  transform: translateY(-2px) !important;
  background: linear-gradient(145deg, #ffffff 0%, #f8fffe 100%) !important;
}

.p-calendar .p-inputtext:hover {
  border-color: #22c55e !important;
  box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.12) !important;
  transform: translateY(-1px) !important;
  background: linear-gradient(145deg, #fafafa 0%, #f0fdf4 100%) !important;
}

.p-datepicker {
  background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%) !important;
  border: 2px solid #e2e8f0 !important;
  border-radius: 20px !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
  padding: 24px !important;
  margin-top: 12px !important;
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  min-width: 320px !important;
}

.p-datepicker-prev,
.p-datepicker-next {
  background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%) !important;
  border: 1px solid #cbd5e1 !important;
  color: #475569 !important;
  width: 40px !important;
  height: 40px !important;
  border-radius: 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
}

.p-datepicker-prev:hover,
.p-datepicker-next:hover {
  background: linear-gradient(145deg, #22c55e 0%, #16a34a 100%) !important;
  border-color: #16a34a !important;
  color: white !important;
  transform: scale(1.1) translateY(-2px) !important;
  box-shadow: 0 8px 16px rgba(34, 197, 94, 0.3) !important;
}

.p-datepicker-calendar tbody tr td span {
  width: 42px !important;
  height: 42px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 12px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  color: #334155 !important;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%) !important;
  border: 1px solid transparent !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  cursor: pointer !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

.p-datepicker-calendar tbody tr td span:hover {
  background: linear-gradient(145deg, #22c55e 0%, #16a34a 100%) !important;
  color: white !important;
  transform: scale(1.1) translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3) !important;
  border-color: #16a34a !important;
}

.p-datepicker-calendar tbody tr td.p-datepicker-selected span {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
  color: white !important;
  font-weight: 700 !important;
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4) !important;
  transform: scale(1.05) !important;
  border: 2px solid #16a34a !important;
}

.p-datepicker-calendar tbody tr td.p-datepicker-today span {
  background: linear-gradient(145deg, #3b82f6 0%, #1d4ed8 100%) !important;
  color: white !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
}

/* CALENDAR - DIRECT STYLES WITHOUT DEEP */
.p-component, .p-calendar, .p-datepicker, .p-datepicker * {
  box-sizing: border-box !important;
}

/* Force all calendar elements to use our modern styling */
.p-calendar .p-component,
.p-datepicker .p-component,
[data-pc-name="calendar"] *,
[data-pc-name="datepicker"] * {
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
}

/* Animation for Calendar Popup */
:deep(.p-calendar-panel) {
  animation: slideInUp 0.3s ease-out !important;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dropdown Overrides - Modern Design */
:deep(.p-dropdown) {
  background-color: white !important;
  border: 2px solid #e5e7eb !important;
  border-radius: 12px !important;
  height: 56px !important;
  position: relative !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

:deep(.p-dropdown:hover) {
  border-color: #d1d5db !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
}

:deep(.p-dropdown:focus),
:deep(.p-dropdown.p-focus) {
  border-color: #22c55e !important;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1) !important;
  transform: translateY(-1px) !important;
}

:deep(.p-dropdown .p-dropdown-label) {
  padding: 14px 48px 14px 16px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  color: #1f2937 !important;
}

:deep(.p-dropdown .p-dropdown-label.p-placeholder) {
  color: #9ca3af !important;
  font-weight: 400 !important;
}

/* Dropdown Trigger/Icon - Modern Style */
:deep(.p-dropdown-trigger) {
  background-color: transparent !important;
  color: #6b7280 !important;
  border: none !important;
  position: absolute !important;
  right: 12px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 36px !important;
  height: 36px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
}

:deep(.p-dropdown-trigger:hover) {
  background-color: #f3f4f6 !important;
  color: #22c55e !important;
}

/* Dropdown Panel - Modern Design */
:deep(.p-dropdown-panel) {
  background: white !important;
  border: none !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  margin-top: 8px !important;
  padding: 8px !important;
  animation: slideInUp 0.3s ease-out !important;
}

/* Dropdown Items */
:deep(.p-dropdown-item) {
  padding: 12px 16px !important;
  border-radius: 10px !important;
  margin: 2px 0 !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #374151 !important;
  transition: all 0.2s ease !important;
  border: none !important;
}

:deep(.p-dropdown-item:hover) {
  background-color: #f0fdf4 !important;
  color: #22c55e !important;
  transform: translateX(4px) !important;
}

:deep(.p-dropdown-item.p-highlight) {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
  color: white !important;
  font-weight: 600 !important;
}

/* Disabled State - Modern */
:deep(.p-dropdown:disabled) {
  background-color: #f9fafb !important;
  border-color: #e5e7eb !important;
  color: #9ca3af !important;
  opacity: 0.7 !important;
  cursor: not-allowed !important;
}

:deep(.p-dropdown:disabled .p-dropdown-label) {
  color: #9ca3af !important;
}

/* Clear Button */
:deep(.p-dropdown-clear-icon) {
  right: 48px !important;
  color: #6b7280 !important;
  width: 20px !important;
  height: 20px !important;
  border-radius: 50% !important;
  transition: all 0.2s ease !important;
}

:deep(.p-dropdown-clear-icon:hover) {
  background-color: #fee2e2 !important;
  color: #dc2626 !important;
}

/* Calendar Disabled Dates */
:deep(.p-datepicker .p-disabled) {
  opacity: 0.4 !important;
  cursor: not-allowed !important;
}

:deep(.p-datepicker .p-disabled:hover) {
  background-color: transparent !important;
}

/* Container and Layout */
.container {
  max-width: 1200px;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

/* Grid responsive adjustments */
@media (max-width: 768px) {
  .grid.md\\:grid-cols-5 {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .nav-btn {
    min-width: 100px;
    font-size: 12px;
    padding: 10px 16px;
  }
  
  .result-card {
    margin-bottom: 16px;
    min-height: 180px;
  }
  
  .result-image {
    height: 120px;
  }
  
  .result-content {
    padding: 12px;
  }
  
  .result-item {
    font-size: 12px;
  }
  
  .status-badge {
    font-size: 11px;
    padding: 4px 8px;
  }
}

@media (max-width: 640px) {
  .grid.md\\:grid-cols-5 {
    grid-template-columns: 1fr;
  }
  
  .flex.justify-center {
    flex-direction: column;
    align-items: stretch;
  }
  
  .nav-btn-first,
  .nav-btn-middle,
  .nav-btn-last {
    border-radius: 8px !important;
    border: 1px solid #e5e7eb !important;
    margin-bottom: 8px;
  }
}

/* Compact Filter Input Styles - Layout Horizontal */
.compact-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  font-size: 14px;
  background-color: #ffffff;
  transition: all 0.2s ease;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  outline: none;
  height: 42px;
}

.compact-input:hover {
  border-color: #9ca3af;
}

.compact-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.compact-input:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
  border-color: #e5e7eb;
}

.compact-select {
  width: 100%;
  padding: 10px 32px 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  font-size: 14px;
  background-color: #ffffff;
  transition: all 0.2s ease;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
  height: 42px;
}

.compact-select:hover {
  border-color: #9ca3af;
}

.compact-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* Compact Search Button */
.compact-search-btn {
  background-color: #22c55e;
  color: white;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 42px;
  min-width: 100px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.compact-search-btn:hover:not(:disabled) {
  background-color: #16a34a;
}

.compact-search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design para Layout Compacto */
@media (max-width: 640px) {
  .grid.lg\\:grid-cols-6 {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .compact-input,
  .compact-select,
  .compact-search-btn {
    height: 48px;
    padding: 14px;
    font-size: 16px; /* Evita zoom no mobile */
  }
  
  .compact-select {
    padding-right: 40px;
  }
  
  .compact-search-btn {
    width: 100%;
    margin-top: 8px;
  }
  
  /* Container principal mais responsivo */
  .max-w-7xl {
    padding: 0 12px;
  }
}

@media (max-width: 768px) {
  .grid.sm\\:grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .compact-input,
  .compact-select,
  .compact-search-btn {
    height: 46px;
    padding: 12px;
  }
  
  .compact-select {
    padding-right: 38px;
  }
  
  .compact-search-btn {
    width: 100%;
  }
}

@media (min-width: 640px) and (max-width: 1024px) {
  .grid.lg\\:grid-cols-6 {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  /* Botão de buscar em linha separada em tablets */
  .grid.lg\\:grid-cols-6 > div:last-child {
    grid-column: 1 / -1;
  }
}

@media (min-width: 1024px) {
  .grid.lg\\:grid-cols-6 {
    grid-template-columns: 1.2fr 1fr 1fr 1.2fr 1.2fr 1fr;
    gap: 16px;
  }
}

/* Modern Calendar Styles */
:deep(.modern-calendar .p-inputtext) {
  border: 2px solid #e5e7eb !important;
  border-radius: 12px !important;
  padding: 14px 16px !important;
  font-size: 14px !important;
  transition: all 0.2s ease !important;
  background-color: #ffffff !important;
}

:deep(.modern-calendar .p-inputtext:focus) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  outline: none !important;
}

/* Modern Dropdown Styles */
:deep(.modern-dropdown .p-dropdown) {
  border: 2px solid #e5e7eb !important;
  border-radius: 12px !important;
  background-color: #ffffff !important;
  transition: all 0.2s ease !important;
}

:deep(.modern-dropdown .p-dropdown:not(.p-disabled):hover) {
  border-color: #d1d5db !important;
}

:deep(.modern-dropdown .p-dropdown:not(.p-disabled).p-focus) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

:deep(.modern-dropdown .p-dropdown-label) {
  padding: 14px 16px !important;
  font-size: 14px !important;
  color: #374151 !important;
}

/* Modern Search Button */
:deep(.modern-search-btn) {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 16px 32px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  color: white !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.3) !important;
}

:deep(.modern-search-btn:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px 0 rgba(59, 130, 246, 0.4) !important;
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
}

/* Modern Clear Button */
:deep(.modern-clear-btn) {
  border: 2px solid #e5e7eb !important;
  border-radius: 12px !important;
  padding: 16px 32px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  color: #6b7280 !important;
  background-color: white !important;
  transition: all 0.2s ease !important;
}

:deep(.modern-clear-btn:hover) {
  border-color: #d1d5db !important;
  color: #374151 !important;
  background-color: #f9fafb !important;
}

/* Quick Filter Buttons */
.quick-filter-btn {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 25px;
  background-color: white;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.quick-filter-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background-color: #eff6ff;
}

.quick-filter-btn.active {
  border-color: #3b82f6;
  background-color: #3b82f6;
  color: white;
}

.quick-filter-btn i {
  font-size: 12px;
}

/* Responsive adjustments for modern filters */
@media (max-width: 480px) {
  .grid.lg\\:grid-cols-6 {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .compact-input,
  .compact-select,
  .compact-search-btn {
    height: 50px;
    padding: 16px;
    font-size: 16px;
  }
  
  .compact-select {
    padding-right: 42px;
  }
  
  .compact-search-btn {
    width: 100%;
    margin-top: 12px;
    font-weight: 700;
  }
  
  /* Labels menores em mobile */
  label {
    font-size: 13px;
    margin-bottom: 6px;
  }
  
  /* Container com menos padding */
  .bg-white.rounded-2xl {
    padding: 16px;
    margin: 0 8px;
  }
  
  /* Cards de resultado em mobile */
  .result-card {
    min-height: 160px;
    margin-bottom: 12px;
  }
  
  .result-image {
    height: 100px;
  }
  
  .result-content {
    padding: 10px;
  }
  
  .result-item {
    font-size: 11px;
    margin-bottom: 3px;
  }
  
  .result-item i {
    font-size: 10px;
    margin-right: 4px;
  }
  
  .status-badge {
    font-size: 10px;
    padding: 3px 6px;
  }
  
  /* Filter tags em mobile */
  .filter-tag {
    font-size: 12px !important;
    padding: 6px 12px !important;
    margin-bottom: 6px;
  }
  
  .filter-tag i {
    font-size: 10px;
  }
}

@media (max-width: 768px) {
  .grid.md\\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .grid.md\\:grid-cols-3 {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .flex.sm\\:flex-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .quick-filter-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
}

@media (max-width: 640px) {
  .grid.md\\:grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  .max-w-6xl {
    max-width: 100%;
    padding: 0 16px;
  }
}

/* Estilos para Alerta de Manutenção */
.maintenance-alert {
  border-radius: 6px;
  overflow: hidden;
}

.maintenance-alert .pi-exclamation-triangle {
  flex-shrink: 0;
}

.result-card.result-card-unavailable {
  opacity: 0.7;
  cursor: not-allowed;
}

.result-card.result-card-unavailable:hover {
  transform: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>