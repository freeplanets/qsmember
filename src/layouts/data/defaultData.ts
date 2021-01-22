export interface CondOfBetType {
    Min:number;
    Max:number;
    SameAsDigitalOrder:boolean;         //數字重排相同為同一數字, 例: 二字不定位 SubType 0 不同號, 1 同號
    SameOdds?:boolean;
    UserOtherBTOdds?:boolean;
    SubTypeAsNum?:boolean;                   //所有號不同SubType 用 Num
    Digital?:number;
    Position?:number[];
}
export interface GameOfCond {
    [key:string]:CondOfBetType;
}
export interface AllOfGame {
    [key:string]:GameOfCond;
}
const BaseOddsItem:AllOfGame = {
    BTCHash:{
        '1': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '個位-單雙'}],
        '2': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '十位-單雙'}],
        '3': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '百位-單雙'}],
        '4': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '千位-單雙'}],
        '5': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '萬位-單雙'}],
        '6': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '個位-大小'}],
        '7': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '十位-大小'}],
        '8': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '百位-大小'}],
        '9': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '千位-大小'}],
        '10': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '萬位-大小'}],
        '11': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '個位-質合'}],
        '12': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '十位-質合'}],
        '13': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '百位-質合'}],
        '14': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '千位-質合'}],
        '15': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{ Title: '萬位-質合'}],
        '16': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{Title: '總和-單雙'}],
        '17': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{Title: '總和-大小'}],
        '18': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{Title: '前3和-單雙'}],
        '19': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{Title: '前3和-大小'}],
        '20': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{Title: '中3和-單雙'}],
        '21': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{Title: '中3和-大小'}],
        '22': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{Title: '後3和-單雙'}],
        '23': {Min:0,Max:1,SameAsDigitalOrder:false}, // [{Title: '後3和-大小'}],
        '24': {Min:0,Max:9,SameAsDigitalOrder:false}, // [{Title: '一定位-個'}],
        '25': {Min:0,Max:9,SameAsDigitalOrder:false}, // [{Title: '一定位-十'}],
        '26': {Min:0,Max:9,SameAsDigitalOrder:false}, // [{Title: '一定位-百'}],
        '27': {Min:0,Max:9,SameAsDigitalOrder:false}, // [{Title: '一定位-千'}],
        '28': {Min:0,Max:9,SameAsDigitalOrder:false}, // [{Title: '一定位-萬'}],
        '29': {Min:0,Max:9,SameAsDigitalOrder:false}, // [{Title: '一字現'}],
        '30': {Min:0,Max:9,SameAsDigitalOrder:false}, // [{Title: '一字現-前3'}],
        '31': {Min:0,Max:9,SameAsDigitalOrder:false}, // [{Title: '一字現-中3'}],
        '32': {Min:0,Max:9,SameAsDigitalOrder:false}, // [{Title: '一字現-後3'}],
        '33': {Min:0,Max:99,SameAsDigitalOrder:true,Digital:2}, // [{Title: '二字現',SubTitle:'同號'},{Title: '二字現',SubTitle:'不同號'}],
        '34': {Min:0,Max:99,SameAsDigitalOrder:true,Digital:2}, // [{Title: '二字現-前3',SubTitle:'同號'},{Title: '二字現-前3',SubTitle:'不同號'}],
        '35': {Min:0,Max:99,SameAsDigitalOrder:true,Digital:2}, // [{Title: '二字現-中3',SubTitle:'同號'},{Title: '二字現-中3',SubTitle:'不同號'}],
        '36': {Min:0,Max:99,SameAsDigitalOrder:true,Digital:2}, // [{Title: '二字現-後3',SubTitle:'同號'},{Title: '二字現-後3',SubTitle:'不同號'}],
        '37': {Min:0,Max:999,SameAsDigitalOrder:true,Digital:3}, // [{Title: '三字現',SubTitle:'三同號'},{Title: '三字現',SubTitle:'兩同號'},{Title: '三字現',SubTitle:'不同號'}],
        '38': {Min:0,Max:999,SameAsDigitalOrder:true,Digital:3}, // [{Title: '三字現-前3',SubTitle:'三同號'},{Title: '三字現-前3',SubTitle:'兩同號'},{Title: '三字現-前3',SubTitle:'不同號'}],
        '39': {Min:0,Max:999,SameAsDigitalOrder:true,Digital:3}, // [{Title: '三字現-中3',SubTitle:'三同號'},{Title: '三字現-中3',SubTitle:'兩同號'},{Title: '三字現-中3',SubTitle:'不同號'}],
        '40': {Min:0,Max:999,SameAsDigitalOrder:true,Digital:3}, // [{Title: '三字現-後3',SubTitle:'三同號'},{Title: '三字現-後3',SubTitle:'兩同號'},{Title: '三字現-後3',SubTitle:'不同號'}],
        '41': {Min:0,Max:0,SameAsDigitalOrder:false,SameOdds:true}, // [{Title: '四字現'}],
        '42': {Min:0,Max:0,SameAsDigitalOrder:false,SameOdds:true}, // [{Title: '五字現'}],
        '43': {Min:0,Max:4,SameAsDigitalOrder:false,SubTypeAsNum:true}, // [{Title: '雜項-前3',SubTitle:'豹子'},{Title: '雜項-前3',SubTitle:'順子'},{Title: '雜項-前3',SubTitle:'對子'},{Title: '雜項-前3',SubTitle:'半順'},{Title: '雜項-前3',SubTitle:'雜六'}],
        '44': {Min:0,Max:4,SameAsDigitalOrder:false,SubTypeAsNum:true}, // [{Title: '雜項-中3',SubTitle:'豹子'},{Title: '雜項-中3',SubTitle:'順子'},{Title: '雜項-中3',SubTitle:'對子'},{Title: '雜項-中3',SubTitle:'半順'},{Title: '雜項-中3',SubTitle:'雜六'},],
        '45': {Min:0,Max:4,SameAsDigitalOrder:false,SubTypeAsNum:true}, // [{Title: '雜項-後3',SubTitle:'豹子'},{Title: '雜項-後3',SubTitle:'順子'},{Title: '雜項-後3',SubTitle:'對子'},{Title: '雜項-後3',SubTitle:'半順'},{Title: '雜項-後3',SubTitle:'雜六'}],
        '46': {Min:0,Max:7,SameAsDigitalOrder:false,SubTypeAsNum:true}, // [{Title: '炸金花',SubTitle:'五同號'},{Title: '炸金花',SubTitle:'四條'},{Title: '炸金花',SubTitle:'葫蘆'},{Title: '炸金花',SubTitle:'順子'},{Title: '炸金花',SubTitle:'三條'},{Title: '炸金花',SubTitle:'兩對'},{Title: '炸金花',SubTitle:'一對'},{Title: '炸金花',SubTitle:'雜牌'}],
        '47': {Min:0,Max:1,SameAsDigitalOrder:false,UserOtherBTOdds:true}    // [{Title: '兩面過關'}][1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
    },
    SGPools: {
        '1': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  //[{ Title: '2D-一獎' }],
        '2': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  //[{ Title: '2D-二獎' }],
        '3': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '2D-三獎' }],
        '4': {Min:0,Max:999,SameAsDigitalOrder:false,Digital:3},  // [{ Title: '3D-一獎' }],
        '5': {Min:0,Max:999,SameAsDigitalOrder:false,Digital:3},  // [{ Title: '3D-二獎' }],
        '6': {Min:0,Max:999,SameAsDigitalOrder:false,Digital:3},  // [{ Title: '3D-三獎' }],
        '7': {Min:0,Max:9999,SameAsDigitalOrder:false,Digital:4},  // [{ Title: '4D-一獎' }],
        '8': {Min:0,Max:9999,SameAsDigitalOrder:false,Digital:4},  // [{ Title: '4D-二獎' }],
        '9': {Min:0,Max:9999,SameAsDigitalOrder:false,Digital:4},  // [{ Title: '4D-三獎' }],
        '10': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '2D-23組' }],
        '11': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '3D-23組' }],
        '12': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '4D-23組' }],
        '13': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '二星' }],
        '14': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '三星' }],
        '15': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '四星' }],
        '16': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '2D頭-一獎' }],
        '17': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '2D頭-二獎' }],
        '18': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '2D頭-三獎' }],
        '19': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '2D頭-23組' }],
        '20': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '2D不中-5不中' }],
        '21': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '2D不中-6不中' }],
        '22': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '2D不中-7不中' }],
        '23': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '2D不中-8不中' }],
        '24': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '2D不中-9不中' }],
        '25': {Min:0,Max:99,SameAsDigitalOrder:false,Digital:2},  // [{ Title: '2D不中-10不中' }]
        '26': {Min:0,Max:1,SameAsDigitalOrder:false,Digital:2,Position:[1,2,3]},  //[{ Title: '單雙'}],
        '27': {Min:0,Max:1,SameAsDigitalOrder:false,Digital:2,Position:[1,2,3]},  //[{ Title: '大小'}],
        '28': {Min:0,Max:1,SameAsDigitalOrder:false,Digital:2,Position:[1,2,3]},  //[{ Title: '合數單雙'}],
        '29': {Min:0,Max:1,SameAsDigitalOrder:false,Digital:2,Position:[1,2,3]}   //[{ Title: '合數大小'}]        
    }
}
export default BaseOddsItem;
/*
interface BTTXT {
    [v:number]:string;
}
const BtText:string[] = [];
BtText[1]='MarkSix';        // 六合彩
BtText[2]='3D';             // 中國體彩
BtText[3]='3D';             // 中國福彩
BtText[4]='';             // 中國福彩
BtText[5]='';          // 廣西快樂10分
BtText[6]='Always';             // 中國福彩
BtText[7]='';             // 中國福彩
BtText[8]='Always';             // 中國福彩
BtText[9]='';             // 中國福彩
BtText[10]='';             // 中國福彩
BtText[11]='Always';             // 中國福彩
BtText[12]='Happy';             // 廣東快樂10分
BtText[13]='Happy';             // 天津快樂10
BtText[14]='';             // 中國福彩
BtText[15]='';             // 中國福彩
BtText[16]='';             // 中國福彩
BtText[17]='';             // 中國福彩
BtText[18]='';             // 中國福彩
BtText[19]='Always';             // 中國福彩
BtText[20]='Cars';             // 北京賽車
BtText[21]='Speed3';             // 中國福彩
BtText[22]='Happy8';             // 中國福彩
BtText[23]='Cars';             // 中國福彩
BtText[24]='Always';             // 中國福彩
BtText[25]='Happy';          // 中國福彩
BtText[26]='3D';             // 中國福彩
BtText[27]='MarkSix';        // 大眾六合彩
BtText[28]='Speed3';             // 中國福彩
BtText[29]='Happy8';             // 中國福彩
BtText[30]='Happy8';             // 中國福彩
BtText[31]='VN1';             // 中國福彩
BtText[32]='VN2';             // 中國福彩
BtText[33]='VN3';             // 中國福彩
BtText[34]='VN4';             // 中國福彩
BtText[35]='VN5';             // 中國福彩
export default BtText;
*/