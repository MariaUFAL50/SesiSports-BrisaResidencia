<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-xl font-semibold text-text-dark">Endereço<span class="text-red-500">*</span></h2>
    <p class="text-sm text-gray-600 -mt-2">Preencha os dados corretamente!</p>

    <div>
      <label for="cep" class="block text-sm font-medium text-text-dark mb-1">CEP</label>
      <InputMask
        id="cep"
        v-model="v$.cep.$model"
        mask="99999-999"
        placeholder="00000-000"
        :class="[
          'w-full p-3 border rounded-md focus:ring-primary-green focus:border-primary-green transition-all duration-200',
          {'border-red-500': v$.cep.$error, 'border-gray-300': !v$.cep.$error},
          'bg-light-gray-bg'
        ]"
        @blur="v$.cep.$touch"
        aria-describedby="cep-error"
      />
      <span v-if="v$.cep.$error" id="cep-error" class="text-red-500 text-xs mt-1 block">
        {{ v$.cep.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="number" class="block text-sm font-medium text-text-dark mb-1">Número</label>
      <InputText
        id="number"
        type="text"
        v-model="v$.number.$model"
        class="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-green focus:border-primary-green transition-all duration-200"
        :class="{
          'border-red-500': v$.number.$error,
          'border-gray-300': !v$.number.$error,
          'bg-light-gray-bg': true
        }"
        @blur="v$.number.$touch"
        aria-describedby="number-error"
      />
      <span v-if="v$.number.$error" id="number-error" class="text-red-500 text-xs mt-1 block">
        {{ v$.number.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="street" class="block text-sm font-medium text-text-dark mb-1">Rua</label>
      <InputText
        id="street"
        type="text"
        v-model="v$.street.$model"
        class="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-green focus:border-primary-green transition-all duration-200"
        :class="{
          'border-red-500': v$.street.$error,
          'border-gray-300': !v$.street.$error,
          'bg-light-gray-bg': true
        }"
        @blur="v$.street.$touch"
        aria-describedby="street-error"
      />
      <span v-if="v$.street.$error" id="street-error" class="text-red-500 text-xs mt-1 block">
        {{ v$.street.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="city" class="block text-sm font-medium text-text-dark mb-1">Cidade<span class="text-red-500">*</span></label>
      <InputText
        id="city"
        type="text"
        v-model="v$.city.$model"
        class="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-green focus:border-primary-green transition-all duration-200"
        :class="{
          'border-red-500': v$.city.$error,
          'border-gray-300': !v$.city.$error,
          'bg-light-gray-bg': true
        }"
        @blur="v$.city.$touch"
        aria-describedby="city-error"
      />
      <span v-if="v$.city.$error" id="city-error" class="text-red-500 text-xs mt-1 block">
        {{ v$.city.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="state" class="block text-sm font-medium text-text-dark mb-1">Estado<span class="text-red-500">*</span></label>
      <InputText
        id="state"
        type="text"
        v-model="v$.state.$model"
        maxlength="2"
        placeholder="Ex: AL"
        class="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-green focus:border-primary-green transition-all duration-200"
        :class="{
          'border-red-500': v$.state.$error,
          'border-gray-300': !v$.state.$error,
          'bg-light-gray-bg': true
        }"
        @blur="v$.state.$touch"
        aria-describedby="state-error"
      />
      <span v-if="v$.state.$error" id="state-error" class="text-red-500 text-xs mt-1 block">
        {{ v$.state.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="complement" class="block text-sm font-medium text-text-dark mb-1">Complemento</label>
      <InputText
        id="complement"
        type="text"
        v-model="addressData.complement"
        class="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-green focus:border-primary-green transition-all duration-200"
        :class="{
          'bg-light-gray-bg': true
        }"
      />
    </div>

    <!-- Mensagem de erro -->
    <div v-if="authStore.error" class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm">
      <strong>Erro:</strong> {{ authStore.error }}
    </div>

    <Button
      :label="authStore.isLoading ? 'Cadastrando...' : 'Cadastrar-se'"
      class="w-full p-3 bg-primary-green text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-200 mt-4"
      :class="{ 'opacity-50 cursor-not-allowed': authStore.isLoading }"
      @click="handleRegister"
      :disabled="authStore.isLoading || (v$.$invalid && v$.$dirty)"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'; // defineEmits é macro, não precisa ser importado
import InputMask from 'primevue/inputmask';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { isValidCep } from '../../utils/validation';

import { useAuthStore } from '../../stores/auth';
const authStore = useAuthStore();

const emit = defineEmits(['registerComplete']);

const addressData = reactive({
  cep: authStore.registrationData.cep,
  number: authStore.registrationData.number,
  street: authStore.registrationData.street,
  city: authStore.registrationData.city || '',
  state: authStore.registrationData.state || '',
  complement: authStore.registrationData.complement,
});

const rules = {
  cep: {
    required: helpers.withMessage('CEP é obrigatório', required),
    isValidCep: isValidCep,
  },
  number: {
    required: helpers.withMessage('Número é obrigatório', required)
  },
  street: {
    required: helpers.withMessage('Rua é obrigatória', required)
  },
  city: {
    required: helpers.withMessage('Cidade é obrigatória', required)
  },
  state: {
    required: helpers.withMessage('Estado é obrigatório', required)
  },
  complement: {}
};

const v$ = useVuelidate(rules, addressData);

const handleRegister = async () => {
  v$.value.$touch();
  const isFormValid = await v$.value.$validate();

  if (isFormValid) {
    console.log('RegisterAddressForm: Dados de endereço válidos.');
    authStore.updateAddressData(addressData);

    const success = await authStore.registerUser(); // Chama a ação de registro inicial

    if (success) {
      emit('registerComplete'); // Emite para o AuthModal avançar para o próximo passo (Passo 3)
    }
  } else {
    console.log('RegisterAddressForm: Formulário de endereço inválido.');
  }
};
</script>
