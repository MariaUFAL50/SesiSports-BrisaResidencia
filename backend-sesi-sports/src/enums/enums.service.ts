import { Injectable } from '@nestjs/common';

@Injectable()
export class EnumsService {
  getUserTypes() {
    return {
      types: [
        { value: 'ADMIN', label: 'Administrador' },
        { value: 'TECNICO', label: 'Técnico' },
        { value: 'CLIENTE', label: 'Cliente' },
      ],
    };
  }

  getUserStatus() {
    return {
      status: [
        { value: 'ATIVO', label: 'Ativo' },
        { value: 'INATIVO', label: 'Inativo' },
      ],
    };
  }
}