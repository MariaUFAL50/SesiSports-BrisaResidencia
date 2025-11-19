// src/stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    registrationData: {
      cpf: '',
      fullName: '',
      cellphone: '',
      email: '',
      cep: '',
      number: '',
      street: '',
      city: '',
      state: '',
      complement: '',
      password: '',
      confirmPassword: '',
      verificationCode: '',
    },
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    emailVerificationSent: false,
  }),

  actions: {
    // Inicializa o estado da autenticação carregando do localStorage
    initializeAuth() {
      const savedUser = localStorage.getItem('sesi_sports_user');
      if (savedUser) {
        try {
          this.currentUser = JSON.parse(savedUser);
          this.isAuthenticated = true;
        } catch (error) {
          console.error('Erro ao carregar usuário do localStorage:', error);
          localStorage.removeItem('sesi_sports_user');
        }
      }
    },

    // Salva o usuário no localStorage
    saveUserToStorage(user) {
      localStorage.setItem('sesi_sports_user', JSON.stringify(user));
    },

    // Remove o usuário do localStorage
    removeUserFromStorage() {
      localStorage.removeItem('sesi_sports_user');
    },

    // Atualiza a foto de perfil do usuário
    updateProfilePhoto(photoData) {
      if (this.currentUser) {
        this.currentUser.profilePhoto = photoData;
        this.saveUserToStorage(this.currentUser);
      }
    },

    // Remove a foto de perfil do usuário
    removeProfilePhoto() {
      if (this.currentUser) {
        this.currentUser.profilePhoto = null;
        this.saveUserToStorage(this.currentUser);
      }
    },

    // Atualiza dados do perfil do usuário
    updateUserProfile(profileData) {
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...profileData };
        this.saveUserToStorage(this.currentUser);
      }
    },

    updatePersonalData(data) {
      this.registrationData = { ...this.registrationData, ...data };
    },

    updateAddressData(data) {
      this.registrationData = { ...this.registrationData, ...data };
    },

    updateVerificationCode(code) {
      this.registrationData.verificationCode = code;
    },

    resetRegistrationData() {
      this.registrationData = {
        cpf: '',
        fullName: '',
        cellphone: '',
        email: '',
        cep: '',
        number: '',
        street: '',
        city: '',
        state: '',
        complement: '',
        password: '',
        confirmPassword: '',
        verificationCode: '',
      };
      this.emailVerificationSent = false;
      this.error = null; // Limpar erro ao resetar
    },

    async login(credentials) {
      this.isLoading = true;
      this.error = null;
      try {
        const base = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000';
        const url = `${base.replace(/\/$/, '')}/auth/login`;

        // Remover formatação do CPF (pontos e traços)
        const cpfCnpj = (credentials.cpf || credentials.cpfCnpj || credentials.identifier || '')
          .replace(/[^\d]/g, '');

        // Backend espera cpfCnpj e password (sem formatação)
        const payload = {
          cpfCnpj: cpfCnpj,
          password: credentials.password,
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errText = await res.text();
          let errorMessage = 'Erro ao autenticar';
          
          // Tentar extrair mensagem limpa do erro JSON
          try {
            const errJson = JSON.parse(errText);
            if (errJson.message) {
              errorMessage = Array.isArray(errJson.message) ? errJson.message[0] : errJson.message;
            }
          } catch {
            errorMessage = errText || errorMessage;
          }
          
          throw new Error(errorMessage);
        }

        const data = await res.json();

        // Normalizar tipo de usuário
        const normalizeType = (type) => {
          if (!type) return 'client';
          const t = String(type).toUpperCase();
          if (t === 'ADMIN' || t === 'ADMINISTRATOR') return 'admin';
          if (t === 'TECHNICIAN' || t === 'TECNICO') return 'technician';
          if (t === 'CLIENT' || t === 'CLIENTE') return 'client';
          return type.toString().toLowerCase();
        };

        // data = { access_token, user: { id, nome, email, tipo, fotoUrl } }
        this.currentUser = {
          id: data.user?.id ?? data.id,
          name: data.user?.nome ?? data.nome ?? data.name,
          cpf: data.user?.cpfCnpj ?? cpfCnpj,
          email: data.user?.email ?? data.email,
          type: normalizeType(data.user?.tipo ?? data.tipo ?? data.type),
          token: data.access_token ?? data.token,
          fotoUrl: data.user?.fotoUrl ?? data.fotoUrl,
        };
        this.isAuthenticated = true;
        localStorage.setItem('sesi_sports_token', data.access_token ?? data.token);
        this.saveUserToStorage(this.currentUser);
        return true;
      } catch (err) {
        this.error = err.message || 'Erro ao realizar login.';
        this.isAuthenticated = false;
        this.currentUser = null;
        console.error('Pinia (AuthStore): Erro no login:', err);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Registra o usuário no backend e envia e-mail de verificação.
     */
    async registerUser() {
      this.isLoading = true;
      this.error = null;
      try {
        const base = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000';
        const url = `${base.replace(/\/$/, '')}/auth/register`;

        // Remover formatação do CPF
        const cpfCnpj = (this.registrationData.cpf || '').replace(/[^\d]/g, '');
        const phoneNumber = (this.registrationData.cellphone || '').replace(/[^\d]/g, '');

        const payload = {
          nome: this.registrationData.fullName,
          email: this.registrationData.email,
          cpfCnpj: cpfCnpj,
          phoneNumber: phoneNumber,
          password: this.registrationData.password,
          cep: this.registrationData.cep,
          city: this.registrationData.city || 'N/A',
          state: this.registrationData.state || 'N/A',
          street: this.registrationData.street,
          number: this.registrationData.number ? parseInt(this.registrationData.number) : null,
          complement: this.registrationData.complement || null,
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errText = await res.text();
          let errorMessage = 'Erro ao registrar usuário';
          
          // Tentar extrair mensagem limpa do erro JSON
          try {
            const errJson = JSON.parse(errText);
            if (errJson.message) {
              errorMessage = errJson.message;
            }
          } catch {
            errorMessage = errText || errorMessage;
          }
          
          throw new Error(errorMessage);
        }

        const data = await res.json();
        
        this.emailVerificationSent = true;
        return true;
      } catch (err) {
        this.error = err.message || 'Erro ao finalizar o cadastro.';
        console.error('Pinia (AuthStore): Erro no registro:', err);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Verifica o código de e-mail e autentica o usuário.
     */
    async verifyEmailCode() {
      this.isLoading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (this.registrationData.verificationCode === '1234') {
            this.currentUser = { 
              id: Date.now(), 
              name: this.registrationData.fullName, 
              cpf: this.registrationData.cpf,
              email: this.registrationData.email,
              phone: this.registrationData.cellphone,
              address: {
                street: this.registrationData.street,
                number: this.registrationData.number,
                complement: this.registrationData.complement,
                cep: this.registrationData.cep
              },
              verified: true,
              type: 'client',
              registeredAt: new Date().toISOString()
            };

            this.isAuthenticated = true;
            this.saveUserToStorage(this.currentUser);
            this.resetRegistrationData();
            return true;
        } else {
            throw new Error('Código de verificação inválido. Tente novamente.');
        }
      } catch (err) {
        this.error = err.message || 'Erro ao verificar código.';
        console.error('Pinia (AuthStore): Erro na verificação:', err);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.currentUser = null;
      this.isAuthenticated = false;
      this.removeUserFromStorage();
    },
  },

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    getUser: (state) => state.currentUser,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    isEmailVerificationPending: (state) => state.emailVerificationSent && !state.isAuthenticated,
    isAdmin: (state) => state.currentUser?.type === 'admin',
    isTechnician: (state) => state.currentUser?.type === 'technician',
    isClient: (state) => state.currentUser?.type === 'client',
    userType: (state) => state.currentUser?.type || null,
    hasPermission: (state) => (permission) => {
      if (!state.currentUser) return false;
      if (state.currentUser.type === 'admin') return true;
      return state.currentUser.permissions?.includes(permission) || false;
    },
    getUserProfilePhoto: (state) => state.currentUser?.profilePhoto || null,
  },
});