import { ValidationExceptionFilter } from './validation-exception.filter';
import { ValidationException } from './validation.exception';
import { ValidationError } from '@nestjs/common';

const mockContext: any = {
  switchToHttp: () => ({
    getRequest: () => ({
      url: 'mock-url',
    }),
    getResponse: () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      return response;
    },
  }),
};

describe('ValidationExceptionFilter', () => {
  let filter: ValidationExceptionFilter;

  beforeEach(() => {
    filter = new ValidationExceptionFilter();
  });

  it('should catch ValidationException', () => {
    const errorMessages: ValidationError[] = [];
    const mockException: ValidationException = new ValidationException(errorMessages);

    const response = mockContext
      .switchToHttp()
      .getResponse()
      .status();
    filter.catch(mockException, mockContext);

    const spy1 = jest.spyOn(response, 'json');

    expect(spy1).toBeCalledTimes(1);
    expect(spy1).toBeCalledWith({
      statusCode: mockException.getStatus(),
      timeStamp: new Date().toISOString(),
      path: mockContext.getRequest().url,
      message: mockException.message,
      error: mockException.getValidationErrors(),
    });
  });
});
