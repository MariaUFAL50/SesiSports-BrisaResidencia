<template>
  <form @submit.prevent="submitForm">
    <div>
      <label for="name">Nome:</label>
      <input id="name" v-model="form.name" type="text" class="border p-1" />
      <span v-if="v$.name.$error" class="text-red-500 text-sm">
        O nome é obrigatório.
      </span>
    </div>

    <button type="submit" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
      Enviar
    </button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

// Define o objeto do formulário
const form = reactive({
  name: ''
})

// Define as validações
const rules = {
  name: { required }
}

// Inicializa o Vuelidate
const v$ = useVuelidate(rules, form)

// Função de envio
function submitForm() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    alert('Formulário enviado com sucesso!')
    // aqui você pode enviar o `form` para o backend
  }
}
</script>
