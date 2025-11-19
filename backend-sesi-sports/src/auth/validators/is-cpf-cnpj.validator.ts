import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'IsCpfCnpj', async: false })
export class IsCpfCnpj implements ValidatorConstraintInterface {
  validate(text: string) {
    if (!text || typeof text !== 'string') {
      return false;
    }

    const cleanedText = text.replace(/[^\d]/g, '');

    if (cpf.isValid(cleanedText)) {
      return true;
    }

    if (cnpj.isValid(cleanedText)) {
      return true;
    }

    return false;
  }

  defaultMessage() {
    return 'O CPF/CNPJ informado é inválido.';
  }
}