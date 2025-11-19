import { ValidatorConstraintInterface } from 'class-validator';
export declare class IsCpfCnpj implements ValidatorConstraintInterface {
    validate(text: string): boolean;
    defaultMessage(): string;
}
