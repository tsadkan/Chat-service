import { BadRequestException } from "@nestjs/common";

export class ValidationException extends BadRequestException {
    constructor(private validationErrors:string[]) {
            super() 
    }

    getValidationErrors(): string[]{ return this.validationErrors;}
}