import { AnyObject } from '../../data/if';
import { BaNum } from '../func';
// import {OSteps} from '../data/if';
import { numBlock } from './layouts';
import CBetType from './CBetType';

export interface Odds {
    pos?:number;
    OID:number;
    Odds:number;
    SubType:number;
    MaxOdds:number;
    isStop:number;
    tolW:number;
    tolS:number;
    tolP:number;
    Risk?:number;
    BT?:number;
    Num?:number;
    Steps:number;
    PerStep:number;
}
interface NTemp extends numBlock {
    TolS:number;
}
export interface Num {
    [num:string]:Odds;
}
export interface Data {
    [BT:string]:Num;
}
export interface NumSortData {
    num:number;
    tolS:number;
    Risk:number;
}
export interface SortFunc {
    (A:NumSortData, B:NumSortData):number;
}
export interface BetType {
    Total:number;
    Payouts:number;
    MaxWin:number;
    member:Num;
    // SortTable:boolean;
    // Pos:NumSortData[];
    // member:Odds[];
    // SortID:number;
    initData(num:Num):void;
    Add(num:Num):void;
    setSortTable(b:boolean):void;
    Sort(sortid:number):void;
    getPos(pos:number):NumSortData;
}

interface BetTypes {
    [BT:string]:BetType;
}

export interface RiskGroup {
    member:number[];
    TotalNum?:number;
    OpenNum?:number;
    func?:string;
}
interface RGS {
    [key:string]:RiskGroup[];
}

export enum RickF {
    OpenOne = 'calBigestRiskOne',
    OpenMulti = 'calBigestRiskMT',
}

