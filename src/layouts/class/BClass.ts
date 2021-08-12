/*
interface T {
    [n:string]: string | number | undefined;
}
*/
export default class BClass<T> {
    protected oldData:T;
    protected isDataChanged=false;
    protected data:T;
    constructor(data:T) {
        this.data = data;
        // const o = {};
        // Object.assign(o, data);
        this.oldData = { ...data };
    }
    get DataChanged() {
        return this.isDataChanged;
    }
    set DataChanged(v:boolean) {
        this.isDataChanged = v;
    }
    public restoreData() {
        // this.data = this.olddata;
        Object.assign(this.data, this.oldData);
        this.isDataChanged = false;
    }
    get Datas():T {
        return this.data;
    }
    set Datas(v:T) {
        Object.assign(this.data, v);
        Object.assign(this.oldData, v);
    }
}
