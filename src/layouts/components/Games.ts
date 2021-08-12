import { AnyObject } from '../data/if';
import { BaNum } from './func';
// import {OSteps} from '../data/if';
import { numBlock } from './layouts';

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
interface Num {
    [num:string]:Odds;
}
export interface Data {
    [BT:string]:Num;
}
interface NumSortData {
    num:number;
    tolS:number;
    Risk:number;
}
interface SortFunc {
    (A:NumSortData, B:NumSortData):number;
}
interface BetType {
    Total:number;
    Payouts:number;
    MaxWin?:number;
    member:Num;
    SortTable:boolean;
    Pos:NumSortData[];
    // member:Odds[];
    SortID:number;
}
const SortByNum:SortFunc = (a, b) => a.num - b.num;
const SortByTols:SortFunc = (a, b) => b.tolS - a.tolS;
const SortByRisk:SortFunc = (a, b) => a.Risk - b.Risk;
interface BetTypes {
    [BT:string]:BetType;
}

interface RiskGroup {
    member:number[];
    TotalNum?:number;
    OpenNum?:number;
    func?:string;
}
interface RGS {
    [key:string]:RiskGroup[];
}
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
// const FOUR_DIGITAL = 'Game.BTCHash.Menu.Group.5.title';
// const FIVE_DIGITAL = 'Game.BTCHash.Menu.Group.6.title';
export class CGame implements AnyObject {
    private member:BetTypes;
    private OID=0;
    public isUpdated=true;
    public GType='';
    private SortType:SortFunc[]=[SortByNum, SortByTols, SortByRisk];
    private RiskGroup:RGS=
        {
            MarkSix: [
                {
                    member: [4],
                    TotalNum: 49,
                    OpenNum: 6,
                    func: 'calBigestRiskMT',
                },
                {
                    member: [12, 13, 14, 27],
                    func: 'calBigestRiskOne',
                },
                {
                    member: [
                    1, 28, 2, 3, 74, 5, 6, 72, 9,
                    73, 71, 16, 17, 18, 19, 20, 21, 22,
                    23, 24, 25, 26, 29, 75, 76, 77, 78, 30],
                    func: 'calBigestRiskOne',
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
    inidata(dta:Data, OM?:any) {
        if (OM) console.log('OM', OM);
        this.member = {};
        Object.keys(dta).map((bt) => {
            const BTItm:Num = dta[bt];
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
            this.member[bt] = {
                Total: 0,
                Payouts: 0,
                // member:[],
                member: {},
                Pos: [],
                SortID: 0,
                SortTable: false,
            };
            // const tmp:object[] = [];
            Object.keys(BTItm).map((num:any, idx:any) => {
                if (chk45) {
                    // const nt:NTemp = this.getNTemp(BTItm,bt,num);
                    // TNT.push(nt);
                }
                // this.member.
                /*
                const f=Steps.find(itm=>itm.BetType===parseInt(bt,10) && itm.SubType===BTItm[num].SubType);
                if(f){
                    BTItm[num].Steps=f.Steps*f.PerStep;
                    BTItm[num].PerStep=f.PerStep;
                }
                */
               /*
                if(bt==='43'){
                    tmp.push({BT:parseInt(bt,10),Num:parseInt(num,10)})
                }
                */
                const nsd:NumSortData = {
                    num: parseInt(num, 10),
                    tolS: BTItm[num].tolS,
                    Risk: 0,
                };
                this.member[bt].Pos[idx] = nsd;
                this.member[bt].member[num] = BTItm[num];
                this.member[bt].member[num].pos = idx;
                this.member[bt].member[num].Num = parseInt(num, 10);
                this.member[bt].member[num].BT = parseInt(bt, 10);
                this.member[bt].Total += BTItm[num].tolS;
                this.member[bt].Payouts += BTItm[num].tolP;
                // this.member[bt].func = SortF;
                if (BTItm[num].OID > this.OID) {
                    this.OID = BTItm[num].OID;
                }
            });
            if (TNT.length > 0) {
                // this.ExtendLayoutsBlock(TNT,chkString,OM);
            }
            /*
            if(tmp.length>0){
                console.log('OB',JSON.stringify(tmp));
            }
            */
            this.calRisk(bt);
        });
    }
    updateData(dta:Data, OM?:any) {
        if (OM) console.log('OM', OM);
        Object.keys(dta).map((bt) => {
            const BTItm:Num = dta[bt];
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
            Object.keys(BTItm).map((num:any) => {
                if (chk45) {
                    // const nt:NTemp = this.getNTemp(BTItm,bt,num);
                    // TNT.push(nt);
                }
                if (this.member[bt].member[num]) {
                    this.member[bt].Total -= this.member[bt].member[num].tolS;
                    this.member[bt].Payouts -= this.member[bt].member[num].tolP;
                }
                // dta[bt][num].PerStep=this.member[bt].member[num].PerStep;
                // dta[bt][num].Steps=this.member[bt].member[num].Steps;
                
                // const pos=this.member[bt].member[num].pos;
                this.member[bt].member[num] = BTItm[num];
                this.member[bt].member[num].Num = parseInt(num, 10);
                this.member[bt].member[num].BT = parseInt(bt, 10);
                // this.member[bt].member[num].pos = pos;
                const f = this.member[bt].Pos.find((m) => m.num === parseInt(num, 10));
                if (f) {
                    f.tolS = BTItm[num].tolS;
                }
                // this.member[bt].member[num]=Object.assign(this.member[bt].member[num],dta[bt][num])
                // console.log('game updateData',this.member[bt].member[num])
                if (dta[bt][num].OID > this.OID) {
                    this.OID = BTItm[num].OID;
                }
                this.member[bt].Total += this.member[bt].member[num].tolS;
                this.member[bt].Payouts += this.member[bt].member[num].tolP;
            });
            if (TNT.length > 0) {
                // this.ExtendLayoutsBlock(TNT,chkString,OM);
            }
            this.calRisk(bt);
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
                const nsd:NumSortData = this.member[sBT].Pos[blk.Pos];
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
        if (this.member[BT]) this.member[BT].SortTable = sorttype;
    }
    setSortType=(sortid:number) => {
        Object.keys(this.member).map((BT) => {
            if (this.member[BT].SortTable) {
                // if(BT==='1') console.log(`setSortType: ${BT}, ${this.member[BT].SortID}, ${sortid}`);
                if (this.member[BT].SortID !== sortid) {
                    this.member[BT].SortID = sortid;
                    this.member[BT].Pos.sort(this.SortType[sortid]);
                    // if(BT==='1') console.log('Sort:',sortid,this.member[BT].Pos);
                }
            }
        });
        /*
        if(this.member[BT].SortTable){
            if(this.member[BT].SortID!=sortid){
                this.member[BT].SortID=sortid;
                this.member[BT].Pos.sort(this.SortType[sortid]);
            }
        }
        */
    }
    calRisk=(BT:string|number) => {
        if (typeof (BT) === 'string') BT = parseInt(BT, 10);
        const rg:RiskGroup = this.getRiskFunc(BT);
        let isDone = false;
        if (rg.func) {
            Object.keys(this).map((key) => {
                if (isDone) return;
                if (key === rg.func) {
                    if (rg.OpenNum && rg.TotalNum) {
                        // this[key](BT,rg.OpenNum,rg.TotalNum);
                        execFunctionByName(this, key, rg.OpenNum, rg.TotalNum);
                        // eval(`this.${key}(${BT},${rg.OpenNum},${rg.TotalNum})`);
                    } else {
                        // this[key](BT);
                        execFunctionByName(this, key, BT);
                        // eval(`this.${key}(${BT})`);
                    }
                    isDone = true;
                    if (this.member[BT].SortID !== 0) {
                        this.member[BT].Pos.sort(this.SortType[this.member[BT].SortID]);
                    }
                }
            });
        }
    }
    getRiskFunc=(BT:number):RiskGroup => {
        let tmp:RiskGroup = { member: [] };
        let found = false;
        if (this.GType) {
            const g:RiskGroup[] = this.RiskGroup[this.GType];
            g.map((itm) => {
                if (found) return;
                const f = itm.member.find((fbt) => fbt === BT);
                if (f) {
                    tmp = itm;
                    found = true;
                }
            });
        }
        return tmp;
    }
    // 單號風險
	calBigestRiskOne=(BT:number) => {
        // console.log('calBigestRiskOne',BT);
        let MaxWin = 0;
        Object.keys(this.member[BT].member).map((key) => {
            const B = this.member[BT];
            const M = B.member[key];
            const Risk = B.Total - M.tolP;
            this.member[BT].member[key].Risk = Math.round(Risk);
            this.setRiskToPos(BT, parseInt(key, 10), Risk);
            if (MaxWin > Risk) MaxWin = Risk;
        });
        this.member[BT].MaxWin = MaxWin;
	}
    // 多號風險計算, N 開出獎碼數, T 總號碼數 
	calBigestRiskMT=(BT:number, N:number, T:number) => {
        // console.log('calBigestRiskMT',BT);
		const otherNums = N - 1;
        const leftNums = T - 1;
        // const len:number=Object.keys(this.member[BT].member).length;
        Object.keys(this.member[BT].member).map((key) => {
            const B = this.member[BT];
            const M = B.member[key];
            const Risk = B.Total - M.tolP - (B.Payouts - M.tolP) * (otherNums / leftNums);
            this.member[BT].member[key].Risk = Math.round(Risk);
            this.setRiskToPos(BT, parseInt(key, 10), Risk);
        });
        /*
		for(var i=0;i<len;i+=1){
			if(this.Datas[i].Num == null ) continue;
			this.Datas[i].Risk=this.LRTotal-((this.Datas[i].RPay+this.Datas[i].SPay+this.Datas[i].RLeft)+((this.TotalRPay+this.TotalSPay+this.LRTotal)-(this.Datas[i].RPay+this.Datas[i].SPay+this.Datas[i].RLeft))*otherNums/leftNums)-this.CTotal+this.SCTotal;
        }
        */
    }
    setRiskToPos=(BT:number, num:number, Risk:number) => {
        const f = this.member[BT].Pos.find((m) => m.num === num);
        if (f) {
            f.Risk = Risk;
        }
    }
    get Items() {
        return this.member;
    }
}
