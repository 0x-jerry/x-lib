export interface ProtocolData<Data = any, MsgType = string> {
  id: string
  type: MsgType
  data?: Data
}

export type ProtocolResponseFn = (data: any) => Promise<any> | any
