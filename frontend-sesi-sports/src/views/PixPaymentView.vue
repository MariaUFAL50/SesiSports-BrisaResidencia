<template>
  <div class="pix-payment-page">
    <!-- Header -->
    <div class="payment-header">
      <div class="header-left">
        <button @click="goBack" class="back-btn">
          <i class="pi pi-chevron-left"></i>
        </button>
        <img src="/sesi-sports-logo.png" alt="SESI Sports" class="header-logo" />
      </div>
      <div class="header-actions">
        <button class="profile-btn" @click="toggleProfileMenu">
          <i class="pi pi-user"></i>
        </button>
        <button class="logout-btn" @click="logout">
          {{ authStore.isAuthenticated ? 'Sair' : 'Entrar' }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="pix-main-content">
      <h1 class="pix-title">Pix</h1>
      
      <!-- QR Code Section -->
      <div class="pix-qr-section">
        <div class="pix-qr-code">
          <!-- QR Code placeholder - você pode substituir por um QR code real -->
          <div class="qr-code-placeholder">
            <svg viewBox="0 0 100 100" class="qr-svg">
              <!-- QR Code pattern - simplified -->
              <rect x="0" y="0" width="100" height="100" fill="white"/>
              <rect x="0" y="0" width="20" height="20" fill="black"/>
              <rect x="80" y="0" width="20" height="20" fill="black"/>
              <rect x="0" y="80" width="20" height="20" fill="black"/>
              <rect x="5" y="5" width="10" height="10" fill="white"/>
              <rect x="85" y="5" width="10" height="10" fill="white"/>
              <rect x="5" y="85" width="10" height="10" fill="white"/>
              <!-- Add more QR pattern elements -->
              <rect x="25" y="5" width="5" height="5" fill="black"/>
              <rect x="35" y="5" width="5" height="5" fill="black"/>
              <rect x="45" y="5" width="5" height="5" fill="black"/>
              <rect x="55" y="5" width="5" height="5" fill="black"/>
              <rect x="25" y="15" width="5" height="5" fill="black"/>
              <rect x="45" y="15" width="5" height="5" fill="black"/>
              <rect x="65" y="15" width="5" height="5" fill="black"/>
              <rect x="25" y="25" width="5" height="5" fill="black"/>
              <rect x="35" y="25" width="5" height="5" fill="black"/>
              <rect x="55" y="25" width="5" height="5" fill="black"/>
              <rect x="75" y="25" width="5" height="5" fill="black"/>
            </svg>
          </div>
        </div>
        
        <!-- PIX Code Input -->
        <div class="pix-code-section">
          <p class="pix-code-instruction">Escaneie o QR Code ou copie o código abaixo, cole em seu banco</p>
          <div class="pix-code-input">
            <input 
              type="text" 
              value="6548849848449655018414918916699489949.Test6.Teste.Teste"
              readonly
              class="pix-code-field"
              id="pixCode"
            />
            <button @click="copyPixCode" class="pix-copy-btn">
              <i class="pi pi-copy"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- PIX Instructions -->
      <div class="pix-instructions">
        <h3 class="pix-instructions-title">Antes de efetuar o pagamento, leia atentamente as regras:</h3>
        <div class="pix-instructions-content">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula dolor in nulla luctus, a vestibulum magna pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula dolor in nulla luctus, a vestibulum magna pulvinar.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula dolor in nulla luctus, a vestibulum magna pulvinar.</p>
        </div>
      </div>

      <!-- Finalizar Pagamento Button -->
      <div class="payment-actions">
        <button 
          @click="finalizePayment" 
          class="finalize-payment-btn"
          :disabled="isProcessing"
        >
          <span v-if="!isProcessing">Finalizar pagamento</span>
          <span v-else>
            <i class="pi pi-spin pi-spinner"></i>
            Processando...
          </span>
        </button>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="success-modal" @click.stop>
        <button @click="closeSuccessModal" class="modal-close-btn">
          <i class="pi pi-times"></i>
        </button>
        
        <div class="success-content">
          <div class="success-icon">
            <i class="pi pi-check"></i>
          </div>
          
          <h2 class="success-title">Pagamento realizado com sucesso!</h2>
          
          <div class="booking-details">
            <h3>Detalhes da locação</h3>
            <div class="detail-row">
              <span class="detail-label">Data:</span>
              <span class="detail-value">{{ currentReservation ? formatDate(currentReservation.date) : formatDate(route.query.date) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tipo:</span>
              <span class="detail-value">{{ currentReservation ? getSpaceTypeDynamic() : getSpaceType() }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Horário:</span>
              <span class="detail-value">{{ getDisplayTime() }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Horas totais:</span>
              <span class="detail-value">{{ getDisplayHours() }}</span>
            </div>
          </div>
          
          <p class="success-message">O comprovante foi enviado para o seu e-mail.</p>
          
          <button @click="goToHome" class="success-ok-btn">
            Ok
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useReservationsStore } from '../stores/reservations';
import { useSpacesStore } from '../stores/spaces';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const reservationsStore = useReservationsStore();
const spacesStore = useSpacesStore();

// State
const showProfileMenu = ref(false);
const showSuccessModal = ref(false);
const isProcessing = ref(false);
const currentReservation = ref(null); // Para armazenar dados da reserva atual

// Profile functions
const getUserName = () => {
  if (authStore.isAuthenticated && authStore.user) {
    return authStore.user.name || authStore.user.firstName + ' ' + authStore.user.lastName || 'Usuário';
  }
  return 'Usuário';
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

const goToProfile = () => {
  showProfileMenu.value = false;
  router.push('/profile');
};

const logout = () => {
  authStore.logout();
  showProfileMenu.value = false;
  router.push('/');
};

// Navigation
const goBack = () => {
  router.go(-1);
};

// PIX functions
const copyPixCode = () => {
  const pixCodeElement = document.getElementById('pixCode');
  if (pixCodeElement) {
    pixCodeElement.select();
    pixCodeElement.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(pixCodeElement.value);
    // Opcional: mostrar feedback visual
    alert('Código PIX copiado!');
  }
};

// Success modal functions
const closeSuccessModal = () => {
  showSuccessModal.value = false;
};

const goToHome = () => {
  showSuccessModal.value = false;
  router.push('/');
};

// Debug function to log all query params
const logQueryData = () => {
  console.log('🔍 Dados da query atual:', route.query);
  console.log('📊 Dados para o modal:', {
    date: route.query.date,
    startTime: route.query.startTime,
    endTime: route.query.endTime,
    spaceId: route.query.spaceId,
    totalValue: route.query.totalValue
  });
};

// Helper functions for modal data
const formatDate = (dateString) => {
  console.log('📅 Formatando data:', dateString);
  
  if (!dateString) {
    console.log('⚠️ Data não encontrada, usando padrão');
    return '11/11/2025';
  }
  
  const date = new Date(dateString + 'T00:00:00');
  const formatted = date.toLocaleDateString('pt-BR');
  
  console.log('✅ Data formatada:', formatted);
  return formatted;
};

const calculateHours = () => {
  console.log('🕐 Calculando horas:', {
    startTime: route.query.startTime,
    endTime: route.query.endTime
  });
  
  if (!route.query.startTime || !route.query.endTime) {
    console.log('⚠️ Horários não encontrados, usando padrão: 2h');
    return '2';
  }
  
  const start = route.query.startTime.split(':').map(Number);
  const end = route.query.endTime.split(':').map(Number);
  
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];
  
  const totalMinutes = endMinutes - startMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  let result;
  if (minutes === 0) {
    result = `${hours}`;
  } else {
    result = `${hours}h${minutes}min`;
  }
  
  console.log('✅ Horas calculadas:', result);
  return result;
};

const getSpaceType = () => {
  const spaceId = route.query.spaceId;
  console.log('🏟️ Buscando tipo do espaço:', spaceId);
  
  const space = spacesStore.getSpaceById(spaceId);
  const spaceType = space?.type || space?.category || 'Esporte';
  
  console.log('✅ Tipo do espaço encontrado:', spaceType, space);
  return spaceType;
};

// Funções responsivas para o modal usando dados da reserva atual
const getSpaceTypeDynamic = () => {
  console.log('🏟️ Obtendo tipo do espaço dinamicamente');
  
  if (currentReservation.value && currentReservation.value.spaceName) {
    // Buscar tipo do espaço usando spaceName da reserva
    const spaceName = currentReservation.value.spaceName.toLowerCase();
    console.log('📝 Nome do espaço:', currentReservation.value.spaceName);
    
    if (spaceName.includes('tênis')) return 'Tênis';
    if (spaceName.includes('futsal')) return 'Futsal';
    if (spaceName.includes('futebol')) return 'Futebol';
    if (spaceName.includes('basquete')) return 'Basquete';
    if (spaceName.includes('vôlei')) return 'Vôlei';
    
    console.log('✅ Tipo detectado do nome:', spaceName);
  }
  
  console.log('⚠️ Usando função padrão getSpaceType()');
  return getSpaceType();
};

const getDisplayTime = () => {
  console.log('🕐 Obtendo horário para exibição');
  
  if (currentReservation.value && currentReservation.value.startTime && currentReservation.value.endTime) {
    console.log('✅ Usando dados da reserva:', currentReservation.value.startTime, '-', currentReservation.value.endTime);
    return `${currentReservation.value.startTime} - ${currentReservation.value.endTime}`;
  }
  
  const fallbackTime = `${route.query.startTime || '14:00'} - ${route.query.endTime || '16:00'}`;
  console.log('⚠️ Usando dados da query/padrão:', fallbackTime);
  return fallbackTime;
};

const getDisplayHours = () => {
  console.log('⏱️ Obtendo horas para exibição');
  
  if (currentReservation.value && currentReservation.value.startTime && currentReservation.value.endTime) {
    console.log('✅ Calculando da reserva');
    return calculateHoursFromReservation(currentReservation.value);
  }
  
  console.log('⚠️ Calculando da query');
  return calculateHours() + 'h';
};

const calculateHoursFromReservation = (reservation) => {
  console.log('⏰ Calculando horas da reserva:', reservation);
  
  if (!reservation || !reservation.startTime || !reservation.endTime) {
    console.log('⚠️ Dados da reserva incompletos, usando padrão 2h');
    return '2h';
  }
  
  try {
    const start = reservation.startTime.split(':').map(Number);
    const end = reservation.endTime.split(':').map(Number);
    
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    
    const totalMinutes = endMinutes - startMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h${minutes}min`;
    }
  } catch (error) {
    console.error('❌ Erro ao calcular horas:', error);
    return '2h';
  }
};

// Payment finalization
const finalizePayment = async () => {
  isProcessing.value = true;
  
  try {
    // Simular processamento do pagamento PIX
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('💳 Pagamento PIX confirmado, confirmando reserva temporária...');
    
    // Tentar confirmar reserva temporária primeiro
    const tempReservationId = sessionStorage.getItem('tempReservationId');
    
    if (tempReservationId) {
      console.log('🔒 Confirmando reserva temporária:', tempReservationId);
      
      const confirmedReservation = reservationsStore.confirmTemporaryReservation(tempReservationId);
      
      if (confirmedReservation) {
        // Atualizar dados específicos do pagamento
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
                action: 'payment_confirmed'
              }
            }));
            console.log('📢 Evento "newReservationAdded" disparado para reserva confirmada:', confirmedReservation.id);
          }
        } catch (eventError) {
          console.error('❌ Erro ao disparar evento de nova reserva:', eventError);
        }
        
        alert('Pagamento realizado com sucesso! Sua reserva foi confirmada.');
        
        // Redirecionar para perfil
        router.push('/profile');
        return;
      }
    }
    
    // FALLBACK: Se não há reserva temporária, usar método antigo
    console.log('⚠️ Reserva temporária não encontrada, usando método tradicional...');
    
    // Pegar dados da reserva da query
    const spaceId = route.query.spaceId;
    const space = spacesStore.getSpaceById(spaceId);
    
    console.log('🔍 Dados para verificação de conflito:', {
      spaceId: parseInt(spaceId),
      date: route.query.date,
      startTime: route.query.startTime,
      endTime: route.query.endTime
    });
    
    // VERIFICAR CONFLITOS ANTES DE CRIAR A RESERVA
    const conflict = reservationsStore.checkTimeConflict(
      parseInt(spaceId),
      route.query.date,
      route.query.startTime,
      route.query.endTime
    );
    
    console.log('⚡ Resultado da verificação de conflito:', conflict);

    if (conflict.hasConflict) {
      const conflictReservation = conflict.conflictingReservation;
      const conflictType = conflict.conflictType === 'temporary' ? 'sendo processada' : 'já confirmada';
      alert(`Conflito de horário detectado! O espaço "${conflictReservation.spaceName}" já está ${conflictType} por ${conflictReservation.userName} no dia ${route.query.date} das ${conflictReservation.startTime} às ${conflictReservation.endTime}.`);
      // Redirecionar de volta para a página de reserva
      router.push(`/space-reservation/${spaceId}`);
      return;
    }
    
    // Criar dados da reserva
    const reservationData = {
      spaceId: parseInt(spaceId),
      spaceName: space?.name || 'Espaço não encontrado',
      date: route.query.date,
      startTime: route.query.startTime,
      endTime: route.query.endTime,
      userId: authStore.currentUser?.id || 'guest',
      userName: authStore.currentUser?.name || 'Usuário',
      userEmail: authStore.currentUser?.email || 'email@exemplo.com',
      purpose: route.query.purpose || 'Locação via PIX',
      paymentMethod: 'PIX',
      isRecurrent: route.query.isRecurrent === 'true',
      recurrenceType: route.query.recurrenceType || 'none',
      totalValue: route.query.totalValue || '0.00'
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
    
    // Armazenar dados da reserva para o modal
    currentReservation.value = newReservation;
    
    console.log('💾 Reserva armazenada para modal:', currentReservation.value);
    console.log('📋 Dados da reserva:', {
      date: currentReservation.value.date,
      startTime: currentReservation.value.startTime,
      endTime: currentReservation.value.endTime,
      spaceName: currentReservation.value.spaceName
    });
    
    // Log dos dados antes de mostrar o modal
    console.log('📋 Dados antes de mostrar modal:');
    logQueryData();
    
    // Mostrar modal de sucesso em vez de redirecionar
    console.log('🎯 Pronto para mostrar modal com dados:', {
      hasReservation: !!currentReservation.value,
      hasQueryData: !!(route.query.date && route.query.startTime),
      reservationData: currentReservation.value
    });
    
    try {
      // Testar se as funções do modal funcionam antes de abrir
      console.log('🧪 Testando funções do modal:');
      console.log('- Data:', currentReservation.value ? formatDate(currentReservation.value.date) : formatDate(route.query.date));
      console.log('- Tipo:', getSpaceTypeDynamic());
      console.log('- Horário:', getDisplayTime());
      console.log('- Horas:', getDisplayHours());
      
      showSuccessModal.value = true;
      console.log('✅ Modal aberto com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao abrir modal:', error);
      // Fallback: mostrar modal mesmo com erro
      showSuccessModal.value = true;
    }
    
  } catch (error) {
    console.error('Erro ao finalizar pagamento:', error);
    alert('Erro ao processar pagamento. Tente novamente.');
  } finally {
    isProcessing.value = false;
  }
};

// Close profile menu on click outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.user-profile')) {
    showProfileMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  // Log dos dados na inicialização
  console.log('🚀 PixPaymentView carregado');
  console.log('🔍 RECEBENDO DADOS:');
  console.log('- Route Query completa:', route.query);
  console.log('- Object keys:', Object.keys(route.query));
  console.log('- SpaceId:', route.query.spaceId, typeof route.query.spaceId);
  console.log('- SpaceName:', route.query.spaceName);
  console.log('- Date:', route.query.date);
  console.log('- StartTime:', route.query.startTime);
  console.log('- EndTime:', route.query.endTime);
  console.log('- TotalValue:', route.query.totalValue);
  console.log('- Hours:', route.query.hours);
  logQueryData();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.pix-payment-page {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Header Styles - Padrão das outras telas */
.payment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 32px 18px 24px;
  background: white;
  border-bottom: 1px solid #f2f3f5;
  position: sticky;
  top: 0;
  z-index: 100;
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

/* Success Modal Styles */
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

.success-modal {
  background: white;
  border-radius: 8px;
  padding: 0;
  max-width: 400px;
  width: 90%;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.modal-close-btn:hover {
  background: #f5f5f5;
}

.success-content {
  padding: 40px 30px 30px;
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
}

.success-icon i {
  font-size: 40px;
  color: white;
}

.success-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 25px;
  margin-top: 0;
}

.booking-details {
  text-align: left;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.booking-details h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  margin-top: 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  color: #666;
  font-size: 14px;
}

.detail-value {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.success-message {
  color: #666;
  font-size: 14px;
  margin-bottom: 25px;
  line-height: 1.4;
}

.success-ok-btn {
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 40px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  min-width: 100px;
}

.success-ok-btn:hover {
  background: #45a049;
}

/* Main Content */
.pix-main-content {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.pix-title {
  font-size: 2rem;
  font-weight: 300;
  color: #333;
  margin-bottom: 2rem;
  margin-top: 0;
  text-align: left;
}

.pix-qr-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.pix-qr-code {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.qr-code-placeholder {
  width: 250px;
  height: 250px;
  border: 2px solid #333;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-svg {
  width: 100%;
  height: 100%;
}

.pix-code-section {
  text-align: center;
}

.pix-code-instruction {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.4;
}

.pix-code-input {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  padding: 2px;
  max-width: 500px;
  margin: 0 auto;
}

.pix-code-field {
  flex: 1;
  border: none;
  padding: 12px;
  font-size: 0.8rem;
  color: #333;
  background: transparent;
  outline: none;
}

.pix-copy-btn {
  background: #f5f5f5;
  border: none;
  padding: 12px;
  cursor: pointer;
  color: #666;
  border-radius: 0 4px 4px 0;
  border-left: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pix-copy-btn:hover {
  background: #e0e0e0;
}

.pix-instructions {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.pix-instructions-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  margin-top: 0;
}

.pix-instructions-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.pix-instructions-content p:last-child {
  margin-bottom: 0;
}

/* Payment Actions */
.payment-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.finalize-payment-btn {
  background: #164194;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.finalize-payment-btn:hover:not(:disabled) {
  background: #0f2d6b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 65, 148, 0.3);
}

.finalize-payment-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.finalize-payment-btn i {
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .payment-header {
    padding: 1rem;
  }
  
  .pix-main-content {
    padding: 1rem;
  }
  
  .pix-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .pix-qr-section {
    padding: 1.5rem;
  }
  
  .qr-code-placeholder {
    width: 200px;
    height: 200px;
  }
  
  .pix-instructions {
    padding: 1.5rem;
  }
  
  .pix-code-field {
    font-size: 0.7rem;
  }
  
  .finalize-payment-btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
    min-width: 180px;
  }
  
  .payment-actions {
    margin-top: 1.5rem;
  }
}
</style>