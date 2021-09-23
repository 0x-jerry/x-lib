export interface ProtocolData<Data = any, MsgType = string> {
  id: string
  type: MsgType
  data?: Data
}

export interface ProtocolOptions {
  send(data: ProtocolData): Promise<any> | any
  init(receiveMsg: (data: ProtocolData) => void): Promise<any> | any
}

export type ProtocolResponseFn = (data: any) => Promise<any> | any
