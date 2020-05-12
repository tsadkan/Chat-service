import { BadRequestException, ValidationError } from '@nestjs/common';
import { HttpExceptions } from './http-exceptions.enum';

export class ValidationException extends BadRequestException {
  constructor(private validationErrors: ValidationError[]) {
    super(HttpExceptions.VALIDATION_ERROR);
  }

  getValidationErrors(): string[] {
    const messages = this.validationErrors.map(
      error => `${error.property} has wrong value ${error.value},
            ${Object.values(error.constraints).join(', ')}`,
    );

    return messages;
  }
}
