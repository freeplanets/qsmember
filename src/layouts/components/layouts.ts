export interface numBlock {
    BT:number;
    Num:number;
    Pos?:number;
    PosFix?:boolean;
}
export interface SelectSet {
    pos:string[];
    num:number[];
}
/*
export interface lineBlock {
    [key:number]:numBlock[];
}
*/
export interface FastSltSubItem {
    num:number;
    isActive:boolean;
}
export interface FastSltSub {
    title?:string;
    subitem:FastSltSubItem[];
    key: string;
    func?:Function;
}
export interface FastSlts {
    title?:string;
    subcont?:FastSltSub[];
}
export interface contBlock {
    title?:string;
    subtitle?:string;
    colorWave?:boolean;
    aBT?:number[];
    BT?:number;
    sltedItem?:number;
    start?:number;
    end?:number;
    twOdds?:number[];
    colorExt?:number;
    dgt?:number;
    item?:numBlock[][] | Function ;
    items?:numBlock[][][];
    fastSltItm?:string[];
    FastSlt?:FastSlts;
    noSameNum?:boolean;
    Selects?:string[];
    Position?:number[];   //1 不同位置(正1,正2,....)分頁
    PosSelected?:number[];
    PosSlt?:SelectSet;
    curBT?:number;
    Sortable?:boolean;
}
export interface layoutBlock {
    name:string;
    cont: contBlock[];
}
export interface Layout {
    [key:number]:layoutBlock;
}
interface ILayouts {
    [key:string]:Layout;
}
const getAZNums = (BT:number,startAt:number,endAt:number,pos:number):numBlock[][]=>{
    const base = endAt > 10 ? 100 : 10;
    const cols = endAt > 5 ? Math.ceil(endAt / 2) : 0;
    const ans:numBlock[][]=[];
    let tmpline:numBlock[]=[];
        for(let i=startAt;i<=endAt;i++){
            const tmp:numBlock={
                BT: BT,
                //Num: pos ? pos*base + i : i,
                Num: pos*base + i,
                Pos: pos
            }
            tmpline.push(tmp);
            if(tmpline.length===cols){
                ans.push(tmpline);
                tmpline=[];
            }
        }
    //console.log('getAZNums:',ans);
    return ans;
}
const getNums = (BT:number,lastNums?:number,startAt?:number,extF?:number,addArr?:numBlock[][]):numBlock[][]=>{
    if(!lastNums) lastNums = 49;
    if(startAt!==0){
        if(!startAt) startAt = 1;
    }
    let aLineMember = 10;
    let base:number=0;
    let nums:numBlock[][] = [];
    let mid:number = Math.floor((lastNums+(startAt===0 ? 1 : startAt))/2);
    if( mid < aLineMember) aLineMember=mid;
    if(extF) {
        base = BT*extF;
        BT=1;
    }
    let tmp:numBlock[]=[];
    for(let i=startAt;i<=lastNums;i++){
        let l = i % aLineMember;
        if(l === startAt && i !== startAt){
            nums.push(tmp);
            tmp=[];
        }
        tmp.push({BT: BT,Num:base+i,Pos:i});
    }
    if(tmp.length>0) nums.push(tmp);
    if(addArr){
        addArr.map(lnObj=>{
            nums.push(lnObj);
        })
        //console.log('getNums:',nums);
    }
    return nums;
}

/*** */
const getblocks=(start:number,end:number,firstBlockBlank?:boolean)=>{
    const ans:numBlock[][]=[];
    let ln:numBlock[]=[];
    let k=0;
    if(firstBlockBlank){
      ln.push(getBlockData(-1,-1))
    }
    for(let i=start;i<=end;i++){
      ln.push(getBlockData(k++,i))
      if(ln.length===10){
        ans.push(ln);
        ln=[];
      }
    }
    if(ln.length>0) ans.push(ln);
    return ans;  
}
  /**
   * 回傳二字到倒三角佈局
   */
const getTD=()=>{
    const ans:numBlock[][]=[];
    let ln:numBlock[]=[];
    let k=0;
    for(let i=0;i<100;i++){
      const s=i+'';
      if(s.length>1){
        let arr=s.split('');
        if(parseInt(arr[1]) < parseInt(arr[0])) ln.push(getBlockData(-1,i))
        else ln.push(getBlockData(k++,i))
      } else {
        ln.push(getBlockData(k++,i));
      }
      if(ln.length===10){
        ans.push(ln);
        ln=[];
      }
    }
    return ans;
}
const getBlockData=(pos:number,num:number):numBlock=>{
    const b:numBlock={
      BT:0,
      Num:num,
      Pos:pos
    }
    if(pos<0){
      b.BT = -1;
      b.Pos = -1;
    }
    return b;
}
  /**
   * 回傳3字佈局
   */
const get3D=()=>{
    const ans:numBlock[][]=[];
    let ln:numBlock[]=[];
    //let k=0;
    const str:number[]=[];
    for(let i=0;i<1000;i++){
      const s=(i+'').split('');
      const a=parseInt(s.sort().join(''));
      console.log(i,a);
      if(str.indexOf(a)===-1) str.push(a);
    }
    for(let i=0,n=str.length;i<n;i++){
      ln.push(getBlockData(i,str[i]));
      if(ln.length===10){
        ans.push(ln);
        ln=[];
      }
    }
    return ans;
}

/*
const getTwoDgt=(bt:number):numBlock[][]=>{
    return [
        [{BT:bt,Num:0},{BT:bt,Num:1},{BT:bt,Num:2},{BT:bt,Num:3},{BT:bt,Num:4},{BT:bt,Num:5},{BT:bt,Num:6},{BT:bt,Num:7},{BT:bt,Num:8},{BT:bt,Num:9}],
        [{BT:-1,Num:0},{BT:bt,Num:11},{BT:bt,Num:12},{BT:bt,Num:13},{BT:bt,Num:14},{BT:bt,Num:15},{BT:bt,Num:16},{BT:bt,Num:bt},{BT:bt,Num:18},{BT:bt,Num:19}],
        [{BT:-1,Num:0},{BT:-1,Num:0},{BT:bt,Num:22},{BT:bt,Num:23},{BT:bt,Num:24},{BT:bt,Num:25},{BT:bt,Num:26},{BT:bt,Num:27},{BT:bt,Num:28},{BT:bt,Num:29}],
        [{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:bt,Num:33},{BT:bt,Num:34},{BT:bt,Num:35},{BT:bt,Num:36},{BT:bt,Num:37},{BT:bt,Num:38},{BT:bt,Num:39}],
        [{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:bt,Num:44},{BT:bt,Num:45},{BT:bt,Num:46},{BT:bt,Num:47},{BT:bt,Num:48},{BT:bt,Num:49}],
        [{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:bt,Num:55},{BT:bt,Num:56},{BT:bt,Num:57},{BT:bt,Num:58},{BT:bt,Num:59}],
        [{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:bt,Num:66},{BT:bt,Num:67},{BT:bt,Num:68},{BT:bt,Num:69}],
        [{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:bt,Num:77},{BT:bt,Num:78},{BT:bt,Num:79}],
        [{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:bt,Num:88},{BT:bt,Num:89}],
        [{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:bt,Num:99}]
    ];
}
const getThreeDgt=(bt:number):numBlock[][]=>{
    return [
        [{BT:bt,Num:0},{BT:bt,Num:1},{BT:bt,Num:2},{BT:bt,Num:3},{BT:bt,Num:4},{BT:bt,Num:5},{BT:bt,Num:6},{BT:bt,Num:7},{BT:bt,Num:8},{BT:bt,Num:9}],
        [{BT:bt,Num:11},{BT:bt,Num:12},{BT:bt,Num:13},{BT:bt,Num:14},{BT:bt,Num:15},{BT:bt,Num:16},{BT:bt,Num:17},{BT:bt,Num:18},{BT:bt,Num:19},{BT:bt,Num:22}],
        [{BT:bt,Num:23},{BT:bt,Num:24},{BT:bt,Num:25},{BT:bt,Num:26},{BT:bt,Num:27},{BT:bt,Num:28},{BT:bt,Num:29},{BT:bt,Num:33},{BT:bt,Num:34},{BT:bt,Num:35}],
        [{BT:bt,Num:36},{BT:bt,Num:37},{BT:bt,Num:38},{BT:bt,Num:39},{BT:bt,Num:44},{BT:bt,Num:45},{BT:bt,Num:46},{BT:bt,Num:47},{BT:bt,Num:48},{BT:bt,Num:49}],
        [{BT:bt,Num:55},{BT:bt,Num:56},{BT:bt,Num:57},{BT:bt,Num:58},{BT:bt,Num:59},{BT:bt,Num:66},{BT:bt,Num:67},{BT:bt,Num:68},{BT:bt,Num:69},{BT:bt,Num:77}],
        [{BT:bt,Num:78},{BT:bt,Num:79},{BT:bt,Num:88},{BT:bt,Num:89},{BT:bt,Num:99},{BT:bt,Num:111},{BT:bt,Num:112},{BT:bt,Num:113},{BT:bt,Num:114},{BT:bt,Num:115}],
        [{BT:bt,Num:116},{BT:bt,Num:117},{BT:bt,Num:118},{BT:bt,Num:119},{BT:bt,Num:122},{BT:bt,Num:123},{BT:bt,Num:124},{BT:bt,Num:125},{BT:bt,Num:126},{BT:bt,Num:127}],
        [{BT:bt,Num:128},{BT:bt,Num:129},{BT:bt,Num:133},{BT:bt,Num:134},{BT:bt,Num:135},{BT:bt,Num:136},{BT:bt,Num:137},{BT:bt,Num:138},{BT:bt,Num:139},{BT:bt,Num:144}],
        [{BT:bt,Num:145},{BT:bt,Num:146},{BT:bt,Num:147},{BT:bt,Num:148},{BT:bt,Num:149},{BT:bt,Num:155},{BT:bt,Num:156},{BT:bt,Num:157},{BT:bt,Num:158},{BT:bt,Num:159}],
        [{BT:bt,Num:166},{BT:bt,Num:167},{BT:bt,Num:168},{BT:bt,Num:169},{BT:bt,Num:177},{BT:bt,Num:178},{BT:bt,Num:179},{BT:bt,Num:188},{BT:bt,Num:189},{BT:bt,Num:199}],
        [{BT:bt,Num:222},{BT:bt,Num:223},{BT:bt,Num:224},{BT:bt,Num:225},{BT:bt,Num:226},{BT:bt,Num:227},{BT:bt,Num:228},{BT:bt,Num:229},{BT:bt,Num:233},{BT:bt,Num:234}],
        [{BT:bt,Num:235},{BT:bt,Num:236},{BT:bt,Num:237},{BT:bt,Num:238},{BT:bt,Num:239},{BT:bt,Num:244},{BT:bt,Num:245},{BT:bt,Num:246},{BT:bt,Num:247},{BT:bt,Num:248}],
        [{BT:bt,Num:249},{BT:bt,Num:255},{BT:bt,Num:256},{BT:bt,Num:257},{BT:bt,Num:258},{BT:bt,Num:259},{BT:bt,Num:266},{BT:bt,Num:267},{BT:bt,Num:268},{BT:bt,Num:269}],
        [{BT:bt,Num:277},{BT:bt,Num:278},{BT:bt,Num:279},{BT:bt,Num:288},{BT:bt,Num:289},{BT:bt,Num:299},{BT:bt,Num:333},{BT:bt,Num:334},{BT:bt,Num:335},{BT:bt,Num:336}],
        [{BT:bt,Num:337},{BT:bt,Num:338},{BT:bt,Num:339},{BT:bt,Num:344},{BT:bt,Num:345},{BT:bt,Num:346},{BT:bt,Num:347},{BT:bt,Num:348},{BT:bt,Num:349},{BT:bt,Num:355}],
        [{BT:bt,Num:356},{BT:bt,Num:357},{BT:bt,Num:358},{BT:bt,Num:359},{BT:bt,Num:366},{BT:bt,Num:367},{BT:bt,Num:368},{BT:bt,Num:369},{BT:bt,Num:377},{BT:bt,Num:378}],
        [{BT:bt,Num:379},{BT:bt,Num:388},{BT:bt,Num:389},{BT:bt,Num:399},{BT:bt,Num:444},{BT:bt,Num:445},{BT:bt,Num:446},{BT:bt,Num:447},{BT:bt,Num:448},{BT:bt,Num:449}],
        [{BT:bt,Num:455},{BT:bt,Num:456},{BT:bt,Num:457},{BT:bt,Num:458},{BT:bt,Num:459},{BT:bt,Num:466},{BT:bt,Num:467},{BT:bt,Num:468},{BT:bt,Num:469},{BT:bt,Num:477}],
        [{BT:bt,Num:478},{BT:bt,Num:479},{BT:bt,Num:488},{BT:bt,Num:489},{BT:bt,Num:499},{BT:bt,Num:555},{BT:bt,Num:556},{BT:bt,Num:557},{BT:bt,Num:558},{BT:bt,Num:559}],
        [{BT:bt,Num:566},{BT:bt,Num:567},{BT:bt,Num:568},{BT:bt,Num:569},{BT:bt,Num:577},{BT:bt,Num:578},{BT:bt,Num:579},{BT:bt,Num:588},{BT:bt,Num:589},{BT:bt,Num:599}],
        [{BT:bt,Num:666},{BT:bt,Num:667},{BT:bt,Num:668},{BT:bt,Num:669},{BT:bt,Num:677},{BT:bt,Num:678},{BT:bt,Num:679},{BT:bt,Num:688},{BT:bt,Num:689},{BT:bt,Num:699}],
        [{BT:bt,Num:777},{BT:bt,Num:778},{BT:bt,Num:779},{BT:bt,Num:788},{BT:bt,Num:789},{BT:bt,Num:799},{BT:bt,Num:888},{BT:bt,Num:889},{BT:bt,Num:899},{BT:bt,Num:999}]
    ];
}
*/
const getNum3D=(pos:string,num:number,bt:number)=>{
    const str:string[]=['hundreds','tens','units'];
    const idx=str.indexOf(pos);
    const leftPos:number[]=[];
    const mask='{pos0}{pos1}{pos2}';
    for(let i=0;i<str.length;i++){
      if(i==idx) continue;
      leftPos.push(i);
    }
    //console.log(leftPos,idx);
    const arr:numBlock[][]=[];
    let k=0;
    for(let n1=0;n1<10;n1++){
      const ln:numBlock[]=[]
      for(let n2=0;n2<10;n2++){
        let sNum=mask.replace(`{pos${idx}}`,num+'').replace(`{pos${leftPos[0]}}`,n1+'').replace(`{pos${leftPos[1]}}`,n2+'');
        //console.log(sNum,num,n1,n2);
        let tmp:numBlock={BT:bt,Num:parseInt(sNum,10),Pos:k++}
        ln.push(tmp);
      }
      arr.push(ln);
    }
    //console.log('getNum3D',arr);
    return arr;
}

