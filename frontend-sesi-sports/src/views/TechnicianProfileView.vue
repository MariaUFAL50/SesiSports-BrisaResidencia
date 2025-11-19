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
      <div class="flex items-center gap-3">
        <!-- Profile Icon -->
        <button class="profile-btn active">
          <i class="pi pi-user"></i>
        </button>
        <!-- Auth Button -->
        <button
          class="header-btn logout-btn"
          @click="handleLogout"
        >
          Sair
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <div class="profile-container">
          <!-- Left Sidebar Navigation -->
          <div class="sidebar">
            <nav class="sidebar-nav">
              <button 
                :class="['nav-item', { active: activeTab === 'agenda' }]"
                @click="activeTab = 'agenda'"
              >
                Agenda
              </button>
              <button 
                :class="['nav-item', { active: activeTab === 'cadastro' }]"
                @click="activeTab = 'cadastro'"
              >
                Cadastro
              </button>
              <button 
                :class="['nav-item', { active: activeTab === 'dashboard' }]"
                @click="activeTab = 'dashboard'"
              >
                Dashboard
              </button>
              <!-- Botão Painel Administrativo: aparece apenas para admin -->
              <button 
                v-if="isAdmin"
                class="nav-item admin-panel-btn"
                @click="goToAdminPanel"
              >
                <i class="pi pi-shield"></i>
                Painel Admin
              </button>
            </nav>
          </div>

          <!-- Content Area -->
          <div class="content-area">
            <!-- Agenda Tab -->
            <div v-if="activeTab === 'agenda'" class="agenda-content">
              <!-- Agenda Header -->
              <div class="agenda-header">
                <div class="date-navigation">
                  <button @click="navigateDate('prev')" class="nav-date-btn">
                    <i class="pi pi-chevron-left"></i>
                  </button>
                  <h2 class="current-date">{{ formattedCurrentDate }}</h2>
                  <button @click="navigateDate('next')" class="nav-date-btn">
                    <i class="pi pi-chevron-right"></i>
                  </button>
                </div>
                
                <div class="agenda-actions">
                  <button @click="navigateDate('today')" class="today-btn">
                    Hoje
                  </button>
                  <button @click="openNewAppointmentModal" class="new-appointment-btn">
                    <i class="pi pi-plus"></i>
                    Novo Agendamento
                  </button>
                </div>
              </div>

              <!-- Filters -->
              <div class="filters-section">
                <div class="filters-row">
                  <div class="filter-group">
                    <label>Data</label>
                    <input 
                      type="date" 
                      v-model="technicianStore.filters.date"
                      class="filter-input"
                    />
                  </div>
                  <div class="filter-group">
                    <label>Hr Início</label>
                    <select v-model="technicianStore.filters.startTime" class="filter-input">
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
                  <div class="filter-group">
                    <label>Hr Fim</label>
                    <select 
                      v-model="technicianStore.filters.endTime" 
                      class="filter-input"
                      :disabled="!technicianStore.filters.startTime"
                    >
                      <option value="">Selecione horário</option>
                      <option 
                        v-for="time in availableEndTimesAgenda" 
                        :key="time" 
                        :value="time"
                      >
                        {{ time }}
                      </option>
                    </select>
                  </div>
                  <div class="filter-group">
                    <label>Tipo</label>
                    <select v-model="technicianStore.filters.type" class="filter-input">
                      <option value="">Tipo</option>
                      <option 
                        v-for="type in spacesStore.availableTypes" 
                        :key="type" 
                        :value="type"
                      >
                        {{ type }}
                      </option>
                    </select>
                  </div>
                  <div class="filter-group">
                    <label>Modalidade</label>
                    <select v-model="technicianStore.filters.modality" class="filter-input">
                      <option value="">Modalidade</option>
                      <option 
                        v-for="modality in spacesStore.availableModalities" 
                        :key="modality" 
                        :value="modality"
                      >
                        {{ modality }}
                      </option>
                    </select>
                  </div>
                  <div class="filter-buttons">
                    <button @click="applyFilters" class="filter-btn">
                      Filtrar
                    </button>
                    <button @click="clearAllFilters" class="filter-btn clear-btn">
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              </div>

              <!-- View Mode Buttons -->
              <div class="view-mode-section">
                <div class="view-mode-buttons">
                  <button 
                    :class="['view-mode-btn', { active: technicianStore.agendaSettings.viewMode === 'day' }]"
                    @click="setViewMode('day')"
                  >
                    Dia
                  </button>
                  <button 
                    :class="['view-mode-btn', { active: technicianStore.agendaSettings.viewMode === 'week' }]"
                    @click="setViewMode('week')"
                  >
                    Semana
                  </button>
                  <button 
                    :class="['view-mode-btn', { active: technicianStore.agendaSettings.viewMode === 'month' }]"
                    @click="setViewMode('month')"
                  >
                    Mês
                  </button>
                </div>
              </div>

              <!-- Calendar View -->
              <div class="calendar-container">
                <!-- Week View -->
                <div v-if="technicianStore.agendaSettings.viewMode === 'week'" class="week-view">
                  <div class="week-header">
                    <div class="time-column-header"></div>
                    <div 
                      v-for="day in weekDays" 
                      :key="day.date"
                      class="day-header"
                      :class="{ today: isToday(day.date) }"
                    >
                      <div class="day-name">{{ day.name }}</div>
                      <div class="day-number">{{ day.number }}</div>
                    </div>
                  </div>
                  
                  <div class="week-body">
                    <div class="time-slots">
                      <div 
                        v-for="hour in timeSlots" 
                        :key="hour"
                        class="time-slot"
                      >
                        <span class="time-label">{{ hour }}</span>
                      </div>
                    </div>
                    
                    <div class="days-grid">
                      <div 
                        v-for="day in weekDays" 
                        :key="day.date"
                        class="day-column"
                      >
                        <div 
                          v-for="hour in timeSlots" 
                          :key="`${day.date}-${hour}`"
                          class="time-cell"
                        >
                          <!-- Appointments for this time slot -->
                          <div 
                            v-for="appointment in getAppointmentsForTimeSlot(day.date, hour)" 
                            :key="appointment.id"
                            class="appointment-card"
                            :style="{ backgroundColor: appointment.color }"
                            @click="showAppointmentDetails(appointment)"
                          >
                            <div class="appointment-time">
                              {{ appointment.startTime }} - {{ appointment.endTime }}
                            </div>
                            <div class="appointment-client">{{ appointment.clientName }}</div>
                            <div class="appointment-sport">{{ appointment.sport }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Day View -->
                <div v-else-if="technicianStore.agendaSettings.viewMode === 'day'" class="day-view">
                  <div class="day-appointments">
                    <div 
                      v-for="hour in timeSlots" 
                      :key="hour"
                      class="hour-slot"
                    >
                      <div class="hour-label">{{ hour }}</div>
                      <div class="hour-content">
                        <div 
                          v-for="appointment in getAppointmentsForTimeSlot(technicianStore.agendaSettings.currentDate, hour)" 
                          :key="appointment.id"
                          class="appointment-item"
                          :style="{ borderLeftColor: appointment.color }"
                          @click="showAppointmentDetails(appointment)"
                        >
                          <div class="appointment-header">
                            <span class="appointment-time">
                              {{ appointment.startTime }} - {{ appointment.endTime }}
                            </span>
                            <span class="appointment-status" :class="appointment.status">
                              {{ appointment.status }}
                            </span>
                          </div>
                          <div class="appointment-info">
                            <div class="client-name">{{ appointment.clientName }}</div>
                            <div class="sport-info">{{ appointment.sport }} - {{ appointment.modality }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Month View -->
                <div v-else-if="technicianStore.agendaSettings.viewMode === 'month'" class="month-view">
                  <div class="month-navigation">
                    <button @click="previousMonth" class="nav-button">
                      <i class="pi pi-chevron-left"></i>
                    </button>
                    <h3 class="month-title">{{ currentMonthName }} {{ currentYear }}</h3>
                    <button @click="nextMonth" class="nav-button">
                      <i class="pi pi-chevron-right"></i>
                    </button>
                  </div>
                  
                  <div class="calendar-grid">
                    <div class="calendar-header">
                      <div class="day-header">Dom</div>
                      <div class="day-header">Seg</div>
                      <div class="day-header">Ter</div>
                      <div class="day-header">Qua</div>
                      <div class="day-header">Qui</div>
                      <div class="day-header">Sex</div>
                      <div class="day-header">Sáb</div>
                    </div>
                    
                    <div class="calendar-body">
                      <div 
                        v-for="day in calendarDays" 
                        :key="day.date"
                        :class="[
                          'calendar-day',
                          { 
                            'other-month': !day.isCurrentMonth,
                            'today': day.isToday,
                            'has-appointments': day.appointments.length > 0
                          }
                        ]"
                        @click="selectDay(day)"
                      >
                        <div class="day-number">{{ day.day }}</div>
                        <div class="appointments-indicator" v-if="day.appointments.length > 0">
                          <div 
                            v-for="appointment in day.appointments.slice(0, 3)" 
                            :key="appointment.id"
                            class="appointment-dot"
                            :style="{ backgroundColor: appointment.color || '#3B82F6' }"
                          ></div>
                          <div v-if="day.appointments.length > 3" class="more-indicator">
                            +{{ day.appointments.length - 3 }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Selected Day Details -->
                  <div v-if="selectedDayWithFilteredAppointments" class="selected-day-details">
                    <h4>{{ formatSelectedDay(selectedDayWithFilteredAppointments) }}</h4>
                    <div v-if="selectedDayWithFilteredAppointments.appointments.length > 0" class="day-appointments">
                      <div 
                        v-for="appointment in selectedDayWithFilteredAppointments.appointments" 
                        :key="appointment.id"
                        class="appointment-item"
                      >
                        <div class="appointment-time">{{ appointment.time }}</div>
                        <div class="appointment-info">
                          <div class="appointment-title">{{ appointment.title }}</div>
                          <div class="appointment-client">{{ appointment.client }}</div>
                        </div>
                        <div class="appointment-status" :class="appointment.status">
                          {{ getStatusText(appointment.status) }}
                        </div>
                      </div>
                    </div>
                    <div v-else class="no-appointments">
                      Nenhum compromisso para este dia
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cadastro Tab -->
            <div v-else-if="activeTab === 'cadastro'" class="cadastro-content">
              <!-- Header with + Novo button -->
              <div class="cadastro-header">
                <div class="header-info">
                  <h2 class="tab-title">Espaços</h2>
                  <div class="filters-row">
                    <div class="filter-group">
                      <select v-model="spacesStore.filters.type" class="filter-select">
                        <option value="">Tipo</option>
                        <option 
                          v-for="type in spacesStore.availableTypes" 
                          :key="type" 
                          :value="type"
                        >
                          {{ type }}
                        </option>
                      </select>
                    </div>
                    <div class="filter-group">
                      <select v-model="spacesStore.filters.modality" class="filter-select">
                        <option value="">Modalidade</option>
                        <option 
                          v-for="modality in spacesStore.availableModalities" 
                          :key="modality" 
                          :value="modality"
                        >
                          {{ modality }}
                        </option>
                      </select>
                    </div>
                    <button @click="applyFilters" class="filter-btn">
                      Filtrar
                    </button>
                  </div>
                </div>
                <button @click="showNewSpaceModal = true" class="new-space-btn">
                  <i class="pi pi-plus"></i>
                  Novo
                </button>
              </div>

              <!-- Spaces Grid -->
              <div class="spaces-grid">
                <div 
                  v-for="space in spacesStore.paginatedSpaces" 
                  :key="space.id"
                  class="space-card"
                  @click="editSpace(space)"
                >
                  <div class="space-image">
                    <img 
                      :src="space.photos?.[0] || '/placeholder-space.jpg'" 
                      :alt="space.name"
                      @error="handleImageError"
                    />
                  </div>
                  <div class="space-info">
                    <h3 class="space-name">{{ space.name }}</h3>
                    <p class="space-address">{{ space.address }}</p>
                    <div class="space-details">
                      <span class="space-type">{{ space.type }}</span>
                      <span class="space-price">{{ spacesStore.formatPrice(space.hourlyRate) }}/h</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="spacesStore.filteredSpaces.length === 0" class="empty-state">
                <i class="pi pi-home"></i>
                <h3>Nenhum espaço encontrado</h3>
                <p>Cadastre seu primeiro espaço esportivo</p>
                <button @click="showNewSpaceModal = true" class="new-space-btn">
                  <i class="pi pi-plus"></i>
                  Cadastrar Espaço
                </button>
              </div>
            </div>

            <!-- Dashboard Tab -->
            <div v-else-if="activeTab === 'dashboard'" class="tab-content">
              <h2 class="dashboard-title">Dashboard</h2>
              
              <!-- Metrics Cards -->
              <div class="dashboard-metrics">
                <div class="metric-card metric-agendas">
                  <div class="metric-icon">
                    <i class="pi pi-calendar"></i>
                  </div>
                  <div class="metric-content">
                    <div class="metric-number">148</div>
                    <div class="metric-label">Agendas</div>
                  </div>
                </div>
                
                <div class="metric-card metric-competicoes">
                  <div class="metric-icon">
                    <i class="pi pi-trophy"></i>
                  </div>
                  <div class="metric-content">
                    <div class="metric-number">03</div>
                    <div class="metric-label">Competições</div>
                  </div>
                </div>
                
                <div class="metric-card metric-matriculas">
                  <div class="metric-icon">
                    <i class="pi pi-users"></i>
                  </div>
                  <div class="metric-content">
                    <div class="metric-number">220</div>
                    <div class="metric-label">Matrículas</div>
                  </div>
                </div>
              </div>

              <!-- Dashboard Section Title -->
              <div class="dashboard-section-title">
                <h3>Dashboard</h3>
              </div>

              <!-- Charts Section -->
              <div class="dashboard-charts">
                <!-- Monthly Tracking Chart -->
                <div class="chart-container chart-monthly">
                  <h4 class="chart-title">Acompanhamento Mensal</h4>
                  <div class="chart-content">
                    <Chart type="bar" :data="monthlyChartData" :options="monthlyChartOptions" class="h-[30rem]" />
                  </div>
                </div>

                <!-- Annual Tracking Chart -->
                <div class="chart-container chart-annual">
                  <h4 class="chart-title">Acompanhamento Anual</h4>
                  <div class="chart-content">
                    <Chart type="line" :data="annualChartData" :options="annualChartOptions" class="h-[30rem]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- New Appointment Modal -->
    <div v-if="showNewAppointmentModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Novo Agendamento</h3>
          <button @click="closeModal" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="submitNewAppointment" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nome do Cliente</label>
              <input 
                type="text" 
                v-model="newAppointment.clientName" 
                class="form-input"
                placeholder="Nome completo do cliente"
                required 
              />
            </div>
            <div class="form-group">
              <label>Email do Cliente</label>
              <input 
                type="email" 
                v-model="newAppointment.clientEmail" 
                class="form-input"
                placeholder="email@exemplo.com"
                required 
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Data</label>
              <input 
                type="date" 
                v-model="newAppointment.date" 
                :min="getTodayString()"
                class="form-input"
                required 
              />
            </div>
            <div class="form-group">
              <label>Horário Início</label>
              <select 
                v-model="newAppointment.startTime" 
                class="form-input"
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
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Horário Fim</label>
              <select 
                v-model="newAppointment.endTime" 
                class="form-input"
                :disabled="!newAppointment.startTime"
                required 
              >
                <option value="">{{ newAppointment.startTime ? 'Selecione horário' : 'Primeiro selecione horário de início' }}</option>
                <option 
                  v-for="time in availableEndTimesAppointment" 
                  :key="time" 
                  :value="time"
                >
                  {{ time }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Tipo</label>
              <select v-model="newAppointment.sport" class="form-input" required>
                <option value="">Selecione</option>
                <option 
                  v-for="type in spacesStore.availableTypes" 
                  :key="type" 
                  :value="type"
                >
                  {{ type }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Modalidade</label>
              <select v-model="newAppointment.modality" class="form-input" required>
                <option value="">Selecione</option>
                <option 
                  v-for="modality in spacesStore.availableModalities" 
                  :key="modality" 
                  :value="modality"
                >
                  {{ modality }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">
              Cancelar
            </button>
            <button type="submit" class="submit-btn">
              Salvar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Appointment Details Modal -->
    <div v-if="showAppointmentDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Detalhes do Agendamento</h3>
          <button @click="closeDetailsModal" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="appointment-details" v-if="selectedAppointment">
          <div class="detail-row">
            <label>Cliente:</label>
            <span>{{ selectedAppointment.clientName }}</span>
          </div>
          <div class="detail-row">
            <label>Email:</label>
            <span>{{ selectedAppointment.clientEmail }}</span>
          </div>
          <div class="detail-row">
            <label>Data:</label>
            <span>{{ formatDisplayDate(selectedAppointment.date) }}</span>
          </div>
          <div class="detail-row">
            <label>Horário:</label>
            <span>{{ selectedAppointment.startTime }} - {{ selectedAppointment.endTime }}</span>
          </div>
          <div class="detail-row">
            <label>Esporte:</label>
            <span>{{ selectedAppointment.sport }}</span>
          </div>
          <div class="detail-row">
            <label>Modalidade:</label>
            <span>{{ selectedAppointment.modality }}</span>
          </div>
          <div class="detail-row">
            <label>Status:</label>
            <span class="status-badge" :class="selectedAppointment.status">
              {{ selectedAppointment.status }}
            </span>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="closeDetailsModal" class="cancel-btn">
            Fechar
          </button>
          <button 
            v-if="selectedAppointment?.status === 'pendente'"
            @click="confirmAppointment"
            class="confirm-btn"
          >
            Confirmar
          </button>
          <button 
            v-if="selectedAppointment?.status !== 'cancelado'"
            @click="cancelAppointment"
            class="delete-btn"
            title="Cancelar agendamento"
          >
            Cancelar Agendamento
          </button>
        </div>
      </div>
    </div>

    <!-- New Space Modal -->
    <div v-if="showNewSpaceModal" class="modal-overlay" @click="closeSpaceModal">
      <div class="modal-content space-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingSpace ? 'Editar Espaço' : 'Novo Espaço' }}</h3>
          <button @click="closeSpaceModal" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <!-- Step Indicator -->
        <div class="step-indicator">
          <div class="step-progress">
            <div class="progress-text">O formulário possui 2 etapas.</div>
          </div>
          <div class="steps">
            <div :class="['step', { active: currentStep === 1 }]">
              <span class="step-number">1</span>
              <span class="step-label">Etapa 1</span>
            </div>
            <div :class="['step', { active: currentStep === 2 }]">
              <span class="step-number">2</span>
              <span class="step-label">Etapa 2</span>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitSpace" class="space-form">
          <!-- Step 1: Basic Information -->
          <div v-if="currentStep === 1" class="step-content">
            <div class="form-row">
              <div class="form-group full-width">
                <label>Nome do Espaço</label>
                <input 
                  type="text" 
                  v-model="spaceForm.name" 
                  class="form-input"
                  placeholder="Digite o nome do espaço"
                  required 
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label>Descrição</label>
                <textarea 
                  v-model="spaceForm.description" 
                  class="form-textarea"
                  placeholder="Descreva o espaço, suas características, equipamentos disponíveis, etc."
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>CEP</label>
                <input
                  type="text"
                  v-model="spaceForm.cep"
      class="form-input"
      placeholder="Digite o CEP"
      maxlength="9"
      required
    />
  </div>
  <div class="form-group">
    <label>Rua</label>
    <input
      type="text"
      v-model="spaceForm.street"
      class="form-input"
      placeholder="Digite o nome da rua"
      required
    />
  </div>
</div>
<div class="form-row">
  <div class="form-group">
    <label>Número</label>
    <input
      type="text"
      v-model="spaceForm.number"
      class="form-input"
      placeholder="Digite o número"
      required
    />
  </div>
  <div class="form-group">
    <label>Complemento <span style="color:#6B7280;font-weight:400">(opcional)</span></label>
    <input
      type="text"
      v-model="spaceForm.complement"
      class="form-input"
      placeholder="Apartamento, bloco, etc."
    />
  </div>
</div>

            <div class="form-row">
              <div class="form-group full-width">
                <label>Valor por Hora</label>
                <input 
                  type="number" 
                  v-model="spaceForm.hourlyRate" 
                  class="form-input"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  required 
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Tipo</label>
                <select v-model="spaceForm.type" class="form-input" required>
                  <option value="">Selecione</option>
                  <option 
                    v-for="type in spacesStore.availableTypes" 
                    :key="type" 
                    :value="type"
                  >
                    {{ type }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Modalidade</label>
                <select v-model="spaceForm.modality" class="form-input" required>
                  <option value="">Selecione</option>
                  <option 
                    v-for="modality in spacesStore.availableModalities" 
                    :key="modality" 
                    :value="modality"
                  >
                    {{ modality }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Situação</label>
                <select v-model="spaceForm.status" class="form-input" required>
                  <option value="">Selecione</option>
                  <option value="Disponível">Disponível</option>
                  <option value="Ocupado">Ocupado</option>
                  <option value="Manutenção">Manutenção</option>
                </select>
              </div>
            </div>

            <!-- Recurrence Toggle -->
            <div class="form-row">
              <div class="form-group full-width">
                <div class="toggle-container">
                  <label class="toggle-label">Recorrência</label>
                  <div class="toggle-switch">
                    <input 
                      type="checkbox" 
                      id="recurrence-toggle"
                      v-model="spaceForm.recurrence.enabled"
                      class="toggle-input"
                    />
                    <label for="recurrence-toggle" class="toggle-slider"></label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recurrence Settings -->
            <div v-if="spaceForm.recurrence.enabled" class="recurrence-section">
              <div class="form-row">
                <div class="form-group">
                  <label>Dias</label>
                  <select v-model="spaceForm.recurrence.days" class="form-input" multiple>
                    <option value="Seg a Sex">Seg a Sex</option>
                    <option value="Sab a Dom">Sab a Dom</option>
                    <option value="Todos">Todos os dias</option>
                  </select>
                </div>
              </div>
              <div class="form-row">

              </div>
            </div>
          </div>

          <!-- Step 2: Benefits and Photos -->
          <div v-if="currentStep === 2" class="step-content">
            <div class="form-row">
              <div class="form-group full-width">
                <label>Benefícios*</label>
                <div class="benefits-grid">
                  <label v-for="benefit in availableBenefits" :key="benefit" class="benefit-item">
                    <input 
                      type="checkbox" 
                      :value="benefit"
                      v-model="spaceForm.benefits"
                      class="benefit-checkbox"
                    />
                    <span class="benefit-label">{{ benefit }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label>Clique para adicionar fotos <span class="file-info">(PNG, JPG e JPEG)</span></label>
                <div class="photo-upload-area" @click="triggerFileInput">
                  <div class="upload-icon">
                    <i class="pi pi-image"></i>
                  </div>
                  <p>Clique para selecionar fotos</p>
                  <input 
                    ref="fileInput"
                    type="file" 
                    multiple 
                    accept="image/*"
                    @change="handleFileUpload"
                    style="display: none"
                  />
                </div>
                <div v-if="spaceForm.photos.length > 0" class="uploaded-photos">
                  <div v-for="(photo, index) in spaceForm.photos" :key="index" class="photo-preview">
                    <img :src="photo" :alt="`Foto ${index + 1}`" />
                    <button type="button" @click="removePhoto(index)" class="remove-photo">
                      <i class="pi pi-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="modal-actions">
            <button 
              v-if="currentStep > 1" 
              type="button" 
              @click="previousStep" 
              class="secondary-btn"
            >
              Voltar
            </button>
            <button type="button" @click="closeSpaceModal" class="cancel-btn">
              Cancelar
            </button>
            <button 
              v-if="currentStep < 2" 
              type="button" 
              @click="nextStep" 
              class="primary-btn"
            >
              Próximo
            </button>
            <button 
              v-else 
              type="submit" 
              class="primary-btn"
            >
              {{ editingSpace ? 'Atualizar' : 'Finalizar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content success-modal" @click.stop>
        <div class="success-content">
          <div class="success-icon">
            <i class="pi pi-check"></i>
          </div>
          <h3>Cadastro feito com sucesso!</h3>
          <button @click="closeSuccessModal" class="success-btn">
            Ok
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watchEffect, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTechnicianStore } from '../stores/technician.js';
import { useSpacesStore } from '../stores/spaces.js';
import { useAuthStore } from '../stores/auth.js';
import { useReservationsStore } from '../stores/reservations.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import Chart from 'primevue/chart';
import Button from 'primevue/button';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const router = useRouter();
const technicianStore = useTechnicianStore();
const spacesStore = useSpacesStore();
const authStore = useAuthStore();
const reservationsStore = useReservationsStore();

// Reactive data
const activeTab = ref('agenda');
const showNewAppointmentModal = ref(false);
const showAppointmentDetailsModal = ref(false);
const selectedAppointment = ref(null);


const annualChart = ref(null);
const chartData = ref(null);
const chartOptions = ref(null);

// Month view variables
const selectedDay = ref(null);

// Computed property para selectedDay que reage aos filtros
const selectedDayWithFilteredAppointments = computed(() => {
  if (!selectedDay.value) return null;
  
  // Recriar o selectedDay com agendamentos filtrados
  const dayAppointments = technicianStore.filteredAppointments.filter(apt => {
    const aptDate = new Date(apt.date + 'T12:00:00');
    const selectedDate = new Date(selectedDay.value.date + 'T12:00:00');
    return aptDate.toDateString() === selectedDate.toDateString();
  });
  
  return {
    ...selectedDay.value,
    appointments: dayAppointments.map(apt => ({
      id: apt.id,
      time: apt.startTime,
      title: apt.title || `${apt.type} - ${apt.modality}`,
      client: apt.clientName,
      status: apt.status,
      color: apt.color
    }))
  };
});
const currentMonthDate = ref(new Date());

// Chart data refs
const monthlyChartData = ref(null);
const monthlyChartOptions = ref(null);
const annualChartData = ref(null);
const annualChartOptions = ref(null);

// Space management
const showNewSpaceModal = ref(false);
const showSuccessModal = ref(false);
const editingSpace = ref(null);
const currentStep = ref(1);
const fileInput = ref(null);

// Available benefits for spaces
const availableBenefits = [
  'Acessível', 'Bolas', 'Lanchonete', 'Piso antiderrapante',
  'Arquibancada', 'Cobertura', 'Vestiário', 'Lanchonete'
];

// Form data for new space
const spaceForm = ref({
  name: '',
  description: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  hourlyRate: 0,
  type: '',
  modality: '',
  status: 'Disponível',
  recurrence: {
    enabled: false,
    days: [],
    startTime: '08:00',
    endTime: '18:00'
  },
  benefits: [],
  photos: []
});

// Form data for new appointment
const newAppointment = ref({
  clientName: '',
  clientEmail: '',
  date: '',
  startTime: '',
  endTime: '',
  sport: '',
  modality: ''
});

// Computed properties
const technicianProfile = computed(() => technicianStore.technicianProfile);

const formattedCurrentDate = computed(() => {
  return technicianStore.formatDate(technicianStore.agendaSettings.currentDate);
});

// Computed para verificar se o usuário logado é admin
const isAdmin = computed(() => authStore.isAdmin);

const weekDays = computed(() => {
  const currentDate = new Date(technicianStore.agendaSettings.currentDate);
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    
    days.push({
      date: formatDateToString(date),
      name: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      number: date.getDate()
    });
  }
  
  return days;
});

const timeSlots = computed(() => {
  const slots = [];
  for (let hour = 6; hour <= 22; hour++) {
    slots.push(hour.toString().padStart(2, '0') + ':00');
  }
  return slots;
});

// Dashboard stats
const totalAppointments = computed(() => technicianStore.appointments.length);
const confirmedAppointments = computed(() => 
  technicianStore.appointments.filter(apt => apt.status === 'confirmado').length
);
const pendingAppointments = computed(() => 
  technicianStore.appointments.filter(apt => apt.status === 'pendente').length
);
const cancelledAppointments = computed(() => 
  technicianStore.appointments.filter(apt => apt.status === 'cancelado').length
);

// Computed para horários disponíveis no agendamento (igual ao da HomeView)
const availableEndTimesAppointment = computed(() => {
  if (!newAppointment.value.startTime) return [];
  
  const allTimes = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
                   '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', 
                   '19:00', '20:00', '21:00', '22:00', '23:00'];
  
  const startIndex = allTimes.findIndex(time => time === newAppointment.value.startTime);
  return startIndex !== -1 ? allTimes.slice(startIndex + 1) : [];
});

// Computed para horários disponíveis nos filtros da agenda
const availableEndTimesAgenda = computed(() => {
  if (!technicianStore.filters.startTime) return [];
  
  const allTimes = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
                   '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', 
                   '19:00', '20:00', '21:00', '22:00', '23:00'];
  
  const startIndex = allTimes.findIndex(time => time === technicianStore.filters.startTime);
  return startIndex !== -1 ? allTimes.slice(startIndex + 1) : [];
});

// Month view computed properties
const currentMonthName = computed(() => {
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return months[currentMonthDate.value.getMonth()];
});

const currentYear = computed(() => currentMonthDate.value.getFullYear());

const calendarDays = computed(() => {
  const year = currentMonthDate.value.getFullYear();
  const month = currentMonthDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstCalendarDay = new Date(firstDay);
  
  // Start from Sunday
  firstCalendarDay.setDate(firstDay.getDate() - firstDay.getDay());
  
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
    const currentDate = new Date(firstCalendarDay);
    currentDate.setDate(firstCalendarDay.getDate() + i);
    
    const dayAppointments = technicianStore.filteredAppointments.filter(apt => {
      const aptDate = new Date(apt.date + 'T12:00:00');
      return aptDate.toDateString() === currentDate.toDateString();
    });
    
    days.push({
      date: formatDateToString(currentDate),
      day: currentDate.getDate(),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: currentDate.toDateString() === today.toDateString(),
      appointments: dayAppointments.map(apt => ({
        id: apt.id,
        time: apt.startTime,
        title: apt.title || `${apt.type} - ${apt.modality}`,
        client: apt.clientName,
        color: apt.color || '#3B82F6',
        status: apt.status
      }))
    });
  }
  
  return days;
});

// Watcher para monitorar mudanças na data do formulário
watch(() => newAppointment.value.date, (newDate, oldDate) => {
  if (newDate !== oldDate) {
    console.log('📅 Data do formulário mudou:', {
      anterior: oldDate,
      nova: newDate,
      dataAtual: getTodayString()
    });
  }
});

// Watcher para limpar horário de fim quando horário de início da agenda mudar
watch(() => technicianStore.filters.startTime, (newStartTime) => {
  if (!newStartTime) {
    technicianStore.filters.endTime = '';
  }
});

// Watcher para navegação automática quando data do filtro mudar
watch(() => technicianStore.filters.date, (newDate) => {
  if (newDate) {
    // Usar a função do store para navegar
    technicianStore.navigateToDate(newDate);
    
    // Atualizar também o currentMonthDate para o modo mês
    const selectedDate = new Date(newDate + 'T12:00:00');
    currentMonthDate.value = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  }
});

// Watcher para limpar endTime no formulário de agendamento quando startTime mudar
watch(() => newAppointment.value.startTime, (newStartTime, oldStartTime) => {
  // Só limpar se houve uma mudança real no valor
  if (oldStartTime && newStartTime !== oldStartTime) {
    newAppointment.value.endTime = '';
  }
  // Se startTime foi limpo, também limpar endTime
  if (!newStartTime && oldStartTime) {
    newAppointment.value.endTime = '';
  }
});

const setChartData = () => {
  const currentYear = new Date().getFullYear();
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const appointmentsByMonth = months.map((_, index) => {
    const monthAppointments = technicianStore.appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.getFullYear() === currentYear && aptDate.getMonth() === index;
    });
    return monthAppointments.length;
  });

  const spacesByMonth = months.map(() => Math.floor(Math.random() * 10) + 5);

  return {
    labels: months,
    datasets: [
      {
        label: 'Agendamentos',
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        data: appointmentsByMonth.length > 0 ? appointmentsByMonth : [15, 25, 30, 20, 35, 28, 40, 38, 32, 45, 30, 42]
      },
      {
        label: 'Espaços Cadastrados',
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        data: spacesByMonth
      }
    ]
  };
};

const setChartOptions = () => {
  return {
    indexAxis: 'y',
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#6B7280',
          font: {
            weight: 500,
            size: 11
          }
        },
        grid: {
          display: false,
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        },
        grid: {
          color: '#E5E7EB',
          drawBorder: false
        }
      }
    },
    responsive: true
  };
};

