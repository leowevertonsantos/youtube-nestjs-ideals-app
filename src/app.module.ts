import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdeaModule } from './idea/idea.module';
import { HttpErrorFilter } from './shared/filters/http-error.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { ValidationPipe } from './shared/pipes/validations/validation.pipe';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { Context, GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    IdeaModule,
    UserModule,
    CommentModule,
    GraphQLModule.forRoot(
      {
        typePaths: ['./**/*.graphql'],
        context: (context) =>{
          // console.log(context);
        }
      }
    ),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ValidationPipe,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
