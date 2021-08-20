import CryptoItemOneSide from './CrpytoItemOneSide';
import { ObjectIdentify, CryptoItem, ReceiveData } from '../../if/dbif';

export default class CryptoItemRisk {
	public static indetify:ObjectIdentify = {};
	public Long:CryptoItemOneSide;
	public Short:CryptoItemOneSide;
	private curPrice = 0;
	constructor(private item:CryptoItem) {
		CryptoItemRisk.indetify[`${item.id}`] = true;
		this.Long = new CryptoItemOneSide(item.id, 1);
		this.Short = new CryptoItemOneSide(item.id, -1);
	}
	get Code() {
		return this.item.Code;
	}
	get Price() {
		return this.curPrice;
	}
	AcceptPrice(data:ReceiveData) {
		if (data.symbol !== this.Code) return;
		this.curPrice = parseFloat(data.currentClose);
		this.Long.acceptPrice(this.curPrice);
		this.Short.acceptPrice(this.curPrice);
	}
}
