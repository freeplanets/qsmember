import LStore from '../../layouts/data/LayoutStoreModule';
import { ItemTotal, LedgerLever} from '../if/dbif';
import { ErrCode } from '../if/ENum';
import { WebParams, Msg, KeyVal } from '../../layouts/data/if';
import ItemT from './ItemT';

export default class ItemTot {
	private list:ItemTotal[]=[];
	constructor(private LS:LStore){}
	async getItemReport(filter: KeyVal | KeyVal[]){
		const params:WebParams = { ...this.LS.Param };
		params.TableName = 'LedgerLever';
		params.Filter = filter;
		const msg:Msg = await this.LS.ax.getApi('cc/GetData',params);
		if ( msg.ErrNo === ErrCode.PASS ) {
			if(msg.data) {
				const lt = msg.data as LedgerLever[];
				lt.forEach((itm)=>{
					this.add(itm);
				});
				this.list.forEach((itm)=>{
					itm.reCal();
				})
			}
		}
	}
	add(itm:LedgerLever) {
		const f = this.list.find(l=>l.UpId === itm.UpId);
		if(!f) {
			this.list.push(new ItemT(itm.UpId));
		}
		this.list.forEach((itmT)=>{
			itmT.add(itm);
		})
	}
	get List() {
		return this.list;
	}
}