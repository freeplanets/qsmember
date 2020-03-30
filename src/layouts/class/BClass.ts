import { ifError } from "assert";

interface T {
    [n:string]: string | number | undefined;
}
export default class BClass<T>{
    protected oldData:T={} as T;
    protected isDataChanged:boolean=false;
    constructor(protected data:T){
        let o={};
        Object.assign(o,data);
        this.oldData=o as T;
    }   
    get DataChanged() {
        return this.isDataChanged;
    }
    set DataChanged(v:boolean){
        this.isDataChanged = v;
    }
    public restoreData(){
        //this.data = this.olddata;
        Object.keys(this.data).map(key=>{
            this.data[key]=this.oldData[key];
        })
        this.isDataChanged = false;
    }
    get Datas():T {
        return this.data;
    }
    set Datas(v:T){
        Object.keys(v).map(key=>{
            this.data[key]=v[key];
            this.oldData[key]=v[key];
        })
    }
}