function setSelect(set:SelectSet,opt:string,num:number,dgt:number){
    const len=dgt-2;
    const pos=set.pos.indexOf(opt);
    if(dgt==3){
      set.num=[num];
      set.pos=[opt];
    } else {
      if( pos==-1){
        if(set.pos.length===len){
          console.log('unselected another one first!!');
        } else {
          set.pos.push(opt);
          set.num.push(num);
        }
      } else {
        if(set.num[pos]===num && len !=1){
          set.num.splice(pos,1);
          set.pos.splice(pos,1);
        } else {
          set.num.splice(pos,1,num);
        }
      }
    }
    console.log('setSelect',set);
  }

function getNumXD(sltSet?:SelectSet,bt?:number,dgt?:number){
    if(!bt || !sltSet || !dgt) return [];
    const bUnits:string[]=['tenThousands','thousands','hundreds','tens','units'];
    if(bUnits.length<dgt) return [];
    if(dgt-sltSet.pos.length !=2) return [];
    let masks:string[]=[];
    let str:string[]=[];
    for(let i=0;i<dgt;i++){
        masks.push('{pos'+i+'}');
        let tmp=bUnits.pop();
        if(tmp){
            str.push(tmp);
        }
    }
    let mask=masks.join('');
    str=str.reverse();
    //console.log('str:',str,pos);
    //const str:string[]=['hundreds','tens','units'];
    const leftPos:number[]=[];
    //const mask='{pos0}{pos1}{pos2}';
    for(let i=0,n=str.length;i<n;i++){
      let idx=sltSet.pos.indexOf(str[i]);
      if(idx==-1){
        leftPos.push(i);
      } else {
        mask=mask.replace(`{pos${i}}`,`${sltSet.num[idx]}`);
      }
    }
    //console.log('mask:',mask,leftPos);
    const arr:numBlock[][]=[];
    let k=0;
    for(let n1=0;n1<10;n1++){
      const ln:numBlock[]=[]
      let mask1=mask.replace(`{pos${leftPos[0]}}`,`${n1}`);
      //console.log('mask1:',mask1,leftPos[0],n1);
      for(let n2=0;n2<10;n2++){
        //let sNum=mask.replace(`{pos${idx}}`,num+'').replace(`{pos${leftPos[0]}}`,n1+'').replace(`{pos${leftPos[1]}}`,n2+'');
        let sNum=mask1.replace(`{pos${leftPos[1]}}`,`${n2}`);
        //console.log(sNum,num,n1,n2);
        let tmp:numBlock={BT:bt,Num:parseInt(sNum,10),Pos:k++}
        ln.push(tmp);
      }
      arr.push(ln);
    }
    return arr;
  }
