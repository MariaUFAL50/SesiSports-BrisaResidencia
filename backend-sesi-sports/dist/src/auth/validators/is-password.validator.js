"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPassword = void 0;
const class_validator_1 = require("class-validator");
let IsPassword = class IsPassword {
    validate(password) {
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
};
exports.IsPassword = IsPassword;
exports.IsPassword = IsPassword = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsPassword', async: false })
], IsPassword);
//# sourceMappingURL=is-password.validator.js.map