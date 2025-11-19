import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ProfileCompleteGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private allowedRoutesForIncompleteProfile = [
    '/auth/complete-outlook-profile',
    '/auth/logout',
    '/auth/outlook',
    '/auth/outlook/callback',
  ];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true;
    }

    if (user.outlookId && !user.cpfCnpj) {
      const route = request.route?.path || request.url;
      
      const isAllowedRoute = this.allowedRoutesForIncompleteProfile.some(allowedRoute => 
        route.includes(allowedRoute) || route === allowedRoute
      );

      if (!isAllowedRoute) {
        throw new BadRequestException({
          message: 'Complete seu perfil para acessar esta funcionalidade',
          error: 'PROFILE_INCOMPLETE',
          redirectTo: '/auth/complete-outlook-profile',
          statusCode: 400
        });
      }
    }

    return true;
  }
}