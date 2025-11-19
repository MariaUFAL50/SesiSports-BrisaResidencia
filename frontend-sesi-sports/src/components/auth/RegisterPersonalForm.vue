<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-xl font-semibold text-text-dark">Dados Pessoais<span class="text-red-500">*</span></h2>

    <div>
      <label for="cpfRegister" class="block text-sm font-medium text-text-dark mb-1">CPF<span class="text-red-500">*</span></label>
      <InputMask
        id="cpfRegister"
        v-model="v$.cpf.$model"
        mask="999.999.999-99"
        placeholder="000.000.000-00"
        :class="[
          'w-full p-3 border rounded-md focus:ring-primary-green focus:border-primary-green transition-all duration-200',
          {'border-red-500': v$.cpf.$error, 'border-gray-300': !v$.cpf.$error},
          'bg-light-gray-bg'
        ]"
        @blur="v$.cpf.$touch"
        aria-describedby="cpfRegister-error"
      />
      <span v-if="v$.cpf.$error" id="cpfRegister-error" class="text-red-500 text-xs mt-1 block">
        {{ v$.cpf.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="fullName" class="block text-sm font-medium text-text-dark mb-1">Nome Completo<span class="text-red-500">*</span></label>
      <InputText
        id="fullName"
        type="text"
        v-model="v$.fullName.$model"
        class="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-green focus:border-primary-green transition-all duration-200"
        :class="{
          'border-red-500': v$.fullName.$error,
          'border-gray-300': !v$.fullName.$error,
          'bg-light-gray-bg': true
        }"
        @blur="v$.fullName.$touch"
        aria-describedby="fullName-error"
      />
      <span v-if="v$.fullName.$error" id="fullName-error" class="text-red-500 text-xs mt-1 block">
        {{ v$.fullName.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="cellphone" class="block text-sm font-medium text-text-dark mb-1">Celular<span class="text-red-500">*</span> <span class="text-gray-500 text-xs">(Whatsapp)</span></label>
      <InputMask
        id="cellphone"
        v-model="v$.cellphone.$model"
        mask="(99) 9 9999-9999"
        placeholder="(00) 0 0000-0000"
        :class="[
          'w-full p-3 border rounded-md focus:ring-primary-green focus:border-primary-green transition-all duration-200',
          {'border-red-500': v$.cellphone.$error, 'border-gray-300': !v$.cellphone.$error},
          'bg-light-gray-bg'
        ]"
        @blur="v$.cellphone.$touch"
        aria-describedby="cellphone-error"
      />
      <span v-if="v$.cellphone.$error" id="cellphone-error" class="text-red-500 text-xs mt-1 block">
        {{ v$.cellphone.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-text-dark mb-1">Melhor e-mail</label>
      <InputText
        id="email"
        type="email"
        v-model="v$.email.$model"
        placeholder="exemplo@email.com"
        class="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-green focus:border-primary-green transition-all duration-200"
        :class="{
          'border-red-500': v$.email.$error,
          'border-gray-300': !v$.email.$error,
          'bg-light-gray-bg': true
        }"
        @blur="v$.email.$touch"
        aria-describedby="email-error"
      />
      <span v-if="v$.email.$error" id="email-error" class="text-red-500 text-xs mt-1 block">
        {{ v$.email.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-text-dark mb-1">Senha<span class="text-red-500">*</span></label>
      <InputText
        id="password"
        type="password"
        v-model="v$.password.$model"
        placeholder="Mínimo 6 caracteres"
        class="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-green focus:border-primary-green transition-all duration-200"
        :class="{
          'border-red-500': v$.password.$error,
          'border-gray-300': !v$.password.$error,
          'bg-light-gray-bg': true
        }"
        @blur="v$.password.$touch"
        aria-describedby="password-error"
      />
      <span v-if="v$.password.$error" id="password-error" class="text-red-500 text-xs mt-1 block">
        {{ v$.password.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-text-dark mb-1">Confirmar Senha<span class="text-red-500">*</span></label>
      <InputText
        id="confirmPassword"
        type="password"
        v-model="v$.confirmPassword.$model"
        placeholder="Repita a senha"
        class="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-green focus:border-primary-green transition-all duration-200"
        :class="{
          'border-red-500': v$.confirmPassword.$error,
          'border-gray-300': !v$.confirmPassword.$error,
          'bg-light-gray-bg': true
        }"
        @blur="v$.confirmPassword.$touch"
        aria-describedby="confirmPassword-error"
      />
      <span v-if="v$.confirmPassword.$error" id="confirmPassword-error" class="text-red-500 text-xs mt-1 block">
        {{ v$.confirmPassword.$errors[0].$message }}
      </span>
    </div>

    <Button
      label="Próximo"
      class="w-full p-3 bg-primary-green text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-200 mt-4"
      @click="handleNext"
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
import { required, email, minLength, helpers } from '@vuelidate/validators';
import { isValidCpf, isValidCellphone } from '../../utils/validation';

import { useAuthStore } from '../../stores/auth';
const authStore = useAuthStore();

const emit = defineEmits(['nextStep']);

const personalData = reactive({
  cpf: authStore.registrationData.cpf,
  fullName: authStore.registrationData.fullName,
  cellphone: authStore.registrationData.cellphone,
  email: authStore.registrationData.email,
  password: authStore.registrationData.password || '',
  confirmPassword: authStore.registrationData.confirmPassword || '',
});

const sameAsPassword = (value) => value === personalData.password;

const rules = {
  cpf: {
    required: helpers.withMessage('CPF é obrigatório', required),
    isValidCpf: isValidCpf,
  },
  fullName: {
    required: helpers.withMessage('Nome completo é obrigatório', required),
    minLength: helpers.withMessage('O nome deve ter no mínimo 3 caracteres', minLength(3)),
  },
  cellphone: {
    required: helpers.withMessage('Celular é obrigatório', required),
    isValidCellphone: isValidCellphone,
  },
  email: {
    email: helpers.withMessage('Email inválido', email)
  },
  password: {
    required: helpers.withMessage('Senha é obrigatória', required),
    minLength: helpers.withMessage('A senha deve ter no mínimo 6 caracteres', minLength(6)),
  },
  confirmPassword: {
    required: helpers.withMessage('Confirmação de senha é obrigatória', required),
    sameAsPassword: helpers.withMessage('As senhas não conferem', sameAsPassword),
  },
};

const v$ = useVuelidate(rules, personalData);

const handleNext = async () => {
  v$.value.$touch();
  const isFormValid = await v$.value.$validate();

  if (isFormValid) {
    console.log('RegisterPersonalForm: Dados pessoais válidos.');
    // Limpar formatação antes de salvar
    const cleanedData = {
      ...personalData,
      cpf: personalData.cpf.replace(/[^\d]/g, ''),
      cellphone: personalData.cellphone.replace(/[^\d]/g, '')
    };
    authStore.updatePersonalData(cleanedData);
    emit('nextStep');
  } else {
    console.log('RegisterPersonalForm: Formulário de dados pessoais inválido.');
  }
};
</script>
