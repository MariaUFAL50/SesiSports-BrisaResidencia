import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReservationsStore = defineStore('reservations', () => {
  const reservations = ref([
    // Dados mock para teste - em produção viriam da API
    {
      id: 1,
      spaceId: 1,
      spaceName: 'Quadra de Tênis A',
      date: '2025-09-16',
      startTime: '14:00',
      endTime: '16:00',
      userId: 'user123',
      userName: 'João Silva',
      userEmail: 'joao@email.com',
      status: 'Aprovada',
      purpose: 'Treinamento de tênis',
      createdAt: '2025-09-14T10:00:00Z'
    },
    {
      id: 2,
      spaceId: 2,
      spaceName: 'Quadra de Futsal B',
      date: '2025-09-16',
      startTime: '18:00',
      endTime: '20:00',
      userId: 'user456',
      userName: 'Maria Santos',
      userEmail: 'maria@email.com',
      status: 'Pendente',
      purpose: 'Partida amistosa',
      createdAt: '2025-09-14T15:30:00Z'
    },
    // Reserva de teste para verificar conflitos
    {
      id: 3,
      spaceId: 1,
      spaceName: 'Quadra de Tênis A',
      date: '2025-09-16',
      startTime: '15:00',
      endTime: '17:00',
      userId: 'test-user',
      userName: 'Usuário Teste',
      userEmail: 'teste@email.com',
      status: 'Confirmada',
      purpose: 'Teste de conflito',
      createdAt: '2025-09-14T10:00:00Z'
    },
    // Reservas para os usuários reais do sistema
    {
      id: 4,
      spaceId: 1,
      spaceName: 'Quadra de Tênis A',
      date: '2025-09-16',
      startTime: '09:00',
      endTime: '11:00',
      userId: 1, // ID do usuário teste do auth store
      userName: 'Usuário Teste',
      userEmail: 'usuario@teste.com',
      status: 'Confirmada',
      purpose: 'Treinamento matinal',
      createdAt: '2025-09-15T08:00:00Z'
    },
    {
      id: 5,
      spaceId: 3,
      spaceName: 'Piscina Olímpica',
      date: '2025-09-16',
      startTime: '16:00',
      endTime: '18:00',
      userId: 1, // ID do usuário teste do auth store
      userName: 'Usuário Teste',
      userEmail: 'usuario@teste.com',
      status: 'Pendente',
      purpose: 'Natação recreativa',
      createdAt: '2025-09-15T10:30:00Z'
    },
    {
      id: 6,
      spaceId: 2,
      spaceName: 'Quadra de Futsal B',
      date: '2025-09-16',
      startTime: '20:00',
      endTime: '22:00',
      userId: 2, // ID do técnico do auth store
      userName: 'João Silva - Técnico',
      userEmail: 'joao.silva@sesi.com',
      status: 'Aprovada',
      purpose: 'Treinamento técnico',
      createdAt: '2025-09-15T12:00:00Z'
    },
    // Reservas para o administrador (ID 99)
    {
      id: 7,
      spaceId: 1,
      spaceName: 'Quadra de Futebol Society Premium',
      date: '2025-09-17',
      startTime: '14:00',
      endTime: '16:00',
      userId: 99, // ID do administrador
      userName: 'Administrador do Sistema',
      userEmail: 'admin@sesi-sports.com',
      status: 'Pendente',
      purpose: 'Reunião administrativa',
      createdAt: '2025-09-16T08:00:00Z'
    },
    {
      id: 8,
      spaceId: 3,
      spaceName: 'Piscina Olímpica Aqua Sports',
      date: '2025-09-18',
      startTime: '10:00',
      endTime: '12:00',
      userId: 99, // ID do administrador
      userName: 'Administrador do Sistema',
      userEmail: 'admin@sesi-sports.com',
      status: 'Aprovada',
      purpose: 'Inspeção administrativa',
      createdAt: '2025-09-16T09:00:00Z'
    }
  ])

  // ===== SISTEMA DE RESERVAS TEMPORÁRIAS =====
  // Para evitar race condition durante o processo de pagamento
  const temporaryReservations = ref([])

  // Função para criar reserva temporária (soft lock)
  const createTemporaryReservation = (reservationData) => {
    console.log('🔒 Criando reserva temporária para:', reservationData);
    
    const tempReservation = {
      id: `temp_${Date.now()}`,
      ...reservationData,
      status: 'TemporaryLock',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
      createdAt: new Date().toISOString()
    }
    
    temporaryReservations.value.push(tempReservation)
    console.log('✅ Reserva temporária criada:', tempReservation);
    
    // Auto-remover após expiração
    setTimeout(() => {
      removeTemporaryReservation(tempReservation.id)
    }, 10 * 60 * 1000) // 10 minutos
    
    return tempReservation
  }

  // Função para remover reserva temporária
  const removeTemporaryReservation = (tempId) => {
    const index = temporaryReservations.value.findIndex(temp => temp.id === tempId)
    if (index !== -1) {
      const removed = temporaryReservations.value.splice(index, 1)[0]
      console.log('🗑️ Reserva temporária removida:', removed.id)
      return removed
    }
    return null
  }

  // Função para confirmar reserva temporária (transformar em reserva real)
  const confirmTemporaryReservation = (tempId) => {
    const tempReservation = temporaryReservations.value.find(temp => temp.id === tempId)
    if (!tempReservation) {
      console.error('❌ Reserva temporária não encontrada:', tempId)
      return null
    }
    
    // Remover dados temporários e criar reserva real
    const { id, expiresAt, status, ...realReservationData } = tempReservation
    const confirmedReservation = addReservation(realReservationData)
    
    // Remover a reserva temporária
    removeTemporaryReservation(tempId)
    
    console.log('✅ Reserva temporária confirmada como reserva real:', confirmedReservation.id)
    return confirmedReservation
  }

  // Função de limpeza automática de reservas temporárias expiradas
  const cleanupExpiredTemporaryReservations = () => {
    const now = new Date()
    const expired = temporaryReservations.value.filter(temp => new Date(temp.expiresAt) <= now)
    
    expired.forEach(temp => {
      removeTemporaryReservation(temp.id)
      console.log('🧹 Reserva temporária expirada removida:', temp.id)
    })
  }

  // Executar limpeza a cada minuto
  setInterval(cleanupExpiredTemporaryReservations, 60 * 1000)
  // ===== FIM SISTEMA DE RESERVAS TEMPORÁRIAS =====

  // Função para verificar conflitos de horário (incluindo reservas temporárias)
  const checkTimeConflict = (spaceId, date, startTime, endTime, excludeTempId = null) => {
    console.log('🔍 Verificando conflitos para:', { spaceId, date, startTime, endTime });
    console.log('📋 Reservas existentes:', reservations.value);
    console.log('🔒 Reservas temporárias:', temporaryReservations.value);
    
    // Limpar reservas temporárias expiradas antes da verificação
    cleanupExpiredTemporaryReservations()
    
    // Garantir que spaceId seja number para comparação
    const targetSpaceId = typeof spaceId === 'string' ? parseInt(spaceId) : spaceId;
    
    // Função helper para verificar conflito de horário
    const hasTimeOverlap = (startTime1, endTime1, startTime2, endTime2) => {
      const toMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 60 + minutes
      }

      const start1 = toMinutes(startTime1)
      const end1 = toMinutes(endTime1)
      const start2 = toMinutes(startTime2)
      const end2 = toMinutes(endTime2)

      return !(end1 <= start2 || start1 >= end2)
    }
    
    // Verificar conflitos com reservas normais
    const normalConflict = reservations.value.find(reservation => {
      // Verifica se é o mesmo espaço e data
      if (reservation.spaceId !== targetSpaceId || reservation.date !== date) {
        return false
      }

      // Verifica se não está cancelada ou rejeitada
      if (reservation.status === 'Cancelada' || reservation.status === 'Rejeitada') {
        return false
      }
      
      // Verifica se há sobreposição de horários
      return hasTimeOverlap(startTime, endTime, reservation.startTime, reservation.endTime)
    })

    // Verificar conflitos com reservas temporárias (excluindo a atual se especificada)
    const tempConflict = temporaryReservations.value.find(tempReservation => {
      // Excluir a reserva temporária atual se especificada
      if (excludeTempId && tempReservation.id === excludeTempId) {
        return false
      }
      
      // Verifica se é o mesmo espaço e data
      if (tempReservation.spaceId !== targetSpaceId || tempReservation.date !== date) {
        return false
      }
      
      // Verifica se há sobreposição de horários
      return hasTimeOverlap(startTime, endTime, tempReservation.startTime, tempReservation.endTime)
    })

    const conflict = normalConflict || tempConflict
    const result = conflict ? {
      hasConflict: true,
      conflictingReservation: conflict,
      conflictType: normalConflict ? 'normal' : 'temporary'
    } : {
      hasConflict: false,
      conflictingReservation: null,
      conflictType: null
    }
    
    console.log('✅ Resultado da verificação:', result);
    return result
  }

  // Função para adicionar nova reserva
  const addReservation = (reservationData) => {
    console.log('🆕 === CRIANDO NOVA RESERVA ===');
    console.log('📋 Dados recebidos:', reservationData);
    console.log('📊 Total de reservas antes:', reservations.value.length);
    console.log('📋 Lista atual antes:', reservations.value.map(r => ({ id: r.id, userName: r.userName, date: r.date })));
    
    const newReservation = {
      id: reservations.value.length + 1,
      ...reservationData,
      status: 'Pendente', // Todas as reservas começam como pendente
      createdAt: new Date().toISOString()
    }
    
    reservations.value.push(newReservation)
    
    console.log('✅ Nova reserva criada:', newReservation);
    console.log('📊 Total de reservas depois:', reservations.value.length);
    console.log('📋 Lista atual depois:', reservations.value.map(r => ({ id: r.id, userName: r.userName, date: r.date })));
    console.log('🆕 === FIM CRIAÇÃO RESERVA ===');
    
    // Tentar forçar sincronização com técnico se estiver disponível
    try {
      // Emitir evento customizado para notificar sobre nova reserva
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('newReservationAdded', { 
          detail: { reservation: newReservation } 
        }));
        console.log('📢 Evento de nova reserva emitido para reserva ID:', newReservation.id);
      }
    } catch (error) {
      console.log('⚠️ Não foi possível emitir evento:', error);
    }
    
    // Salvar no localStorage após adicionar nova reserva
    saveToStorage()
    
    return newReservation
  }

  // Função para buscar reservas de um usuário
  const getUserReservations = (userId) => {
    return reservations.value.filter(reservation => reservation.userId === userId)
  }

  // Função para atualizar status da reserva
  const updateReservationStatus = (reservationId, newStatus) => {
    const reservation = reservations.value.find(r => r.id === reservationId)
    if (reservation) {
      const oldStatus = reservation.status;
      reservation.status = newStatus;
      
      console.log(`🔄 Status da reserva ${reservationId} atualizado: ${oldStatus} → ${newStatus}`);
      
      // Emitir evento para notificar sobre mudança de status
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('reservationStatusChanged', { 
            detail: { 
              reservation: reservation,
              oldStatus: oldStatus,
              newStatus: newStatus,
              action: 'status_changed'
            } 
          }));
          console.log('📢 Evento de mudança de status emitido');
        }
      } catch (error) {
        console.log('⚠️ Não foi possível emitir evento de mudança de status:', error);
      }
      
      // Salvar no localStorage após atualizar status
      saveToStorage()
      
      return true;
    }
    return false;
  }

  // Função para cancelar reserva (com validação de 48h)
  const cancelReservation = (reservationId) => {
    const reservation = reservations.value.find(r => r.id === reservationId)
    if (!reservation) {
      return { success: false, message: 'Reserva não encontrada' }
    }

    // Verificar se pode cancelar (48h de antecedência)
    const reservationDateTime = new Date(`${reservation.date}T${reservation.startTime}:00`)
    const now = new Date()
    const timeDiff = reservationDateTime.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 3600)

    if (hoursDiff < 48) {
      return { 
        success: false, 
        message: 'Não é possível cancelar com menos de 48 horas de antecedência' 
      }
    }

    reservation.status = 'Cancelada'
    saveToStorage()  // Salvar após cancelamento
    return { success: true, message: 'Reserva cancelada com sucesso' }
  }

  // Função para salvar no localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem('sesi_sports_reservations', JSON.stringify(reservations.value))
      console.log('💾 Reservas salvas no localStorage:', reservations.value.length)
    } catch (error) {
      console.error('❌ Erro ao salvar reservas no localStorage:', error)
    }
  }

  // Função para carregar do localStorage
  const loadFromStorage = () => {
    try {
      const savedReservations = localStorage.getItem('sesi_sports_reservations')
      if (savedReservations) {
        const parsed = JSON.parse(savedReservations)
        // Mesclar reservas salvas com as mockadas, evitando duplicatas
        const existingIds = reservations.value.map(r => r.id)
        const newReservations = parsed.filter(r => !existingIds.includes(r.id))
        reservations.value = [...reservations.value, ...newReservations]
        console.log('📂 Reservas carregadas do localStorage:', parsed.length)
        console.log('📋 Total de reservas após carregamento:', reservations.value.length)
      }
    } catch (error) {
      console.error('❌ Erro ao carregar reservas do localStorage:', error)
    }
  }

  // Função para inicializar o store
  const initializeReservations = () => {
    console.log('🔄 Inicializando store de reservas...')
    loadFromStorage()
  }

  return {
    reservations,
    temporaryReservations,
    checkTimeConflict,
    addReservation,
    getUserReservations,
    updateReservationStatus,
    cancelReservation,
    saveToStorage,
    loadFromStorage,
    initializeReservations,
    // Funções de reserva temporária
    createTemporaryReservation,
    removeTemporaryReservation,
    confirmTemporaryReservation,
    cleanupExpiredTemporaryReservations
  }
})