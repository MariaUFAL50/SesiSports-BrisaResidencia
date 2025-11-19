"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsCpfCnpj = void 0;
const class_validator_1 = require("class-validator");
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
let IsCpfCnpj = class IsCpfCnpj {
    validate(text) {
        if (!text || typeof text !== 'string') {
            return false;
        }
        const cleanedText = text.replace(/[^\d]/g, '');
        if (cpf_cnpj_validator_1.cpf.isValid(cleanedText)) {
            return true;
        }
        if (cpf_cnpj_validator_1.cnpj.isValid(cleanedText)) {
            return true;
        }
        return false;
    }
    defaultMessage() {
        return 'O CPF/CNPJ informado é inválido.';
    }
};
exports.IsCpfCnpj = IsCpfCnpj;
exports.IsCpfCnpj = IsCpfCnpj = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsCpfCnpj', async: false })
], IsCpfCnpj);
//# sourceMappingURL=is-cpf-cnpj.validator.js.map