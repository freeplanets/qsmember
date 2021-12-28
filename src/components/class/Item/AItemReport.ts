import ItemT from './ItemT';
import { LedgerLever, ItemTotal } from '../../../components/if/dbif';

export default abstract class AItemReport {
	protected list:ItemTotal[]=[];
	private isledger=false;
		// private titles:titleT[] = [];
	protected total:ItemTotal = new ItemT(0);
	constructor(isledger = false) {
		this.isledger = isledger;
	}
	get List() {
		return this.list;
	}
	get isLedger() {
		return this.isledger;
	}
	get Total() {
		return this.total;
	}
	abstract Add(ll:LedgerLever[]):Promise<void>;
	abstract getReport(sdate?:string):Promise<void>;
}
