import BClass from './BClass';
import {fixlen} from '../components/func';
import {StepG} from '../data/if';
/*
interface T {
    [n:string]: string | number | undefined;
}
*/
export class BasePayRate<T>{
    protected olddata:T | any ;
    protected data:T |any ;
    private isDataChanged: boolean = false;
    private isSelected:boolean = false;
    private BC:BClass<T>;
    private extProbability:number|undefined;
    private extRate:number=0;
    constructor(v:T | any){ 
        this.BC=new BClass(v);
        this.data = this.BC.Datas;
        /*
        let d = {};
        let o = {};
        Object.assign(d,v);
        Object.assign(o,v);
        this.data = d;
        this.olddata = o;
        */
        /*
        Object.keys(v).map(key=>{
            //if(v.BetType=='1') console.log('',key);
            this.data[key]=v[key];
            this.olddata[key]=v[key];
        })
        */
    }
    get Title():string{
        return this.data.Title;
    }
    get SubTitle():string | undefined {
        return this.data.SubTitle;
    }
    get BetType():number{
        return this.data.BetType ? this.data.BetType : 0;
    }
    get SubType():number | undefined{
        return this.data.SubType;
    }
    get NoAdjust():boolean {
        //console.log('get NoAdjust:',this.data.NoAdjust);
        return this.data.NoAdjust===1;
    }
    set NoAdjust(v:boolean){
        this.data.NoAdjust = (v ? 1 : 0);
        this.isDataChanged=true;
        //console.log('set NoAdjust:',v,this.data.NoAdjust);
    }
    get Profit():any {
        //console.log('get Profit',this.data.Profit);
        if(this.data.Profit){
            this.calProfit();
            return Math.round(this.data.Profit*10000)/10000;
        } else {
            return this.data.Profit;
        }
    }
    /*
    set Profit(v:any){
        //console.log('set Profit',this.data.Profit,v);
        this.data.Profit = v;
        //console.log('set Profit',this.data);
        //this.calTopRate();
        this.isDataChanged = true;
    }
    */
    get Rate():number | undefined{
        return this.data.DfRate;
    }
    set Rate(v:number | undefined) {
        this.data.DfRate = this.fetchValueToSteps(v);
        if(this.data.DfRate > this.data.TopRate){
            this.data.DfRate = this.data.TopRate;
        }
        //this.calProfit();
        this.isDataChanged = true;
    }
    get TopRate():number | undefined{
        return this.data.TopRate;
    }
    set TopRate(v:number | undefined){
        this.data.TopRate = this.fetchValueToSteps(v);
        if(this.data.DfRate > this.data.TopRate){
            this.data.DfRate = this.data.TopRate;
        }        
        this.isDataChanged = true;
    }
    get Probability():number |undefined{
        return this.data.Probability;
    }
    set Probability(v:number |undefined){
        this.data.Probability = v;
        //this.calTopRate();
        //this.calProfit();
        this.isDataChanged = true;
    }
    set ExtProb(v:number){
        this.extProbability = v;
    }
    set ExtRate(v:number){
        this.extRate = v;
    }
    get PerStep():number | undefined{
        return this.data.PerStep;
    }
    set PerStep(v:number  | undefined){
        this.data.PerStep=v;
        //console.log('set Steps',this.data.Steps,v);
        this.data.DfRate = this.fetchValueToSteps(this.data.DfRate);
        this.data.TopRate = this.fetchValueToSteps(this.data.TopRate);
        this.isDataChanged = true;
    }
    get Steps():number{
        return this.data.Steps ;
    }
    set Steps(v:number){
        this.data.Steps = this.fetchValueToSteps(v);
        //console.log('set Steps',this.data.Steps,v);
        this.isDataChanged = true;
    }
    get ChangeStart():number{
        return this.data.ChangeStart ;
    }
    set ChangeStart(v:number){
        this.isDataChanged = true;
        this.data.ChangeStart = v;
        //console.log('set Steps',this.data.Steps,v);
    }

