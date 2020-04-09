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
    //console.log('itemName:',bt,num,V.GType);
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
    return V.$t('Game.'+ V.GType+'.Item.'+bt+'.subtitle.'+t) + n
};
const NumPass=function(num,V,sct,bt){
    let t = Math.floor(num/100)
    let n = num % 10
    //*
    if(typeof(V.$t('Game.'+ V.GType+'.Item.'+t+'.subtitle.'+n))=='undefined'){
        console.log('Game.'+ V.GType+'.Item.'+t+'.subtitle.'+n)
    }
    //*/
    let tmp = V.$t('Game.'+ V.GType+'.Item.'+t+'.subtitle.'+n)
    if(sct) {
        let k =Math.floor((num % 100) / 10)
        tmp = V.$t('Game.'+ V.GType+'.Item.'+bt+'.sctitle.'+k) + ' ' + tmp
    }
    return tmp
};
const DragonTiger=function(bt,num,V){
    let ext = num % 2
    let h = Math.floor(num/10)
    return (h+1)+'vs'+(6-h)+V.$t('Game.' + V.GType + '.Item.'+bt+'.subtitle.' + ext)
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