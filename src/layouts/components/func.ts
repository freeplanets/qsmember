import {BetHeader, SelectOptions,INumData,IBetContent} from '../data/if'
import Vue from 'vue';
export const chkColor = (v:number,GType:string,chkExt:number|undefined=undefined)=>{
    //console.log('chkColor:',v,GType,chkExt);
    if(GType != 'MarkSix'){
        return chkColorOther(v,GType)
        //return 'RedWav'
    } 
    let ext=''
    if(v > 1400) {
        chkExt =0;
    }
    if(chkExt!==undefined){
      let color=['RedWav','BlueWav','GreenWav']
      if(chkExt===0){
        //let color=['RedWavTxt','GreenWavTxt','BlueWavTxt']
        return color[v % 10]
      } else {           
        return color[Math.floor(v/4)]
      }
    }
    /*
    if(chk){
      if(!chk) return ''
      else ext='Txt'
    }
    */
    //v=parseInt(v)
    let color=['GreenWav','RedWav','RedWav','BlueWav','BlueWav','GreenWav']
    let key= Math.floor((v-1) / 10)
    let c = color[(v + key) % 6 ]
    return c+ext
};
const chkColorOther=(v,GType)=>{
    let Blue = 'blue_ball'
    let Red = 'red_ball'
    switch(GType){
        case 'Cars':
            return 'car'+v
        case 'Happy':
            if(v>18) return Red
            return Blue
        case 'Happy8':
            if(v>40) return Red
            return Blue
        default:
            return Red
    }
};

export const itemName=(bt:number,num:number,V,dgt:number=1,showScTitle:boolean|undefined=undefined)=>{
    //console.log('itemName:',bt,num,GType);
    let n = num % 10
    let h 
    if(num > 100 && V.GType != 'Cars'){
        h=Math.floor(num/100)
    } else {
        h=Math.floor(num/10)
    }
    if(V.GType=='Cars'){
        if(bt==1){
            if(n==0){
                h=h-1
                n=10
            }
        }        
        if(bt>=7) return num
        if(bt>1) return V.$t('Game.Cars.Item.' + bt +'.sctitle[' + h +']')+V.$t('Game.Cars.Item.' + bt +'.subTitle[' + n +']')
        //if(bt==1) return V.$t('Game.Cars.Item.' + bt +'.sctitle[' + h +']') + ' ' + n 
        //return V.$t('Game.Cars.Item.' + bt +'.sctitle[' + h +']') + V.$t('Game.Cars.Item.' + bt +'.subTitle[' + n +']')
    }
    if(V.GType=='MarkSix' && bt==53) return Num7(bt,num,V)
    if(V.GType=='MarkSix' && bt==15) return NumPass(num,V,showScTitle,bt)
    if(V.GType=='MarkSix' && bt==68) return DragonTiger(bt,num,V) /* 龍虎 */
    //let subtt = V.$t('Game.'+V.GType+'.Item.' + bt +'.subTitle')
    let btitem = V.$t('Game.'+V.GType+'.Item.' + bt)
    if(showScTitle){
        //let sct = V.$t('Game.'+V.GType+'.Item.' + bt +'.sctitle')
        if(typeof(btitem.sctitle)!='undefined'){
            if(typeof(btitem.subtitle)!='undefined'){
                return btitem.sctitle[h] + btitem.subtitle[n]
            } else {
                return btitem.sctitle[h] + ' ' + n
                //return V.$t('Game.'+V.GType+'.Item.' + bt +'.sctitle.' + h) + ' ' + n
            }
        }
    }    
    let exTitle=''
    //let subT = V.$t('Game.' + V.GType + '.Item.'+bt+'.subtitle').length
    if(typeof(btitem.subtitle)!='undefined'){
      let ext = num % btitem.subtitle.length
      if(V.GType=='MarkSix' && bt==14) {
          ext = num % 10
      }
      if(typeof(btitem.shortT)!='undefined'){
          exTitle = btitem.shortT + btitem.subtitle[ext]
      } else {
        exTitle = btitem.subtitle[ext]
      }
      //exTitle = V.$t('Game.' + V.GType + '.Item.'+bt+'.shortT') + V.$t('Game.' + V.GType + '.Item.'+bt+'.subtitle.' + ext)
      return exTitle
    }
    if(dgt>1){
      return padingZero(num,dgt)
    }
    if(num > 100 && typeof(dgt)=='undefined') num = num % 100
    if(V.GType=='Always') return num %10
    if(V.GType=='Cars'){
        return n
    } 
    if(num<10 && (V.GType=='MarkSix' || V.GType=="Happy8" || dgt==2)) return '0'+num
    return num
};
const Num7=function(bt,num,V){
    let t = Math.floor(num/8)
    let n = num % 8
    return V.$t(`Game.MarkSix.Item.${bt}.subtitle.${t}`) + n
};
const NumPass=function(num,V,sct,bt){
    let t = Math.floor(num/100)
    let n = num % 10
    /*
    if(typeof(V.$t('Game.MarkSix.Item.'+t+'.subtitle.'+n))=='undefined'){
        console.log('Game.MarkSix.Item.'+t+'.subtitle.'+n)
    }
    */
    let tmp = V.$t(`Game.MarkSix.Item.${t}.subtitle.${n}`)
    if(sct) {
        let k =Math.floor((num % 100) / 10)
        tmp = V.$t(`Game.MarkSix.Item.${bt}.sctitle.${k}`) + ' ' + tmp
    }
    return tmp
};
const DragonTiger=function(bt,num,V){
    let ext = num % 2
    let h = Math.floor(num/10)
    return (h+1)+'vs'+(6-h)+V.$t('Game.MarkSix.Item.'+bt+'.subtitle.' + ext)
};
const padingZero=function(num:string|number,dtl:number):string{
    if(typeof(num)==='number') num=num.toString();
	let n=num.length;
	if(n > dtl){
		let tmp=num.substr((n-dtl),dtl);
		return tmp;
	}
	for(let i=n;i<dtl;i++){
		num="0"+num;
	}
	return num;
};
export function BaNum(n: number): number {
    const s: string = n.toString();
    const p: number = s.length - (s.indexOf(".") + 1);
    return Math.pow(10, p);
}
export function fixlen(n: number): number {
    const s: string = n.toString();
    const p: number = s.length - (s.indexOf(".") + 1);
    return p;
}

