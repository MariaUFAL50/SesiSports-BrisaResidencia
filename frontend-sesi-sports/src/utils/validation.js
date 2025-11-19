// src/utils/validation.js
import { helpers } from '@vuelidate/validators';

/**
 * Valida um CPF no formato brasileiro.
 * Use com Vuelidate: isValidCpf
 * VALIDAÇÃO SIMPLIFICADA: Apenas verifica se tem 11 números
 */
export const isValidCpf = helpers.withMessage(
  'CPF deve ter 11 números', // Mensagem mais clara
  (value) => {
    // Validação básica apenas para verificar se não está vazio
    if (!value || typeof value !== 'string') {
      return false;
    }

    // Remove caracteres não numéricos
    const cleanedCpf = value.replace(/[^\d]/g, '');

    // Aceita qualquer sequência de exatamente 11 números
    return cleanedCpf.length === 11;
  }
);

/**
 * Valida um CEP no formato brasileiro (8 dígitos numéricos).
 * Use com Vuelidate: isValidCep
 */
export const isValidCep = helpers.withMessage(
  'CEP inválido', // Mensagem de erro para o Vuelidate
  (value) => {
    if (!value || typeof value !== 'string') {
      return false;
    }
    const cleanedCep = value.replace(/[^\d]/g, '');
    return cleanedCep.length === 8;
  }
);

/**
 * Valida um número de telefone celular no formato brasileiro.
 * Considera 10 ou 11 dígitos após remover caracteres não numéricos.
 * Use com Vuelidate: isValidCellphone
 */
export const isValidCellphone = helpers.withMessage(
  'Número de celular inválido', // Mensagem de erro para o Vuelidate
  (value) => {
    if (!value || typeof value !== 'string') {
      return false;
    }
    const cleanedCellphone = value.replace(/[^\d]/g, '');
    // Formatos comuns: 10 dígitos (sem '9' na frente do DDD), 11 dígitos (com '9' no DDD)
    return cleanedCellphone.length >= 10 && cleanedCellphone.length <= 11;
  }
);