import { ValidationException } from './validation.exception';

describe('ValidationException', () => {
  it('should throw ValidationException', () => {
    const errorMessages = [];
    const exception = () => {
      throw new ValidationException(errorMessages);
    };

    expect(exception).toThrow(ValidationException);
  });
});
