// centralized error object that derives from Node’s Error

import { HttpStatus } from '@nestjs/common';
import { AppError } from './AppError';

export class NetworkError extends AppError {
  public readonly name: string;
  public readonly httpCode: HttpStatus;
  public readonly isOperational: boolean; // if app can progress then its set to true otherwise false

  constructor(
    name: string,
    httpCode: HttpStatus,
    description: string,
    isOperational: boolean,
  ) {
    super(name, description, isOperational);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}
