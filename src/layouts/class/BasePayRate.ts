import BClass from './BClass';
import {fixlen} from '../components/func';
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
    get DfRate():number | undefined{
        return this.data.DfRate;
    }
    set DfRate(v:number | undefined) {
        this.data.DfRate = this.fetchValueToSteps(v);
        this.calProfit();
        this.isDataChanged = true;
    }
    get TopRate():number | undefined{
        return this.data.TopRate;
    }
    set TopRate(v:number | undefined){
        this.data.TopRate = this.fetchValueToSteps(v);
        this.isDataChanged = true;
    }
    get Probability():number |undefined{
        return this.data.Probability;
    }
    set Probability(v:number |undefined){
        this.data.Probability = v;
        //this.calTopRate();
        this.calProfit();
        this.isDataChanged = true;
    }
    get Steps():number | undefined{
        return this.data.Steps ;
    }
    set Steps(v:number  | undefined){
        this.data.Steps = v;
        //console.log('set Steps',this.data.Steps,v);
        this.data.DfRate = this.fetchValueToSteps(this.data.DfRate);
        this.data.TopRate = this.fetchValueToSteps(this.data.TopRate);
        this.isDataChanged = true;
    }
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
            this.DfRate = (1-pft/100)/this.Probability;
        }
    }
    protected fetchValueToSteps(v:number|undefined){
        if(v){
            if(this.data.Steps){
                //v=parseFloat(v.toPrecision(6));
                if(this.data.Steps <=0) return v;
                //if(typeof v ==='string') v=parseFloat(v);
                const ba=fixlen(this.data.Steps);
                const a = (Math.round(v/this.data.Steps)*this.data.Steps).toFixed(ba);
                //console.log('fetchValueToSteps',a,v,this.data.Steps,typeof v,typeof this.data.Steps,Math.floor(v/this.data.Steps)*this.data.Steps);
                return parseFloat(a);
            }
        }
        return v;
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
        if(this.DfRate && this.Probability) {
            if(this.Probability > 0) {
                this.data.Profit = Math.round((1 - this.Probability * this.DfRate)*1000000)/10000;
            }
        }
    }
}