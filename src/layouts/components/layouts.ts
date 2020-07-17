export interface numBlock {
    BT:number;
    Num:number;
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
const getNums = (BT:number,lastNums?:number,startAt?:number,extF?:number,addArr?:numBlock[][])=>{
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
        tmp.push({BT: BT,Num:base+i});
    }
    if(tmp.length>0) nums.push(tmp);
    if(addArr){
        addArr.map(lnObj=>{
            nums.push(lnObj);
        })
    }
    return nums;
}

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
    for(let n1=0;n1<10;n1++){
      const ln:numBlock[]=[]
      for(let n2=0;n2<10;n2++){
        let sNum=mask.replace(`{pos${idx}}`,num+'').replace(`{pos${leftPos[0]}}`,n1+'').replace(`{pos${leftPos[1]}}`,n2+'');
        //console.log(sNum,num,n1,n2);
        let tmp:numBlock={BT:bt,Num:parseInt(sNum,10)}
        ln.push(tmp);
      }
      arr.push(ln);
    }
    //console.log('getNum3D',arr);
    return arr;
}

const MarkSixLayout:Layout = [
    {
        name: "Game.MarkSix.Menu.Group.0.title",
        cont: [
            {
                title : "Game.MarkSix.Item.1.title",
                item: [
                    [{BT:2,Num:0},{BT:3,Num:0},{BT:16,Num:0},{BT:74,Num:0}],
                    [{BT:2,Num:1},{BT:3,Num:1},{BT:16,Num:1},{BT:74,Num:1}]
                ]
            },
            {
                title : "Game.MarkSix.Item.5.title",
                item:[
                    [{BT:5,Num:0},{BT:5,Num:1},{BT:6,Num:0},{BT:6,Num:1}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.1",
                item:[
                    [{BT:13,Num:10},{BT:12,Num:10},{BT:27,Num:10}],
                    [{BT:13,Num:11},{BT:12,Num:11},{BT:27,Num:11}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.2",
                item:[
                    [{BT:13,Num:20},{BT:12,Num:20},{BT:27,Num:20}],
                    [{BT:13,Num:21},{BT:12,Num:21},{BT:27,Num:21}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.3",
                item:[
                    [{BT:13,Num:30},{BT:12,Num:30},{BT:27,Num:30}],
                    [{BT:13,Num:31},{BT:12,Num:31},{BT:27,Num:31}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.4",
                item:[
                    [{BT:13,Num:40},{BT:12,Num:40},{BT:27,Num:40}],
                    [{BT:13,Num:41},{BT:12,Num:41},{BT:27,Num:41}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.5",
                item:[
                    [{BT:13,Num:50},{BT:12,Num:50},{BT:27,Num:50}],
                    [{BT:13,Num:51},{BT:12,Num:51},{BT:27,Num:51}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.6",
                item:[
                    [{BT:13,Num:60},{BT:12,Num:60},{BT:27,Num:60}],
                    [{BT:13,Num:61},{BT:12,Num:61},{BT:27,Num:61}]
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
                item: getNums
            }
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.2.title",
        cont:[
            {
                colorWave: true,
                BT:4,
                item:[
                    [{BT:4,Num:1},{BT:4,Num:2},{BT:4,Num:3},{BT:4,Num:4},{BT:4,Num:5},{BT:4,Num:6},{BT:4,Num:7},{BT:4,Num:8},{BT:4,Num:9},{BT:4,Num:10}],
                    [{BT:4,Num:11},{BT:4,Num:12},{BT:4,Num:13},{BT:4,Num:14},{BT:4,Num:15},{BT:4,Num:16},{BT:4,Num:17},{BT:4,Num:18},{BT:4,Num:19},{BT:4,Num:20}],
                    [{BT:4,Num:21},{BT:4,Num:22},{BT:4,Num:23},{BT:4,Num:24},{BT:4,Num:25},{BT:4,Num:26},{BT:4,Num:27},{BT:4,Num:28},{BT:4,Num:29},{BT:4,Num:30}],
                    [{BT:4,Num:31},{BT:4,Num:32},{BT:4,Num:33},{BT:4,Num:34},{BT:4,Num:35},{BT:4,Num:36},{BT:4,Num:37},{BT:4,Num:38},{BT:4,Num:39},{BT:4,Num:40}],
                    [{BT:4,Num:41},{BT:4,Num:42},{BT:4,Num:43},{BT:4,Num:44},{BT:4,Num:45},{BT:4,Num:46},{BT:4,Num:47},{BT:4,Num:48},{BT:4,Num:49}]
                ]
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
                item:getNums
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
                item:getNums
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
                item:getNums
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
                item:getNums
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
                item:getNums
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
                item: getNums
            }
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.9.title",
        cont:[
            {
                item: [
                    [{BT:20,Num:0},{BT:20,Num:1},{BT:20,Num:2},{BT:20,Num:3},{BT:20,Num:4}],
                    [{BT:20,Num:5},{BT:20,Num:6},{BT:20,Num:7},{BT:20,Num:8},{BT:20,Num:9}]
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
                    [{BT:17,Num:0},{BT:17,Num:1},{BT:17,Num:2}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.1",
                colorWave: true,
                colorExt: 0,                
                item:[
                    [{BT:14,Num:10},{BT:14,Num:11},{BT:14,Num:12}]
                ]
            },            
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.2",
                colorWave: true,
                colorExt: 0,                
                item:[
                    [{BT:14,Num:20},{BT:14,Num:21},{BT:14,Num:22}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.3",
                colorWave: true,
                colorExt: 0,
                item:[
                    [{BT:14,Num:30},{BT:14,Num:31},{BT:14,Num:32}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.4",
                colorWave: true,
                colorExt: 0,
                item:[
                    [{BT:14,Num:40},{BT:14,Num:41},{BT:14,Num:42}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.5",
                colorWave: true,
                colorExt: 0,
                item:[
                    [{BT:14,Num:50},{BT:14,Num:51},{BT:14,Num:52}]
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.6",
                colorWave: true,
                colorExt: 0,
                item:[
                    [{BT:14,Num:60},{BT:14,Num:61},{BT:14,Num:62}]
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
                    [{BT:29,Num:0},{BT:29,Num:1},{BT:29,Num:2},{BT:29,Num:3}],
                    [{BT:29,Num:4},{BT:29,Num:5},{BT:29,Num:6},{BT:29,Num:7}],
                    [{BT:29,Num:8},{BT:29,Num:9},{BT:29,Num:10},{BT:29,Num:11}]
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
                item: getNums                
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
                item: getNums                
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
                item: getNums                
            }
        ]
    },
    {
        name: "Game.MarkSix.Menu.Group.15.title",
        cont:[
            {
                item:[
                    [{BT:53,Num:0},{BT:53,Num:1},{BT:53,Num:2},{BT:53,Num:3}],
                    [{BT:53,Num:4},{BT:53,Num:5},{BT:53,Num:6},{BT:53,Num:7}],
                    [{BT:53,Num:8},{BT:53,Num:9},{BT:53,Num:10},{BT:53,Num:11}],
                    [{BT:53,Num:12},{BT:53,Num:13},{BT:53,Num:14},{BT:53,Num:15}],
                    [{BT:53,Num:16},{BT:53,Num:17},{BT:53,Num:18},{BT:53,Num:19}],
                    [{BT:53,Num:20},{BT:53,Num:21},{BT:53,Num:22},{BT:53,Num:23}],
                    [{BT:53,Num:24},{BT:53,Num:25},{BT:53,Num:26},{BT:53,Num:27}],
                    [{BT:53,Num:28},{BT:53,Num:29},{BT:53,Num:30},{BT:53,Num:31}]
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
                    [{BT:15,Num:1210},{BT:15,Num:1211},{BT:15,Num:1310},{BT:15,Num:1311}],
                    [{BT:15,Num:1410},{BT:15,Num:1411},{BT:15,Num:1412}],
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.2",
                item:[
                    [{BT:15,Num:1220},{BT:15,Num:1221},{BT:15,Num:1320},{BT:15,Num:1321}],
                    [{BT:15,Num:1420},{BT:15,Num:1421},{BT:15,Num:1422}],
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.3",
                item:[
                    [{BT:15,Num:1230},{BT:15,Num:1231},{BT:15,Num:1330},{BT:15,Num:1331}],
                    [{BT:15,Num:1430},{BT:15,Num:1431},{BT:15,Num:1432}],
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.4",
                item:[
                    [{BT:15,Num:1240},{BT:15,Num:1241},{BT:15,Num:1340},{BT:15,Num:1341}],
                    [{BT:15,Num:1440},{BT:15,Num:1441},{BT:15,Num:1442}],
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.5",
                item:[
                    [{BT:15,Num:1250},{BT:15,Num:1251},{BT:15,Num:1350},{BT:15,Num:1351}],
                    [{BT:15,Num:1450},{BT:15,Num:1451},{BT:15,Num:1452}],
                ]
            },
            {
                title : "Game.MarkSix.Item.4.title",
                subtitle: "Game.MarkSix.TitleSP.SNO.6",
                item:[
                    [{BT:15,Num:1260},{BT:15,Num:1261},{BT:15,Num:1360},{BT:15,Num:1361}],
                    [{BT:15,Num:1460},{BT:15,Num:1461},{BT:15,Num:1462}],
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
                    [{BT:54,Num:0},{BT:54,Num:1},{BT:54,Num:2},{BT:54,Num:3},{BT:54,Num:4}]
                ]
            },
            {
                title : "Game.MarkSix.Item.68.title",
                item:[
                    [{BT:68,Num:0},{BT:68,Num:10},{BT:68,Num:20},{BT:68,Num:30},{BT:68,Num:40},{BT:68,Num:50}],
                    [{BT:68,Num:1},{BT:68,Num:11},{BT:68,Num:21},{BT:68,Num:31},{BT:68,Num:41},{BT:68,Num:51}]
                ]
            },
            {
                title : "Game.MarkSix.Item.55.title",
                item:[
                    [{BT:55,Num:0},{BT:55,Num:1},{BT:55,Num:2},{BT:55,Num:3},{BT:55,Num:4},{BT:55,Num:5}]
                ]
            },
            {
                title : "Game.MarkSix.Item.56.title",
                item:[
                    [{BT:56,Num:0},{BT:56,Num:1},{BT:56,Num:2},{BT:56,Num:3},{BT:56,Num:4},{BT:56,Num:5}]
                ]
            },
            {
                title : "Game.MarkSix.Item.69.title",
                item:[
                    [{BT:69,Num:1},{BT:69,Num:2},{BT:69,Num:3},{BT:69,Num:4},{BT:69,Num:5},{BT:69,Num:6}],
                    [{BT:69,Num:7},{BT:69,Num:8},{BT:69,Num:9},{BT:69,Num:10},{BT:69,Num:11},{BT:69,Num:12}]
                ]
            },
            {
                title : "Game.MarkSix.Item.70.title",
                item:[
                    [{BT:70,Num:0},{BT:70,Num:1},{BT:70,Num:2},{BT:70,Num:3},{BT:70,Num:4}],
                    [{BT:70,Num:5},{BT:70,Num:6},{BT:70,Num:7},{BT:70,Num:8},{BT:70,Num:9}]
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
]
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
]
const Layouts:ILayouts= {}
Layouts.MarkSix = MarkSixLayout;
Layouts['3D'] = D3;
Layouts.Happy = Happy;
export default Layouts;