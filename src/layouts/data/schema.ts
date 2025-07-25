import { HasID } from './if';

export interface User extends HasID {
    TableName:'User';
    SiteName?:string;
    Account?: string;
    Password?: string;
    Nickname?: string;
    Types?: number;
    TypeName?: string;
    Levels?: number;
    DfKey?: string;
    UpId?: number;
    PayClassID?: number;
    PayClass?:string;
    forcePWChange?:number;
    Programs?:string;
    CreateTime?: string;
    ModifyTime?: string;
    ModifyID?:number;
}

export interface PayRate extends HasID {
    BetType: number;
    SubRate: number; // 次賠率 例  三中二 另有三中三的賠率
    Profit: number; // 利潤
    DfRate: number; // 預設賠率
    DfRateDiff: number; // 預設利差
    TopRate: number; // 賠率上限
    TopDiff: number; // 最高差額
    BetChangeAmt: number; // 押碼金額
    BetChangeRate: number; // 押碼間隔
    LowestBet: number; // 最小下注
    TopPay: number; // 最高派彩
    SingleBet: number; // 公司單注
    ChangeID: number; // 修改人員
    ChangeTime: Date; // 修改時間
}

export interface Games extends HasID {
    // id:number;              //遊戲代號
    name:string; // 遊戲名稱
    ModifyID?:number;
    GType?:string;
}

export interface Terms extends HasID {
    // id:number;
    GameID:number;
    TermID:string;
    TCenterID?:string;
    PDate:string;
    PTime:string;
    StopTime:string;
    StopTimeS:string;
    Result?:string;
    ResultFmt?:string;
    SpNo?:string;
    isSettled?:number;
    isCanceled?: number;
    ModifyID:number;
    UserName?:string;
}

export interface Game extends HasID {
    // id:number;
    name:string;
    OfficeSite:string;
    StopBeforeEnd:number;
    BothSideAdjust:number;
    AutoOpen:number;
    PDiffTwoSide:number;
    PDiffColorWave:number;
    DelAfterBet:number;
    DelBeforeEnd:number;
    /*
    LowestBet:number;
    TopPay:number;
    */
    UseAvgOdds:number;
    GType:string;
    hasSPNO:number;
    OpenNums:number;
}