const initializeChart = () => {
  if (annualChart.value) {
    const ctx = annualChart.value.getContext('2d');
    
    if (window.annualChartInstance) {
      window.annualChartInstance.destroy();
    }
    
    window.annualChartInstance = new ChartJS(ctx, {
      type: 'bar',
      data: setChartData(),
      options: setChartOptions()
    });
  }
};

// Methods
const goBack = () => {
  router.push('/');
};

const goToAdminPanel = () => {
  router.push('/admin');
};

const handleLogout = () => {
  router.push('/');
};

const navigateDate = (direction) => {
  technicianStore.navigateDate(direction);
};

const setViewMode = (mode) => {
  technicianStore.setViewMode(mode);
};

const clearFilters = () => {
  technicianStore.clearFilters();
};

const clearAllFilters = () => {
  console.log('🧹 Limpando todos os filtros para mostrar todos os agendamentos');
  technicianStore.clearFilters();
  alert('Filtros limpos! Mostrando todos os agendamentos.');
};

const isToday = (date) => {
  const today = new Date();
  const todayString = today.getFullYear() + '-' + 
                      String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(today.getDate()).padStart(2, '0');
  return date === todayString;
};

const getTodayString = () => {
  const today = new Date();
  return today.getFullYear() + '-' + 
         String(today.getMonth() + 1).padStart(2, '0') + '-' + 
         String(today.getDate()).padStart(2, '0');
};

