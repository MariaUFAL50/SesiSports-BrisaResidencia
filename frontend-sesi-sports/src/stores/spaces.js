// src/stores/spaces.js
import { defineStore } from 'pinia';

export const useSpacesStore = defineStore('spaces', {
  state: () => ({
    // Configurações de tipos e modalidades disponíveis
    availableTypes: [
      'Quadra',
      'Campo', 
      'Piscina',
      'Ginásio',
      'Sala',
      'Arena',
      'Estádio'
    ],
    
    availableModalities: [
      'Futebol',
      'Basquete', 
      'Vôlei',
      'Tênis',
      'Natação',
      'Futsal',
      'Handebol',
      'Beach Tennis',
      'Padel'
    ],
    
    // Lista de espaços cadastrados
    spaces: [
      {
        id: 1,
        name: 'Quadra de Futebol Society Premium',
        address: 'Av. Principal, 123 - Centro',
        hourlyRate: 150.00,
        type: 'Quadra',
        modality: 'Futebol',
        status: 'Disponível',
        maintenanceInfo: null, // null = funcionando, objeto = em manutenção
        description: 'Quadra de futebol society com grama sintética de alta qualidade, iluminação LED e vestiários completos. Ideal para partidas profissionais e treinos.',
        recurrence: {
          enabled: true,
          days: ['Seg a Sex'],
          startTime: '08:00',
          endTime: '18:00'
        },
        benefits: ['Piso antiderrapante', 'Lanchonete', 'Vestiário', 'Iluminação LED', 'Grama sintética', 'Material esportivo', 'Sistema de segurança'],
        photos: [
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&h=600&fit=crop'
        ],
        createdAt: '2025-07-20T10:00:00Z',
        createdBy: 'technician'
      },
      {
        id: 2,
        name: 'Quadra de Basquete Arena Central',
        address: 'Rua das Flores, 456 - Jardim',
        hourlyRate: 200.00,
        type: 'Quadra',
        modality: 'Basquete',
        status: 'Indisponível',
        maintenanceInfo: null,
        description: 'Quadra de basquete coberta com piso oficial, arquibancadas para 200 pessoas e sistema de som profissional. Perfeita para jogos e eventos.',
        recurrence: {
          enabled: true,
          days: ['Sab a Dom'],
          startTime: '07:00',
          endTime: '22:00'
        },
        benefits: ['Acessível', 'Cobertura', 'Arquibancada', 'Sistema de som', 'Piso oficial', 'Sistema de segurança', 'Material esportivo'],
        photos: [
          'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&h=600&fit=crop'
        ],
        createdAt: '2025-07-21T14:30:00Z',
        createdBy: 'technician'
      },
      {
        id: 3,
        name: 'Piscina Olímpica Aqua Sports',
        address: 'Complexo Esportivo SESI, 789 - Vila Nova',
        hourlyRate: 300.00,
        type: 'Piscina',
        modality: 'Natação',
        status: 'Disponível',
        maintenanceInfo: null,
        description: 'Piscina olímpica aquecida com 8 raias, sistema de cronometragem profissional e área para espectadores. Ideal para competições e treinos de alto rendimento.',
        recurrence: {
          enabled: true,
          days: ['Todos os dias'],
          startTime: '06:00',
          endTime: '22:00'
        },
        benefits: ['Aquecida', 'Cronometragem', 'Vestiário premium', 'Salva-vidas', 'Área para espectadores', 'Acessível', 'Sistema de segurança'],
        photos: [
          'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=600&fit=crop'
        ],
        createdAt: '2025-07-22T09:15:00Z',
        createdBy: 'technician'
      },
      {
        id: 4,
        name: 'Quadra de Vôlei Beach Club',
        address: 'Praia Artificial SESI, 321 - Orla',
        hourlyRate: 120.00,
        type: 'Quadra',
        modality: 'Vôlei',
        status: 'Manutenção',
        maintenanceInfo: {
          reason: 'Manutenção',
          estimatedEnd: '2025-09-16',
          urgency: 'baixa'
        },
        description: 'Quadra de vôlei de praia com areia importada, rede oficial e ambiente climatizado. Experiência única de praia no centro da cidade.',
        recurrence: {
          enabled: true,
          days: ['Todos os dias'],
          startTime: '08:00',
          endTime: '20:00'
        },
        benefits: ['Areia importada', 'Rede oficial', 'Climatização', 'Chuveiro', 'Bar na praia', 'Material esportivo', 'Sistema de segurança'],
        photos: [
          'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1559166631-ef208440c75a?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1571019613914-85e3d652739d?w=800&h=600&fit=crop'
        ],
        createdAt: '2025-07-23T16:45:00Z',
        createdBy: 'technician'
      },
      {
        id: 5,
        name: 'Arena de Tênis Professional',
        address: 'Centro de Tênis SESI, 654 - Alto Padrão',
        hourlyRate: 250.00,
        type: 'Quadra',
        modality: 'Tênis',
        status: 'Disponível',
        maintenanceInfo: null,
        description: 'Quadra de tênis com piso saibro profissional, iluminação para jogos noturnos e área VIP para acompanhantes. Padrão ATP.',
        recurrence: {
          enabled: true,
          days: ['Todos os dias'],
          startTime: '06:00',
          endTime: '23:00'
        },
        benefits: ['Piso saibro', 'Iluminação noturna', 'Área VIP', 'Material esportivo', 'Placar eletrônico', 'Acessível', 'Sistema de segurança'],
        photos: [
          'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
        ],
        createdAt: '2025-07-24T11:20:00Z',
        createdBy: 'technician'
      }
    ],
    
    // Filtros aplicados
    filters: {
      search: '',
      type: '',
      modality: '',
      status: '',
      priceRange: { min: 0, max: 1000 }
    },
    
    // Configurações
    settings: {
      itemsPerPage: 8,
      currentPage: 1
    }
  }),

  getters: {
    // Espaços filtrados
    filteredSpaces: (state) => {
      let filtered = [...state.spaces];
      
      // Filtro por busca (nome ou endereço)
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        filtered = filtered.filter(space => 
          space.name.toLowerCase().includes(searchTerm) ||
          space.address.toLowerCase().includes(searchTerm)
        );
      }
      
      // Filtro por tipo
      if (state.filters.type) {
        filtered = filtered.filter(space => 
          space.type.toLowerCase() === state.filters.type.toLowerCase()
        );
      }
      
      // Filtro por modalidade
      if (state.filters.modality) {
        filtered = filtered.filter(space => 
          space.modality.toLowerCase() === state.filters.modality.toLowerCase()
        );
      }
      
      // Filtro por status
      if (state.filters.status) {
        filtered = filtered.filter(space => 
          space.status.toLowerCase() === state.filters.status.toLowerCase()
        );
      }
      
      // Filtro por faixa de preço
      filtered = filtered.filter(space => 
        space.hourlyRate >= state.filters.priceRange.min &&
        space.hourlyRate <= state.filters.priceRange.max
      );
      
      // Marcar apenas espaços em manutenção para alerta
      filtered = filtered.map(space => ({
        ...space,
        showMaintenanceAlert: space.status === 'Manutenção'
      }));
      
      return filtered;
    },
    
    // Espaços paginados
    paginatedSpaces: (state) => {
      const filtered = state.filteredSpaces;
      const start = (state.settings.currentPage - 1) * state.settings.itemsPerPage;
      const end = start + state.settings.itemsPerPage;
      return filtered.slice(start, end);
    },
    
    // Total de páginas
    totalPages: (state) => {
      return Math.ceil(state.filteredSpaces.length / state.settings.itemsPerPage);
    },
    
    // Estatísticas
    stats: (state) => {
      const spaces = state.spaces;
      return {
        total: spaces.length,
        available: spaces.filter(s => s.status === 'Disponível').length,
        occupied: spaces.filter(s => s.status === 'Ocupado').length,
        maintenance: spaces.filter(s => s.status === 'Manutenção').length,
        averageRate: spaces.length > 0 
          ? (spaces.reduce((sum, s) => sum + s.hourlyRate, 0) / spaces.length).toFixed(2)
          : 0
      };
    }
  },

  actions: {
    // Inicializar dados do localStorage
    initializeSpaces() {
      const savedSpaces = localStorage.getItem('sesi_sports_spaces');
      const savedFilters = localStorage.getItem('sesi_sports_spaces_filters');
      const savedSettings = localStorage.getItem('sesi_sports_spaces_settings');
      const savedTypes = localStorage.getItem('sesi_sports_types');
      const savedModalities = localStorage.getItem('sesi_sports_modalities');
      
      // Carregar tipos personalizados
      if (savedTypes) {
        try {
          const parsedTypes = JSON.parse(savedTypes);
          if (Array.isArray(parsedTypes) && parsedTypes.length > 0) {
            this.availableTypes = parsedTypes;
          }
        } catch (error) {
          console.error('Erro ao carregar tipos do localStorage:', error);
        }
      }
      
      // Carregar modalidades personalizadas
      if (savedModalities) {
        try {
          const parsedModalities = JSON.parse(savedModalities);
          if (Array.isArray(parsedModalities) && parsedModalities.length > 0) {
            this.availableModalities = parsedModalities;
          }
        } catch (error) {
          console.error('Erro ao carregar modalidades do localStorage:', error);
        }
      }
      
      if (savedSpaces) {
        try {
          const parsed = JSON.parse(savedSpaces);
          if (parsed && parsed.length > 0) {
            this.spaces = parsed;
          }
        } catch (error) {
          console.error('Erro ao carregar espaços do localStorage:', error);
        }
      }
      
      // Se não há espaços salvos ou houve erro, manter os dados iniciais
      console.log('Espaços inicializados:', this.spaces.length, 'espaços');
      
      if (savedFilters) {
        try {
          this.filters = { ...this.filters, ...JSON.parse(savedFilters) };
        } catch (error) {
          console.error('Erro ao carregar filtros do localStorage:', error);
        }
      }
      
      if (savedSettings) {
        try {
          this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        } catch (error) {
          console.error('Erro ao carregar configurações do localStorage:', error);
        }
      }
    },
    
    // Salvar no localStorage
    saveToStorage() {
      localStorage.setItem('sesi_sports_spaces', JSON.stringify(this.spaces));
      localStorage.setItem('sesi_sports_spaces_filters', JSON.stringify(this.filters));
      localStorage.setItem('sesi_sports_spaces_settings', JSON.stringify(this.settings));
      localStorage.setItem('sesi_sports_types', JSON.stringify(this.availableTypes));
      localStorage.setItem('sesi_sports_modalities', JSON.stringify(this.availableModalities));
    },
    
    // Adicionar novo espaço
    addSpace(spaceData) {
      console.log('🔧 Store: Recebendo dados para criar espaço:', spaceData);
      
      // Garantir que todos os campos essenciais existem
      const newSpace = {
        id: Date.now(), // ID simples baseado em timestamp
        name: spaceData.name || 'Espaço sem nome',
        type: spaceData.type || 'Quadra',
        modality: spaceData.modality || spaceData.type || 'Geral',
        capacity: spaceData.capacity || 10,
        hourlyRate: spaceData.hourlyRate || 50,
        address: spaceData.address || 'Endereço não informado',
        description: spaceData.description || '',
        status: spaceData.status || 'Disponível',
        createdAt: new Date().toISOString(),
        createdBy: 'admin',
        photos: spaceData.photos || ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop'],
        benefits: spaceData.benefits || []
      };
      
      this.spaces.push(newSpace);
      this.saveToStorage();
      console.log('✅ Store: Novo espaço adicionado com sucesso:', newSpace);
      return newSpace;
    },
    
    // Atualizar espaço existente
    updateSpace(id, updatedData) {
      console.log('🔧 Store: Atualizando espaço ID:', id);
      console.log('📊 Store: Dados recebidos:', updatedData);
      
      const index = this.spaces.findIndex(space => space.id === id);
      if (index !== -1) {
        // Manter alguns campos originais e atualizar apenas os novos
        this.spaces[index] = { 
          ...this.spaces[index], 
          ...updatedData,
          updatedAt: new Date().toISOString()
        };
        this.saveToStorage();
        console.log('✅ Store: Espaço atualizado com sucesso:', this.spaces[index]);
        return this.spaces[index];
      }
      console.error('❌ Store: Espaço não encontrado para ID:', id);
      return null;
    },
    
    // Remover espaço
    removeSpace(id) {
      const index = this.spaces.findIndex(space => space.id === id);
      if (index !== -1) {
        const removedSpace = this.spaces.splice(index, 1)[0];
        this.saveToStorage();
        console.log('Espaço removido:', removedSpace);
        return removedSpace;
      }
      return null;
    },
    
    // Obter espaço por ID
    getSpaceById(id) {
      return this.spaces.find(space => space.id === id);
    },
    
    // Atualizar filtros
    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters };
      this.settings.currentPage = 1; // Reset para primeira página
      this.saveToStorage();
    },
    
    // Limpar filtros
    clearFilters() {
      this.filters = {
        search: '',
        type: '',
        modality: '',
        status: '',
        priceRange: { min: 0, max: 1000 }
      };
      this.settings.currentPage = 1;
      this.saveToStorage();
    },
    
    // Alterar página
    setPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.settings.currentPage = page;
        this.saveToStorage();
      }
    },
    
    // Formatar preço para exibição
    formatPrice(price) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price);
    },
    
    // Formatar data para exibição
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    
    // Validar dados do espaço
    validateSpaceData(spaceData) {
      const errors = [];
      
      if (!spaceData.name?.trim()) {
        errors.push('Nome do espaço é obrigatório');
      }
      
      if (!spaceData.address?.trim()) {
        errors.push('Endereço é obrigatório');
      }
      
      if (!spaceData.hourlyRate || spaceData.hourlyRate <= 0) {
        errors.push('Valor por hora deve ser maior que zero');
      }
      
      if (!spaceData.type?.trim()) {
        errors.push('Tipo é obrigatório');
      }
      
      if (!spaceData.modality?.trim()) {
        errors.push('Modalidade é obrigatória');
      }
      
      if (!spaceData.status?.trim()) {
        errors.push('Situação é obrigatória');
      }
      
      return errors;
    },
    
    // Buscar espaços por critérios específicos
    searchSpaces(criteria) {
      return this.spaces.filter(space => {
        const matchesName = !criteria.name || 
          space.name.toLowerCase().includes(criteria.name.toLowerCase());
        
        const matchesType = !criteria.type || 
          space.type.toLowerCase() === criteria.type.toLowerCase();
        
        const matchesModality = !criteria.modality || 
          space.modality.toLowerCase() === criteria.modality.toLowerCase();
        
        const matchesStatus = !criteria.status || 
          space.status.toLowerCase() === criteria.status.toLowerCase();
        
        return matchesName && matchesType && matchesModality && matchesStatus;
      });
    },
    
    // Gerenciar tipos de estrutura
    addType(newType) {
      const trimmedType = newType?.trim();
      if (trimmedType && !this.availableTypes.includes(trimmedType)) {
        this.availableTypes.push(trimmedType);
        this.saveToStorage();
        return true;
      }
      return false;
    },
    
    removeType(typeToRemove) {
      const index = this.availableTypes.indexOf(typeToRemove);
      if (index > -1) {
        this.availableTypes.splice(index, 1);
        this.saveToStorage();
        return true;
      }
      return false;
    },
    
    // Gerenciar modalidades esportivas
    addModality(newModality) {
      const trimmedModality = newModality?.trim();
      if (trimmedModality && !this.availableModalities.includes(trimmedModality)) {
        this.availableModalities.push(trimmedModality);
        this.saveToStorage();
        return true;
      }
      return false;
    },
    
    // Carregar todos os espaços (limpar filtros e mostrar todos)
    loadAllSpaces() {
      this.clearFilters();
      console.log('Carregando todos os espaços - Total:', this.spaces.length);
    },
    
    removeModality(modalityToRemove) {
      const index = this.availableModalities.indexOf(modalityToRemove);
      if (index > -1) {
        this.availableModalities.splice(index, 1);
        this.saveToStorage();
        return true;
      }
      return false;
    }
  }
});
