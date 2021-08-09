import { CryptoOpParams, CryptoRules } from '../if/dbif';
import { OpTypes } from '../if/ENum';

export default class CryptoParams {
	private data:CryptoOpParams;
	private defaultRuleKey = ['OneHand', 'FullStorage', 'LeverLimit', 'ShortTerm1', 'ShortTerm2', 'ShortTermFee'];
	private ischanged = false;
	constructor(private itemID:number, data?:CryptoOpParams) {
		if(!data){
			this.data = this.createData();
		} else {
			this.data = this.confirmData(data);
		}
	}
	get id():number {
		return this.data.id;
	}
	get OpType():OpTypes {
		return this.data.OpType;
	}
	set OpType(v:OpTypes) {
		this.data.OpType = v;
		this.ischanged = true;
	}
	get ItemID():number {
		return this.data.ItemID;
	}
	get isActive():boolean {
		return !!this.data.isActive;
	}
	set isActive(v:boolean) {
		this.data.isActive = v ? 1 : 0;
		this.ischanged = true;
	}
	Rules(name:string, v?:number):number {
		let ans = 0;
		if(v) {
			this.data.Rules[name] = v;
			this.ischanged = true;
			ans = v;	
		} else {
			if(this.data.Rules[name]) ans = this.data.Rules[name];
		}
		return ans;
	}
	get ModifyID():number {
		return this.data.ModifyID;
	}
	set ModifyID(v:number) {
		this.data.ModifyID = v;
	}
	get Data() {
		if(typeof(this.data.Rules) !== 'string') {
			this.data.Rules = JSON.stringify(this.data.Rules);
		}
		return this.data;
	}
	getRulesKey():string[] {
		let keys:string[] = []
		try {
			keys = Object.keys(this.data.Rules);
			if(keys.length===0) keys = this.defaultRuleKey
		} catch(err) {
			console.log('CryptoOpParams getRuleskey error:', err);
			keys = this.defaultRuleKey;
		}
		return keys;
	}
	get isChanged() {
		return this.ischanged;
	}
	private confirmData(data:CryptoOpParams) {
		if(typeof data.Rules === 'string') {
			data.Rules = this.JsonParse(data.Rules) as CryptoRules;
		}
		return data;
	}
	private createData() {
		const rule:CryptoRules = {
			OneHand: 0,
			FullStorage: 0,
			LeverLimit: 0,
			ShortTerm1: 0,
			ShortTerm2: 0,
			ShortTermFee: 0,
		}
		const data:CryptoOpParams = {
			id: 0,
			ItemID: this.itemID,
			OpType: OpTypes.NONE,
			isActive: 0,
			Rules: rule,
			ModifyID: 0,
		}
		return data;
	}
	private JsonParse(str:string) {
		try {
			const ans = JSON.parse(str);
			return ans;
		} catch(err) {
			console.log('CryptoOpParams JSON parse error:', err);
			return str;
		}
	}
}