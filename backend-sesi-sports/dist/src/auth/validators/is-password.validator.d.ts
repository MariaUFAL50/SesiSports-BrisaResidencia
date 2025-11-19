import { ValidatorConstraintInterface } from 'class-validator';
export declare class IsPassword implements ValidatorConstraintInterface {
    validate(password: string): boolean;
    defaultMessage(): string;
}
