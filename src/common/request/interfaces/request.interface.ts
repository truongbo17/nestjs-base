import { Request } from 'express';
import { ResponsePagingMetadataPaginationRequestDto } from '../../response/dtos/response.dto';
import { AuthJwtAccessPayloadDto } from '../../../core/auth/dtos/jwt/auth.jwt.access-payload.dto';

export interface IRequestApp<T = AuthJwtAccessPayloadDto> extends Request {
  user?: T;
  workspace?: string;

  __language: string;
  __version: string;

  __pagination?: ResponsePagingMetadataPaginationRequestDto;
}
