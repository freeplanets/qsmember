import LStore from '../../../layouts/data/LayoutStoreModule';
import { ItemTotal, LedgerLever } from '../../if/dbif';
import { ErrCode } from '../../if/ENum';
import { Msg } from '../../../layouts/data/if';
import ItemT, { titleT } from './ItemT';
import ApiFunc from '../Api/Func';

export default class ItemTot {
	private list:ItemTotal[]=[];
	private isLedger=false;
	private titles:titleT[] = [];
	// private LS:LStore;
	private api:ApiFunc;
	constructor(ls:LStore) {
		// this.LS = ls;
		this.api = new ApiFunc(ls);
	}
	async getItemReport(sdate:string, isLedger:boolean):Promise<ItemTotal[]> {
		this.isLedger = isLedger;
		this.list = [];
		const msg:Msg = await this.api.getLedgerLever(sdate);
		if (msg.ErrNo === ErrCode.PASS) {
			// console.log('getItemReport data', msg.data);
			if (msg.data) {
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
			}
		}
		return this.list;
	}
	add(itm:LedgerLever) {
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
	getItemTitle(id:number) {
		const f = this.titles.find((itm) => itm.id === id);
		return f ? f.Title : 'none';
	}
	private getTitle(keys:number[]) {
		let TableName = 'User';
		let Field = 'Account';
		if (this.isLedger) {
			TableName = 'Items';
			Field = 'Title';
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
