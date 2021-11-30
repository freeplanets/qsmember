import Vue from 'vue';
import { BetHeader, SelectOptions, BetContent, NumData, AnyObject } from '../data/if';

const chkColorOther = (v:number, GType:string) => {
    const Blue = 'blue_ball';
    const Red = 'red_ball';
    switch (GType) {
        case 'Cars':
            return `car${v}`;
        case 'Happy':
            if (v > 18) return Red;
            return Blue;
        case 'Happy8':
            if (v > 40) return Red;
            return Blue;
        default:
            return Red;
    }
};
export const chkColor = (v:number, GType:string, chkExt?:number) => {
    // console.log('chkColor:', v, GType, chkExt);
    // if(typeof v === 'string') v= parseInt(v, 10);
    if (GType !== 'MarkSix' && GType !== 'HashSix') {
        return chkColorOther(v, GType);
        // return 'RedWav'
    }
    if (v > 1400) {
        chkExt = 0;
    }
    if (chkExt !== undefined) {
      const colorE = ['RedWav', 'BlueWav', 'GreenWav'];
      if (chkExt === 0) {
        // let color= ['RedWavTxt', 'GreenWavTxt', 'BlueWavTxt']
        return colorE[v % 10];
      }
        // if(GType== 'HashSix') console.log('chkColor:', v, Math.floor(v/4), color[Math.floor(v/4)]);
        if (v >= 100) {
            v %= 100;
        }
        return colorE[Math.floor(v / 4)];
    }
    /*
    if(chk){
      if(!chk) return ''
      else ext= 'Txt'
    }
    */
    // v= parseInt(v)
    const color = ['GreenWav', 'RedWav', 'RedWav', 'BlueWav', 'BlueWav', 'GreenWav'];
    const key = Math.floor((v - 1) / 10);
    const c = (v + key) % 6;
    const clr = color[c];
    // console.log(`chkColor:${v}, ${key}, ${c}, ${clr}`);
    return v === 0 ? 'GreenWav' : clr;
};
const DragonTiger = (bt:number, num:number, V:any) => {
    const ext = num % 2;
    const h = Math.floor(num / 10);
    return `${h + 1}vs${6 - h}${V.$t(`Game.MarkSix.Item.${bt}.subtitle.${ext}`)}`;
};
const padingZero = (num:string|number, dtl:number):string => {
    if (typeof (num) === 'number') num = num.toString();
	const n = num.length;
	if (n > dtl) {
		const tmp = num.substr((n - dtl), dtl);
		return tmp;
	}
	for (let i = n; i < dtl; i++) {
		num = `0${num}`;
	}
	return num;
};
export function BaNum(n: number): number {
    if (n <= 0) return 1;
    const s: string = n.toString();
    const p: number = s.length - (s.indexOf('.') + 1);
    // return Math.pow(10, p);
    return 10 ** p;
}
export function fixlen(n: number): number {
    const s: string = n.toString();
    const p: number = s.length - (s.indexOf('.') + 1);
    return p;
}
const Num7 = (bt:number, num:number, V:any) => {
    let base = 8;
    if (V.GType === 'HashSix') base = 7;
    const t = Math.floor(num / base);
    const n = num % base;
    return String(V.$t(`Game.MarkSix.Item.${bt}.subtitle.${t}`)) + String(n);
};
const NumPass = (GType:string, num:number, V:any, sct:boolean, bt:number) => {
    let base = 10;
    if (GType === 'MarkSix' || GType === 'HashSix') base = 100;
    const t = Math.floor(num / base);
    const n = num % 10;
    /*
    if(typeof(V.$t('Game.MarkSix.Item.'+t+'.subtitle.'+n))== 'undefined'){
        console.log('Game.MarkSix.Item.'+t+'.subtitle.'+n)
    }
    */
    let tmp = V.$t(`Game.${GType}.Item.${t}.subtitle.${n}`);
    if (sct) {
        // const k = Math.floor((num % 100) / 10);
        // tmp = `${V.$t(`Game.${GType}.Item.${bt}.sctitle.${k}`)} ${tmp}`;
        const chk:AnyObject = V.$t(`Game.${GType}.Item.${bt}`);
        const k = Math.floor((num > 1000 || num < 100 ? num % 100 : num) / 10);
        let lbl = '';
        if (chk.sctitle) {
            lbl = `Game.${GType}.Item.${bt}.sctitle.${k}`;
            // tmp = V.$t('Game.' + GType + '.Item.' + bt + '.sctitle.' + k) + ' ' + tmp;
        } else {
            lbl = `Game.${GType}.Item.${k}.shortT1`;
            // tmp = V.$t('Game.' + GType + '.Item.' + k + '.shortT1') + ' ' + tmp;
        }
        tmp = `${V.$t(lbl)} ${tmp}`;
    }
    return tmp;
};

