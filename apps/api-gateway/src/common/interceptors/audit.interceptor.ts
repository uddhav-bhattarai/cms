import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';

export const SKIP_AUDIT_KEY = 'skipAudit';
export const SkipAudit = () => Reflect.setMetadata(SKIP_AUDIT_KEY, true);

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skipAudit = this.reflector.get<boolean>(
      SKIP_AUDIT_KEY,
      context.getHandler(),
    );

    if (skipAudit) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    const url = request.url;
    const timestamp = new Date().toISOString();

    return next.handle().pipe(
      tap((response) => {
        // In production, this would send to an audit log service
        console.log('[AUDIT LOG]', {
          timestamp,
          userId: user?.id || 'anonymous',
          email: user?.email || 'anonymous',
          method,
          url,
          statusCode: response?.statusCode || 200,
        });
      }),
    );
  }
}