// Função helper para formatação consistente de datas
const formatDateToString = (date) => {
  return date.getFullYear() + '-' + 
         String(date.getMonth() + 1).padStart(2, '0') + '-' + 
         String(date.getDate()).padStart(2, '0');
};

const openNewAppointmentModal = () => {
  resetNewAppointmentForm();
  const todayString = getTodayString();
  console.log('🗓️ Abrindo modal - data de hoje calculada:', todayString);
  newAppointment.value.date = todayString; // Inicializar com a data de hoje
  console.log('🗓️ Data definida no formulário:', newAppointment.value.date);
  showNewAppointmentModal.value = true;
};

const getAppointmentsForTimeSlot = (date, hour) => {
  const appointments = technicianStore.filteredAppointments.filter(apt => {
    if (apt.date !== date) return false;
    
    const appointmentHour = parseInt(apt.startTime.split(':')[0]);
    const slotHour = parseInt(hour.split(':')[0]);
    
    return appointmentHour === slotHour;
  });
  
  return appointments;
};

const showAppointmentDetails = (appointment) => {
  selectedAppointment.value = appointment;
  showAppointmentDetailsModal.value = true;
};

const closeModal = () => {
  showNewAppointmentModal.value = false;
  resetNewAppointmentForm();
};

const closeDetailsModal = () => {
  showAppointmentDetailsModal.value = false;
  selectedAppointment.value = null;
};