export const itemName = (bt:number, num:number, V:any, dgt = 1, showScTitle = false) => {
    let n = V.GType === 'Happy' && bt === 1 ? num % 100 : num % 10;
    let h = 0;
    if (num >= 100 && V.GType !== 'Cars') {
        h = Math.floor(num / 100);
    } else {
        h = Math.floor(num / 10);
    }
    if (V.GType === 'Cars') {
        if (bt === 1) {
            if (n === 0) {
                h -= 1;
                n = 10;
            }
        }
        if (bt >= 7) return num;
        if (bt > 1) return String(V.$t(`Game.Cars.Item.${bt}.sctitle[${h}]`)) + String(V.$t(`Game.Cars.Item.${bt}.subTitle[${n}]`));
        // if(bt== 1) return V.$t('Game.Cars.Item.' + bt +'.sctitle[' + h +']') + ' ' + n 
        // return V.$t('Game.Cars.Item.' + bt +'.sctitle[' + h +']') + V.$t('Game.Cars.Item.' + bt +'.subTitle[' + n +']')
    }
    if ((V.GType === 'MarkSix' || V.GType === 'HashSix') && bt === 53) return Num7(bt, num, V);
    if (((V.GType === 'MarkSix' || V.GType === 'HashSix') && bt === 15) || (V.GType === 'BTCHash' && bt === 47)) return NumPass(V.GType, num, V, showScTitle, bt);
    if ((V.GType === 'MarkSix' || V.GType === 'HashSix') && bt === 68) return DragonTiger(bt, num, V); /* 龍虎 */
    // let subtt = V.$t('Game.'+V.GType+'.Item.' + bt +'.subTitle')
    const btitem = V.$t(`Game.${V.GType}.Item.${bt}`);
    if (showScTitle) {
        // let sct = V.$t('Game.'+V.GType+'.Item.' + bt +'.sctitle')
        if (typeof (btitem.sctitle) !== 'undefined') {
            if (typeof (btitem.subtitle) !== 'undefined') {
                return String(btitem.sctitle[h]) + String(btitem.subtitle[n]);
            }
                return `${btitem.sctitle[h]} ${n}`;
                // return V.$t('Game.'+V.GType+'.Item.' + bt +'.sctitle.' + h) + ' ' + n
        }
    }
    let exTitle = '';
    // let subT = V.$t('Game.' + V.GType + '.Item.'+bt+'.subtitle').length
    if (typeof (btitem.subtitle) !== 'undefined') {
      let ext = num % btitem.subtitle.length;
      if (((V.GType === 'MarkSix' || V.GType === 'HashSix') && bt === 14) || V.GType === 'Happy') {
          ext = num % 10;
      }
      if (V.GType === 'HashSix' && (bt >= 82 && bt <= 88)) {
          ext = num % 100;
      }
      if (typeof (btitem.shortT) !== 'undefined') {
          exTitle = String(btitem.shortT) + String(btitem.subtitle[ext]);
      } else {
        exTitle = btitem.subtitle[ext];
      }
      // exTitle = V.$t('Game.' + V.GType + '.Item.'+bt+'.shortT') + V.$t('Game.' + V.GType + '.Item.'+bt+'.subtitle.' + ext)
      return exTitle;
    }
    if (dgt > 1) {
      return padingZero(num, dgt);
    }
    // if(num > 100 && typeof(dgt)== 'undefined') num = num % 100
    if (num >= 100) num %= 100;
    if (V.GType === 'Always') return num % 10;
    if (V.GType === 'Cars') {
        return n;
    }
    if (num < 10 && (V.GType === 'MarkSix' || V.GType === 'HashSix' || V.GType === 'Happy8' || dgt === 2)) return `0${num}`;
    return num;
};
export function dateString(DateS?:string):string {
    let d:Date;
    if (DateS) {
        d = new Date(DateS);
    } else {
        d = new Date();
    }
    const reg1 = /(\d+)-(\d+)-(\d+).*/;
    return d.toJSON().replace(reg1, '$1-$2-$3');
}
export function datetime(v:string|number, style?:string) {
    const dt:Date = new Date(typeof (v) === 'number' ? v * 1000 : v);
    if (style) {
        if (style === 'date') {
            return dt.toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' });
        }
    }
    return dt.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false });
}
function addZeroIfUnderTen(v:string|number):string {
    const i:number = typeof (v) === 'string' ? parseInt(v, 10) : 0;
    if (i < 10) return `0${i}`;
    return `${i}`;
}
export function dateAddZero(d:string):string {
    const sep:string = d.indexOf('-') > -1 ? '-' : '/';
    const dArr:string[] = d.split(sep);
    const newA = dArr.map((s) => addZeroIfUnderTen(s));
    return newA.join(sep);
}
interface BtN {
    title: string;
    shortT?: string;
    subtitle?: string[];
    sctitle?:string[];
}
function rgM3Pos(nums:string) {
    const tmpN = nums.split(':');
    tmpN.map((itm, idx) => {
        tmpN[idx] = itm.replace(/[htu]\s[htu]/g, ', ').replace(/[htu]/g, '').replace(' ', '');
    });
    return `(${tmpN.join('), (')})`;
}
function fixP(v?:number|string):string|undefined {
    let n:number | undefined;
    if (typeof (v) === 'string') {
        if (v.indexOf(',') >= 0) {
            const arr = v.split(',');
            const nn:string[] = [];
            arr.map((vv) => {
                const tmp:string|undefined = fixP(vv);
                if (tmp) {
                    nn.push(tmp);
                }
            });
            return nn.join('/');
        }
        n = parseFloat(v);
    } else n = v;
    /*
    if(n){
        const ba:number= BaNum(n)/10;
        //if(ba<100) return n+'';
        console.log(n, ba);
        return (Math.round(n*ba)/ba)+'';
    } else {
        console.log('pass', n);
    }
    */
    if (n) {
       return `${parseFloat(n.toFixed(6))}`;
    }
    return `${n}`;
}
export function itemNameNew(GType:string, bt:number, num:number, V:Vue, dgt = 1, showScTitle = false) {
    if (GType === 'Always' && bt === 1) console.log('itemName:', bt, num, GType);
    if (!bt) return num;
    let n = GType === 'Happy' && bt === 1 ? num % 100 : num % 10;
    let h;
    if (num >= 100 && GType !== 'Cars') {
        h = Math.floor(num / 100);
    } else {
        h = Math.floor(num / 10);
    }
    if (GType === 'Always') return num % 10;
    if (GType === 'Cars') {
        if (bt === 1) {
            if (n === 0) {
                h -= 1;
                n = 10;
            }
        }
        if (bt >= 7) return num;
        if (bt > 1) {
            const tmp1 = `${V.$t(`Game.Cars.Item.${bt}.sctitle[${h}]`)}`;
            const tmp2 = `${V.$t(`Game.Cars.Item.${bt}.subTitle[${n}]`)}`;
            return tmp1 + tmp2;
        }
    }
    if ((GType === 'MarkSix' || GType === 'HashSix') && bt === 53) return Num7(bt, num, V);
    if (((GType === 'MarkSix' || GType === 'HashSix') && bt === 15) || (GType === 'BTCHash' && bt === 47)) return NumPass(GType, num, V, showScTitle, bt);
    if ((GType === 'MarkSix' || GType === 'HashSix') && bt === 68) return DragonTiger(bt, num, V); /* 龍虎 */
    // let subtt = V.$t('Game.'+GType+'.Item.' + bt +'.subTitle')
    const tmpT:any = V.$t(`Game.${GType}.Item.${bt}`);
    const btitem:BtN = tmpT as BtN;
    if (showScTitle) {
        if (btitem.sctitle) {
            if (btitem.subtitle) {
                return btitem.sctitle[h] + btitem.subtitle[n];
            }
                return `${btitem.sctitle[h]} ${n}`;
        }
    }
    let exTitle = '';
    // let subT = V.$t('Game.' + GType + '.Item.'+bt+'.subtitle').length
    if (btitem.subtitle) {
      let ext = num % btitem.subtitle.length;
      /*
      if(GType== 'MarkSix' && bt== 14) {
          ext = num % 10
      }
      */
      if (((GType === 'MarkSix' || GType === 'HashSix') && bt === 14) || GType === 'Happy') {
        ext = num % 10;
      }
      if (GType === 'HashSix' && (bt >= 82 && bt <= 88)) {
        ext = num % 100;
      }
      /*     
      if(btitem.shortT){
          exTitle = btitem.shortT + btitem.subtitle[ext]
      } else {
        exTitle = btitem.subtitle[ext]
      }
      */
      exTitle = btitem.subtitle[ext];
      // exTitle = V.$t('Game.' + GType + '.Item.'+bt+'.shortT') + V.$t('Game.' + GType + '.Item.'+bt+'.subtitle.' + ext)
      return exTitle;
    }
    if (dgt > 1) {
      return padingZero(num, dgt);
    }
    if (num >= 100 && typeof (dgt) === 'undefined') num %= 100;
    if (GType === 'Always') return num % 10;
    if (GType === 'Cars') {
        return n;
    }
    if (num < 10 && (GType === 'MarkSix' || GType === 'HashSix' || GType === 'Happy8' || dgt === 2)) return `0${num}`;
    return num;
}
function RemasterNum(GType:string, Num:string, vue:Vue, BetType = 0, Odds = 0) {
    if (!BetType) return Num;
    const tmp:any = vue.$t(`Game.${GType}.Item.${BetType}`);
    const btc = tmp as BtN;
    if (Num.indexOf('x') !== -1) {
        const nums = Num.replace(/x/g, '').split(' ');
        let ans:string[];
        if ((GType === 'HashSix' || GType === 'MarkSix') && BetType === 15) {
            ans = nums.map((nm) => NumPass(GType, parseInt(nm, 10), vue, true, BetType));
        } else {
            // ans = nums.map((nm) => subRematerNum(GType, BetType, parseInt(nm, 10), btc));
            ans = nums.map((nm) => itemNameNew(GType, BetType, parseInt(nm, 10), vue, 0, true));
        }
        Num = ans.join(',');
    } else {
        // Num = subRematerNum(GType, BetType, parseInt(Num, 10), btc);
        Num = itemNameNew(GType, BetType, parseInt(Num, 10), vue, 0, true);
    }
    return `<font color='blue'>${btc.title}:</font> ${Num} (<font color='red'>${parseFloat(Odds.toFixed(4))}</font>)`;
}
function RemasterCon(BC:any, GType:string, vue:Vue):string {
    console.log('RemasterCon:', BC);
    const btc:BetContent = BC as BetContent;
    if (GType) {
        let tItm:BtN|undefined;
        if (btc.BetType) {
            // console.log('btc.BetType:', btc.BetType, btc);
            const tmp:any = vue.$t(`Game.${GType}.Item.${btc.BetType}`);
            tItm = tmp as BtN;
        }
        const SNum:string[] = [];
        if (btc.Content) {
            let stmp:BtN|undefined;
            let subBt = '';
            btc.Content.map((itm:NumData) => {
                if (itm.BetType) {
                    // console.log('btc.BetType:', itm.BetType, itm);
                    const tt:any = vue.$t(`Game.${GType}.Item.${itm.BetType}`);
                    stmp = tt as BtN;
                    // subBt = tItm ? '' : (stmp ? `<span class= "BetType">${stmp.title}</span>:` : '');
                    if (!tItm && stmp) {
                        subBt = `<span class= "BetType">${stmp.title}</span>:`;
                    }
                }
                // let tmp:string;
                let numtitle = '';
                let bt = itm.BetType ? itm.BetType : 0;
                if (!bt) bt = btc.BetType ? btc.BetType : 0;
                /*
                if (btc.BetType && itm.BetType) {
                    bt = itm.BetType;
                }
                */
                if (typeof (itm.Num) === 'number') {
                    numtitle = itemNameNew(GType, bt, itm.Num, vue, 1, true);
                } else {
                    numtitle = rgM3Pos(itm.Num);
                }
                const Odds = fixP(itm.Odds);
                const tmp = `${subBt}<span class= "Nums">${numtitle}</span>${Odds ? `(<span class= "Odds">${Odds}</span>)` : ''}`;
                SNum.push(tmp);
            });
        }
        // return `${btc.BetType}:${tItm ? tItm.title : '' }${SNum.join(", ")}`;
        return `${tItm ? `<span class= "BetType">${tItm.title}</span><br>` : ''}${SNum.join(', ')}`;
    }
    return BC;
}
export function BHRemaster(bh:BetHeader, glist:SelectOptions[], vue:Vue):BetHeader {
    // console.log('BHRemaster', bh);
    const gameid = parseInt(String(bh.GameID), 10);
    const f = glist.find((itm) => itm.value === gameid);
    if (f) {
        const GType = f.GType ? f.GType : '';
        bh.GameName = f.label;
        if (bh.Num) {
            bh.BetContent = RemasterNum(GType, bh.Num, vue, bh.BetType, bh.Odds);
            bh.Total = bh.Amt ? bh.Amt : 0;
        } else {
            bh.BetContent = JSON.parse(bh.BetContent);
            bh.BetContent = RemasterCon(bh.BetContent, GType, vue);
        }
        // console.log('BHRemaster', bh.BetContent);
    }
    return bh;
}

export function NoSientificNotation(v:number):string {
    let s:string = v.toString();
    if (Math.abs(v) < 1.0) {
        const e = parseInt(s.split('e-')[1], 10);
        if (e) {
            // v *= Math.pow(10, e - 1);
            v *= 10 ** (e - 1);
            s = `0.${(new Array(e)).join('0')}${v.toString().substring(2)}`;
        }
    } else {
        let e = parseInt(s.split('+')[1], 10);
        if (e > 20) {
            e -= 20;
            // v /= Math.pow(10, e);
            v /= 10 ** e;
            s = String(v) + (new Array(e + 1)).join('0');
        }
    }
    return s;
}
