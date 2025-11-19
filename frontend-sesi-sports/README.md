# SESI Sports

Sistema de reserva de espaços esportivos desenvolvido em Vue.js para o SESI.

## Tecnologias

- Vue.js 3
- Pinia (gerenciamento de estado)
- Vue Router
- Tailwind CSS
- Chart.js
- Vite

## Funcionalidades

### Usuário
- Cadastro e autenticação
- Busca e reserva de espaços esportivos
- Filtros por tipo e modalidade
- Histórico de reservas

### Administrador
- Painel administrativo
- Gestão de espaços
- Visualização de agendamentos
- Relatórios com gráficos
- Dashboard com métricas

## Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Estrutura

```
src/
├── components/      # Componentes reutilizáveis
├── views/          # Páginas da aplicação
├── stores/         # Gerenciamento de estado (Pinia)
├── router/         # Configuração de rotas
├── styles/         # Estilos globais
└── utils/          # Utilitários e validações
```

## Configuração

O projeto utiliza configurações padrão do Vite e Tailwind CSS. As variáveis de ambiente podem ser configuradas em arquivo `.env`.

## Licença

Projeto desenvolvido para o SESI.