// Month view functions
const previousMonth = () => {
  currentMonthDate.value = new Date(currentMonthDate.value.getFullYear(), currentMonthDate.value.getMonth() - 1, 1);
  selectedDay.value = null;
};

const nextMonth = () => {
  currentMonthDate.value = new Date(currentMonthDate.value.getFullYear(), currentMonthDate.value.getMonth() + 1, 1);
  selectedDay.value = null;
};

const selectDay = (day) => {
  console.log('📅 Selecionando dia:', day);
  console.log('📅 Data do dia selecionado:', day.date);
  selectedDay.value = day;
};

const formatSelectedDay = (day) => {
  const date = new Date(day.date);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('pt-BR', options);
};

const getStatusText = (status) => {
  const statusMap = {
    'confirmado': 'Confirmado',
    'pendente': 'Pendente',
    'cancelado': 'Cancelado'
  };
  return statusMap[status] || status;
};

const resetNewAppointmentForm = () => {
  const currentDate = newAppointment.value.date; // Preservar data se já foi definida
  newAppointment.value = {
    clientName: '',
    clientEmail: '',
    date: currentDate || '',
    startTime: '',
    endTime: '',
    sport: '',
    modality: ''
  };
};

const submitNewAppointment = () => {
  console.log('🔄 Criando novo agendamento via painel do técnico...');

  // Validação dos campos
  if (!newAppointment.value.clientName || !newAppointment.value.clientEmail || 
      !newAppointment.value.date || !newAppointment.value.startTime || 
      !newAppointment.value.endTime || !newAppointment.value.sport || 
      !newAppointment.value.modality) {
    alert('Por favor, preencha todos os campos obrigatórios!');
    return;
  }

  try {
    // 1. Encontrar o ID do espaço correspondente
    const space = spacesStore.findSpaceByTypeAndModality(
      newAppointment.value.sport, 
      newAppointment.value.modality
    );

    if (!space) {
      alert(`Não foi encontrado um espaço para o tipo "${newAppointment.value.sport}" e modalidade "${newAppointment.value.modality}".`);
      return;
    }

    // 2. Montar o objeto da reserva no formato correto para o reservationsStore
    const reservationData = {
      spaceId: space.id,
      spaceName: space.name,
      date: newAppointment.value.date,
      startTime: newAppointment.value.startTime,
      endTime: newAppointment.value.endTime,
      userId: 'technician-created', // ID para identificar que foi criado pelo técnico
      userName: newAppointment.value.clientName,
      userEmail: newAppointment.value.clientEmail,
      purpose: 'Agendamento manual pelo técnico',
      paymentMethod: 'N/A',
      status: 'Aprovada' // Agendamentos do técnico já entram como aprovados
    };
    
    console.log('� Dados da reserva a serem enviados para o store central:', reservationData);

    // 3. Adicionar a reserva à store CENTRAL
    const newReservation = reservationsStore.addReservation(reservationData);
    console.log('✅ Reserva adicionada com sucesso ao store central:', newReservation);

    // 4. Disparar o evento global para notificar todas as partes da aplicação (inclusive a própria agenda)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('newReservationAdded', {
        detail: { 
          reservation: newReservation,
          action: 'created_by_technician'
        }
      }));
      console.log('📢 Evento global "newReservationAdded" disparado pelo técnico!');
    }
    
    closeModal();
    alert('Agendamento criado com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao criar agendamento pelo técnico:', error);
    alert(error.message);
  }
};

