/**
 * Adapter para mapear campos do banco (novo schema) para o código (schema antigo)
 */

export const mapUserFromDb = (user: any) => {
  if (!user) return null;
  
  return {
    ...user,
    // Mapear campos novos para antigos (compatibilidade)
    nome: user.name,
    cpfCnpj: user.cpf,
    phoneNumber: user.phoneNo,
    tipo: mapUserTypeToTipoUsuario(user.type),
    // Campos que não existem mais no banco mas podem ser esperados
    fotoUrl: null,
    outlookId: null,
    status: 'ATIVO' as const,
    city: user.Address?.complement || '',
    state: '',
    street: user.Address?.street || '',
    number: user.Address?.number ? parseInt(user.Address.number) : null,
    complement: user.Address?.complement || null,
    cep: user.Address?.cep || '',
  };
};

export const mapUserToDb = (userData: any) => {
  return {
    name: userData.nome || userData.name,
    cpf: userData.cpfCnpj || userData.cpf,
    phoneNo: userData.phoneNumber || userData.phoneNo,
    email: userData.email,
    password: userData.password,
    type: mapTipoUsuarioToUserType(userData.tipo || userData.type),
    Address: userData.Address || {
      create: {
        cep: userData.cep || '',
        street: userData.street || '',
        number: userData.number?.toString() || '',
        complement: userData.complement || null,
      }
    }
  };
};

export const mapUserTypeToTipoUsuario = (type: string) => {
  const mapping: Record<string, string> = {
    'CLIENT': 'CLIENTE',
    'TECHNICIAN': 'TECNICO',
    'ADMINISTRATOR': 'ADMIN',
  };
  return mapping[type] || type;
};

export const mapTipoUsuarioToUserType = (tipo: string) => {
  const mapping: Record<string, string> = {
    'CLIENTE': 'CLIENT',
    'TECNICO': 'TECHNICIAN',
    'ADMIN': 'ADMINISTRATOR',
  };
  return mapping[tipo] || tipo;
};
