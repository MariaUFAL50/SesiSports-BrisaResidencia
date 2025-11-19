<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="w-full bg-red-600 shadow-sm py-4 px-8 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <!-- Back Button -->
        <button
          class="back-btn"
          @click="goBack"
        >
          <i class="pi pi-chevron-left"></i>
        </button>
        <img src="/sesi-sports-logo.png" alt="SESI Sports Logo" class="h-8" />
        <h1 class="text-white font-bold text-xl">Gerenciar Usuários</h1>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 text-white">
          <i class="pi pi-shield text-yellow-300"></i>
          <span class="font-semibold">{{ authStore.currentUser?.name }}</span>
        </div>
        <!-- Logout Button -->
        <button
          class="logout-btn"
          @click="handleLogout"
        >
          Sair
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-7xl mx-auto">
        <!-- Usuarios Content -->
        <div class="usuarios-content">
          <!-- Header -->
          <div class="usuarios-header">
            <div class="header-info">
              <h2 class="tab-title">Gerenciar Usuários</h2>
              <div class="usuarios-stats">
                <span class="stat-item">
                  Total: <strong>{{ totalUsers }}</strong>
                </span>
                <span class="stat-item">
                  Clientes: <strong>{{ clientUsers }}</strong>
                </span>
                <span class="stat-item">
                  Técnicos: <strong>{{ technicianUsers }}</strong>
                </span>
                <span class="stat-item">
                  Admins: <strong>{{ adminUsers }}</strong>
                </span>
              </div>
            </div>
            
            <!-- Filters -->
            <div class="usuarios-filters">
              <div class="filter-group">
                <select v-model="userFilters.type" class="filter-select">
                  <option value="">Todos os usuários</option>
                  <option value="cliente">Clientes</option>
                  <option value="tecnico">Técnicos</option>
                  <option value="admin">Administradores</option>
                </select>
              </div>
              <div class="filter-group">
                <input 
                  type="text" 
                  v-model="userFilters.search" 
                  placeholder="Buscar por nome ou email"
                  class="filter-input"
                />
              </div>
              <button @click="applyUserFilters" class="filter-btn">
                <i class="pi pi-search"></i>
                Filtrar
              </button>
            </div>
          </div>

          <!-- Users Table -->
          <div class="usuarios-table-container">
            <table class="usuarios-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>CPF</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="user in paginatedUsers" 
                  :key="user.id"
                  class="user-row"
                >
                  <td class="user-name">
                    <div class="user-avatar">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                    <span>{{ user.name }}</span>
                  </td>
                  <td>{{ user.email }}</td>
                  <td class="cpf-field">
                    <span class="cpf-mask">{{ formatCPF(user.cpf) }}</span>
                  </td>
                  <td>
                    <span 
                      :class="['user-type-badge', user.type]"
                    >
                      {{ getUserTypeLabel(user.type) }}
                    </span>
                  </td>
                  <td>
                    <span 
                      :class="['status-badge', user.status]"
                    >
                      {{ user.status }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.createdAt) }}</td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button 
                        @click="editUser(user)"
                        class="action-btn edit-btn"
                        title="Editar usuário"
                      >
                        <i class="pi pi-pencil"></i>
                      </button>
                      <button 
                        @click="manageUserPermissions(user)"
                        class="action-btn permissions-btn"
                        title="Gerenciar permissões"
                      >
                        <i class="pi pi-shield"></i>
                      </button>
                      <button 
                        @click="toggleUserStatus(user)"
                        :class="['action-btn', user.status === 'ativo' ? 'deactivate-btn' : 'activate-btn']"
                        :title="user.status === 'ativo' ? 'Desativar usuário' : 'Ativar usuário'"
                      >
                        <i :class="user.status === 'ativo' ? 'pi pi-ban' : 'pi pi-check'"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="filteredUsers.length === 0" class="empty-state">
              <i class="pi pi-users"></i>
              <h3>Nenhum usuário encontrado</h3>
              <p>Não há usuários correspondentes aos filtros aplicados</p>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredUsers.length > 0" class="pagination">
            <div class="pagination-info">
              Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ filteredUsers.length }} usuários
            </div>
            <div class="pagination-controls">
              <button 
                @click="previousPage"
                :disabled="currentPage === 1"
                class="pagination-btn"
              >
                <i class="pi pi-chevron-left"></i>
              </button>
              <span class="page-indicator">
                {{ currentPage }} / {{ totalPages }}
              </span>
              <button 
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="pagination-btn"
              >
                <i class="pi pi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit User Modal -->
    <div v-if="showEditUserModal" class="modal-overlay" @click="closeEditUserModal">
      <div class="modal-content user-modal" @click.stop>
        <div class="modal-header">
          <h3>Editar Usuário</h3>
          <button @click="closeEditUserModal" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="updateUser" class="user-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nome Completo *</label>
              <input 
                type="text" 
                v-model="editUserForm.name" 
                class="form-input"
                placeholder="Digite o nome completo"
                required 
              />
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                v-model="editUserForm.email" 
                class="form-input"
                placeholder="Digite o email"
                required 
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>CPF</label>
              <input 
                type="text" 
                :value="formatCPF(editUserForm.cpf)" 
                class="form-input cpf-readonly"
                readonly
                title="CPF não pode ser alterado"
              />
              <small class="field-note">
                <i class="pi pi-info-circle"></i>
                CPF não pode ser alterado por motivos de segurança
              </small>
            </div>
            <div class="form-group">
              <label>Telefone</label>
              <input 
                type="tel" 
                v-model="editUserForm.phone" 
                class="form-input"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Data de Nascimento</label>
              <input 
                type="date" 
                v-model="editUserForm.birthDate" 
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Gênero</label>
              <select v-model="editUserForm.gender" class="form-input">
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
                <option value="nao-informar">Prefiro não informar</option>
              </select>
            </div>
          </div>

          <div class="form-section">
            <h4>Endereço</h4>
            <div class="form-row">
              <div class="form-group">
                <label>CEP</label>
                <input 
                  type="text" 
                  v-model="editUserForm.address.cep" 
                  class="form-input"
                  placeholder="00000-000"
                />
              </div>
              <div class="form-group">
                <label>Cidade</label>
                <input 
                  type="text" 
                  v-model="editUserForm.address.city" 
                  class="form-input"
                  placeholder="Cidade"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Estado</label>
                <select v-model="editUserForm.address.state" class="form-input">
                  <option value="">Selecione</option>
                  <option value="AL">Alagoas</option>
                  <option value="PE">Pernambuco</option>
                  <option value="BA">Bahia</option>
                  <option value="SE">Sergipe</option>
                  <!-- Adicione outros estados conforme necessário -->
                </select>
              </div>
              <div class="form-group">
                <label>Bairro</label>
                <input 
                  type="text" 
                  v-model="editUserForm.address.neighborhood" 
                  class="form-input"
                  placeholder="Bairro"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group full-width">
                <label>Rua</label>
                <input 
                  type="text" 
                  v-model="editUserForm.address.street" 
                  class="form-input"
                  placeholder="Nome da rua"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Número</label>
                <input 
                  type="text" 
                  v-model="editUserForm.address.number" 
                  class="form-input"
                  placeholder="Número"
                />
              </div>
              <div class="form-group">
                <label>Complemento</label>
                <input 
                  type="text" 
                  v-model="editUserForm.address.complement" 
                  class="form-input"
                  placeholder="Apartamento, sala, etc."
                />
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeEditUserModal" class="cancel-btn">
              Cancelar
            </button>
            <button type="submit" class="primary-btn">
              <i class="pi pi-save"></i>
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Permissions Modal -->
    <div v-if="showPermissionsModal" class="modal-overlay" @click="closePermissionsModal">
      <div class="modal-content permissions-modal" @click.stop>
        <div class="modal-header">
          <h3>Gerenciar Permissões</h3>
          <button @click="closePermissionsModal" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="permissions-content">
          <div class="user-info">
            <div class="user-avatar large">
              {{ selectedUser?.name?.charAt(0).toUpperCase() }}
            </div>
            <div class="user-details">
              <h4>{{ selectedUser?.name }}</h4>
              <p>{{ selectedUser?.email }}</p>
              <span :class="['current-type-badge', selectedUser?.type]">
                {{ getUserTypeLabel(selectedUser?.type) }}
              </span>
            </div>
          </div>

          <div class="permission-options">
            <h4>Definir Tipo de Usuário</h4>
            <div class="permission-cards">
              <div 
                :class="['permission-card', { active: permissionForm.type === 'cliente' }]"
                @click="permissionForm.type = 'cliente'"
              >
                <div class="permission-icon cliente">
                  <i class="pi pi-user"></i>
                </div>
                <div class="permission-info">
                  <h5>Cliente</h5>
                  <p>Pode fazer agendamentos e visualizar perfil</p>
                  <ul class="permission-list">
                    <li>Agendar espaços</li>
                    <li>Visualizar histórico</li>
                    <li>Editar perfil</li>
                  </ul>
                </div>
              </div>

              <div 
                :class="['permission-card', { active: permissionForm.type === 'tecnico' }]"
                @click="permissionForm.type = 'tecnico'"
              >
                <div class="permission-icon tecnico">
                  <i class="pi pi-wrench"></i>
                </div>
                <div class="permission-info">
                  <h5>Técnico</h5>
                  <p>Gerencia agenda e espaços esportivos</p>
                  <ul class="permission-list">
                    <li>Gerenciar agenda</li>
                    <li>Cadastrar espaços</li>
                    <li>Dashboard técnico</li>
                    <li>Todas as permissões de cliente</li>
                  </ul>
                </div>
              </div>

              <div 
                :class="['permission-card', { active: permissionForm.type === 'admin' }]"
                @click="permissionForm.type = 'admin'"
              >
                <div class="permission-icon admin">
                  <i class="pi pi-shield"></i>
                </div>
                <div class="permission-info">
                  <h5>Administrador</h5>
                  <p>Acesso completo ao sistema</p>
                  <ul class="permission-list">
                    <li>Gerenciar usuários</li>
                    <li>Definir permissões</li>
                    <li>Painel administrativo</li>
                    <li>Todas as permissões anteriores</li>
                  </ul>
                </div>
              </div>
            </div>

            <div v-if="permissionForm.type !== selectedUser?.type" class="permission-warning">
              <i class="pi pi-exclamation-triangle"></i>
              <div>
                <strong>Atenção:</strong>
                Você está alterando o tipo de usuário de 
                <strong>{{ getUserTypeLabel(selectedUser?.type) }}</strong> para 
                <strong>{{ getUserTypeLabel(permissionForm.type) }}</strong>.
                Esta ação não pode ser desfeita automaticamente.
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closePermissionsModal" class="cancel-btn">
              Cancelar
            </button>
            <button 
              @click="updateUserPermissions" 
              class="primary-btn"
              :disabled="permissionForm.type === selectedUser?.type"
            >
              <i class="pi pi-shield"></i>
              Atualizar Permissões
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="modal-overlay" @click="closeConfirmationModal">
      <div class="modal-content confirmation-modal" @click.stop>
        <div class="confirmation-content">
          <div class="confirmation-icon">
            <i :class="confirmationData.icon"></i>
          </div>
          <h3>{{ confirmationData.title }}</h3>
          <p>{{ confirmationData.message }}</p>
          
          <div class="modal-actions">
            <button type="button" @click="closeConfirmationModal" class="cancel-btn">
              Cancelar
            </button>
            <button 
              @click="confirmAction" 
              :class="['confirm-btn', confirmationData.type]"
            >
              {{ confirmationData.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const router = useRouter();
const authStore = useAuthStore();

// User management
const showEditUserModal = ref(false);
const showPermissionsModal = ref(false);
const showConfirmationModal = ref(false);
const selectedUser = ref(null);
const currentPage = ref(1);
const usersPerPage = ref(10);

// User management data
const users = ref([
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@email.com',
    cpf: '12345678901',
    phone: '(82) 99999-9999',
    birthDate: '1990-05-15',
    gender: 'masculino',
    type: 'cliente',
    status: 'ativo',
    createdAt: '2024-01-15',
    address: {
      cep: '57000-000',
      city: 'Maceió',
      state: 'AL',
      neighborhood: 'Centro',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apt 101'
    }
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    cpf: '98765432100',
    phone: '(82) 88888-8888',
    birthDate: '1985-08-22',
    gender: 'feminino',
    type: 'tecnico',
    status: 'ativo',
    createdAt: '2024-01-10',
    address: {
      cep: '57000-001',
      city: 'Maceió',
      state: 'AL',
      neighborhood: 'Farol',
      street: 'Avenida Atlântica',
      number: '456',
      complement: ''
    }
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    cpf: '11111111111',
    phone: '(82) 77777-7777',
    birthDate: '1992-12-03',
    gender: 'masculino',
    type: 'admin',
    status: 'ativo',
    createdAt: '2024-01-05',
    address: {
      cep: '57000-002',
      city: 'Maceió',
      state: 'AL',
      neighborhood: 'Ponta Verde',
      street: 'Rua da Praia',
      number: '789',
      complement: 'Casa'
    }
  },
  {
    id: 4,
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    cpf: '22222222222',
    phone: '(82) 66666-6666',
    birthDate: '1988-07-18',
    gender: 'feminino',
    type: 'cliente',
    status: 'inativo',
    createdAt: '2024-02-01',
    address: {
      cep: '57000-003',
      city: 'Maceió',
      state: 'AL',
      neighborhood: 'Pajuçara',
      street: 'Rua do Sol',
      number: '321',
      complement: 'Bloco B'
    }
  },
  {
    id: 5,
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@email.com',
    cpf: '33333333333',
    phone: '(82) 55555-5555',
    birthDate: '1995-03-10',
    gender: 'masculino',
    type: 'cliente',
    status: 'ativo',
    createdAt: '2024-02-15',
    address: {
      cep: '57000-004',
      city: 'Maceió',
      state: 'AL',
      neighborhood: 'Jatiúca',
      street: 'Avenida do Mar',
      number: '654',
      complement: ''
    }
  },
  {
    id: 6,
    name: 'Beatriz Lima',
    email: 'beatriz.lima@email.com',
    cpf: '44444444444',
    phone: '(82) 44444-4444',
    birthDate: '1993-09-12',
    gender: 'feminino',
    type: 'tecnico',
    status: 'ativo',
    createdAt: '2024-01-20',
    address: {
      cep: '57000-005',
      city: 'Maceió',
      state: 'AL',
      neighborhood: 'Cruz das Almas',
      street: 'Rua dos Esportes',
      number: '987',
      complement: 'Sala 2'
    }
  },
  {
    id: 7,
    name: 'Ricardo Mendes',
    email: 'ricardo.mendes@email.com',
    cpf: '55555555555',
    phone: '(82) 33333-3333',
    birthDate: '1987-04-25',
    gender: 'masculino',
    type: 'cliente',
    status: 'ativo',
    createdAt: '2024-02-10',
    address: {
      cep: '57000-006',
      city: 'Maceió',
      state: 'AL',
      neighborhood: 'Gruta de Lourdes',
      street: 'Rua da Paz',
      number: '456',
      complement: ''
    }
  },
  {
    id: 8,
    name: 'Fernanda Rocha',
    email: 'fernanda.rocha@email.com',
    cpf: '66666666666',
    phone: '(82) 22222-2222',
    birthDate: '1991-11-08',
    gender: 'feminino',
    type: 'cliente',
    status: 'inativo',
    createdAt: '2024-01-30',
    address: {
      cep: '57000-007',
      city: 'Maceió',
      state: 'AL',
      neighborhood: 'Mangabeiras',
      street: 'Avenida Central',
      number: '789',
      complement: 'Apt 505'
    }
  }
]);

// User filters
const userFilters = ref({
  type: '',
  search: '',
  status: ''
});

// Forms
const editUserForm = ref({
  id: null,
  name: '',
  email: '',
  cpf: '',
  phone: '',
  birthDate: '',
  gender: '',
  address: {
    cep: '',
    city: '',
    state: '',
    neighborhood: '',
    street: '',
    number: '',
    complement: ''
  }
});

const permissionForm = ref({
  type: 'cliente'
});

const confirmationData = ref({
  title: '',
  message: '',
  icon: '',
  type: '',
  confirmText: '',
  action: null
});

// User management computed properties
const totalUsers = computed(() => users.value.length);
const clientUsers = computed(() => users.value.filter(user => user.type === 'cliente').length);
const technicianUsers = computed(() => users.value.filter(user => user.type === 'tecnico').length);
const adminUsers = computed(() => users.value.filter(user => user.type === 'admin').length);

const filteredUsers = computed(() => {
  let filtered = [...users.value];
  
  // Filter by type
  if (userFilters.value.type) {
    filtered = filtered.filter(user => user.type === userFilters.value.type);
  }
  
  // Filter by search
  if (userFilters.value.search) {
    const search = userFilters.value.search.toLowerCase();
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.cpf.includes(search.replace(/\D/g, ''))
    );
  }
  
  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / usersPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * usersPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + usersPerPage.value, filteredUsers.value.length));