    /*
    get TopPay(){
        return this.data.TopPay;
    }
    set TopPay(v:number|undefined){
        this.data.TopPay = v;
        this.isDataChanged = true;
    }
    get OneHand(){
        return this.data.OneHand;
    }
    set OneHand(v:number|undefined){
        this.data.OneHand = v;
        this.isDataChanged = true;
    }
    */
   get TotalNums():number {
    return this.data.TotalNums;
    }
    set TotalNums(val:number){
        this.isDataChanged=true;
        this.data.TotalNums=val;
    }
    get UseAvg():boolean{
        return this.data.UseAvg===1;
    }
    set UseAvg(val:boolean){
        this.isDataChanged=true;
        this.data.UseAvg=(val? 1 : 0);
    }
    get SingleNum():number{
        return this.data.SingleNum;
    }
    set SingleNum(val:number){
        this.isDataChanged=true;
        this.data.SingleNum = val;
    }
    get UnionNum():number{
        return this.data.UnionNum;
    }
    set UnionNum(val:number){
        this.isDataChanged=true;
        this.data.UnionNum=val;
    }
    get MinHand():number{
        return this.data.MinHand;
    } 
    set MinHand(val:number){
        this.isDataChanged=true;
        this.data.MinHand=val;
    }
    get MaxHand():number{
        return this.data.MaxHand;
    }
    set MaxHand(val:number){
        this.isDataChanged=true;
        this.data.MaxHand=val;
    }
    get BetForChange():number{
        return this.data.BetForChange;
    }
    set BetForChange(val:number){
        this.isDataChanged=true;
        this.data.BetForChange=val;
    }
    get StepsGroup():StepG[]{
        if(!this.data.StepsGroup) return [];
        return JSON.parse(this.data.StepsGroup);
    }
    set StepsGroup(val:StepG[]){
        this.isDataChanged=true;
        const tmp:StepG[]=[];
        val.map(itm=>{
            if(itm.Step){
                itm.Start = typeof(itm.Start)==='string' ?  parseInt(itm.Start,10) : itm.Start;
                itm.Step = typeof(itm.Step)==='string' ?  parseInt(itm.Step,10) : itm.Step;
                itm.Step = this.fetchValueToSteps(itm.Step);
                tmp.push(itm);
            } 
        })
        this.data.StepsGroup = JSON.stringify(tmp);
    }   
    get Datas():T {
        return this.data;
    }
    set Datas(v:T){
        this.BC.Datas = v;
        this.data = this.BC.Datas;
        this.DataChanged = this.BC.DataChanged;
        /*
        Object.keys(v).map(key=>{
            this.data[key]=v[key];
            this.olddata[key]=v[key];
        })
        */
    }    
    get DataChanged() {
        return this.isDataChanged;
    }
    set DataChanged(v:boolean){
        this.isDataChanged = v;
    }
    get Selected(){
        return this.isSelected;
    }
    set Selected(v:boolean){
        this.isSelected = v;
    }
    public restoreData(){
        //this.data = this.olddata;
        /*
        Object.keys(this.data).map(key=>{
            this.data[key]=this.olddata[key];
        })
        */
        this.BC.restoreData();
        this.data=this.BC.Datas;
        this.isDataChanged = false;
    }
    updateRateTopByProfit(pft:number){
        if(this.Probability){
            this.TopRate = (1-pft/100)/this.Probability;
        }
    }
    updateDefaultRateByProfit(pft:number){
        if(this.Probability){
            this.Rate = (1-pft/100)/this.Probability;
        }
    }
    //單碼滿倉=風險金額 (    )/不含本金賠率
    updateSingleNumFull(risk:number){
        if(this.Rate){
            this.SingleNum=Math.abs(Math.round(risk/(this.Rate-1)));
        }
    }
    //押碼啟動金額 = 不降賠可承受風險(      )/不含本金賠率
    updateChangeStart(topRisk:number){
        if(this.Rate){
            this.ChangeStart = Math.abs(Math.round(topRisk/(this.Rate-1)));
        }
    }
    //押碼金額 = 押碼風險金額(      )/不含本金賠率
    updateBetForChange(betRisk:number){
        if(this.Rate){
            this.BetForChange = Math.abs(Math.round(betRisk/(this.Rate-1)));
        }
    }
    //押碼點數 = 跳動點 * (     )
    updateSteps(v:number){
        if(v && this.PerStep){
            this.Steps = this.PerStep * v;
        }
    }
    protected fetchValueToSteps(v:number|undefined){
        if(v){
            if(this.data.PerStep){
                //v=parseFloat(v.toPrecision(6));
                if(this.data.PerStep <=0) return v;
                //if(typeof v ==='string') v=parseFloat(v);
                const ba=fixlen(this.data.PerStep);
                const a = (Math.round(v/this.data.PerStep)*this.data.PerStep).toFixed(ba);
                //console.log('fetchValueToSteps',a,v,this.data.Steps,typeof v,typeof this.data.Steps,Math.floor(v/this.data.Steps)*this.data.Steps);
                return parseFloat(a);
            }
        }
        return 0;
    }
    private calTopRate(){
        if(this.Profit && this.Probability){
            if(this.Probability > 0) {
                if(!this.olddata.TopRate){
                    let r:number = (1-this.Profit)/this.Probability;
                    this.TopRate = this.fetchValueToSteps(r);
                }
            }
        }
    }
    private calProfit(){
        if(this.Rate && this.Probability) {
            if(this.Probability > 0) {
                let p:number;
                if( this.extProbability){
                    //console.log(this.BetType,this.Probability,this.Rate,this.extProbability,this.extRate);
                    p = Math.round((1 - (this.Probability * this.Rate + this.extProbability*this.extRate))*1000000)/10000;
                } else {
                    p = Math.round((1 - this.Probability * this.Rate)*1000000)/10000;
                }
                this.data.Profit=p;
            }
        }
    }
}