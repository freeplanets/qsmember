import { AskTable, MemberName, AskWithMemberName } from '../../if/dbif';

/**
 * identify => ItemID + '-' + ItemType 
 */
export default class CryptoItemOneSide {
	private list:AskWithMemberName[] = [];
	private inProcess:AskWithMemberName[] = [];	// 只看限價單
	private QtyAfterLever = 0;
	private priceAverage = 0;
	private curGainLose = 0;
	private totalPrice = 0;
	// private priceLimit = 0;
	private priceLimitAmt = 0;
	private mbrName:MemberName[] = [];
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
		return this.attachName(this.list);
	}
	get Count() {
		return this.List.length;
	}
	get InProcess() {
		return this.attachName(this.inProcess);
	}
	get PriceLimit() {
		return this.inProcess.length;
	}
	get PriceLimitAmt() {
		return this.priceLimitAmt;
	}
	set MbrName(v:MemberName[]) {
		this.mbrName = v;
	}
	add(ask:AskTable)	{
		// console.log('CrpytoItemOneSide add', ask);
		if ((ask.ItemID === this.id && ask.ItemType === this.type) || ask.ProcStatus === 4) {
			const askid = ask.SetID || ask.USetID;
			if (askid) {
				this.removeFromInProcess(askid);
				const fIdx = this.list.findIndex((itm) => itm.id === ask.id);
				// console.log('CIOS add:', this.id, ask.id, fIdx, new Date().getTime());
				if (ask.ProcStatus < 2) {
					this.addToList(ask, fIdx);
				} else {
					this.removeFromList(ask, fIdx);
				}
			} else {
				this.addToInProcess(ask);
			}
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
			/*
			if (ask.AskType) {
				this.priceLimit += 1;
				this.priceLimitQty += ask.Qty * ask.Lever;
				this.priceLimitAmt += ask.Qty * ask.Lever * ask.AskPrice;
			}
			*/
		}
	}
	private addToInProcess(ask:AskTable) {
		if (ask.AskType === 1 || ask.ProcStatus === 4) {
			if (ask.ProcStatus > 1) {
				this.removeFromInProcess(ask.id);
			} else {
				const fIdx = this.inProcess.findIndex((inp) => inp.id === ask.id);
				if (fIdx === -1) {
					this.inProcess.push(ask);
					// this.priceLimit += 1;
					// this.priceLimitQty += ask.Qty * ask.Lever;
					this.priceLimitAmt += ask.Amount * ask.Lever;
				}
			}
		}
	}
	private removeFromInProcess(askid:number) {
		const fIdx = this.inProcess.findIndex((inp) => inp.id === askid);
		if (fIdx !== -1) {
			const ask = this.inProcess[fIdx];
			// this.priceLimit -= 1;
			// this.priceLimitQty -= ask.Qty * ask.Lever;
			this.priceLimitAmt -= ask.Amount * ask.Lever;
			this.inProcess.splice(fIdx, 1);
			// console.log('removeFromInProcess', this.inProcess.length, fIdx);
		}
	}
	cleanList() {
		this.list = [];
		this.QtyAfterLever = 0;
		this.priceAverage = 0;
		// this.priceLimit = 0;
		this.priceLimitAmt = 0;
		// this.curGainLose = 0;
	}
	setSettleMark(AskID:number, MarkTS:string) {
		console.log('setSettleMark:', AskID, MarkTS);
		const fIdx = this.list.findIndex((ask) => ask.id === AskID);
		if (fIdx > -1) {
			console.log('found:', fIdx);
			this.list[fIdx].MarkTS = MarkTS;
		}
	}
	private removeFromList(ask:AskTable, fIdx:number) {
		if (fIdx !== -1) {
			this.reCalQtyAndAvgPrice(ask.Qty, ask.AskPrice, ask.Lever, -1);
			/*
			if (ask.AskType) {
				this.priceLimit -= 1;
				this.priceLimitQty -= ask.Qty * ask.Lever;
				this.priceLimitAmt -= ask.Qty * ask.Lever * ask.AskPrice;
			}
			*/
			this.list.splice(fIdx, 1);
		}
	}
	private reCalQtyAndAvgPrice(Qty:number, Price:number, Lever:number, add:number) {
		const LeverQty = Qty * Lever;
		this.totalPrice = this.QtyAfterLever * this.priceAverage + LeverQty * Price * add;
		this.QtyAfterLever += LeverQty * add;
		this.priceAverage = this.QtyAfterLever === 0 ? 0 : this.totalPrice / this.QtyAfterLever;
		// console.log('CIOS reCalQtyAndAvgPrice', this.QtyAfterLever, this.priceAverage);
	}
	private attachName(list:AskTable[]) {
		return list.map((itm:AskWithMemberName) => {
			const f = this.mbrName.find((mbr) => mbr.id === itm.UserID);
			if (f) {
				itm.Nickname = f.Nickname;
			}
			// console.log('CryptoItemOneSide List', itm, f);
			return itm;
		});
	}
}
