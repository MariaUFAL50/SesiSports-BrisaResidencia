# SESI Sports - Credenciais de Administrador

## 🔐 Login de Administrador

Para acessar o sistema com privilégios de administrador, utilize as seguintes credenciais no formulário de login:

### Credenciais de Administrador
- **CPF:** `000.000.000-01`
- **Senha:** `admin@2025`

## ✨ Funcionalidades do Administrador

Quando logado como administrador, você terá acesso a:

### 1. Banner de Status
- Indicação visual de que está em "MODO ADMINISTRADOR"
- Botão de acesso rápido ao Painel Administrativo

### 2. Painel Administrativo (`/admin`)
- **Gerenciamento de Usuários:** Visualizar e gerenciar todos os usuários
- **Gerenciamento de Espaços:** Configurar espaços esportivos
- **Controle de Reservas:** Visualizar e gerenciar reservas
- **Gestão Financeira:** Relatórios e controle de pagamentos
- **Configurações do Sistema:** Ajustes gerais
- **Relatórios:** Estatísticas e análises

### 3. Proteção de Rota
- A rota `/admin` é protegida e só pode ser acessada por administradores
- Redirecionamento automático para home se tentar acessar sem privilégios

## 🚀 Como Testar

1. Acesse o sistema: `http://localhost:5175`
2. Clique em "Entrar" para abrir o modal de login
3. Use as credenciais de administrador:
   - CPF: `000.000.000-01`
   - Senha: `admin@2025`
4. Após o login, você verá o banner vermelho indicando modo administrador
5. Clique em "Painel Administrativo" para acessar o dashboard

## 📋 Outras Credenciais de Teste

### Usuário Cliente
- **CPF:** `123.456.789-00`
- **Senha:** `senha123`

### Usuário Técnico
- **CPF:** `111.111.111-11`
- **Senha:** `admin123`

## 🛡️ Segurança

- As credenciais estão hardcoded apenas para desenvolvimento
- Em produção, implemente autenticação real com banco de dados
- Considere usar JWT tokens para sessões
- Implemente validação de permissões no backend

## 🔧 Estrutura Técnica

### Store de Autenticação (`src/stores/auth.js`)
- Contém a lógica de login para diferentes tipos de usuário
- Getters para verificar tipo de usuário (`isAdmin`, `isTechnician`, `isClient`)
- Sistema de permissões para administradores

### Proteção de Rotas (`src/router/index.js`)
- Guard de navegação `beforeEach`
- Meta field `requiresAdmin` para proteção de rotas
- Redirecionamento automático para não autorizados

### Componentes
- `AdminDashboardView.vue`: Interface do painel administrativo
- `LoginForm.vue`: Formulário com credenciais de teste visíveis
- `HomeView.vue`: Banner de status e acesso rápido ao painel