const confirmAppointment = () => {
  if (selectedAppointment.value) {
    technicianStore.updateAppointment(selectedAppointment.value.id, { status: 'confirmado' });
    closeDetailsModal();
    alert('✅ Agendamento confirmado com sucesso!');
  }
};

const cancelAppointment = () => {
  if (!selectedAppointment.value) return;
  
  // ADMIN: Cancelamento livre (sem restrições de tempo)
  // TODO: Na área do cliente, implementar validação de 48h de antecedência
  
  /* Código para uso futuro na área do cliente:
  const appointmentDate = new Date(selectedAppointment.value.date + 'T' + selectedAppointment.value.startTime);
  const now = new Date();
  const timeDifference = appointmentDate.getTime() - now.getTime();
  const hoursUntilAppointment = timeDifference / (1000 * 3600);
  
  if (hoursUntilAppointment < 48) {
    const remainingHours = Math.max(0, Math.round(hoursUntilAppointment));
    alert(`❌ Cancelamento não permitido!\n\nRegra: É necessário pelo menos 48 horas de antecedência.\n\nTempo restante: ${remainingHours} horas`);
    return;
  }
  */
  
  if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
    technicianStore.updateAppointment(selectedAppointment.value.id, { status: 'cancelado' });
    closeDetailsModal();
    alert('✅ Agendamento cancelado com sucesso!');
  }
};

const formatDisplayDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

