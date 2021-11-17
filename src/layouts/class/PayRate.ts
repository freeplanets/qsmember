import { PayRateItm } from '../data/if';
// import BClass from './BClass';
import { BasePayRate } from './BasePayRate';

export class PayRate extends BasePayRate<PayRateItm> {
    constructor(v:PayRateItm) {
        v.Profit = 0;
        super(v);
    }
    /*
    get Profit(){
        if(this.data.DfRate){
            const Probability:number = this.data.Probability as number;
            const br:number = this.data.DfRate as number;
            const r:number= this.data.Rate as number;
            const Rate:number = br + r;
            //console.log(this.data.BetType,this.data.SubType,br,r,Rate);
            return Math.round((1- Probability*Rate)*1000000)/10000;
        }
    }
    */
    get Rate() {
         // this.data.Rate ? this.data.Rate : 0;
         let r = 0;
         const dfR = this.data.DfRate as number;
         if (this.data.Rate) {
             r = this.data.Rate as number;
         }
         const fvt = this.fetchValueToSteps(r + dfR);
         // if ((r + dfR) !== fvt) this.Rate = fvt;
        return fvt;
    }
    set Rate(v:number|undefined) {
        console.log('Rate:', this.data.DfRate, this.data);
        v = v as number - this.data.DfRate;
        console.log('Rate:', v);
        this.data.Rate = this.fetchValueToSteps(v);
        this.DataChanged = true;
    }
    get LowestBet() {
        return this.data.LowestBet;
    }
    set LowestBet(v:number|undefined) {
        this.data.LowestBet = v;
        this.DataChanged = true;
    }
    get SingleBet() {
        return this.data.SingleBet;
    }
    set SingleBet(v:number|undefined) {
        this.data.SingleBet = v;
        this.DataChanged = true;
    }
}
