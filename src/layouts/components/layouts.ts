export interface numBlock {
    BT:number;
    Num:number;
}
/*
export interface lineBlock {
    [key:number]:numBlock[];
}
*/
interface FastSltSubItem {
    num:number;
    isActive:boolean;
}
interface FastSltSub {
    title?:string;
    subitem:FastSltSubItem[][];
    func: string;
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
    item:numBlock[][] | Function;
    fastSltItm?:string[];
    FastSlt?:FastSlts[];
    noSameNum?:boolean;
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
const getNums = (BT:number,lastNums:number|undefined=undefined,
    startAt:number|undefined=undefined,extF:number|undefined=undefined)=>{
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
    return nums;
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
        name: "兩面",
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
        name:"一字",       
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
        name:"二字組合",
        cont:[
            {
                dgt: 2, //位數
                item:[
                    [{BT:17,Num:0},{BT:17,Num:1},{BT:17,Num:2},{BT:17,Num:3},{BT:17,Num:4}],
                    [{BT:17,Num:5},{BT:17,Num:6},{BT:17,Num:7},{BT:17,Num:8},{BT:17,Num:9}],
                    [{BT:17,Num:11},{BT:17,Num:12},{BT:17,Num:13},{BT:17,Num:14},{BT:17,Num:15}],
                    [{BT:17,Num:16},{BT:17,Num:17},{BT:17,Num:18},{BT:17,Num:19},{BT:17,Num:22}],
                    [{BT:17,Num:23},{BT:17,Num:24},{BT:17,Num:25},{BT:17,Num:26},{BT:17,Num:27}],
                    [{BT:17,Num:28},{BT:17,Num:29},{BT:17,Num:33},{BT:17,Num:34},{BT:17,Num:35}],
                    [{BT:17,Num:36},{BT:17,Num:37},{BT:17,Num:38},{BT:17,Num:39},{BT:17,Num:44}],
                    [{BT:17,Num:45},{BT:17,Num:46},{BT:17,Num:47},{BT:17,Num:48},{BT:17,Num:49}],
                    [{BT:17,Num:55},{BT:17,Num:56},{BT:17,Num:57},{BT:17,Num:58},{BT:17,Num:59}],
                    [{BT:17,Num:66},{BT:17,Num:67},{BT:17,Num:68},{BT:17,Num:69},{BT:17,Num:77}],
                    [{BT:17,Num:78},{BT:17,Num:79},{BT:17,Num:88},{BT:17,Num:89},{BT:17,Num:99}]
                ]
            }
        ]
    },
    {
        name:"二定位",       
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
        name: "二字合數",
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
        name: "二字合尾",
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
        name: "三定位",
        cont: [
            {
                BT:42,
                FastSlt: [
                    {
                        title:'FastSlt.FastInput'
                    },
                    {
                        title:'FastSlt.Box',
                        subcont:[
                            {
                                title: 'FastSlt.Hundreds',
                                subitem:[
                                    [{num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false}],
                                    [{num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}]
                                ],
                                func: 'hundreds'
                            },
                            {
                                title: 'FastSlt.Tens',
                                subitem:[
                                    [{num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false}],
                                    [{num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}]
                                ],
                                func:'tens'
                            },
                            {
                                title: 'FastSlt.Units',
                                subitem:[
                                    [{num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false}],
                                    [{num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}]
                                ],
                                func:'units'
                            }                                                                        
                        ]
                    },
                    {
                        title:'FastSlt.Set3',
                        subcont:[
                            {
                                subitem:[
                                    [{num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false}],
                                    [{num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}]
                                ],
                                func: 'set3'
                            }                            
                        ]
                    },
                    {
                        title:'FastSlt.Set6',
                        subcont:[
                            {
                                subitem:[
                                    [{num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false}],
                                    [{num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}]
                                ],
                                func: 'set6'
                            }
                        ]
                    },
                    {
                        title:'FastSlt.Pair',
                        subcont:[
                            {
                                subitem:[
                                    [{num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false}],
                                    [{num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}]
                                ],
                                func: 'pair'
                            }
                        ]
                    }
                ],
                sltedItem:0,
                dgt: 3, //位數
                //NumDuplicate:true,     //數字可以重複
                noSameNum: false,    //數字不可重複
                item:[]
            }
        ]
    },
    {
        name: "三字",
        cont: [
            {
                BT:43,
                FastSlt: [
                    {
                        title:'FastSlt.FastInput'                       
                    },
                    {
                        title:'FastSlt.Box',
                        subcont:[
                            {
                                title: 'FastSlt.Hundreds',
                                subitem:[
                                    [{num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false}],
                                    [{num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}]
                                ],
                                func: 'hundreds'
                            },
                            {
                                title: 'FastSlt.Tens',
                                subitem:[
                                    [{num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false}],
                                    [{num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}]
                                ],
                                func:'tens'
                            },
                            {
                                title: 'FastSlt.Units',
                                subitem:[
                                    [{num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false}],
                                    [{num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}]
                                ],
                                func:'units'
                            }                                                                        
                        ]
                    },
                    {
                        title:'FastSlt.Set3',
                        subcont:[
                            {
                                subitem:[
                                    [{num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false}],
                                    [{num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}]
                                ],
                                func: 'set3'
                            }                            
                        ]
                    },
                    {
                        title:'FastSlt.Set6',
                        subcont:[
                            {
                                subitem:[
                                    [{num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false}],
                                    [{num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}]
                                ],
                                func: 'set6'
                            }
                        ]
                    },
                    {
                        title:'FastSlt.Pair',
                        subcont:[
                            {
                                subitem:[
                                    [{num:0,isActive:false},{num:1,isActive:false},{num:2,isActive:false},{num:3,isActive:false},{num:4,isActive:false}],
                                    [{num:5,isActive:false},{num:6,isActive:false},{num:7,isActive:false},{num:8,isActive:false},{num:9,isActive:false}]
                                ],
                                func: 'pair'
                            }
                        ]
                    }
                ],               
                dgt: 3, //位數
                sltedItem:0,
                //NumDuplicate:false,         //數字不可重複
                noSameNum: true,    //數字不可重複
                item:[]
            }
        ]
    },
    {
        name: "組選 3",
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
        name: "組選 6",
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
        name: "過關",
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
        name: "雜項",
        cont: [
            {
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
        name: "其他",
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
const Layouts:ILayouts= {}
Layouts.MarkSix = MarkSixLayout;
Layouts['3D'] = D3;
export default Layouts;