export interface IOdds {
    OID:number;
    Odds:number;
    MaxOdds:number;
    isStop:number;
    tolW:number;
    tolS:number;
    tolP:number;
    Risk?:number;
    BT?:number;
    Num?:number;
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
/*
interface IGame {
    //ModifyOdds(Odds:IOdds):void;
    member:IBetTypes
}
*/
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
            }]
        }
    constructor(){
        this.member={}
    }
    get MaxOddsID(){
        return this.OID;
    }
    inidata(dta:IData){
        Object.keys(dta).map(bt=>{
            const BTItm:INum=dta[bt];
            this.member[bt]={
                Total:0,
                Payouts:0,
                member:{}
            }
            Object.keys(BTItm).map(num=>{
                //this.member.
                this.member[bt].member[num]=BTItm[num];
                this.member[bt].Total += BTItm[num].tolS;
                this.member[bt].Payouts += BTItm[num].tolP;
                if(BTItm[num].OID > this.OID) {
                    this.OID = BTItm[num].OID;
                }
            })
            this.calRisk(bt);
        })
    }
    updateData(dta:IData){
        Object.keys(dta).map(bt=>{
            Object.keys(dta[bt]).map(num=>{
                this.member[bt].Total -= this.member[bt].member[num].tolS
                this.member[bt].Payouts -= this.member[bt].member[num].tolP
                this.member[bt].member[num]=dta[bt][num];
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
    getOdds(BT:number,num:number,extOdds:number|undefined=undefined){
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
            console.log(this.member[sBT]);
            return {};
        }
        const tmp:IOdds=this.member[sBT].member[sNum];
        tmp.Odds=parseFloat(tmp.Odds.toFixed(2));
        tmp.BT = BT;
        tmp.Num = num;
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
            this.member[BT].member[key].Risk = Risk;
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
            this.member[BT].member[key].Risk = Risk;
        });
        /*
		for(var i=0;i<len;i+=1){
			if(this.Datas[i].Num == null ) continue;
			this.Datas[i].Risk=this.LRTotal-((this.Datas[i].RPay+this.Datas[i].SPay+this.Datas[i].RLeft)+((this.TotalRPay+this.TotalSPay+this.LRTotal)-(this.Datas[i].RPay+this.Datas[i].SPay+this.Datas[i].RLeft))*otherNums/leftNums)-this.CTotal+this.SCTotal;
        }
        */
	}     
}