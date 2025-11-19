<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <Button
          icon="pi pi-chevron-left"
          class="back-btn"
          @click="goBack"
        />
        <img src="/sesi-sports-logo.png" alt="SESI Sports Logo" class="h-8" />
      </div>
      <div class="flex items-center gap-3">
        <button class="profile-btn active">
          <div v-if="authStore.isAuthenticated && authStore.getUserProfilePhoto" class="profile-photo-mini">
            <img :src="authStore.getUserProfilePhoto" alt="Perfil" class="profile-photo-img" />
          </div>
          <i v-else class="pi pi-user"></i>
        </button>
        <template v-if="isAdmin">
          <button
            @click="goToAdminPanel"
            class="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-700 transition ml-2"
            style="margin-left: 8px;"
          >Painel Administrativo</button>
        </template>
        <button class="header-btn logout-btn" @click="handleLogout">Sair</button>
      </div>
    </header>
    <!-- Banner Painel Administrativo: aparece apenas para admin -->
    <!-- Debug: Usuário: {{ authStore.currentUser?.name }} - Tipo: {{ authStore.currentUser?.type }} - Store isAdmin: {{ authStore.isAdmin }} - Computed isAdmin: {{ isAdmin }} -->
    <div v-if="isAdmin" class="admin-banner">
      <span class="font-bold text-lg">MODO ADMINISTRADOR</span>
      <button @click="goToAdminPanel" class="bg-white text-red-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-50 transition">
        Painel Administrativo
      </button>
    </div>
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <div class="profile-container">
          <div class="sidebar">
            <nav class="sidebar-nav">
              <button :class="['nav-item', { active: activeTab === 'perfil' }]" @click="activeTab = 'perfil'; console.log('Clicou em Perfil')">Perfil</button>
              <button :class="['nav-item', { active: activeTab === 'agendamentos' }]" @click="activeTab = 'agendamentos'; console.log('Clicou em Agendamentos')">Agendamentos</button>
              <button :class="['nav-item', { active: activeTab === 'senha' }]" @click="activeTab = 'senha'; console.log('Clicou em Senha')">Senha</button>
            </nav>
          </div>
          <div class="content-area">
            <!-- Debug: Aba ativa = {{ activeTab }} -->
            <div v-if="activeTab === 'perfil'" class="profile-content">
              <h1 class="page-title">Meu perfil</h1>
              
              <!-- User Info Section -->
              <div class="user-info-section">
                <!-- Nome do usuário -->
                <div class="user-name-section">
                  <h3 class="user-first-name">{{ firstName }}</h3>
                </div>
                <div class="photo-container">
                  <div v-if="tempPhotoData || userProfilePhoto" class="photo-preview">
                    <img :src="tempPhotoData || userProfilePhoto" alt="Foto de perfil" class="profile-image" />
                  </div>
                  <div v-else class="photo-placeholder">
                    <i class="pi pi-user photo-icon"></i>
                  </div>
                </div>
                <div class="photo-actions">
                  <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" style="display: none;" />
                  
                  <!-- Estado: Não editando -->
                  <div v-if="!editModes.photo" class="photo-buttons-view">
                    <button class="photo-btn-edit" @click="startPhotoEdit">
                      <i class="pi pi-pencil"></i>
                      Editar foto
                    </button>
                  </div>
                  
                  <!-- Estado: Editando -->
                  <div v-else class="photo-buttons-edit">
                    <button class="photo-btn-select" @click="triggerFileUpload">
                      <i class="pi pi-camera"></i>
                      Editar foto
                    </button>
                    <button v-if="userProfilePhoto" class="photo-btn-remove" @click="removePhoto">
                      <i class="pi pi-trash"></i>
                      Remover foto
                    </button>
                    <button v-if="tempPhotoData" class="photo-btn-save" @click="savePhoto">
                      <i class="pi pi-check"></i>
                      Salvar
                    </button>
                    <button class="photo-btn-cancel" @click="cancelPhotoEdit">
                      <i class="pi pi-times"></i>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Dados Pessoais Section -->
              <div class="section">
                <div class="section-header">
                  <i class="pi pi-user section-icon"></i>
                  <h2 class="section-title">Dados pessoais</h2>
                  <button v-if="!editModes.personal" class="edit-btn" @click="editModes.personal = true">
                    <i class="pi pi-pencil"></i>
                    Editar
                  </button>
                </div>
                
                <!-- Modo Visualização -->
                <div v-if="!editModes.personal" class="view-mode">
                  <div class="info-grid">
                    <div class="info-item">
                      <label class="info-label">Nome Completo</label>
                      <p class="info-value">{{ profileData.fullName || 'Não informado' }}</p>
                    </div>
                    <div class="info-item">
                      <label class="info-label">E-mail</label>
                      <p class="info-value">{{ profileData.email || 'Não informado' }}</p>
                    </div>
                    <div class="info-item">
                      <label class="info-label">CPF</label>
                      <p class="info-value">{{ profileData.cpf || 'Não informado' }}</p>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Celular</label>
                      <p class="info-value">{{ profileData.phone || 'Não informado' }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Modo Edição -->
                <div v-else class="edit-mode">
                  <div class="form-grid">
                    <div class="form-field">
                      <label class="form-label">Nome Completo</label>
                      <input type="text" v-model="profileData.fullName" class="form-input" placeholder="João Pedro de Lima" />
                    </div>
                    <div class="form-field">
                      <label class="form-label">E-mail</label>
                      <input type="email" v-model="profileData.email" class="form-input" placeholder="joao.pedro@teste.com" />
                    </div>
                    <div class="form-field">
                      <label class="form-label">CPF</label>
                      <input type="text" v-model="profileData.cpf" class="form-input" placeholder="000.000.000-00" maxlength="14" @input="formatCPF" />
                    </div>
                    <div class="form-field">
                      <label class="form-label">Celular</label>
                      <input type="text" v-model="profileData.phone" class="form-input" placeholder="(00) 00000-0000" maxlength="15" @input="formatPhone" />
                    </div>
                  </div>
                  <div class="form-actions">
                    <button class="save-btn" @click="savePersonalData">Salvar</button>
                    <button class="cancel-btn" @click="editModes.personal = false">Cancelar</button>
                  </div>
                </div>
              </div>
              
              <!-- Endereço Section -->
              <div class="section">
                <div class="section-header">
                  <i class="pi pi-map-marker section-icon"></i>
                  <h2 class="section-title">Endereço</h2>
                  <button v-if="!editModes.address" class="edit-btn" @click="editModes.address = true">
                    <i class="pi pi-pencil"></i>
                    Editar
                  </button>
                </div>
                
                <!-- Modo Visualização -->
                <div v-if="!editModes.address" class="view-mode">
                  <div class="info-grid">
                    <div class="info-item">
                      <label class="info-label">CEP</label>
                      <p class="info-value">{{ profileData.cep || 'Não informado' }}</p>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Rua</label>
                      <p class="info-value">{{ profileData.street || 'Não informado' }}</p>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Número</label>
                      <p class="info-value">{{ profileData.number || 'Não informado' }}</p>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Complemento</label>
                      <p class="info-value">{{ profileData.complement || 'Não informado' }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Modo Edição -->
                <div v-else class="edit-mode">
                  <div class="form-grid">
                    <div class="form-field">
                      <label class="form-label">CEP</label>
                      <input type="text" v-model="profileData.cep" class="form-input" placeholder="12345-678" maxlength="9" @input="formatCEP" />
                    </div>
                    <div class="form-field">
                      <label class="form-label">Rua</label>
                      <input type="text" v-model="profileData.street" class="form-input" placeholder="Rua Ali Perto" />
                    </div>
                    <div class="form-field">
                      <label class="form-label">Número</label>
                      <input type="text" v-model="profileData.number" class="form-input" placeholder="" />
                    </div>
                    <div class="form-field">
                      <label class="form-label">Complemento</label>
                      <input type="text" v-model="profileData.complement" class="form-input" placeholder="Lorem Ipsum" />
                    </div>
                  </div>
                  <div class="form-actions">
                    <button class="save-btn" @click="saveAddressData">Salvar</button>
                    <button class="cancel-btn" @click="editModes.address = false">Cancelar</button>
                  </div>
                </div>
              </div>
              <!-- Payment Section -->
              <div class="section">
                <div class="section-header">
                  <i class="pi pi-credit-card section-icon"></i>
                  <h2 class="section-title">Pagamento</h2>
                  <button v-if="!editModes.payment" class="edit-btn" @click="editModes.payment = true">
                    <i class="pi pi-pencil"></i>
                    Editar
                  </button>
                </div>
                
                <!-- Modo Visualização -->
                <div v-if="!editModes.payment" class="view-mode">
                  <div class="payment-card-display">
                    <div class="card-visual">
                      <div class="mastercard-logo">
                        <div class="mastercard-circles">
                          <div class="circle red"></div>
                          <div class="circle yellow"></div>
                        </div>
                      </div>
                    </div>
                    <div class="card-details-view">
                      <div class="info-grid payment-grid">
                        <div class="info-item">
                          <label class="info-label">Nome</label>
                          <p class="info-value">{{ profileData.cardName || 'Não informado' }}</p>
                        </div>
                        <div class="info-item">
                          <label class="info-label">Validade</label>
                          <p class="info-value">{{ profileData.cardValidity || 'Não informado' }}</p>
                        </div>
                        <div class="info-item">
                          <label class="info-label">Número do cartão</label>
                          <p class="info-value">{{ profileData.cardNumber ? maskCardNumber(profileData.cardNumber) : 'Não informado' }}</p>
                        </div>
                        <div class="info-item">
                          <label class="info-label">CVC</label>
                          <p class="info-value">{{ profileData.cardCvc ? '***' : 'Não informado' }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Modo Edição -->
                <div v-else class="edit-mode">
                  <div class="payment-card-display">
                    <div class="card-visual">
                      <div class="mastercard-logo">
                        <div class="mastercard-circles">
                          <div class="circle red"></div>
                          <div class="circle yellow"></div>
                        </div>
                      </div>
                    </div>
                    <div class="card-details">
                      <div class="form-grid payment-grid">
                        <div class="form-field">
                          <label class="form-label">Nome</label>
                          <input type="text" v-model="profileData.cardName" class="form-input" placeholder="João Pedro da Lima" />
                        </div>
                        <div class="form-field">
                          <label class="form-label">Validade</label>
                          <input type="text" v-model="profileData.cardValidity" class="form-input" placeholder="06/2025" maxlength="7" @input="formatCardValidity" />
                        </div>
                        <div class="form-field">
                          <label class="form-label">Número do cartão</label>
                          <input type="text" v-model="profileData.cardNumber" class="form-input" placeholder="0000 0000 0000 0000" maxlength="19" @input="formatCardNumber" />
                        </div>
                        <div class="form-field">
                          <label class="form-label">CVC</label>
                          <input type="text" v-model="profileData.cardCvc" class="form-input" placeholder="***" maxlength="4" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-actions">
                    <button class="save-btn" @click="savePaymentData">Salvar</button>
                    <button class="cancel-btn" @click="editModes.payment = false">Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="activeTab === 'agendamentos'" class="tab-content">
              <h1 class="page-title">Meus agendamentos</h1>
              <div class="appointments-list">
                <!-- Mensagem quando não há agendamentos -->
                <div v-if="appointments.length === 0" class="text-center py-16">
                  <p class="text-gray-500 text-lg">
                    Você ainda não possui agendamentos.
                  </p>
                </div>
                
                <!-- Lista de agendamentos -->
                <div v-else>
                  <div v-for="appointment in appointments" :key="appointment.id" 
                       class="appointment-card clickable-card" 
                       @click="openAppointmentDetails(appointment)">
                    <div class="appointment-image">
                      <img :src="appointment.image" :alt="appointment.title" />
                    </div>
                    <div class="appointment-content">
                      <div class="appointment-header">
                        <h3 class="appointment-title">{{ appointment.title }}</h3>
                        <span :class="['status-badge', getStatusClass(appointment.originalStatus)]">
                          {{ getStatusText(appointment.originalStatus) }}
                        </span>
                      </div>
                      <p class="appointment-description">{{ getAppointmentDescription(appointment) }}</p>
                    </div>
                    <div class="appointment-action">
                      <button :class="['action-btn', appointment.status === 'canceled' ? 'canceled-btn' : 'edit-btn']" 
                              @click.stop="handleAppointmentAction(appointment)" 
                              :disabled="appointment.status === 'canceled'">
                        {{ appointment.status === 'canceled' ? 'Cancelado' : 'Editar' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="activeTab === 'senha'" class="tab-content">
              <h1 class="page-title">Alteração de senha</h1>
              <div class="password-form">
                <div class="password-section">
                  <div class="section-header">
                    <i class="pi pi-lock section-icon"></i>
                    <h2 class="section-title">Senha atual</h2>
                  </div>
                  <div class="form-field">
                    <label class="form-label">Senha</label>
                    <div class="password-input-container">
                      <input :type="showCurrentPassword ? 'text' : 'password'" v-model="passwordData.currentPassword" class="form-input password-input" placeholder="••••••••••" />
                      <button type="button" class="password-toggle" @click="showCurrentPassword = !showCurrentPassword">
                        <i :class="showCurrentPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="password-section">
                  <div class="section-header">
                    <i class="pi pi-lock section-icon"></i>
                    <h2 class="section-title">Nova senha</h2>
                  </div>
                  <div class="form-field">
                    <label class="form-label">Digite a nova senha</label>
                    <div class="password-input-container">
                      <input :type="showNewPassword ? 'text' : 'password'" v-model="passwordData.newPassword" class="form-input password-input" placeholder="••••••••••" @input="validatePasswordMatch" />
                      <button type="button" class="password-toggle" @click="showNewPassword = !showNewPassword">
                        <i :class="showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                      </button>
                    </div>
                  </div>
                  <div class="form-field">
                    <label class="form-label">Confirme a senha nova</label>
                    <div class="password-input-container">
                      <input :type="showConfirmPassword ? 'text' : 'password'" v-model="passwordData.confirmPassword" class="form-input password-input" placeholder="••••••••••" @input="validatePasswordMatch" />
                      <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                        <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="password-save-section">
                  <button class="btn-save-password" @click="savePassword" :disabled="!isPasswordValid">Salvar senha</button>
                </div>
                <div class="password-requirements">
                  <h3 class="requirements-title">Observação</h3>
                  <p class="requirements-text">
                    Para garantir a segurança da sua conta, crie uma senha forte contendo no mínimo 8 caracteres, incluindo letras <strong>maiúsculas</strong> e <strong>minúsculas</strong>, <strong>número</strong> e <strong>caracteres especiais</strong> (como @, #, $, %). Evite usar informações pessoais óbvias, como data de nascimento ou nomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Edição de Agendamento -->
    <Teleport to="body">
      <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
        <div class="edit-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="pi pi-calendar"></i>
            Editar Agendamento
          </h3>
          <button @click="closeEditModal" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div v-if="selectedAppointment" class="appointment-edit-form">
            <!-- Informações do Espaço -->
            <div class="space-info-section">
              <div class="space-header">
                <h4 class="space-title">
                  <i class="pi pi-map-marker"></i>
                  {{ selectedAppointment.title }}
                </h4>
              </div>
              
              <div class="current-booking-info">
                <div class="booking-item">
                  <i class="pi pi-calendar"></i>
                  <div class="booking-details">
                    <span class="booking-label">Data atual</span>
                    <span class="booking-value">{{ formatDate(selectedAppointment.date) }}</span>
                  </div>
                </div>
                
                <div class="booking-item">
                  <i class="pi pi-clock"></i>
                  <div class="booking-details">
                    <span class="booking-label">Horário atual</span>
                    <span class="booking-value">{{ selectedAppointment.startTime }} às {{ selectedAppointment.endTime }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulário de Edição -->
            <div class="edit-form-section">
              <h4 class="form-section-title">Alterar Data e Horário</h4>
              
              <div class="form-grid">
                <div class="form-field">
                  <label class="form-label">Nova Data</label>
                  <input 
                    type="date" 
                    v-model="editForm.date" 
                    class="form-input"
                    :min="todayString"
                  />
                </div>
                
                <div class="form-field">
                  <label class="form-label">Horário de Início</label>
                  <select v-model="editForm.startTime" class="form-input">
                    <option value="">Selecione o horário</option>
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
                
                <div class="form-field">
                  <label class="form-label">Horário de Fim</label>
                  <select 
                    v-model="editForm.endTime" 
                    class="form-input"
                    :disabled="!editForm.startTime"
                  >
                    <option value="">Selecione o horário</option>
                    <option 
                      v-for="time in availableEndTimes" 
                      :key="time" 
                      :value="time"
                    >
                      {{ time }}
                    </option>
                  </select>
                </div>
              </div>
              
              <!-- Observações -->
              <div class="form-field">
                <label class="form-label">Observações (Opcional)</label>
                <textarea 
                  v-model="editForm.notes" 
                  class="form-textarea" 
                  placeholder="Adicione observações sobre sua reserva..."
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <!-- Ações principais -->
          <div class="main-actions">
            <button @click="saveAppointmentChanges" class="btn-save" :disabled="!isEditFormValid">
              <i class="pi pi-check"></i>
              Salvar Alterações
            </button>
            <button @click="closeEditModal" class="btn-cancel">
              <i class="pi pi-times"></i>
              Cancelar
            </button>
          </div>
          
          <!-- Botão de cancelar agendamento separado e mais à direita -->
          <div class="danger-action">
            <button @click="cancelAppointment" class="btn-cancel-appointment">
              <i class="pi pi-trash"></i>
              Cancelar Agendamento
            </button>
          </div>
        </div>
      </div>
    </div>
    </Teleport>
    
    <!-- Modal de detalhes do agendamento -->
    <Teleport to="body">
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="details-modal" @click.stop>
        <!-- Botão fechar no canto superior direito -->
        <button @click="closeDetailsModal" class="close-btn-top-right">
          <i class="pi pi-times"></i>
        </button>
        
        <div class="modal-body" v-if="selectedAppointment">
          <div class="appointment-details">
            <!-- Imagem e título -->
            <div class="detail-header">
              <img :src="selectedAppointment.image" :alt="selectedAppointment.title" class="detail-image" />
              <div class="detail-title-section">
                <h4 class="detail-title">{{ selectedAppointment.title }}</h4>
                <span :class="['status-badge', getStatusClass(selectedAppointment.originalStatus)]">
                  {{ getStatusText(selectedAppointment.originalStatus) }}
                </span>
              </div>
            </div>
            
            <!-- Informações do agendamento -->
            <div class="detail-info-clean">
              <div class="info-item">
                <i class="pi pi-calendar"></i>
                <span class="info-text">
                  <strong>Data:</strong> {{ formatDate(selectedAppointment.date) }}
                </span>
              </div>
              
              <div class="info-item">
                <i class="pi pi-clock"></i>
                <span class="info-text">
                  <strong>Horário:</strong> {{ selectedAppointment.startTime }} - {{ selectedAppointment.endTime }}
                </span>
              </div>
              
              <div class="info-item">
                <i class="pi pi-map-marker"></i>
                <span class="info-text">
                  <strong>Local:</strong> {{ selectedAppointment.location || 'SESI Sports' }}
                </span>
              </div>
              
              <div v-if="selectedAppointment.notes" class="info-item">
                <i class="pi pi-file-text"></i>
                <span class="info-text">
                  <strong>Observações:</strong> {{ selectedAppointment.notes }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useReservationsStore } from '../stores/reservations.js';
import { useSpacesStore } from '../stores/spaces.js';
import Button from 'primevue/button';

const router = useRouter();
const authStore = useAuthStore();
const reservationsStore = useReservationsStore();
const spacesStore = useSpacesStore();

const activeTab = ref('perfil');

// Estados de edição para cada seção
const editModes = reactive({
  personal: false,
  address: false,
  payment: false,
  photo: false
});

// Estado para foto temporária
const tempPhotoData = ref(null);

// Dados do perfil
const profileData = reactive({
  profilePhoto: null,
  fullName: '',
  email: '',
  cpf: '',
  phone: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  cardName: '',
  cardNumber: '',
  cardValidity: '',
  cardCvc: ''
});

// Dados de senha
const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Controle de visibilidade das senhas
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Controle do modal de edição
const showEditModal = ref(false);
const showDetailsModal = ref(false);
const selectedAppointment = ref(null);

// Formulário de edição de agendamento
const editForm = reactive({
  date: '',
  startTime: '',
  endTime: '',
  notes: ''
});

// Data atual para validação
const today = new Date();
const todayString = today.getFullYear() + '-' + 
  String(today.getMonth() + 1).padStart(2, '0') + '-' + 
  String(today.getDate()).padStart(2, '0');

// Computed para validação de senha
const isPasswordValid = computed(() => {
  return passwordData.newPassword && 
         passwordData.confirmPassword && 
         passwordData.newPassword === passwordData.confirmPassword;
});

// Computed para verificar se o formulário de edição é válido
const isEditFormValid = computed(() => {
  return editForm.date && editForm.startTime && editForm.endTime;
});

// Computed para horários de fim disponíveis
const availableEndTimes = computed(() => {
  if (!editForm.startTime) return [];
  
  const allTimes = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00', '23:00'
  ];
  
  return allTimes.filter(time => time > editForm.startTime);
});

// Referência do input de arquivo
const fileInput = ref(null);

// Dados de agendamentos de exemplo
// Computado para obter as reservas do usuário atual
const appointments = computed(() => {
  const currentUser = authStore.currentUser;
  console.log('=== APPOINTMENTS COMPUTED ===');
  console.log('currentUser:', currentUser);
  
  if (!currentUser) {
    console.log('Nenhum usuário logado, retornando array vazio');
    return [];
  }
  
  // Buscar reservas do usuário atual
  const userReservations = reservationsStore.getUserReservations(currentUser.id);
  console.log('userReservations para ID', currentUser.id, ':', userReservations);
  
  // Mapear para o formato esperado pela interface
  const mappedAppointments = userReservations.map(reservation => {
    // Buscar dados do espaço no store
    const space = spacesStore.getSpaceById(reservation.spaceId);
    const spaceName = space ? space.name : reservation.spaceName;
    const spaceImage = space && space.photos ? space.photos[0] : getSpaceImageFallback(reservation.spaceId);
    const spaceAddress = space ? space.address : 'SESI Sports - Endereço não disponível';
    
    return {
      id: reservation.id,
      title: spaceName,
      description: `Agendamento ${reservation.status.toLowerCase()} para ${reservation.purpose || 'atividade esportiva'}.`,
      image: spaceImage,
      status: reservation.status === 'Cancelada' ? 'canceled' : 'active',
      date: reservation.date,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      notes: '',
      spaceId: reservation.spaceId,
      purpose: reservation.purpose,
      originalStatus: reservation.status,
      location: spaceAddress
    };
  });
  
  console.log('Appointments finais:', mappedAppointments);
  console.log('=== FIM APPOINTMENTS COMPUTED ===');
  return mappedAppointments;
});

// Função para obter imagem de fallback se o espaço não for encontrado
function getSpaceImageFallback(spaceId) {
  const fallbackImages = {
    1: '/quadra-futsal.jpg',
    2: '/quadra-basquete.jpg', 
    3: '/piscina.jpg',
    4: '/quadra-volei.jpg',
    5: '/quadra-tenis.jpg',
    default: '/quadra-futsal.jpg'
  };
  return fallbackImages[spaceId] || fallbackImages.default;
}

// Computado para verificar se o usuário logado é admin - usando o getter do store
const isAdmin = computed(() => authStore.isAdmin);

// Computado para obter o primeiro nome do usuário
const firstName = computed(() => {
  const fullName = authStore.currentUser?.name || '';
  const name = fullName.split(' ')[0] || 'Usuário';
  return `Olá, ${name}`;
});

// Computado para a foto de perfil do usuário logado
// Computado para obter a foto de perfil do usuário
const userProfilePhoto = computed(() => authStore.getUserProfilePhoto);

// Função para gerar descrição dinâmica do agendamento
function getAppointmentDescription(appointment) {
  if (!appointment.date || !appointment.startTime || !appointment.endTime) {
    return appointment.description;
  }
  
  // Corrigir problema de timezone - usar formato local
  let appointmentDate;
  if (appointment.date.includes('-')) {
    const parts = appointment.date.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Mês no JS é 0-indexed  
    const day = parseInt(parts[2]);
    appointmentDate = new Date(year, month, day);
  } else {
    appointmentDate = new Date(appointment.date + 'T00:00:00');
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Zerar horário para comparação apenas da data
  appointmentDate.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.ceil((appointmentDate - today) / (1000 * 60 * 60 * 24));
  
  let dateText = '';
  if (daysDiff === 0) {
    dateText = 'hoje';
  } else if (daysDiff === 1) {
    dateText = 'amanhã';
  } else if (daysDiff > 1 && daysDiff <= 7) {
    const weekdays = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    dateText = `${weekdays[appointmentDate.getDay()]}`;
  } else {
    dateText = appointmentDate.toLocaleDateString('pt-BR');
  }

  // Mensagens dinâmicas baseadas no status
  const timeSlot = `${appointment.startTime} às ${appointment.endTime}`;
  
  switch (appointment.originalStatus) {
    case 'Pendente':
      return `Aguardando confirmação para ${dateText} das ${timeSlot}. Você receberá uma notificação assim que for aprovada.`;
    case 'Aprovada':
    case 'Confirmada':
      if (daysDiff < 0) {
        return `Atividade realizada em ${dateText} das ${timeSlot}.`;
      } else if (daysDiff === 0) {
        return `Sua atividade é hoje das ${timeSlot}. Não se esqueça!`;
      } else if (daysDiff === 1) {
        return `Sua atividade é amanhã das ${timeSlot}. Prepare-se!`;
      } else {
        return `Atividade confirmada para ${dateText} das ${timeSlot}.`;
      }
    case 'Cancelada':
      return `Esta reserva foi cancelada. Era para ${dateText} das ${timeSlot}.`;
    case 'Rejeitada':
      return `Reserva não aprovada para ${dateText} das ${timeSlot}. Entre em contato para mais informações.`;
    default:
      return `Reserva para ${dateText} das ${timeSlot}.`;
  }
}

// Função para obter a classe CSS do status
function getStatusClass(status) {
  switch (status) {
    case 'Pendente':
      return 'status-pending';
    case 'Aprovada':
    case 'Confirmada':
      return 'status-approved';
    case 'Cancelada':
    case 'Rejeitada':
      return 'status-canceled';
    default:
      return 'status-pending';
  }
}

// Função para obter o texto do status
function getStatusText(status) {
  switch (status) {
    case 'Pendente':
      return 'Pendente';
    case 'Aprovada':
      return 'Aprovada';
    case 'Confirmada':
      return 'Confirmada';
    case 'Cancelada':
      return 'Cancelada';
    case 'Rejeitada':
      return 'Rejeitada';
    default:
      return status;
  }
}

// Ao montar o componente, carrega os dados do usuário
onMounted(async () => {
  console.log('=== PROFILE VIEW MOUNTED ===');
  console.log('authStore.isAuthenticated:', authStore.isAuthenticated);
  console.log('authStore.currentUser:', authStore.currentUser);
  
  // Inicializa o authStore para carregar dados do localStorage
  authStore.initializeAuth();
  console.log('Após inicialização - isAuthenticated:', authStore.isAuthenticated);
  console.log('Após inicialização - currentUser:', authStore.currentUser);
  
  // Inicializa o store de espaços
  spacesStore.initializeSpaces();
  
  // Inicializa o store de reservas
  reservationsStore.initializeReservations();
  
  // Aguarda um pouco para os stores carregarem
  setTimeout(async () => {
    await loadUserData();
    console.log('=== PROFILE VIEW DADOS CARREGADOS ===');
  }, 100);

  // Listener para mudanças de status de reservas
  const handleStatusChange = (event) => {
    console.log('📢 Mudança de status detectada no ProfileView:', event.detail);
    const { reservation, newStatus } = event.detail;
    
    // Forçar reatividade dos appointments atualizando o computed
    nextTick(() => {
      console.log('🔄 Interface do ProfileView atualizada após mudança de status');
    });
  };

  window.addEventListener('reservationStatusChanged', handleStatusChange);
  
  // Armazenar listener para limpeza
  window.profileStatusListener = handleStatusChange;
});

// Limpeza ao desmontar o componente
onBeforeUnmount(() => {
  // Limpar listener de mudanças de status
  if (window.profileStatusListener) {
    window.removeEventListener('reservationStatusChanged', window.profileStatusListener);
  }
});

// Função para carregar dados do usuário nos campos
async function loadUserData() {
  const user = authStore.currentUser;
  
  // Limpar dados primeiro
  Object.keys(profileData).forEach(key => {
    if (key !== 'profilePhoto') {
      profileData[key] = '';
    }
  });
  
  await nextTick(); // Aguarda a interface atualizar
  
  if (user) {
    // Carregar dados pessoais
    profileData.fullName = user.fullName || user.nome || '';
    profileData.email = user.email || '';
    profileData.cpf = user.cpf || '';
    profileData.phone = user.phone || user.telefone || '';
    
    // Carregar dados de endereço se existirem
    if (user.address) {
      profileData.cep = user.address.cep || '';
      profileData.street = user.address.street || '';
      profileData.number = user.address.number || '';
      profileData.complement = user.address.complement || '';
    }
    
    // Carregar dados de pagamento se existirem
    if (user.paymentMethod) {
      profileData.cardName = user.paymentMethod.cardName || '';
      profileData.cardNumber = user.paymentMethod.cardNumber || '';
      profileData.cardValidity = user.paymentMethod.cardValidity || '';
      profileData.cardCvc = user.paymentMethod.cardCvc || '';
    }
  } else {
    // Tentar carregar diretamente do localStorage se authStore não tiver dados
    const localStorageUser = localStorage.getItem('sesi_sports_user');
    if (localStorageUser) {
      try {
        const parsedUser = JSON.parse(localStorageUser);
        
        if (parsedUser.address) {
          profileData.cep = parsedUser.address.cep || '';
          profileData.street = parsedUser.address.street || '';
          profileData.number = parsedUser.address.number || '';
          profileData.complement = parsedUser.address.complement || '';
        }
        
        if (parsedUser.paymentMethod) {
          profileData.cardName = parsedUser.paymentMethod.cardName || '';
          profileData.cardNumber = parsedUser.paymentMethod.cardNumber || '';
          profileData.cardValidity = parsedUser.paymentMethod.cardValidity || '';
          profileData.cardCvc = parsedUser.paymentMethod.cardCvc || '';
        }
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
      }
    }
  }
  
  await nextTick(); // Aguarda a interface atualizar novamente
}

// Função para ir ao painel admin
function goToAdminPanel() {
  router.push('/admin');
}

// Função para voltar
function goBack() {
  router.back();
}

// Função para logout
function handleLogout() {
  authStore.logout();
  router.push('/');
}

// Funções para manipulação de foto
function triggerFileUpload() {
  fileInput.value?.click();
}

// Funções para controle da edição de foto
function startPhotoEdit() {
  editModes.photo = true;
}

function cancelPhotoEdit() {
  editModes.photo = false;
  tempPhotoData.value = null;
  // Limpar o input file
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function savePhoto() {
  if (tempPhotoData.value) {
    // Salvar a foto no authStore
    authStore.updateProfilePhoto(tempPhotoData.value);
    tempPhotoData.value = null;
    editModes.photo = false;
    alert('Foto de perfil salva com sucesso!');
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('O arquivo é muito grande. Por favor, selecione uma imagem de até 5MB.');
      return;
    }
    
    // Validar tipo do arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      // Armazenar temporariamente para preview
      tempPhotoData.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function removePhoto() {
  const confirmRemove = confirm('Tem certeza que deseja remover sua foto de perfil?');
  if (confirmRemove) {
    authStore.removeProfilePhoto();
    tempPhotoData.value = null;
    editModes.photo = false;
    alert('Foto de perfil removida com sucesso!');
  }
}

// Funções de formatação
function formatCPF(event) {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length > 11) {
    value = value.slice(0, 11);
  }
  // Formatar como 000.000.000-00
  if (value.length >= 9) {
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  } else if (value.length >= 6) {
    value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  } else if (value.length >= 3) {
    value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  }
  profileData.cpf = value;
}

function formatPhone(event) {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length > 11) {
    value = value.slice(0, 11);
  }
  // Formatar como (00) 00000-0000
  if (value.length >= 11) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (value.length >= 7) {
    value = value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
  } else if (value.length >= 3) {
    value = value.replace(/(\d{2})(\d{1,5})/, '($1) $2');
  } else if (value.length >= 1) {
    value = value.replace(/(\d{1,2})/, '($1');
    if (value.length === 3) value += ')';
  }
  profileData.phone = value;
}

function formatCEP(event) {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length > 8) {
    value = value.slice(0, 8);
  }
  if (value.length > 5) {
    value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
  }
  profileData.cep = value;
  
  // Buscar endereço automaticamente quando CEP estiver completo
  if (value.length === 9) {
    fetchAddressByCEP(value.replace('-', ''));
  }
}

async function fetchAddressByCEP(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    
    if (!data.erro) {
      profileData.street = data.logradouro || '';
      // Não limpar os outros campos para permitir que o usuário mantenha os dados existentes
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
  }
}

function formatCardNumber(event) {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length > 16) {
    value = value.slice(0, 16);
  }
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
  profileData.cardNumber = value;
}

function formatCardValidity(event) {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length > 4) {
    value = value.slice(0, 4);
  }
  if (value.length >= 2) {
    value = value.replace(/(\d{2})(\d{0,2})/, '$1/$2');
  }
  profileData.cardValidity = value;
}

// Função para mascarar número do cartão na visualização
function maskCardNumber(cardNumber) {
  if (!cardNumber) return '';
  const cleanNumber = cardNumber.replace(/\s/g, '');
  const lastFour = cleanNumber.slice(-4);
  return `**** **** **** ${lastFour}`;
}

// Funções de salvamento por seção
function savePersonalData() {
  // Validar CPF se preenchido
  if (profileData.cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(profileData.cpf)) {
    alert('Por favor, insira um CPF válido no formato 000.000.000-00.');
    return;
  }
  
  // Validar telefone se preenchido
  if (profileData.phone && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(profileData.phone)) {
    alert('Por favor, insira um telefone válido no formato (00) 00000-0000.');
    return;
  }
  
  // Salvar dados pessoais
  const updatedProfile = {
    fullName: profileData.fullName,
    email: profileData.email,
    cpf: profileData.cpf,
    phone: profileData.phone,
    updatedAt: new Date().toISOString()
  };
  
  authStore.updateUserProfile(updatedProfile);
  editModes.personal = false;
  
  // Mostrar confirmação
  alert('Dados pessoais salvos com sucesso!');
}

function saveAddressData() {
  // Validar CEP se preenchido
  if (profileData.cep && !/^\d{5}-\d{3}$/.test(profileData.cep)) {
    alert('Por favor, insira um CEP válido no formato 00000-000.');
    return;
  }
  
  // Salvar dados de endereço
  const updatedProfile = {
    address: {
      street: profileData.street,
      number: profileData.number,
      complement: profileData.complement,
      cep: profileData.cep
    },
    updatedAt: new Date().toISOString()
  };
  
  authStore.updateUserProfile(updatedProfile);
  editModes.address = false;
  
  // Mostrar confirmação
  alert('Endereço salvo com sucesso!');
}

function savePaymentData() {
  // Validar número do cartão se preenchido
  if (profileData.cardNumber && !/^\d{4} \d{4} \d{4} \d{4}$/.test(profileData.cardNumber)) {
    alert('Por favor, insira um número de cartão válido no formato 0000 0000 0000 0000.');
    return;
  }
  
  // Validar validade do cartão se preenchido
  if (profileData.cardValidity && !/^\d{2}\/\d{2}$/.test(profileData.cardValidity)) {
    alert('Por favor, insira uma validade válida no formato MM/AA.');
    return;
  }
  
  // Salvar dados de pagamento
  const updatedProfile = {
    paymentMethod: {
      cardNumber: profileData.cardNumber,
      cardName: profileData.cardName,
      cardValidity: profileData.cardValidity,
      cardCvc: profileData.cardCvc
    },
    updatedAt: new Date().toISOString()
  };
  
  authStore.updateUserProfile(updatedProfile);
  editModes.payment = false;
  
  // Mostrar confirmação
  alert('Dados de pagamento salvos com sucesso!');
}

function saveProfile() {
  // Validar CPF se preenchido
  if (profileData.cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(profileData.cpf)) {
    alert('Por favor, insira um CPF válido no formato 000.000.000-00.');
    return;
  }
  
  // Validar telefone se preenchido
  if (profileData.phone && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(profileData.phone)) {
    alert('Por favor, insira um telefone válido no formato (00) 00000-0000.');
    return;
  }
  
  // Validar CEP se preenchido
  if (profileData.cep && !/^\d{5}-\d{3}$/.test(profileData.cep)) {
    alert('Por favor, insira um CEP válido no formato 00000-000.');
    return;
  }
  
  // Validar número do cartão se preenchido
  if (profileData.cardNumber && !/^\d{4} \d{4} \d{4} \d{4}$/.test(profileData.cardNumber)) {
    alert('Por favor, insira um número de cartão válido no formato 0000 0000 0000 0000.');
    return;
  }
  
  // Validar validade do cartão se preenchido
  if (profileData.cardValidity && !/^\d{2}\/\d{2}$/.test(profileData.cardValidity)) {
    alert('Por favor, insira uma validade válida no formato MM/AA.');
    return;
  }
  
  // Salvar dados no authStore
  const updatedProfile = {
    fullName: profileData.fullName,
    email: profileData.email,
    cpf: profileData.cpf,
    phone: profileData.phone,
    address: {
      street: profileData.street,
      number: profileData.number,
      complement: profileData.complement,
      cep: profileData.cep
    },
    paymentMethod: {
      cardNumber: profileData.cardNumber,
      cardName: profileData.cardName,
      cardValidity: profileData.cardValidity,
      cardCvc: profileData.cardCvc
    },
    updatedAt: new Date().toISOString()
  };
  
  authStore.updateUserProfile(updatedProfile);
  
  // Recarregar dados para confirmar que foram salvos
  setTimeout(async () => {
    await loadUserData();
  }, 100);
  
  alert('Perfil salvo com sucesso!');
}

function cancelChanges() {
  loadUserData();
  alert('Alterações canceladas');
}

function validatePasswordMatch() {
  // Validação automática das senhas
}

function savePassword() {
  if (isPasswordValid.value) {
    console.log('Senha alterada com sucesso');
    alert('Senha alterada com sucesso!');
    // Reset dos campos de senha
    passwordData.currentPassword = '';
    passwordData.newPassword = '';
    passwordData.confirmPassword = '';
  }
}

function handleAppointmentAction(appointment) {
  if (appointment.status !== 'canceled') {
    selectedAppointment.value = appointment;
    
    // Preencher formulário com dados atuais do agendamento
    editForm.date = appointment.date || todayString;
    editForm.startTime = appointment.startTime || '14:00';
    editForm.endTime = appointment.endTime || '16:00';
    editForm.notes = appointment.notes || '';
    
    showEditModal.value = true;
  }
}

function openAppointmentDetails(appointment) {
  selectedAppointment.value = appointment;
  showDetailsModal.value = true;
}

function closeDetailsModal() {
  showDetailsModal.value = false;
  selectedAppointment.value = null;
}

// Funções do modal de edição
function closeEditModal() {
  showEditModal.value = false;
  selectedAppointment.value = null;
  
  // Limpar formulário
  editForm.date = '';
  editForm.startTime = '';
  editForm.endTime = '';
  editForm.notes = '';
}

function saveAppointmentChanges() {
  if (isEditFormValid.value) {
    console.log('Salvando alterações do agendamento:', {
      appointment: selectedAppointment.value,
      newData: { ...editForm }
    });
    
    // Atualizar os dados do agendamento no store
    if (selectedAppointment.value) {
      // Encontrar a reserva original no store
      const reservationIndex = reservationsStore.reservations.findIndex(r => r.id === selectedAppointment.value.id);
      
      if (reservationIndex !== -1) {
        // Atualizar no store
        reservationsStore.reservations[reservationIndex].date = editForm.date;
        reservationsStore.reservations[reservationIndex].startTime = editForm.startTime;
        reservationsStore.reservations[reservationIndex].endTime = editForm.endTime;
        reservationsStore.reservations[reservationIndex].notes = editForm.notes;
        reservationsStore.reservations[reservationIndex].status = 'Aprovada'; // Após edição, volta para aprovada
      }
      
      // Atualizar o objeto local também
      selectedAppointment.value.date = editForm.date;
      selectedAppointment.value.startTime = editForm.startTime;
      selectedAppointment.value.endTime = editForm.endTime;
      selectedAppointment.value.notes = editForm.notes;
      selectedAppointment.value.status = 'active';
      selectedAppointment.value.originalStatus = 'Aprovada';
    }
    
    // Emitir evento para sincronizar com agenda do técnico
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('reservationUpdated', { 
          detail: { 
            reservation: reservationsStore.reservations[reservationIndex],
            action: 'updated'
          } 
        }));
        console.log('📢 Evento de atualização de reserva emitido');
      }
    } catch (error) {
      console.log('⚠️ Não foi possível emitir evento de atualização:', error);
    }

    // Aguardar a atualização da interface
    nextTick(() => {
      alert(`Agendamento alterado com sucesso!\n\nNova data: ${formatDate(editForm.date)}\nNovo horário: ${editForm.startTime} às ${editForm.endTime}`);
      closeEditModal();
    });
  }
}

function cancelAppointment() {
  if (selectedAppointment.value) {
    const confirmCancel = confirm(`Tem certeza que deseja cancelar o agendamento "${selectedAppointment.value.title}"?\n\nEsta ação não pode ser desfeita.`);
    
    if (confirmCancel) {
      // Atualizar status no store
      const reservationIndex = reservationsStore.reservations.findIndex(r => r.id === selectedAppointment.value.id);
      
      if (reservationIndex !== -1) {
        reservationsStore.reservations[reservationIndex].status = 'Cancelada';
      }
      
      // Atualizar o objeto local
      selectedAppointment.value.status = 'canceled';
      selectedAppointment.value.originalStatus = 'Cancelada';
      
      // Aguardar a atualização da interface
      nextTick(() => {
        alert('Agendamento cancelado com sucesso!');
        closeEditModal();
      });
    }
  }
}

// Função auxiliar para formatar data
function formatDate(dateString) {
  if (!dateString) return '';
  
  // Evitar problema de timezone - usar formato local
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Mês no JS é 0-indexed
    const day = parseInt(parts[2]);
    const date = new Date(year, month, day);
    return date.toLocaleDateString('pt-BR');
  }
  
  // Fallback para outros formatos
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR');
}
</script>

