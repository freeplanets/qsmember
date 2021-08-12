import { AskTable } from '../if/dbif';

/**
 * identify => ItemID + '-' + ItemType 
 */
export default class CryptoItemOneSide {
	private list:AskTable[] = [];
	private QtyAfterLever = 0;
	private priceAverage = 0;
	private curGainLose = 0;
	private totalPrice = 0;
	private priceLimit = 0;
	private priceLimitQty = 0;
	private id=0;
	private type=0;
	constructor(id:number, type:number) {
		this.id = id;
		this.type = type;
	}
	get Qty() {
		return this.QtyAfterLever;
	}
	get Price() {
		return this.priceAverage;
	}
	get Total() {
		return this.totalPrice;
	}
	get GainLose() {
		return this.curGainLose;
	}
	get List() {
		return this.list;
	}
	get PriceLimit() {
		return this.priceLimit;
	}
	get PriceLimitQty() {
		return this.priceLimitQty;
	}
	add(ask:AskTable)	{
		if (ask.ItemID !== this.id || ask.ItemType !== this.type) return;
		// console.log('CIOS add:', this.id,JSON.stringify(ask));		
		const fIdx = this.list.findIndex((itm) => itm.id === ask.id);
		if (ask.ProcStatus < 2) {
			this.addToList(ask, fIdx);
		} else {
			this.removeFromList(ask, fIdx);
		}
		// console.log('CIOS after add:', this.list.length);
	}
	acceptPrice(price:number) {
		this.curGainLose = (price - this.priceAverage) * this.QtyAfterLever * this.type;
		// console.log(`itemid:${this.id}>${price}>${this.curGainLose}>${this.Qty}`);
	}
	private addToList(ask:AskTable, fIdx:number) {
		if (fIdx === -1) {
			this.reCalQtyAndAvgPrice(ask.Qty, ask.AskPrice, ask.Lever, 1);
			this.list.push(ask);
			if (ask.AskType) {
				this.priceLimit += 1;
				this.priceLimitQty += ask.Qty * ask.Lever;
			}
		}
	}
	cleanList() {
		this.list = [];
		this.QtyAfterLever = 0;
		this.priceAverage = 0;
		// this.curGainLose = 0;
	}
	private removeFromList(ask:AskTable, fIdx:number) {
		if (fIdx !== -1) {
			this.reCalQtyAndAvgPrice(ask.Qty, ask.AskPrice, ask.Lever, -1);
			this.list.splice(fIdx, 1);
			if (ask.AskType) {
				this.priceLimit -= 1;
				this.priceLimitQty -= ask.Qty * ask.Lever;
			}
		}
	}
	private reCalQtyAndAvgPrice(Qty:number, Price:number, Lever:number, add:number) {
		const LeverQty = Qty * Lever;
		this.totalPrice = this.QtyAfterLever * this.priceAverage + LeverQty * Price * add;
		this.QtyAfterLever += LeverQty * add;
		this.priceAverage = this.QtyAfterLever === 0 ? 0 : this.totalPrice / this.QtyAfterLever;
		// console.log('CIOS reCalQtyAndAvgPrice', this.QtyAfterLever, this.priceAverage);
	}
}
