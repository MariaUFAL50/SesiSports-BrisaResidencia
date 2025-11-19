import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsPhone', async: false })
export class IsPhone implements ValidatorConstraintInterface {
  validate(text: string) {
    const cleanPhone = text.replace(/\D/g, '');
    
    if (cleanPhone.length === 10 || cleanPhone.length === 11) {
      return true;
    }
    
    if (cleanPhone.length === 13 && cleanPhone.startsWith('55')) {
      return true;
    }
    
    return false;
  }

  defaultMessage() {
    return 'O telefone deve ter 10 ou 11 dígitos (formato brasileiro).';
  }
}