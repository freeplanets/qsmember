import { KeyVal } from '../../layouts/data/if';
// import LStore from '../../store/LayoutStoreModule';

class MyDate {
	// private User = LStore.UserInfo;
	private dOpt:Intl.DateTimeFormatOptions = {
    hour12: false,
		year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    // timeZone: 'Asia/Taipei', 
  }
	public toDbDateString(time?: string | number, lang = 'zh-TW') {
		const d = this.getDate(time);
		const ds = typeof time === 'string' ? time.split(' ') : [];
		const opt = { ...this.dOpt };
		delete opt.hour;
		delete opt.minute;
		delete opt.second;
		const tmpD = d.toLocaleDateString(lang, opt).replace(/\//g, '-');
		console.log('this.toDbDateString:', tmpD);
		return ds[1] ? `${tmpD} ${ds[1]}` : tmpD;
	}
	toLocalString(time?:string | number, lang = 'zh-TW', opt?:Intl.DateTimeFormatOptions) {
		const d = this.getDate(time);
		if (!opt) opt = this.dOpt;
		return this.replaceTimeHour24(d.toLocaleString(lang, opt));
	}
	toLocalStringNoYear(time?:string | number, lang = 'zh-TW', opt?:Intl.DateTimeFormatOptions) {
		const d = this.getDate(time);
		if (!opt) opt = this.dOpt;
		delete opt.year;
		return this.replaceTimeHour24(d.toLocaleString(lang, opt));
	}
	public dayDiff(d: number): string {
		const ts = this.dayDiffTS(d);
		return this.getDate(ts).toLocaleDateString();
	}
	public dayDiffTS(d: number): number {
		const dt = this.getDate();
		const dts = dt.getTime();
		const ts = dts - d * 60 * 60 * 24 * 1000;
		return ts;
	}
	howMinutesAgo(time:string | number) {
		const curTime = new Date().getTime();
		const chkTime = this.getDate(time).getTime();
		return Math.floor((curTime - chkTime) / 1000 / 60);
	}
	createDateFilter(v:string, key?:string, inMiniSec = false):KeyVal {
		const dates = v.split('-');
		const d1 = dates[0];
		const d2 = `${dates[1] ? dates[1] : dates[0]} 23:59:59.999`;
		let Val = this.getTime(d1);
		let Val2 = this.getTime(d2);
		if (inMiniSec) {
			Val = Math.floor(Val / 1000);
			Val2 = Math.ceil(Val2 / 1000);
		}
		const keyV:KeyVal = {
			Key: `${key || 'ModifyTime'}`,
			Val,
			Val2,
			Cond: 'between',
		};
		return keyV;
	}
	createDbDateFilter(v:string, key = 'SDate') {
		const keyV = this.getDateFilter(v, key);
		keyV.Val = this.toDbDateString(keyV.Val);
		keyV.Val2 = this.toDbDateString(keyV.Val2);
		return keyV;
	}
	private getDateFilter(v:string, key = 'SDate') {
		const dates = v.split('-');
		const keyV:KeyVal = {
			Key: key,
			Val: dates[0],
		};
		if (dates[1]) {
			keyV.Val2 = dates[1];
		} else {
			keyV.Val2 = dates[0];
		}
		const fIdx = keyV.Val2.indexOf(':');
		keyV.Val2 = fIdx > -1 ? keyV.Val2 : `${keyV.Val2} 24:00:00`;
		keyV.Cond = 'between';
		return keyV;
	}
	createTSDateFilter(v:string, key = 'SDate') {
		const keyV = this.getDateFilter(v, key);
		keyV.Val = this.getDate(keyV.Val).getTime();
		keyV.Val2 = this.getDate(keyV.Val2).getTime();
		return keyV;
	}
	getTime(time?:string) {
		return this.getDate(time).getTime();
	}
	private getDate(time?:string | number) {
		if (!time) return new Date();
		if (typeof time !== 'number') {
			time = Date.parse(time);
		}
		return new Date(time);
	}
	private replaceTimeHour24(str:string) {
		return str.replace(' 24:', ' 00:');
	}
}
export default new MyDate();
