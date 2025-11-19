/**
 * Utilitários de navegação baseados no tipo de usuário
 */

export const redirectBasedOnUserType = (userType, router) => {
  switch (userType) {
    case 'admin':
      router.push('/technician-profile'); // Admin vai para technician-profile
      break;
    case 'technician':
      router.push('/technician-profile');
      break;
    case 'client':
    default:
      router.push('/profile'); // Perfil do cliente
      break;
  }
};

/**
 * Obtém a rota baseada no tipo de usuário (sem navegar)
 */
export const getRouteForUserType = (userType) => {
  switch (userType) {
    case 'admin':
      return '/technician-profile'; // Admin vai para technician-profile
    case 'technician':
      return '/technician-profile';
    case 'client':
    default:
      return '/profile';
  }
};
