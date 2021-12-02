// @ts-nocheck
export interface ProtocolData<Data = any, MsgType = string> {
  id: string;
  type: MsgType;
  data?: Data;
}
export declare interface CustomProtocolEvents {}