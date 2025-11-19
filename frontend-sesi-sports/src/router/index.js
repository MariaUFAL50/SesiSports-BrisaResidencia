import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'; // Exemplo de importação de uma view
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  // Define o histórico do roteador. createWebHistory usa o History API do navegador (URLs limpas).
  // Se você tiver problemas com deploy em subpastas ou precisar de compatibilidade antiga,
  // pode usar `createWebHashHistory()` para URLs com `#`.
  history: createWebHistory(import.meta.env.BASE_URL),
  // Define as rotas da sua aplicação
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView, // Página inicial correta
    },
    {
      path: '/alugar', 
      name: 'rent-space',
      component: () => import('../views/RentSpaceView.vue'), 
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (AboutView.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'), // Exemplo de lazy-loading
    },
    {
      path: '/space-reservation/:id?', // Nova rota com parâmetro opcional
      name: 'SpaceReservation',
      component: () => import('../views/SpaceReservationView.vue'),
    },
    {
      path: '/reservation', // ROTA ANTIGA - Manter por compatibilidade
      name: 'reservation',
      component: () => import('../views/SpaceReservationView.vue'), // Lazy-load
    },
    {
      path: '/payment', // Nova rota para a página de pagamento
      name: 'Payment',
      component: () => import('../views/PaymentView.vue'),
    },
    {
      path: '/pix-payment', // Nova rota para o pagamento PIX
      name: 'PixPayment',
      component: () => import('../views/PixPaymentView.vue'),
    },
    {
      path: '/profile', // Nova rota para a página de perfil
      name: 'Profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/technician-profile', // Nova rota para o perfil do técnico
      name: 'TechnicianProfile',
      component: () => import('../views/TechnicianProfileView.vue'),
    },
    {
      path: '/dev-profile', // Rota de desenvolvimento isolada
      name: 'DevProfile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/admin', // Rota para o painel administrativo
      name: 'AdminDashboard',
      component: () => import('../views/AdminDashboardView.vue'),
      meta: { requiresAdmin: true } // Proteção de rota para administradores
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('../views/UsersView.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/finance',
      name: 'Finance',
      component: () => import('../views/FinanceView.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAdmin: true }
    },
    // TODO: Adicione suas rotas aqui, como para a tela de dashboard, etc.
    // {
    //   path: '/dashboard',
    //   name: 'dashboard',
    //   component: () => import('../views/DashboardView.vue'),
    //   // meta: { requiresAuth: true } // Exemplo para rotas protegidas
    // }
  ],
});

// Guard de navegação para rotas protegidas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Verifica se a rota requer privilégios de administrador
  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated || !authStore.isAdmin) {
      // Redireciona para home se não for administrador
      next('/');
      return;
    }
  }
  
  next();
});

// Exporta a instância do roteador como um 'default export'.
// É isso que `main.js` espera ao fazer `import router from './router';`
export default router;