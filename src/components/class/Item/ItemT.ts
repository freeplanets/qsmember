import { ItemTotal, ItemTypeTotal, LedgerLever } from '../../if/dbif';
import ItemTT from './ItemTT';

export interface titleT {
	id:number;
	Title:string;
}

export default class ItemT implements ItemTotal {
	private items:ItemTypeTotal[]=[];
	private records = 0;
	private amount = 0;
	private leverAmount = 0;
	private avgLever = 0;
	private fee = 0;
	private gainlose = 0;
	private title = '';
	constructor(private key:number) {
		this.items.push(new ItemTT());
		this.items.push(new ItemTT());
	}
	get Key() {
		return this.key;
	}
	get Title() {
		return this.title;
	}
	get Records() {
		return this.records;
	}
	get Amount() {
		return this.amount;
	}
	get LeverAmount() {
		return this.leverAmount;
	}
	get AvgLever() {
		return this.avgLever;
	}
	get Fee() {
		return this.fee;
	}
	get GainLose() {
		return this.gainlose;
	}
	get Items() {
		return this.items;
	}
	setTitle(t:titleT[]) {
		const f = t.find((itm) => itm.id === this.key);
		this.title = f ? f.Title : 'none';
		// console.log('itemT:', this.key, f, this.title);
	}
	add(ll:LedgerLever, key:number) {
		if (key !== this.Key) return;
		const itemType = ll.ItemType > 0 ? 1 : 0;
		this.items[itemType].add(ll);
		this.fee += (ll.BuyFee + ll.SellFee);
	}
	reCal() {
		this.amount = 0;
		this.leverAmount = 0;
		this.records = 0;
		this.avgLever = 0;
		this.gainlose = 0;
		this.items.forEach((itm) => {
			this.records += itm.Records;
			this.amount += itm.Amount;
			this.leverAmount += itm.LeverAmount;
			this.gainlose += itm.GainLose;
		});
		if (this.amount > 0) {
			this.avgLever = this.leverAmount / this.amount;
		}
	}
}