const paginatedUsers = computed(() => 
  filteredUsers.value.slice(startIndex.value, startIndex.value + usersPerPage.value)
);

// Methods
const goBack = () => {
  router.push('/admin');
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

// User management methods
const applyUserFilters = () => {
  currentPage.value = 1; // Reset to first page when filtering
};

const formatCPF = (cpf) => {
  if (!cpf) return '';
  const digits = cpf.replace(/\D/g, '');
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const getUserTypeLabel = (type) => {
  const labels = {
    'cliente': 'Cliente',
    'tecnico': 'Técnico',
    'admin': 'Administrador'
  };
  return labels[type] || type;
};

const editUser = (user) => {
  selectedUser.value = user;
  editUserForm.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    phone: user.phone || '',
    birthDate: user.birthDate || '',
    gender: user.gender || '',
    address: { ...user.address }
  };
  showEditUserModal.value = true;
};

const closeEditUserModal = () => {
  showEditUserModal.value = false;
  selectedUser.value = null;
  resetEditUserForm();
};

const resetEditUserForm = () => {
  editUserForm.value = {
    id: null,
    name: '',
    email: '',
    cpf: '',
    phone: '',
    birthDate: '',
    gender: '',
    address: {
      cep: '',
      city: '',
      state: '',
      neighborhood: '',
      street: '',
      number: '',
      complement: ''
    }
  };
};

const updateUser = () => {
  try {
    const userIndex = users.value.findIndex(user => user.id === editUserForm.value.id);
    if (userIndex !== -1) {
      // Preserve CPF and other sensitive data
      users.value[userIndex] = {
        ...users.value[userIndex],
        ...editUserForm.value,
        cpf: users.value[userIndex].cpf // Keep original CPF
      };
      
      closeEditUserModal();
      showSuccessNotification('Usuário atualizado com sucesso!');
    }
  } catch (error) {
    alert('Erro ao atualizar usuário: ' + error.message);
  }
};

const manageUserPermissions = (user) => {
  selectedUser.value = user;
  permissionForm.value.type = user.type;
  showPermissionsModal.value = true;
};

const closePermissionsModal = () => {
  showPermissionsModal.value = false;
  selectedUser.value = null;
  permissionForm.value.type = 'cliente';
};

const updateUserPermissions = () => {
  if (!selectedUser.value) return;
  
  const newType = permissionForm.value.type;
  const currentType = selectedUser.value.type;
  
  if (newType === currentType) return;
  
  confirmationData.value = {
    title: 'Confirmar Alteração de Permissões',
    message: `Tem certeza que deseja alterar o tipo de usuário de "${getUserTypeLabel(currentType)}" para "${getUserTypeLabel(newType)}"?`,
    icon: 'pi pi-exclamation-triangle',
    type: 'warning',
    confirmText: 'Confirmar Alteração',
    action: () => {
      const userIndex = users.value.findIndex(user => user.id === selectedUser.value.id);
      if (userIndex !== -1) {
        users.value[userIndex].type = newType;
        closePermissionsModal();
        closeConfirmationModal();
        showSuccessNotification(`Usuário promovido para ${getUserTypeLabel(newType)} com sucesso!`);
      }
    }
  };
  
  showConfirmationModal.value = true;
};

const toggleUserStatus = (user) => {
  const newStatus = user.status === 'ativo' ? 'inativo' : 'ativo';
  const action = newStatus === 'ativo' ? 'ativar' : 'desativar';
  
  confirmationData.value = {
    title: `Confirmar ${action.charAt(0).toUpperCase() + action.slice(1)}`,
    message: `Tem certeza que deseja ${action} o usuário "${user.name}"?`,
    icon: newStatus === 'ativo' ? 'pi pi-check-circle' : 'pi pi-ban',
    type: newStatus === 'ativo' ? 'success' : 'danger',
    confirmText: action.charAt(0).toUpperCase() + action.slice(1),
    action: () => {
      const userIndex = users.value.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users.value[userIndex].status = newStatus;
        closeConfirmationModal();
        showSuccessNotification(`Usuário ${action === 'ativar' ? 'ativado' : 'desativado'} com sucesso!`);
      }
    }
  };
  
  showConfirmationModal.value = true;
};

