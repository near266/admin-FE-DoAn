import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';

export interface IServerResponse {
  code: SV_RES_STATUS_CODE;
  payload: any;
}
