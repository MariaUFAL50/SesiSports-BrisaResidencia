<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="w-full bg-white shadow-sm py-4 px-8 flex items-center gap-2">
      <img src="/sesi-sports-logo.png" alt="SESI Sports Logo" class="h-8 mr-2" />
      <h1 class="text-gray-800 font-bold text-base md:text-xl truncate">Financeiro</h1>
    </header>
    <main class="container mx-auto py-8">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <p class="text-gray-600 mb-4">Em breve: Relatórios financeiros, controle de pagamentos e movimentações.</p>
        <div class="flex flex-col gap-4">
          <div class="bg-yellow-50 p-4 rounded-lg">
            <i class="pi pi-dollar text-yellow-600 text-2xl mr-2"></i>
            <span class="font-semibold">Resumo Financeiro</span>
          </div>
          <div class="bg-yellow-100 p-4 rounded-lg">
            <span class="text-gray-700">Nenhum dado disponível ainda.</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Aqui você pode adicionar lógica de movimentação financeira futuramente
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