const closeConfirmationModal = () => {
  showConfirmationModal.value = false;
  confirmationData.value = {
    title: '',
    message: '',
    icon: '',
    type: '',
    confirmText: '',
    action: null
  };
};

const confirmAction = () => {
  if (confirmationData.value.action) {
    confirmationData.value.action();
  }
};

const showSuccessNotification = (message) => {
  // Simple alert for now - you could integrate with a toast library
  alert(message);
};

// Pagination methods
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
</script>

<style scoped>
/* Header styles */
.back-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.logout-btn {
  background: #B91C1C;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
  font-weight: 500;
}

.logout-btn:hover {
  background: #991B1B;
}

/* User Management Styles */
.usuarios-content {
  padding: 1rem 0;
}

.usuarios-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #E5E7EB;
}

.header-info {
  flex: 1;
}

.tab-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 1.5rem;
}

.usuarios-stats {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
}

.stat-item {
  font-size: 0.875rem;
  color: #6B7280;
}

.stat-item strong {
  color: #1F2937;
  font-weight: 600;
}

.usuarios-filters {
  display: flex;
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-select, .filter-input {
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  padding: 0.5rem;
  font-size: 0.875rem;
  min-width: 120px;
}

.filter-btn {
  background: #10B981;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn:hover {
  background: #059669;
}

.usuarios-table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.usuarios-table {
  width: 100%;
  border-collapse: collapse;
}

.usuarios-table th {
  background: #F9FAFB;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #E5E7EB;
  font-size: 0.875rem;
}

.usuarios-table td {
  padding: 1rem;
  border-bottom: 1px solid #F3F4F6;
  font-size: 0.875rem;
}

.user-row:hover {
  background: #F9FAFB;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1E40AF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-avatar.large {
  width: 48px;
  height: 48px;
  font-size: 1.25rem;
}

.cpf-field {
  font-family: monospace;
  color: #6B7280;
}

.cpf-mask {
  letter-spacing: 0.5px;
}

.user-type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
}

