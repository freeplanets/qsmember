import { ErrCode } from 'src/components/if/ENum';
import { CryptoOpParams, MemberCLevel, PartialCryptoItems } from '../../../components/if/dbif';
import { HasID, KeyVal, WebParams } from '../../../layouts/data/if';
import AForAll from './AForAll';
import DateFunc from '../../Functions/MyDate';

export default class Func extends AForAll {
	getSettleMark(ItemID?:number) {
		const Fields = ['id', 'AskID', 'ItemID', 'MarkTS'];
		const Filter:KeyVal = { ModifyID: 0 };
		if (ItemID) Filter.ItemID = ItemID;
		return this.getTableData('MemberSettleMark', Filter, Fields);
	}
	getMemberIdByNickname(Nickname:string) {
		const Tablename = 'Member';
		const Filter:KeyVal = {
			Key: 'Nickname',
			Val: Nickname,
			Cond: 'like',
		};
		const Fields = 'id,Nickname';
		return this.getTableData(Tablename, Filter, Fields);
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
	getPriceTick(code:string, DealTime: number) {
		const gapMS = 3000;
		const filter: KeyVal[] = [];
		filter.push({ Key: 'code', Val: code });
		filter.push({ Key: 'ticktime', Val: DealTime - gapMS, Val2: DealTime + gapMS, Cond: 'BETWEEN' });
		// console.log('filter', filter);
		return this.getTableData('PriceTick', filter);
	}
	async getAskList(sdate:string, itemid?:number, Nickname?:string) {
    const TableName = 'AskTable';
    const Fields = ['id', 'UserID', 'ItemID', 'AskType', 'BuyType', 'ItemType', 'Code', 'Qty', 'Price', 'Amount',
        'Fee', 'AskFee', 'AskPrice', 'LeverCredit', 'ExtCredit', 'Lever', 'SetID', 'USetID', 'ProcStatus',
        'CreateTime', 'DealTime'];
		const Filter:KeyVal[] = [];
		Filter.push(DateFunc.createDbDateFilter(sdate, 'CreateTime', true));
		if (itemid) {
			Filter.push({ Key: 'ItemID', Val: itemid });
		}
		if (this.User.Types === 1 || this.User.Types === 2) {
				Filter.push({ Key: 'UpId', Val: this.User.id });
		}
		if (Nickname) {
			const msg = await this.getMemberIdByNickname(Nickname);
			if (msg.ErrNo === ErrCode.PASS) {
				if (msg.data && msg.data.length > 0) {
					const dta = msg.data as HasID[];
					const ids = dta.map((usr) => usr.id);
					Filter.push({
						Key: 'UserID',
						Val: ids.join(','),
						Cond: 'in',
					});
				}
			}
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
