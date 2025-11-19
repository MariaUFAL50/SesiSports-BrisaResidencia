import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsCep', async: false })
export class IsCep implements ValidatorConstraintInterface {
  validate(text: string) {
    const cepRegex = /^[0-9]{5}-?[0-9]{3}$/;
    return cepRegex.test(text);
  }

  defaultMessage() {
    return 'O CEP deve estar no formato 99999-999 ou 99999999.';
  }
}