// Função para verificar se o cancelamento é permitido (48h de antecedência)
const isCancellationAllowed = (appointment) => {
  // No TechnicianProfileView (admin), sempre permitir cancelamento
  // Esta função será reutilizada na área do cliente com as regras completas
  return true;
  
  // Código para uso futuro na área do cliente:
  // if (!appointment) return false;
  // const appointmentDate = new Date(appointment.date + 'T' + appointment.startTime);
  // const now = new Date();
  // const timeDifference = appointmentDate.getTime() - now.getTime();
  // const hoursUntilAppointment = timeDifference / (1000 * 3600);
  // return hoursUntilAppointment >= 48;
};

// Space management methods
const applyFilters = () => {
  // Os filtros da agenda são aplicados automaticamente via computed properties
  // Só precisamos salvar no localStorage
  technicianStore.saveToStorage();
  console.log('✅ Filtros da agenda aplicados:', technicianStore.filters);
};

const editSpace = (space) => {
  console.log('🔧 TechnicianProfile: Preparando edição do espaço:', space);
  
  editingSpace.value = space;
  currentStep.value = 1;
  
  // Dividir endereço completo nos campos separados
  const addressParts = space.address ? space.address.split(', ') : [];
  const street = addressParts[0] || '';
  const number = addressParts[1] || '';
  const complement = addressParts[2] || '';
  
  // Populate form with existing data
  spaceForm.value = {
    name: space.name || '',
    cep: space.cep || '',
    street: street,
    number: number,
    complement: complement,
    hourlyRate: space.hourlyRate || 0,
    type: space.type || '',
    modality: space.modality || '',
    status: space.status || 'Disponível',
    description: space.description || '',
    recurrence: space.recurrence ? { ...space.recurrence } : {
      enabled: false,
      days: [],
      startTime: '08:00',
      endTime: '18:00'
    },
    benefits: space.benefits ? [...space.benefits] : [],
    photos: space.photos ? [...space.photos] : []
  };
  
  console.log('📋 Formulário preenchido para edição:', spaceForm.value);
  showNewSpaceModal.value = true;
};

const closeSpaceModal = () => {
  showNewSpaceModal.value = false;
  editingSpace.value = null;
  currentStep.value = 1;
  resetSpaceForm();
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
};

const resetSpaceForm = () => {
  spaceForm.value = {
    name: '',
    description: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    hourlyRate: 0,
    type: '',
    modality: '',
    status: 'Disponível',
    recurrence: {
      enabled: false,
      days: [],
      startTime: '08:00',
      endTime: '18:00'
    },
    benefits: [],
    photos: []
  };
};

const nextStep = () => {
  if (currentStep.value < 2) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        spaceForm.value.photos.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
};

const removePhoto = (index) => {
  spaceForm.value.photos.splice(index, 1);
};

const handleImageError = (event) => {
  event.target.src = '/placeholder-space.jpg';
};

const submitSpace = () => {
  try {
    console.log('🔧 TechnicianProfile: Enviando espaço');
    console.log('📋 Dados do formulário:', spaceForm.value);
    
    // Construir endereço completo a partir dos campos separados
    const addressParts = [
      spaceForm.value.street,
      spaceForm.value.number,
      spaceForm.value.complement
    ].filter(part => part && part.trim()); // Remove partes vazias
    
    const fullAddress = addressParts.join(', ');
    
    // Preparar dados para o store
    const formData = {
      name: spaceForm.value.name,
      type: spaceForm.value.type,
      modality: spaceForm.value.modality,
      hourlyRate: parseFloat(spaceForm.value.hourlyRate) || 0,
      address: fullAddress, // Endereço completo construído
      status: spaceForm.value.status,
      description: spaceForm.value.description || '',
      recurrence: spaceForm.value.recurrence,
      benefits: spaceForm.value.benefits,
      photos: spaceForm.value.photos.length > 0 ? spaceForm.value.photos : [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop'
      ]
    };
    
    console.log('📊 Dados preparados para o store:', formData);
    
    // Validação básica
    if (!formData.name?.trim()) {
      alert('Nome do espaço é obrigatório!');
      return;
    }
    
    if (!formData.address?.trim()) {
      alert('Endereço completo é obrigatório (rua e número)!');
      return;
    }
    
    if (editingSpace.value) {
      // Update existing space
      console.log('🔄 Atualizando espaço existente ID:', editingSpace.value.id);
      const success = spacesStore.updateSpace(editingSpace.value.id, formData);
      if (success) {
        console.log('✅ Espaço atualizado com sucesso!');
      }
    } else {
      // Add new space
      console.log('➕ Criando novo espaço');
      const newSpace = spacesStore.addSpace(formData);
      if (newSpace) {
        console.log('✅ Espaço criado com sucesso!');
      }
    }
    
    closeSpaceModal();
    showSuccessModal.value = true;
    
  } catch (error) {
    console.error('❌ Erro ao salvar espaço:', error);
    alert('Erro ao salvar espaço: ' + error.message);
  }
};

// Initialize Chart.js data
const initializeChartData = () => {
  // Monthly chart data
  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const monthlyData = months.map((_, index) => {
    const monthAppointments = technicianStore.appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.getFullYear() === currentYear && aptDate.getMonth() === index;
    });
    return monthAppointments.length;
  });

  monthlyChartData.value = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    datasets: [
      {
        label: 'Agendamentos',
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        data: monthlyData.length > 0 ? monthlyData : [65, 59, 80, 81, 56, 55, 40, 38, 32, 45, 30, 42]
      },
      {
        label: 'Espaços Cadastrados',
        backgroundColor: '#6B7280',
        borderColor: '#6B7280',
        data: [28, 48, 40, 19, 86, 27, 90, 35, 22, 40, 35, 50]
      }
    ]
  };

  monthlyChartOptions.value = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: '#374151',
          font: { size: 12 }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#6B7280',
          font: {
            weight: 500
          }
        },
        grid: {
          display: false,
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: '#6B7280'
        },
        grid: {
          color: '#E5E7EB',
          drawBorder: false
        }
      }
    }
  };

  // Annual chart data
  const years = [currentYear - 2, currentYear - 1, currentYear];
  const annualData = years.map(year => {
    const yearAppointments = technicianStore.appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.getFullYear() === year;
    });
    return yearAppointments.length;
  });

  annualChartData.value = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    datasets: [
      {
        label: 'Agendamentos',
        fill: false,
        borderColor: '#3B82F6',
        yAxisID: 'y',
        tension: 0.4,
        data: annualData.length > 0 ? annualData.slice(0, 12) : [65, 59, 80, 81, 56, 55, 40, 70, 85, 90, 75, 60]
      },
      {
        label: 'Receita (R$)',
        fill: false,
        borderColor: '#6B7280',
        yAxisID: 'y1',
        tension: 0.4,
        data: [2800, 4800, 4000, 1900, 8600, 2700, 9000, 3500, 4200, 5000, 4500, 5500]
      }
    ]
  };

  annualChartOptions.value = {
    stacked: false,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: '#374151'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#6B7280'
        },
        grid: {
          color: '#E5E7EB'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: '#6B7280'
        },
        grid: {
          color: '#E5E7EB'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          color: '#6B7280'
        },
        grid: {
          drawOnChartArea: false,
          color: '#E5E7EB'
        }
      }
    }
  };
};

onMounted(() => {
  // Inicializar store de reservas PRIMEIRO para garantir que dados estejam disponíveis
  const reservationsStore = useReservationsStore();
  reservationsStore.initializeReservations();
  
  // Depois inicializar technician store (que vai sincronizar com as reservas)
  technicianStore.initializeTechnician();
  spacesStore.initializeSpaces();
  
  // Forçar sincronização após todas as inicializações
  setTimeout(() => {
    console.log('🔄 Forçando sincronização após inicializações...');
    technicianStore.syncUserReservations();
  }, 100);
  
  // Initialize chart data
  initializeChartData();
  
  nextTick(() => {
    initializeChart();
  });
  
  // Sincronização automática a cada 30 segundos para capturar novas reservas
  const syncInterval = setInterval(() => {
    technicianStore.syncUserReservations();
  }, 30000);
  
  // Listener para novas reservas
  const handleNewReservation = (event) => {
    console.log('📢 Nova reserva detectada pelo técnico:', event.detail.reservation);
    technicianStore.syncUserReservations();
  };

  // Listener para reservas atualizadas
  const handleReservationUpdate = (event) => {
    console.log('📢 Reserva atualizada detectada pelo técnico:', event.detail.reservation);
    technicianStore.syncUserReservations();
  };
  
  window.addEventListener('newReservationAdded', handleNewReservation);
  window.addEventListener('reservationUpdated', handleReservationUpdate);
  
  // Armazenar o interval e listeners para limpeza
  window.technicianSyncInterval = syncInterval;
  window.newReservationListener = handleNewReservation;
  window.reservationUpdateListener = handleReservationUpdate;
});

