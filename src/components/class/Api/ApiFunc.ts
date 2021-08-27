import { AxApi } from 'src/layouts/components/AxApi';
import { WebParams, KeyVal, HasID } from '../../../layouts/data/if';
// import { ErrCode } from '../if/ENum';
import LayoutStoreModule from '../../../layouts/data/LayoutStoreModule';

export default class ApiFunc {
	private ax:AxApi;
	private dfParam:WebParams;
	constructor(store:LayoutStoreModule) {
		this.ax = store.ax;
		this.dfParam = store.Param;
	}
	getTableData(tableName:string, filters?:string| KeyVal | KeyVal[], fields?:string | string[]) {
		const params:WebParams = { ...this.dfParam };
		params.TableName = tableName;
		params.Filter = filters;
		if (fields) {
			params.Fields = fields;
		}
		return this.ax.getApi('cc/GetData', params);
	}
	setTableData<T extends HasID>(tableName:string, TableData:string | T | T[], isEmergencyClose:number=0) {
		const params:WebParams = { ...this.dfParam };
		params.TableName = tableName;
		if(isEmergencyClose) {
			params.EC = 1;
		}
		if (typeof TableData === 'string') params.TableData = TableData;
		else params.TableData = JSON.stringify(TableData);
		return this.ax.getApi('cc/SaveData', params);
	}
}
