import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../users/user.constants';
import * as UserExceptions from '../../users/users.exceptions';

@Injectable()
export class ManagerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw UserExceptions.UserNotFoundException();
        }

        if (user.role !== UserRole.MANAGER) {
            throw UserExceptions.UserNotManagerException();
        }

        return true;
    }
} 