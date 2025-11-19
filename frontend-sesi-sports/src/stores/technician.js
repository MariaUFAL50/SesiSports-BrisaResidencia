// src/stores/technician.js
import { defineStore } from 'pinia';
import { useReservationsStore } from './reservations.js';
import { useSpacesStore } from './spaces.js';

export const useTechnicianStore = defineStore('technician', {
  state: () => ({
    // Dados do técnico
    technicianProfile: {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@sesi.com',
      type: 'technician',
      specialties: ['Futebol', 'Basquete', 'Vôlei'],
    },
    
    // Agendamentos do técnico
    appointments: [
      {
        id: 1,
        clientName: 'Maria Santos',
        clientEmail: 'maria@email.com',
        date: '2025-07-28',
        startTime: '10:00',
        endTime: '11:00',
        type: 'Quadra',
        modality: 'Futebol',
        status: 'confirmado',
        color: '#10B981' // verde
      },
      {
        id: 2,
        clientName: 'Carlos Oliveira',
        clientEmail: 'carlos@email.com',
        date: '2025-07-28',
        startTime: '14:00',
        endTime: '15:30',
        type: 'Quadra',
        modality: 'Basquete',
        status: 'pendente',
        color: '#F59E0B' // amarelo
      },
      {
        id: 3,
        clientName: 'Ana Paula',
        clientEmail: 'ana@email.com',
        date: '2025-07-29',
        startTime: '09:00',
        endTime: '10:00',
        type: 'Quadra',
        modality: 'Vôlei',
        status: 'confirmado',
        color: '#10B981'
      },
      {
        id: 4,
        clientName: 'Pedro Silva',
        clientEmail: 'pedro@email.com',
        date: '2025-07-30',
        startTime: '16:00',
        endTime: '17:00',
        type: 'Campo',
        modality: 'Futebol',
        status: 'cancelado',
        color: '#EF4444' // vermelho
      }
    ],
    
    // Filtros da agenda
    filters: {
      date: '',
      startTime: '',
      endTime: '',
      type: '',
      modality: ''
    },
    
    // Configurações da agenda
    agendaSettings: {
      currentDate: (() => {
        const today = new Date();
        return today.getFullYear() + '-' + 
               String(today.getMonth() + 1).padStart(2, '0') + '-' + 
               String(today.getDate()).padStart(2, '0');
      })(), // Formato YYYY-MM-DD com timezone fix
      viewMode: 'week', // 'day', 'week', 'month'
      workingHours: {
        start: '06:00',
        end: '22:00'
      }
    }
  }),

  getters: {
    // Obter agendamentos filtrados
    filteredAppointments: (state) => {
      let filtered = state.appointments;
      
      if (state.filters.date) {
        filtered = filtered.filter(apt => apt.date === state.filters.date);
      }
      
      if (state.filters.startTime) {
        filtered = filtered.filter(apt => apt.startTime >= state.filters.startTime);
      }
      
      if (state.filters.endTime) {
        filtered = filtered.filter(apt => apt.endTime <= state.filters.endTime);
      }
      
      if (state.filters.type) {
        filtered = filtered.filter(apt => 
          apt.type.toLowerCase().includes(state.filters.type.toLowerCase())
        );
      }
      
      if (state.filters.modality) {
        filtered = filtered.filter(apt => 
          apt.modality.toLowerCase().includes(state.filters.modality.toLowerCase())
        );
      }
      
      return filtered;
    },
    
    // Obter agendamentos por data
    appointmentsByDate: (state) => {
      return (date) => {
        return state.appointments.filter(apt => apt.date === date);
      };
    },
    
    // Obter agendamentos da semana atual
    weekAppointments: (state) => {
      const currentDate = new Date(state.agendaSettings.currentDate);
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return state.appointments.filter(apt => {
        // Evitar problema de timezone
        let aptDate;
        if (apt.date.includes('-')) {
          const parts = apt.date.split('-');
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1;
          const day = parseInt(parts[2]);
          aptDate = new Date(year, month, day);
        } else {
          aptDate = new Date(apt.date + 'T12:00:00');
        }
        return aptDate >= startOfWeek && aptDate <= endOfWeek;
      });
    },
    
    // Verificar se há conflitos de horário
    hasTimeConflict: (state) => {
      return (newAppointment) => {
        return state.appointments.some(apt => 
          apt.date === newAppointment.date &&
          apt.id !== newAppointment.id &&
          (
            (newAppointment.startTime >= apt.startTime && newAppointment.startTime < apt.endTime) ||
            (newAppointment.endTime > apt.startTime && newAppointment.endTime <= apt.endTime) ||
            (newAppointment.startTime <= apt.startTime && newAppointment.endTime >= apt.endTime)
          )
        );
      };
    }
  },

  actions: {
    // Inicializar dados do localStorage
    initializeTechnician() {
      const savedAppointments = localStorage.getItem('sesi_sports_technician_appointments');
      const savedFilters = localStorage.getItem('sesi_sports_technician_filters');
      const savedSettings = localStorage.getItem('sesi_sports_technician_settings');
      
      if (savedAppointments) {
        try {
          this.appointments = JSON.parse(savedAppointments);
        } catch (error) {
          console.error('Erro ao carregar agendamentos do localStorage:', error);
        }
      }
      
      if (savedFilters) {
        try {
          this.filters = JSON.parse(savedFilters);
        } catch (error) {
          console.error('Erro ao carregar filtros do localStorage:', error);
        }
      }
      
      if (savedSettings) {
        try {
          this.agendaSettings = { ...this.agendaSettings, ...JSON.parse(savedSettings) };
        } catch (error) {
          console.error('Erro ao carregar configurações do localStorage:', error);
        }
      }
      
      // Sincronizar com reservas de usuários
      this.syncUserReservations();
    },
    
    // Sincronizar reservas de usuários com agenda do técnico
    syncUserReservations() {
      console.log('🔄 Sincronizando agenda do técnico com as reservas centrais...');
      const reservationsStore = useReservationsStore();
      const spacesStore = useSpacesStore();
      
      if (!reservationsStore.reservations || reservationsStore.reservations.length === 0) {
        console.log('⚠️ Nenhuma reserva encontrada no store central.');
        this.appointments = []; // Limpa a agenda se não houver reservas
        return;
      }

      const mappedAppointments = reservationsStore.reservations.map(reservation => {
        const space = spacesStore.getSpaceById(reservation.spaceId);
        const status = reservation.status || 'Pendente';
        // Mapear status para formato do técnico
        let technicianStatus = status.toLowerCase();
        if (status === 'Aprovada' || status === 'Confirmada') {
          technicianStatus = 'confirmado';
        } else if (status === 'Cancelada' || status === 'Rejeitada') {
          technicianStatus = 'cancelado';
        } else if (status === 'Pendente') {
          technicianStatus = 'pendente';
        }
        
        const color = this.getStatusColor(technicianStatus);
        
        return {
          id: reservation.id,
          reservationId: reservation.id, // ✅ Referência para updateAppointment
          title: reservation.spaceName,
          date: reservation.date,
          startTime: reservation.startTime,
          endTime: reservation.endTime,
          clientName: reservation.userName,
          clientEmail: reservation.userEmail,
          sport: space ? space.type : 'Desconhecido',
          modality: space ? space.modality : 'Desconhecido',
          status: technicianStatus, // ✅ Status no formato do técnico
          color: color,
          spaceId: reservation.spaceId,
          isUserReservation: true, // ✅ Flag para updateAppointment
          purpose: reservation.purpose || ''
        };
      });

      // A mágica está aqui: substituir completamente o array força a reatividade.
      this.appointments = mappedAppointments;
      
      console.log(`✅ Sincronização concluída. ${this.appointments.length} agendamentos carregados na agenda do técnico.`);
      this.saveToStorage();
    },
    
    // Salvar no localStorage
    saveToStorage() {
      localStorage.setItem('sesi_sports_technician_appointments', JSON.stringify(this.appointments));
      localStorage.setItem('sesi_sports_technician_filters', JSON.stringify(this.filters));
      localStorage.setItem('sesi_sports_technician_settings', JSON.stringify(this.agendaSettings));
    },

    // Função para limpar todos os dados (útil para testes)
    clearAllData() {
      console.log('🗑️ Limpando todos os dados da agenda...');
      
      // Limpar arrays
      this.appointments = [];
      
      // Limpar localStorage
      localStorage.removeItem('sesi_sports_technician_appointments');
      localStorage.removeItem('sesi_sports_technician_filters');
      localStorage.removeItem('sesi_sports_technician_settings');
      
      console.log('✅ Dados da agenda limpos. Total appointments:', this.appointments.length);
    },
    
    // Atualizar agendamento
    updateAppointment(id, updatedData) {
      const index = this.appointments.findIndex(apt => apt.id === id);
      if (index !== -1) {
        const appointment = this.appointments[index];
        const updatedAppointment = { ...appointment, ...updatedData };
        
        // Verificar conflitos apenas se horário foi alterado
        if (updatedData.date || updatedData.startTime || updatedData.endTime) {
          if (this.hasTimeConflict(updatedAppointment)) {
            throw new Error('Conflito de horário detectado');
          }
        }
        
        this.appointments[index] = updatedAppointment;
        this.appointments[index].color = this.getStatusColor(updatedAppointment.status);
        
        // Se for uma reserva de usuário, atualizar também no store de reservas
        if (appointment.isUserReservation && appointment.reservationId) {
          const reservationsStore = useReservationsStore();
          const statusMap = {
            'confirmado': 'Aprovada',
            'cancelado': 'Rejeitada',
            'pendente': 'Pendente'
          };
          
          const newStatus = statusMap[updatedAppointment.status] || updatedAppointment.status;
          reservationsStore.updateReservationStatus(appointment.reservationId, newStatus);
          console.log(`🔄 Status da reserva ${appointment.reservationId} atualizado para: ${newStatus}`);
        }
        
        this.saveToStorage();
        console.log('Agendamento atualizado:', updatedAppointment);
      }
    },
    
    // Remover agendamento
    removeAppointment(id) {
      const index = this.appointments.findIndex(apt => apt.id === id);
      if (index !== -1) {
        this.appointments.splice(index, 1);
        this.saveToStorage();
        console.log('Agendamento removido:', id);
      }
    },
    
    // Atualizar filtros
    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters };
      this.saveToStorage();
    },
    
    // Limpar filtros
    clearFilters() {
      this.filters = {
        date: '',
        startTime: '',
        endTime: '',
        type: '',
        modality: ''
      };
      this.saveToStorage();
    },
    
    // Navegar data
    navigateDate(direction) {
      const currentDate = new Date(this.agendaSettings.currentDate);
      
      switch (direction) {
        case 'prev':
          if (this.agendaSettings.viewMode === 'day') {
            currentDate.setDate(currentDate.getDate() - 1);
          } else if (this.agendaSettings.viewMode === 'week') {
            currentDate.setDate(currentDate.getDate() - 7);
          } else if (this.agendaSettings.viewMode === 'month') {
            currentDate.setMonth(currentDate.getMonth() - 1);
          }
          break;
        case 'next':
          if (this.agendaSettings.viewMode === 'day') {
            currentDate.setDate(currentDate.getDate() + 1);
          } else if (this.agendaSettings.viewMode === 'week') {
            currentDate.setDate(currentDate.getDate() + 7);
          } else if (this.agendaSettings.viewMode === 'month') {
            currentDate.setMonth(currentDate.getMonth() + 1);
          }
          break;
        case 'today':
          currentDate.setTime(new Date().getTime());
          break;
      }
      
      this.agendaSettings.currentDate = currentDate.toISOString().split('T')[0];
      this.saveToStorage();
    },

    // Navegar diretamente para uma data específica
    navigateToDate(dateString) {
      if (dateString) {
        this.agendaSettings.currentDate = dateString;
        this.saveToStorage();
      }
    },
    
    // Alterar modo de visualização
    setViewMode(mode) {
      this.agendaSettings.viewMode = mode;
      this.saveToStorage();
    },
    
    // Definir data atual
    setCurrentDate(date) {
      this.agendaSettings.currentDate = date;
      this.saveToStorage();
    },
    
    // Obter cor baseada no status
    getStatusColor(status) {
      const colors = {
        'confirmado': '#10B981', // verde
        'pendente': '#F59E0B',   // amarelo
        'cancelado': '#EF4444',  // vermelho
        'em_andamento': '#3B82F6' // azul
      };
      return colors[status] || '#6B7280'; // cinza como fallback
    },
    
    // Formatar data para exibição
    formatDate(date) {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      
      // Evitar problema de timezone
      if (date.includes('-')) {
        const parts = date.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Mês no JS é 0-indexed
        const day = parseInt(parts[2]);
        const localDate = new Date(year, month, day);
        return localDate.toLocaleDateString('pt-BR', options);
      }
      
      return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', options);
    },
    
    // Formatar horário
    formatTime(time) {
      return time.substring(0, 5); // Remove segundos se houver
    }
  }
});
