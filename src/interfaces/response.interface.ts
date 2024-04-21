import { HttpStatus } from 'aws-sdk/clients/lambda';

export interface IResponse {
  success : boolean;
  statusCode : HttpStatus
  message? : String;
}