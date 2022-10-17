import LayoutStoreModule from '../../../layouts/data/LayoutStoreModule';
import { AxApi } from '../../../layouts/components/AxApi';
import { HasID, KeyVal, WebParams } from '../../../layouts/data/if';

export default abstract class AForAll {
	private ax:AxApi;
	protected dfParam;
	protected User;
	constructor(store:LayoutStoreModule) {
		this.ax = store.ax;
		this.dfParam = store.Param;
		this.User = store.UserInfo;
	}
	protected getOrderList(filters?:string) {
		const params:WebParams = { ...this.dfParam };
		params.Filter = filters;
		return this.ax.getApi('cc/GetOrderList', params);
	}
	protected getTableData(tableName:string, filters?:string| KeyVal | KeyVal[], fields?:string | string[]) {
		const params:WebParams = { ...this.dfParam };
		params.TableName = tableName;
		params.Filter = filters;
		if (fields) {
			params.Fields = fields;
		}
		return this.ax.getApi('cc/GetData', params);
	}
	protected setTableData<T extends HasID>(pName:string | WebParams, TableData?:string | T | T[]) {
		let params:WebParams;
		if (typeof pName === 'string') {
			params = { ...this.dfParam };
			params.TableName = pName;
		} else {
			params = pName;
		}
		if (typeof TableData === 'string') params.TableData = TableData;
		else params.TableData = JSON.stringify(TableData);
		return this.ax.getApi('cc/SaveData', params);
	}
}
