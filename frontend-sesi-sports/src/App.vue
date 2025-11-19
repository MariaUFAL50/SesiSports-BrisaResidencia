<template>
  <div id="app">
    <AuthModal
      :isVisible="isAuthModalVisible"
      @update:isVisible="isAuthModalVisible = $event"
      @loginSuccess="handleLoginSuccess"
      @registerSuccess="handleRegisterSuccess"
    />

    <router-view />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'; // Importa ref para reatividade e provide para injeção de dependência
import AuthModal from './components/auth/AuthModal.vue'; // Importa o componente do modal de autenticação

// Estado reativo para controlar a visibilidade do modal de autenticação
const isAuthModalVisible = ref(false);

// Função que será fornecida para componentes filhos/netos via 'provide'
// Permite que componentes como HomeView.vue possam abrir o modal
const openAuthModal = () => {
  isAuthModalVisible.value = true;
};

// 'provide' torna 'openAuthModal' disponível para qualquer componente descendente
// que use `inject('openAuthModal')`
provide('openAuthModal', openAuthModal);

// Função de callback executada quando o login é bem-sucedido no AuthModal
const handleLoginSuccess = () => {
  alert('Login realizado com sucesso!');
  isAuthModalVisible.value = false; // Fecha o modal após login
  // TODO: Adicione aqui a lógica de redirecionamento, ex: router.push('/dashboard');
};

// Função de callback executada quando o cadastro é bem-sucedido no AuthModal
const handleRegisterSuccess = () => {
  alert('Cadastro realizado com sucesso!');
  isAuthModalVisible.value = false; // Fecha o modal após cadastro
  // TODO: Adicione aqui a lógica de redirecionamento, ex: router.push('/login');
};
</script>

<style>
/*
 * Estilos globais para a tag #app ou body.
 * Recomenda-se manter estilos globais mínimos aqui.
 * Lembre-se que `src/styles/main.css` já lida com as diretivas `@tailwind`.
 */
</style>