import {HasID,KeyVal} from '../../layouts/data/if';
export interface TableData {
  TableName: string;
  keys?: string[];
  fields?: KeyVal[];
}
export interface DataObject {
  [key:string]:number|string|boolean;
}
export interface Item extends HasID {
  Title?:string;
  Code?:string;
  OpenFee?:number;
  CloseFee?:number;
  LoanFee?:number;
  StopGain?:number;
  StopLose?:number;
  Type?:number;
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
  StopGain:number;     // 獲利平倉比
  StopLose:number;     // 損失平倉保証金比
  ProcStatus: number;  // 0 等待處理, 1 處理中, 2 成交, 3 取消
  CreateTime: number; // 建單時間
  DealTime?: number; // 成交時間
  ModifyTime?: number; // 修改時間
  SetID: number; // 平倉對象ID -> System下單
  USetID: number;  // 平倉對象ID -> User下單
}
interface AskReport {
  User: string;
  Item: string;
  AskType: string; // 0 市價, 1 限價
  BuyType: string; // 0 買單, 1 賣單
  Qty: number;
  Price: number; // 建倉價格
  Amount: number; // USDT金額
  Fee: number; // 手續費
  AskFee: number; // 手續費率
  AskPrice: number; // 下單價格
  LeverCredit: number; // 下單時暫扣的信用額度
  ExtCredit: number; // 下單後變動的信用額度,只能增加
  Lever:number;
}
