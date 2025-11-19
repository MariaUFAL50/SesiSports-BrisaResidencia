import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class ProfileCompleteGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    private allowedRoutesForIncompleteProfile;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
