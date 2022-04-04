import { HttpStatus } from '@nestjs/common';
import { NetworkError } from './NetworkError';

export class RateLimitError extends NetworkError {
  public readonly name: string;
  public readonly httpCode: HttpStatus;
  public readonly retryAfter: number;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: HttpStatus,
    description: string,
    isOperational: boolean,
    retryAfter: number,
  ) {
    super(name, httpCode, description, isOperational);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.name = name;
    this.httpCode = httpCode;
    this.retryAfter = retryAfter;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}
