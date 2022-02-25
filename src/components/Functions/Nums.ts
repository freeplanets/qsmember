import { GameType } from '../../layouts/data/if';

class Nums {
	private VNType = [
		{ EndNum: 9999, StartNum: 0 },
		{ EndNum: 99999, StartNum: 0 },
		{ EndNum: 99999, StartNum: 0 },
		{ EndNum: 99999, StartNum: 0 }, { EndNum: 99999, StartNum: 0 },
		{ EndNum: 99999, StartNum: 0 },	{ EndNum: 99999, StartNum: 0 }, { EndNum: 99999, StartNum: 0 }, { EndNum: 99999, StartNum: 0 },
		{ EndNum: 99999, StartNum: 0 },	{ EndNum: 99999, StartNum: 0 },
		{ EndNum: 9999, StartNum: 0 }, { EndNum: 9999, StartNum: 0 }, { EndNum: 9999, StartNum: 0 }, { EndNum: 9999, StartNum: 0 },
		{ EndNum: 9999, StartNum: 0 }, { EndNum: 9999, StartNum: 0 }, { EndNum: 9999, StartNum: 0 }, { EndNum: 9999, StartNum: 0 },
		{ EndNum: 9999, StartNum: 0 }, { EndNum: 9999, StartNum: 0 },
		{ EndNum: 999, StartNum: 0 },	{ EndNum: 999, StartNum: 0 }, { EndNum: 999, StartNum: 0 },
		{ EndNum: 99, StartNum: 0 }, { EndNum: 99, StartNum: 0 }, { EndNum: 99, StartNum: 0 }, { EndNum: 99, StartNum: 0 },
	]
	Number(v:number|string) {
		if (typeof v === 'string') v = parseInt(v, 10);
		return v;
	}
	String(v:number|string) {
		if (typeof v === 'number') v = v.toString();
		return v;
	}
	isMaxTwoDigitlAfterPoint(v:number|string):boolean {
		// if (typeof v !== 'string') v = String(v);
		v = this.String(v);
		const reg = /^[0-9]+(.[0-9]{0,2})?$/;
		return reg.test(v);
	}
	isGreen(v:number):boolean {
		return v > 0;
	}
	isRed(v:number):boolean {
		return v < 0;
	}
	GenNums(GType:GameType):string[] {
		// console.log('GenNums', JSON.stringify(GType));
		if (GType.GType === 'VNNorth') return this.GenVNNums();
		const nums:string[] = [];
		while (nums.length < GType.OpenNums) {
			const tmp = this.RandNum(GType.EndNum, GType.StartNum);
			// console.log('GenNums', GType.GType, tmp);
			if (!GType.SameNum) {
				const fIdx = nums.findIndex((s) => s === tmp);
				if (fIdx === -1) nums.push(tmp);
			} else {
				nums.push(tmp);
			}
		}
		return nums;
	}
	GenVNNums():string[] {
		return this.VNType.map((itm) => this.RandNum(itm.EndNum, itm.StartNum));
	}
	private RandNum(Max:number, Min = 0) {
		const base = Max + Min + 1;
		let num = Math.floor(Math.random() * base) - Min;
		if (num > Max) num = Max;
		else if (num < Min) num = Min;
		const len = Max.toString().length;
		let str = num.toString();
		while (str.length < len) {
			str = `0${str}`;
		}
		return str;
	}
}
export default new Nums();
