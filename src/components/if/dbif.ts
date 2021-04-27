import {HasID,KeyVal} from '../../layouts/data/if';
export interface TableData {
  TableName: string;
  keys?: string[];
  fields?: KeyVal[];
}
export interface DataObject {
  [key:string]:number|string|boolean;
}
export interface TableItems extends HasID {
  Title?:string;
  Code?:string;
  OpenFee?:number;
  CloseFee?:number;
  LoanFee?:number;
  BattleFee?:number;
  BattleLoanFee?:number;
  ModifyUID?:number;
}