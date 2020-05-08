import { BasePayRate } from "../class/BasePayRate"

export interface SelectOptions {
    value:number;
	label?:string;
    GType?:string;
}
export interface Btg { 
	title: string;
	shortT?: string;
	subtitle?: string[];
}
export interface ItmBtg {
	id:string;
	title:string;
    chk:boolean;
    ungrouped:boolean;
}
export interface IbtCls {
	id:string;
	BCName:string;
	BetTypes:string;
}
export interface BasePayRateItm {
    Title:string;
    SubTitle?:string;
    BetType?:number;
    SubType?:number;
    NoAdjust?:number;
    Profit?:number;
    DfRate?:number;
    TopRate?:number;
    Probability?:number;
	Steps?:number;
	//TopPay?:number;
    //OneHand?:number;
    TotalNums?:number;
    UseAvg?:number;
    SingleNum?:number;
    UnionNum?:number;
    MinHand?:number;
    MaxHand?:number;
    BetForChange?:number;
    StepsGroup?:string;    
}
export interface StepG {
    Start:number;
    Step:number;
}
export interface PayRateItm extends BasePayRateItm {
	Rate?:number;
	LowestBet?:number;
	SingleBet?:number;
}
export interface BetItem {
	BetType:string;
	Num:string;
}
export interface CBetItems {
	GameID:number;
	ModifyID:number;
	data:string;
}
export interface IMsg {
    ErrNo?: number;
    data?: object[]|object;
    debug?: string;
    ErrCon?:string;
    [key: string]: any;
}
export interface CMain<T> {
	Modify(v:T):void;
	Delete(id:number):void;
}
export interface ITableHeader {
    // unique id
    // identifies column
    // (used by pagination.sortBy, "body-cell-[name]" slot, ...)
    name:string;	// 'desc',

    // label for header
    label:string;	// 'Dessert (100g serving)',

    // row Object property to determine value for this column
    field:string;	// 'name';
    // OR field: row => row.some.nested.prop

    // (optional) if we use visible-columns, this col will always be visible
    required?:boolean;	// true,

    // (optional) alignment
    align?:string;	// 'left',

    // (optional) tell QTable you want this column sortable
    sortable?:boolean;	// true,

    // (optional) compare function if you have
    // some custom data or want a specific way to compare two rows
    sort?:Function;	// (a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10),
    // function return value:
    //   * is less than 0 then sort a to an index lower than b, i.e. a comes first
    //   * is 0 then leave a and b unchanged with respect to each other, but sorted with respect to all different elements
    //   * is greater than 0 then sort b to an index lower than a, i.e. b comes first

    // (optional) you can format the data with a function
    format?:Function;	// (val, row) => `${val}%`
    // one more format example:
    // format: val => val
    //   ? /* Unicode checkmark checked */ "\u2611"
    //   : /* Unicode checkmark unchecked */ "\u2610",

    // body td:
    style?:string; //'width: 500px',
    classes?:string;	// 'my-special-class'

    // (v1.3.0+) header th:
    headerStyle?: string;	//'width: 500px',
    headerClasses?:string; // 'my-special-class'
  }
export interface Odds {
    Num:number,
    Odds:number,
    Risk:number,
}
export interface CommonParams {
    id?:number;
    tid?:number;
    GameID?:number|string;
    BT?:number;
    Num?:number;
    Step?:number;
    UserID?:number;
    MaxOddsID?:number;
    BetTypes?:string;
    isStop?:number;
    PageName?:string;
    Comments?:string;
    BCName?:string;
    findString?:string;
    userType?:number;
    ModifyID?:number;
    data?:any;
    PayClassName?:string;
    NameOrNick?:string;
    SDate?:string;
    UpId?:number;
    [key:string]:number|string|undefined;
}

export interface PayClass {
    id:number;
    PayClassName:string;
}

//單頭
export interface BetHeader {
    id: number;
    UserID: number;
    tid: number;
    GameID: number;
    BetContent: string;
    Fee?: number;
    Total: number;
    Payout?: number;
    WinLose?: number;
    ExRate?: number;
    CancelLimit?: number;
    CreateTime?: string;
    GameName?:string;
    UserName?:string;
    TermID?:string;
}

export interface INumData {
    Num: number;
    OddsID: number;
    Odds?: string | number;
    Amt: number;
    BetType?: number;
}
export interface IBetContent {
    BetType?: number;
    Content?: INumData[];
    isPaylay?: boolean;
    Sets?: number;
}