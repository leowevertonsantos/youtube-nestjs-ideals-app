import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    if (request) {
      return this.handleRestRequest(request, context, next);
    } else {
      return this.handleGraphqlRequest(context, next);
    }
  }

  private handleRestRequest(
    request: Request,
    context: ExecutionContext,
    next: CallHandler<any>,
  ) {
    const method: string = request.method;
    const url: string = request.url;
    const now: number = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          Logger.log(
            `${method} ${url} ${Date.now() - now}ms`,
            context.getClass().name,
          ),
        ),
      );
  }

  private handleGraphqlRequest(
    context: ExecutionContext,
    next: CallHandler<any>,
  ) {

    const graphqlContext: GqlExecutionContext = GqlExecutionContext.create(context);
    const resolverName = graphqlContext.getClass();
    const now: number = Date.now();
    const info = graphqlContext.getInfo();
    
    return  next
      .handle()
      .pipe(
        tap(() =>
          Logger.log(
            `${info.parentType} ${info.fieldName} ${Date.now() - now}ms`,
            resolverName.name,
          ),
        ),
      );
  }
}
