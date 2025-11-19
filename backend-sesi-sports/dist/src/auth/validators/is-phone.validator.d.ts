import { ValidatorConstraintInterface } from 'class-validator';
export declare class IsPhone implements ValidatorConstraintInterface {
    validate(text: string): boolean;
    defaultMessage(): string;
}
