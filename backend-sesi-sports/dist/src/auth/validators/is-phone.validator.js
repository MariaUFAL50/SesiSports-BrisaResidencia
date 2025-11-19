"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPhone = void 0;
const class_validator_1 = require("class-validator");
let IsPhone = class IsPhone {
    validate(text) {
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
};
exports.IsPhone = IsPhone;
exports.IsPhone = IsPhone = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsPhone', async: false })
], IsPhone);
//# sourceMappingURL=is-phone.validator.js.map