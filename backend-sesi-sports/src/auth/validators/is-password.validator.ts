import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsPassword', async: false })
export class IsPassword implements ValidatorConstraintInterface {
  validate(password: string) {
    if (!password || typeof password !== 'string') {
      return false;
    }

  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
  }

  defaultMessage() {
    return 'A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número ou caractere especial.';
  }
}