import { LeverData } from '../../../layouts/data/if';

export default class Lever {
  static fields:string[] = ['Multiples', 'LongT', 'ShortT'];
  private ischanged = false;
  private data:LeverData;
  constructor(Data:LeverData) {
    this.data = Data;
  }
  get id():number {
    return this.data.id;
  }
  get Multiples():number {
    return this.data.Multiples;
  }
  set Multiples(v:number) {
    this.data.Multiples = v;
    this.ischanged = true;
  }
  get LongT():number {
    return this.data.LongT;
  }
  set LongT(v:number) {
    this.data.LongT = v;
    this.ischanged = true;
  }
  get ShortT():number {
    return this.data.ShortT;
  }
  set ShortT(v:number) {
    this.data.ShortT = v;
    this.ischanged = true;
  }
  set ModifyID(v:number) {
    this.data.ModifyID = v;
  }
  get isChanged() {
    return this.ischanged;
  }
  get Data():LeverData {
    return this.data;
  }
  MultiUpdate(v:LeverData) {
    this.data = v;
    this.ischanged = false;
  }
}