.user-type-badge.cliente {
  background: #DBEAFE;
  color: #1E40AF;
}

.user-type-badge.tecnico {
  background: #D1FAE5;
  color: #065F46;
}

.user-type-badge.admin {
  background: #FEE2E2;
  color: #991B1B;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.ativo {
  background: #D1FAE5;
  color: #065F46;
}

.status-badge.inativo {
  background: #FEE2E2;
  color: #991B1B;
}

.actions-cell {
  width: 120px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.edit-btn {
  background: #F3F4F6;
  color: #374151;
}

.edit-btn:hover {
  background: #E5E7EB;
  color: #1F2937;
}

.permissions-btn {
  background: #FEF3C7;
  color: #92400E;
}

.permissions-btn:hover {
  background: #FDE68A;
  color: #78350F;
}

.activate-btn {
  background: #D1FAE5;
  color: #065F46;
}

.activate-btn:hover {
  background: #A7F3D0;
  color: #047857;
}

.deactivate-btn {
  background: #FEE2E2;
  color: #991B1B;
}

.deactivate-btn:hover {
  background: #FECACA;
  color: #7F1D1D;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pagination-info {
  font-size: 0.875rem;
  color: #6B7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  background: #F3F4F6;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
  color: #374151;
}

.pagination-btn:hover:not(:disabled) {
  background: #E5E7EB;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-indicator {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6B7280;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #D1D5DB;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
}

/* Modal */
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
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #6B7280;
}