const MarkSixLayout:Layout = [
    {
        name: "Game.MarkSix.Menu.Group.0.title",
        cont: [
            {
                title : "Game.MarkSix.Item.1.title",
                item: [
                    [{Pos:0,PosFix:true,BT:2,Num:0},{Pos:0,PosFix:true,BT:3,Num:0},{Pos:0,PosFix:true,BT:16,Num:0},{Pos:0,PosFix:true,BT:74,Num:0}],
                    [{Pos:0,PosFix:true,BT:2,Num:1},{Pos:0,PosFix:true,BT:3,Num:1},{Pos:0,PosFix:true,BT:16,Num:1},{Pos:0,PosFix:true,BT:74,Num:1}]
                ]
            },
            {
                title : "Game.MarkSix.Item.5.title",
                item:[
                    [{Pos:0,PosFix:true,BT:5,Num:0},{Pos:0,PosFix:true,BT:5,Num:1},{Pos:0,PosFix:true,BT:6,Num:0},{Pos:0,PosFix:true,BT:6,Num:1}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.1",
                item:[
                    [{Pos:0,PosFix:true,BT:13,Num:10},{Pos:0,PosFix:true,BT:12,Num:10},{Pos:0,PosFix:true,BT:27,Num:10}],
                    [{Pos:0,PosFix:true,BT:13,Num:11},{Pos:0,PosFix:true,BT:12,Num:11},{Pos:0,PosFix:true,BT:27,Num:11}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.2",
                item:[
                    [{Pos:0,PosFix:true,BT:13,Num:20},{Pos:0,PosFix:true,BT:12,Num:20},{Pos:0,PosFix:true,BT:27,Num:20}],
                    [{Pos:0,PosFix:true,BT:13,Num:21},{Pos:0,PosFix:true,BT:12,Num:21},{Pos:0,PosFix:true,BT:27,Num:21}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.3",
                item:[
                    [{Pos:0,PosFix:true,BT:13,Num:30},{Pos:0,PosFix:true,BT:12,Num:30},{Pos:0,PosFix:true,BT:27,Num:30}],
                    [{Pos:0,PosFix:true,BT:13,Num:31},{Pos:0,PosFix:true,BT:12,Num:31},{Pos:0,PosFix:true,BT:27,Num:31}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.4",
                item:[
                    [{Pos:0,PosFix:true,BT:13,Num:40},{Pos:0,PosFix:true,BT:12,Num:40},{Pos:0,PosFix:true,BT:27,Num:40}],
                    [{Pos:0,PosFix:true,BT:13,Num:41},{Pos:0,PosFix:true,BT:12,Num:41},{Pos:0,PosFix:true,BT:27,Num:41}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.5",
                item:[
                    [{Pos:0,PosFix:true,BT:13,Num:50},{Pos:0,PosFix:true,BT:12,Num:50},{Pos:0,PosFix:true,BT:27,Num:50}],
                    [{Pos:0,PosFix:true,BT:13,Num:51},{Pos:0,PosFix:true,BT:12,Num:51},{Pos:0,PosFix:true,BT:27,Num:51}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.6",
                item:[
                    [{Pos:0,PosFix:true,BT:13,Num:60},{Pos:0,PosFix:true,BT:12,Num:60},{Pos:0,PosFix:true,BT:27,Num:60}],
                    [{Pos:0,PosFix:true,BT:13,Num:61},{Pos:0,PosFix:true,BT:12,Num:61},{Pos:0,PosFix:true,BT:27,Num:61}]
                ]
            },
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.1.title",
        cont:[
            {
                colorWave: true,
                aBT: [1,28],
                sltedItem:0,
                start: 1,
                end:49,
                Sortable:true,
                curBT:1,
                item: getblocks(1,49,true)
            }
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.2.title",
        cont:[
            {
                colorWave: true,
                BT:4,
                Sortable:true,
                item:getblocks(1,49,true)
            }
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.3.title",
        cont:[
            {
                colorWave: true,
                aBT:[21,22,23,24,25,26],
                sltedItem:0,
                start: 1,
                end:49,                
                curBT:21,
                Sortable:true,                
                item: getblocks(1,49,true)
            }
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.4.title",
        cont:[
            {
                colorWave: true,
                aBT:[7,8,72,9,10,73,11,71],
                twOdds:[0,1,1,0,1,1,0,0],
                sltedItem:0,
                Sortable:true,
                curBT:7,
                item: getblocks(1,49,true)
            }
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.5.title",
        cont:[
            {
                colorWave: true,
                aBT:[31,48,49,50,51,52],
                sltedItem:0,
                Sortable:true,
                curBT:7,
                item: getblocks(1,49,true)
            }
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.6.title",
        cont:[
            {
                colorWave: true,
                aBT:[57,58,59,60,61,62],
                sltedItem:0,
                Sortable:true,
                curBT:57,
                item: getblocks(1,49,true)
            }
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.7.title",
        cont:[
            {
                colorWave: true,
                aBT:[63,64,65,66,67],
                sltedItem:0,
                Sortable:true,
                curBT:63,
                item: getblocks(1,49,true)
            }
        ]
    },                        
    {
        name: "Game.MarkSix.Menu.Group.8.title",
        cont:[
            {
                aBT:[18,19],
                sltedItem: 0,
                start: 1,
                end:12,
                curBT:1,
                item: getblocks(1,12)
            }
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.9.title",
        cont:[
            {
                item: [
                    [{Pos:0,PosFix:true,BT:20,Num:0},{Pos:0,PosFix:true,BT:20,Num:1},{Pos:0,PosFix:true,BT:20,Num:2},{Pos:0,PosFix:true,BT:20,Num:3},{Pos:0,PosFix:true,BT:20,Num:4}],
                    [{Pos:0,PosFix:true,BT:20,Num:5},{Pos:0,PosFix:true,BT:20,Num:6},{Pos:0,PosFix:true,BT:20,Num:7},{Pos:0,PosFix:true,BT:20,Num:8},{Pos:0,PosFix:true,BT:20,Num:9}]
                ]
            }
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.10.title",
        cont: [
            {
                title : "Game.MarkSix.Item.1.title",
                colorWave: true,
                colorExt: 0,                
                item: [
                    [{Pos:0,PosFix:true,BT:17,Num:0},{Pos:0,PosFix:true,BT:17,Num:1},{Pos:0,PosFix:true,BT:17,Num:2}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.1",
                colorWave: true,
                colorExt: 0,                
                item:[
                    [{Pos:0,PosFix:true,BT:14,Num:10},{Pos:0,PosFix:true,BT:14,Num:11},{Pos:0,PosFix:true,BT:14,Num:12}]
                ]
            },            
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.2",
                colorWave: true,
                colorExt: 0,                
                item:[
                    [{Pos:0,PosFix:true,BT:14,Num:20},{Pos:0,PosFix:true,BT:14,Num:21},{Pos:0,PosFix:true,BT:14,Num:22}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.3",
                colorWave: true,
                colorExt: 0,
                item:[
                    [{Pos:0,PosFix:true,BT:14,Num:30},{Pos:0,PosFix:true,BT:14,Num:31},{Pos:0,PosFix:true,BT:14,Num:32}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.4",
                colorWave: true,
                colorExt: 0,
                item:[
                    [{Pos:0,PosFix:true,BT:14,Num:40},{Pos:0,PosFix:true,BT:14,Num:41},{Pos:0,PosFix:true,BT:14,Num:42}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.5",
                colorWave: true,
                colorExt: 0,
                item:[
                    [{Pos:0,PosFix:true,BT:14,Num:50},{Pos:0,PosFix:true,BT:14,Num:51},{Pos:0,PosFix:true,BT:14,Num:52}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.6",
                colorWave: true,
                colorExt: 0,
                item:[
                    [{Pos:0,PosFix:true,BT:14,Num:60},{Pos:0,PosFix:true,BT:14,Num:61},{Pos:0,PosFix:true,BT:14,Num:62}]
                ]
            },                                                
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.11.title",
        cont: [
            {
                colorWave: true,
                colorExt: 1,    
                item:[
                    [{Pos:0,PosFix:true,BT:29,Num:0},{Pos:0,PosFix:true,BT:29,Num:1},{Pos:0,PosFix:true,BT:29,Num:2},{Pos:0,PosFix:true,BT:29,Num:3}],
                    [{Pos:0,PosFix:true,BT:29,Num:4},{Pos:0,PosFix:true,BT:29,Num:5},{Pos:0,PosFix:true,BT:29,Num:6},{Pos:0,PosFix:true,BT:29,Num:7}],
                    [{Pos:0,PosFix:true,BT:29,Num:8},{Pos:0,PosFix:true,BT:29,Num:9},{Pos:0,PosFix:true,BT:29,Num:10},{Pos:0,PosFix:true,BT:29,Num:11}]
                ]
            }
        ]
    },
    {
        name:"Game.MarkSix.Menu.Group.12.title",
        cont:[
            {
                aBT:[75,76,77,78,30],
                sltedItem: 0,
                start: 1,
                end:12,
                curBT:75,
                item: getblocks(1,12)             
            }
        ]
    },        
    {
        name:"Game.MarkSix.Menu.Group.13.title",
        cont:[
            {
                aBT:[32,33,34,44,35,36,37,45],
                sltedItem: 0,
                start: 1,
                end:12,
                curBT:32,
                item: getblocks(1,12)             
            }
        ]
    },
    {
        name:"Game.MarkSix.Menu.Group.14.title",
        cont:[
            {
                aBT:[38,39,40,46,41,42,43,47],
                sltedItem: 0,
                start: 0,
                end:9,
                curBT:38,
                item: getblocks(0,9)              
            }
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.15.title",
        cont:[
            {
                item:[
                    [{Pos:0,PosFix:true,BT:53,Num:0},{Pos:0,PosFix:true,BT:53,Num:1},{Pos:0,PosFix:true,BT:53,Num:2},{Pos:0,PosFix:true,BT:53,Num:3}],
                    [{Pos:0,PosFix:true,BT:53,Num:4},{Pos:0,PosFix:true,BT:53,Num:5},{Pos:0,PosFix:true,BT:53,Num:6},{Pos:0,PosFix:true,BT:53,Num:7}],
                    [{Pos:0,PosFix:true,BT:53,Num:8},{Pos:0,PosFix:true,BT:53,Num:9},{Pos:0,PosFix:true,BT:53,Num:10},{Pos:0,PosFix:true,BT:53,Num:11}],
                    [{Pos:0,PosFix:true,BT:53,Num:12},{Pos:0,PosFix:true,BT:53,Num:13},{Pos:0,PosFix:true,BT:53,Num:14},{Pos:0,PosFix:true,BT:53,Num:15}],
                    [{Pos:0,PosFix:true,BT:53,Num:16},{Pos:0,PosFix:true,BT:53,Num:17},{Pos:0,PosFix:true,BT:53,Num:18},{Pos:0,PosFix:true,BT:53,Num:19}],
                    [{Pos:0,PosFix:true,BT:53,Num:20},{Pos:0,PosFix:true,BT:53,Num:21},{Pos:0,PosFix:true,BT:53,Num:22},{Pos:0,PosFix:true,BT:53,Num:23}],
                    [{Pos:0,PosFix:true,BT:53,Num:24},{Pos:0,PosFix:true,BT:53,Num:25},{Pos:0,PosFix:true,BT:53,Num:26},{Pos:0,PosFix:true,BT:53,Num:27}],
                    [{Pos:0,PosFix:true,BT:53,Num:28},{Pos:0,PosFix:true,BT:53,Num:29},{Pos:0,PosFix:true,BT:53,Num:30},{Pos:0,PosFix:true,BT:53,Num:31}]
                ]
            }
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.16.title",
        cont:[
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.1",
                item:[
                    [{Pos:0,PosFix:true,BT:15,Num:1210},{Pos:0,PosFix:true,BT:15,Num:1211},{Pos:0,PosFix:true,BT:15,Num:1310},{Pos:0,PosFix:true,BT:15,Num:1311}],
                    [{Pos:0,PosFix:true,BT:15,Num:1410},{Pos:0,PosFix:true,BT:15,Num:1411},{Pos:0,PosFix:true,BT:15,Num:1412}],
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.2",
                item:[
                    [{Pos:0,PosFix:true,BT:15,Num:1220},{Pos:0,PosFix:true,BT:15,Num:1221},{Pos:0,PosFix:true,BT:15,Num:1320},{Pos:0,PosFix:true,BT:15,Num:1321}],
                    [{Pos:0,PosFix:true,BT:15,Num:1420},{Pos:0,PosFix:true,BT:15,Num:1421},{Pos:0,PosFix:true,BT:15,Num:1422}],
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.3",
                item:[
                    [{Pos:0,PosFix:true,BT:15,Num:1230},{Pos:0,PosFix:true,BT:15,Num:1231},{Pos:0,PosFix:true,BT:15,Num:1330},{Pos:0,PosFix:true,BT:15,Num:1331}],
                    [{Pos:0,PosFix:true,BT:15,Num:1430},{Pos:0,PosFix:true,BT:15,Num:1431},{Pos:0,PosFix:true,BT:15,Num:1432}],
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.4",
                item:[
                    [{Pos:0,PosFix:true,BT:15,Num:1240},{Pos:0,PosFix:true,BT:15,Num:1241},{Pos:0,PosFix:true,BT:15,Num:1340},{Pos:0,PosFix:true,BT:15,Num:1341}],
                    [{Pos:0,PosFix:true,BT:15,Num:1440},{Pos:0,PosFix:true,BT:15,Num:1441},{Pos:0,PosFix:true,BT:15,Num:1442}],
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.5",
                item:[
                    [{Pos:0,PosFix:true,BT:15,Num:1250},{Pos:0,PosFix:true,BT:15,Num:1251},{Pos:0,PosFix:true,BT:15,Num:1350},{Pos:0,PosFix:true,BT:15,Num:1351}],
                    [{Pos:0,PosFix:true,BT:15,Num:1450},{Pos:0,PosFix:true,BT:15,Num:1451},{Pos:0,PosFix:true,BT:15,Num:1452}],
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.6",
                item:[
                    [{Pos:0,PosFix:true,BT:15,Num:1260},{Pos:0,PosFix:true,BT:15,Num:1261},{Pos:0,PosFix:true,BT:15,Num:1360},{Pos:0,PosFix:true,BT:15,Num:1361}],
                    [{Pos:0,PosFix:true,BT:15,Num:1460},{Pos:0,PosFix:true,BT:15,Num:1461},{Pos:0,PosFix:true,BT:15,Num:1462}],
                ]
            }
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.17.title",
        cont:[
            {
                title : "Game.MarkSix.Item.54.title",
                item:[
                    [{Pos:0,PosFix:true,BT:54,Num:0},{Pos:0,PosFix:true,BT:54,Num:1},{Pos:0,PosFix:true,BT:54,Num:2},{Pos:0,PosFix:true,BT:54,Num:3},{Pos:0,PosFix:true,BT:54,Num:4}]
                ]
            },
            {
                title : "Game.MarkSix.Item.68.title",
                item:[
                    [{Pos:0,PosFix:true,BT:68,Num:0},{Pos:0,PosFix:true,BT:68,Num:10},{Pos:0,PosFix:true,BT:68,Num:20},{Pos:0,PosFix:true,BT:68,Num:30},{Pos:0,PosFix:true,BT:68,Num:40},{Pos:0,PosFix:true,BT:68,Num:50}],
                    [{Pos:0,PosFix:true,BT:68,Num:1},{Pos:0,PosFix:true,BT:68,Num:11},{Pos:0,PosFix:true,BT:68,Num:21},{Pos:0,PosFix:true,BT:68,Num:31},{Pos:0,PosFix:true,BT:68,Num:41},{Pos:0,PosFix:true,BT:68,Num:51}]
                ]
            },
            {
                title : "Game.MarkSix.Item.55.title",
                item:[
                    [{Pos:0,PosFix:true,BT:55,Num:0},{Pos:0,PosFix:true,BT:55,Num:1},{Pos:0,PosFix:true,BT:55,Num:2},{Pos:0,PosFix:true,BT:55,Num:3},{Pos:0,PosFix:true,BT:55,Num:4},{Pos:0,PosFix:true,BT:55,Num:5}]
                ]
            },
            {
                title : "Game.MarkSix.Item.56.title",
                item:[
                    [{Pos:0,PosFix:true,BT:56,Num:0},{Pos:0,PosFix:true,BT:56,Num:1},{Pos:0,PosFix:true,BT:56,Num:2},{Pos:0,PosFix:true,BT:56,Num:3},{Pos:0,PosFix:true,BT:56,Num:4},{Pos:0,PosFix:true,BT:56,Num:5}]
                ]
            },
            {
                title : "Game.MarkSix.Item.69.title",
                item:[
                    [{Pos:0,PosFix:true,BT:69,Num:1},{Pos:0,PosFix:true,BT:69,Num:2},{Pos:0,PosFix:true,BT:69,Num:3},{Pos:0,PosFix:true,BT:69,Num:4},{Pos:0,PosFix:true,BT:69,Num:5},{Pos:0,PosFix:true,BT:69,Num:6}],
                    [{Pos:0,PosFix:true,BT:69,Num:7},{Pos:0,PosFix:true,BT:69,Num:8},{Pos:0,PosFix:true,BT:69,Num:9},{Pos:0,PosFix:true,BT:69,Num:10},{Pos:0,PosFix:true,BT:69,Num:11},{Pos:0,PosFix:true,BT:69,Num:12}]
                ]
            },
            {
                title : "Game.MarkSix.Item.70.title",
                item:[
                    [{Pos:0,PosFix:true,BT:70,Num:0},{Pos:0,PosFix:true,BT:70,Num:1},{Pos:0,PosFix:true,BT:70,Num:2},{Pos:0,PosFix:true,BT:70,Num:3},{Pos:0,PosFix:true,BT:70,Num:4}],
                    [{Pos:0,PosFix:true,BT:70,Num:5},{Pos:0,PosFix:true,BT:70,Num:6},{Pos:0,PosFix:true,BT:70,Num:7},{Pos:0,PosFix:true,BT:70,Num:8},{Pos:0,PosFix:true,BT:70,Num:9}]
                ]
            }            
        ]
    }
];
const D3:Layout =  [
    {
        name: "Game.3D.Menu.Group.0.title",
        cont: [
            {
                title : "Game.3D.Item.7.title",
                item: [
                    [{BT:9,Num:0},{BT:8,Num:0},{BT:36,Num:0}],
                    [{BT:9,Num:1},{BT:8,Num:1},{BT:36,Num:1}]
                ]
            },
            {
                title : "Game.3D.Item.4.title",
                item: [
                    [{BT:6,Num:0},{BT:5,Num:0},{BT:35,Num:0}],
                    [{BT:6,Num:1},{BT:5,Num:1},{BT:35,Num:1}]
                ]
            },
            {
                title : "Game.3D.Item.1.title",
                item: [
                    [{BT:3,Num:0},{BT:2,Num:0},{BT:34,Num:0}],
                    [{BT:3,Num:1},{BT:2,Num:1},{BT:34,Num:1}]
                ]
            },
            {
                title : "Game.3D.Item.46.title",
                item: [
                    [{BT:49,Num:0},{BT:49,Num:1}]
                ]
            },
            {
                title : "Game.3D.Item.45.title",
                item: [
                    [{BT:48,Num:0},{BT:48,Num:1}]
                ]
            },
            {
                title : "Game.3D.Item.44.title",
                item: [
                    [{BT:47,Num:0},{BT:47,Num:1}]
                ]
            },
            {
                title : "Game.3D.Item.52.title",
                item: [
                    [{BT:55,Num:0},{BT:55,Num:1},{BT:58,Num:1},{BT:58,Num:1}]
                ]
            },
            {
                title : "Game.3D.Item.51.title",
                item: [
                    [{BT:54,Num:0},{BT:54,Num:1},{BT:57,Num:1},{BT:57,Num:1}]
                ]
            },
            {
                title : "Game.3D.Item.50.title",
                item: [
                    [{BT:53,Num:0},{BT:53,Num:1},{BT:56,Num:1},{BT:56,Num:1}]
                ]
            },
            {
                title : "Game.3D.Item.11.title",
                item: [
                    [{BT:12,Num:0},{BT:12,Num:1},{BT:13,Num:0},{BT:13,Num:1}]
                ]
            }
        ]
    },
    {
        name:"Game.3D.Menu.Group.1.title",       
        cont:[
            {
                aBT:[10,7,4,1],
                fastSltItm:["Odd","Even","Big","Small","Clear"],
                sltedItem:0,
                start: 0,
                end:9,                
                item:getNums
            }
        ]
    },
    {
        name:"Game.3D.Menu.Group.2.title",
        cont:[
            {
                dgt: 2, //位數
                item:[
                    [{BT:17,Num:0},{BT:17,Num:1},{BT:17,Num:2},{BT:17,Num:3},{BT:17,Num:4},{BT:17,Num:5},{BT:17,Num:6},{BT:17,Num:7},{BT:17,Num:8},{BT:17,Num:9}],
                    [{BT:-1,Num:0},{BT:17,Num:11},{BT:17,Num:12},{BT:17,Num:13},{BT:17,Num:14},{BT:17,Num:15},{BT:17,Num:16},{BT:17,Num:17},{BT:17,Num:18},{BT:17,Num:19}],
                    [{BT:-1,Num:0},{BT:-1,Num:0},{BT:17,Num:22},{BT:17,Num:23},{BT:17,Num:24},{BT:17,Num:25},{BT:17,Num:26},{BT:17,Num:27},{BT:17,Num:28},{BT:17,Num:29}],
                    [{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:17,Num:33},{BT:17,Num:34},{BT:17,Num:35},{BT:17,Num:36},{BT:17,Num:37},{BT:17,Num:38},{BT:17,Num:39}],
                    [{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:17,Num:44},{BT:17,Num:45},{BT:17,Num:46},{BT:17,Num:47},{BT:17,Num:48},{BT:17,Num:49}],
                    [{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:17,Num:55},{BT:17,Num:56},{BT:17,Num:57},{BT:17,Num:58},{BT:17,Num:59}],
                    [{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:17,Num:66},{BT:17,Num:67},{BT:17,Num:68},{BT:17,Num:69}],
                    [{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:17,Num:77},{BT:17,Num:78},{BT:17,Num:79}],
                    [{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:17,Num:88},{BT:17,Num:89}],
                    [{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:-1,Num:0},{BT:17,Num:99}]
                ]
            }
        ]
    },
    {
        name:"Game.3D.Menu.Group.3.title",       
        cont:[
            {
                aBT:[14,15,16],
                sltedItem:0,
                start: 0,
                end:99,
                dgt: 2, //位數                
                item:getNums
            }
        ]
    },
    {
        name: "Game.3D.Menu.Group.4.title",
        cont: [
            {
                aBT:[44,45,46],
                sltedItem:0,
                start: 4,
                end:14,
                item:getNums
            }
        ]
    },
    {
        name: "Game.3D.Menu.Group.5.title",
        cont: [
            {
                aBT:[50,51,52],
                sltedItem:0,
                start: 0,
                end:9,
                dgt: 1, //位數
                item:getNums
            }
        ]
    },
    {
        name: "Game.3D.Menu.Group.6.title",
        cont: [
            {
                BT:42,
                FastSlt: {
                        title:'FastSlt.Box',
                        subcont:[
                            {
                                title: 'FastSlt.Hundreds',
                                subitem:[
                                    {num:0,isActive:true},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false},
                                    {num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}
                                ],
                                key: 'hundreds',
                                func:getNum3D
                            },
                            {
                                title: 'FastSlt.Tens',
                                subitem:[
                                    {num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false},
                                    {num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}
                                ],
                                key:'tens',
                                func:getNum3D
                            },
                            {
                                title: 'FastSlt.Units',
                                subitem:[
                                    {num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false},
                                    {num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}
                                ],
                                key:'units',
                                func:getNum3D
                            }                                                                        
                        ]
                    },
                sltedItem:0,
                dgt: 3, //位數
                //NumDuplicate:true,     //數字可以重複
                noSameNum: false,    //數字不可重複
                item:getNum3D('nuits',0,42)
            }
        ]
    },
    {
        name: "Game.3D.Menu.Group.7.title",
        cont: [
            {
                BT:43,
                dgt: 3, //位數
                sltedItem:0,
                //NumDuplicate:false,         //數字不可重複
                noSameNum: true,    //數字不可重複
                item:[
                    [{BT:43,Num:0},{BT:43,Num:1},{BT:43,Num:2},{BT:43,Num:3},{BT:43,Num:4},{BT:43,Num:5},{BT:43,Num:6},{BT:43,Num:7},{BT:43,Num:8},{BT:43,Num:9}],
                    [{BT:43,Num:11},{BT:43,Num:12},{BT:43,Num:13},{BT:43,Num:14},{BT:43,Num:15},{BT:43,Num:16},{BT:43,Num:17},{BT:43,Num:18},{BT:43,Num:19},{BT:43,Num:22}],
                    [{BT:43,Num:23},{BT:43,Num:24},{BT:43,Num:25},{BT:43,Num:26},{BT:43,Num:27},{BT:43,Num:28},{BT:43,Num:29},{BT:43,Num:33},{BT:43,Num:34},{BT:43,Num:35}],
                    [{BT:43,Num:36},{BT:43,Num:37},{BT:43,Num:38},{BT:43,Num:39},{BT:43,Num:44},{BT:43,Num:45},{BT:43,Num:46},{BT:43,Num:47},{BT:43,Num:48},{BT:43,Num:49}],
                    [{BT:43,Num:55},{BT:43,Num:56},{BT:43,Num:57},{BT:43,Num:58},{BT:43,Num:59},{BT:43,Num:66},{BT:43,Num:67},{BT:43,Num:68},{BT:43,Num:69},{BT:43,Num:77}],
                    [{BT:43,Num:78},{BT:43,Num:79},{BT:43,Num:88},{BT:43,Num:89},{BT:43,Num:99},{BT:43,Num:111},{BT:43,Num:112},{BT:43,Num:113},{BT:43,Num:114},{BT:43,Num:115}],
                    [{BT:43,Num:116},{BT:43,Num:117},{BT:43,Num:118},{BT:43,Num:119},{BT:43,Num:122},{BT:43,Num:123},{BT:43,Num:124},{BT:43,Num:125},{BT:43,Num:126},{BT:43,Num:127}],
                    [{BT:43,Num:128},{BT:43,Num:129},{BT:43,Num:133},{BT:43,Num:134},{BT:43,Num:135},{BT:43,Num:136},{BT:43,Num:137},{BT:43,Num:138},{BT:43,Num:139},{BT:43,Num:144}],
                    [{BT:43,Num:145},{BT:43,Num:146},{BT:43,Num:147},{BT:43,Num:148},{BT:43,Num:149},{BT:43,Num:155},{BT:43,Num:156},{BT:43,Num:157},{BT:43,Num:158},{BT:43,Num:159}],
                    [{BT:43,Num:166},{BT:43,Num:167},{BT:43,Num:168},{BT:43,Num:169},{BT:43,Num:177},{BT:43,Num:178},{BT:43,Num:179},{BT:43,Num:188},{BT:43,Num:189},{BT:43,Num:199}],
                    [{BT:43,Num:222},{BT:43,Num:223},{BT:43,Num:224},{BT:43,Num:225},{BT:43,Num:226},{BT:43,Num:227},{BT:43,Num:228},{BT:43,Num:229},{BT:43,Num:233},{BT:43,Num:234}],
                    [{BT:43,Num:235},{BT:43,Num:236},{BT:43,Num:237},{BT:43,Num:238},{BT:43,Num:239},{BT:43,Num:244},{BT:43,Num:245},{BT:43,Num:246},{BT:43,Num:247},{BT:43,Num:248}],
                    [{BT:43,Num:249},{BT:43,Num:255},{BT:43,Num:256},{BT:43,Num:257},{BT:43,Num:258},{BT:43,Num:259},{BT:43,Num:266},{BT:43,Num:267},{BT:43,Num:268},{BT:43,Num:269}],
                    [{BT:43,Num:277},{BT:43,Num:278},{BT:43,Num:279},{BT:43,Num:288},{BT:43,Num:289},{BT:43,Num:299},{BT:43,Num:333},{BT:43,Num:334},{BT:43,Num:335},{BT:43,Num:336}],
                    [{BT:43,Num:337},{BT:43,Num:338},{BT:43,Num:339},{BT:43,Num:344},{BT:43,Num:345},{BT:43,Num:346},{BT:43,Num:347},{BT:43,Num:348},{BT:43,Num:349},{BT:43,Num:355}],
                    [{BT:43,Num:356},{BT:43,Num:357},{BT:43,Num:358},{BT:43,Num:359},{BT:43,Num:366},{BT:43,Num:367},{BT:43,Num:368},{BT:43,Num:369},{BT:43,Num:377},{BT:43,Num:378}],
                    [{BT:43,Num:379},{BT:43,Num:388},{BT:43,Num:389},{BT:43,Num:399},{BT:43,Num:444},{BT:43,Num:445},{BT:43,Num:446},{BT:43,Num:447},{BT:43,Num:448},{BT:43,Num:449}],
                    [{BT:43,Num:455},{BT:43,Num:456},{BT:43,Num:457},{BT:43,Num:458},{BT:43,Num:459},{BT:43,Num:466},{BT:43,Num:467},{BT:43,Num:468},{BT:43,Num:469},{BT:43,Num:477}],
                    [{BT:43,Num:478},{BT:43,Num:479},{BT:43,Num:488},{BT:43,Num:489},{BT:43,Num:499},{BT:43,Num:555},{BT:43,Num:556},{BT:43,Num:557},{BT:43,Num:558},{BT:43,Num:559}],
                    [{BT:43,Num:566},{BT:43,Num:567},{BT:43,Num:568},{BT:43,Num:569},{BT:43,Num:577},{BT:43,Num:578},{BT:43,Num:579},{BT:43,Num:588},{BT:43,Num:589},{BT:43,Num:599}],
                    [{BT:43,Num:666},{BT:43,Num:667},{BT:43,Num:668},{BT:43,Num:669},{BT:43,Num:677},{BT:43,Num:678},{BT:43,Num:679},{BT:43,Num:688},{BT:43,Num:689},{BT:43,Num:699}],
                    [{BT:43,Num:777},{BT:43,Num:778},{BT:43,Num:779},{BT:43,Num:788},{BT:43,Num:789},{BT:43,Num:799},{BT:43,Num:888},{BT:43,Num:889},{BT:43,Num:899},{BT:43,Num:999}]
                ]
            }
        ]
    },
    {
        name: "Game.3D.Menu.Group.8.title",
        cont: [
            {
                aBT:[19,20,21,22],
                sltedItem:0,
                start: 0,
                end:9,
                item:getNums
            }
        ]
    },
    {
        name: "Game.3D.Menu.Group.9.title",
        cont: [
            {
                aBT:[23,24,25,26,27],
                sltedItem:0,
                start: 0,
                end:9,
                item:getNums
            }
        ]
    },
    {
        name: "Game.3D.Menu.Group.10.title",
        cont: [
            {
                aBT:[37,38,39],
                sltedItem:0,
                start: 0,
                end:7,
                item:getNums
            }
        ]
    },
    {
        name: "Game.3D.Menu.Group.11.title",
        cont: [
            {
                title : "Game.3D.Menu.Group.11.title",
                item: [
                    [{BT:59,Num:0},{BT:60,Num:0},{BT:61,Num:0}],
                    [{BT:63,Num:0},{BT:65,Num:0},{BT:18,Num:0}]
                ]
            },
            {
                title : "Game.3D.Item.11.title",
                item: [
                    [{BT:12,Num:0},{BT:12,Num:1},{BT:13,Num:0},{BT:13,Num:1}]
                ]
            }
        ]
    },
    {
        name: "Game.3D.Menu.Group.12.title",
        cont: [
            {
                aBT:[66,62,64,40,41],
                sltedItem:0,
                start: 0,
                end:9,
                dgt:1,
                item:getNums
            }
        ]
    }
];
const Happy:Layout =  [
    {
        name: "Game.Happy.Menu.Group.0.title",
        cont:[
            {
                title: "Game.Happy.Item.10.shortT",
                item:[
                    [{BT:10,Num:0},{BT:11,Num:0},{BT:12,Num:0}],
                    [{BT:10,Num:1},{BT:11,Num:1},{BT:12,Num:1}]
                ]
            },
            {
                title: "Game.Happy.Ball.1",
                item:[
                    [{BT:3,Num:10},{BT:2,Num:10},{BT:5,Num:10},{BT:4,Num:10},{BT:13,Num:10}],
                    [{BT:3,Num:11},{BT:2,Num:11},{BT:5,Num:11},{BT:4,Num:11},{BT:13,Num:11}]
                ]                
            },
            {
                title: "Game.Happy.Ball.2",
                item:[
                    [{BT:3,Num:20},{BT:2,Num:20},{BT:5,Num:20},{BT:4,Num:20},{BT:13,Num:20}],
                    [{BT:3,Num:21},{BT:2,Num:21},{BT:5,Num:21},{BT:4,Num:21},{BT:13,Num:21}]
                ]                
            },
            {
                title: "Game.Happy.Ball.3",
                item:[
                    [{BT:3,Num:30},{BT:2,Num:30},{BT:5,Num:30},{BT:4,Num:30},{BT:13,Num:30}],
                    [{BT:3,Num:31},{BT:2,Num:31},{BT:5,Num:31},{BT:4,Num:31},{BT:13,Num:31}]
                ]                
            },
            {
                title: "Game.Happy.Ball.4",
                item:[
                    [{BT:3,Num:40},{BT:2,Num:40},{BT:5,Num:40},{BT:4,Num:40},{BT:13,Num:40}],
                    [{BT:3,Num:41},{BT:2,Num:41},{BT:5,Num:41},{BT:4,Num:41},{BT:13,Num:41}]
                ]                
            },
            {
                title: "Game.Happy.Ball.5",
                item:[
                    [{BT:3,Num:50},{BT:2,Num:50},{BT:5,Num:50},{BT:4,Num:50},{BT:13,Num:50}],
                    [{BT:3,Num:51},{BT:2,Num:51},{BT:5,Num:51},{BT:4,Num:51},{BT:13,Num:51}]
                ]                
            },
            {
                title: "Game.Happy.Ball.6",
                item:[
                    [{BT:3,Num:60},{BT:2,Num:60},{BT:5,Num:60},{BT:4,Num:60},{BT:13,Num:60}],
                    [{BT:3,Num:61},{BT:2,Num:61},{BT:5,Num:61},{BT:4,Num:61},{BT:13,Num:61}]
                ]                
            },
            {
                title: "Game.Happy.Ball.7",
                item:[
                    [{BT:3,Num:70},{BT:2,Num:70},{BT:5,Num:70},{BT:4,Num:70},{BT:13,Num:70}],
                    [{BT:3,Num:71},{BT:2,Num:71},{BT:5,Num:71},{BT:4,Num:71},{BT:13,Num:71}]
                ]                
            },
            {
                title: "Game.Happy.Ball.8",
                item:[
                    [{BT:3,Num:80},{BT:2,Num:80},{BT:5,Num:80},{BT:4,Num:80},{BT:13,Num:80}],
                    [{BT:3,Num:81},{BT:2,Num:81},{BT:5,Num:81},{BT:4,Num:81},{BT:13,Num:81}]
                ]                
            }
        ]
    },
    {
        name: "Game.Happy.Menu.Group.1.title",
        cont: [
            {
                BT:1,
                Selects: [
                    "Game.Happy.Ball.1",
                    "Game.Happy.Ball.2",
                    "Game.Happy.Ball.3",
                    "Game.Happy.Ball.4",
                    "Game.Happy.Ball.5",
                    "Game.Happy.Ball.6",
                    "Game.Happy.Ball.7",
                    "Game.Happy.Ball.8",
                ],
                items:[ 
                    getNums(1,20,1,100,[
                        [{BT:3,Num:10},{BT:3,Num:11},{BT:2,Num:10},{BT:2,Num:11},{BT:5,Num:10},{BT:5,Num:11},{BT:4,Num:10},{BT:4,Num:11},{BT:13,Num:10},{BT:13,Num:11}],
                        [{BT:7,Num:10},{BT:7,Num:11},{BT:7,Num:12},{BT:7,Num:13},{BT:9,Num:10},{BT:9,Num:11},{BT:9,Num:12}]

                    ]),
                    getNums(2,20,1,100,[
                        [{BT:3,Num:20},{BT:3,Num:21},{BT:2,Num:20},{BT:2,Num:21},{BT:5,Num:20},{BT:5,Num:21},{BT:4,Num:20},{BT:4,Num:21},{BT:13,Num:20},{BT:13,Num:21}],
                        [{BT:7,Num:20},{BT:7,Num:21},{BT:7,Num:22},{BT:7,Num:23},{BT:9,Num:20},{BT:9,Num:21},{BT:9,Num:22}]
                    ]),
                    getNums(3,20,1,100,[
                        [{BT:3,Num:30},{BT:3,Num:31},{BT:2,Num:30},{BT:2,Num:31},{BT:5,Num:30},{BT:5,Num:31},{BT:4,Num:30},{BT:4,Num:31},{BT:13,Num:30},{BT:13,Num:31}],
                        [{BT:7,Num:30},{BT:7,Num:31},{BT:7,Num:32},{BT:7,Num:33},{BT:9,Num:30},{BT:9,Num:31},{BT:9,Num:32}]
                    ]),
                    getNums(4,20,1,100,[
                        [{BT:3,Num:40},{BT:3,Num:41},{BT:2,Num:40},{BT:2,Num:41},{BT:5,Num:40},{BT:5,Num:41},{BT:4,Num:40},{BT:4,Num:41},{BT:13,Num:40},{BT:13,Num:41}],
                        [{BT:7,Num:40},{BT:7,Num:41},{BT:7,Num:42},{BT:7,Num:43},{BT:9,Num:40},{BT:9,Num:41},{BT:9,Num:42}]
                    ]),
                    getNums(5,20,1,100,[
                        [{BT:3,Num:50},{BT:3,Num:51},{BT:2,Num:50},{BT:2,Num:51},{BT:5,Num:50},{BT:5,Num:51},{BT:4,Num:50},{BT:4,Num:51},{BT:13,Num:50},{BT:13,Num:51}],
                        [{BT:7,Num:50},{BT:7,Num:51},{BT:7,Num:52},{BT:7,Num:53},{BT:9,Num:50},{BT:9,Num:51},{BT:9,Num:52}]
                    ]),
                    getNums(6,20,1,100,[
                        [{BT:3,Num:60},{BT:3,Num:61},{BT:2,Num:60},{BT:2,Num:61},{BT:5,Num:60},{BT:5,Num:61},{BT:4,Num:60},{BT:4,Num:61},{BT:13,Num:60},{BT:13,Num:61}],
                        [{BT:7,Num:60},{BT:7,Num:61},{BT:7,Num:62},{BT:7,Num:63},{BT:9,Num:60},{BT:9,Num:61},{BT:9,Num:62}]
                    ]),
                    getNums(7,20,1,100,[
                        [{BT:3,Num:70},{BT:3,Num:71},{BT:2,Num:70},{BT:2,Num:71},{BT:5,Num:70},{BT:5,Num:71},{BT:4,Num:70},{BT:4,Num:71},{BT:13,Num:70},{BT:13,Num:71}],
                        [{BT:7,Num:70},{BT:7,Num:71},{BT:7,Num:72},{BT:7,Num:73},{BT:9,Num:70},{BT:9,Num:71},{BT:9,Num:72}]
                    ]),
                    getNums(8,20,1,100,[
                        [{BT:3,Num:80},{BT:3,Num:81},{BT:2,Num:80},{BT:2,Num:81},{BT:5,Num:80},{BT:5,Num:81},{BT:4,Num:80},{BT:4,Num:81},{BT:13,Num:80},{BT:13,Num:81}],
                        [{BT:7,Num:80},{BT:7,Num:81},{BT:7,Num:82},{BT:7,Num:83},{BT:9,Num:80},{BT:9,Num:81},{BT:9,Num:82}]
                    ]),
                ]
            }
        ]
    },
    {
        name: "Game.Happy.Menu.Group.2.title",
        cont:[
            {
                item:getNums(14,20,1)
            }
        ]
    },
    {
        name: "Game.Happy.Menu.Group.3.title",
        cont: [
            {
                aBT: [15,16,17,18,19,20],
                sltedItem:0,
                start: 1,
                end:20,                
                item: getNums                
            }
        ]

    }
];
const Cars:Layout = [
    {
        name: "Game.Cars.Menu.Group.0.title",
        cont:[
            {
                item:[
                    [{BT:5,Num:0},{BT:5,Num:1},{BT:6,Num:0},{BT:6,Num:1}],
                    [{BT:2,Num:10},{BT:2,Num:11},{BT:3,Num:10},{BT:3,Num:11}],
                    [{BT:2,Num:20},{BT:2,Num:21},{BT:3,Num:20},{BT:3,Num:21}],
                    [{BT:2,Num:30},{BT:2,Num:31},{BT:3,Num:30},{BT:3,Num:31}],
                    [{BT:2,Num:40},{BT:2,Num:41},{BT:3,Num:40},{BT:3,Num:41}],
                    [{BT:2,Num:50},{BT:2,Num:51},{BT:3,Num:50},{BT:3,Num:51}],
                    [{BT:2,Num:60},{BT:2,Num:61},{BT:3,Num:60},{BT:3,Num:61}],
                    [{BT:2,Num:70},{BT:2,Num:71},{BT:3,Num:70},{BT:3,Num:71}],
                    [{BT:2,Num:80},{BT:2,Num:81},{BT:3,Num:80},{BT:3,Num:81}],
                    [{BT:2,Num:90},{BT:2,Num:91},{BT:3,Num:90},{BT:3,Num:91}],
                    [{BT:2,Num:100},{BT:2,Num:101},{BT:3,Num:100},{BT:3,Num:101}],
                    [{BT:4,Num:10},{BT:4,Num:20},{BT:4,Num:30},{BT:4,Num:40},{BT:4,Num:50}],
                    [{BT:4,Num:11},{BT:4,Num:21},{BT:4,Num:31},{BT:4,Num:41},{BT:4,Num:51}]
                ]
            }
        ]
    },
    {    
        name: "Game.Cars.Menu.Group.1.title",
        cont: [
            {
                Selects: [
                    "Game.Cars.Ball.1",
                    "Game.Cars.Ball.2",
                    "Game.Cars.Ball.3",
                    "Game.Cars.Ball.4",
                    "Game.Cars.Ball.5",
                    "Game.Cars.Ball.6",
                    "Game.Cars.Ball.7",
                    "Game.Cars.Ball.8",
                    "Game.Cars.Ball.9",
                    "Game.Cars.Ball.10",
                ],
                items:[ 
                        getNums(1,10,1,10,[
                            [{BT:2,Num:10},{BT:2,Num:11}],
                            [{BT:3,Num:10},{BT:3,Num:11}],
                            [{BT:4,Num:10},{BT:4,Num:11}]
                        ]),
                        getNums(2,10,1,10,
                            [
                                [{BT:2,Num:20},{BT:2,Num:21}],
                                [{BT:3,Num:20},{BT:3,Num:21}],
                                [{BT:4,Num:20},{BT:4,Num:21}]
                            ]),
                        getNums(3,10,1,10,
                            [
                                [{BT:2,Num:30},{BT:2,Num:31}],
                                [{BT:3,Num:30},{BT:3,Num:31}],
                                [{BT:4,Num:30},{BT:4,Num:31}]
                            ]),
                        getNums(4,10,1,10,
                            [
                                [{BT:2,Num:40},{BT:2,Num:41}],
                                [{BT:3,Num:40},{BT:3,Num:41}],
                                [{BT:4,Num:40},{BT:4,Num:41}]
                            ]),
                        getNums(5,10,1,10,
                            [
                                [{BT:2,Num:50},{BT:2,Num:51}],
                                [{BT:3,Num:50},{BT:3,Num:51}],
                                [{BT:4,Num:50},{BT:4,Num:51}]
                            ]),
                        getNums(6,10,1,10,
                            [
                                [{BT:2,Num:60},{BT:2,Num:61}],
                                [{BT:3,Num:60},{BT:3,Num:61}]
                            ]),
                        getNums(7,10,1,10,
                            [
                                [{BT:2,Num:70},{BT:2,Num:71}],
                                [{BT:3,Num:70},{BT:3,Num:71}]
                            ]),
                        getNums(8,10,1,10,
                            [
                                [{BT:2,Num:80},{BT:2,Num:81}],
                                [{BT:3,Num:80},{BT:3,Num:81}]
                            ]),
                        getNums(9,10,1,10,
                            [
                                [{BT:2,Num:90},{BT:2,Num:91}],
                                [{BT:3,Num:90},{BT:3,Num:91}]
                            ]),
                        getNums(10,10,1,10,
                            [
                                [{BT:2,Num:100},{BT:2,Num:101}],
                                [{BT:3,Num:100},{BT:3,Num:101}]
                            ]),
                ]
            }
        ]
    },
    {
        name:"Game.Cars.Menu.Group.2.title",
        cont: [
            {
                Selects:[],
                items:[
                    getNums(7,19,3,0,
                        [[{BT:5,Num:0},{BT:5,Num:1}]])
                ] 
            }
        ]
    },
    {
        name: "Game.Cars.Menu.Group.3.title",
        cont: [
            {
                aBT: [8,9,10],
                sltedItem:0,
                start: 1,
                end:10,                
                item: getNums                
            }
        ]               
    }
];
const Always:Layout = [
    {
        name: "Game.Always.Menu.Group.0.title",
        cont:[
            {
                title: "Game.Always.Item.5.title",
                subtitle: "Game.Always.Item.7.title",
                item:[
                    [{BT:5,Num:0},{BT:6,Num:0},{BT:7,Num:0},{BT:8,Num:0}],
                    [{BT:5,Num:1},{BT:6,Num:1},{BT:7,Num:1}]
                ]
            },
            {
                title: "Game.Always.Ball.1",
                item:[
                    [{BT:2,Num:10},{BT:2,Num:11},{BT:3,Num:10},{BT:3,Num:11}]
                ]                
            },
            {
                title: "Game.Always.Ball.2",
                item:[
                    [{BT:2,Num:20},{BT:2,Num:21},{BT:3,Num:20},{BT:3,Num:21}]
                ]                
            },
            {
                title: "Game.Always.Ball.3",
                item:[
                    [{BT:2,Num:30},{BT:2,Num:31},{BT:3,Num:30},{BT:3,Num:31}]
                ]                
            },
            {
                title: "Game.Always.Ball.4",
                item:[
                    [{BT:2,Num:40},{BT:2,Num:41},{BT:3,Num:40},{BT:3,Num:41}]
                ]
            },
            {
                title: "Game.Always.Ball.5",
                item:[
                    [{BT:2,Num:50},{BT:2,Num:51},{BT:3,Num:50},{BT:3,Num:51}]
                ]
            }
        ]
    },
    {
        name: "Game.Always.Menu.Group.1.title",
        cont: [
            {
                BT:1,
                Selects: [
                    "Game.Always.Ball.1",
                    "Game.Always.Ball.2",
                    "Game.Always.Ball.3",
                    "Game.Always.Ball.4",
                    "Game.Always.Ball.5",
                ],
                fastSltItm:["Odd","Even","Big","Small","Clear"],
                start: 0,
                end:9,                
                items:[ 
                    getNums(1,9,0,10,[[{BT:2,Num:10},{BT:2,Num:11},{BT:3,Num:10},{BT:3,Num:11}]]),
                    getNums(2,9,0,10,[[{BT:2,Num:20},{BT:2,Num:21},{BT:3,Num:20},{BT:3,Num:21}]]),
                    getNums(3,9,0,10,[[{BT:2,Num:30},{BT:2,Num:31},{BT:3,Num:30},{BT:3,Num:31}]]),
                    getNums(4,9,0,10,[[{BT:2,Num:40},{BT:2,Num:41},{BT:3,Num:40},{BT:3,Num:41}]]),
                    getNums(5,9,0,10,[[{BT:2,Num:50},{BT:2,Num:51},{BT:3,Num:50},{BT:3,Num:51}]])
                ]
            }
        ]
    },
    {
        name: "Game.Always.Menu.Group.2.title",
        cont: [
            {
                title: "Game.Always.Item.12.title",
                item:[
                    [{BT:12,Num:1},{BT:12,Num:2},{BT:12,Num:3},{BT:12,Num:4},{BT:12,Num:5}]
                ]
            },
            {
                title: "Game.Always.Item.13.title",
                item:[
                    [{BT:13,Num:1},{BT:13,Num:2},{BT:13,Num:3},{BT:13,Num:4},{BT:13,Num:5}]
                ]
            },
            {
                title: "Game.Always.Item.14.title",
                item:[
                    [{BT:14,Num:1},{BT:14,Num:2},{BT:14,Num:3},{BT:14,Num:4},{BT:14,Num:5}]
                ]
            }                        
        ]

    }
];
const Speed3:Layout=[
    {
        name: "Game.Speed3.Menu.Group.0.title",
        cont:[
            {
                item:[
                    [{BT:2,Num:0},{BT:2,Num:1},{BT:4,Num:0}],
                ]
            }
        ]
    },
    {
        name: "Game.Speed3.Menu.Group.1.title",
        cont: [
            {
                item:[
                    [{BT:1,Num:1},{BT:1,Num:2},{BT:1,Num:3}],
                    [{BT:1,Num:4},{BT:1,Num:5},{BT:1,Num:6}]
                ]                
            }
        ]
    },
    {
        name: "Game.Speed3.Menu.Group.2.title",
        cont: [
            {
                item:[
                    [{BT:3,Num:1},{BT:3,Num:2},{BT:3,Num:3}],
                    [{BT:3,Num:4},{BT:3,Num:5},{BT:3,Num:6}]
                ]                
            }                       
        ]
    },
    {
        name: "Game.Speed3.Menu.Group.3.title",
        cont: [
            {
                item:[
                    [{BT:7,Num:1},{BT:7,Num:2},{BT:7,Num:3}],
                    [{BT:7,Num:4},{BT:7,Num:5},{BT:7,Num:6}]
                ]                
            }
        ]
    },
    {
        name: "Game.Speed3.Menu.Group.4.title",
        cont: [
            {
                item:[
                    [{BT:5,Num:4},{BT:5,Num:5},{BT:5,Num:6},{BT:5,Num:7},{BT:5,Num:8}],
                    [{BT:5,Num:9},{BT:5,Num:10},{BT:5,Num:11},{BT:5,Num:12},{BT:5,Num:13}],
                    [{BT:5,Num:14},{BT:5,Num:15},{BT:5,Num:16},{BT:5,Num:17}]
                ]
            }
        ]
    },
    {
        name: "Game.Speed3.Menu.Group.5.title",
        cont: [
            {
                item:[
                    [{BT:6,Num:0},{BT:6,Num:1},{BT:6,Num:2},{BT:6,Num:3},{BT:6,Num:4}],
                    [{BT:6,Num:5},{BT:6,Num:6},{BT:6,Num:7},{BT:6,Num:8},{BT:6,Num:9}],
                    [{BT:6,Num:10},{BT:6,Num:11},{BT:6,Num:12},{BT:6,Num:13},{BT:6,Num:14}]
                ]
            }
        ]
    }    
]
const Happy8:Layout=[
    {
        name: "Game.Happy8.Menu.Group.0.title",
        cont:[
            {
                title : "Game.Happy8.Item.2.shortT",
                item:[
                    [{BT:2,Num:0},{BT:2,Num:1},{BT:3,Num:0},{BT:3,Num:1},{BT:4,Num:0}],
                    [{BT:5,Num:0},{BT:5,Num:1},{BT:5,Num:2},{BT:5,Num:3}]
                ]
            },
            {
                title : "Game.Happy8.Item.6.title",
                item:[
                    [{BT:6,Num:0},{BT:6,Num:1},{BT:6,Num:2}]
                ]                
            },
            {
                title : "Game.Happy8.Item.7.title",
                item:[
                    [{BT:7,Num:0},{BT:7,Num:1},{BT:7,Num:2}]
                ]                
            },
            {
                title : "Game.Happy8.Item.8.title",
                item:[
                    [{BT:8,Num:0},{BT:8,Num:1},{BT:8,Num:2},{BT:8,Num:3},{BT:8,Num:4}]
                ]                
            }
        ]
    },
    {
        name: "Game.Happy8.Menu.Group.1.title",
        cont: [
            {
                item:getNums(1,80,1)
            }
        ]
    }    
]
const BTCHash:Layout=[
    {
        name: "Game.BTCHash.Menu.Group.0.title",
        cont:[
            {
                title : "Game.BTCHash.Item.1.sctitle.0",
                item:[
                    [{BT:1,Num:0},{BT:1,Num:1},{BT:6,Num:0},{BT:6,Num:1},{BT:11,Num:0},{BT:11,Num:1}]
                ]
            },
            {
                title : "Game.BTCHash.Item.2.sctitle.0",
                item:[
                    [{BT:2,Num:0},{BT:2,Num:1},{BT:7,Num:0},{BT:7,Num:1},{BT:12,Num:0},{BT:12,Num:1}]
                ]
            },
            {
                title : "Game.BTCHash.Item.3.sctitle.0",
                item:[
                    [{BT:3,Num:0},{BT:3,Num:1},{BT:8,Num:0},{BT:8,Num:1},{BT:13,Num:0},{BT:13,Num:1}]
                ]
            },
            {
                title : "Game.BTCHash.Item.4.sctitle.0",
                item:[
                    [{BT:4,Num:0},{BT:4,Num:1},{BT:9,Num:0},{BT:9,Num:1},{BT:14,Num:0},{BT:14,Num:1}]
                ]
            },
            {
                title : "Game.BTCHash.Item.5.sctitle.0",
                item:[
                    [{BT:5,Num:0},{BT:5,Num:1},{BT:10,Num:0},{BT:10,Num:1},{BT:15,Num:0},{BT:15,Num:1}]
                ]
            },
            {
                title : "Game.BTCHash.Item.16.sctitle.0",
                item:[
                    [{BT:16,Num:0},{BT:16,Num:1},{BT:17,Num:0},{BT:17,Num:1}]
                ]
            },
            {
                title : "Game.BTCHash.Item.18.sctitle.0",
                item:[
                    [{BT:18,Num:0},{BT:18,Num:1},{BT:19,Num:0},{BT:19,Num:1}]
                ]
            },
            {
                title : "Game.BTCHash.Item.20.sctitle.0",
                item:[
                    [{BT:20,Num:0},{BT:20,Num:1},{BT:21,Num:0},{BT:21,Num:1}]
                ]
            },
            {
                title : "Game.BTCHash.Item.22.sctitle.0",
                item:[
                    [{BT:22,Num:0},{BT:22,Num:1},{BT:23,Num:0},{BT:23,Num:1}]
                ]
            },
        ]
    },
    {
        name: "Game.BTCHash.Menu.Group.1.title",
        cont:[
            {
                colorWave: true,
                aBT:[24,25,26,27,28],
                sltedItem:0,
                start: 0,
                end:9,                
                item:getNums
            }
        ]
    },
    {
        name: "Game.BTCHash.Menu.Group.2.title",
        cont:[
            {
                colorWave: true,
                aBT:[29,30,31,32],
                sltedItem:0,
                start: 0,
                end:9,                
                item:getNums
            }
        ]
    },
    {
        name:"Game.BTCHash.Menu.Group.3.title",       
        cont:[
            {
                dgt: 2, //位數
                Selects: [
                    "Game.BTCHash.Item.33.title",
                    "Game.BTCHash.Item.34.title",
                    "Game.BTCHash.Item.35.title",
                    "Game.BTCHash.Item.36.title",
                ],          
                items:[
                    //getTwoDgt(33),
                    //getTwoDgt(34),
                    //getTwoDgt(35),
                    //getTwoDgt(36),
                ]
            }
        ]
    },
    {
        name:"Game.BTCHash.Menu.Group.4.title",       
        cont:[
            {
                dgt: 3, //位數
                Selects: [
                    "Game.BTCHash.Item.37.title",
                    "Game.BTCHash.Item.38.title",
                    "Game.BTCHash.Item.39.title",
                    "Game.BTCHash.Item.40.title",
                ],          
                items:[
                    //getThreeDgt(37),
                    //getThreeDgt(38),
                    //getThreeDgt(39),
                    //getThreeDgt(40),
                ]
            }
        ]
    },
    {
        name:"Game.BTCHash.Menu.Group.5.title",
        cont:[
            {
                dgt: 4, //位數
                item:[
                    [{BT:41,Num:0}]
                ]
            }
        ]
    },
    {
        name:"Game.BTCHash.Menu.Group.6.title",       
        cont:[
            {
                dgt: 5, //位數
                item:[
                    [{BT:42,Num:0}]
                ]
            }
        ]
    },
    {
        name: "Game.BTCHash.Menu.Group.7.title",
        cont:[
            {
                title : "Game.BTCHash.Item.43.sctitle.0",
                item:[
                    [{BT:43,Num:0},{BT:43,Num:1},{BT:43,Num:2},{BT:43,Num:3},{BT:43,Num:4}]
                ]
            },
            {
                title : "Game.BTCHash.Item.44.sctitle.0",
                item:[
                    [{BT:44,Num:0},{BT:44,Num:1},{BT:44,Num:2},{BT:44,Num:3},{BT:44,Num:4}]
                ]
            },
            {
                title : "Game.BTCHash.Item.45.sctitle.0",
                item:[
                    [{BT:45,Num:0},{BT:45,Num:1},{BT:45,Num:2},{BT:45,Num:3},{BT:45,Num:4}]
                ]
            },
            {
                title : "Game.BTCHash.Item.46.title",
                item:[
                    [{BT:46,Num:0},{BT:46,Num:1},{BT:46,Num:2},{BT:46,Num:3},{BT:46,Num:4},{BT:46,Num:5}]
                ]
            }
        ]
    },
    {
        name: "Game.BTCHash.Menu.Group.8.title",
        cont:[
            {
                title : "Game.BTCHash.Item.1.sctitle.0",
                item:[
                    [{BT:47,Num:10},{BT:47,Num:11},{BT:47,Num:60},{BT:47,Num:61},{BT:47,Num:110},{BT:47,Num:111}]
                ]
            },
            {
                title : "Game.BTCHash.Item.2.sctitle.0",
                item:[
                    [{BT:47,Num:20},{BT:47,Num:21},{BT:47,Num:70},{BT:47,Num:71},{BT:47,Num:120},{BT:47,Num:121}]
                ]
            },
            {
                title : "Game.BTCHash.Item.3.sctitle.0",
                item:[
                    [{BT:47,Num:30},{BT:47,Num:31},{BT:47,Num:80},{BT:47,Num:81},{BT:47,Num:130},{BT:47,Num:131}]
                ]
            },
            {
                title : "Game.BTCHash.Item.4.sctitle.0",
                item:[
                    [{BT:47,Num:40},{BT:47,Num:41},{BT:47,Num:90},{BT:47,Num:91},{BT:47,Num:140},{BT:47,Num:141}]
                ]
            },
            {
                title : "Game.BTCHash.Item.5.sctitle.0",
                item:[
                    [{BT:47,Num:50},{BT:47,Num:51},{BT:47,Num:100},{BT:47,Num:101},{BT:47,Num:150},{BT:47,Num:151}]
                ]
            }
        ]
    }
]
const HashSix:Layout=[
    { 
        name: "Game.HashSix.Menu.Group.0.title", 
        cont:[
            {
            title : "Game.HashSix.Item.5.title",
            subtitle: "Game.HashSix.TitleSP.SNO.1",
            item:[
                [{BT:5,Num:0},{BT:5,Num:1},{BT:6,Num:0},{BT:6,Num:1}]
            ]
        },
            {
            title : "Game.HashSix.Item.21.title",
            item:[
                [{BT:13,Num:10},{BT:12,Num:10},{BT:27,Num:10}],
                [{BT:13,Num:11},{BT:12,Num:11},{BT:27,Num:11}]
            ]
        },
        {
            title : "Game.HashSix.Item.22.title",
            item:[
                [{BT:13,Num:20},{BT:12,Num:20},{BT:27,Num:20}],
                [{BT:13,Num:21},{BT:12,Num:21},{BT:27,Num:21}]
            ]
        },
        {
            title : "Game.HashSix.Item.23.title",
            item:[
                [{BT:13,Num:30},{BT:12,Num:30},{BT:27,Num:30}],
                [{BT:13,Num:31},{BT:12,Num:31},{BT:27,Num:31}]
            ]
        },
        {
            title : "Game.HashSix.Item.24.title",
            item:[
                [{BT:13,Num:40},{BT:12,Num:40},{BT:27,Num:40}],
                [{BT:13,Num:41},{BT:12,Num:41},{BT:27,Num:41}]
            ]
        },
        {
            title : "Game.HashSix.Item.24.title",
            item:[
                [{BT:13,Num:50},{BT:12,Num:50},{BT:27,Num:50}],
                [{BT:13,Num:51},{BT:12,Num:51},{BT:27,Num:51}]
            ]
        },
        {
            title : "Game.HashSix.Item.26.title",
            item:[
                [{BT:13,Num:60},{BT:12,Num:60},{BT:27,Num:60}],
                [{BT:13,Num:61},{BT:12,Num:61},{BT:27,Num:61}]
            ]
        },
        ]
    }, //title: '兩面盤', SubItem: [] 
    { 
        name: "Game.HashSix.Menu.Group.1.title",
        cont:[
            {
                colorWave: true,
                aBT: [4,21,22,23,24,25,26],
                sltedItem:0,
                start: 0,
                end:49,
                item: getNums
            }
        ]
    }, // title: '正碼', BT: 4, SubItem: [], SubMenu: []
    { 
        name: "Game.HashSix.Menu.Group.2.title", 
        cont:[
            {
                aBT: [9,7,8,79,80,81],
                twOdds:[0,0,1,1,1,1],
                sltedItem:0,
                start: 0,
                end:49,
                item: getNums
            }
        ]
    }, //title: '連碼', SubMenu: [] 6+9+55555+32+
    { 
        name: "Game.HashSix.Menu.Group.3.title", 
        cont:[
            {
                aBT: [31,48,49,50,51,52],
                sltedItem:0,
                start: 0,
                end:49,
                item: getNums
            }            
        ]
    }, //title: '不中', SubMenu: []
    { 
        name: "Game.HashSix.Menu.Group.4.title", 
        cont:[
            {
                aBT: [71,57,58,59,60,61,62,63,64,65,66,67],
                sltedItem:0,
                start: 0,
                end:49,
                item: getNums
            }             
        ]
    }, // title: '多選', SubMenu: [] 
    { 
        name: "Game.HashSix.Menu.Group.5.title", 
        cont:[
            {
                aBT: [20,38,39,40,46,41,42,43,47,70],
                sltedItem:0,
                start: 0,
                end:9,
                item: getNums
            }             
        ]
    }, //title: '尾數', SubMenu: []
    { 
        name: "Game.HashSix.Menu.Group.6.title", 
        cont:[
            {
                title : "Game.HashSix.Item.21.title",
                colorWave: true,
                colorExt: 0,                
                item:[
                    [{BT:14,Num:10},{BT:14,Num:11},{BT:14,Num:12}]
                ]
            },            
            {
                title : "Game.HashSix.Item.22.title",
                colorWave: true,
                colorExt: 0,                
                item:[
                    [{BT:14,Num:20},{BT:14,Num:21},{BT:14,Num:22}]
                ]
            },
            {
                title : "Game.HashSix.Item.23.title",
                colorWave: true,
                colorExt: 0,
                item:[
                    [{BT:14,Num:30},{BT:14,Num:31},{BT:14,Num:32}]
                ]
            },
            {
                title : "Game.HashSix.Item.24.title",
                colorWave: true,
                colorExt: 0,
                item:[
                    [{BT:14,Num:40},{BT:14,Num:41},{BT:14,Num:42}]
                ]
            },
            {
                title : "Game.HashSix.Item.25.title",
                colorWave: true,
                colorExt: 0,
                item:[
                    [{BT:14,Num:50},{BT:14,Num:51},{BT:14,Num:52}]
                ]
            },
            {
                title : "Game.HashSix.Item.26.title",
                colorWave: true,
                colorExt: 0,
                item:[
                    [{BT:14,Num:60},{BT:14,Num:61},{BT:14,Num:62}]
                ]
            },
        ]
    }, //title: '色波', SubMenu: []
    { 
        name: "Game.HashSix.Menu.Group.7.title", 
        cont:[
            {
                title : "Game.HashSix.Item.21.title",
                colorWave: true,
                colorExt: 1,    
                item:[
                    [{BT:82,Num:100},{BT:82,Num:101},{BT:82,Num:102},{BT:82,Num:103}],
                    [{BT:82,Num:104},{BT:82,Num:105},{BT:82,Num:106},{BT:82,Num:107}],
                    [{BT:82,Num:108},{BT:82,Num:109},{BT:82,Num:110},{BT:82,Num:111}]
                ]
            },
            {
                title : "Game.HashSix.Item.22.title",
                colorWave: true,
                colorExt: 1,    
                item:[
                    [{BT:82,Num:200},{BT:82,Num:201},{BT:82,Num:202},{BT:82,Num:203}],
                    [{BT:82,Num:204},{BT:82,Num:205},{BT:82,Num:206},{BT:82,Num:207}],
                    [{BT:82,Num:208},{BT:82,Num:209},{BT:82,Num:210},{BT:82,Num:211}]
                ]
            },
            {
                title : "Game.HashSix.Item.23.title",
                colorWave: true,
                colorExt: 1,    
                item:[
                    [{BT:82,Num:300},{BT:82,Num:301},{BT:82,Num:302},{BT:82,Num:303}],
                    [{BT:82,Num:304},{BT:82,Num:305},{BT:82,Num:306},{BT:82,Num:307}],
                    [{BT:82,Num:308},{BT:82,Num:309},{BT:82,Num:310},{BT:82,Num:311}]
                ]
            },
            {
                title : "Game.HashSix.Item.24.title",
                colorWave: true,
                colorExt: 1,    
                item:[
                    [{BT:82,Num:400},{BT:82,Num:401},{BT:82,Num:402},{BT:82,Num:403}],
                    [{BT:82,Num:404},{BT:82,Num:405},{BT:82,Num:406},{BT:82,Num:407}],
                    [{BT:82,Num:408},{BT:82,Num:409},{BT:82,Num:410},{BT:82,Num:411}]
                ]
            },
            {
                title : "Game.HashSix.Item.25.title",
                colorWave: true,
                colorExt: 1,    
                item:[
                    [{BT:82,Num:500},{BT:82,Num:501},{BT:82,Num:502},{BT:82,Num:503}],
                    [{BT:82,Num:504},{BT:82,Num:505},{BT:82,Num:506},{BT:82,Num:507}],
                    [{BT:82,Num:508},{BT:82,Num:509},{BT:82,Num:510},{BT:82,Num:511}]
                ]
            },
            {
                title : "Game.HashSix.Item.26.title",
                colorWave: true,
                colorExt: 1,    
                item:[
                    [{BT:82,Num:600},{BT:82,Num:601},{BT:82,Num:602},{BT:82,Num:603}],
                    [{BT:82,Num:604},{BT:82,Num:605},{BT:82,Num:606},{BT:82,Num:607}],
                    [{BT:82,Num:608},{BT:82,Num:609},{BT:82,Num:610},{BT:82,Num:611}]
                ]
            },
        ]
    }, //title: '半波', SubMenu: []
    { 
        name: "Game.HashSix.Menu.Group.8.title", 
        cont:[
            {
                aBT:[19,32,33,34,44,69,35,36,37,45],
                sltedItem: 0,
                start: 1,
                end:12,
                item: getNums
            }
        ]
    }, //title: '生肖', SubMenu: []
    { 
        name: "Game.HashSix.Menu.Group.9.title", 
        cont:[
            {
                aBT:[83,84,85,86,87,88],
                sltedItem: 0,
                start: 1,
                end:12,
                Position: [1,2,3,4,5,6],
                PosSelected:[1,1,1,1,1,1],
                item: getAZNums
            }
        ]
    }, //title: '正碼特生肖', SubMenu: []
    { 
        name: "Game.HashSix.Menu.Group.10.title", 
        cont:[
            {
                item:[
                    [{BT:53,Num:0},{BT:53,Num:13},{BT:53,Num:14},{BT:53,Num:27}],
                    [{BT:53,Num:1},{BT:53,Num:12},{BT:53,Num:15},{BT:53,Num:26}],
                    [{BT:53,Num:2},{BT:53,Num:11},{BT:53,Num:16},{BT:53,Num:25}],
                    [{BT:53,Num:3},{BT:53,Num:10},{BT:53,Num:17},{BT:53,Num:24}],
                    [{BT:53,Num:4},{BT:53,Num:9},{BT:53,Num:18},{BT:53,Num:23}],
                    [{BT:53,Num:5},{BT:53,Num:8},{BT:53,Num:19},{BT:53,Num:22}],
                    [{BT:53,Num:6},{BT:53,Num:7},{BT:53,Num:20},{BT:53,Num:21}]
                ]
            }
        ]
    }, //title: '六碼', SubMenu: []
    { 
        name: "Game.HashSix.Menu.Group.11.title", 
        cont:[
            {
                title : "Game.MarkSix.Item.21.title",
                item:[
                    [{BT:15,Num:1210},{BT:15,Num:1211},{BT:15,Num:1310},{BT:15,Num:1311}],
                    [{BT:15,Num:1410},{BT:15,Num:1411},{BT:15,Num:1412}],
                ]
            },
            {
                title : "Game.HashSix.Item.22.title",
                item:[
                    [{BT:15,Num:1220},{BT:15,Num:1221},{BT:15,Num:1320},{BT:15,Num:1321}],
                    [{BT:15,Num:1420},{BT:15,Num:1421},{BT:15,Num:1422}],
                ]
            },
            {
                title : "Game.HashSix.Item.23.title",
                item:[
                    [{BT:15,Num:1230},{BT:15,Num:1231},{BT:15,Num:1330},{BT:15,Num:1331}],
                    [{BT:15,Num:1430},{BT:15,Num:1431},{BT:15,Num:1432}],
                ]
            },
            {
                title : "Game.HashSix.Item.24.title",
                item:[
                    [{BT:15,Num:1240},{BT:15,Num:1241},{BT:15,Num:1340},{BT:15,Num:1341}],
                    [{BT:15,Num:1440},{BT:15,Num:1441},{BT:15,Num:1442}],
                ]
            },
            {
                title : "Game.HashSix.Item.25.title",
                item:[
                    [{BT:15,Num:1250},{BT:15,Num:1251},{BT:15,Num:1350},{BT:15,Num:1351}],
                    [{BT:15,Num:1450},{BT:15,Num:1451},{BT:15,Num:1452}],
                ]
            },
            {
                title : "Game.HashSix.Item.26.title",
                item:[
                    [{BT:15,Num:1260},{BT:15,Num:1261},{BT:15,Num:1360},{BT:15,Num:1361}],
                    [{BT:15,Num:1460},{BT:15,Num:1461},{BT:15,Num:1462}],
                ]
            }            
        ]
    }, //title: '正碼過關', SubMenu: []
    { 
        name: "Game.HashSix.Menu.Group.12.title", 
        cont:[
            ///*  五行
            {
                title : "Game.HashSix.Item.21.title",
                item:[
                    [{BT:89,Num:10},{BT:89,Num:11},{BT:89,Num:12},{BT:89,Num:13},{BT:89,Num:14}]
                ]
            },
            {
                title : "Game.HashSix.Item.22.title",
                item:[
                    [{BT:89,Num:20},{BT:89,Num:21},{BT:89,Num:22},{BT:89,Num:23},{BT:89,Num:24}]
                ]
            },
            {
                title : "Game.HashSix.Item.23.title",
                item:[
                    [{BT:89,Num:30},{BT:89,Num:31},{BT:89,Num:32},{BT:89,Num:33},{BT:89,Num:34}]
                ]
            },
            {
                title : "Game.HashSix.Item.24.title",
                item:[
                    [{BT:89,Num:40},{BT:89,Num:41},{BT:89,Num:42},{BT:89,Num:43},{BT:89,Num:44}]
                ]
            },
            {
                title : "Game.HashSix.Item.25.title",
                item:[
                    [{BT:89,Num:50},{BT:89,Num:51},{BT:89,Num:52},{BT:89,Num:53},{BT:89,Num:54}]
                ]
            },
            {
                title : "Game.HashSix.Item.26.title",
                item:[
                    [{BT:89,Num:60},{BT:89,Num:61},{BT:89,Num:62},{BT:89,Num:63},{BT:89,Num:64}]
                ]
            },
            //*/
            {
                title : "Game.HashSix.Item.68.title",
                item:[
                    [{BT:68,Num:0},{BT:68,Num:10},{BT:68,Num:20},{BT:68,Num:30},{BT:68,Num:40},{BT:68,Num:50}],
                    [{BT:68,Num:1},{BT:68,Num:11},{BT:68,Num:21},{BT:68,Num:31},{BT:68,Num:41},{BT:68,Num:51}]
                ]
            },
            {
                title : "Game.HashSix.Item.55.title",
                item:[
                    [{BT:55,Num:0},{BT:55,Num:1},{BT:55,Num:2},{BT:55,Num:3},{BT:55,Num:4}]
                ]
            },
            {
                title : "Game.HashSix.Item.56.title",
                item:[
                    [{BT:56,Num:0},{BT:56,Num:1},{BT:56,Num:2},{BT:56,Num:3},{BT:56,Num:4}]
                ]
            }
        ]
    } //title: '其他', SubMenu: []
]

const SGPools:Layout=[
    { 
        name: "Game.SGPools.Menu.Group.0.title",
        cont: [
            {
                title : "Game.MarkSix.Item.26.title",
                item: [
                    [{BT:26,Num:10},{BT:26,Num:10},{BT:26,Num:10}],
                    [{BT:26,Num:11},{BT:26,Num:11},{BT:26,Num:11}]
                ]
            },
            {
                title : "Game.MarkSix.Item.27.title",
                item: [
                    [{BT:27,Num:10},{BT:27,Num:10},{BT:27,Num:10}],
                    [{BT:27,Num:11},{BT:27,Num:11},{BT:27,Num:11}]
                ]
            },
            {
                title : "Game.MarkSix.Item.28.title",
                item: [
                    [{BT:28,Num:10},{BT:28,Num:10},{BT:28,Num:10}],
                    [{BT:28,Num:11},{BT:28,Num:11},{BT:28,Num:11}]
                ]
            },
            {
                title : "Game.MarkSix.Item.29.title",
                item: [
                    [{BT:29,Num:10},{BT:29,Num:10},{BT:29,Num:10}],
                    [{BT:29,Num:11},{BT:29,Num:11},{BT:29,Num:11}]
                ]
            },

        ]
    }, // title: '兩面', SubItem: []    
    { 
        name: "Game.SGPools.Menu.Group.1.title",
        cont:[
            {
                aBT: [1,2,3,10],
                sltedItem:0,
                start: 0,
                end:99,
                item: getNums
            }
        ]
    }, // title: '2D', SubItem: []
    { 
        name: "Game.SGPools.Menu.Group.2.title", 
        cont:[
            {
                //aBT: [4,5,6,11],
                BT: 4,
                FastSlt: {
                    title:'FastSlt.Box',
                    subcont:[
                        {
                            title: 'FastSlt.Hundreds',
                            subitem:[
                                {num:0,isActive:true},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false},
                                {num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}
                            ],
                            key: 'hundreds',
                            func: setSelect
                        },
                        {
                            title: 'FastSlt.Tens',
                            subitem:[
                                {num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false},
                                {num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}
                            ],
                            key:'tens',
                            func: setSelect
                        },
                        {
                            title: 'FastSlt.Units',
                            subitem:[
                                {num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false},
                                {num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}
                            ],
                            key:'units',
                            func: setSelect
                        }                                                                        
                    ]
                },
                sltedItem:0,
                dgt: 3, //位數
                PosSlt: {
                    num:[0],
                    pos:['hundreds']
                },
                noSameNum: false,    //數字不可重複
                item:getNumXD({num:[0],pos:['hundreds']},4,3)
            }
        ]
    }, // title: '3D', SubItem: [], SubMenu: []
    { 
        name: "Game.SGPools.Menu.Group.3.title", 
        cont:[
            {
                //aBT: [7,8,9,12],
                BT:7,
                FastSlt: {
                    title:'FastSlt.Box',
                    subcont:[
                        {
                            title: 'FastSlt.Thousands',
                            subitem:[
                                {num:0,isActive:true},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false},
                                {num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}
                            ],
                            key: 'thousands',
                            func:setSelect
                        },                        
                        {
                            title: 'FastSlt.Hundreds',
                            subitem:[
                                {num:0,isActive:true},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false},
                                {num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}
                            ],
                            key: 'hundreds',
                            func:setSelect
                        },
                        {
                            title: 'FastSlt.Tens',
                            subitem:[
                                {num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false},
                                {num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}
                            ],
                            key:'tens',
                            func:setSelect
                        },
                        {
                            title: 'FastSlt.Units',
                            subitem:[
                                {num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false},
                                {num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}
                            ],
                            key:'units',
                            func:setSelect
                        }                                                                        
                    ]
                },
                sltedItem:0,
                dgt: 4, //位數
                PosSlt: {
                    num:[0,0],
                    pos:['thousands','hundreds']
                },
                noSameNum: false,    //數字不可重複
                item:function(){              
                    return getNumXD(this.PosSlt,this.BT,this.dgt);
                }
            }            
        ]
    }, // title: '4D', SubItem: [], SubMenu: []
    { 
        name: "Game.SGPools.Menu.Group.4.title", 
        cont:[
            {
                aBT: [13,14,15],
                sltedItem:0,
                start: 0,
                end:99,
                item: getNums
            }             
        ]
    }, // title: '連碼', SubMenu: []
    { 
        name: "Game.SGPools.Menu.Group.5.title", 
        cont:[
            {
                aBT: [20,21,22,23,24,25],
                sltedItem:0,
                start: 0,
                end:99,
                item: getNums
            }             
        ]
    }, // title: '不中', SubMenu: []
]
const Layouts:ILayouts= {}
Layouts.MarkSix = MarkSixLayout;
Layouts['3D'] = D3;
Layouts.Happy = Happy;
Layouts.Cars = Cars;
Layouts.Always = Always;
Layouts.Speed3 = Speed3;
Layouts.Happy8 = Happy8;
Layouts.BTCHash = BTCHash;
Layouts.HashSix = HashSix;
Layouts.SGPools = SGPools;
export default Layouts;