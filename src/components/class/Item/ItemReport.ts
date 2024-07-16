import { LedgerLever, ReportTotal } from '../../../components/if/dbif';
import { ErrCode } from '../../../components/if/ENum';
import AItemReport from './AItemReport';
import ItemT, { titleT } from './ItemT';

export default class ItemReport extends AItemReport {
	constructor(private rt:ReportTotal, private key:number, private subT:string[], isledger = false) {
		super(isledger);
	}
	async getReport(sdate?: string): Promise<void> {
			if (sdate) {
				await this.rt.getItemReport(sdate);
			}
			await this.rt.getReport(this);
	}
	async Add(itms:LedgerLever[]) {
		itms.forEach((itm) => {
			this.addOne(itm);
		});
		const keys:number[] = [];
		this.list.forEach((itm) => {
			itm.reCal();
			keys.push(itm.Key);
		});
		if (keys.length > 0) {
			const tt = await this.rt.getTitle(keys, this.isLedger);
			if (tt.ErrNo === ErrCode.PASS) {
				this.list.forEach((itm) => {
					itm.setTitle(tt.data as titleT[], this.subT);
				});
			}
		}
	}
	addOne(itm:LedgerLever) {
		if (this.key) {
			if (this.isLedger && this.key !== itm.UpId) return;
			if (!this.isLedger && this.key !== itm.ItemID) return;
		}
		// if (this.upid && itm.UpId !== this.upid) return;
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
}
