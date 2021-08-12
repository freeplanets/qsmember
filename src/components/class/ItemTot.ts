import LStore from '../../layouts/data/LayoutStoreModule';
import { ItemTotal, LedgerLever } from '../if/dbif';
import { ErrCode } from '../if/ENum';
import { WebParams, Msg, KeyVal } from '../../layouts/data/if';
import ItemT, { titleT } from './ItemT';

export default class ItemTot {
	private list:ItemTotal[]=[];
	private isLedger=false;
	private titles:titleT[] = [];
	private LS:LStore;
	constructor(ls:LStore) {
		this.LS = ls;
	}
	async getItemReport(filter: KeyVal | KeyVal[], isLedger:boolean):Promise<ItemTotal[]> {
		this.isLedger = isLedger;
		const params:WebParams = { ...this.LS.Param };
		params.TableName = 'LedgerLever';
		params.Filter = filter;
		// console.log('getItemReport params:', params);
		this.list = [];
		const msg:Msg = await this.LS.ax.getApi('cc/GetData', params);
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
					// console.log('getTitle', tt);
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
		const params = this.getParams(keys);
		return this.LS.ax.getApi('cc/GetData', params);
	}
	private getParams(keys:number[]) {
		const params:WebParams = { ...this.LS.Param };
		if (this.isLedger) {
			params.TableName = 'Items';
			params.Fields = ['id', 'Title'];
		} else {
			params.TableName = 'User';
			params.Fields = ['id', 'Account Title'];
		}
		const filter:KeyVal = {
			Key: 'id',
			Val: `(${keys.join(',')})`,
			Cond: 'in',
		};
		params.Filter = filter;
		return params;
	}
}
