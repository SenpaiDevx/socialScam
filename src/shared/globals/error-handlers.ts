import HTTP_STATUS from 'http-status-codes';

export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  serializeErrors(): IError; // serialize function as extend function of javascript error handling function
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}

export abstract class CustomError extends Error {
  // Error is nodejs built in error class meaning it can be thrown and caught like any other error in nodejs .
  abstract statusCode: number;
  abstract status: string;
  constructor(message: string) {
    //  and also used all the error methods of error class like error.message, error.stack etc
    super(message); // this called the parent
  }

  serializeErrors(): IError {
    return {
      status: this.status, // from the extend Error form node.js
      statusCode: this.statusCode, // from the extend Error form node.js
      message: this.message // this from us er or nodejs error value
    };
  }
}
export class JointRequestValidationError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST; // this how
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class BardRequestError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST; // this how
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  statusCode = HTTP_STATUS.NOT_FOUND; // this how
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = HTTP_STATUS.UNAUTHORIZED; // this how
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class FileTooLargeError extends CustomError {
  statusCode = HTTP_STATUS.REQUEST_TOO_LONG; // this how
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE; // this how
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

// const errprRep = (errors : IErrorResponse) => {
//     return errors
// }
// errprRep({
//     message : 'Error message',
//     statusCode : 200,
//     status : 'Internal Server Error',
//     serializeErrors : () => {
//         return {
//             message : 'Error message',
//             statusCode : 200,
//             status : 'Internal Server Error',
//         }
//     }
// })
