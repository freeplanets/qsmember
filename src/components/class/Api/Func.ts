import { CryptoOpParams, MemberCLevel, PartialCryptoItems } from '../../../components/if/dbif';
import { KeyVal, WebParams } from '../../../layouts/data/if';
import AForAll from './AForAll';
import DateFunc from '../../Functions/MyDate';

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
	getAskList(sdate:string, itemid?:number) {
    const TableName = 'AskTable';
    const Fields = ['id', 'UserID', 'ItemID', 'AskType', 'BuyType', 'Qty', 'Price', 'Amount',
        'Fee', 'AskFee', 'AskPrice', 'LeverCredit', 'ExtCredit', 'Lever',
        'CreateTime'];
		const Filter:KeyVal[] = [];
		Filter.push(DateFunc.createDbDateFilter(sdate, 'CreateTime', true));
		if (itemid) {
			Filter.push({ Key: 'ItemID', Val: itemid });
		}
		if (this.User.Types === 1 || this.User.Types === 2) {
				Filter.push({ Key: 'UpId', Val: this.User.id });
		}
		return this.getTableData(TableName, Filter, Fields);
	}
	getLedgerLever(sdate:string) {
		const TableName = 'LedgerLever';
		const Filter:KeyVal[] = [];
		Filter.push(DateFunc.createDateFilter(sdate, 'SellTime'));
		if (this.User.Types === 1 || this.User.Types === 2) {
			Filter.push({ Key: 'UpId', Val: this.User.id });
		}
		return this.getTableData(TableName, Filter);
	}
	getTitle(tableName:string, ids:number[], fieldAsTitle:string) {
		if (fieldAsTitle !== 'Title') fieldAsTitle = `${fieldAsTitle} Title`;
		const fields = [
			'id',
			fieldAsTitle,
		];
		const filter:KeyVal = {
			Key: 'id',
			Val: `${ids.join(',')}`,
			Cond: 'in',
		};
		return this.getTableData(tableName, filter, fields);
	}
}