onBeforeUnmount(() => {
  if (window.annualChartInstance) {
    window.annualChartInstance.destroy();
  }
  
  // Limpar interval de sincronização
  if (window.technicianSyncInterval) {
    clearInterval(window.technicianSyncInterval);
  }
  
  // Limpar listeners de eventos
  if (window.newReservationListener) {
    window.removeEventListener('newReservationAdded', window.newReservationListener);
  }
  
  if (window.reservationUpdateListener) {
    window.removeEventListener('reservationUpdated', window.reservationUpdateListener);
  }
});

watchEffect(() => {
  if (technicianStore.appointments && annualChart.value) {
    nextTick(() => {
      if (window.annualChartInstance) {
        window.annualChartInstance.data = setChartData();
        window.annualChartInstance.update();
      } else {
        initializeChart();
      }
    });
  }
});
</script>

<style scoped>
/* Base styles similar to ProfileView */
.profile-container {
  display: flex;
  gap: 2rem;
  min-height: 600px;
}

.sidebar {
  flex: 0 0 200px;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  text-align: left;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6B7280;
  font-weight: 500;
}

.nav-item:hover {
  background: #F3F4F6;
  color: #374151;
}

.nav-item.active {
  background: #1E40AF;
  color: white;
}

/* Botão especial para painel administrativo */
.admin-panel-btn {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
  color: white !important;
  font-weight: 600 !important;
  border: 2px solid #dc2626 !important;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  position: relative;
  overflow: hidden;
}

.admin-panel-btn:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.admin-panel-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.admin-panel-btn:hover::before {
  left: 100%;
}

.admin-panel-btn i {
  font-size: 16px;
  color: #fbbf24;
}

.content-area {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Agenda specific styles */
.agenda-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #E5E7EB;
}

.date-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-date-btn {
  background: #F3F4F6;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.nav-date-btn:hover {
  background: #E5E7EB;
}

