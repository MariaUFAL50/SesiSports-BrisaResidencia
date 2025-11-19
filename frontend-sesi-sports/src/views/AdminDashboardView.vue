<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <!-- Back Button -->
        <Button
          icon="pi pi-chevron-left"
          class="back-btn"
          @click="goHome"
        />
        <img src="/sesi-sports-logo.png" alt="SESI Sports Logo" class="h-8" />
      </div>
      <div class="flex items-center gap-3">
        <!-- Notifications -->
        <div class="relative">
          <button 
            @click="toggleNotifications"
            class="notification-btn"
            :class="{ 'has-unread': unreadNotifications > 0 }"
          >
            <i class="pi pi-bell text-lg"></i>
            <span v-if="unreadNotifications > 0" class="notification-badge">
              {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
            </span>
          </button>
          
          <!-- Notifications Dropdown -->
          <div v-if="showNotifications" class="notifications-dropdown">
            <div class="notifications-header">
              <h3>Notificações</h3>
              <button @click="markAllAsRead" class="mark-all-read">
                Marcar todas como lida
              </button>
            </div>
            
            <div class="notifications-list">
              <div 
                v-for="notification in recentNotifications" 
                :key="notification.id"
                :class="['notification-item', { unread: !notification.read }]"
                @click="markAsRead(notification)"
              >
                <div :class="['notification-icon', notification.type]">
                  <i :class="getNotificationIcon(notification.type)"></i>
                </div>
                <div class="notification-content">
                  <p class="notification-message">{{ notification.message }}</p>
                  <span class="notification-time">{{ formatTime(notification.time) }}</span>
                </div>
              </div>
            </div>
            
            <div class="notifications-footer">
              <button @click="goToAllNotifications" class="view-all-btn">
                Ver todas as notificações
              </button>
            </div>
          </div>
        </div>

        <!-- Profile Icon -->
        <button class="profile-btn active">
          <i class="pi pi-shield text-gray-600"></i>
        </button>
        
        <!-- User Info & Logout -->
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-700">{{ authStore.currentUser?.name }}</span>
        </div>
        <button
          class="header-btn logout-btn"
          @click="logout"
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
            <div class="admin-profile-header">
              <div class="admin-avatar">
                <i class="pi pi-shield text-2xl text-gray-600"></i>
              </div>
              <div class="admin-info">
                <h3 class="admin-name">{{ authStore.currentUser?.name }}</h3>
                <p class="admin-role">Administrador</p>
              </div>
            </div>
            
            <nav class="sidebar-nav">
              <button 
                :class="['nav-item', { active: activeSection === 'overview' }]"
                @click="activeSection = 'overview'"
              >
                <i class="pi pi-home"></i>
                Visão Geral
              </button>
              <button 
                :class="['nav-item', { active: activeSection === 'users' }]"
                @click="activeSection = 'users'"
              >
                <i class="pi pi-users"></i>
                Usuários
              </button>
              <button 
                :class="['nav-item', { active: activeSection === 'spaces' }]"
                @click="activeSection = 'spaces'"
              >
                <i class="pi pi-building"></i>
                Espaços
              </button>
              <button 
                :class="['nav-item', { active: activeSection === 'reservations' }]"
                @click="activeSection = 'reservations'"
              >
                <i class="pi pi-calendar"></i>
                Reservas
              </button>
              <button 
                :class="['nav-item', { active: activeSection === 'dashboard' }]"
                @click="activeSection = 'dashboard'"
              >
                <i class="pi pi-chart-line"></i>
                Dashboard
              </button>
              <button 
                :class="['nav-item', { active: activeSection === 'reports' }]"
                @click="activeSection = 'reports'"
              >
                <i class="pi pi-file-text"></i>
                Relatórios
              </button>
              <button 
                :class="['nav-item', { active: activeSection === 'finance' }]"
                @click="activeSection = 'finance'"
              >
                <i class="pi pi-dollar"></i>
                Financeiro
              </button>
              <button 
                :class="['nav-item', { active: activeSection === 'settings' }]"
                @click="activeSection = 'settings'"
                disabled
              >
                <i class="pi pi-cog"></i>
                Configurações
              </button>
            </nav>
          </div>

          <!-- Right Content Area -->
          <div class="content-area">
            <!-- Overview Section -->
            <div v-if="activeSection === 'overview'" class="overview-content">
              <!-- Mini Header -->
              <div class="mini-header overview-mini-header">
                <div class="mini-header-left">
                  <div class="mini-header-icon">
                    <i class="pi pi-home"></i>
                  </div>
                  <div class="mini-header-info">
                    <h2 class="mini-header-title">Visão Geral</h2>
                    <p class="mini-header-subtitle">Painel administrativo e acesso rápido</p>
                  </div>
                </div>
                <div class="mini-header-actions">
                  <button class="action-btn-mini">
                    <i class="pi pi-refresh"></i>
                    Atualizar
                  </button>
                </div>
              </div>

              <!-- Quick Access Cards -->
              <div class="quick-access-grid">
                <div class="quick-access-card" @click="activeSection = 'users'">
                  <div class="card-icon bg-blue-100">
                    <i class="pi pi-users text-blue-600 text-xl"></i>
                  </div>
                  <div class="card-content">
                    <h3 class="card-title">Gerenciar Usuários</h3>
                    <p class="card-description">Visualize e gerencie todos os usuários</p>
                    <div class="card-stats">
                      <span class="stat-value">{{ totalUsers }}</span>
                      <span class="stat-label">usuários ativos</span>
                    </div>
                  </div>
                  <i class="pi pi-chevron-right text-gray-400"></i>
                </div>

                <div class="quick-access-card" @click="activeSection = 'spaces'">
                  <div class="card-icon bg-green-100">
                    <i class="pi pi-building text-green-600 text-xl"></i>
                  </div>
                  <div class="card-content">
                    <h3 class="card-title">Espaços Esportivos</h3>
                    <p class="card-description">Configure e gerencie espaços</p>
                    <div class="card-stats">
                      <span class="stat-value">{{ totalSpaces }}</span>
                      <span class="stat-label">espaços cadastrados</span>
                    </div>
                  </div>
                  <i class="pi pi-chevron-right text-gray-400"></i>
                </div>

                <div class="quick-access-card" @click="activeSection = 'reservations'">
                  <div class="card-icon bg-gray-100">
                    <i class="pi pi-calendar text-gray-600 text-xl"></i>
                  </div>
                  <div class="card-content">
                    <h3 class="card-title">Reservas</h3>
                    <p class="card-description">Gerencie todas as reservas</p>
                    <div class="card-stats">
                      <span class="stat-value">{{ totalReservations }}</span>
                      <span class="stat-label">reservas hoje</span>
                    </div>
                  </div>
                  <i class="pi pi-chevron-right text-gray-400"></i>
                </div>

                <div class="quick-access-card" @click="activeSection = 'dashboard'">
                  <div class="card-icon bg-red-100">
                    <i class="pi pi-chart-line text-red-600 text-xl"></i>
                  </div>
                  <div class="card-content">
                    <h3 class="card-title">Dashboard Executivo</h3>
                    <p class="card-description">Análises e relatórios</p>
                    <div class="card-stats">
                      <span class="stat-value">{{ monthlyRevenue }}</span>
                      <span class="stat-label">receita mensal</span>
                    </div>
                  </div>
                  <i class="pi pi-chevron-right text-gray-400"></i>
                </div>
              </div>
            </div>

            <!-- Users Section -->
            <div v-else-if="activeSection === 'users'" class="users-content">
              <!-- Mini Header -->
              <div class="mini-header users-mini-header">
                <div class="mini-header-left">
                  <div class="mini-header-icon">
                    <i class="pi pi-users"></i>
                  </div>
                  <div class="mini-header-info">
                    <h2 class="mini-header-title">Gerenciar Usuários</h2>
                    <p class="mini-header-subtitle">Controle total sobre usuários do sistema</p>
                  </div>
                </div>
                <div class="mini-header-stats">
                  <div class="mini-stat">
                    <span class="mini-stat-number">{{ totalUsersCount }}</span>
                    <span class="mini-stat-label">Total</span>
                  </div>
                  <div class="mini-stat">
                    <span class="mini-stat-number">{{ clientUsers }}</span>
                    <span class="mini-stat-label">Clientes</span>
                  </div>
                  <div class="mini-stat">
                    <span class="mini-stat-number">{{ technicianUsers }}</span>
                    <span class="mini-stat-label">Técnicos</span>
                  </div>
                  <div class="mini-stat">
                    <span class="mini-stat-number">{{ adminUsers }}</span>
                    <span class="mini-stat-label">Admins</span>
                  </div>
                </div>
              </div>

              <!-- Header -->
              <div class="usuarios-header">                
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
                  <button @click="showNewUserModal = true" class="primary-btn">
                    <i class="pi pi-plus"></i>
                    Novo Usuário
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
                            @click="openPromoteModal(user)"
                            class="action-btn permissions-btn"
                            title="Alterar tipo de usuário"
                          >
                            <i class="pi pi-shield permissions-icon"></i>
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
              </div>

              <!-- Pagination -->
              <div class="pagination-container">
                <div class="pagination-info">
                  Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} - 
                  {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} 
                  de {{ filteredUsers.length }} usuários
                </div>
                <div class="pagination-controls">
                  <button 
                    @click="currentPage--" 
                    :disabled="currentPage === 1"
                    class="pagination-btn"
                  >
                    <i class="pi pi-chevron-left"></i>
                  </button>
                  <span class="page-indicator">
                    {{ currentPage }} / {{ totalPages }}
                  </span>
                  <button 
                    @click="currentPage++" 
                    :disabled="currentPage === totalPages"
                    class="pagination-btn"
                  >
                    <i class="pi pi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Spaces Section -->
            <div v-else-if="activeSection === 'spaces'" class="spaces-content">
              <!-- Mini Header -->
              <div class="mini-header spaces-mini-header">
                <div class="mini-header-left">
                  <div class="mini-header-icon">
                    <i class="pi pi-building"></i>
                  </div>
                  <div class="mini-header-info">
                    <h2 class="mini-header-title">Gerenciar Espaços</h2>
                    <p class="mini-header-subtitle">Administração completa de espaços esportivos</p>
                  </div>
                </div>
                <div class="mini-header-stats">
                  <div class="mini-stat">
                    <span class="mini-stat-number">{{ allSpaces.length }}</span>
                    <span class="mini-stat-label">Total</span>
                  </div>
                  <div class="mini-stat">
                    <span class="mini-stat-number">{{ allSpaces.filter(s => s.status === 'ativo').length }}</span>
                    <span class="mini-stat-label">Ativos</span>
                  </div>
                  <div class="mini-stat">
                    <span class="mini-stat-number">{{ allSpaces.filter(s => s.status === 'manutencao').length }}</span>
                    <span class="mini-stat-label">Manutenção</span>
                  </div>
                  <div class="mini-stat">
                    <span class="mini-stat-number">{{ allSpaces.filter(s => s.status === 'reservado').length }}</span>
                    <span class="mini-stat-label">Reservados</span>
                  </div>
                </div>
              </div>

              <!-- Filters and Actions -->
              <div class="filters-section modern-filters">
                <div class="filters-card">
                  <div class="filters-header">
                    <h3><i class="pi pi-filter"></i> Filtros</h3>
                    <div class="filters-actions">
                      <button @click="clearSpaceFilters" class="clear-filters-btn">
                        <i class="pi pi-refresh"></i>
                        Limpar
                      </button>
                      <button @click="showNewSpaceModal = true" class="new-space-btn">
                        <i class="pi pi-plus"></i>
                        Novo Espaço
                      </button>
                    </div>
                  </div>
                  <div class="filters-grid">
                    <div class="filter-group">
                      <label><i class="pi pi-info-circle"></i> Status</label>
                      <select v-model="spaceFilters.status" class="filter-select modern-select">
                        <option value="">Todos os status</option>
                        <option value="ativo">✅ Ativo</option>
                        <option value="manutencao">⚠️ Manutenção</option>
                        <option value="inativo">❌ Inativo</option>
                        <option value="reservado">📅 Reservado</option>
                      </select>
                    </div>
                    <div class="filter-group">
                      <label><i class="pi pi-tag"></i> Tipo</label>
                      <select v-model="spaceFilters.type" class="filter-select modern-select">
                        <option value="">Todos os tipos</option>
                        <option value="quadra-futebol">⚽ Quadra de Futebol</option>
                        <option value="quadra-volei">🏐 Quadra de Vôlei</option>
                        <option value="quadra-basquete">🏀 Quadra de Basquete</option>
                        <option value="piscina">🏊 Piscina</option>
                        <option value="academia">💪 Academia</option>
                        <option value="sala-multiuso">🏢 Sala Multiuso</option>
                      </select>
                    </div>
                    <div class="filter-group">
                      <label><i class="pi pi-users"></i> Capacidade</label>
                      <select v-model="spaceFilters.capacity" class="filter-select modern-select">
                        <option value="">Todas as capacidades</option>
                        <option value="pequeno">👥 Pequeno (até 10)</option>
                        <option value="medio">👨‍👩‍👧‍👦 Médio (11-30)</option>
                        <option value="grande">👥👥 Grande (31+)</option>
                      </select>
                    </div>
                    <div class="filter-group">
                      <label><i class="pi pi-search"></i> Buscar</label>
                      <div class="search-input-wrapper">
                        <input 
                          v-model="spaceFilters.search" 
                          type="text" 
                          placeholder="Nome ou descrição..."
                          class="filter-input modern-input"
                        />
                        <i class="pi pi-search search-icon"></i>
                      </div>
                    </div>
                  </div>
                  <div class="filters-actions">
                    <button @click="applySpaceFilters" class="filter-btn modern-filter-btn">
                      <i class="pi pi-search"></i>
                      Aplicar Filtros
                    </button>
                  </div>
                </div>
              </div>

              <!-- Spaces Table -->
              <div class="table-container modern-table-container">
                <div class="table-header modern-table-header">
                  <div class="table-title">
                    <h3><i class="pi pi-list"></i> Lista de Espaços</h3>
                    <span class="result-count">{{ filteredSpaces.length }} resultados</span>
                  </div>
                  <div class="table-actions">
                    <button class="export-btn">
                      <i class="pi pi-download"></i>
                      Exportar
                    </button>
                  </div>
                </div>
                <div class="table-wrapper">
                  <table class="table modern-table">
                    <thead>
                      <tr>
                        <th class="sortable">
                          <i class="pi pi-hashtag"></i>
                          ID
                        </th>
                        <th class="sortable">
                          <i class="pi pi-building"></i>
                          Nome
                        </th>
                        <th class="sortable">
                          <i class="pi pi-tag"></i>
                          Tipo
                        </th>
                        <th class="sortable">
                          <i class="pi pi-users"></i>
                          Capacidade
                        </th>
                        <th class="sortable">
                          <i class="pi pi-info-circle"></i>
                          Status
                        </th>
                        <th class="sortable">
                          <i class="pi pi-dollar"></i>
                          Preço/Hora
                        </th>
                        <th class="actions-header">
                          <i class="pi pi-cog"></i>
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="space in paginatedSpaces" :key="space.id" class="table-row">
                        <td class="table-cell id-cell">
                          <span class="space-id">#{{ space.id }}</span>
                        </td>
                        <td class="table-cell name-cell">
                          <div class="space-info">
                            <div class="space-avatar">
                              <i :class="getSpaceTypeIcon(space.type)"></i>
                            </div>
                            <div class="space-details">
                              <span class="space-name">{{ space.name }}</span>
                              <span class="space-description">{{ space.description }}</span>
                            </div>
                          </div>
                        </td>
                        <td class="table-cell type-cell">
                          <div class="type-info">
                            <span class="type-icon">{{ getSpaceTypeEmoji(space.type) }}</span>
                            <span class="type-name">{{ getSpaceTypeLabel(space.type) }}</span>
                          </div>
                        </td>
                        <td class="table-cell capacity-cell">
                          <div class="capacity-info">
                            <i class="pi pi-users"></i>
                            <span class="capacity-number">{{ space.capacity }}</span>
                            <span class="capacity-label">pessoas</span>
                          </div>
                        </td>
                        <td class="table-cell status-cell">
                          <span :class="['status-badge', 'modern-status', `status-${space.status}`]">
                            <i :class="getSpaceStatusIcon(space.status)"></i>
                            {{ getSpaceStatusLabel(space.status) }}
                          </span>
                        </td>
                        <td class="table-cell price-cell">
                          <span class="price-amount">{{ formatCurrency(space.pricePerHour) }}</span>
                        </td>
                        <td class="actions-cell">
                          <div class="action-buttons modern-actions">
                            <button 
                              @click="editSpace(space)"
                              class="action-btn edit-btn modern-action-btn"
                              title="Editar espaço"
                            >
                              <i class="pi pi-pencil"></i>
                            </button>
                            <button 
                              @click="changeSpaceStatus(space)"
                              class="action-btn status-btn modern-action-btn"
                              title="Alterar status"
                            >
                              <i class="pi pi-refresh"></i>
                            </button>
                            <button 
                              @click="viewSpaceReservations(space)"
                              class="action-btn view-btn modern-action-btn"
                              title="Ver reservas"
                            >
                              <i class="pi pi-calendar"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Pagination -->
                <div class="modern-pagination">
                  <div class="pagination-info">
                    <span class="page-indicator">
                      Mostrando {{ (currentSpacePage - 1) * spacesPerPage + 1 }} - 
                      {{ Math.min(currentSpacePage * spacesPerPage, filteredSpaces.length) }} 
                      de {{ filteredSpaces.length }} espaços
                    </span>
                  </div>
                  <div class="pagination-controls">
                    <button 
                      @click="currentSpacePage--" 
                      :disabled="currentSpacePage === 1"
                      class="pagination-btn"
                    >
                      <i class="pi pi-chevron-left"></i>
                    </button>
                    <span class="page-numbers">
                      <button 
                        v-for="page in spacePageNumbers" 
                        :key="page"
                        @click="currentSpacePage = page"
                        :class="['page-btn', { active: page === currentSpacePage }]"
                      >
                        {{ page }}
                      </button>
                    </span>
                    <button 
                      @click="currentSpacePage++" 
                      :disabled="currentSpacePage === totalSpacePages"
                      class="pagination-btn"
                    >
                      <i class="pi pi-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reservations Section -->
            <div v-else-if="activeSection === 'reservations'" class="reservations-content">
              <!-- Mini Header -->
              <div class="mini-header reservations-mini-header">
                <div class="mini-header-left">
                  <div class="mini-header-icon">
                    <i class="pi pi-calendar"></i>
                  </div>
                  <div class="mini-header-info">
                    <h2 class="mini-header-title">Gerenciamento de Reservas</h2>
                    <p class="mini-header-subtitle">Controle e organização de todas as reservas</p>
                  </div>
                </div>
                <div class="mini-header-actions">
                  <button class="action-btn-mini">
                    <i class="pi pi-plus"></i>
                    Nova Reserva
                  </button>
                </div>
              </div>

              <!-- Stats Cards -->
              <div class="reservation-stats">
                <div class="stat-card stat-card-primary">
                  <div class="stat-icon">
                    <i class="pi pi-clock"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-number">{{ allReservations.filter(r => r.status === 'pendente').length }}</span>
                    <span class="stat-label">Pendentes</span>
                  </div>
                </div>
                <div class="stat-card stat-card-success">
                  <div class="stat-icon">
                    <i class="pi pi-check-circle"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-number">{{ allReservations.filter(r => r.status === 'confirmada').length }}</span>
                    <span class="stat-label">Confirmadas</span>
                  </div>
                </div>
                <div class="stat-card stat-card-info">
                  <div class="stat-icon">
                    <i class="pi pi-calendar-check"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-number">{{ allReservations.filter(r => r.status === 'concluida').length }}</span>
                    <span class="stat-label">Concluídas</span>
                  </div>
                </div>
                <div class="stat-card stat-card-warning">
                  <div class="stat-icon">
                    <i class="pi pi-times-circle"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-number">{{ allReservations.filter(r => r.status === 'cancelada').length }}</span>
                    <span class="stat-label">Canceladas</span>
                  </div>
                </div>
              </div>

              <!-- Filters and Actions -->
              <div class="filters-section modern-filters">
                <div class="filters-card">
                  <div class="filters-header">
                    <h3><i class="pi pi-filter"></i> Filtros</h3>
                    <button @click="clearReservationFilters" class="clear-filters-btn">
                      <i class="pi pi-refresh"></i>
                      Limpar
                    </button>
                  </div>
                  <div class="filters-grid">
                    <div class="filter-group">
                      <label><i class="pi pi-info-circle"></i> Status</label>
                      <select v-model="reservationFilters.status" class="filter-select modern-select">
                        <option value="">Todos os status</option>
                        <option value="confirmada">✅ Confirmada</option>
                        <option value="pendente">⏳ Pendente</option>
                        <option value="cancelada">❌ Cancelada</option>
                        <option value="concluida">✔️ Concluída</option>
                      </select>
                    </div>
                    <div class="filter-group">
                      <label><i class="pi pi-home"></i> Espaço</label>
                      <select v-model="reservationFilters.space" class="filter-select modern-select">
                        <option value="">Todos os espaços</option>
                        <option value="quadra-futebol">⚽ Quadra de Futebol</option>
                        <option value="quadra-volei">🏐 Quadra de Vôlei</option>
                        <option value="piscina">🏊 Piscina</option>
                        <option value="academia">💪 Academia</option>
                      </select>
                    </div>
                    <div class="filter-group">
                      <label><i class="pi pi-calendar"></i> Período</label>
                      <select v-model="reservationFilters.period" class="filter-select modern-select">
                        <option value="">Todos os períodos</option>
                        <option value="hoje">📅 Hoje</option>
                        <option value="semana">📊 Esta semana</option>
                        <option value="mes">📈 Este mês</option>
                      </select>
                    </div>
                    <div class="filter-group">
                      <label><i class="pi pi-search"></i> Buscar</label>
                      <div class="search-input-wrapper">
                        <input 
                          v-model="reservationFilters.search" 
                          type="text" 
                          placeholder="Nome, email ou ID..."
                          class="filter-input modern-input"
                        />
                        <i class="pi pi-search search-icon"></i>
                      </div>
                    </div>
                  </div>
                  <div class="filters-actions">
                    <button @click="applyReservationFilters" class="filter-btn modern-filter-btn">
                      <i class="pi pi-search"></i>
                      Aplicar Filtros
                    </button>
                  </div>
                </div>
              </div>

              <!-- Reservations Table -->
              <div class="table-container modern-table-container">
                <div class="table-header modern-table-header">
                  <div class="table-title">
                    <h3><i class="pi pi-list"></i> Lista de Reservas</h3>
                    <span class="result-count">{{ filteredReservations.length }} resultados</span>
                  </div>
                  <div class="table-actions">
                    <button class="export-btn">
                      <i class="pi pi-download"></i>
                      Exportar
                    </button>
                  </div>
                </div>
                <div class="table-wrapper">
                  <table class="table modern-table">
                    <thead>
                      <tr>
                        <th class="sortable">
                          <i class="pi pi-hashtag"></i>
                          ID
                        </th>
                        <th class="sortable">
                          <i class="pi pi-user"></i>
                          Usuário
                        </th>
                        <th class="sortable">
                          <i class="pi pi-home"></i>
                          Espaço
                        </th>
                        <th class="sortable">
                          <i class="pi pi-calendar"></i>
                          Data
                        </th>
                        <th class="sortable">
                          <i class="pi pi-clock"></i>
                          Horário
                        </th>
                        <th class="sortable">
                          <i class="pi pi-info-circle"></i>
                          Status
                        </th>
                        <th class="sortable">
                          <i class="pi pi-dollar"></i>
                          Valor
                        </th>
                        <th class="actions-header">
                          <i class="pi pi-cog"></i>
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="reservation in paginatedReservations" :key="reservation.id" class="table-row">
                        <td class="table-cell id-cell">
                          <span class="reservation-id">#{{ reservation.id }}</span>
                        </td>
                        <td class="table-cell user-cell">
                          <div class="user-info">
                            <div class="user-avatar">
                              <i class="pi pi-user"></i>
                            </div>
                            <div class="user-details">
                              <span class="user-name">{{ reservation.userName }}</span>
                              <span class="user-email">{{ reservation.userEmail }}</span>
                            </div>
                          </div>
                        </td>
                        <td class="table-cell space-cell">
                          <div class="space-info">
                            <span class="space-icon">{{ getSpaceIcon(reservation.space) }}</span>
                            <span class="space-name">{{ getSpaceLabel(reservation.space) }}</span>
                          </div>
                        </td>
                        <td class="table-cell date-cell">
                          <div class="date-info">
                            <span class="date-display">{{ formatDate(reservation.date) }}</span>
                            <span class="day-name">{{ getDayName(reservation.date) }}</span>
                          </div>
                        </td>
                        <td class="table-cell time-cell">
                          <div class="time-range">
                            <span class="time-start">{{ reservation.startTime }}</span>
                            <i class="pi pi-arrow-right time-separator"></i>
                            <span class="time-end">{{ reservation.endTime }}</span>
                          </div>
                        </td>
                        <td class="table-cell status-cell">
                          <span :class="['status-badge', 'modern-status', `status-${reservation.status}`]">
                            <i :class="getStatusIcon(reservation.status)"></i>
                            {{ getStatusLabel(reservation.status) }}
                          </span>
                        </td>
                        <td class="table-cell value-cell">
                          <span class="value-amount">{{ formatCurrency(reservation.value) }}</span>
                        </td>
                        <td class="actions-cell">
                          <div class="action-buttons modern-actions">
                            <button 
                              @click="editReservation(reservation)"
                              class="action-btn edit-btn modern-action-btn"
                              title="Editar reserva"
                            >
                              <i class="pi pi-pencil"></i>
                            </button>
                            <button 
                              @click="changeReservationStatus(reservation)"
                              class="action-btn status-btn modern-action-btn"
                              title="Alterar status"
                            >
                              <i class="pi pi-refresh"></i>
                            </button>
                            <button 
                              @click="cancelReservation(reservation)"
                              class="action-btn delete-btn modern-action-btn"
                              title="Cancelar reserva"
                              v-if="reservation.status !== 'cancelada'"
                            >
                              <i class="pi pi-times"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Pagination -->
                <div class="pagination modern-pagination" v-if="totalReservationPages > 1">
                  <div class="pagination-info">
                    <span class="page-indicator">
                      Mostrando {{ ((currentReservationPage - 1) * itemsPerPageReservations) + 1 }} - 
                      {{ Math.min(currentReservationPage * itemsPerPageReservations, filteredReservations.length) }} 
                      de {{ filteredReservations.length }} reservas
                    </span>
                  </div>
                  <div class="pagination-controls">
                    <button 
                      @click="currentReservationPage = Math.max(1, currentReservationPage - 1)"
                      :disabled="currentReservationPage === 1"
                      class="page-btn"
                    >
                      <i class="pi pi-chevron-left"></i>
                      Anterior
                    </button>
                    
                    <div class="page-numbers">
                      <span class="page-info">
                        {{ currentReservationPage }} de {{ totalReservationPages }}
                      </span>
                    </div>
                    
                    <button 
                      @click="currentReservationPage = Math.min(totalReservationPages, currentReservationPage + 1)"
                      :disabled="currentReservationPage === totalReservationPages"
                      class="page-btn"
                    >
                      Próxima
                      <i class="pi pi-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Finance Section -->
            <div v-else-if="activeSection === 'finance'" class="finance-content">
              <!-- Mini Header -->
              <div class="mini-header finance-mini-header">
                <div class="mini-header-left">
                  <div class="mini-header-icon">
                    <i class="pi pi-dollar"></i>
                  </div>
                  <div class="mini-header-info">
                    <h2 class="mini-header-title">Gestão Financeira</h2>
                    <p class="mini-header-subtitle">Controle financeiro e relatórios</p>
                  </div>
                </div>
                <div class="mini-header-actions">
                  <button class="action-btn-mini">
                    <i class="pi pi-file-text"></i>
                    Relatório
                  </button>
                </div>
              </div>

              <!-- Financial Overview Cards -->
              <div class="financial-overview">
                <div class="financial-card revenue-card">
                  <div class="card-icon">
                    <i class="pi pi-arrow-up"></i>
                  </div>
                  <div class="card-info">
                    <span class="card-value">{{ formatCurrency(financialData.totalRevenue) }}</span>
                    <span class="card-label">Receita Total</span>
                    <span class="card-change positive">+12.5% vs mês anterior</span>
                  </div>
                </div>
                <div class="financial-card expense-card">
                  <div class="card-icon">
                    <i class="pi pi-arrow-down"></i>
                  </div>
                  <div class="card-info">
                    <span class="card-value">{{ formatCurrency(financialData.totalExpenses) }}</span>
                    <span class="card-label">Despesas Totais</span>
                    <span class="card-change negative">+5.2% vs mês anterior</span>
                  </div>
                </div>
                <div class="financial-card profit-card">
                  <div class="card-icon">
                    <i class="pi pi-chart-line"></i>
                  </div>
                  <div class="card-info">
                    <span class="card-value">{{ formatCurrency(financialData.netProfit) }}</span>
                    <span class="card-label">Lucro Líquido</span>
                    <span class="card-change positive">+18.3% vs mês anterior</span>
                  </div>
                </div>
                <div class="financial-card pending-card">
                  <div class="card-icon">
                    <i class="pi pi-clock"></i>
                  </div>
                  <div class="card-info">
                    <span class="card-value">{{ formatCurrency(financialData.pendingPayments) }}</span>
                    <span class="card-label">Pagamentos Pendentes</span>
                    <span class="card-change">{{ financialData.pendingCount }} transações</span>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="finance-quick-actions">
                <button @click="showAddTransactionModal = true" class="quick-action-card">
                  <i class="pi pi-plus"></i>
                  <span>Nova Transação</span>
                </button>
                <button @click="generateFinancialReport" class="quick-action-card">
                  <i class="pi pi-file-pdf"></i>
                  <span>Gerar Relatório</span>
                </button>
                <button @click="exportFinancialData" class="quick-action-card">
                  <i class="pi pi-download"></i>
                  <span>Exportar Dados</span>
                </button>
                <button @click="showPaymentSettingsModal = true" class="quick-action-card">
                  <i class="pi pi-cog"></i>
                  <span>Configurações</span>
                </button>
              </div>

              <!-- Filters and Search -->
              <div class="finance-filters">
                <div class="filters-card">
                  <div class="filters-header">
                    <h3><i class="pi pi-filter"></i> Filtros de Transações</h3>
                    <button @click="clearFinancialFilters" class="clear-filters-btn">
                      <i class="pi pi-refresh"></i>
                      Limpar
                    </button>
                  </div>
                  <div class="filters-grid">
                    <div class="filter-group">
                      <label><i class="pi pi-info-circle"></i> Tipo</label>
                      <select v-model="financialFilters.type" class="filter-select">
                        <option value="">Todos os tipos</option>
                        <option value="receita">💰 Receita</option>
                        <option value="despesa">💸 Despesa</option>
                        <option value="transferencia">🔄 Transferência</option>
                      </select>
                    </div>
                    <div class="filter-group">
                      <label><i class="pi pi-tag"></i> Categoria</label>
                      <select v-model="financialFilters.category" class="filter-select">
                        <option value="">Todas as categorias</option>
                        <option value="reservas">🏊 Reservas</option>
                        <option value="manutencao">🔧 Manutenção</option>
                        <option value="salarios">👥 Salários</option>
                        <option value="equipamentos">⚽ Equipamentos</option>
                        <option value="utilidades">💡 Utilidades</option>
                      </select>
                    </div>
                    <div class="filter-group">
                      <label><i class="pi pi-calendar"></i> Período</label>
                      <select v-model="financialFilters.period" class="filter-select">
                        <option value="">Todos os períodos</option>
                        <option value="hoje">📅 Hoje</option>
                        <option value="semana">📊 Esta semana</option>
                        <option value="mes">📈 Este mês</option>
                        <option value="trimestre">📋 Este trimestre</option>
                        <option value="ano">📊 Este ano</option>
                      </select>
                    </div>
                    <div class="filter-group">
                      <label><i class="pi pi-search"></i> Buscar</label>
                      <div class="search-input-wrapper">
                        <input 
                          v-model="financialFilters.search" 
                          type="text" 
                          placeholder="Descrição, valor ou ID..."
                          class="filter-input"
                        />
                        <i class="pi pi-search search-icon"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Transactions Table -->
              <div class="transactions-container">
                <div class="table-header">
                  <div class="table-title">
                    <h3><i class="pi pi-list"></i> Transações Recentes</h3>
                    <span class="result-count">{{ filteredTransactions.length }} transações</span>
                  </div>
                  <div class="table-actions">
                    <button class="export-btn" @click="exportTransactions">
                      <i class="pi pi-download"></i>
                      Exportar
                    </button>
                  </div>
                </div>
                <div class="table-wrapper">
                  <table class="transactions-table">
                    <thead>
                      <tr>
                        <th><i class="pi pi-hashtag"></i> ID</th>
                        <th><i class="pi pi-calendar"></i> Data</th>
                        <th><i class="pi pi-tag"></i> Tipo</th>
                        <th><i class="pi pi-bookmark"></i> Categoria</th>
                        <th><i class="pi pi-file-o"></i> Descrição</th>
                        <th><i class="pi pi-dollar"></i> Valor</th>
                        <th><i class="pi pi-info-circle"></i> Status</th>
                        <th><i class="pi pi-cog"></i> Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="transaction-row">
                        <td>
                          <span class="transaction-id">#{{ transaction.id }}</span>
                        </td>
                        <td>
                          <div class="date-info">
                            <span class="date-display">{{ formatDate(transaction.date) }}</span>
                            <span class="time-display">{{ transaction.time }}</span>
                          </div>
                        </td>
                        <td>
                          <span :class="['type-badge', `type-${transaction.type}`]">
                            <i :class="getTransactionTypeIcon(transaction.type)"></i>
                            {{ getTransactionTypeLabel(transaction.type) }}
                          </span>
                        </td>
                        <td>
                          <span class="category-tag">
                            {{ getCategoryIcon(transaction.category) }}
                            {{ transaction.category }}
                          </span>
                        </td>
                        <td class="description-cell">
                          <span class="description">{{ transaction.description }}</span>
                        </td>
                        <td>
                          <span :class="['value-amount', transaction.type === 'receita' ? 'positive' : 'negative']">
                            {{ transaction.type === 'receita' ? '+' : '-' }}{{ formatCurrency(Math.abs(transaction.amount)) }}
                          </span>
                        </td>
                        <td>
                          <span :class="['status-badge', `status-${transaction.status}`]">
                            <i :class="getTransactionStatusIcon(transaction.status)"></i>
                            {{ getTransactionStatusLabel(transaction.status) }}
                          </span>
                        </td>
                        <td class="actions-cell">
                          <div class="action-buttons">
                            <button 
                              @click="editTransaction(transaction)"
                              class="action-btn edit-btn"
                              title="Editar transação"
                            >
                              <i class="pi pi-pencil"></i>
                            </button>
                            <button 
                              @click="viewTransactionDetails(transaction)"
                              class="action-btn view-btn"
                              title="Ver detalhes"
                            >
                              <i class="pi pi-eye"></i>
                            </button>
                            <button 
                              @click="deleteTransaction(transaction)"
                              class="action-btn delete-btn"
                              title="Excluir transação"
                            >
                              <i class="pi pi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Pagination -->
                <div class="pagination-container">
                  <div class="pagination-info">
                    <span class="page-indicator">
                      Mostrando {{ (currentFinancePage - 1) * itemsPerPageFinance + 1 }} - 
                      {{ Math.min(currentFinancePage * itemsPerPageFinance, filteredTransactions.length) }} 
                      de {{ filteredTransactions.length }} transações
                    </span>
                  </div>
                  <div class="pagination-controls">
                    <button 
                      @click="currentFinancePage--" 
                      :disabled="currentFinancePage === 1"
                      class="pagination-btn"
                    >
                      <i class="pi pi-chevron-left"></i>
                    </button>
                    <span class="page-numbers">
                      <span 
                        v-for="page in totalFinancePages" 
                        :key="page"
                        @click="currentFinancePage = page"
                        :class="['page-number', { active: page === currentFinancePage }]"
                      >
                        {{ page }}
                      </span>
                    </span>
                    <button 
                      @click="currentFinancePage++" 
                      :disabled="currentFinancePage === totalFinancePages"
                      class="pagination-btn"
                    >
                      <i class="pi pi-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reports Section -->
            <div v-else-if="activeSection === 'reports'" class="reports-content">
              <!-- Mini Header -->
              <div class="mini-header reports-mini-header">
                <div class="mini-header-left">
                  <div class="mini-header-icon">
                    <i class="pi pi-file-text"></i>
                  </div>
                  <div class="mini-header-info">
                    <h2 class="mini-header-title">Relatórios</h2>
                    <p class="mini-header-subtitle">Análises e relatórios detalhados</p>
                  </div>
                </div>
                <div class="mini-header-actions">
                  <button class="action-btn-mini" @click="exportAllReports">
                    <i class="pi pi-download"></i>
                    Exportar
                  </button>
                  <button class="action-btn-mini" @click="showReportModal = true">
                    <i class="pi pi-plus"></i>
                    Gerar
                  </button>
                </div>
              </div>

              <!-- Reports Overview Cards -->
              <div class="reports-overview">
                <div class="report-card">
                  <div class="report-card-header">
                    <div class="report-icon reservations">
                      <i class="pi pi-calendar"></i>
                    </div>
                    <div class="report-info">
                      <h3>Relatórios de Reservas</h3>
                      <p>{{ reportStats.reservations }} relatórios gerados</p>
                    </div>
                  </div>
                  <div class="report-actions">
                    <button class="report-action-btn" @click="generateReservationReport">
                      <i class="pi pi-file-text"></i>
                      Gerar
                    </button>
                    <button class="report-action-btn" @click="viewReportHistory('reservations')">
                      <i class="pi pi-history"></i>
                      Histórico
                    </button>
                  </div>
                </div>

                <div class="report-card">
                  <div class="report-card-header">
                    <div class="report-icon users">
                      <i class="pi pi-users"></i>
                    </div>
                    <div class="report-info">
                      <h3>Relatórios de Usuários</h3>
                      <p>{{ reportStats.users }} relatórios gerados</p>
                    </div>
                  </div>
                  <div class="report-actions">
                    <button class="report-action-btn" @click="generateUserReport">
                      <i class="pi pi-file-text"></i>
                      Gerar
                    </button>
                    <button class="report-action-btn" @click="viewReportHistory('users')">
                      <i class="pi pi-history"></i>
                      Histórico
                    </button>
                  </div>
                </div>

                <div class="report-card">
                  <div class="report-card-header">
                    <div class="report-icon financial">
                      <i class="pi pi-dollar"></i>
                    </div>
                    <div class="report-info">
                      <h3>Relatórios Financeiros</h3>
                      <p>{{ reportStats.financial }} relatórios gerados</p>
                    </div>
                  </div>
                  <div class="report-actions">
                    <button class="report-action-btn" @click="generateFinancialReport">
                      <i class="pi pi-file-text"></i>
                      Gerar
                    </button>
                    <button class="report-action-btn" @click="viewReportHistory('financial')">
                      <i class="pi pi-history"></i>
                      Histórico
                    </button>
                  </div>
                </div>

                <div class="report-card">
                  <div class="report-card-header">
                    <div class="report-icon spaces">
                      <i class="pi pi-building"></i>
                    </div>
                    <div class="report-info">
                      <h3>Relatórios de Espaços</h3>
                      <p>{{ reportStats.spaces }} relatórios gerados</p>
                    </div>
                  </div>
                  <div class="report-actions">
                    <button class="report-action-btn" @click="generateSpaceReport">
                      <i class="pi pi-file-text"></i>
                      Gerar
                    </button>
                    <button class="report-action-btn" @click="viewReportHistory('spaces')">
                      <i class="pi pi-history"></i>
                      Histórico
                    </button>
                  </div>
                </div>
              </div>

              <!-- Reports Filters and Search -->
              <div class="reports-filters">
                <div class="filter-group">
                  <label>Tipo de Relatório:</label>
                  <select v-model="reportFilters.type" class="filter-select">
                    <option value="">Todos os tipos</option>
                    <option value="reservations">Reservas</option>
                    <option value="users">Usuários</option>
                    <option value="financial">Financeiro</option>
                    <option value="spaces">Espaços</option>
                    <option value="analytics">Analytics</option>
                  </select>
                </div>

                <div class="filter-group">
                  <label>Período:</label>
                  <select v-model="reportFilters.period" class="filter-select">
                    <option value="">Todos os períodos</option>
                    <option value="today">Hoje</option>
                    <option value="week">Esta semana</option>
                    <option value="month">Este mês</option>
                    <option value="quarter">Este trimestre</option>
                    <option value="year">Este ano</option>
                  </select>
                </div>

                <div class="filter-group">
                  <label>Status:</label>
                  <select v-model="reportFilters.status" class="filter-select">
                    <option value="">Todos os status</option>
                    <option value="completed">Concluído</option>
                    <option value="generating">Gerando</option>
                    <option value="failed">Falhou</option>
                  </select>
                </div>

                <div class="filter-group">
                  <input 
                    type="text" 
                    v-model="reportFilters.search" 
                    placeholder="Buscar relatórios..."
                    class="filter-search"
                  >
                </div>

                <button class="filter-clear" @click="clearReportFilters">
                  <i class="pi pi-times"></i>
                  Limpar
                </button>
              </div>

              <!-- Reports Table -->
              <div class="reports-table-container">
                <table class="reports-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome do Relatório</th>
                      <th>Tipo</th>
                      <th>Data de Criação</th>
                      <th>Período</th>
                      <th>Status</th>
                      <th>Tamanho</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="report in filteredReports" :key="report.id" class="report-row">
                      <td class="report-id">#{{ report.id }}</td>
                      <td class="report-name">
                        <div class="report-name-container">
                          <span class="report-title">{{ report.name }}</span>
                          <span class="report-description">{{ report.description }}</span>
                        </div>
                      </td>
                      <td class="report-type">
                        <span :class="['type-badge', report.type]">
                          <i :class="getReportTypeIcon(report.type)"></i>
                          {{ getReportTypeLabel(report.type) }}
                        </span>
                      </td>
                      <td class="report-date">{{ formatDate(report.createdAt) }}</td>
                      <td class="report-period">{{ report.period }}</td>
                      <td class="report-status">
                        <span :class="['status-badge', report.status]">
                          <i :class="getReportStatusIcon(report.status)"></i>
                          {{ getReportStatusLabel(report.status) }}
                        </span>
                      </td>
                      <td class="report-size">{{ formatFileSize(report.size) }}</td>
                      <td class="report-actions">
                        <button 
                          v-if="report.status === 'completed'"
                          class="action-btn small success" 
                          @click="downloadReport(report)"
                          title="Download"
                        >
                          <i class="pi pi-download"></i>
                        </button>
                        <button 
                          class="action-btn small primary" 
                          @click="viewReportDetails(report)"
                          title="Visualizar"
                        >
                          <i class="pi pi-eye"></i>
                        </button>
                        <button 
                          class="action-btn small secondary" 
                          @click="shareReport(report)"
                          title="Compartilhar"
                        >
                          <i class="pi pi-share-alt"></i>
                        </button>
                        <button 
                          class="action-btn small danger" 
                          @click="deleteReport(report)"
                          title="Excluir"
                        >
                          <i class="pi pi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Reports Pagination -->
              <div class="reports-pagination">
                <div class="pagination-info">
                  Mostrando {{ (currentPageReports - 1) * itemsPerPageReports + 1 }} a 
                  {{ Math.min(currentPageReports * itemsPerPageReports, filteredReports.length) }} 
                  de {{ filteredReports.length }} relatórios
                </div>
                <div class="pagination-controls">
                  <button 
                    @click="currentPageReports--" 
                    :disabled="currentPageReports === 1"
                    class="pagination-btn"
                  >
                    <i class="pi pi-chevron-left"></i>
                  </button>
                  <span class="pagination-current">{{ currentPageReports }}</span>
                  <button 
                    @click="currentPageReports++" 
                    :disabled="currentPageReports === totalPagesReports"
                    class="pagination-btn"
                  >
                    <i class="pi pi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Report Generation Modal -->
            <div v-if="showReportModal" class="modal-overlay" @click="closeReportModal">
              <div class="modal-content report-modal" @click.stop>
                <div class="modal-header">
                  <h3>Gerar Novo Relatório</h3>
                  <button class="close-btn" @click="closeReportModal">
                    <i class="pi pi-times"></i>
                  </button>
                </div>

                <div class="modal-body">
                  <form @submit.prevent="generateCustomReport">
                    <div class="form-group">
                      <label>Nome do Relatório:</label>
                      <input 
                        type="text" 
                        v-model="newReport.name" 
                        class="form-input"
                        placeholder="Digite o nome do relatório"
                        required
                      >
                    </div>

                    <div class="form-group">
                      <label>Descrição:</label>
                      <textarea 
                        v-model="newReport.description" 
                        class="form-textarea"
                        placeholder="Descrição opcional do relatório"
                        rows="3"
                      ></textarea>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label>Tipo de Relatório:</label>
                        <select v-model="newReport.type" class="form-select" required>
                          <option value="">Selecione o tipo</option>
                          <option value="reservations">Relatório de Reservas</option>
                          <option value="users">Relatório de Usuários</option>
                          <option value="financial">Relatório Financeiro</option>
                          <option value="spaces">Relatório de Espaços</option>
                          <option value="analytics">Relatório de Analytics</option>
                        </select>
                      </div>

                      <div class="form-group">
                        <label>Formato:</label>
                        <select v-model="newReport.format" class="form-select" required>
                          <option value="pdf">PDF</option>
                          <option value="excel">Excel</option>
                          <option value="csv">CSV</option>
                          <option value="json">JSON</option>
                        </select>
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label>Data Inicial:</label>
                        <input 
                          type="date" 
                          v-model="newReport.startDate" 
                          class="form-input"
                          required
                        >
                      </div>

                      <div class="form-group">
                        <label>Data Final:</label>
                        <input 
                          type="date" 
                          v-model="newReport.endDate" 
                          class="form-input"
                          required
                        >
                      </div>
                    </div>

                    <div class="form-group">
                      <label>Filtros Adicionais:</label>
                      <div class="checkbox-group">
                        <label class="checkbox-item">
                          <input type="checkbox" v-model="newReport.includeCharts">
                          <span>Incluir gráficos</span>
                        </label>
                        <label class="checkbox-item">
                          <input type="checkbox" v-model="newReport.includeDetails">
                          <span>Incluir detalhes completos</span>
                        </label>
                        <label class="checkbox-item">
                          <input type="checkbox" v-model="newReport.includeComparison">
                          <span>Incluir comparativo com período anterior</span>
                        </label>
                        <label class="checkbox-item">
                          <input type="checkbox" v-model="newReport.scheduled">
                          <span>Agendar geração automática</span>
                        </label>
                      </div>
                    </div>

                    <div v-if="newReport.scheduled" class="form-group">
                      <label>Frequência de Geração:</label>
                      <select v-model="newReport.frequency" class="form-select">
                        <option value="daily">Diário</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensal</option>
                        <option value="quarterly">Trimestral</option>
                      </select>
                    </div>

                    <div class="modal-actions">
                      <button type="button" class="btn secondary" @click="closeReportModal">
                        Cancelar
                      </button>
                      <button type="submit" class="btn primary">
                        <i class="pi pi-file-text"></i>
                        Gerar Relatório
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <!-- Report Details Modal -->
            <div v-if="showReportDetailsModal" class="modal-overlay" @click="closeReportDetailsModal">
              <div class="modal-content report-details-modal" @click.stop>
                <div class="modal-header">
                  <h3>Detalhes do Relatório</h3>
                  <button class="close-btn" @click="closeReportDetailsModal">
                    <i class="pi pi-times"></i>
                  </button>
                </div>

                <div class="modal-body" v-if="selectedReport">
                  <div class="report-details">
                    <div class="detail-section">
                      <h4>Informações Gerais</h4>
                      <div class="detail-grid">
                        <div class="detail-item">
                          <span class="detail-label">Nome:</span>
                          <span class="detail-value">{{ selectedReport.name }}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Tipo:</span>
                          <span class="detail-value">{{ getReportTypeLabel(selectedReport.type) }}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Status:</span>
                          <span :class="['detail-value', 'status-badge', selectedReport.status]">
                            {{ getReportStatusLabel(selectedReport.status) }}
                          </span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Tamanho:</span>
                          <span class="detail-value">{{ formatFileSize(selectedReport.size) }}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Criado em:</span>
                          <span class="detail-value">{{ formatDateTime(selectedReport.createdAt) }}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Período:</span>
                          <span class="detail-value">{{ selectedReport.period }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="detail-section" v-if="selectedReport.description">
                      <h4>Descrição</h4>
                      <p class="report-description">{{ selectedReport.description }}</p>
                    </div>

                    <div class="detail-section">
                      <h4>Estatísticas</h4>
                      <div class="stats-grid">
                        <div class="stat-card">
                          <div class="stat-icon">
                            <i class="pi pi-file-o"></i>
                          </div>
                          <div class="stat-info">
                            <span class="stat-value">{{ selectedReport.stats?.records || '0' }}</span>
                            <span class="stat-label">Registros</span>
                          </div>
                        </div>
                        <div class="stat-card">
                          <div class="stat-icon">
                            <i class="pi pi-chart-bar"></i>
                          </div>
                          <div class="stat-info">
                            <span class="stat-value">{{ selectedReport.stats?.charts || '0' }}</span>
                            <span class="stat-label">Gráficos</span>
                          </div>
                        </div>
                        <div class="stat-card">
                          <div class="stat-icon">
                            <i class="pi pi-clock"></i>
                          </div>
                          <div class="stat-info">
                            <span class="stat-value">{{ selectedReport.stats?.processingTime || '0' }}s</span>
                            <span class="stat-label">Tempo de Geração</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="modal-actions">
                    <button class="btn secondary" @click="closeReportDetailsModal">
                      Fechar
                    </button>
                    <button 
                      v-if="selectedReport.status === 'completed'"
                      class="btn success" 
                      @click="downloadReport(selectedReport)"
                    >
                      <i class="pi pi-download"></i>
                      Download
                    </button>
                    <button class="btn primary" @click="duplicateReport(selectedReport)">
                      <i class="pi pi-copy"></i>
                      Duplicar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dashboard Section -->
            <div v-else-if="activeSection === 'dashboard'" class="dashboard-content">
              <!-- Mini Header -->
              <div class="mini-header dashboard-mini-header">
                <div class="mini-header-left">
                  <div class="mini-header-icon">
                    <i class="pi pi-chart-bar"></i>
                  </div>
                  <div class="mini-header-info">
                    <h2 class="mini-header-title">Dashboard Executivo</h2>
                    <p class="mini-header-subtitle">Visão geral e métricas em tempo real</p>
                  </div>
                </div>
                <div class="mini-header-actions">
                  <div class="period-selector">
                    <button 
                      :class="['period-btn-mini', { active: selectedPeriod === 'today' }]"
                      @click="selectedPeriod = 'today'"
                    >
                      Hoje
                    </button>
                    <button 
                      :class="['period-btn-mini', { active: selectedPeriod === 'week' }]"
                      @click="selectedPeriod = 'week'"
                    >
                      Semana
                    </button>
                    <button 
                      :class="['period-btn-mini', { active: selectedPeriod === 'month' }]"
                      @click="selectedPeriod = 'month'"
                    >
                      Mês
                    </button>
                  </div>
                </div>
              </div>


              
              <!-- Enhanced Stats Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="stat-card revenue">
                  <div class="stat-icon">
                    <i class="pi pi-dollar"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ formatCurrency(currentStats.revenue) }}</div>
                    <div class="stat-label">Receita {{ getPeriodLabel() }}</div>
                    <div class="stat-trend" :class="currentStats.revenueTrend > 0 ? 'positive' : 'negative'">
                      <i :class="currentStats.revenueTrend > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
                      {{ Math.abs(currentStats.revenueTrend) }}%
                    </div>
                  </div>
                </div>
                
                <div class="stat-card users">
                  <div class="stat-icon">
                    <i class="pi pi-users"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ currentStats.activeUsers }}</div>
                    <div class="stat-label">Usuários Ativos</div>
                    <div class="stat-trend positive">
                      <i class="pi pi-arrow-up"></i>
                      +{{ currentStats.newUsers }} novos
                    </div>
                  </div>
                </div>
                
                <div class="stat-card reservations">
                  <div class="stat-icon">
                    <i class="pi pi-calendar"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ currentStats.reservations }}</div>
                    <div class="stat-label">Reservas {{ getPeriodLabel() }}</div>
                    <div class="stat-trend" :class="currentStats.reservationsTrend > 0 ? 'positive' : 'negative'">
                      <i :class="currentStats.reservationsTrend > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
                      {{ Math.abs(currentStats.reservationsTrend) }}%
                    </div>
                  </div>
                </div>
                
                <div class="stat-card spaces">
                  <div class="stat-icon">
                    <i class="pi pi-building"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ currentStats.availableSpaces }}</div>
                    <div class="stat-label">Espaços Disponíveis</div>
                    <div class="stat-trend neutral">
                      {{ currentStats.occupancyRate }}% ocupação
                    </div>
                  </div>
                </div>
              </div>

              <!-- Real-time Alerts -->
              <div v-if="systemAlerts.length > 0" class="alerts-section mb-8">
                <h4 class="text-lg font-semibold text-gray-800 mb-4">Alertas do Sistema</h4>
                <div class="alerts-grid">
                  <div 
                    v-for="alert in systemAlerts" 
                    :key="alert.id"
                    :class="['alert-card', alert.type]"
                  >
                    <div class="alert-icon">
                      <i :class="getAlertIcon(alert.type)"></i>
                    </div>
                    <div class="alert-content">
                      <h5>{{ alert.title }}</h5>
                      <p>{{ alert.message }}</p>
                      <span class="alert-time">{{ formatTime(alert.time) }}</span>
                    </div>
                    <button @click="dismissAlert(alert.id)" class="alert-dismiss">
                      <i class="pi pi-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="quick-actions">
                <h4 class="text-lg font-semibold text-gray-800 mb-4">
                  <i class="pi pi-bolt"></i>
                  Ações Rápidas
                </h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    class="quick-action-btn" 
                    @click="openNewUserModal"
                    title="Cadastrar um novo usuário no sistema"
                  >
                    <i class="pi pi-user-plus"></i>
                    <span>Novo Usuário</span>
                  </button>
                  <button 
                    class="quick-action-btn" 
                    @click="addNewSpace"
                    title="Adicionar um novo espaço esportivo"
                  >
                    <i class="pi pi-plus-circle"></i>
                    <span>Novo Espaço</span>
                  </button>
                  <button 
                    class="quick-action-btn" 
                    @click="generateReport"
                    title="Gerar relatórios do sistema"
                  >
                    <i class="pi pi-file-pdf"></i>
                    <span>Gerar Relatório</span>
                  </button>
                  <button 
                    class="quick-action-btn" 
                    @click="systemBackup"
                    title="Fazer backup completo do sistema"
                  >
                    <i class="pi pi-download"></i>
                    <span>Backup</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Settings Section (placeholder) -->
            <div v-else-if="activeSection === 'settings'" class="settings-content">
              <div class="section-header">
                <h2 class="section-title">Configurações do Sistema</h2>
              </div>
              <p class="section-description">
                Funcionalidade em desenvolvimento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit User Modal -->
    <div v-if="showEditUserModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Editar Usuário</h3>
          <button @click="closeEditModal" class="modal-close">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveUserChanges">
            <div class="form-grid">
              <div class="form-group">
                <label>Nome Completo</label>
                <input 
                  type="text" 
                  v-model="editingUser.name" 
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  v-model="editingUser.email" 
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label>CPF</label>
                <input 
                  type="text" 
                  v-model="editingUser.cpf" 
                  class="form-input form-input-readonly"
                  readonly
                  disabled
                />
              </div>
              
              <div class="form-group">
                <label>Status</label>
                <select v-model="editingUser.status" class="form-select" required>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              
              <div class="form-group full-width" v-if="editingUser.type === 'tecnico' || editingUser.type === 'admin'">
                <label>Permissões Especiais</label>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input 
                      type="checkbox" 
                      v-model="editingUser.permissions.manageSpaces"
                    />
                    <span>Gerenciar Espaços</span>
                  </label>
                  <label class="checkbox-item">
                    <input 
                      type="checkbox" 
                      v-model="editingUser.permissions.manageReservations"
                    />
                    <span>Gerenciar Reservas</span>
                  </label>
                  <label class="checkbox-item" v-if="editingUser.type === 'admin'">
                    <input 
                      type="checkbox" 
                      v-model="editingUser.permissions.manageUsers"
                    />
                    <span>Gerenciar Usuários</span>
                  </label>
                  <label class="checkbox-item" v-if="editingUser.type === 'admin'">
                    <input 
                      type="checkbox" 
                      v-model="editingUser.permissions.viewReports"
                    />
                    <span>Visualizar Relatórios</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" @click="closeEditModal" class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Promoção de Usuário -->
    <div v-if="showPromoteModal" class="modal-overlay" @click="closePromoteModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Alterar Tipo de Usuário</h3>
          <button @click="closePromoteModal" class="modal-close">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="promote-content">
            <div class="user-info">
              <h4>{{ promotingUser?.name }}</h4>
              <p>{{ promotingUser?.email }}</p>
              <p class="current-type">Tipo atual: <span class="type-badge">{{ getTypeLabel(promotingUser?.type) }}</span></p>
            </div>
            <div class="promote-options">
              <h5>Selecione o novo tipo:</h5>
              <div class="type-options">
                <label class="type-option" v-if="promotingUser?.type !== 'cliente'">
                  <input type="radio" v-model="newUserType" value="cliente" />
                  <div class="option-card">
                    <i class="pi pi-user"></i>
                    <span>Cliente</span>
                  </div>
                </label>
                <label class="type-option" v-if="promotingUser?.type !== 'tecnico'">
                  <input type="radio" v-model="newUserType" value="tecnico" />
                  <div class="option-card">
                    <i class="pi pi-cog"></i>
                    <span>Técnico</span>
                  </div>
                </label>
                <label class="type-option" v-if="promotingUser?.type !== 'admin'">
                  <input type="radio" v-model="newUserType" value="admin" />
                  <div class="option-card">
                    <i class="pi pi-shield"></i>
                    <span>Administrador</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="closePromoteModal" class="btn-secondary">Cancelar</button>
            <button @click="confirmUserTypeChange" class="btn-primary" :disabled="!newUserType">
              Confirmar Alteração
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Novo Usuário -->
    <div v-if="showNewUserModal" class="modal-overlay" @click="closeNewUserModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Novo Usuário</h3>
          <button @click="closeNewUserModal" class="modal-close">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createNewUser">
            <div class="form-grid">
              <div class="form-group">
                <label>Nome Completo</label>
                <input 
                  type="text" 
                  v-model="newUser.name" 
                  class="form-input"
                  placeholder="Nome completo"
                  required
                />
              </div>
              
              <div class="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  v-model="newUser.email" 
                  class="form-input"
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              
              <div class="form-group">
                <label>CPF</label>
                <input 
                  type="text" 
                  v-model="newUser.cpf" 
                  class="form-input"
                  placeholder="000.000.000-00"
                  @input="formatNewUserCPF"
                  maxlength="14"
                  required
                />
              </div>
              
              <div class="form-group">
                <label>Tipo de Usuário</label>
                <select v-model="newUser.type" class="form-select" required>
                  <option value="">Selecione o tipo</option>
                  <option value="cliente">Cliente</option>
                  <option value="tecnico">Técnico</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Status</label>
                <select v-model="newUser.status" class="form-select" required>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              
              <div class="form-group full-width" v-if="newUser.type === 'tecnico' || newUser.type === 'admin'">
                <label>Permissões Especiais</label>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input 
                      type="checkbox" 
                      v-model="newUser.permissions.manageSpaces"
                    />
                    <span>Gerenciar Espaços</span>
                  </label>
                  <label class="checkbox-item">
                    <input 
                      type="checkbox" 
                      v-model="newUser.permissions.manageReservations"
                    />
                    <span>Gerenciar Reservas</span>
                  </label>
                  <label class="checkbox-item" v-if="newUser.type === 'admin'">
                    <input 
                      type="checkbox" 
                      v-model="newUser.permissions.manageUsers"
                    />
                    <span>Gerenciar Usuários</span>
                  </label>
                  <label class="checkbox-item" v-if="newUser.type === 'admin'">
                    <input 
                      type="checkbox" 
                      v-model="newUser.permissions.viewReports"
                    />
                    <span>Visualizar Relatórios</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" @click="closeNewUserModal" class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                Criar Usuário
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Edição de Reserva -->
    <div v-if="showEditReservationModal" class="modal-overlay" @click="closeEditReservationModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Editar Reserva #{{ editingReservation.id }}</h3>
          <button @click="closeEditReservationModal" class="modal-close">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveReservationChanges">
            <div class="form-grid">
              <div class="form-group">
                <label>Usuário</label>
                <input 
                  type="text" 
                  :value="editingReservation.userName" 
                  class="form-input form-input-readonly"
                  readonly
                  disabled
                />
              </div>
              
              <div class="form-group">
                <label>Espaço</label>
                <select v-model="editingReservation.space" class="form-select" required>
                  <option value="quadra-futebol">Quadra de Futebol</option>
                  <option value="quadra-volei">Quadra de Vôlei</option>
                  <option value="piscina">Piscina</option>
                  <option value="academia">Academia</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Data</label>
                <input 
                  type="date" 
                  v-model="editingReservation.date" 
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label>Horário de Início</label>
                <input 
                  type="time" 
                  v-model="editingReservation.startTime" 
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label>Horário de Fim</label>
                <input 
                  type="time" 
                  v-model="editingReservation.endTime" 
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label>Status</label>
                <select v-model="editingReservation.status" class="form-select" required>
                  <option value="pendente">Pendente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Valor (R$)</label>
                <input 
                  type="number" 
                  v-model="editingReservation.value" 
                  class="form-input"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div class="form-group full-width">
                <label>Observações</label>
                <textarea 
                  v-model="editingReservation.notes" 
                  class="form-input"
                  rows="3"
                  placeholder="Observações sobre a reserva..."
                ></textarea>
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" @click="closeEditReservationModal" class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Novo Espaço -->
    <div v-if="showNewSpaceModal" class="modal-overlay" @click="closeNewSpaceModal">
      <div class="modal-container new-space-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="pi pi-plus"></i>
            Novo Espaço
          </h3>
          <button @click="closeNewSpaceModal" class="modal-close">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createSpace" class="space-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="spaceName">
                  <i class="pi pi-building"></i>
                  Nome do Espaço
                </label>
                <input 
                  id="spaceName"
                  v-model="newSpace.name" 
                  type="text" 
                  class="form-input"
                  placeholder="Ex: Quadra de Futebol 1"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="spaceType">
                  <i class="pi pi-tag"></i>
                  Tipo
                </label>
                <select id="spaceType" v-model="newSpace.type" class="form-select" required>
                  <option value="">Selecione o tipo</option>
                  <option value="quadra-futebol">⚽ Quadra de Futebol</option>
                  <option value="quadra-volei">🏐 Quadra de Vôlei</option>
                  <option value="quadra-basquete">🏀 Quadra de Basquete</option>
                  <option value="piscina">🏊 Piscina</option>
                  <option value="academia">💪 Academia</option>
                  <option value="sala-multiuso">🏢 Sala Multiuso</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="spaceCapacity">
                  <i class="pi pi-users"></i>
                  Capacidade
                </label>
                <input 
                  id="spaceCapacity"
                  v-model="newSpace.capacity" 
                  type="number" 
                  class="form-input"
                  placeholder="Ex: 22"
                  min="1"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="spacePrice">
                  <i class="pi pi-dollar"></i>
                  Preço por Hora (R$)
                </label>
                <input 
                  id="spacePrice"
                  v-model="newSpace.pricePerHour" 
                  type="number" 
                  class="form-input"
                  placeholder="Ex: 150.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div class="form-group">
                <label for="spaceStatus">
                  <i class="pi pi-info-circle"></i>
                  Status
                </label>
                <select id="spaceStatus" v-model="newSpace.status" class="form-select" required>
                  <option value="">Selecione um status</option>
                  <option value="ativo">✅ Ativo</option>
                  <option value="manutencao">⚠️ Em Manutenção</option>
                  <option value="inativo">❌ Inativo</option>
                </select>
              </div>

              <div class="form-group">
                <label for="spaceLocation">
                  <i class="pi pi-map-marker"></i>
                  Localização
                </label>
                <input 
                  id="spaceLocation"
                  v-model="newSpace.location" 
                  type="text" 
                  class="form-input"
                  placeholder="Ex: Bloco A - Andar 2"
                  required
                />
              </div>
              
              <div class="form-group full-width">
                <label for="spaceDescription">
                  <i class="pi pi-file-text"></i>
                  Descrição
                </label>
                <textarea 
                  id="spaceDescription"
                  v-model="newSpace.description"
                  class="form-textarea"
                  placeholder="Descreva as características e equipamentos do espaço..."
                  rows="4"
                ></textarea>
              </div>

              <div class="form-group full-width">
                <label for="spacePhotos">
                  <i class="pi pi-images"></i>
                  Fotos (máximo 3)
                </label>
                <input 
                  id="spacePhotos"
                  type="file"
                  accept="image/*"
                  multiple
                  class="form-input"
                  @change="handlePhotoUpload"
                  ref="photoInput"
                />
                <small class="text-gray-500">Selecione até 3 imagens do espaço</small>
                <div v-if="newSpace.photoFiles && newSpace.photoFiles.length > 0" class="mt-2">
                  <p class="text-sm font-semibold">{{ newSpace.photoFiles.length }} foto(s) selecionada(s)</p>
                </div>
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" @click="closeNewSpaceModal" class="btn-secondary">
                <i class="pi pi-times"></i>
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                <i class="pi pi-check"></i>
                Criar Espaço
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Edição de Espaço -->
    <div v-if="showEditSpaceModal" class="modal-overlay" @click="closeEditSpaceModal">
      <div class="modal-container edit-space-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="pi pi-pencil"></i>
            Editar Espaço
          </h3>
          <button @click="closeEditSpaceModal" class="modal-close">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateSpace" class="space-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="editSpaceName">
                  <i class="pi pi-building"></i>
                  Nome do Espaço
                </label>
                <input 
                  id="editSpaceName"
                  v-model="editingSpace.name" 
                  type="text" 
                  class="form-input"
                  placeholder="Ex: Quadra Principal"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="editSpaceType">
                  <i class="pi pi-tag"></i>
                  Tipo
                </label>
                <select id="editSpaceType" v-model="editingSpace.type" class="form-select" required>
                  <option value="">Selecione um tipo</option>
                  <option value="quadra-futebol">⚽ Quadra de Futebol</option>
                  <option value="quadra-volei">🏐 Quadra de Vôlei</option>
                  <option value="quadra-basquete">🏀 Quadra de Basquete</option>
                  <option value="piscina">🏊 Piscina</option>
                  <option value="academia">💪 Academia</option>
                  <option value="sala-multiuso">🏢 Sala Multiuso</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="editSpaceCapacity">
                  <i class="pi pi-users"></i>
                  Capacidade
                </label>
                <input 
                  id="editSpaceCapacity"
                  v-model="editingSpace.capacity" 
                  type="number" 
                  class="form-input"
                  placeholder="Ex: 22"
                  min="1"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="editSpacePrice">
                  <i class="pi pi-dollar"></i>
                  Preço por Hora (R$)
                </label>
                <input 
                  id="editSpacePrice"
                  v-model="editingSpace.pricePerHour" 
                  type="number" 
                  class="form-input"
                  placeholder="Ex: 50.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div class="form-group">
                <label for="editSpaceStatus">
                  <i class="pi pi-info-circle"></i>
                  Status
                </label>
                <select id="editSpaceStatus" v-model="editingSpace.status" class="form-select" required>
                  <option value="">Selecione um status</option>
                  <option value="ativo">✅ Ativo</option>
                  <option value="manutencao">⚠️ Em Manutenção</option>
                  <option value="inativo">❌ Inativo</option>
                </select>
              </div>

              <div class="form-group">
                <label for="editSpaceLocation">
                  <i class="pi pi-map-marker"></i>
                  Localização
                </label>
                <input 
                  id="editSpaceLocation"
                  v-model="editingSpace.location" 
                  type="text" 
                  class="form-input"
                  placeholder="Ex: Bloco A - Térreo"
                />
              </div>
              
              <div class="form-group full-width">
                <label for="editSpaceDescription">
                  <i class="pi pi-file-text"></i>
                  Descrição
                </label>
                <textarea 
                  id="editSpaceDescription"
                  v-model="editingSpace.description"
                  class="form-textarea"
                  placeholder="Descreva as características e equipamentos do espaço..."
                  rows="4"
                ></textarea>
              </div>

              <!-- Seção de Informações Customizáveis -->
              <div class="form-group col-span-2">
                <label class="form-label">
                  <i class="pi pi-info-circle"></i>
                  Informações do Espaço
                </label>
                <div class="custom-info-section">
                  <!-- Lista das informações existentes -->
                  <div v-if="editingSpace.customInfo && editingSpace.customInfo.length > 0" class="info-items">
                    <div v-for="(info, index) in editingSpace.customInfo" :key="index" class="info-item">
                      <div class="info-display">
                        <i :class="info.icon" class="info-icon"></i>
                        <div class="info-content">
                          <span class="info-title">{{ info.title }}</span>
                          <span class="info-description">{{ info.description }}</span>
                        </div>
                        <button type="button" @click="removeCustomInfo(index)" class="remove-info-btn">
                          <i class="pi pi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Formulário para adicionar nova informação -->
                  <div class="add-info-form">
                    <div class="form-grid-mini">
                      <div class="form-group">
                        <select v-model="newCustomInfo.icon" class="form-select">
                          <option value="">Selecione um ícone</option>
                          <option value="pi pi-shield">🛡️ Segurança</option>
                          <option value="pi pi-users">👥 Material Esportivo</option>
                          <option value="pi pi-sun">☀️ Iluminação</option>
                          <option value="pi pi-car">🚗 Estacionamento</option>
                          <option value="pi pi-wifi">📶 Wi-Fi</option>
                          <option value="pi pi-home">🏠 Vestiários</option>
                          <option value="pi pi-bolt">⚡ Energia</option>
                          <option value="pi pi-droplet">💧 Água</option>
                          <option value="pi pi-calendar">📅 Disponibilidade</option>
                          <option value="pi pi-star">⭐ Qualidade</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <input 
                          v-model="newCustomInfo.title" 
                          type="text" 
                          placeholder="Nome da informação"
                          class="form-input"
                        />
                      </div>
                      <div class="form-group">
                        <input 
                          v-model="newCustomInfo.description" 
                          type="text" 
                          placeholder="Descrição"
                          class="form-input"
                        />
                      </div>
                      <div class="form-group">
                        <button type="button" @click="addCustomInfo" class="btn-add-info">
                          <i class="pi pi-plus"></i>
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" @click="closeEditSpaceModal" class="btn-secondary">
                <i class="pi pi-times"></i>
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                <i class="pi pi-check"></i>
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
    <!-- Modal de Nova Transação -->
    <div v-if="showAddTransactionModal" class="modal-overlay" @click="showAddTransactionModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><i class="pi pi-plus"></i> Nova Transação</h3>
          <button @click="showAddTransactionModal = false" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addTransaction" class="transaction-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="transaction-type"><i class="pi pi-tag"></i> Tipo</label>
                <select id="transaction-type" v-model="newTransaction.type" required class="form-input">
                  <option value="">Selecione o tipo</option>
                  <option value="receita">💰 Receita</option>
                  <option value="despesa">💸 Despesa</option>
                  <option value="transferencia">🔄 Transferência</option>
                </select>
              </div>
              <div class="form-group">
                <label for="transaction-category"><i class="pi pi-bookmark"></i> Categoria</label>
                <select id="transaction-category" v-model="newTransaction.category" required class="form-input">
                  <option value="">Selecione a categoria</option>
                  <option value="reservas">🏊 Reservas</option>
                  <option value="manutencao">🔧 Manutenção</option>
                  <option value="salarios">👥 Salários</option>
                  <option value="equipamentos">⚽ Equipamentos</option>
                  <option value="utilidades">💡 Utilidades</option>
                </select>
              </div>
              <div class="form-group">
                <label for="transaction-amount"><i class="pi pi-dollar"></i> Valor</label>
                <input 
                  id="transaction-amount" 
                  v-model.number="newTransaction.amount" 
                  type="number" 
                  step="0.01" 
                  required 
                  class="form-input"
                  placeholder="0,00"
                />
              </div>
              <div class="form-group">
                <label for="transaction-date"><i class="pi pi-calendar"></i> Data</label>
                <input 
                  id="transaction-date" 
                  v-model="newTransaction.date" 
                  type="date" 
                  required 
                  class="form-input"
                />
              </div>
              <div class="form-group full-width">
                <label for="transaction-description"><i class="pi pi-file-o"></i> Descrição</label>
                <textarea 
                  id="transaction-description" 
                  v-model="newTransaction.description" 
                  required 
                  class="form-input"
                  rows="3"
                  placeholder="Descreva a transação..."
                ></textarea>
              </div>
              <div class="form-group">
                <label for="transaction-status"><i class="pi pi-info-circle"></i> Status</label>
                <select id="transaction-status" v-model="newTransaction.status" required class="form-input">
                  <option value="concluida">✅ Concluída</option>
                  <option value="pendente">⏳ Pendente</option>
                  <option value="cancelada">❌ Cancelada</option>
                </select>
              </div>
              <div class="form-group">
                <label for="transaction-method"><i class="pi pi-credit-card"></i> Método</label>
                <select id="transaction-method" v-model="newTransaction.method" required class="form-input">
                  <option value="dinheiro">💵 Dinheiro</option>
                  <option value="cartao">💳 Cartão</option>
                  <option value="pix">📱 PIX</option>
                  <option value="transferencia">🏦 Transferência</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="showAddTransactionModal = false" class="btn-secondary">
            Cancelar
          </button>
          <button @click="addTransaction" class="btn-primary">
            <i class="pi pi-check"></i>
            Criar Transação
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Edição de Transação -->
    <div v-if="showEditTransactionModal" class="modal-overlay" @click="showEditTransactionModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><i class="pi pi-pencil"></i> Editar Transação</h3>
          <button @click="showEditTransactionModal = false" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateTransaction" class="transaction-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="edit-transaction-type"><i class="pi pi-tag"></i> Tipo</label>
                <select id="edit-transaction-type" v-model="editingTransaction.type" required class="form-input">
                  <option value="receita">💰 Receita</option>
                  <option value="despesa">💸 Despesa</option>
                  <option value="transferencia">🔄 Transferência</option>
                </select>
              </div>
              <div class="form-group">
                <label for="edit-transaction-category"><i class="pi pi-bookmark"></i> Categoria</label>
                <select id="edit-transaction-category" v-model="editingTransaction.category" required class="form-input">
                  <option value="reservas">🏊 Reservas</option>
                  <option value="manutencao">🔧 Manutenção</option>
                  <option value="salarios">👥 Salários</option>
                  <option value="equipamentos">⚽ Equipamentos</option>
                  <option value="utilidades">💡 Utilidades</option>
                </select>
              </div>
              <div class="form-group">
                <label for="edit-transaction-amount"><i class="pi pi-dollar"></i> Valor</label>
                <input 
                  id="edit-transaction-amount" 
                  v-model.number="editingTransaction.amount" 
                  type="number" 
                  step="0.01" 
                  required 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="edit-transaction-date"><i class="pi pi-calendar"></i> Data</label>
                <input 
                  id="edit-transaction-date" 
                  v-model="editingTransaction.date" 
                  type="date" 
                  required 
                  class="form-input"
                />
              </div>
              <div class="form-group full-width">
                <label for="edit-transaction-description"><i class="pi pi-file-o"></i> Descrição</label>
                <textarea 
                  id="edit-transaction-description" 
                  v-model="editingTransaction.description" 
                  required 
                  class="form-input"
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label for="edit-transaction-status"><i class="pi pi-info-circle"></i> Status</label>
                <select id="edit-transaction-status" v-model="editingTransaction.status" required class="form-input">
                  <option value="concluida">✅ Concluída</option>
                  <option value="pendente">⏳ Pendente</option>
                  <option value="cancelada">❌ Cancelada</option>
                </select>
              </div>
              <div class="form-group">
                <label for="edit-transaction-method"><i class="pi pi-credit-card"></i> Método</label>
                <select id="edit-transaction-method" v-model="editingTransaction.method" required class="form-input">
                  <option value="dinheiro">💵 Dinheiro</option>
                  <option value="cartao">💳 Cartão</option>
                  <option value="pix">📱 PIX</option>
                  <option value="transferencia">🏦 Transferência</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="showEditTransactionModal = false" class="btn-secondary">
            Cancelar
          </button>
          <button @click="updateTransaction" class="btn-primary">
            <i class="pi pi-check"></i>
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes da Transação -->
    <div v-if="showTransactionDetailsModal" class="modal-overlay" @click="showTransactionDetailsModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><i class="pi pi-eye"></i> Detalhes da Transação</h3>
          <button @click="showTransactionDetailsModal = false" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="transaction-details" v-if="selectedTransaction">
            <div class="detail-row">
              <span class="detail-label">ID:</span>
              <span class="detail-value">#{{ selectedTransaction.id }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tipo:</span>
              <span :class="['type-badge', `type-${selectedTransaction.type}`]">
                <i :class="getTransactionTypeIcon(selectedTransaction.type)"></i>
                {{ getTransactionTypeLabel(selectedTransaction.type) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Categoria:</span>
              <span class="detail-value">{{ selectedTransaction.category }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Valor:</span>
              <span :class="['detail-value', selectedTransaction.type === 'receita' ? 'positive' : 'negative']">
                {{ selectedTransaction.type === 'receita' ? '+' : '-' }}{{ formatCurrency(Math.abs(selectedTransaction.amount)) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Data:</span>
              <span class="detail-value">{{ formatDate(selectedTransaction.date) }} às {{ selectedTransaction.time }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span :class="['status-badge', `status-${selectedTransaction.status}`]">
                <i :class="getTransactionStatusIcon(selectedTransaction.status)"></i>
                {{ getTransactionStatusLabel(selectedTransaction.status) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Método:</span>
              <span class="detail-value">{{ selectedTransaction.method }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Descrição:</span>
              <span class="detail-value">{{ selectedTransaction.description }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showTransactionDetailsModal = false" class="btn-secondary">
            Fechar
          </button>
          <button @click="editTransaction(selectedTransaction)" class="btn-primary">
            <i class="pi pi-pencil"></i>
            Editar
          </button>
        </div>
      </div>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useSpacesStore } from '../stores/spaces';
import Button from 'primevue/button';

const router = useRouter();
const authStore = useAuthStore();
const spacesStore = useSpacesStore();

// Active section control
const activeSection = ref('overview');

// Notifications
const showNotifications = ref(false);
const notifications = ref([
  {
    id: 1,
    type: 'warning',
    message: 'Manutenção',
    time: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    read: false
  },
  {
    id: 2,
    type: 'success',
    message: 'Pagamento de R$ 150,00 foi aprovado',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    read: false
  },
  {
    id: 3,
    type: 'info',
    message: '5 novas reservas para amanhã',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h ago
    read: true
  },
  {
    id: 4,
    type: 'error',
    message: 'Falha no sistema de pagamento',
    time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h ago
    read: false
  },
  {
    id: 5,
    type: 'info',
    message: 'Novo usuário cadastrado: Maria Silva',
    time: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8h ago
    read: true
  }
]);

// Stats
const selectedPeriod = ref('today');
const statsData = ref({
  today: {
    revenue: 2850,
    revenueTrend: 12,
    activeUsers: 150,
    newUsers: 8,
    reservations: 45,
    reservationsTrend: 15,
    availableSpaces: 12,
    occupancyRate: 78
  },
  week: {
    revenue: 18500,
    revenueTrend: 8,
    activeUsers: 180,
    newUsers: 25,
    reservations: 280,
    reservationsTrend: 10,
    availableSpaces: 12,
    occupancyRate: 85
  },
  month: {
    revenue: 75000,
    revenueTrend: -3,
    activeUsers: 220,
    newUsers: 45,
    reservations: 1150,
    reservationsTrend: -5,
    availableSpaces: 12,
    occupancyRate: 82
  }
});

// System Alerts
const systemAlerts = ref([
  {
    id: 1,
    type: 'warning',
    title: 'Manutenção',
    message: 'Manutenção',
    time: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: 2,
    type: 'info',
    title: 'Backup Automático',
    message: 'Backup do sistema será executado às 23:00',
    time: new Date(Date.now() - 30 * 60 * 1000)
  }
]);

// Computed
const unreadNotifications = computed(() => 
  notifications.value.filter(n => !n.read).length
);

const recentNotifications = computed(() => 
  notifications.value.slice(0, 5)
);

const currentStats = computed(() => 
  statsData.value[selectedPeriod.value]
);

// Overview stats computed properties
const totalUsers = computed(() => 1248);
const totalSpaces = computed(() => 45);
const totalReservations = computed(() => 89);
const monthlyRevenue = computed(() => 'R$ 42.650,00');

// User management variables
const showNewUserModal = ref(false);
const showEditUserModal = ref(false);
const showPromoteModal = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);

const userFilters = ref({
  type: '',
  search: ''
});

const editingUser = ref({
  id: null,
  name: '',
  email: '',
  cpf: '',
  type: 'cliente',
  status: 'ativo',
  permissions: {
    manageSpaces: false,
    manageReservations: false,
    manageUsers: false,
    viewReports: false
  }
});

const promotingUser = ref(null);
const newUserType = ref('');

const newUser = ref({
  name: '',
  email: '',
  cpf: '',
  type: '',
  status: 'ativo',
  permissions: {
    manageSpaces: false,
    manageReservations: false,
    manageUsers: false,
    viewReports: false
  }
});

// Reservation management variables
const showEditReservationModal = ref(false);
const currentReservationPage = ref(1);
const itemsPerPageReservations = ref(10);

const reservationFilters = ref({
  status: '',
  space: '',
  period: '',
  search: ''
});

const editingReservation = ref({
  id: null,
  userName: '',
  userEmail: '',
  space: '',
  date: '',
  startTime: '',
  endTime: '',
  status: '',
  value: 0,
  notes: ''
});

// Reservations data
const allReservations = ref([
  {
    id: 1,
    userId: 1,
    userName: 'João Silva',
    userEmail: 'joao.silva@email.com',
    space: 'quadra-futebol',
    date: '2024-08-10',
    startTime: '14:00',
    endTime: '16:00',
    status: 'confirmada',
    value: 120.00,
    notes: 'Torneio da empresa',
    createdAt: '2024-08-05'
  },
  {
    id: 2,
    userId: 2,
    userName: 'Maria Santos',
    userEmail: 'maria.santos@email.com',
    space: 'piscina',
    date: '2024-08-11',
    startTime: '08:00',
    endTime: '10:00',
    status: 'pendente',
    value: 80.00,
    notes: 'Aula de natação particular',
    createdAt: '2024-08-06'
  },
  {
    id: 3,
    userId: 3,
    userName: 'Pedro Oliveira',
    userEmail: 'pedro.oliveira@email.com',
    space: 'quadra-volei',
    date: '2024-08-09',
    startTime: '18:00',
    endTime: '20:00',
    status: 'concluida',
    value: 100.00,
    notes: 'Treino regular da equipe',
    createdAt: '2024-08-03'
  },
  {
    id: 4,
    userId: 4,
    userName: 'Ana Costa',
    userEmail: 'ana.costa@email.com',
    space: 'academia',
    date: '2024-08-12',
    startTime: '07:00',
    endTime: '08:00',
    status: 'confirmada',
    value: 50.00,
    notes: 'Treino funcional',
    createdAt: '2024-08-07'
  },
  {
    id: 5,
    userId: 1,
    userName: 'João Silva',
    userEmail: 'joao.silva@email.com',
    space: 'quadra-futebol',
    date: '2024-08-15',
    startTime: '19:00',
    endTime: '21:00',
    status: 'cancelada',
    value: 120.00,
    notes: 'Cancelado por chuva',
    createdAt: '2024-08-08'
  }
]);

// Users data
const allUsers = ref([
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@email.com',
    cpf: '12345678901',
    type: 'cliente',
    status: 'ativo',
    createdAt: '2024-01-15',
    permissions: {
      manageSpaces: false,
      manageReservations: false,
      manageUsers: false,
      viewReports: false
    }
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    cpf: '98765432109',
    type: 'tecnico',
    status: 'ativo',
    createdAt: '2024-02-20',
    permissions: {
      manageSpaces: true,
      manageReservations: true,
      manageUsers: false,
      viewReports: false
    }
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    cpf: '45678912345',
    type: 'admin',
    status: 'ativo',
    createdAt: '2024-01-10',
    permissions: {
      manageSpaces: true,
      manageReservations: true,
      manageUsers: true,
      viewReports: true
    }
  },
  {
    id: 4,
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    cpf: '78912345678',
    type: 'cliente',
    status: 'inativo',
    createdAt: '2024-03-05',
    permissions: {
      manageSpaces: false,
      manageReservations: false,
      manageUsers: false,
      viewReports: false
    }
  },
  {
    id: 5,
    name: 'Carlos Lima',
    email: 'carlos.lima@email.com',
    cpf: '32165498712',
    type: 'tecnico',
    status: 'ativo',
    createdAt: '2024-02-28',
    permissions: {
      manageSpaces: true,
      manageReservations: false,
      manageUsers: false,
      viewReports: false
    }
  }
]);

// User management computed properties
const totalUsersCount = computed(() => allUsers.value.length);
const clientUsers = computed(() => allUsers.value.filter(u => u.type === 'cliente').length);
const technicianUsers = computed(() => allUsers.value.filter(u => u.type === 'tecnico').length);
const adminUsers = computed(() => allUsers.value.filter(u => u.type === 'admin').length);

const filteredUsers = computed(() => {
  let filtered = allUsers.value;
  
  if (userFilters.value.type) {
    filtered = filtered.filter(user => user.type === userFilters.value.type);
  }
  
  if (userFilters.value.search) {
    const search = userFilters.value.search.toLowerCase();
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(search) || 
      user.email.toLowerCase().includes(search)
    );
  }
  
  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

// Reservations computed properties
const filteredReservations = computed(() => {
  let filtered = [...allReservations.value];

  // Filter by status
  if (reservationFilters.value.status) {
    filtered = filtered.filter(reservation => 
      reservation.status === reservationFilters.value.status
    );
  }

  // Filter by space
  if (reservationFilters.value.space) {
    filtered = filtered.filter(reservation => 
      reservation.space === reservationFilters.value.space
    );
  }

  // Filter by period
  if (reservationFilters.value.period) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    if (reservationFilters.value.period === 'hoje') {
      filtered = filtered.filter(reservation => reservation.date === todayStr);
    } else if (reservationFilters.value.period === 'semana') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      filtered = filtered.filter(reservation => {
        const reservationDate = new Date(reservation.date);
        return reservationDate >= weekStart && reservationDate <= weekEnd;
      });
    } else if (reservationFilters.value.period === 'mes') {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      filtered = filtered.filter(reservation => {
        const reservationDate = new Date(reservation.date);
        return reservationDate >= monthStart && reservationDate <= monthEnd;
      });
    }
  }

  // Filter by search (user name or ID)
  if (reservationFilters.value.search) {
    const searchTerm = reservationFilters.value.search.toLowerCase();
    filtered = filtered.filter(reservation => 
      reservation.userName.toLowerCase().includes(searchTerm) ||
      reservation.userEmail.toLowerCase().includes(searchTerm) ||
      reservation.id.toString().includes(searchTerm)
    );
  }

  return filtered;
});

const totalReservationPages = computed(() => 
  Math.ceil(filteredReservations.value.length / itemsPerPageReservations.value)
);

const paginatedReservations = computed(() => {
  const start = (currentReservationPage.value - 1) * itemsPerPageReservations.value;
  const end = start + itemsPerPageReservations.value;
  return filteredReservations.value.slice(start, end);
});

// Space management variables
const showNewSpaceModal = ref(false);
const showEditSpaceModal = ref(false);
const currentSpacePage = ref(1);
const spacesPerPage = ref(10);

const spaceFilters = ref({
  status: '',
  type: '',
  capacity: '',
  search: ''
});

const newSpace = ref({
  name: '',
  type: '',
  capacity: 0,
  pricePerHour: 0,
  description: '',
  status: 'ativo',
  location: '',
  photoFiles: []
});

const editingSpace = ref({
  id: null,
  name: '',
  type: '',
  capacity: 0,
  pricePerHour: 0,
  description: '',
  status: 'ativo',
  location: ''
});

// Spaces data - usando dados do store principal
const allSpaces = computed(() => {
  return spacesStore.spaces.map(space => ({
    id: space.id,
    name: space.name,
    type: space.type || space.modality,
    capacity: space.capacity || 0,
    pricePerHour: space.hourlyRate || 0,
    description: space.description || '',
    status: space.status === 'Disponível' ? 'ativo' : 
            space.status === 'Manutenção' ? 'manutencao' : 'inativo',
    location: space.address || '',
    createdAt: new Date().toISOString().split('T')[0]
  }));
});

// Spaces computed properties
const filteredSpaces = computed(() => {
  let filtered = [...allSpaces.value];

  // Filter by status
  if (spaceFilters.value.status) {
    filtered = filtered.filter(space => 
      space.status === spaceFilters.value.status
    );
  }

  // Filter by type
  if (spaceFilters.value.type) {
    filtered = filtered.filter(space => 
      space.type === spaceFilters.value.type
    );
  }

  // Filter by capacity
  if (spaceFilters.value.capacity) {
    const capacityFilter = spaceFilters.value.capacity;
    if (capacityFilter === 'pequeno') {
      filtered = filtered.filter(space => space.capacity <= 10);
    } else if (capacityFilter === 'medio') {
      filtered = filtered.filter(space => space.capacity > 10 && space.capacity <= 30);
    } else if (capacityFilter === 'grande') {
      filtered = filtered.filter(space => space.capacity > 30);
    }
  }

  // Filter by search
  if (spaceFilters.value.search) {
    const search = spaceFilters.value.search.toLowerCase();
    filtered = filtered.filter(space => 
      space.name.toLowerCase().includes(search) || 
      space.description.toLowerCase().includes(search)
    );
  }

  return filtered;
});

const totalSpacePages = computed(() => Math.ceil(filteredSpaces.value.length / spacesPerPage.value));

const spacePageNumbers = computed(() => {
  const pages = [];
  const start = Math.max(1, currentSpacePage.value - 2);
  const end = Math.min(totalSpacePages.value, currentSpacePage.value + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const paginatedSpaces = computed(() => {
  const start = (currentSpacePage.value - 1) * spacesPerPage.value;
  const end = start + spacesPerPage.value;
  return filteredSpaces.value.slice(start, end);
});

// Financial management variables
const showAddTransactionModal = ref(false);
const showEditTransactionModal = ref(false);
const showTransactionDetailsModal = ref(false);
const showPaymentSettingsModal = ref(false);
const currentFinancePage = ref(1);
const itemsPerPageFinance = ref(15);

// Reports Variables
const showReportModal = ref(false);
const showReportDetailsModal = ref(false);
const selectedReport = ref(null);
const currentPageReports = ref(1);
const itemsPerPageReports = ref(10);

const reportFilters = ref({
  type: '',
  period: '',
  status: '',
  search: ''
});

const newReport = ref({
  name: '',
  description: '',
  type: '',
  format: 'pdf',
  startDate: '',
  endDate: '',
  includeCharts: true,
  includeDetails: true,
  includeComparison: false,
  scheduled: false,
  frequency: 'monthly'
});

const reportStats = ref({
  reservations: 45,
  users: 23,
  financial: 67,
  spaces: 15
});

const reports = ref([
  {
    id: 1,
    name: 'Relatório Mensal de Reservas',
    description: 'Análise completa das reservas realizadas no mês',
    type: 'reservations',
    createdAt: new Date('2025-08-01'),
    period: 'Julho 2025',
    status: 'completed',
    size: 2048576,
    stats: {
      records: 1250,
      charts: 8,
      processingTime: 45
    }
  },
  {
    id: 2,
    name: 'Análise de Usuários Ativos',
    description: 'Relatório de engajamento e atividade dos usuários',
    type: 'users',
    createdAt: new Date('2025-08-02'),
    period: 'Último trimestre',
    status: 'completed',
    size: 1536000,
    stats: {
      records: 890,
      charts: 6,
      processingTime: 32
    }
  },
  {
    id: 3,
    name: 'Demonstrativo Financeiro',
    description: 'Receitas, despesas e análise de lucratividade',
    type: 'financial',
    createdAt: new Date('2025-08-03'),
    period: 'Primeiro semestre 2025',
    status: 'completed',
    size: 3072000,
    stats: {
      records: 2150,
      charts: 12,
      processingTime: 78
    }
  },
  {
    id: 4,
    name: 'Ocupação de Espaços',
    description: 'Taxa de ocupação e utilização dos espaços esportivos',
    type: 'spaces',
    createdAt: new Date('2025-08-04'),
    period: 'Julho 2025',
    status: 'generating',
    size: 0,
    stats: {
      records: 0,
      charts: 0,
      processingTime: 0
    }
  },
  {
    id: 5,
    name: 'Analytics de Performance',
    description: 'Métricas gerais de performance do sistema',
    type: 'analytics',
    createdAt: new Date('2025-08-05'),
    period: 'Última semana',
    status: 'completed',
    size: 1024000,
    stats: {
      records: 560,
      charts: 15,
      processingTime: 28
    }
  },
  {
    id: 6,
    name: 'Relatório de Receitas',
    description: 'Análise detalhada das receitas por categoria',
    type: 'financial',
    createdAt: new Date('2025-08-06'),
    period: 'Agosto 2025',
    status: 'failed',
    size: 0,
    stats: {
      records: 0,
      charts: 0,
      processingTime: 0
    }
  },
  {
    id: 7,
    name: 'Cadastros de Novos Usuários',
    description: 'Relatório de crescimento da base de usuários',
    type: 'users',
    createdAt: new Date('2025-08-07'),
    period: 'Último mês',
    status: 'completed',
    size: 512000,
    stats: {
      records: 340,
      charts: 4,
      processingTime: 18
    }
  },
  {
    id: 8,
    name: 'Reservas por Modalidade',
    description: 'Análise das reservas segmentada por modalidade esportiva',
    type: 'reservations',
    createdAt: new Date('2025-08-08'),
    period: 'Agosto 2025',
    status: 'completed',
    size: 1792000,
    stats: {
      records: 920,
      charts: 7,
      processingTime: 41
    }
  }
]);

const financialFilters = ref({
  type: '',
  category: '',
  period: '',
  search: ''
});

const newTransaction = ref({
  type: '',
  category: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  description: '',
  status: 'concluida',
  method: 'dinheiro'
});

const editingTransaction = ref({});
const selectedTransaction = ref(null);

// Financial data
const financialData = ref({
  totalRevenue: 45720.50,
  totalExpenses: 32180.25,
  netProfit: 13540.25,
  pendingPayments: 8950.00,
  pendingCount: 12
});

const allTransactions = ref([
  {
    id: 1,
    type: 'receita',
    category: 'reservas',
    amount: 450.00,
    date: '2024-12-01',
    time: '14:30',
    description: 'Reserva da Quadra de Futebol - João Silva',
    status: 'concluida',
    method: 'pix'
  },
  {
    id: 2,
    type: 'despesa',
    category: 'manutencao',
    amount: 320.00,
    date: '2024-12-02',
    time: '09:15',
    description: 'Manutenção',
    status: 'concluida',
    method: 'transferencia'
  },
  {
    id: 3,
    type: 'receita',
    category: 'reservas',
    amount: 280.00,
    date: '2024-12-02',
    time: '16:45',
    description: 'Reserva da Academia - Maria Santos',
    status: 'pendente',
    method: 'cartao'
  },
  {
    id: 4,
    type: 'despesa',
    category: 'equipamentos',
    amount: 1500.00,
    date: '2024-12-03',
    time: '11:20',
    description: 'Compra de novos equipamentos para academia',
    status: 'concluida',
    method: 'transferencia'
  },
  {
    id: 5,
    type: 'receita',
    category: 'reservas',
    amount: 600.00,
    date: '2024-12-03',
    time: '18:00',
    description: 'Reserva da Piscina - Evento corporativo',
    status: 'concluida',
    method: 'pix'
  },
  {
    id: 6,
    type: 'despesa',
    category: 'salarios',
    amount: 8500.00,
    date: '2024-12-05',
    time: '10:00',
    description: 'Pagamento de salários - Dezembro',
    status: 'concluida',
    method: 'transferencia'
  },
  {
    id: 7,
    type: 'despesa',
    category: 'utilidades',
    amount: 890.50,
    date: '2024-12-06',
    time: '14:20',
    description: 'Conta de energia elétrica',
    status: 'pendente',
    method: 'transferencia'
  },
  {
    id: 8,
    type: 'receita',
    category: 'reservas',
    amount: 380.00,
    date: '2024-12-07',
    time: '13:15',
    description: 'Reserva da Quadra de Vôlei - Treino escolar',
    status: 'concluida',
    method: 'dinheiro'
  },
  {
    id: 9,
    type: 'transferencia',
    category: 'utilidades',
    amount: 450.00,
    date: '2024-12-08',
    time: '09:30',
    description: 'Transferência para conta de reserva',
    status: 'concluida',
    method: 'transferencia'
  },
  {
    id: 10,
    type: 'receita',
    category: 'reservas',
    amount: 520.00,
    date: '2024-12-08',
    time: '15:45',
    description: 'Reserva da Quadra de Basquete - Torneio estudantil',
    status: 'pendente',
    method: 'pix'
  },
  {
    id: 11,
    type: 'despesa',
    category: 'manutencao',
    amount: 750.00,
    date: '2024-12-09',
    time: '08:00',
    description: 'Reparo no sistema de filtragem da piscina',
    status: 'concluida',
    method: 'cartao'
  },
  {
    id: 12,
    type: 'receita',
    category: 'reservas',
    amount: 340.00,
    date: '2024-12-09',
    time: '19:30',
    description: 'Reserva da Academia - Personal trainer',
    status: 'concluida',
    method: 'pix'
  },
  {
    id: 13,
    type: 'despesa',
    category: 'equipamentos',
    amount: 280.00,
    date: '2024-12-10',
    time: '12:10',
    description: 'Compra de bolas e materiais esportivos',
    status: 'pendente',
    method: 'cartao'
  },
  {
    id: 14,
    type: 'receita',
    category: 'reservas',
    amount: 720.00,
    date: '2024-12-10',
    time: '17:00',
    description: 'Reserva múltipla - Evento de fim de ano',
    status: 'concluida',
    method: 'transferencia'
  },
  {
    id: 15,
    type: 'despesa',
    category: 'utilidades',
    amount: 420.80,
    date: '2024-12-11',
    time: '11:45',
    description: 'Conta de água',
    status: 'concluida',
    method: 'transferencia'
  }
]);

// Financial computed properties
const filteredTransactions = computed(() => {
  let filtered = [...allTransactions.value];

  // Filter by type
  if (financialFilters.value.type) {
    filtered = filtered.filter(transaction => 
      transaction.type === financialFilters.value.type
    );
  }

  // Filter by category
  if (financialFilters.value.category) {
    filtered = filtered.filter(transaction => 
      transaction.category === financialFilters.value.category
    );
  }

  // Filter by period
  if (financialFilters.value.period) {
    const today = new Date();
    const transactionDate = new Date();
    
    filtered = filtered.filter(transaction => {
      const tDate = new Date(transaction.date);
      
      switch (financialFilters.value.period) {
        case 'hoje':
          return tDate.toDateString() === today.toDateString();
        case 'semana':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return tDate >= weekAgo;
        case 'mes':
          return tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear();
        case 'trimestre':
          const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
          return tDate >= quarterStart;
        case 'ano':
          return tDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });
  }

  // Filter by search
  if (financialFilters.value.search) {
    const searchLower = financialFilters.value.search.toLowerCase();
    filtered = filtered.filter(transaction =>
      transaction.description.toLowerCase().includes(searchLower) ||
      transaction.id.toString().includes(searchLower) ||
      transaction.amount.toString().includes(searchLower)
    );
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
});

const totalFinancePages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPageFinance.value);
});

const paginatedTransactions = computed(() => {
  const start = (currentFinancePage.value - 1) * itemsPerPageFinance.value;
  const end = start + itemsPerPageFinance.value;
  return filteredTransactions.value.slice(start, end);
});

// Reports computed properties
const filteredReports = computed(() => {
  let filtered = [...reports.value];

  // Filter by type
  if (reportFilters.value.type) {
    filtered = filtered.filter(report => 
      report.type === reportFilters.value.type
    );
  }

  // Filter by period
  if (reportFilters.value.period) {
    const now = new Date();
    const filterDate = new Date();
    
    switch (reportFilters.value.period) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(report => 
          new Date(report.createdAt) >= filterDate
        );
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        filtered = filtered.filter(report => 
          new Date(report.createdAt) >= filterDate
        );
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        filtered = filtered.filter(report => 
          new Date(report.createdAt) >= filterDate
        );
        break;
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3);
        filtered = filtered.filter(report => 
          new Date(report.createdAt) >= filterDate
        );
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        filtered = filtered.filter(report => 
          new Date(report.createdAt) >= filterDate
        );
        break;
    }
  }

  // Filter by status
  if (reportFilters.value.status) {
    filtered = filtered.filter(report => 
      report.status === reportFilters.value.status
    );
  }

  // Filter by search
  if (reportFilters.value.search) {
    const searchTerm = reportFilters.value.search.toLowerCase();
    filtered = filtered.filter(report => 
      report.name.toLowerCase().includes(searchTerm) ||
      report.description.toLowerCase().includes(searchTerm)
    );
  }

  return filtered;
});

const totalPagesReports = computed(() => {
  return Math.ceil(filteredReports.value.length / itemsPerPageReports.value);
});

const paginatedReports = computed(() => {
  const start = (currentPageReports.value - 1) * itemsPerPageReports.value;
  const end = start + itemsPerPageReports.value;
  return filteredReports.value.slice(start, end);
});

// Methods
const goHome = () => {
  router.push('/');
};

const logout = () => {
  authStore.logout();
  router.push('/');
};

// Navigation methods
const goToUsers = () => {
  activeSection.value = 'users';
};

// User management methods
const applyUserFilters = () => {
  currentPage.value = 1; // Reset to first page when filtering
};

const formatCPF = (cpf) => {
  if (!cpf) return '';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
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
  editingUser.value = {
    ...user,
    permissions: { ...user.permissions }
  };
  showEditUserModal.value = true;
};

const closeEditModal = () => {
  showEditUserModal.value = false;
  editingUser.value = {
    id: null,
    name: '',
    email: '',
    cpf: '',
    type: 'cliente',
    status: 'ativo',
    permissions: {
      manageSpaces: false,
      manageReservations: false,
      manageUsers: false,
      viewReports: false
    }
  };
};

const formatCPFInput = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  editingUser.value.cpf = value;
};

const saveUserChanges = () => {
  const userIndex = allUsers.value.findIndex(u => u.id === editingUser.value.id);
  if (userIndex !== -1) {
    // Remove formatação do CPF antes de salvar
    const cpfNumbers = editingUser.value.cpf.replace(/\D/g, '');
    
    // Atualiza o usuário
    allUsers.value[userIndex] = {
      ...editingUser.value,
      cpf: cpfNumbers
    };
    
    closeEditModal();
    
    alert(`Usuário ${editingUser.value.name} atualizado com sucesso!`);
  }
};

const manageUserPermissions = (user) => {
  showPermissionsModal.value = true;
  selectedUser.value = user;
};

const openPromoteModal = (user) => {
  promotingUser.value = user;
  newUserType.value = '';
  showPromoteModal.value = true;
};

const closePromoteModal = () => {
  showPromoteModal.value = false;
  promotingUser.value = null;
  newUserType.value = '';
};

const getTypeLabel = (type) => {
  const labels = {
    cliente: 'Cliente',
    tecnico: 'Técnico',
    admin: 'Administrador'
  };
  return labels[type] || type;
};

const confirmUserTypeChange = () => {
  if (promotingUser.value && newUserType.value) {
    // Encontrar o usuário na lista
    const userIndex = allUsers.value.findIndex(u => u.id === promotingUser.value.id);
    if (userIndex !== -1) {
      // Atualizar o tipo do usuário
      allUsers.value[userIndex].type = newUserType.value;
      
      // Atualizar permissões baseadas no novo tipo
      if (newUserType.value === 'cliente') {
        allUsers.value[userIndex].permissions = {
          manageSpaces: false,
          manageReservations: false,
          manageUsers: false,
          viewReports: false
        };
      } else if (newUserType.value === 'tecnico') {
        allUsers.value[userIndex].permissions = {
          manageSpaces: true,
          manageReservations: true,
          manageUsers: false,
          viewReports: false
        };
      } else if (newUserType.value === 'admin') {
        allUsers.value[userIndex].permissions = {
          manageSpaces: true,
          manageReservations: true,
          manageUsers: true,
          viewReports: true
        };
      }
      
      console.log(`Usuário ${promotingUser.value.name} promovido para ${getTypeLabel(newUserType.value)}`);
      alert(`Usuário ${promotingUser.value.name} alterado para ${getTypeLabel(newUserType.value)} com sucesso!`);
    }
    
    closePromoteModal();
  }
};

const closeNewUserModal = () => {
  showNewUserModal.value = false;
  newUser.value = {
    name: '',
    email: '',
    cpf: '',
    type: '',
    status: 'ativo',
    permissions: {
      manageSpaces: false,
      manageReservations: false,
      manageUsers: false,
      viewReports: false
    }
  };
};

const formatNewUserCPF = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  
  newUser.value.cpf = value;
  event.target.value = value;
};

const createNewUser = () => {
  // Validar se CPF já existe
  const cpfExists = allUsers.value.some(user => user.cpf === newUser.value.cpf.replace(/\D/g, ''));
  if (cpfExists) {
    alert('Este CPF já está cadastrado no sistema!');
    return;
  }

  // Validar se email já existe
  const emailExists = allUsers.value.some(user => user.email === newUser.value.email);
  if (emailExists) {
    alert('Este email já está cadastrado no sistema!');
    return;
  }

  // Configurar permissões baseadas no tipo
  let permissions = {
    manageSpaces: false,
    manageReservations: false,
    manageUsers: false,
    viewReports: false
  };

  if (newUser.value.type === 'tecnico') {
    permissions = {
      manageSpaces: newUser.value.permissions.manageSpaces,
      manageReservations: newUser.value.permissions.manageReservations,
      manageUsers: false,
      viewReports: false
    };
  } else if (newUser.value.type === 'admin') {
    permissions = {
      manageSpaces: newUser.value.permissions.manageSpaces,
      manageReservations: newUser.value.permissions.manageReservations,
      manageUsers: newUser.value.permissions.manageUsers,
      viewReports: newUser.value.permissions.viewReports
    };
  }

  // Criar novo usuário
  const nextId = Math.max(...allUsers.value.map(u => u.id)) + 1;
  const newUserData = {
    id: nextId,
    name: newUser.value.name,
    email: newUser.value.email,
    cpf: newUser.value.cpf.replace(/\D/g, ''),
    type: newUser.value.type,
    status: newUser.value.status,
    createdAt: new Date().toISOString().split('T')[0],
    permissions: permissions
  };

  // Adicionar à lista
  allUsers.value.push(newUserData);

  console.log('Novo usuário criado:', newUserData);
  alert(`Usuário ${newUser.value.name} criado com sucesso!`);

  closeNewUserModal();
};

const toggleUserStatus = (user) => {
  user.status = user.status === 'ativo' ? 'inativo' : 'ativo';
  console.log(`Usuário ${user.name} ${user.status === 'ativo' ? 'ativado' : 'desativado'}`);
};

// Reservation management methods
const applyReservationFilters = () => {
  currentReservationPage.value = 1; // Reset to first page when filtering
};

const getSpaceLabel = (space) => {
  const labels = {
    'quadra-futebol': 'Quadra de Futebol',
    'quadra-volei': 'Quadra de Vôlei',
    'piscina': 'Piscina',
    'academia': 'Academia'
  };
  return labels[space] || space;
};

const getStatusLabel = (status) => {
  const labels = {
    'pendente': 'Pendente',
    'confirmada': 'Confirmada',
    'concluida': 'Concluída',
    'cancelada': 'Cancelada'
  };
  return labels[status] || status;
};

const getSpaceIcon = (space) => {
  const icons = {
    'quadra-futebol': '⚽',
    'quadra-volei': '🏐',
    'piscina': '🏊',
    'academia': '💪'
  };
  return icons[space] || '🏢';
};

const getStatusIcon = (status) => {
  const icons = {
    'pendente': 'pi pi-clock',
    'confirmada': 'pi pi-check-circle',
    'concluida': 'pi pi-calendar-check',
    'cancelada': 'pi pi-times-circle'
  };
  return icons[status] || 'pi pi-info-circle';
};

const getDayName = (dateString) => {
  const date = new Date(dateString);
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return days[date.getDay()];
};

const clearReservationFilters = () => {
  reservationFilters.value = {
    status: '',
    space: '',
    period: '',
    search: ''
  };
  applyReservationFilters();
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const editReservation = (reservation) => {
  editingReservation.value = { ...reservation };
  showEditReservationModal.value = true;
};

const closeEditReservationModal = () => {
  showEditReservationModal.value = false;
  editingReservation.value = {
    id: null,
    userName: '',
    userEmail: '',
    space: '',
    date: '',
    startTime: '',
    endTime: '',
    status: '',
    value: 0,
    notes: ''
  };
};

const saveReservationChanges = () => {
  const reservationIndex = allReservations.value.findIndex(r => r.id === editingReservation.value.id);
  if (reservationIndex !== -1) {
    // Update the reservation
    allReservations.value[reservationIndex] = { ...editingReservation.value };
    
    console.log('Reserva atualizada:', editingReservation.value);
    alert(`Reserva #${editingReservation.value.id} atualizada com sucesso!`);
    
    closeEditReservationModal();
  }
};

const changeReservationStatus = (reservation) => {
  const statusOptions = ['pendente', 'confirmada', 'concluida', 'cancelada'];
  const currentIndex = statusOptions.indexOf(reservation.status);
  const nextIndex = (currentIndex + 1) % statusOptions.length;
  
  reservation.status = statusOptions[nextIndex];
  console.log(`Status da reserva #${reservation.id} alterado para: ${getStatusLabel(reservation.status)}`);
  alert(`Status da reserva #${reservation.id} alterado para: ${getStatusLabel(reservation.status)}`);
};

const cancelReservation = (reservation) => {
  if (confirm(`Tem certeza que deseja cancelar a reserva #${reservation.id}?`)) {
    reservation.status = 'cancelada';
    console.log(`Reserva #${reservation.id} cancelada`);
    alert(`Reserva #${reservation.id} foi cancelada com sucesso!`);
  }
};

// Space management methods
const applySpaceFilters = () => {
  console.log('Filtros de espaços aplicados:', spaceFilters.value);
  currentSpacePage.value = 1; // Reset to first page
};

const clearSpaceFilters = () => {
  spaceFilters.value = {
    status: '',
    type: '',
    capacity: '',
    search: ''
  };
  currentSpacePage.value = 1;
};

const editSpace = (space) => {
  console.log('🔧 AdminDashboard: Preparando edição do espaço:', space);
  
  // Mapear dados do store para o formato do formulário (address -> location)
  editingSpace.value = { 
    id: space.id,
    name: space.name,
    type: space.type,
    capacity: space.capacity,
    pricePerHour: space.pricePerHour,
    location: space.location || space.address || '', // MAPEAR address -> location
    description: space.description,
    status: space.status,
    customInfo: space.customInfo || [] // Garantir que customInfo seja um array
  };
  
  console.log('📋 Dados preparados para edição:', editingSpace.value);
  showEditSpaceModal.value = true;
};

const closeEditSpaceModal = () => {
  showEditSpaceModal.value = false;
  editingSpace.value = {
    id: null,
    name: '',
    type: '',
    capacity: 0,
    pricePerHour: 0,
    description: '',
    status: 'ativo',
    location: '',
    customInfo: []
  };
  // Reset do formulário de nova informação
  newCustomInfo.value = {
    icon: '',
    title: '',
    description: ''
  };
};

// Funções para gerenciar informações customizáveis
const addCustomInfo = () => {
  if (newCustomInfo.value.icon && newCustomInfo.value.title && newCustomInfo.value.description) {
    if (!editingSpace.value.customInfo) {
      editingSpace.value.customInfo = [];
    }
    editingSpace.value.customInfo.push({ ...newCustomInfo.value });
    newCustomInfo.value = {
      icon: '',
      title: '',
      description: ''
    };
  }
};

const removeCustomInfo = (index) => {
  if (editingSpace.value.customInfo && index >= 0 && index < editingSpace.value.customInfo.length) {
    editingSpace.value.customInfo.splice(index, 1);
  }
};

const updateSpace = () => {
  console.log('🔧 AdminDashboard: Atualizando espaço');
  console.log('📋 Dados do formulário:', editingSpace.value);
  
  // Verificar se campos obrigatórios estão preenchidos
  if (!editingSpace.value.name?.trim()) {
    alert('Nome do espaço é obrigatório!');
    return;
  }
  
  if (!editingSpace.value.location?.trim()) {
    alert('Localização é obrigatória!');
    return;
  }
  
  // Preparar dados para o store (mapeando location -> address)
  const updatedData = {
    name: editingSpace.value.name.trim(),
    type: editingSpace.value.type,
    modality: editingSpace.value.type, // Usar o mesmo valor para type e modality
    capacity: parseInt(editingSpace.value.capacity) || 10,
    hourlyRate: parseFloat(editingSpace.value.pricePerHour) || 50,
    address: editingSpace.value.location.trim(), // MAPEAR location -> address
    description: editingSpace.value.description?.trim() || '',
    status: editingSpace.value.status === 'ativo' ? 'Disponível' : 
            editingSpace.value.status === 'manutencao' ? 'Manutenção' : 'Indisponível',
    customInfo: editingSpace.value.customInfo || []
  };
  
  console.log('📊 Dados preparados para atualização:', updatedData);
  
  // Atualizar no store
  const success = spacesStore.updateSpace(editingSpace.value.id, updatedData);
  
  if (success) {
    console.log('✅ Espaço atualizado com sucesso!');
    alert(`Espaço "${success.name}" atualizado com sucesso!`);
    closeEditSpaceModal();
  } else {
    console.error('❌ Falha ao atualizar espaço');
    alert('Erro ao atualizar espaço. Tente novamente.');
  }
};

const handlePhotoUpload = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 3) {
    alert('Você pode selecionar no máximo 3 fotos!');
    event.target.value = ''; // Limpar input
    return;
  }
  newSpace.value.photoFiles = files;
  console.log(`📸 ${files.length} foto(s) selecionada(s)`);
};

const closeNewSpaceModal = () => {
  showNewSpaceModal.value = false;
  newSpace.value = {
    name: '',
    type: '',
    capacity: 0,
    pricePerHour: 0,
    description: '',
    status: 'ativo',
    location: '',
    photoFiles: []
  };
};

const createSpace = () => {
  console.log('🔧 AdminDashboard: Criando novo espaço');
  console.log('📋 Dados do formulário:', newSpace.value);
  
  // Verificar se campos obrigatórios estão preenchidos
  if (!newSpace.value.name?.trim()) {
    alert('Nome do espaço é obrigatório!');
    return;
  }
  
  if (!newSpace.value.location?.trim()) {
    alert('Localização é obrigatória!');
    return;
  }
  
  // Preparar dados para o store (mapeando location -> address)
  const spaceData = {
    name: newSpace.value.name.trim(),
    type: newSpace.value.type,
    modality: newSpace.value.type, // Usar o mesmo valor para type e modality
    capacity: parseInt(newSpace.value.capacity) || 10,
    hourlyRate: parseFloat(newSpace.value.pricePerHour) || 50,
    address: newSpace.value.location.trim(), // MAPEAR location -> address
    description: newSpace.value.description?.trim() || '',
    status: newSpace.value.status === 'ativo' ? 'Disponível' : 
            newSpace.value.status === 'manutencao' ? 'Manutenção' : 'Indisponível',
    photos: newSpace.value.photoFiles || []
  };
  
  console.log('📊 Dados preparados para o store:', spaceData);
  
  // Adicionar no store
  const createdSpace = spacesStore.addSpace(spaceData);
  
  if (createdSpace) {
    console.log('✅ Espaço criado com sucesso!');
    alert(`Espaço "${createdSpace.name}" criado com sucesso!`);
    closeNewSpaceModal();
  } else {
    console.error('❌ Falha ao criar espaço');
    alert('Erro ao criar espaço. Tente novamente.');
  }
};

const changeSpaceStatus = (space) => {
  const statusOptions = ['ativo', 'manutencao', 'inativo'];
  const currentIndex = statusOptions.indexOf(space.status);
  const nextIndex = (currentIndex + 1) % statusOptions.length;
  
  space.status = statusOptions[nextIndex];
  console.log(`Status do espaço "${space.name}" alterado para: ${getSpaceStatusLabel(space.status)}`);
  alert(`Status do espaço "${space.name}" alterado para: ${getSpaceStatusLabel(space.status)}`);
};

const viewSpaceReservations = (space) => {
  console.log(`Ver reservas do espaço: ${space.name}`);
  // Navigate to reservations filtered by this space
  activeSection.value = 'reservations';
  reservationFilters.value.space = space.type;
  applyReservationFilters();
};

// Space helper functions
const getSpaceTypeIcon = (type) => {
  const icons = {
    'quadra-futebol': 'pi pi-circle',
    'quadra-volei': 'pi pi-circle',
    'quadra-basquete': 'pi pi-circle',
    'piscina': 'pi pi-circle',
    'academia': 'pi pi-heart',
    'sala-multiuso': 'pi pi-building'
  };
  return icons[type] || 'pi pi-building';
};

const getSpaceTypeEmoji = (type) => {
  const emojis = {
    'quadra-futebol': '⚽',
    'quadra-volei': '🏐',
    'quadra-basquete': '🏀',
    'piscina': '🏊',
    'academia': '💪',
    'sala-multiuso': '🏢'
  };
  return emojis[type] || '🏢';
};

const getSpaceTypeLabel = (type) => {
  const labels = {
    'quadra-futebol': 'Quadra de Futebol',
    'quadra-volei': 'Quadra de Vôlei',
    'quadra-basquete': 'Quadra de Basquete',
    'piscina': 'Piscina',
    'academia': 'Academia',
    'sala-multiuso': 'Sala Multiuso'
  };
  return labels[type] || type;
};

const getSpaceStatusIcon = (status) => {
  const icons = {
    'ativo': 'pi pi-check-circle',
    'manutencao': 'pi pi-exclamation-triangle',
    'inativo': 'pi pi-times-circle',
    'reservado': 'pi pi-calendar'
  };
  return icons[status] || 'pi pi-info-circle';
};

const getSpaceStatusLabel = (status) => {
  const labels = {
    'ativo': 'Ativo',
    'manutencao': 'Manutenção',
    'inativo': 'Inativo',
    'reservado': 'Reservado'
  };
  return labels[status] || status;
};

const goToSpaces = () => {
  router.push('/technician-profile');
};

const goToReservations = () => {
  router.push({ path: '/technician-profile', query: { tab: 'agenda' } });
};

const goToFinance = () => {
  router.push('/finance');
};

// Financial management functions
const addTransaction = () => {
  const nextId = Math.max(...allTransactions.value.map(t => t.id)) + 1;
  const now = new Date();
  
  const transaction = {
    ...newTransaction.value,
    id: nextId,
    time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
  
  allTransactions.value.unshift(transaction);
  
  // Update financial data
  if (transaction.type === 'receita') {
    financialData.value.totalRevenue += transaction.amount;
  } else if (transaction.type === 'despesa') {
    financialData.value.totalExpenses += transaction.amount;
  }
  
  if (transaction.status === 'pendente') {
    financialData.value.pendingPayments += transaction.amount;
    financialData.value.pendingCount++;
  }
  
  financialData.value.netProfit = financialData.value.totalRevenue - financialData.value.totalExpenses;
  
  // Reset form
  newTransaction.value = {
    type: '',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    status: 'concluida',
    method: 'dinheiro'
  };
  
  showAddTransactionModal.value = false;
  alert('Transação criada com sucesso!');
};

const editTransaction = (transaction) => {
  editingTransaction.value = { ...transaction };
  showEditTransactionModal.value = true;
  showTransactionDetailsModal.value = false;
};

const updateTransaction = () => {
  const index = allTransactions.value.findIndex(t => t.id === editingTransaction.value.id);
  if (index !== -1) {
    // Calculate difference for financial data update
    const oldTransaction = allTransactions.value[index];
    const amountDiff = editingTransaction.value.amount - oldTransaction.amount;
    
    // Update financial data
    if (oldTransaction.type === 'receita' && editingTransaction.value.type === 'receita') {
      financialData.value.totalRevenue += amountDiff;
    } else if (oldTransaction.type === 'despesa' && editingTransaction.value.type === 'despesa') {
      financialData.value.totalExpenses += amountDiff;
    } else if (oldTransaction.type === 'receita' && editingTransaction.value.type === 'despesa') {
      financialData.value.totalRevenue -= oldTransaction.amount;
      financialData.value.totalExpenses += editingTransaction.value.amount;
    } else if (oldTransaction.type === 'despesa' && editingTransaction.value.type === 'receita') {
      financialData.value.totalExpenses -= oldTransaction.amount;
      financialData.value.totalRevenue += editingTransaction.value.amount;
    }
    
    // Update pending payments
    if (oldTransaction.status === 'pendente' && editingTransaction.value.status !== 'pendente') {
      financialData.value.pendingPayments -= oldTransaction.amount;
      financialData.value.pendingCount--;
    } else if (oldTransaction.status !== 'pendente' && editingTransaction.value.status === 'pendente') {
      financialData.value.pendingPayments += editingTransaction.value.amount;
      financialData.value.pendingCount++;
    } else if (oldTransaction.status === 'pendente' && editingTransaction.value.status === 'pendente') {
      financialData.value.pendingPayments += amountDiff;
    }
    
    financialData.value.netProfit = financialData.value.totalRevenue - financialData.value.totalExpenses;
    
    allTransactions.value[index] = { ...editingTransaction.value };
    showEditTransactionModal.value = false;
    alert('Transação atualizada com sucesso!');
  }
};

const deleteTransaction = (transaction) => {
  if (confirm(`Tem certeza que deseja excluir a transação #${transaction.id}?`)) {
    const index = allTransactions.value.findIndex(t => t.id === transaction.id);
    if (index !== -1) {
      // Update financial data
      if (transaction.type === 'receita') {
        financialData.value.totalRevenue -= transaction.amount;
      } else if (transaction.type === 'despesa') {
        financialData.value.totalExpenses -= transaction.amount;
      }
      
      if (transaction.status === 'pendente') {
        financialData.value.pendingPayments -= transaction.amount;
        financialData.value.pendingCount--;
      }
      
      financialData.value.netProfit = financialData.value.totalRevenue - financialData.value.totalExpenses;
      
      allTransactions.value.splice(index, 1);
      alert('Transação excluída com sucesso!');
    }
  }
};

const viewTransactionDetails = (transaction) => {
  selectedTransaction.value = transaction;
  showTransactionDetailsModal.value = true;
};

const clearFinancialFilters = () => {
  financialFilters.value = {
    type: '',
    category: '',
    period: '',
    search: ''
  };
  currentFinancePage.value = 1;
};

const exportTransactions = () => {
  // Generate CSV data
  const headers = ['ID', 'Data', 'Tipo', 'Categoria', 'Descrição', 'Valor', 'Status', 'Método'];
  const csvData = filteredTransactions.value.map(transaction => [
    transaction.id,
    transaction.date,
    getTransactionTypeLabel(transaction.type),
    transaction.category,
    transaction.description,
    transaction.amount,
    getTransactionStatusLabel(transaction.status),
    transaction.method
  ]);
  
  const csvContent = [headers, ...csvData]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `transacoes_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

const exportFinancialData = () => {
  const data = {
    resumo: financialData.value,
    transacoes: allTransactions.value,
    dataExportacao: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `dados_financeiros_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

// Financial helper functions
const getTransactionTypeIcon = (type) => {
  const icons = {
    'receita': 'pi pi-arrow-up',
    'despesa': 'pi pi-arrow-down',
    'transferencia': 'pi pi-refresh'
  };
  return icons[type] || 'pi pi-info-circle';
};

const getTransactionTypeLabel = (type) => {
  const labels = {
    'receita': 'Receita',
    'despesa': 'Despesa',
    'transferencia': 'Transferência'
  };
  return labels[type] || type;
};

const getTransactionStatusIcon = (status) => {
  const icons = {
    'concluida': 'pi pi-check-circle',
    'pendente': 'pi pi-clock',
    'cancelada': 'pi pi-times-circle'
  };
  return icons[status] || 'pi pi-info-circle';
};

const getTransactionStatusLabel = (status) => {
  const labels = {
    'concluida': 'Concluída',
    'pendente': 'Pendente',
    'cancelada': 'Cancelada'
  };
  return labels[status] || status;
};

const getCategoryIcon = (category) => {
  const icons = {
    'reservas': '🏊',
    'manutencao': '🔧',
    'salarios': '👥',
    'equipamentos': '⚽',
    'utilidades': '💡'
  };
  return icons[category] || '📋';
};

const goToReports = () => {
  router.push({ path: '/technician-profile', query: { tab: 'dashboard' } });
};

// Reports Methods
const clearReportFilters = () => {
  reportFilters.value = {
    type: '',
    period: '',
    status: '',
    search: ''
  };
  currentPageReports.value = 1;
};

const generateReservationReport = () => {
  newReport.value = {
    name: 'Relatório de Reservas',
    description: 'Análise completa das reservas do período',
    type: 'reservations',
    format: 'pdf',
    startDate: '',
    endDate: '',
    includeCharts: true,
    includeDetails: true,
    includeComparison: false,
    scheduled: false,
    frequency: 'monthly'
  };
  showReportModal.value = true;
};

const generateUserReport = () => {
  newReport.value = {
    name: 'Relatório de Usuários',
    description: 'Análise de engajamento e atividade dos usuários',
    type: 'users',
    format: 'pdf',
    startDate: '',
    endDate: '',
    includeCharts: true,
    includeDetails: true,
    includeComparison: false,
    scheduled: false,
    frequency: 'monthly'
  };
  showReportModal.value = true;
};

const generateFinancialReport = () => {
  newReport.value = {
    name: 'Relatório Financeiro',
    description: 'Análise de receitas, despesas e lucratividade',
    type: 'financial',
    format: 'pdf',
    startDate: '',
    endDate: '',
    includeCharts: true,
    includeDetails: true,
    includeComparison: true,
    scheduled: false,
    frequency: 'monthly'
  };
  showReportModal.value = true;
};

const generateSpaceReport = () => {
  newReport.value = {
    name: 'Relatório de Espaços',
    description: 'Análise de ocupação e utilização dos espaços',
    type: 'spaces',
    format: 'pdf',
    startDate: '',
    endDate: '',
    includeCharts: true,
    includeDetails: true,
    includeComparison: false,
    scheduled: false,
    frequency: 'monthly'
  };
  showReportModal.value = true;
};

const generateCustomReport = () => {
  // Simulate report generation
  const newId = Math.max(...reports.value.map(r => r.id)) + 1;
  
  const reportToCreate = {
    id: newId,
    name: newReport.value.name,
    description: newReport.value.description,
    type: newReport.value.type,
    createdAt: new Date(),
    period: `${formatDate(newReport.value.startDate)} - ${formatDate(newReport.value.endDate)}`,
    status: 'generating',
    size: 0,
    stats: {
      records: 0,
      charts: 0,
      processingTime: 0
    }
  };
  
  reports.value.unshift(reportToCreate);
  
  // Simulate processing time
  setTimeout(() => {
    const reportIndex = reports.value.findIndex(r => r.id === newId);
    if (reportIndex !== -1) {
      reports.value[reportIndex] = {
        ...reports.value[reportIndex],
        status: 'completed',
        size: Math.floor(Math.random() * 3000000) + 500000,
        stats: {
          records: Math.floor(Math.random() * 1000) + 100,
          charts: Math.floor(Math.random() * 10) + 3,
          processingTime: Math.floor(Math.random() * 60) + 15
        }
      };
      
      // Update report stats
      reportStats.value[newReport.value.type]++;
    }
  }, 3000);
  
  console.log('Relatório criado:', reportToCreate);
  alert(`Relatório "${reportToCreate.name}" está sendo gerado. Você será notificado quando estiver pronto.`);
  closeReportModal();
};

const viewReportHistory = (type) => {
  reportFilters.value.type = type;
  reportFilters.value.period = '';
  reportFilters.value.status = '';
  reportFilters.value.search = '';
  currentPageReports.value = 1;
  
  alert(`Visualizando histórico de relatórios de ${getReportTypeLabel(type)}`);
};

const viewReportDetails = (report) => {
  selectedReport.value = report;
  showReportDetailsModal.value = true;
};

const downloadReport = (report) => {
  if (report.status !== 'completed') {
    alert('Este relatório ainda não está pronto para download.');
    return;
  }
  
  // Simulate file download
  const blob = new Blob(['Conteúdo do relatório simulado'], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${report.name.replace(/\s+/g, '_')}_${report.id}.pdf`;
  link.click();
  
  alert(`Download do relatório "${report.name}" iniciado!`);
};

const shareReport = (report) => {
  if (report.status !== 'completed') {
    alert('Este relatório ainda não está pronto para compartilhamento.');
    return;
  }
  
  // Simulate sharing functionality
  const shareData = {
    title: report.name,
    text: report.description,
    url: window.location.href + `?report=${report.id}`
  };
  
  if (navigator.share) {
    navigator.share(shareData);
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(shareData.url);
    alert('Link do relatório copiado para a área de transferência!');
  }
};

const deleteReport = (report) => {
  if (confirm(`Tem certeza que deseja excluir o relatório "${report.name}"?`)) {
    const index = reports.value.findIndex(r => r.id === report.id);
    if (index !== -1) {
      reports.value.splice(index, 1);
      reportStats.value[report.type]--;
      alert('Relatório excluído com sucesso!');
    }
  }
};

const duplicateReport = (report) => {
  newReport.value = {
    name: `Cópia de ${report.name}`,
    description: report.description,
    type: report.type,
    format: 'pdf',
    startDate: '',
    endDate: '',
    includeCharts: true,
    includeDetails: true,
    includeComparison: false,
    scheduled: false,
    frequency: 'monthly'
  };
  closeReportDetailsModal();
  showReportModal.value = true;
};

const exportAllReports = () => {
  const data = {
    relatorios: reports.value,
    estatisticas: reportStats.value,
    filtros: reportFilters.value,
    dataExportacao: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `todos_relatorios_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  alert('Exportação de todos os relatórios iniciada!');
};

const closeReportModal = () => {
  showReportModal.value = false;
  newReport.value = {
    name: '',
    description: '',
    type: '',
    format: 'pdf',
    startDate: '',
    endDate: '',
    includeCharts: true,
    includeDetails: true,
    includeComparison: false,
    scheduled: false,
    frequency: 'monthly'
  };
};

const closeReportDetailsModal = () => {
  showReportDetailsModal.value = false;
  selectedReport.value = null;
};

// Report helper functions
const getReportTypeIcon = (type) => {
  const icons = {
    'reservations': 'pi pi-calendar',
    'users': 'pi pi-users',
    'financial': 'pi pi-dollar',
    'spaces': 'pi pi-building',
    'analytics': 'pi pi-chart-line'
  };
  return icons[type] || 'pi pi-file-text';
};

const getReportTypeLabel = (type) => {
  const labels = {
    'reservations': 'Reservas',
    'users': 'Usuários', 
    'financial': 'Financeiro',
    'spaces': 'Espaços',
    'analytics': 'Analytics'
  };
  return labels[type] || type;
};

const getReportStatusIcon = (status) => {
  const icons = {
    'completed': 'pi pi-check-circle',
    'generating': 'pi pi-spinner pi-spin',
    'failed': 'pi pi-times-circle'
  };
  return icons[status] || 'pi pi-info-circle';
};

const getReportStatusLabel = (status) => {
  const labels = {
    'completed': 'Concluído',
    'generating': 'Gerando',
    'failed': 'Falhou'
  };
  return labels[status] || status;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('pt-BR');
};

// Notifications methods
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const markAsRead = (notification) => {
  notification.read = true;
};

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true);
};

const goToAllNotifications = () => {
  showNotifications.value = false;
  // TODO: Implement notifications page
  alert('Página de notificações será implementada em breve');
};

const getNotificationIcon = (type) => {
  const icons = {
    success: 'pi pi-check-circle',
    warning: 'pi pi-exclamation-triangle',
    error: 'pi pi-times-circle',
    info: 'pi pi-info-circle'
  };
  return icons[type] || 'pi pi-bell';
};

const getPeriodLabel = () => {
  const labels = {
    today: 'Hoje',
    week: 'esta Semana',
    month: 'este Mês'
  };
  return labels[selectedPeriod.value];
};

// Alerts methods
const getAlertIcon = (type) => {
  const icons = {
    warning: 'pi pi-exclamation-triangle',
    error: 'pi pi-times-circle',
    info: 'pi pi-info-circle',
    success: 'pi pi-check-circle'
  };
  return icons[type] || 'pi pi-bell';
};

const dismissAlert = (alertId) => {
  const index = systemAlerts.value.findIndex(alert => alert.id === alertId);
  if (index !== -1) {
    systemAlerts.value.splice(index, 1);
  }
};

// Quick Actions methods
const openNewUserModal = () => {
  // Limpar dados do formulário
  newUser.value = {
    name: '',
    email: '',
    cpf: '',
    type: '',
    status: 'ativo',
    permissions: {
      manageSpaces: false,
      manageReservations: false,
      manageUsers: false,
      viewReports: false
    }
  };
  // Abrir modal
  showNewUserModal.value = true;
};

const addNewSpace = () => {
  showNewSpaceModal.value = true;
};

const generateReport = () => {
  // Mostrar opções de relatório
  const reportType = prompt(`Selecione o tipo de relatório:
1 - Relatório de Reservas
2 - Relatório de Usuários  
3 - Relatório Financeiro
4 - Relatório de Espaços
5 - Relatório Personalizado

Digite o número da opção (1-5):`);

  switch(reportType) {
    case '1':
      generateReservationReport();
      break;
    case '2':
      generateUserReport();
      break;
    case '3':
      generateFinancialReport();
      break;
    case '4':
      generateSpaceReport();
      break;
    case '5':
      // Navegar para a seção de relatórios e abrir o modal
      activeSection.value = 'reports';
      setTimeout(() => {
        showReportModal.value = true;
      }, 100);
      break;
    default:
      if (reportType !== null) {
        alert('Opção inválida. Tente novamente.');
      }
  }
};

const systemBackup = () => {
  const confirmBackup = confirm('Deseja fazer backup do sistema? Esta operação pode levar alguns minutos.');
  if (confirmBackup) {
    performSystemBackup();
  }
};

// Função para realizar backup do sistema
const performSystemBackup = async () => {
  try {
    // Mostrar loading
    const loadingMessage = document.createElement('div');
    loadingMessage.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                  background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                  z-index: 9999; text-align: center;">
        <i class="pi pi-spin pi-spinner" style="font-size: 24px; margin-bottom: 10px;"></i>
        <p>Realizando backup do sistema...</p>
      </div>
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                  background: rgba(0,0,0,0.5); z-index: 9998;"></div>
    `;
    document.body.appendChild(loadingMessage);

    // Simular processo de backup
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Gerar dados de backup
    const backupData = {
      timestamp: new Date().toISOString(),
      users: allUsers.value,
      spaces: allSpaces.value,
      reservations: allReservations.value,
      transactions: allTransactions.value,
      reports: allReports.value,
      version: '1.0.0'
    };

    // Criar arquivo de backup
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Download do arquivo
    const link = document.createElement('a');
    link.href = url;
    link.download = `sesi-sports-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Remover loading
    document.body.removeChild(loadingMessage);

    // Mostrar sucesso
    alert('✅ Backup realizado com sucesso! O arquivo foi baixado.');

    // Adicionar ao histórico de backups
    systemAlerts.value.unshift({
      id: Date.now(),
      type: 'success',
      title: 'Backup Concluído',
      message: 'Backup do sistema realizado com sucesso',
      time: new Date()
    });

  } catch (error) {
    console.error('Erro no backup:', error);
    alert('❌ Erro ao realizar backup. Tente novamente.');
  }
};

// Time formatting
const formatTime = (date) => {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `${minutes} min atrás`;
  } else if (hours < 24) {
    return `${hours}h atrás`;
  } else {
    return `${days}d atrás`;
  }
};

// Close notifications when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.notification-btn') && !event.target.closest('.notifications-dropdown')) {
    showNotifications.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Header Styles */
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
  background-color: #f3f4f6;
  padding: 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.profile-btn:hover {
  background-color: #e5e7eb;
}

.profile-btn.active {
  background-color: #f0f9ff;
  color: #164194;
}

.header-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
}

.logout-btn {
  background-color: #dc2626;
  color: white;
}

.logout-btn:hover {
  background-color: #b91c1c;
}

/* Main Layout */
.profile-container {
  display: flex;
  gap: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: calc(100vh - 160px);
}

.sidebar {
  width: 260px;
  background-color: #f9fafb;
  border-right: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 160px);
}

/* Admin Profile Header */
.admin-profile-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-avatar {
  width: 48px;
  height: 48px;
  background-color: #f0f9ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-info .admin-name {
  font-weight: 600;
  font-size: 16px;
  color: #111827;
  margin: 0 0 2px 0;
}

.admin-info .admin-role {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* Sidebar Navigation */
.sidebar-nav {
  padding: 12px;
}

.nav-item {
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #374151;
  background: none;
  margin-bottom: 4px;
  font-size: 14px;
}

.nav-item:hover {
  background-color: white;
  color: #111827;
}

.nav-item.active {
  background-color: white;
  color: #dc2626;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.nav-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Content Sections */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.section-description {
  color: #6b7280;
  margin-bottom: 20px;
}

/* Quick Access Grid */
.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.quick-access-card {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  transition: background-color 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.quick-access-card:hover {
  background-color: #f3f4f6;
}

.card-icon {
  padding: 8px;
  border-radius: 6px;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  margin-left: 12px;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  color: #111827;
  margin: 0 0 2px 0;
}

.card-description {
  color: #6b7280;
  font-size: 13px;
  margin: 0 0 6px 0;
}

.card-stats {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-value {
  font-weight: 700;
  font-size: 18px;
  color: #111827;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

/* Action Cards */
.action-card {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn.primary {
  background-color: #dc2626;
  color: white;
}

.action-btn.primary:hover {
  background-color: #b91c1c;
}

.primary-btn {
  background-color: #dc2626;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary-btn:hover {
  background-color: #b91c1c;
}

/* Dashboard Content */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.period-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  color: #374151;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.period-btn:hover {
  background-color: #f9fafb;
}

.period-btn.active {
  background-color: #dc2626;
  color: white;
  border-color: #dc2626;
}

@media (max-width: 600px) {
  header.w-full {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
  .flex.items-center.gap-2.w-full {
    gap: 6px !important;
  }
  h1 {
    font-size: 1rem !important;
    max-width: 140px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  img {
    height: 32px !important;
    margin-right: 4px !important;
  }
  
  .profile-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .quick-access-grid {
    grid-template-columns: 1fr;
  }
}

.admin-btn {
  width: 100%;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.admin-btn-blue {
  background-color: #164194;
  color: white;
}

.admin-btn-blue:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
}

.admin-btn-green {
  background-color: #16a34a;
  color: white;
}

.admin-btn-green:hover {
  background-color: #15803d;
  transform: translateY(-2px);
}

.admin-btn-purple {
  background-color: #9333ea;
  color: white;
}

.admin-btn-purple:hover {
  background-color: #7c3aed;
  transform: translateY(-2px);
}

.admin-btn-yellow {
  background-color: #ca8a04;
  color: white;
}

.admin-btn-yellow:hover {
  background-color: #a16207;
  transform: translateY(-2px);
}

.admin-btn-gray {
  background-color: #374151;
  color: white;
}

.admin-btn-gray:hover {
  background-color: #1f2937;
  transform: translateY(-2px);
}

.admin-btn-red {
  background-color: #dc2626;
  color: white;
}

.admin-btn-red:hover {
  background-color: #b91c1c;
  transform: translateY(-2px);
}

/* Notifications Styles */
.notification-btn {
  position: relative;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.notification-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.notification-btn.has-unread {
  color: #FDE047;
}

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #EF4444;
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #DC2626;
}

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 360px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 8px;
  max-height: 400px;
  overflow: hidden;
}

.notifications-header {
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notifications-header h3 {
  margin: 0;
  color: #1F2937;
  font-size: 16px;
  font-weight: 600;
}

.mark-all-read {
  background: none;
  border: none;
  color: #3B82F6;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.mark-all-read:hover {
  background: #F3F4F6;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  padding: 16px 20px;
  border-bottom: 1px solid #F3F4F6;
  cursor: pointer;
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: #F9FAFB;
}

.notification-item.unread {
  background: #F0F9FF;
  border-left: 3px solid #3B82F6;
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 14px;
}

.notification-icon.success {
  background: #f0f9ff;
  color: #059669;
}

.notification-icon.warning {
  background: #fffbeb;
  color: #d97706;
}

.notification-icon.error {
  background: #fef2f2;
  color: #dc2626;
}

.notification-icon.info {
  background: #DBEAFE;
  color: #3B82F6;
}

.notification-content {
  flex: 1;
}

.notification-message {
  margin: 0 0 4px 0;
  color: #1F2937;
  font-size: 14px;
  line-height: 1.4;
}

.notification-time {
  color: #6B7280;
  font-size: 12px;
}

.notifications-footer {
  padding: 12px 20px;
  border-top: 1px solid #E5E7EB;
  text-align: center;
}

.view-all-btn {
  background: none;
  border: none;
  color: #3B82F6;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.view-all-btn:hover {
  background: #F3F4F6;
}

/* Enhanced Stats Styles */
.period-btn {
  background: #F3F4F6;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6B7280;
}

.period-btn.active {
  background: #DC2626;
  color: white;
}

.period-btn:hover:not(.active) {
  background: #E5E7EB;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
}

.stat-card.revenue::before {
  background: linear-gradient(90deg, #164194, #113375);
}

.stat-card.users::before {
  background: linear-gradient(90deg, #164194, #113375);
}

.stat-card.reservations::before {
  background: linear-gradient(90deg, #164194, #113375);
}

.stat-card.spaces::before {
  background: linear-gradient(90deg, #164194, #113375);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  margin-bottom: 16px;
}

.revenue .stat-icon {
  background: linear-gradient(135deg, #164194, #113375);
}

.users .stat-icon {
  background: linear-gradient(135deg, #164194, #113375);
}

.reservations .stat-icon {
  background: linear-gradient(135deg, #164194, #113375);
}

.spaces .stat-icon {
  background: linear-gradient(135deg, #164194, #113375);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-label {
  color: #6B7280;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.stat-trend.positive {
  color: #10B981;
}

.stat-trend.negative {
  color: #EF4444;
}

.stat-trend.neutral {
  color: #6B7280;
}

/* Alerts Styles */
.alerts-section {
  margin-bottom: 32px;
}

.alerts-grid {
  display: grid;
  gap: 16px;
}

.alert-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
}

.alert-card.warning {
  border-left-color: #f59e0b;
}

.alert-card.error {
  border-left-color: #dc2626;
}

.alert-card.info {
  border-left-color: #164194;
}

.alert-card.success {
  border-left-color: #059669;
}

.alert-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.alert-card.warning .alert-icon {
  background: #fffbeb;
  color: #f59e0b;
}

.alert-card.error .alert-icon {
  background: #fef2f2;
  color: #dc2626;
}

.alert-card.info .alert-icon {
  background: #f0f9ff;
  color: #164194;
}

.alert-card.success .alert-icon {
  background: #f0fdf4;
  color: #059669;
}

.alert-content {
  flex: 1;
}

.alert-content h5 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
}

.alert-content p {
  margin: 0 0 4px 0;
  font-size: 13px;
  color: #6B7280;
}

.alert-time {
  font-size: 11px;
  color: #9CA3AF;
}

.alert-dismiss {
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.alert-dismiss:hover {
  color: #6B7280;
}

/* Quick Actions Styles */
.quick-actions {
  margin-top: 32px;
}

.quick-action-btn {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: #374151;
  position: relative;
  overflow: hidden;
}

.quick-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent);
  transition: left 0.5s ease;
}

.quick-action-btn:hover::before {
  left: 100%;
}

.quick-action-btn:hover {
  border-color: #10b981;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.15);
  background: linear-gradient(145deg, #f0fdf4, #ffffff);
}

.quick-action-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.quick-action-btn i {
  font-size: 28px;
  color: #10b981;
  transition: all 0.3s ease;
  z-index: 1;
}

.quick-action-btn:hover i {
  color: #059669;
  transform: scale(1.1);
}

.quick-action-btn span {
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  z-index: 1;
  transition: color 0.3s ease;
}

.quick-action-btn:hover span {
  color: #059669;
}

/* Cores específicas para cada botão */
.quick-action-btn:nth-child(1) i { color: #6b7280; } /* Novo Usuário - Cinza */
.quick-action-btn:nth-child(1):hover { border-color: #6b7280; box-shadow: 0 4px 12px rgba(107, 114, 128, 0.1); }
.quick-action-btn:nth-child(1):hover i,
.quick-action-btn:nth-child(1):hover span { color: #374151; }

.quick-action-btn:nth-child(2) i { color: #6b7280; } /* Novo Espaço - Cinza */
.quick-action-btn:nth-child(2):hover { border-color: #6b7280; box-shadow: 0 4px 12px rgba(107, 114, 128, 0.1); }
.quick-action-btn:nth-child(2):hover i,
.quick-action-btn:nth-child(2):hover span { color: #374151; }

.quick-action-btn:nth-child(3) i { color: #6b7280; } /* Gerar Relatório - Cinza */
.quick-action-btn:nth-child(3):hover { border-color: #6b7280; box-shadow: 0 4px 12px rgba(107, 114, 128, 0.1); }
.quick-action-btn:nth-child(3):hover i,
.quick-action-btn:nth-child(3):hover span { color: #374151; }

.quick-action-btn:nth-child(4) i { color: #6b7280; } /* Backup - Cinza */
.quick-action-btn:nth-child(4):hover { border-color: #6b7280; box-shadow: 0 4px 12px rgba(107, 114, 128, 0.1); }
.quick-action-btn:nth-child(4):hover i,
.quick-action-btn:nth-child(4):hover span { color: #374151; }

/* Responsive Design */
@media (max-width: 768px) {
  .notifications-dropdown {
    width: 320px;
    right: -20px;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .quick-action-btn {
    padding: 16px;
    border-radius: 10px;
  }
  
  .quick-action-btn i {
    font-size: 24px;
  }
  
  .quick-action-btn span {
    font-size: 12px;
  }
}

/* User Management Styles */
.usuarios-header {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.header-info {
  margin-bottom: 16px;
}

.usuarios-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  color: #6b7280;
  font-size: 13px;
}

.stat-item strong {
  color: #111827;
  font-weight: 600;
}

.usuarios-filters {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-select,
.filter-input {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  min-width: 160px;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #dc2626;
  box-shadow: 0 0 0 1px #dc2626;
}

.filter-btn {
  background-color: #dc2626;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;
  font-size: 13px;
}

.filter-btn:hover {
  background-color: #b91c1c;
}

.usuarios-table-container {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.usuarios-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.usuarios-table th {
  background-color: #f9fafb;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  font-size: 12px;
}

.usuarios-table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.user-row:hover {
  background-color: #f9fafb;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: #dc2626;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-type-badge {
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.user-type-badge.cliente {
  background-color: #dbeafe;
  color: #1e40af;
}

.user-type-badge.tecnico {
  background-color: #dcfce7;
  color: #166534;
}

.user-type-badge.admin {
  background-color: #fef3c7;
  color: #d97706;
}

.status-badge {
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.status-badge.ativo {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.inativo {
  background-color: #fee2e2;
  color: #dc2626;
}

.actions-cell {
  width: 120px;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.action-btn {
  padding: 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  font-size: 12px;
}

.edit-btn {
  background-color: #dbeafe;
  color: #1e40af;
}

.edit-btn:hover {
  background-color: #bfdbfe;
}

.permissions-btn {
  background-color: #fef3c7;
  color: #d97706;
}

.permissions-btn:hover {
  background-color: #fde68a;
}

.activate-btn {
  background-color: #dcfce7;
  color: #166534;
}

.activate-btn:hover {
  background-color: #bbf7d0;
}

.deactivate-btn {
  background-color: #fee2e2;
  color: #dc2626;
}

.deactivate-btn:hover {
  background-color: #fecaca;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.pagination-info {
  color: #6b7280;
  font-size: 12px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  padding: 6px;
  border: 1px solid #d1d5db;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-indicator {
  font-size: 12px;
  color: #374151;
  font-weight: 500;
}

/* Modal overlay animations */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #f3f4f6;
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  border-radius: 12px 12px 0 0;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-title i {
  color: #6b7280;
  font-size: 22px;
}

.modal-close {
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  padding: 8px;
  color: #6b7280;
  transition: all 0.2s ease;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
  transform: scale(1.05);
}

.modal-body {
  padding: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group:nth-child(6) {
  grid-column: 1 / -1;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #dc2626;
  box-shadow: 0 0 0 1px #dc2626;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #dc2626;
}

.checkbox-item span {
  font-size: 14px;
  color: #374151;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: #dc2626;
  color: white;
}

.btn-primary:hover {
  background-color: #b91c1c;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

/* Promote Modal Styles */
.promote-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-info {
  text-align: center;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.user-info h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #111827;
}

.user-info p {
  margin: 4px 0;
  color: #6b7280;
  font-size: 14px;
}

.current-type {
  margin-top: 12px !important;
}

.type-badge {
  background-color: #dc2626;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.promote-options h5 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #374151;
}

.type-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.type-option {
  cursor: pointer;
}

.type-option input[type="radio"] {
  display: none;
}

.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
  text-align: center;
}

.type-option input[type="radio"]:checked + .option-card {
  border-color: #dc2626;
  background-color: #fef2f2;
}

.option-card:hover {
  border-color: #dc2626;
  background-color: #fef2f2;
}

.option-card i {
  font-size: 24px;
  color: #dc2626;
  margin-bottom: 8px;
}

.option-card span {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input-readonly {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.form-input-readonly:focus {
  border-color: #d1d5db !important;
  box-shadow: none !important;
}

/* Reservation Status Badges */
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pendente {
  background-color: #fef3c7;
  color: #92400e;
}

.status-confirmada {
  background-color: #d1fae5;
  color: #065f46;
}

.status-concluida {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-cancelada {
  background-color: #fee2e2;
  color: #991b1b;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 500;
  color: #111827;
}

.user-email {
  font-size: 12px;
  color: #6b7280;
}

.status-btn {
  background-color: #f3f4f6;
  color: #374151;
}

.status-btn:hover {
  background-color: #e5e7eb;
}

.actions-cell .action-buttons {
  gap: 4px;
}

/* Modern Reservations Styles */
.reservations-content {
  padding: 0;
}

/* Overview Header - White and Small */
.overview-header {
  background: white !important;
  color: #111827 !important;
  padding: 16px 20px !important;
  border-radius: 8px !important;
  margin-bottom: 20px !important;
  text-align: left !important;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.overview-title {
  font-size: 20px !important;
  font-weight: 600 !important;
  margin: 0 !important;
  color: #111827 !important;
}

/* Reservations Header - White background and compact */
.reservations-content .section-header {
  background: white;
  color: #111827;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.reservations-content .section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #111827;
}

.reservations-content .section-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.section-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

/* Reservation Stats Cards */
.reservation-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--stat-color), var(--stat-color-light));
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-card-primary {
  --stat-color: #6b7280;
  --stat-color-light: #9ca3af;
}

.stat-card-success {
  --stat-color: #6b7280;
  --stat-color-light: #9ca3af;
}

.stat-card-info {
  --stat-color: #6b7280;
  --stat-color-light: #9ca3af;
}

.stat-card-warning {
  --stat-color: #ef4444;
  --stat-color-light: #f87171;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--stat-color);
  color: white;
  font-size: 24px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

/* Modern Filters */
.modern-filters {
  margin-bottom: 30px;
}

.filters-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.filters-header {
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.filters-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-filters-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.clear-filters-btn:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.modern-select, .modern-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.modern-select:focus, .modern-input:focus {
  outline: none;
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 16px;
}

.filters-actions {
  text-align: center;
}

.modern-filter-btn {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.modern-filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
}

/* Modern Table */
.modern-table-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.modern-table-header {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.table-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 6px;
}

.result-count {
  background: #dc2626;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.export-btn {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.export-btn:hover {
  background: #059669;
  transform: translateY(-1px);
}

.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

/* Column width adjustments for better visibility */
.modern-table th:nth-child(1) { width: 70px; }   /* ID */
.modern-table th:nth-child(2) { width: 180px; }  /* User */
.modern-table th:nth-child(3) { width: 140px; }  /* Space */
.modern-table th:nth-child(4) { width: 100px; }  /* Date */
.modern-table th:nth-child(5) { width: 100px; }  /* Time */
.modern-table th:nth-child(6) { width: 100px; }  /* Status */
.modern-table th:nth-child(7) { width: 90px; }   /* Value */
.modern-table th:nth-child(8) { width: 120px; }  /* Actions */

.modern-table th {
  background: #f8fafc;
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 13px;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modern-table th.sortable {
  cursor: pointer;
  transition: all 0.2s;
}

.modern-table th.sortable:hover {
  background: #e2e8f0;
}

.modern-table th i {
  margin-right: 6px;
  opacity: 0.7;
}

.table-row {
  transition: all 0.2s;
}

.table-row:hover {
  background: #f9fafb;
}

.modern-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
  font-size: 13px;
}

/* Table Cell Styles */
.id-cell .reservation-id {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
}

.user-cell .user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.user-name {
  font-weight: 500;
  color: #111827;
  font-size: 13px;
}

.user-email {
  font-size: 11px;
  color: #6b7280;
}

.space-cell .space-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.space-icon {
  font-size: 16px;
}

.space-name {
  font-weight: 500;
  color: #374151;
  font-size: 13px;
}

.date-cell .date-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.date-display {
  font-weight: 500;
  color: #111827;
  font-size: 13px;
}

.day-name {
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
}

.time-cell .time-range {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Courier New', monospace;
  font-weight: 500;
  font-size: 12px;
}

.time-separator {
  color: #9ca3af;
  font-size: 10px;
}

.modern-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.value-cell .value-amount {
  font-weight: 700;
  color: #10b981;
  font-size: 14px;
}

/* Modern Actions */
.modern-actions {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.modern-action-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.modern-action-btn:hover {
  transform: translateY(-2px);
}

.edit-btn.modern-action-btn {
  background: #3b82f6;
  color: white;
}

.edit-btn.modern-action-btn:hover {
  background: #2563eb;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.status-btn.modern-action-btn {
  background: #f59e0b;
  color: white;
}

.status-btn.modern-action-btn:hover {
  background: #d97706;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.delete-btn.modern-action-btn {
  background: #ef4444;
  color: white;
}

.delete-btn.modern-action-btn:hover {
  background: #dc2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

/* Modern Pagination */
.modern-pagination {
  background: #f8fafc;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info .page-indicator {
  font-size: 14px;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-btn {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-btn:hover:not(:disabled) {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers .page-info {
  background: #dc2626;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .admin-dashboard {
    grid-template-columns: 1fr;
  }

  .admin-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }

  .admin-content {
    margin-left: 240px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table-container {
    font-size: 12px;
  }

  .table th,
  .table td {
    padding: 6px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-container {
    margin: 20px;
    max-width: calc(100vw - 40px);
  }
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .content-area {
    padding: 12px;
    max-height: calc(100vh - 300px);
  }
  
  .usuarios-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-select,
  .filter-input {
    min-width: 100%;
  }
  
  .usuarios-table-container {
    overflow-x: auto;
  }
  
  .usuarios-table {
    min-width: 600px;
    font-size: 12px;
  }
  
  .usuarios-table th,
  .usuarios-table td {
    padding: 8px;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .quick-access-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .admin-profile-header {
    padding: 12px;
  }
  
  .sidebar-nav {
    padding: 8px;
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    gap: 8px;
  }
  
  .nav-item {
    margin-bottom: 0;
    white-space: nowrap;
    min-width: 120px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .notifications-dropdown {
    width: 280px;
    right: -40px;
  }
}

/* Spaces Management Styles */
.spaces-content {
  padding: 0;
}

.spaces-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.new-space-btn {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.new-space-btn:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* Space Table Styles */
.space-id {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
}

.name-cell .space-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.space-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.space-details {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.space-name {
  font-weight: 500;
  color: #111827;
  font-size: 13px;
}

.space-description {
  font-size: 11px;
  color: #6b7280;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.type-cell .type-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.type-icon {
  font-size: 16px;
}

.type-name {
  font-weight: 500;
  color: #374151;
  font-size: 13px;
}

.capacity-cell .capacity-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.capacity-number {
  font-weight: 600;
  color: #111827;
}

.capacity-label {
  color: #6b7280;
}

.price-cell .price-amount {
  font-weight: 700;
  color: #059669;
  font-size: 14px;
}

.view-btn.modern-action-btn {
  background: #8b5cf6;
  color: white;
}

.view-btn.modern-action-btn:hover {
  background: #7c3aed;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

/* Space Status Badges */
.status-ativo {
  background: #d1fae5;
  color: #065f46;
}

.status-manutencao {
  background: #fef3c7;
  color: #92400e;
}

.status-inativo {
  background: #fee2e2;
  color: #991b1b;
}

.status-reservado {
  background: #dbeafe;
  color: #1e40af;
}

/* Space Form Styles */
.edit-space-modal,
.new-space-modal {
  max-width: 700px;
  max-height: 85vh;
}

.edit-space-modal .modal-body,
.new-space-modal .modal-body {
  padding: 24px;
  max-height: calc(85vh - 120px);
  overflow-y: auto;
}

.space-form .form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.space-form .form-group.full-width {
  grid-column: 1 / -1;
}

.space-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.space-form label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.space-form label i {
  color: #10b981;
  width: 16px;
}

.space-form .form-input,
.space-form .form-select,
.space-form .form-textarea {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: #f9fafb;
}

.space-form .form-input:focus,
.space-form .form-select:focus,
.space-form .form-textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  background-color: white;
}

.space-form .form-input::placeholder,
.space-form .form-textarea::placeholder {
  color: #9ca3af;
  font-style: italic;
}

.space-form .form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.space-form .modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  margin-top: 24px;
}

.space-form .btn-secondary,
.space-form .btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.space-form .btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 2px solid #d1d5db;
}

.space-form .btn-secondary:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.space-form .btn-primary {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: 2px solid transparent;
}

.space-form .btn-primary:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

@media (max-width: 768px) {
  .space-form .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .edit-space-modal,
  .new-space-modal {
    max-width: 95%;
    margin: 10px;
  }

  .edit-space-modal .modal-body,
  .new-space-modal .modal-body {
    padding: 20px;
  }

  .space-form .modal-actions {
    flex-direction: column;
    gap: 10px;
  }

  .space-form .btn-secondary,
  .space-form .btn-primary {
    width: 100%;
    justify-content: center;
  }
  
  .spaces-stats {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .edit-space-modal,
  .new-space-modal {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }

  .edit-space-modal .modal-body,
  .new-space-modal .modal-body {
    padding: 16px;
    max-height: calc(100vh - 120px);
  }

  .spaces-stats {
    grid-template-columns: 1fr;
  }
  
  .new-space-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}

/* Financial Management Styles */
.finance-content {
  padding: 0;
}

.finance-header {
  background: white !important;
  color: #111827 !important;
  padding: 16px 20px !important;
  border-radius: 8px !important;
  margin-bottom: 20px !important;
  text-align: left !important;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.financial-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.financial-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.financial-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.financial-card.revenue-card::before {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.financial-card.expense-card::before {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.financial-card.profit-card::before {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.financial-card.pending-card::before {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.financial-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.financial-card .card-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.revenue-card .card-icon {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.expense-card .card-icon {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

.profit-card .card-icon {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.pending-card .card-icon {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.financial-card .card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.financial-card .card-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.financial-card .card-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.financial-card .card-change {
  font-size: 12px;
  font-weight: 600;
}

.financial-card .card-change.positive {
  color: #10b981;
}

.financial-card .card-change.negative {
  color: #ef4444;
}

.finance-quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.quick-action-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: #374151;
}

.quick-action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-color: #dc2626;
}

.quick-action-card i {
  font-size: 32px;
  color: #dc2626;
}

.quick-action-card span {
  font-weight: 600;
  text-align: center;
}

.finance-filters {
  margin-bottom: 30px;
}

.transactions-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.transactions-table th,
.transactions-table td {
  padding: 14px 10px;
  text-align: left;
  font-size: 13px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.transactions-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
  position: sticky;
  top: 0;
  z-index: 10;
}

.transactions-table th:nth-child(1) { width: 80px; }   /* ID */
.transactions-table th:nth-child(2) { width: 130px; }  /* Date */
.transactions-table th:nth-child(3) { width: 120px; }  /* Type */
.transactions-table th:nth-child(4) { width: 130px; }  /* Category */
.transactions-table th:nth-child(5) { width: 250px; }  /* Description */
.transactions-table th:nth-child(6) { width: 140px; }  /* Amount */
.transactions-table th:nth-child(7) { width: 120px; }  /* Status */
.transactions-table th:nth-child(8) { width: 130px; }  /* Actions */

.transaction-row:hover {
  background: #f9fafb;
}

.transaction-id {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.date-display {
  font-weight: 500;
  color: #111827;
  font-size: 12px;
}

.time-display {
  font-size: 10px;
  color: #6b7280;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.type-badge.type-receita {
  background: #d1fae5;
  color: #065f46;
}

.type-badge.type-despesa {
  background: #fee2e2;
  color: #991b1b;
}

.type-badge.type-transferencia {
  background: #dbeafe;
  color: #1e40af;
}

.category-tag {
  font-size: 12px;
  color: #374151;
}

.description-cell {
  max-width: 250px;
  padding: 12px 10px;
}

.description {
  font-size: 12px;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  max-width: 100%;
}

.value-amount {
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
  display: inline-block;
  min-width: 100px;
  padding: 4px 8px;
  text-align: right;
}

.value-amount.positive {
  color: #10b981;
}

.value-amount.negative {
  color: #ef4444;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  min-width: fit-content;
}

.status-badge.status-concluida {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.status-pendente {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.status-cancelada {
  background: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  min-width: 120px;
}

/* Alinhamento específico para colunas de valor e status */
.transactions-table td:nth-child(6) {
  text-align: right;
  padding-right: 15px;
}

.transactions-table td:nth-child(7) {
  text-align: center;
}

.transactions-table td:nth-child(8) {
  text-align: center;
  padding: 10px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.edit-btn {
  background: #3b82f6;
  color: white;
}

.edit-btn:hover {
  background: #2563eb;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.view-btn {
  background: #10b981;
  color: white;
}

.view-btn:hover {
  background: #059669;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

/* Transaction Modal Styles */
.transaction-form .form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.transaction-form .form-group.full-width {
  grid-column: 1 / -1;
}

.transaction-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-label {
  font-weight: 600;
  color: #374151;
}

.detail-value {
  color: #111827;
}

.detail-value.positive {
  color: #10b981;
  font-weight: 600;
}

.detail-value.negative {
  color: #ef4444;
  font-weight: 600;
}

.pagination-container {
  background: #f8fafc;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.page-number:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.page-number.active {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
}

/* Reports Styles */
.reports-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.reports-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.report-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.report-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
}

.report-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #cbd5e1;
}

.report-card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.report-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  position: relative;
  overflow: hidden;
}

.report-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
  border-radius: 12px;
}

.report-icon.reservations {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
}

.report-icon.users {
  background: linear-gradient(135deg, #10b981, #059669);
}

.report-icon.financial {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.report-icon.spaces {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.report-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
}

.report-info p {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #6b7280;
}

.report-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.report-action-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.report-action-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.reports-filters {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 120px;
}

.filter-group label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-search {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  flex: 1;
  min-width: 200px;
  transition: border-color 0.2s;
}

.filter-search:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-clear {
  padding: 8px 12px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-clear:hover {
  background: #4b5563;
}

.reports-table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
}

.reports-table th {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  border-bottom: 2px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 1;
}

.reports-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  vertical-align: middle;
}

.report-row {
  transition: background-color 0.2s;
}

.report-row:hover {
  background: #f8fafc;
}

.report-id {
  font-weight: 600;
  color: #6b7280;
  font-family: 'Courier New', monospace;
}

.report-name-container {
  display: flex;
  flex-direction: column;
}

.report-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
}

.report-description {
  font-size: 12px;
  color: #6b7280;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.type-badge.reservations {
  background: rgba(59, 130, 246, 0.1);
  color: #1e40af;
}

.type-badge.users {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.type-badge.financial {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.type-badge.spaces {
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
}

.type-badge.analytics {
  background: rgba(236, 72, 153, 0.1);
  color: #be185d;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.status-badge.generating {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.status-badge.failed {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.report-actions {
  display: flex;
  gap: 4px;
}

.action-btn.small {
  padding: 6px 8px;
  font-size: 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.small:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn.small.success {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.action-btn.small.success:hover {
  background: #059669;
  border-color: #059669;
}

.action-btn.small.primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.action-btn.small.primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.action-btn.small.secondary {
  background: #6b7280;
  color: white;
  border-color: #6b7280;
}

.action-btn.small.secondary:hover {
  background: #4b5563;
  border-color: #4b5563;
}

.action-btn.small.danger {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.action-btn.small.danger:hover {
  background: #dc2626;
  border-color: #dc2626;
}

.reports-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-current {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  min-width: 30px;
  text-align: center;
}

/* Report Modal Styles */
.report-modal {
  max-width: 600px;
  width: 90vw;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-select,
.form-textarea {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  margin: 0;
}

/* Report Details Modal Styles */
.report-details-modal {
  max-width: 800px;
  width: 90vw;
}

.report-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.detail-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.report-description {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

/* Modal Content Styles - Fixed Background */
.modal-content {
  background: white !important;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 90vw;
  max-height: 85vh;
  overflow: hidden;
  position: relative;
}

.modal-content.report-modal {
  max-width: 600px;
  background: white !important;
}

.modal-content.report-details-modal {
  max-width: 800px;
  background: white !important;
}

.modal-header {
  background: white !important;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.modal-body {
  background: white !important;
  padding: 24px;
  overflow-y: auto;
  max-height: calc(85vh - 140px);
}

.modal-actions {
  background: white !important;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: #6b7280;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Ensure all form elements in modals have white background */
.modal-content .form-input,
.modal-content .form-select,
.modal-content .form-textarea {
  background: white !important;
  border: 1px solid #d1d5db;
}

.modal-content .form-input:focus,
.modal-content .form-select:focus,
.modal-content .form-textarea:focus {
  background: white !important;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Buttons in modals */
.modal-content .btn {
  background: white;
  border: 1px solid #d1d5db;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-content .btn.primary {
  background: #3b82f6 !important;
  color: white;
  border-color: #3b82f6;
}

.modal-content .btn.primary:hover {
  background: #2563eb !important;
  border-color: #2563eb;
}

.modal-content .btn.secondary {
  background: white !important;
  color: #374151;
  border-color: #d1d5db;
}

.modal-content .btn.secondary:hover {
  background: #f9fafb !important;
  border-color: #9ca3af;
}

.modal-content .btn.success {
  background: #10b981 !important;
  color: white;
  border-color: #10b981;
}

.modal-content .btn.success:hover {
  background: #059669 !important;
  border-color: #059669;
}

/* Mini Headers */
.mini-header {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.mini-header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.mini-header-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #6b7280;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.users-mini-header .mini-header-icon,
.spaces-mini-header .mini-header-icon,
.dashboard-mini-header .mini-header-icon {
  background: #f9fafb;
  color: #6b7280;
}

.mini-header-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mini-header-title {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.mini-header-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

.mini-header-stats {
  display: flex;
  gap: 24px;
  align-items: center;
}

.mini-stat {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mini-stat-number {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.mini-stat-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mini-header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.period-selector {
  display: flex;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 4px;
  gap: 2px;
}

.period-btn-mini {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-btn-mini.active {
  background: white;
  color: #111827;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.period-btn-mini:hover:not(.active) {
  color: #374151;
  background: rgba(255, 255, 255, 0.5);
}

.action-btn-mini {
  padding: 10px 16px;
  border: none;
  background: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn-mini:hover {
  background: #f9fafb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.action-btn-mini i {
  font-size: 12px;
}

/* Responsive Design for Mini Headers */
@media (max-width: 1024px) {
  .mini-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .mini-header-stats {
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .mini-header {
    padding: 20px;
  }

  .mini-header-left {
    gap: 16px;
  }

  .mini-header-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }

  .mini-header-title {
    font-size: 20px;
  }

  .mini-header-stats {
    flex-wrap: wrap;
    gap: 12px;
  }

  .mini-stat-number {
    font-size: 18px;
  }

  .period-btn-mini {
    padding: 6px 12px;
    font-size: 12px;
  }
}

/* Estilos para Informações Customizáveis */
.custom-info-section {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  background: #f9fafb;
}

.info-items {
  margin-bottom: 16px;
}

.info-item {
  margin-bottom: 12px;
}

.info-display {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.info-icon {
  color: #3b82f6;
  font-size: 18px;
  min-width: 20px;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-title {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}

.info-description {
  color: #6b7280;
  font-size: 13px;
}

.remove-info-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.remove-info-btn:hover {
  background: #dc2626;
}

.add-info-form {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}

.form-grid-mini {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 8px;
  align-items: end;
}

.btn-add-info {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.btn-add-info:hover {
  background: #059669;
}

.btn-add-info:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.permissions-icon {
  color: #164194;
}

@media (max-width: 768px) {
  .form-grid-mini {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .btn-add-info {
    justify-self: start;
  }
}

@media (max-width: 480px) {
  .mini-header-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    width: 100%;
  }

  .period-selector {
    width: 100%;
  }

  .period-btn-mini {
    flex: 1;
  }
}

</style>
