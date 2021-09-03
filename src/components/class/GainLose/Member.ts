import { MemberGainLoseData } from 'src/components/if/dbif';

export default class Member {
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
		return this.data.Total;
	}
	get LeverTotal() {
		return this.data.LeverTotal;
	}
	get LeverAvgRate() {
		const tmp = ((this.data.Total / this.data.LeverTotal) * 100);
		return tmp;
	}
	get GainLose() {
		return this.data.GainLose;
	}
	get GainLoseRate() {
		return ((this.data.GainLose / this.data.Total) * 100);
	}
	get GainLoseLeverRate() {
		return ((this.data.GainLose / this.data.LeverTotal) * 100);
	}
}
