import { ErrCode } from 'src/components/if/ENum';
import { CryptoOpParams, MemberCLevel, PartialCryptoItems, EmergencyCloseData } from '../../../components/if/dbif';
import { HasID, KeyVal, WebParams, HasModifyID } from '../../../layouts/data/if';
import AForAll from './AForAll';
import DateFunc from '../../Functions/MyDate';

export default class Func extends AForAll {
	getSettleMark(ItemID?:number) {
		const Fields = ['id', 'AskID', 'ItemID', 'MarkTS'];
		const Filter:KeyVal = { ModifyID: 0 };
		if (ItemID) Filter.ItemID = ItemID;
		return this.getTableData('MemberSettleMark', Filter, Fields);
	}
	getSettleMarkByAskID(askids:number[]) {
		const Fields = ['AskID', 'ItemID', 'MarkTS'];
		const Filter:KeyVal[] = [{
				Key: 'ModifyID',
				Val: 0,
				Cond: '>',
			},
			{
				Key: 'AskID',
				Val: `${askids.join(',')}`,
				Cond: 'in',
			},
		];
		return this.getTableData('MemberSettleMark', Filter, Fields);
	}
	getMemberIdByNickname(Nickname:string) {
		const Tablename = 'Member';
		const Filter:KeyVal = {
			Key: 'Nickname',
			Val: Nickname,
			// Cond: 'like',
		};
		const Fields = 'id,Nickname';
		return this.getTableData(Tablename, Filter, Fields);
	}
	async getMemberIDFilter(Nickname:string):Promise<KeyVal | undefined> {
		const msg = await this.getMemberIdByNickname(Nickname);
		if (msg.ErrNo === ErrCode.PASS) {
			if (msg.data && msg.data.length > 0) {
				const dta = msg.data as HasID[];
				const ids = dta.map((usr) => usr.id);
				return {
					Key: 'UserID',
					Val: ids.join(','),
					Cond: 'in',
				};
			}
		}
		return undefined;
	}
	getMemberNameByID(id:number|number[]) {
		const filter:KeyVal = {
			Key: 'id',
			Val: Array.isArray(id) ? id.join(',') : id,
			Cond: 'in',
		};
		const fields = ['id', 'Nickname', 'UpId'];
		return this.getTableData('Member', filter, fields);
	}
	getUserNameById(id:number|number[]) {
		const filter:KeyVal = {
			Key: 'id',
			Val: Array.isArray(id) ? id.join(',') : id,
			Cond: 'in',
		};
		const fields = ['id', 'Account'];
		return this.getTableData('User', filter, fields);
	}
	getMemberSiteNameByUpId(upid:number|number[]) {
		const filter:KeyVal = {
			Key: 'id',
			Val: Array.isArray(upid) ? upid.join(',') : upid,
			Cond: 'in',
		};
		const fields = ['id', 'SiteName'];
		return this.getTableData('User', filter, fields);
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
	getItemNameById(ids: number | number[]) {
		const filter:KeyVal = {
			Key: 'id',
			Val: Array.isArray(ids) ? ids.join(',') : ids,
			Cond: 'in',
		};
		const fields = ['id', 'Title'];
		return this.getTableData('Items', filter, fields);
	}
	getInProcessAsks(UpId?:number) {
		let filter = 'ProcStatus<2';
		if (UpId) {
			filter = `${filter} and UpId = ${UpId}`;
		}
		return this.getTableData('AskTable', filter);
	}
	async getEmergencyLog() {
		const msg = await this.getTableData('EmergencyClose', { ItemID: 0 });
		if (msg.ErrNo === ErrCode.PASS) {
			let data = msg.data as HasModifyID[];
			const uids:number[] = [];
			data.map((itm) => {
				const f = uids.find((u) => u === itm.ModifyID);
				if (!f) uids.push(itm.ModifyID);
			});
			// console.log('uids length', uids);
			if (uids.length > 0) {
				const msguser = await this.getUserNameById(uids);
				if (msguser.ErrNo === ErrCode.PASS) {
					const users = msguser.data as HasID[];
					data = data.map((itm) => {
						const f = users.find((u) => u.id === itm.ModifyID);
						if (f) {
							// console.log('find', f);
							itm.Modifier = f.Account;
						}
						return itm;
					});
					// console.log('after find user', data);
					msg.data = data;
				}
			}
			/*
			const itmids:number[] = [];
			data.map((itm) => {
				const f = itmids.find((id) => id === itm.ItemID);
				if (!f) itmids.push(itm.ItemID);
			});
			if (itmids.length > 0) {
				const itmmsg = await this.getLoanItem();
				if (itmmsg.ErrNo === ErrCode.PASS) {
					const itmdta = itmmsg.data as HasID[];
					data = data.map((itm) => {
						const f = itmdta.find((u) => u.id === itm.ModifyID);
						if (f) {
							console.log('find', f);
							itm.Item = f.Title;
						}
						return itm;
					});
				}
			}
			*/
		}
		return msg;
	}
	async setEmergencyClose(data:PartialCryptoItems | PartialCryptoItems[], isEmergencyClose = 0) {
		const params:WebParams = { ...this.dfParam };
		params.TableName = 'Items';
		if (isEmergencyClose) {
			params.EC = 1;
		}
		const msg = await this.setTableData<PartialCryptoItems>(params, data);
		if (msg.ErrNo === ErrCode.PASS) {
			params.TableName = 'EmergencyClose';
			let ItemID = 0;
			let Closed = 0;
			if (!Array.isArray(data)) {
				ItemID = data.id;
				Closed = data.Closed ? data.Closed : 0;
			}
			const mdata:EmergencyCloseData = {
				id: 0,
				sw: isEmergencyClose,
				ModifyID: this.dfParam.UserID,
				ItemID,
				Closed,
			};
			return this.setTableData<EmergencyCloseData>(params, mdata);
		}
		return msg;
	}
	getPriceTick(code:string, DealTime: number) {
		const gapMS = 3000;
		const filter: KeyVal[] = [];
		filter.push({ Key: 'code', Val: code });
		filter.push({ Key: 'ticktime', Val: DealTime - gapMS, Val2: DealTime + gapMS, Cond: 'BETWEEN' });
		// console.log('filter', filter);
		return this.getTableData('PriceTick', filter);
	}
	private getAskChkFilter(sdate:string, type = 'Buy'):string {
		// const Filter = filter.map((itm) => itm);
		if (sdate) {
			// Filter.push(DateFunc.createDbDateFilter(sdate, 'CreateTime'));
			let filter:KeyVal;
			if (type === 'Buy') {
				filter = DateFunc.createDbDateFilter(sdate, 'CreateTime');
				return `${filter.Key} ${filter.Cond} '${filter.Val}' and '${filter.Val2}'`;
			}
			filter = DateFunc.createTSDateFilter(sdate, 'DealTime');
			return `${filter.Key} ${filter.Cond} ${filter.Val} and ${filter.Val2}`;
		}
		return '';
		// console.log('getAskChkBuy', Filter);
		// return this.getTableData(TableName, Filter, Fields);
	}
	// private async getAskChkSell(sdate:string, filter:KeyVal[], TableName:string, Fields:string[]) {
	private async getAskChkSell(sdate:string, filter:KeyVal[], TableName:string, Fields:string[]) {
		const Filter = filter.map((itm) => itm);
		Filter.push(DateFunc.createTSDateFilter(sdate, 'DealTime'));
		console.log('getAskChkSell', Filter);
		return this.getTableData(TableName, Filter, Fields);
	}
	async getAskList(sdate:string, BetID?:string, itemid?:number, Nickname?:string) {
		/*
    const TableName = 'AskTable';
    const Fields = ['id', 'UserID', 'ItemID', 'AskType', 'BuyType', 'ItemType', 'Code', 'Qty', 'Price', 'Amount',
        'Fee', 'AskFee', 'AskPrice', 'LeverCredit', 'ExtCredit', 'Lever', 'SetID', 'USetID', 'ProcStatus',
        'CreateTime', 'DealTime', 'isUserSettle'];
		*/
		const Filter:string[] = [];
		if (BetID) {
			const ids = BetID.split(',').map((v) => parseInt(v, 10));
			// Filter.push({ Key: 'id', Val: ids.join(','), Cond: 'in' });
			if (ids.length > 1) {
				Filter.push(`A.id in (${ids.join(',')})`);
			} else {
				Filter.push(`A.id = ${ids[0]}`);
			}
		}
		if (itemid) {
			Filter.push(`A.ItemID = ${itemid}`);
		}
		if (this.User.Types === 1 || this.User.Types === 2) {
				Filter.push(`UpId = ${this.User.id}`);
		}
		if (Nickname) {
			const filter = await this.getMemberIDFilter(Nickname);
			if (filter) {
				Filter.push(`${filter.Key} ${filter.Cond} (${filter.Val})`);
			}
		}
		const buyF = this.getAskChkFilter(sdate, 'Buy');
		const sellF = this.getAskChkFilter(sdate, 'Sell');
		const bsF = `${buyF} or ${sellF}`;
		let strFilter = `${Filter ? Filter.join(' and ') : ''}`;
		if (strFilter) strFilter += ` and ( ${bsF} )`;
		else strFilter = bsF;
		console.log('filter:', strFilter);
		// return this.getTableData(TableName, strFilter, Fields);
		return this.getOrderList(strFilter);
	}
	async getLedgerLever(sdate:string, BetID?:string, itemid?:number, Nickname?:string) {
		const TableName = 'LedgerLever';
		const Filter:KeyVal[] = [];
		if (sdate) Filter.push(DateFunc.createDateFilter(sdate, 'SellTime'));
		if (BetID) {
			const ids = BetID.split(',').map((v) => parseInt(v, 10));
			Filter.push({ Key: 'id', Val: ids.join(','), Cond: 'in' });
		}
		if (this.User.Types === 1 || this.User.Types === 2) {
			Filter.push({ Key: 'UpId', Val: this.User.id });
		}
		Filter.push({ Key: 'SellID', Val: 0, Cond: '>' });
		if (itemid) {
			Filter.push({ Key: 'ItemID', Val: itemid });
		}
		if (Nickname) {
			const filter = await this.getMemberIDFilter(Nickname);
			if (filter) {
				Filter.push(filter);
			}
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
	saveGameOrder(dta:HasID[]) {
		return this.setTableData('Games', dta);
	}
}
