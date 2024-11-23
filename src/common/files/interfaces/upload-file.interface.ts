import { ENUM_STORAGE } from '../enums/file.enum';

export interface UploadFileInterface {
  path: string;
  url: string;
  storage: ENUM_STORAGE;
  bucket?: string;
}
