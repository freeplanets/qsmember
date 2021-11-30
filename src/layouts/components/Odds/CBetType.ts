import { BetType, Num, NumSortData, CGame, SortFunc, RiskGroup, RickF } from './Games';

const SortByNum:SortFunc = (a, b) => a.num - b.num;
const SortByTols:SortFunc = (a, b) => b.tolS - a.tolS;
const SortByRisk:SortFunc = (a, b) => a.Risk - b.Risk;

export default class CBetType implements BetType {
	private total = 0;
	private payouts = 0;
	private num:Num = {};
	private pos:NumSortData[] = [];
	private sortid = 0;
	private tmpTotal = 0;
	private sortable = false;
	private maxWin = 0;
	private SortType: SortFunc[] = [SortByNum, SortByTols, SortByRisk];
	private bt:string;
	private game:CGame;
	private riskG:RiskGroup[];
	constructor(bt:string, game:CGame, riskG:RiskGroup[]) {
		this.bt = bt;
		this.game = game;
		this.riskG = riskG;
	}
	initData(BTItm:Num) {
		this.tmpTotal = this.total;
		Object.keys(BTItm).map((num:any, idx:any) => {
			// if (chk45) {
					// const nt:NTemp = this.getNTemp(BTItm,bt,num);
					// TNT.push(nt);
			// }
			const nsd:NumSortData = {
					num: parseInt(num, 10),
					tolS: BTItm[num].tolS,
					Risk: 0,
			};
			this.pos[idx] = nsd;
			this.num[num] = BTItm[num];
			this.num[num].pos = idx;
			this.num[num].Num = parseInt(num, 10);
			this.num[num].BT = parseInt(this.bt, 10);
			this.total += BTItm[num].tolS;
			this.payouts += BTItm[num].tolP;
			// this.func = SortF;
			if (BTItm[num].OID > this.game.MaxOddsID) {
					this.game.setOddsID(BTItm[num].OID);
			}
		});
		this.calRisk();
		this.game.ModifyTotal(this.total - this.tmpTotal);
	}
	Add(BTItm:Num) {
		this.tmpTotal = this.total;
		Object.keys(BTItm).map((num:any) => {
			// if (chk45) {
					// const nt:NTemp = this.getNTemp(BTItm,bt,num);
					// TNT.push(nt);
			// }
			if (this.num[num]) {
					this.total -= this.num[num].tolS;
					this.payouts -= this.num[num].tolP;
			}
			// dta[bt][num].PerStep=this.num[num].PerStep;
			// dta[bt][num].Steps=this.num[num].Steps;
			
			// const pos=this.num[num].pos;
			this.num[num] = BTItm[num];
			this.num[num].Num = parseInt(num, 10);
			this.num[num].BT = parseInt(this.bt, 10);
			// this.num[num].pos = pos;
			const f = this.pos.find((m) => m.num === parseInt(num, 10));
			if (f) {
					f.tolS = BTItm[num].tolS;
			}
			// this.num[num]=Object.assign(this.num[num],dta[bt][num])
			// console.log('game updateData',this.num[num])
			if (BTItm[num].OID > this.game.MaxOddsID) {
					this.game.setOddsID(BTItm[num].OID);
			}
			this.total += this.num[num].tolS;
			this.payouts += this.num[num].tolP;
		});
		this.calRisk();
		this.game.ModifyTotal(this.total - this.tmpTotal);
	}
	get Total() {
		return this.total;
	}
	get Payouts() {
		return this.payouts;
	}
	get member() {
		return this.num;
	}
	getPos(pos:number) {
		// console.log('getPos', pos, this.pos);
		return this.pos[pos];
	}
	get MaxWin() {
		return this.maxWin;
	}
	setSortTable(b:boolean) {
		this.sortable = b;
	}
	Sort(sortid:number) {
		if (this.sortable) {
			// if(BT==='1') console.log(`setSortType: ${BT}, ${this.SortID}, ${sortid}`);
			if (this.sortid !== sortid) {
					this.sortid = sortid;
					this.pos.sort(this.SortType[sortid]);
					// if(BT==='1') console.log('Sort:',sortid,this.member[BT].Pos);
			}
		}
	}
  // 單號風險
	calBigestRiskOne() {
		// console.log('calBigestRiskOne',BT);
		let MaxWin = 0;
		Object.keys(this.num).map((key) => {
				// const B = this.member[BT];
				const M = this.num[key];
				const Risk = this.Total - M.tolP;
				this.num[key].Risk = Math.round(Risk);
				this.setRiskToPos(parseInt(key, 10), Risk);
				if (MaxWin > Risk) MaxWin = Risk;
		});
		this.maxWin = MaxWin;
	}
	// 多號風險計算, N 開出獎碼數, T 總號碼數 
	calBigestRiskMT(N = 0, T = 0) {
			// console.log('calBigestRiskMT',BT);
		if (N === 0 || T === 0) return;
		const otherNums = N - 1;
		const leftNums = T - 1;
		// const len:number=Object.keys(this.num).length;
		Object.keys(this.num).map((key) => {
				// const B = this.member[BT];
				const M = this.num[key];
				const Risk = this.Total - M.tolP - (this.payouts - M.tolP) * (otherNums / leftNums);
				this.num[key].Risk = Math.round(Risk);
				this.setRiskToPos(parseInt(key, 10), Risk);
		});
		/*
		for(var i=0;i<len;i+=1){
			if(this.Datas[i].Num == null ) continue;
			this.Datas[i].Risk=this.LRTotal-((this.Datas[i].RPay+this.Datas[i].SPay+this.Datas[i].RLeft)+((this.TotalRPay+this.TotalSPay+this.LRTotal)-(this.Datas[i].RPay+this.Datas[i].SPay+this.Datas[i].RLeft))*otherNums/leftNums)-this.CTotal+this.SCTotal;
		}
		*/
	}
	private setRiskToPos(num:number, Risk:number) {
			const f = this.pos.find((m) => m.num === num);
			if (f) {
					f.Risk = Risk;
			}
	}
	private calRisk() {
		const rg = this.getRiskFunc();
		if (rg && rg.func) {
			switch (rg.func) {
				case RickF.OpenOne:
					this.calBigestRiskOne();
					break;
				case RickF.OpenMulti:
					this.calBigestRiskMT(rg.OpenNum, rg.TotalNum);
					break;
				default:
			}
			if (this.sortid !== 0) {
				this.Sort(this.sortid);
			}
		}
	}
	private getRiskFunc():RiskGroup|undefined {
		const BT = parseInt(this.bt, 10);
		return this.riskG.find((itm) => itm.member.find((bt) => bt === BT));
	}
}