/*
function execFunctionByName(g:AnyObject, funcName:string, arg1:number|string, arg2?:number) {
    const func = g[funcName];
    if (typeof arg2 === 'undefined') {
        // func.apply(null, [arg1]);
        func(arg1);
    } else {
        // func.apply(null, [arg1, arg2]);
        func(arg1, arg2);
    }
}
*/
// const FOUR_DIGITAL = 'Game.BTCHash.Menu.Group.5.title';
// const FIVE_DIGITAL = 'Game.BTCHash.Menu.Group.6.title';
export class CGame implements AnyObject {
    private member: BetTypes;
    private OID = 0;
    private total = 0;
    public isUpdated = true;
    public GType = '';
    private RiskGroup:RGS=
        {
            MarkSix: [
                {
                    member: [4],
                    TotalNum: 49,
                    OpenNum: 6,
                    func: RickF.OpenMulti,
                },
                {
                    member: [12, 13, 14, 27],
                    func: RickF.OpenOne,
                },
                {
                    member: [
                    1, 28, 2, 3, 74, 5, 6, 72, 9,
                    73, 71, 16, 17, 18, 19, 20, 21, 22,
                    23, 24, 25, 26, 29, 75, 76, 77, 78, 30],
                    func: RickF.OpenOne,
                },
                {
                    member: [
                    8, 7, 10, 11, 15, 31, 32, 33, 34, 35,
                    36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
                    46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
                    56, 57, 58, 59, 60, 61, 62, 63, 64, 65,
                    66, 67, 68, 69, 70, 71, 72, 73],
            }],
            '3D': [
                {
                    member: [
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                        11, 12, 13, 14, 15, 16, 17,
                        34, 35, 36, 37, 38, 39, 40,
                        41, 42, 43, 44, 45, 46, 47,
                        48, 49, 50, 51, 52, 53, 54,
                        55, 56, 57, 58, 59, 60, 61,
                        62, 63, 64, 65],
                    func: 'calBigestRiskOne',
                },
            ],
            Happy: [

            ],
            Cars: [

            ],
            Always: [
                
            ],
            Speed3: [

            ],
            Happy8: [
                
            ],
            BTCHash: [
                
            ],
            HashSix: [

            ],
            SGPools: [

            ],
        }
    constructor() {
        this.member = {};
    }
    get MaxOddsID() {
        return this.OID;
    }
    setOddsID(oid:number) {
        this.OID = oid;
    }
    get Total() {
        return this.total;
    }
    ModifyTotal(diff:number) {
        this.total += diff;
    }
    /*
    getTotal() {
        this.total = 0;
        Object.keys(this.member).map((bt) => {
            this.total += this.member[bt].Total;
        });
        return this.total;
    }
    */
    getBtTotal(bts:number | number[]) {
        let total = 0;
        if (Array.isArray(bts)) {
            bts.map((bt) => {
                if (bt > 0) total += this.member[`${bt}`].Total;
            });
        } else if (bts > 0) {
            total = this.member[`${bts}`].Total;
        }
        return Math.round(total);
    }
    inidata(dta:Data) {
        // if (OM) console.log('OM', OM);
        this.total = 0;
        this.member = {};
        Object.keys(dta).map((bt) => {
            const BTItm:Num = dta[bt];
            /*
            let chk45 = false;
            // let chkString='';
            const TNT:NTemp[] = [];
            if (this.GType === 'BTCHash') {
                if (bt === '41') {
                    chk45 = true;
                    // chkString=FOUR_DIGITAL;
                } else if (bt === '42') {
                    chk45 = true;
                    // chkString=FIVE_DIGITAL;
                }
            }
            */
            this.member[bt] = new CBetType(bt, this, this.RiskGroup[this.GType]);
            this.member[bt].initData(BTItm);
            // const tmp:object[] = [];

            // if (TNT.length > 0) {
                // this.ExtendLayoutsBlock(TNT,chkString,OM);
            // }
            /*
            if(tmp.length>0){
                console.log('OB',JSON.stringify(tmp));
            }
            */
        });
    }
    updateData(dta:Data) {
        // if (OM) console.log('OM', OM);
        Object.keys(dta).map((bt) => {
            const BTItm:Num = dta[bt];
            // let chk45 = false;
            // let chkString='';
            // const TNT:NTemp[] = [];
            /*
            if (this.GType === 'BTCHash') {
                if (bt === '41') {
                    chk45 = true;
                    // chkString=FOUR_DIGITAL;
                } else if (bt === '42') {
                    chk45 = true;
                    // chkString=FIVE_DIGITAL;
                }
            }
            */
            this.member[bt].Add(BTItm);
            // if (TNT.length > 0) {
                // this.ExtendLayoutsBlock(TNT,chkString,OM);
            // }
            this.isUpdated = true;
        });
    }
    getNTemp(BTItm:Num, bt:string, num:string):NTemp {
        return {
            Pos: 0,
            Num: parseInt(num, 10),
            BT: parseInt(bt, 10),
            TolS: BTItm[num].tolS,
        };
    }
    ExtendLayoutsBlock(TNT:NTemp[], chkString:string, OM:any) {
        // TNT.sort(sortTolS);
        const f = OM.dfLayout.find((itm:any) => itm.name === chkString);
        if (f) {
            const olddata:numBlock[] = [];
            f.cont[0].item.map((line:any) => {
                line.map((blk:any) => {
                    olddata.push(blk);
                });
            });
            const len = TNT.length < 100 ? TNT.length : 100;
            for (let i = 0; i < len; i++) {
                const fItm = olddata.find((itm) => itm.BT === TNT[i].BT && itm.Num === TNT[i].Num);
                if (!fItm) {
                    const block:numBlock = {
                        Pos: 0,
                        BT: TNT[i].BT,
                        Num: TNT[i].Num,
                    };
                    olddata.push(block);
                }
                // console.log('block',block);
            }
            f.cont[0].item = [];
            let tmp:numBlock[] = [];
            olddata.map((blk, idx) => {
                tmp.push(blk);
                if (idx % 10 === 9) {
                    f.cont[0].item.push(tmp);
                    tmp = [];
                }
            });
            if (tmp.length > 0) f.cont[0].item.push(tmp);
            // console.log('ExtendLayoutsBlock',f);
        }
        console.log('ExtendLayoutsBlock', OM.dfLayout);
    }
    getOdds(blk:numBlock, BT?:number, extOdds?:number) {
        if (!BT) BT = blk.BT;
        if (blk.PosFix || extOdds === 1) {
            const num = blk.Num;
            const Odds = this.getOddsByNum(BT, num, extOdds);
            return Odds;
            // return this.getOddsByNum(BT,num,extOdds);
        }
            if (typeof extOdds !== 'undefined') return null;
            if (blk.Pos !== undefined) {
                const sBT:string = BT.toString();
                const nsd:NumSortData = this.member[sBT].getPos(blk.Pos);
                console.log('Games.ts getOdds nsd', nsd);
                const tmp:Odds = this.member[sBT].member[nsd.num];
                // const ba = BaNum(tmp.PerStep ? tmp.PerStep : 1);
                if (tmp.PerStep > 0) {
                    const ba = BaNum(tmp.PerStep);
                    tmp.Odds = Math.round(tmp.Odds * ba) / ba;
                }
                return tmp;
                /*
                let f;
                this.member[sBT].member.map(elm=>{
                    if(elm.pos===blk.Pos) f=elm;
                })
                if(f) return f;
                */
            }
        
        return {};
    }
    getOddsByNum(BT:number, num:number, extOdds?:number) {
        if (extOdds === 1) {
            num += 100;
        }
        const sBT:string = BT.toString();
        const sNum:string = num.toString();
        if (!this.member[sBT]) {
            // console.log(this.member[sBT]);
            return {};
        }
        if (!this.member[sBT].member[sNum]) {
            // console.log('no perstep:',sBT,sNum,this.member[sBT]);
            return {};
        }
        const tmp:Odds = this.member[sBT].member[sNum];
        // const ba = BaNum(tmp.PerStep ? tmp.PerStep : 1);
        if (tmp.PerStep > 0) {
            const ba = BaNum(tmp.PerStep);
            tmp.Odds = Math.round(tmp.Odds * ba) / ba;
        }
        tmp.BT = BT;
        tmp.Num = num;
        // if(Steps) tmp.Steps = Steps;
        return tmp;
    }
    setSortTableByBT=(bt:string|number, sorttype:boolean) => {
        const BT = String(bt);
        // console.log('setSortTableByBT:', BT, this.member[BT]);
        if (this.member[BT]) this.member[BT].setSortTable(sorttype);
    }
    setSortType=(sortid:number) => {
        Object.keys(this.member).map((BT) => {
            this.member[BT].Sort(sortid);
        });
    }
    get Items() {
        return this.member;
    }
}