<style scoped>
/* Banner Admin */
.admin-banner {
  background-color: #dc2626;
  color: #fff;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 24px;
  font-size: 18px;
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

/* Quando há foto, remove padding e faz a foto ocupar tudo */
.profile-btn:has(.profile-photo-mini) {
  padding: 0;
}

/* Fallback para navegadores que não suportam :has() */
.profile-btn .profile-photo-mini {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.profile-btn.active {
  background-color: #164194;
  color: white;
  border-color: #164194;
}
.profile-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}
.profile-btn.active:hover {
  background-color: #113375;
  border-color: #113375;
}

.profile-btn i {
  font-size: 16px;
  position: relative;
  z-index: 1;
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

/* Main Layout */
.profile-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 40px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 600px;
}

/* Sidebar */
.sidebar {
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.nav-item {
  background: none;
  border: none;
  padding: 16px 24px;
  text-align: left;
  font-size: 16px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #e2e8f0;
}

.nav-item:hover {
  background-color: #e2e8f0;
  color: #475569;
}

.nav-item.active {
  background-color: #164194;
  color: white;
  font-weight: 600;
}

.nav-item.active:hover {
  background-color: #113375;
}

/* Content Area */
.content-area {
  padding: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 32px;
}

/* Sections */
.section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.section-icon {
  color: #164194;
  font-size: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* User Info Section */
.user-info-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
}

/* Photo Section */
.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* User Name Section */
.user-name-section {
  text-align: left;
  margin-bottom: 8px;
}

.user-first-name {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.025em;
}

.photo-container {
  width: 120px;
  height: 120px;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  border: 3px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.photo-preview {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.photo-preview:hover {
  border-color: #164194;
  box-shadow: 0 6px 20px rgba(22, 65, 148, 0.2);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.photo-icon {
  font-size: 48px;
}

.photo-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-photo-btn {
  background-color: #22c55e;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-photo-btn:hover {
  background-color: #16a34a;
}

.remove-photo-btn {
  background-color: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-photo-btn:hover {
  background-color: #ef4444;
  color: white;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.payment-grid {
  grid-template-columns: 1fr 1fr;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s ease;
  background-color: white;
}

.form-input:focus {
  outline: none;
  border-color: #164194;
  box-shadow: 0 0 0 1px #164194;
}

.form-input::placeholder {
  color: #9ca3af;
}

/* Payment Card Display */
.payment-card-display {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.card-visual {
  min-width: 80px;
}

.mastercard-logo {
  width: 60px;
  height: 40px;
  background: linear-gradient(135deg, #ff5f00 0%, #eb001b 50%, #f79e1b 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mastercard-circles {
  display: flex;
  align-items: center;
  gap: -6px;
}

.circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  opacity: 0.9;
}

.circle.red {
  background-color: #eb001b;
  z-index: 1;
}

.circle.yellow {
  background-color: #f79e1b;
  margin-left: -6px;
}

.card-details {
  flex: 1;
}

/* Action Buttons */
.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f1f5f9;
}

.danger-action {
  display: flex;
  justify-content: flex-end;
}

.main-actions {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
}

.btn-cancel-appointment {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
  min-width: 180px;
  justify-content: center;
}

.btn-cancel-appointment:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

.btn-cancel-appointment i {
  font-size: 14px;
}

.btn-cancel {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  color: #64748b;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 180px;
  justify-content: center;
}

.btn-cancel:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.btn-cancel i {
  font-size: 14px;
}

.btn-save {
  background: linear-gradient(135deg, #164194 0%, #113375 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(22, 65, 148, 0.2);
  min-width: 180px;
  justify-content: center;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 65, 148, 0.3);
  background: linear-gradient(135deg, #113375 0%, #0f2654 100%);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn-save i {
  font-size: 14px;
}

/* Tab Content */
.tab-content {
  text-align: left;
}

.placeholder-text {
  color: #6b7280;
  font-size: 16px;
  margin-top: 20px;
  text-align: center;
}

/* Appointments List */
.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.appointment-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.appointment-card:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clickable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.appointment-image {
  flex-shrink: 0;
  width: 140px;
  height: 105px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #e2e8f0;
}

.appointment-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.appointment-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 4px;
}

.appointment-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  margin-bottom: 8px;
}

.appointment-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  max-width: 90%;
}

.appointment-action {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
}

.action-btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 80px;
}

.edit-btn {
  background-color: #22c55e;
  color: white;
}

.edit-btn:hover {
  background-color: #16a34a;
}

.canceled-btn {
  background-color: #dc2626;
  color: white;
  cursor: not-allowed;
  opacity: 0.8;
}

.canceled-btn:disabled {
  background-color: #dc2626;
  cursor: not-allowed;
}

/* Password Form */
.password-form {
  max-width: 600px;
}

.password-section {
  margin-bottom: 40px;
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  width: 100%;
  padding-right: 45px !important;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #374151;
}

.password-toggle i {
  font-size: 16px;
}

.password-save-section {
  margin: 32px 0;
}

.btn-save-password {
  background-color: #22c55e;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
}

.btn-save-password:hover:not(:disabled) {
  background-color: #16a34a;
}

.btn-save-password:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

.password-requirements {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 32px;
}

.requirements-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.requirements-text {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.requirements-text strong {
  color: #1e293b;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .profile-container {
    grid-template-columns: 200px 1fr;
    gap: 24px;
  }
  
  .content-area {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .profile-container {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .sidebar {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
  }
  
  .nav-item {
    white-space: nowrap;
    border-bottom: none;
    border-right: 1px solid #e2e8f0;
  }
  
  .nav-item:last-child {
    border-right: none;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .payment-card-display {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: column-reverse;
  }
  
  .btn-cancel,
  .btn-save {
    width: 100%;
  }
  
  /* Melhorias para agendamentos responsivos */
  .appointments-list {
    gap: 16px;
  }
  
  .appointment-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    padding: 20px;
  }
  
  .appointment-image {
    width: 100%;
    max-width: 250px;
    height: 140px;
    margin: 0 auto;
  }
  
  .appointment-content {
    text-align: center;
  }
  
  .appointment-action {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  .action-btn {
    min-width: 120px;
    padding: 10px 20px;
  }
}

@media (max-width: 480px) {
  .content-area {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
    margin-bottom: 24px;
  }
  
  .section-header {
    margin-bottom: 16px;
  }

  .photo-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .appointment-card {
    padding: 16px;
    gap: 12px;
  }
  
  .appointment-image {
    width: 100%;
    height: 100px;
    max-width: 100%;
  }
  
  .appointment-title {
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  .appointment-description {
    font-size: 13px;
    line-height: 1.4;
  }
  
  .action-btn {
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .password-form {
    max-width: 100%;
  }
  
  .password-section {
    margin-bottom: 24px;
  }
  
  .password-requirements {
    padding: 16px;
  }
  
  .requirements-title {
    font-size: 14px;
  }
  
  .requirements-text {
    font-size: 13px;
  }
  
  .btn-save-password {
    width: 100%;
  }
}

/* Estilos para o modal de edição de agendamentos */
.modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: rgba(0, 0, 0, 0.6) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 9999 !important;
  backdrop-filter: blur(4px);
  margin: 0 !important;
  padding: 0 !important;
  inset: 0 !important;
}

.edit-modal {
  background: white !important;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
  position: relative !important;
  margin: auto !important;
  transform: none !important;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Força o modal a aparecer no centro da tela */
.modal-overlay {
  inset: 0 !important;
}

.modal-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: -1;
}

.modal-header {
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
}

/* Estilos para a nova seção de informações do espaço */
.space-info-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.space-header {
  margin-bottom: 1.5rem;
}

.space-title {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.space-title i {
  color: #164194;
  font-size: 1.1rem;
}

.current-booking-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.booking-item i {
  color: #164194;
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.booking-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.booking-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.booking-value {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
}

.space-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.space-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.space-info p {
  margin: 0.25rem 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.current-booking-info {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.current-booking-info p {
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  opacity: 0.95;
}

.current-booking-info i {
  width: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.time-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f1f5f9;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f8fafc;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.validation-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  font-style: italic;
}

/* Responsividade para o modal */
@media (max-width: 768px) {
  .edit-modal {
    width: 95%;
    padding: 1.5rem;
    max-height: 95vh;
  }
  
  .modal-footer {
    gap: 1.5rem;
  }
  
  .main-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-save,
  .btn-cancel-appointment {
    width: 100%;
    justify-content: center;
  }
  
  .time-inputs {
    grid-template-columns: 1fr;
  }
}

/* Estilos para modo visualização e edição */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #164194;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: #1a237e;
  transform: translateY(-1px);
}

.view-mode {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.info-value {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 500;
  margin: 0;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  min-height: 1.25rem;
}

.edit-mode {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.save-btn {
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.save-btn:hover {
  background: #16a34a;
  transform: translateY(-1px);
}

.cancel-btn {
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

.card-details-view {
  padding: 1.5rem;
}

.payment-grid .info-item {
  min-width: 200px;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .save-btn,
  .cancel-btn {
    width: 100%;
    justify-content: center;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .edit-btn {
    align-self: flex-end;
  }
}

/* Estilos para botões de foto */
.photo-buttons-view {
  display: flex;
  justify-content: center;
}

.photo-buttons-edit {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.photo-btn-edit {
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.photo-btn-edit:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

.photo-btn-select {
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.photo-btn-select:hover {
  background: #16a34a;
  transform: translateY(-1px);
}

.photo-btn-remove {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.photo-btn-remove:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.photo-btn-save {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.photo-btn-save:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.photo-btn-cancel {
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.photo-btn-cancel:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .photo-buttons-edit {
    flex-direction: column;
    align-items: center;
  }
  
  .photo-btn-edit,
  .photo-btn-select,
  .photo-btn-remove,
  .photo-btn-save,
  .photo-btn-cancel {
    width: 100%;
    justify-content: center;
  }
}

/* Estilos do modal de detalhes */
.details-modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
  position: relative;
}

.close-btn-top-right {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
}

.close-btn-top-right:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.close-btn-top-right i {
  font-size: 1.2rem;
}

.appointment-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-header {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.detail-image {
  width: 120px;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.detail-title-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
}

.info-row i {
  color: #164194;
  font-size: 1rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.info-value {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 500;
}

.detail-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn-outline {
  background: transparent;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.cancel-btn-outline:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #4b5563;
}

@media (max-width: 768px) {
  .details-modal {
    width: 95%;
    padding: 1.5rem;
    max-height: 95vh;
  }
  
  .detail-header {
    flex-direction: column;
  }
  
  .detail-image {
    width: 100%;
    height: 200px;
  }
  
  .detail-actions {
    flex-direction: column;
  }
}

/* Estilos do modal de detalhes */
.details-modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

.detail-header {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: flex-start;
}

.detail-image {
  width: 150px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.detail-title-section {
  flex: 1;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.detail-info {
  margin-bottom: 2rem;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #164194;
}

.info-row i {
  color: #164194;
  font-size: 1.1rem;
  margin-top: 0.2rem;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.info-value {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;
}

.detail-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn-outline {
  background: transparent;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.cancel-btn-outline:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}
</style>