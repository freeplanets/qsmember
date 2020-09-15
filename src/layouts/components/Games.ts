import {BaNum} from './func';
import {OSteps} from '../data/if';
export interface IOdds {
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
interface INum {
    [num:string]:IOdds;
}
export interface IData {
    [BT:string]:INum;
}
interface IBetType {
    Total:number;
    Payouts:number;
    MaxWin?:number;
    member:INum;
}
interface IBetTypes {
    [BT:string]:IBetType;
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
export class CGame {
    private member:IBetTypes;
    private OID:number=0;
    public isUpdated:boolean=true;
    public GType:string='';
    private RiskGroup:RGS=
        {
            MarkSix:[  
                {
                    member:[4],
                    TotalNum:49,
                    OpenNum:6,
                    func:'calBigestRiskMT'
                },
                {
                    member:[12,13,14,27],
                    func:'calBigestRiskOne'
                },
                {
                    member:[
                    1, 28,  2,  3, 74,  5,  6, 72,  9,
                    73, 71, 16, 17, 18, 19, 20, 21, 22, 
                    23, 24, 25, 26, 29, 75, 76, 77, 78, 30 ],
                    func:'calBigestRiskOne'
                },        
                {
                    member:[
                    8, 7, 10, 11, 15, 31, 32, 33, 34, 35,
                    36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
                    46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
                    56, 57, 58, 59, 60, 61, 62, 63, 64, 65,
                    66, 67, 68, 69, 70]
            }],
            '3D':[
                {
                    member:[
                        1,2,3,4,5,6,7,8,9,10,
                        11,12,13,14,15,16,17,
                        34,35,36,37,38,39,40,
                        41,42,43,44,45,46,47,
                        48,49,50,51,52,53,54,
                        55,56,57,58,59,60,61,
                        62,63,64,65],
                    func:'calBigestRiskOne'
                }
            ],
            Happy:[

            ],           
            Cars: [

            ],
            Always:[
                
            ],
            Speed3: [

            ],
            Happy8: [
                
            ],
            BTCHash: [
                
            ]
        }
    constructor(){
        this.member={}
    }
    get MaxOddsID(){
        return this.OID;
    }
    inidata(dta:IData){
        this.member={};
        Object.keys(dta).map(bt=>{
            const BTItm:INum=dta[bt];
            this.member[bt]={
                Total:0,
                Payouts:0,
                member:{}
            }
            const tmp:object[]=[];
            Object.keys(BTItm).map(num=>{
                //this.member.
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
                this.member[bt].member[num]=BTItm[num];
                this.member[bt].Total += BTItm[num].tolS;
                this.member[bt].Payouts += BTItm[num].tolP;
                if(BTItm[num].OID > this.OID) {
                    this.OID = BTItm[num].OID;
                }
            })
            /*
            if(tmp.length>0){
                console.log('OB',JSON.stringify(tmp));
            }
            */
            this.calRisk(bt);
        })
    }
    updateData(dta:IData){
        Object.keys(dta).map(bt=>{
            Object.keys(dta[bt]).map(num=>{
                this.member[bt].Total -= this.member[bt].member[num].tolS
                this.member[bt].Payouts -= this.member[bt].member[num].tolP
                //dta[bt][num].PerStep=this.member[bt].member[num].PerStep;
                //dta[bt][num].Steps=this.member[bt].member[num].Steps;
                this.member[bt].member[num]=dta[bt][num];
                //this.member[bt].member[num]=Object.assign(this.member[bt].member[num],dta[bt][num])
                //console.log('game updateData',this.member[bt].member[num])
                if(dta[bt][num].OID > this.OID) {
                    this.OID = dta[bt][num].OID;
                }
                this.member[bt].Total += this.member[bt].member[num].tolS
                this.member[bt].Payouts += this.member[bt].member[num].tolP
            })
            this.calRisk(bt);
            this.isUpdated = true;
        })
    }
    getOdds(BT:number,num:number,extOdds?:number){
        //console.log('CGame getOdds',BT,num);
        if(extOdds!==undefined){
            if(extOdds==1){
                num=num+100;
            } else {
                return null;
            }
        }
        const sBT:string=BT.toString();
        const sNum:string=num.toString();
        if(!this.member[sBT]){
            //console.log(this.member[sBT]);
            return {};
        }
        if(!this.member[sBT].member[sNum]){
            console.log('no perstep:',sBT,sNum,this.member[sBT]);
            return {};
        }    
        const tmp:IOdds=this.member[sBT].member[sNum];
        //const ba = BaNum(tmp.PerStep ? tmp.PerStep : 1);
        if(tmp.PerStep>0){
            const ba = BaNum(tmp.PerStep);
            tmp.Odds= Math.round(tmp.Odds*ba)/ba;
        }
        //if(this.GType==='BTCHash' &&　BT===47) console.log('getOdds:',sBT,tmp.Odds,tmp.Steps);
        tmp.BT = BT;
        tmp.Num = num;
        //if(Steps) tmp.Steps = Steps;
        return tmp;
    }
    calRisk=(BT:string|number)=>{
        if(typeof(BT)==='string') BT=parseInt(BT,10);
        let rg:RiskGroup=this.getRiskFunc(BT);
        let isDone = false;
        if(rg.func){
            Object.keys(this).map(key=>{
                if(isDone) return;
                if(key===rg.func){
                    if(rg.OpenNum && rg.TotalNum){
                        this[key](BT,rg.OpenNum,rg.TotalNum);
                    } else {
                        this[key](BT);
                    }
                    isDone=true;
                }
            })
        }
    }
    getRiskFunc=(BT:number):RiskGroup=>{
        let tmp:RiskGroup={member:[]};
        let found:boolean=false;
        if(this.GType){
            const g:RiskGroup[]=this.RiskGroup[this.GType];
            g.map(itm=>{
                if(found) return;
                const f=itm.member.find(fbt=>fbt===BT);
                if(f){
                    tmp=itm;
                    found=true;
                }
            })
        }
        return tmp;     
    }
    // 單號風險
	calBigestRiskOne=(BT:number)=>{
        //console.log('calBigestRiskOne',BT);
        let MaxWin:number=0;
        Object.keys(this.member[BT].member).map(key=>{
            let B =  this.member[BT];
            let M =  B.member[key];
            let Risk = B.Total - M.tolP;
            this.member[BT].member[key].Risk = Math.round(Risk);
            if(MaxWin > Risk) MaxWin = Risk;
        });
        this.member[BT].MaxWin=MaxWin;
	}    
    //多號風險計算, N 開出獎碼數, T 總號碼數 
	calBigestRiskMT=(BT:number,N:number,T:number)=>{
        //console.log('calBigestRiskMT',BT);
		const otherNums=N-1;
        const leftNums=T-1;
        //const len:number=Object.keys(this.member[BT].member).length;
        Object.keys(this.member[BT].member).map(key=>{
            let B =  this.member[BT];
            let M =  B.member[key];
            let Risk = B.Total - M.tolP - (B.Payouts-M.tolP)*(otherNums/leftNums);
            this.member[BT].member[key].Risk = Math.round(Risk);
        });
        /*
		for(var i=0;i<len;i+=1){
			if(this.Datas[i].Num == null ) continue;
			this.Datas[i].Risk=this.LRTotal-((this.Datas[i].RPay+this.Datas[i].SPay+this.Datas[i].RLeft)+((this.TotalRPay+this.TotalSPay+this.LRTotal)-(this.Datas[i].RPay+this.Datas[i].SPay+this.Datas[i].RLeft))*otherNums/leftNums)-this.CTotal+this.SCTotal;
        }
        */
    }
    get Items(){
        return this.member;
    }     
}