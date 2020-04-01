import BClass from './BClass';
export interface IOParam {
    id:number;
    GameID:number;
    BetType:number;
    SubType:number;
    TotalNums:number;
    UseAvg:number;
    SingleNum:number;
    UnionNum:number;
    MinHand:number;
    MaxHand:number;
    BetForChange:number;
    Steps:number;
}
export default class OpParams extends BClass<IOParam>{
    private BetName:string='';
    private sSubName:string='';
    constructor(data:IOParam){
        super(data);
    }
    get BTName():string{
        return this.BetName;
    }
    set BTName(val:string){
        this.BetName=val;
    }
    get SubName():string {
        return this.sSubName;
    }
    set SubName(v:string) {
        this.sSubName = v;
    }
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
    get Steps():number{
        return this.data.Steps;
    }
    set Steps(val:number){
        this.isDataChanged=true;
        this.data.Steps=val;
    }
}
/*
export class OpParams{
    private oldData:IOParam;
    private isDataChanged:boolean=false;
    constructor(private data:IOParam){
        this.oldData=Object.create(data);
    }
    get id():number{
        return this.data.id;
    }
    get GameID():number{
        return this.data.GameID;
    }
    get BetType():number{
        return this.data.BetType;
    }
    get SingleNum():number{
        return this.data.SingleNum;
    }
    set SingleNum(val:number){
        this.data.SingleNum = val;
    }
    get UnionNum():number{
        return this.data.UnionNum;
    }
    set UnionNum(val:number){
        this.data.UnionNum=val;
    }
    get dataChaged():boolean{
        return this.isDataChanged;
    }
    set dataChanged(val:boolean){
        this.isDataChanged=val;
    }
    public restoreData(){
        //this.data = this.olddata;
        Object.keys(this.data).map(key=>{
            this.data[key]=this.oldData[key];
        })
        this.isDataChanged = false;
    }  

}
*/