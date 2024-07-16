import LStore from '../../../layouts/data/LayoutStoreModule';
import { LedgerLever, ReportTotal } from '../../if/dbif';
import { ErrCode } from '../../if/ENum';
import { Msg } from '../../../layouts/data/if';
import ApiFunc from '../Api/Func';
import AItemReport from './AItemReport';

export default class ItemTot implements ReportTotal {
	// private list:ItemTotal[]=[];
	// private isLedger=false;
	// private titles:titleT[] = [];
	// private total!:ItemTotal;
	// private LS:LStore;
	private data:LedgerLever[]=[];
	private api:ApiFunc;
	constructor(ls:LStore) {
		// this.LS = ls;
		this.api = new ApiFunc(ls);
	}
	async getItemReport(sdate:string):Promise<void> {
		// this.isLedger = isLedger;
		// this.list = [];
		// this.total = new ItemT(0);
		this.data = [];
		const msg:Msg = await this.api.getLedgerLever(sdate);
		if (msg.ErrNo === ErrCode.PASS) {
			// console.log('getItemReport data', msg.data);
			if (msg.data) {
				this.data = msg.data;
				/*
				const lt = msg.data as LedgerLever[];
				lt.forEach((itm) => {
					this.add(itm);
				});
				const keys:number[] = [];
				this.list.forEach((itm) => {
					itm.reCal();
					keys.push(itm.Key);
				});
				if (keys.length > 0) {
					const tt = await this.getTitle(keys);
					if (tt.ErrNo === ErrCode.PASS) {
						this.list.forEach((itm) => {
							itm.setTitle(tt.data as titleT[]);
						});
					}
				}
				*/
			}
		}
		// return this.list;
	}
	async getReport(ItmRpt:AItemReport) {
		if (this.data.length > 0) {
			await ItmRpt.Add(this.data);
		}
	}
	/*
	add(itm:LedgerLever) {
		this.total.add(itm, 0); // for total line calculate
		let key = itm.UpId;
		if (this.isLedger) {
			key = itm.ItemID;
		}
		const f = this.list.find((l) => l.Key === key);
		if (!f) {
			this.list.push(new ItemT(key));
		}
		this.list.forEach((itmT) => {
			itmT.add(itm, key);
		});
	}
	get List() {
		return this.list;
	}
	get Total() {
		return this.total;
	}
	*/
	/*
	getItemTitle(id:number) {
		const f = this.titles.find((itm) => itm.id === id);
		return f ? f.Title : 'none';
	}
	*/
	getTitle(keys:number[], isLedger = false) {
		let TableName = 'User';
		let Field = 'Account';
		if (isLedger) {
			TableName = 'Items';
			Field = 'isLoan,Title';
		}
		return this.api.getTitle(TableName, keys, Field);
		// const params = this.getParams(keys);
		// return this.LS.ax.getApi('cc/GetData', params);
	}
	/*
	private getParams(keys:number[]) {

	}
	*/
}
