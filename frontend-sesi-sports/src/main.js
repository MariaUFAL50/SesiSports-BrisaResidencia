import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'; // Importa as configurações de rota
import { useAuthStore } from './stores/auth.js';
import { useTechnicianStore } from './stores/technician.js';
import { useSpacesStore } from './stores/spaces.js';

// Importações do PrimeVue PRIMEIRO (para que sejam sobrescritas)
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css'; // Ícones do PrimeVue (necessário para 'pi pi-google' etc.)

// Importação do seu CSS global com Tailwind POR ÚLTIMO (para ter prioridade)
import './styles/main.css';

// Cria a instância da aplicação Vue
const app = createApp(App);

// Usa o Pinia para gerenciamento de estado
const pinia = createPinia();
app.use(pinia);

// Usa o Vue Router para navegação
app.use(router);

// Configura e usa o PrimeVue em modo unstyled para evitar conflitos
app.use(PrimeVue, {
  unstyled: true
});

// Inicializa o estado de autenticação
const authStore = useAuthStore();
authStore.initializeAuth();

// Inicializa o estado do técnico
const technicianStore = useTechnicianStore();
technicianStore.initializeTechnician();

// Inicializa o estado dos espaços
const spacesStore = useSpacesStore();
spacesStore.initializeSpaces();

// Monta a aplicação no elemento HTML com id 'app' (definido em public/index.html)
app.mount('#app');