"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsCep = void 0;
const class_validator_1 = require("class-validator");
let IsCep = class IsCep {
    validate(text) {
        const cepRegex = /^[0-9]{5}-?[0-9]{3}$/;
        return cepRegex.test(text);
    }
    defaultMessage() {
        return 'O CEP deve estar no formato 99999-999 ou 99999999.';
    }
};
exports.IsCep = IsCep;
exports.IsCep = IsCep = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsCep', async: false })
], IsCep);
//# sourceMappingURL=is-cep.validator.js.map