// @ts-nocheck
export interface ProtocolData<Data = any, MsgType = string> {
  id: string;
  type: MsgType;
  data?: Data;
}
export type ProtocolResponseFn = (params: any) => Promise<any> | any;