.current-date {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.agenda-actions {
  display: flex;
  gap: 1rem;
}

.today-btn {
  background: #6B7280;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.today-btn:hover {
  background: #4B5563;
}

.new-appointment-btn {
  background: #1E40AF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s ease;
}

.new-appointment-btn:hover {
  background: #1D4ED8;
}

/* Filters */
.filters-section {
  margin-bottom: 2rem;
}

.filters-row {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-input {
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
}

.filter-btn:hover {
  background: #059669;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.clear-btn {
  background: #6B7280 !important;
}

.clear-btn:hover {
  background: #4B5563 !important;
}

/* View Mode */
.view-mode-section {
  margin-bottom: 2rem;
}

.view-mode-buttons {
  display: flex;
  gap: 0.5rem;
}

.view-mode-btn {
  background: #F3F4F6;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.view-mode-btn:hover {
  background: #E5E7EB;
}

.view-mode-btn.active {
  background: #1E40AF;
  color: white;
}

/* Calendar */
.calendar-container {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
}

/* Week View */
.week-header {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
}

.time-column-header {
  padding: 1rem 0.5rem;
  border-right: 1px solid #E5E7EB;
}

.day-header {
  padding: 1rem 0.5rem;
  text-align: center;
  border-right: 1px solid #E5E7EB;
}

.day-header.today {
  background: #EFF6FF;
  color: #1E40AF;
}

.day-name {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.day-number {
  font-size: 1.25rem;
  font-weight: 600;
}

.week-body {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
}

.time-slots {
  border-right: 1px solid #E5E7EB;
}

.time-slot {
  height: 60px;
  padding: 0.5rem;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  align-items: flex-start;
}

.time-label {
  font-size: 0.75rem;
  color: #6B7280;
}

.days-grid {
  display: contents;
}

.day-column {
  border-right: 1px solid #E5E7EB;
}

.time-cell {
  height: 60px;
  border-bottom: 1px solid #E5E7EB;
  position: relative;
  padding: 2px;
}

.appointment-card {
  background: #10B981;
  color: white;
  border-radius: 4px;
  padding: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  overflow: hidden;
  position: absolute;
  left: 2px;
  right: 2px;
  top: 2px;
  z-index: 1;
}

.appointment-time {
  font-weight: 600;
  margin-bottom: 0.125rem;
}

.appointment-client {
  margin-bottom: 0.125rem;
}

.appointment-sport {
  font-size: 0.625rem;
  opacity: 0.9;
}

/* Day View */
.day-view {
  max-height: 600px;
  overflow-y: auto;
}

.hour-slot {
  display: flex;
  border-bottom: 1px solid #E5E7EB;
  min-height: 60px;
}

.hour-label {
  flex: 0 0 80px;
  padding: 0.5rem;
  font-size: 0.75rem;
  color: #6B7280;
  border-right: 1px solid #E5E7EB;
}

.hour-content {
  flex: 1;
  padding: 0.25rem;
}

.appointment-item {
  background: white;
  border: 1px solid #E5E7EB;
  border-left: 4px solid #10B981;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: shadow 0.2s ease;
}

.appointment-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.appointment-time {
  font-weight: 600;
  color: #1F2937;
}

.appointment-status {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.appointment-status.confirmado {
  background: #D1FAE5;
  color: #065F46;
}

.appointment-status.pendente {
  background: #FEF3C7;
  color: #92400E;
}

.appointment-status.cancelado {
  background: #FEE2E2;
  color: #991B1B;
}

.client-name {
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 0.25rem;
}

.sport-info {
  font-size: 0.875rem;
  color: #6B7280;
}

/* Tab Content */
.tab-content {
  padding: 1rem 0;
}

.tab-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 1.5rem;
}

.form-section {
  background: #F9FAFB;
  border-radius: 8px;
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

.form-input:read-only {
  background: #F3F4F6;
  color: #6B7280;
}

.form-textarea {
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.form-textarea:focus {
  outline: none;
  border-color: #1E40AF;
}

.specialties-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.specialty-tag {
  background: #1E40AF;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;
}

/* Dashboard */
.dashboard-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 2rem;
}

.dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.metric-agendas .metric-icon {
  background: #3B82F6;
}

.metric-competicoes .metric-icon {
  background: #F59E0B;
}

.metric-matriculas .metric-icon {
  background: #10B981;
}

.metric-content {
  flex: 1;
}

.metric-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1F2937;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 1rem;
  color: #6B7280;
  font-weight: 500;
}

.dashboard-section-title {
  margin-bottom: 2rem;
}

.dashboard-section-title h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
}

.dashboard-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.chart-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.annual-chart-canvas {
  width: 100% !important;
  height: 300px !important;
  display: block;
  margin: 0 auto;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 1.5rem;
}

.chart-content {
  position: relative;
}

/* Monthly Bar Chart */
.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 200px;
  padding: 0 1rem;
  margin-bottom: 1rem;
}

.bar-group {
  display: flex;
  align-items: end;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}

.bar {
  width: 20px;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
}

.bar:nth-child(odd) {
  background: #3B82F6;
}

.bar:nth-child(even) {
  background: #93C5FD;
}

.bar:hover {
  opacity: 0.8;
  transform: scaleY(1.05);
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  font-size: 0.875rem;
  color: #6B7280;
}

/* Annual Line Chart */
.line-chart {
  height: 200px;
  margin-bottom: 1rem;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.annual-labels {
  justify-content: space-around;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-charts {
    grid-template-columns: 1fr;
  }
  
  .dashboard-metrics {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-metrics {
    grid-template-columns: 1fr;
  }

  .metric-card {
    padding: 1.5rem;
    gap: 1rem;
  }
  
  .metric-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .metric-number {
    font-size: 2rem;
  }
  
  .chart-container {
    padding: 1.5rem;
  }
  
  .bar-group {
    gap: 4px;
  }
  
  .bar {
    width: 16px;
  }
  
  .chart-labels {
    font-size: 0.75rem;
  }
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

.modal-form {
  padding: 1.5rem;
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

.submit-btn {
  background: #1E40AF;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.submit-btn:hover {
  background: #1D4ED8;
}

.confirm-btn {
  background: #10B981;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.confirm-btn:hover {
  background: #059669;
}

.delete-btn {
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.delete-btn:hover {
  background: #DC2626;
}

/* Appointment Details */
.appointment-details {
  padding: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #F3F4F6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row label {
  font-weight: 500;
  color: #374151;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Header styles */
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

.profile-btn {
  background: #1E40AF;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.logout-btn {
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.logout-btn:hover {
  background: #DC2626;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }
  
  .sidebar {
    flex: none;
  }
  
  .sidebar-nav {
    flex-direction: row;
    justify-content: space-around;
  }
  
  .agenda-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filters-row {
    flex-direction: column;
  }
  
  .week-header,
  .week-body {
    grid-template-columns: 60px repeat(7, 1fr);
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Cadastro de Espaços Styles */
.cadastro-content {
  padding: 1rem 0;
}

.cadastro-header {
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

.filters-row {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-select {
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  padding: 0.5rem;
  font-size: 0.875rem;
  min-width: 120px;
}

.new-space-btn {
  background: #1E40AF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s ease;
  font-weight: 500;
}

.new-space-btn:hover {
  background: #1D4ED8;
}

/* Spaces Grid */
.spaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.space-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.space-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.space-image {
  width: 100%;
  height: 180px;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.space-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.space-info {
  padding: 1rem;
}

.space-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.5rem 0;
}

.space-address {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0 0 0.75rem 0;
}

.space-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.space-type {
  background: #E5E7EB;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
}

.space-price {
  font-weight: 600;
  color: #1E40AF;
}

/* Empty State */
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

/* Space Modal */
.space-modal {
  max-width: 800px;
  width: 95%;
  max-height: 90vh;
}

.step-indicator {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #E5E7EB;
  background: #F9FAFB;
}

.progress-text {
  font-size: 0.875rem;
  color: #6B7280;
  margin-bottom: 1rem;
}

.steps {
  display: flex;
  gap: 2rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #E5E7EB;
  color: #6B7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.step.active .step-number {
  background: #1E40AF;
  color: white;
}

.step-label {
  font-size: 0.875rem;
  color: #6B7280;
}

.step.active .step-label {
  color: #1E40AF;
  font-weight: 500;
}

/* Space Form */
.space-form {
  padding: 1.5rem;
}

.step-content {
  margin-bottom: 1.5rem;
}

.full-width {
  width: 100%;
}

/* Toggle Switch */
.toggle-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #F9FAFB;
  border-radius: 8px;
}

.toggle-label {
  font-weight: 500;
  color: #374151;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #D1D5DB;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-input:checked + .toggle-slider {
  background-color: #1E40AF;
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

/* Recurrence Section */
.recurrence-section {
  background: #F0F9FF;
  border: 1px solid #BAE6FD;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

/* Benefits Grid */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.benefit-item:hover {
  background: #F3F4F6;
}

.benefit-checkbox {
  width: 16px;
  height: 16px;
}

.benefit-label {
  font-size: 0.875rem;
  color: #374151;
}

/* Photo Upload */
.photo-upload-area {
  border: 2px dashed #D1D5DB;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.photo-upload-area:hover {
  border-color: #1E40AF;
  background: #F0F9FF;
}

.upload-icon {
  font-size: 2rem;
  color: #9CA3AF;
  margin-bottom: 0.5rem;
}

.file-info {
  color: #6B7280;
  font-size: 0.75rem;
}

.uploaded-photos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}

.photo-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
}

/* Modal Actions */
.secondary-btn {
  background: #6B7280;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.secondary-btn:hover {
  background: #4B5563;
}

.primary-btn {
  background: #1E40AF;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.primary-btn:hover {
  background: #1D4ED8;
}

/* Success Modal */
.success-modal {
  max-width: 400px;
  text-align: center;
}

.success-content {
  padding: 2rem;
}

.success-icon {
  background: #10B981;
  color: white;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem auto;
}

.success-modal h3 {
  color: #1F2937;
  margin: 0 0 2rem 0;
  font-size: 1.25rem;
}

.success-btn {
  background: #10B981;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 2rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
}

.success-btn:hover {
  background: #059669;
}

/* Responsive for Space Management */
@media (max-width: 768px) {
  .cadastro-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .spaces-grid {
    grid-template-columns: 1fr;
  }
  
  .space-modal {
    width: 98%;
    margin: 1vh auto;
  }
  
  .steps {
    justify-content: center;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  
  .uploaded-photos {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Month View Styles */
.month-view {
  padding: 1rem;
}

.month-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
}

.month-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.nav-button {
  background: #F3F4F6;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #6B7280;
}

.nav-button:hover {
  background: #E5E7EB;
  color: #374151;
}

.calendar-grid {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
}

.calendar-header .day-header {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: #6B7280;
  font-size: 0.875rem;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  min-height: 120px;
  border-right: 1px solid #E5E7EB;
  border-bottom: 1px solid #E5E7EB;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.calendar-day:hover {
  background: #F9FAFB;
}

.calendar-day.other-month {
  background: #F9FAFB;
  color: #9CA3AF;
}

.calendar-day.today {
  background: #EBF8FF;
}

.calendar-day.has-appointments {
  background: #F0FDF4;
}

.day-number {
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 0.5rem;
}

.calendar-day.other-month .day-number {
  color: #9CA3AF;
}

.calendar-day.today .day-number {
  color: #1D4ED8;
  background: #3B82F6;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.appointments-indicator {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.appointment-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3B82F6;
}

.more-indicator {
  font-size: 0.625rem;
  color: #6B7280;
  font-weight: 500;
}

.selected-day-details {
  margin-top: 2rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.selected-day-details h4 {
  margin: 0 0 1rem 0;
  color: #1F2937;
  font-size: 1.125rem;
  font-weight: 600;
}

.day-appointments {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.selected-day-details .appointment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #F9FAFB;
  border-radius: 8px;
  border-left: 4px solid #3B82F6;
}

.selected-day-details .appointment-time {
  font-weight: 600;
  color: #1F2937;
  min-width: 80px;
  font-size: 0.875rem;
}

.selected-day-details .appointment-info {
  flex: 1;
}

.selected-day-details .appointment-title {
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 0.25rem;
}

.selected-day-details .appointment-client {
  color: #6B7280;
  font-size: 0.875rem;
}

.selected-day-details .appointment-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.no-appointments {
  color: #6B7280;
  font-style: italic;
  text-align: center;
  padding: 2rem;
}

/* Estilos para informações de cancelamento */
.cancellation-info {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #E5E7EB;
}

.cancellation-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #FEF3C7;
  border: 1px solid #F59E0B;
  border-radius: 8px;
  color: #92400E;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.cancellation-warning i {
  color: #F59E0B;
  font-size: 1rem;
}

/* Estilos para botão desabilitado */
.delete-btn.disabled {
  background-color: #9CA3AF !important;
  color: #6B7280 !important;
  cursor: not-allowed !important;
  border-color: #9CA3AF !important;
}

.delete-btn.disabled:hover {
  background-color: #9CA3AF !important;
  transform: none !important;
  box-shadow: none !important;
}
</style>

<!--
DOCUMENTAÇÃO DE REGRAS DE CANCELAMENTO:

ADMIN (TechnicianProfileView):
- Pode cancelar agendamentos a qualquer momento
- Sem restrições de tempo
- Interface adaptada para mostrar privilégios de admin

CLIENTE (MyReservationsView ou área do cliente):
- Aplicar regra de 48h de antecedência para cancelamento
- Implementar validação na função isCancellationAllowed()
- Mostrar mensagens de erro apropriadas
- Código de referência está comentado nas funções deste arquivo

IMPLEMENTAÇÃO FUTURA:
1. Criar/adaptar página de reservas do cliente
2. Copiar a lógica comentada das funções isCancellationAllowed e cancelAppointment
3. Remover os comentários e ativar as validações
4. Adaptar mensagens de erro para o contexto do cliente
-->