/* User Modal Styles */
.user-modal {
  max-width: 700px;
  width: 95%;
}

.user-form {
  padding: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-group.full-width {
  width: 100%;
}

.form-group label {
  font-weight: 500;
  color: #374151;
}

.form-input {
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #1E40AF;
}

.form-section {
  background: #F9FAFB;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.form-section h4 {
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
}

.cpf-readonly {
  background: #F9FAFB !important;
  color: #6B7280 !important;
  cursor: not-allowed;
}

.field-note {
  color: #6B7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  background: #F3F4F6;
  color: #374151;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.cancel-btn:hover {
  background: #E5E7EB;
}

.primary-btn {
  background: #1E40AF;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.primary-btn:hover {
  background: #1D4ED8;
}

.primary-btn:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
}

/* Permissions Modal Styles */
.permissions-modal {
  max-width: 800px;
  width: 95%;
}

.permissions-content {
  padding: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #F9FAFB;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.user-details h4 {
  margin: 0 0 0.25rem 0;
  color: #1F2937;
}

.user-details p {
  margin: 0 0 0.5rem 0;
  color: #6B7280;
  font-size: 0.875rem;
}

.current-type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
}

.current-type-badge.cliente {
  background: #DBEAFE;
  color: #1E40AF;
}

.current-type-badge.tecnico {
  background: #D1FAE5;
  color: #065F46;
}

