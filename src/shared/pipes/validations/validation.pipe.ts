import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value instanceof Object && this.isEmpty(value)) {
      throw new HttpException(
        'Validation Failed. No Body submmited',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!metadata.metatype || !this.toValidate(metadata.metatype)) return value;

    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);
    
    if (errors.length > 0) {
      throw new HttpException(
        `Validation Failed: ${this.formatErrors(errors)}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }

  private toValidate(metaType: any) {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metaType);
  }

  private formatErrors(errors: any[]) {
    return errors
      .map((error) => {
        for (const property in error.constraints) {
          return error.constraints[property];
        }
      })
      .join(', ');
  }

  private isEmpty(value: Object): boolean {
    if (Object.keys(value).length > 0) {
      return false;
    }
    return true;
  }
}
