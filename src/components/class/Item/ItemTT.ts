import { ItemTypeTotal, LedgerLever } from '../../if/dbif';

export default class ItemTT implements ItemTypeTotal {
	private list:LedgerLever[] = [];
	private amount = 0;
	private leverAmount = 0;
	private gainlose = 0;
	get Records() {
		// return this.data.Records;
		return this.list.length;
	}
	get Amount() {
		return this.amount;
	}
	get LeverAmount() {
		return this.leverAmount;
	}
	get AvgLever() {
		let avgl = 0;
		if (this.amount > 0) avgl = this.leverAmount / this.amount;
		return avgl;
	}
	get GainLose() {
		return this.gainlose;
	}
	add(ll:LedgerLever) {
		const amount = ll.BuyPrice * ll.Qty;
		this.amount += amount;
		this.leverAmount += amount * ll.Lever;
		this.gainlose += ll.GainLose;
		this.list.push(ll);
	}
}