.current-type-badge.admin {
  background: #FEE2E2;
  color: #991B1B;
}

.permission-options h4 {
  margin: 0 0 1.5rem 0;
  color: #1F2937;
}

.permission-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.permission-card {
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.permission-card:hover {
  border-color: #D1D5DB;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.permission-card.active {
  border-color: #1E40AF;
  background: #F0F9FF;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.15);
}

.permission-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1rem;
}

.permission-icon.cliente {
  background: #3B82F6;
}

.permission-icon.tecnico {
  background: #10B981;
}

.permission-icon.admin {
  background: #EF4444;
}

.permission-info h5 {
  margin: 0 0 0.5rem 0;
  color: #1F2937;
  font-size: 1.125rem;
  font-weight: 600;
}

.permission-info p {
  margin: 0 0 1rem 0;
  color: #6B7280;
  font-size: 0.875rem;
}

.permission-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.permission-list li {
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  position: relative;
  padding-left: 1rem;
}

.permission-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10B981;
  font-weight: 600;
}

.permission-warning {
  background: #FEF3C7;
  border: 1px solid #F59E0B;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  color: #92400E;
  font-size: 0.875rem;
}

.permission-warning i {
  color: #F59E0B;
  font-size: 1.125rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

/* Confirmation Modal Styles */
.confirmation-modal {
  max-width: 400px;
  text-align: center;
}

.confirmation-content {
  padding: 2rem;
}

.confirmation-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem auto;
  background: #FEF3C7;
  color: #F59E0B;
}

.confirmation-modal h3 {
  color: #1F2937;
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

.confirmation-modal p {
  color: #6B7280;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

.confirm-btn {
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
  font-weight: 500;
}

.confirm-btn.warning {
  background: #F59E0B;
  color: white;
}

.confirm-btn.warning:hover {
  background: #D97706;
}

.confirm-btn.success {
  background: #10B981;
  color: white;
}

.confirm-btn.success:hover {
  background: #059669;
}

.confirm-btn.danger {
  background: #EF4444;
  color: white;
}

.confirm-btn.danger:hover {
  background: #DC2626;
}

@media (max-width: 768px) {
  .usuarios-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .usuarios-filters {
    flex-direction: column;
  }

  .usuarios-table-container {
    overflow-x: auto;
  }

  .usuarios-table {
    min-width: 700px;
  }

  .permission-cards {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .form-row {
    flex-direction: column;
  }
}
</style>
