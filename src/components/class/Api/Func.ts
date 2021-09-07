import { CryptoOpParams, MemberCLevel, PartialCryptoItems } from '../../../components/if/dbif';
import { KeyVal, WebParams } from '../../../layouts/data/if';
import AForAll from './AForAll';

export default class Func extends AForAll {
	getSettleMark(ItemID?:number) {
		const Fields = ['id', 'AskID', 'ItemID', 'MarkTS'];
		const Filter:KeyVal = { ModifyID: 0 };
		if (ItemID) Filter.ItemID = ItemID;
		return this.getTableData('MemberSettleMark', Filter, Fields);
	}
	getMemberNameByID(id:number|number[]) {
		const filter:KeyVal = {
			Key: 'id',
			Val: Array.isArray(id) ? id.join(',') : id,
			Cond: 'in',
		};
		const fields = ['id', 'Nickname'];
		return this.getTableData('Member', filter, fields);
	}
	getMemberCLevel(CLevel:string) {
		const filter = { CLevel };
		const field = 'id';
		return this.getTableData('Member', filter, field);
	}
	getMemberReport(kv:KeyVal[]) {
		return this.getTableData('MemberReport', kv);
	}
	setMemberCLevel(v:MemberCLevel) {
		return this.setTableData('Member', v);
	}
	setCryptoOpParams(data:CryptoOpParams) {
		return this.setTableData('CryptoOpParams', data);
	}
	getLoanItem() {
		return this.getTableData('Items', { isLoan: 1 });
	}
	getInProcessAsks(UpId?:number) {
		let filter = 'ProcStatus<2';
		if (UpId) {
			filter = `${filter} and UpId = ${UpId}`;
		}
		return this.getTableData('AskTable', filter);
	}
	setEmergencyClose(data:PartialCryptoItems | PartialCryptoItems[], isEmergencyClose = 0) {
		const params:WebParams = { ...this.dfParam };
		params.TableName = 'Items';
		if (isEmergencyClose) {
			params.EC = 1;
		}
		return this.setTableData<PartialCryptoItems>(params, data);
	}
}
