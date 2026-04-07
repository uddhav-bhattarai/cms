import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';

export const SKIP_AUDIT_KEY = 'skipAudit';

export const SkipAudit = () => require('@nestjs/common').SetMetadata(SKIP_AUDIT_KEY, true);

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skipAudit = this.reflector.getAllAndOverride<boolean>(SKIP_AUDIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAudit) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    const url = request.url;

    const now = Date.now();

    return next.handle().pipe(
      tap((data) => {
        // Log audit event asynchronously (in production, send to message queue or dedicated audit service)
        const auditLog = {
          userId: user?.sub || 'anonymous',
          userEmail: user?.email || 'anonymous',
          action: `${method} ${url}`,
          resource: this.extractResource(url),
          resourceId: this.extractResourceId(url),
          timestamp: new Date(),
          ipAddress: this.extractIpAddress(request),
          statusCode: context.switchToHttp().getResponse().statusCode,
        };

        // In production, this would be sent to a dedicated audit logging service
        console.log('[AUDIT LOG]', JSON.stringify(auditLog));
      }),
    );
  }

  private extractResource(url: string): string {
    const parts = url.split('/').filter(Boolean);
    // Assuming URL pattern: /api/v1/resource/id
    const resourceIndex = parts.findIndex((p) => !p.match(/^[0-9a-f]{24}$/i));
    return parts[resourceIndex] || 'unknown';
  }

  private extractResourceId(url: string): string | undefined {
    const parts = url.split('/').filter(Boolean);
    const idPart = parts.find((p) => p.match(/^[0-9a-f]{24}$/i));
    return idPart;
  }

  private extractIpAddress(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.headers['x-real-ip'] ||
      request.ip ||
      'unknown'
    );
  }
}
