import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        // MVP: Check for a header "x-user-email" and mock login
        // Real App: JWT verification via Supabase/Auth0
        const userEmail = request.headers['x-user-email'];
        if (!userEmail) {
            // Allow public for dev/test if needed, or throw
            // For now, let's default to the seed user if missing/dev mode
            request.user = { email: 'admin@demo.com', id: 'mock-user-id' };
            return true;
        }

        // In a real scenario, we'd look up the user in DB here
        request.user = { email: userEmail };
        return true;
    }
}
