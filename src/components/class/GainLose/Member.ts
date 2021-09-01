import { MemberGainLoseData, DataObject } from 'src/components/if/dbif';

export default class Member implements DataObject {
	private data:MemberGainLoseData;
	constructor(data:MemberGainLoseData) {
		this.data = data;
	}
	get id() {
		return this.data.UserID;
	}
	get Nickname() {
		return this.data.Nickname;
	}
	get CLevel() {
		return this.data.CLevel;
	}
	set CLevel(v:string) {
		this.data.CLevel = v;
	}
	get Total() {
		return this.data.Total.toFixed(2);
	}
	get LeverTotal() {
		return this.data.LeverTotal.toFixed(2);
	}
	get LeverAvgRate() {
		const tmp = ((this.data.Total / this.data.LeverTotal) * 100).toFixed(2);
		return tmp;
	}
	get GainLose() {
		return this.data.GainLose.toFixed(2);
	}
	get GainLoseRate() {
		return ((this.data.GainLose / this.data.Total) * 100).toFixed(2);
	}
	get GainLoseLeverRate() {
		return ((this.data.GainLose / this.data.LeverTotal) * 100).toFixed(2);
	}
}
