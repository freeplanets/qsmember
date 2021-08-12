import { HasID, KeyVal } from '../../layouts/data/if';
import { FuncKey, MsgType, OpTypes } from './ENum';

export interface TableData {
  TableName: string;
  keys?: string[];
  fields?: KeyVal[];
}
export interface DataObject {
  [key:string]:number|string|boolean;
}
export interface CryptoItem extends HasID {
  Title?:string;
  Code?:string;
  OpenFee?:number;
  CloseFee?:number;
  StopGain?:number;
  StopLose?:number;
  // Type?:number; // =>
  isLoan:number; // 信用類型 0: No, 1: Yes
  PriceLimitPercentage?:number;
  isActive:number; // 啟用 1 Yes, 0 No
  OneHand?:number;
  DecimalPlaces?:number;
  PerStep?:number; // 跳動點（每次價格調整變量）
  Closed?:number; // 0 開放, 1 停多, 2 停空, 3 停收；
  IMG?:string;
  ModifyID?:number;
}

export interface AskTable {
  id: number;
  UserID: number;
  UpId: number;
  ItemID: number;
  ItemType: number; // 1買多商品, 2買空商品
  Code: string;
  AskType: number; // 0 市價, 1 限價
  BuyType: number; // 0 買單, 1 賣單
  Qty: number;
  Price: number; // 建倉價格
  Amount: number; // USDT金額
  Fee: number; // 手續費
  AskFee: number; // 手續費率
  AskPrice: number; // 下單價格
  LeverCredit: number; // 下單時暫扣的信用額度
  ExtCredit: number; // 下單後變動的信用額度,只能增加
  Lever:number;
  StopGain:number; // 獲利平倉比
  StopLose:number; // 損失平倉保証金比
  ProcStatus: number; // 0 等待處理, 1 處理中, 2 成交, 3 取消
  CreateTime: number; // 建單時間
  DealTime?: number; // 成交時間
  ModifyTime?: string; // 修改時間
  SetID: number; // 平倉對象ID -> System下單
  USetID: number; // 平倉對象ID -> User下單
}
export interface AskReport {
  User: string;
  Item: string;
  AskType: string; // 0 市價, 1 限價
  AT?: number;
  BuyType: string; // 0 買單, 1 賣單
  BT?: number;
  Qty: number;
  Price: number; // 建倉價格
  Amount: number; // USDT金額
  Fee: number; // 手續費
  AskFee: number; // 手續費率
  AskPrice: number; // 下單價格
  LeverCredit: number; // 下單時暫扣的信用額度
  ExtCredit: number; // 下單後變動的信用額度,只能增加
  Lever: number;
  CreateTime: number;
}
export interface ReceiveData {
  eventTime: number;
  symbol: string;
  currentClose: string;
  priceChangePercent:string;
  closeQuantity: string;
  open?:string;
}

export interface MqttData {
  eventType: string;
  eventTime: number;
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAveragePrice: string;
  previousClose: string;
  currentClose: string;
  closeQuantity: string;
  bestBid: string;
  bestBidQuantity: string;
  bestAskPrice: string;
  bestAskQuantity: string;
  open: string;
  high: string;
  low: string;
  baseAssetVolume: string;
  quoteAssetVolume: string;
  openTime: number;
  closeTime: number;
  firstTradeId: number;
  lastTradeId: number;
  trades: number;
}
export interface WsMsg {
  Func?: FuncKey;
  Asks?: AskTable |AskTable[];
  Ask?: AskTable;
  Balance?: number;
  Message?: string;
  ChannelName?: string;
  // LedgerTotal?: LedgerTotal[];
  UserID?: number;
  [key:string]: any;
}

export interface ObjectIdentify {
  [key:string]:boolean;
}

export interface PartialCryptoItems extends HasID {
	Closed?:number;
	OneHand?:number;
}
export interface GetMessage {
  Type: MsgType,
  getMessage(message:string | AskTable):void;
}
export interface ChatMsg {
  name:string; // for Chat Message 'name' 發話者名稱
  text:string[]; // 訊息 for Chat Message 'text'
  sent: boolean; // for Chat Message 'sent'
  stamp?:string; // 顯示訊息時間 例: '4 minutes ago' for Chat Message 'stemp'
  // bgColor?:string; // 訊息底色 for Chat Message 'bg-color'
  // txtColor?:string; // 訊息字顏色 for Chat Message 'text-color'
  avatar?:string; // 發話者圖片（或圖片網址）for Chat Message 'avatar'
  inMessage?:boolean; // 收訊方用，發話方是否正在輸入訊息 for Chat Message tag q-spinner-dots
  receiveTime:number|string;
  SenderID:number;
  UpID?:number;
  ReceiverID:number;
  MKey:string;
}
export interface ItemTypeTotal {
  Records:number;
  Amount:number;
  LeverAmount:number;
  AvgLever:number;
  GainLose:number;
  add(ll:LedgerLever):void;
}
export interface ItemTotal {
  Key:number;
  Title:string;
  Records:number;
  Amount:number;
  LeverAmount:number;
  AvgLever:number;
  Items:ItemTypeTotal[];
  Fee:number;
  GainLose:number;
  add(ll:LedgerLever, key:number):void;
  reCal():void;
  setTitle(t:HasID[]):void;
}
export interface LedgerLever {
  id:number;
  UserID: number;
  UpId: number;
  ItemID: number;
  ItemType: number;
  BuyID: number; // 買進時 AskTable id
  SellID?: number; // 賣出進時 AskTable id
  Qty: number;
  BuyPrice: number; // 建倉價格
  SellPrice: number;
  BuyFee:number;
  SellFee:number;
  Lever: number; // 槓桿
  GainLose: number; // 輸贏
  BuyTime?: number; // 買進時間
  SellTime: number; // 賣出時間
}

export interface CryptoOpParams extends HasID {
  ItemID: number; // 項目代號
  OpType: OpTypes; // 控盤類型 None, A, B, C, D
  isActive: number; // 是否啟用
  OneHand: number; // 單注上限
  FullStorage: number; // 滿倉
  LeverLimit: number; // 最大槓桿倍數
  ShortTerm1: number; // 短線1 不可平倉時間
  ShortTerm2: number; // 短線2 可平倉但加收手續費
  ShortTermFee: number; // 短線手續費則
  ModifyID: number; //
  [key:string]:any;
}
