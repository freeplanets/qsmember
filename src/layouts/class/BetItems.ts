import {BetItem} from '../data/if';
import MarkSixData from './data/MarkSixData';
import D3 from './data/3D';
import Happy from './data/Happy';
import Always from './data/Always';
import Cars from './data/Cars';
import Speed3 from './data/Speed3';
import Happy8 from './data/Happy8';
//const js = JSON.parse(MarkSixData);
const jObj:any[]=[];
jObj[1]=JSON.parse(MarkSixData);
jObj[2]=JSON.parse(D3);
jObj[3]=JSON.parse(D3);
jObj[12]=JSON.parse(Happy);
jObj[19]=JSON.parse(Always);
jObj[20]=JSON.parse(Cars);
jObj[21]=JSON.parse(Speed3);
jObj[22]=JSON.parse(Happy8);
function getBetItems(id:number):BetItem[]|boolean{
    if(!jObj[id]) return false;
    const js = jObj[id];
    const odds = js.odds;
    const BetItems:BetItem[] = [];
    Object.keys(odds).map(key=>{
        Object.keys(odds[key]).map(num=>{
            const tmp:BetItem= {
                BetType: key,
                Num:num
            }
            BetItems.push(tmp);
            //console.log(key,num);
        })
    });
    return BetItems;
}
export default getBetItems;