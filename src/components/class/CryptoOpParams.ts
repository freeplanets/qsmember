import { HighlightSpanKind } from 'typescript';
import { CryptoOpParams } from '../if/dbif';
import { OpTypes } from '../if/ENum';

export default class CryptoParams {
	private data:CryptoOpParams;
	private ischanged = false;
	private FeeDenominator = 1000;
	constructor(private itemID:number, data?:CryptoOpParams) {
		if(!data){
			this.data = this.createData();
		} else {
			this.data = data;
		}
	}
	get id():number {
		return this.data.id;
	}
	setID(v:number) {
		this.data.id = v;
	}
	get OpType():OpTypes {
		return this.data.OpType;
	}
	set OpType(v:OpTypes) {
		this.data.OpType = v;
		this.ischanged = true;
	}
	get ItemID():number {
		return this.data.ItemID;
	}
	get isActive():boolean {
		return !!this.data.isActive;
	}
	set isActive(v:boolean) {
		this.data.isActive = v ? 1 : 0;
		this.ischanged = true;
		console.log('isActive', v);
	}
	get OneHand() {
		return this.data.OneHand;
	}
	set OneHand(v:number) {
		this.data.OneHand = v;
		this.ischanged = true;
	}
	get FullStorage() {
		return this.data.FullStorage;
	}
	set FullStorage(v:number) {
		this.data.FullStorage = v;
		this.ischanged = true;
	}
	get LeverLimit() {
		return this.data.LeverLimit;
	}
	set LeverLimit(v:number) {
		this.data.LeverLimit = v;
		this.ischanged = true;
	}
	get ShortTerm1() {
		return this.data.ShortTerm1;
	}
	set ShortTerm1(v:number) {
		this.data.ShortTerm1 = v;
		this.ischanged = true;
	}
	get ShortTerm2() {
		return this.data.ShortTerm2;
	}
	set ShortTerm2(v:number) {
		this.data.ShortTerm2 = v;
		this.ischanged = true;
	}
	get ShortTermFee() {
		return (this.data.ShortTermFee * this.FeeDenominator).toFixed(1);
	}
	set ShortTermFee(v:string) {
		this.data.ShortTermFee = parseFloat(v) / this.FeeDenominator;
		this.ischanged = true;
	}
	get ModifyID():number {
		return this.data.ModifyID;
	}
	set ModifyID(v:number) {
		this.data.ModifyID = v;
	}
	get Data() {
		if(this.data.ModifyTime) delete this.data.ModifyTime;
		if(this.data.CreateTime) delete this.data.CreateTime;
		return this.data;
	}
	get isChanged() {
		return this.ischanged;
	}
	set isChanged(v:boolean) {
		this.ischanged = v;
	}
	private createData() {
		const data:CryptoOpParams = {
			id: 0,
			ItemID: this.itemID,
			OpType: OpTypes.NONE,
			isActive: 0,
			OneHand: 0,
			FullStorage: 0,
			LeverLimit: 0,
			ShortTerm1: 0,
			ShortTerm2: 0,
			ShortTermFee: 0,
			ModifyID: 0,
		}
		return data;
	}
}