export function dateString(DateS?:string):string{
    let d:Date;
    if(DateS){
        d=new Date(DateS);
    } else {
        d=new Date();
    }
    const reg1 = /(\d+)-(\d+)-(\d+).*/;
    return d.toJSON().replace(reg1, '$1-$2-$3');
}
export function datetime(v:string|number,style?:string){
    const dt:Date=new Date(typeof(v)==='number' ? v*1000 : v);
    if(style){
        if(style==='date'){
            return dt.toLocaleDateString('zh-TW', {timeZone: 'Asia/Taipei'});
        }
    }
    return dt.toLocaleString('zh-TW', {timeZone: 'Asia/Taipei',hour12:false});
}
export function dateAddZero(d:string):string{
    const sep:string= d.indexOf('-') > -1 ? '-' : '/';
    const dArr:string[]= d.split(sep);
    const newA=dArr.map(s=>{
        return addZeroIfUnderTen(s);
    })   
    return newA.join(sep);
}
function addZeroIfUnderTen(v:string|number):string{
    const i:number=typeof(v)==='string' ? parseInt(v,10) : 0;
    if(i<10) return '0'+i;
    return ''+i;
}
export function BHRemaster(bh:BetHeader,glist:SelectOptions[],vue:Vue,users?:any):BetHeader{
    //console.log('BHRemaster type:',typeof bh.GameID);
    const f=glist.find(itm=>itm.value==bh.GameID);
    if(f){
        const GType=f.GType ? f.GType : '';
        bh.GameName = f.label;
        bh.BetContent = RemasterCon(bh.BetContent,GType,vue);
        //console.log('BHRemaster',bh.BetContent);
    } 
    return bh;
}
interface BtN { 
    title: string; 
    shortT?: string; 
    subtitle?: string[];
    sctitle?:string[];
}
function RemasterCon(BC:any,GType:string,vue:Vue):string{
    //console.log('RemasterCon:',BC);
    const btc:IBetContent=BC as IBetContent;
    if(GType){
        let tItm:BtN|undefined;
        if(btc.BetType){
            let tmp:any=vue.$t(`Game.${GType}.Item.${btc.BetType}`);
            tItm=tmp as BtN;
        }
        let SNum:string[]=[];
        if(btc.Content){
            let stmp:BtN|undefined;
            let subBt:string='';
            btc.Content.map(itm=>{
                if(itm.BetType){
                    let tt:any=vue.$t(`Game.${GType}.Item.${itm.BetType}`);
                    stmp=tt as BtN
                    subBt = tItm ? '' : (stmp ? '<span class="BetType">'+stmp.title+"</span>:" : '');
                }
                let tmp:string;
                let numtitle:string='';
                let bt:number = btc.BetType ? btc.BetType : (itm.BetType ? itm.BetType : 0);                   
                numtitle=itemNameNew(GType, bt,itm.Num,vue,1,true);
                const Odds = fixP(itm.Odds)
                tmp=`${subBt}<span class="Nums">${numtitle}</span>${Odds ? '(<span class="Odds">'+Odds+'</span>)' :''}`;
                SNum.push(tmp);
            })
        }
        //return `${btc.BetType}:${tItm ? tItm.title : '' }${SNum.join(",")}`;
        return `${tItm ? '<span class="BetType">'+tItm.title+'</span><br>' : '' }${SNum.join(",")}`;
    }
    return BC;
}
function fixP(v?:number|string):string|undefined{
    let n:number | undefined;
    if(typeof(v)==='string'){
        if(v.indexOf(',')>=0){
            const arr=v.split(',');
            const nn:string[]=[];
            arr.map(vv=>{
                const tmp:string|undefined=fixP(vv);
                if(tmp){
                    nn.push(tmp);
                }
            })
            return nn.join('/');
        }
        n = parseFloat(v);
    } 
    else n=v;
    if(n){
        const ba:number=BaNum(n)/10;
        if(ba<100) return n+'';
        return (Math.round(n*ba)/ba)+'';
    }
    return n+'';
}
function itemNameNew(GType:string,bt:number,num:number,V:Vue,dgt:number=1,showScTitle:boolean|undefined=undefined){
    //console.log('itemName:',bt,num,V.GType);
    let n = num % 10
    let h 
    if(num > 100 && GType != 'Cars'){
        h=Math.floor(num/100)
    } else {
        h=Math.floor(num/10)
    }
    if(GType=='Cars'){
        if(bt==1){
            if(n==0){
                h=h-1
                n=10
            }
        }        
        if(bt>=7) return num
        if(bt>1){
            const tmp1:string=V.$t(`Game.Cars.Item.${bt}.sctitle[${h}]`)+'';
            const tmp2:string=V.$t(`Game.Cars.Item.${bt}.subTitle[${n}]`)+'';
            return tmp1+tmp2;
        } 
        //if(bt==1) return V.$t('Game.Cars.Item.' + bt +'.sctitle[' + h +']') + ' ' + n 
        //return V.$t('Game.Cars.Item.' + bt +'.sctitle[' + h +']') + V.$t('Game.Cars.Item.' + bt +'.subTitle[' + n +']')
    }
    if(GType=='MarkSix' && bt==53) return Num7(bt,num,V)
    if(GType=='MarkSix' && bt==15) return NumPass(num,V,showScTitle,bt)
    if(GType=='MarkSix' && bt==68) return DragonTiger(bt,num,V) /* 龍虎 */
    //let subtt = V.$t('Game.'+GType+'.Item.' + bt +'.subTitle')
    const tmpT:any=V.$t('Game.'+GType+'.Item.' + bt);
    const btitem:BtN = tmpT as BtN;
    if(showScTitle){
        if(btitem.sctitle){
            if(btitem.subtitle){
                return btitem.sctitle[h] + btitem.subtitle[n]
            } else {
                return btitem.sctitle[h] + ' ' + n
            }
        }
    }    
    let exTitle=''
    //let subT = V.$t('Game.' + GType + '.Item.'+bt+'.subtitle').length
    if(btitem.subtitle){
      let ext = num % btitem.subtitle.length
      if(GType=='MarkSix' && bt==14) {
          ext = num % 10
      }
      if(btitem.shortT){
          exTitle = btitem.shortT + btitem.subtitle[ext]
      } else {
        exTitle = btitem.subtitle[ext]
      }
      //exTitle = V.$t('Game.' + GType + '.Item.'+bt+'.shortT') + V.$t('Game.' + GType + '.Item.'+bt+'.subtitle.' + ext)
      return exTitle
    }
    if(dgt>1){
      return padingZero(num,dgt)
    }
    if(num > 100 && typeof(dgt)=='undefined') num = num % 100
    if(GType=='Always') return num %10
    if(GType=='Cars'){
        return n
    } 
    if(num<10 && (GType=='MarkSix' || GType=="Happy8" || dgt==2)) return '0'+num
    return num
};