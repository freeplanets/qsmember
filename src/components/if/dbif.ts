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