export enum ErrCode {
  PASS = 0,
  LESS_MIN_HAND = 1,
  OVER_MAX_HAND = 2,
  OVER_SINGLE_NUM = 3,
  OVER_UNION_NUM = 4,
  NUM_STOPED = 5,
  NO_CREDIT = 6,
  NO_LOGIN = 7,
  DELETE_TERM_ERR = 8,
  NOT_DEFINED_ERR = 9,
  MISS_PARAMETER = 10,
  NOT_ENOUGH_NUM = 11,
  GET_CONNECTION_ERR = 12,
  DB_QUERY_ERROR = 13,
  TRY_CATCH_ERROR = 14,
  NO_DATA_FOUND = 15,
  OVER_ONE_HAND = 16,
  OVER_FULL_STORAGE = 17,
  IN_SHORT_TERM = 18,
  HAS_ASK_IN_PROCESS = 19,
  EMERGENCY_STOPED = 20,
  APISERVER_GONE_AWAY = 21,
  NO_SAME_NUMBER = 22,
  UNEXPECT_NUMBER = 23,
  DEAL_IS_CLOSED = 24,
}

export enum FuncKey {
	SET_CHANNEL = 'SetChannel',
	CLIENT_INFO = 'ClientInfo',
  MESSAGE = 'Message',
  ENTER_ROOM = 'enterRoom',
  EXIT_ROOM = 'exitRoom',
  GET_MESSAGE = 'getMessages',
  NEW_ROOM = 'newRoom',
  CLOSE_CONVERSATION = 'closeConversation',
  CONNECTION_CHECK = 'connectionCheck', // for Browser
}

export enum CreditType {
	DEPOSIT = 0,
	WITHDRAW,
	CRYPTOCUR,
}

export enum MemoType {
	NEW = 0,
	SETTLE,
	DELETE,
}

export enum StopType {
  OPEN = 0,
  LONG_STOP = 1,
  SHORT_STOP = 2,
  STOPED = 3
}

export enum MsgType {
  ACCEPT_ASK = 0,
  ACCEPT_OTHER = 1
}

export enum Channels {
  ASK = 'Ask',
  API_SERVER = 'AskCreator',
  SETTLE_SERVER = 'SettleServer',
  ADMIN = 'Admin',
  PUB = 'Public',
  MEMBER = 'Member',
  SERVICE = 'CustomerService',
}

export enum OpTypes {
  NONE = '',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}
export enum RefGameType {
  MarkSix = 'MarkSix',
  D3 = '3D',
  Always = 'Always',
  Happy = 'Happy',
  Cars = 'Cars',
  Happy8 = 'Happy8',
  Speed3 = 'Speed3',
  BTCHash = 'BTCHash',
  HashSix = 'HashSix',
  SGPools = 'SGPools',
  VNNorth = 'VNNorth',
  KENO = 'KENO',
}
