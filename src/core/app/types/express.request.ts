import 'express';
import { IResponseMetadata } from '../../../common/response/interfaces/response.interface';

declare module 'express' {
  export interface Request {
    id?: string;
    _metadata?: IResponseMetadata;
    __language?: string;
    __version?: string;
  }
}
