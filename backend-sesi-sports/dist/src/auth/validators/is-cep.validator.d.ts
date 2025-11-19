import { ValidatorConstraintInterface } from 'class-validator';
export declare class IsCep implements ValidatorConstraintInterface {
    validate(text: string): boolean;
    defaultMessage(): string;
}
