import { BetItem } from '../data/if';
import MarkSixData from './data/MarkSixData';
import D3 from './data/3D';
import Happy from './data/Happy';
import Always from './data/Always';
import Cars from './data/Cars';
import Speed3 from './data/Speed3';
import Happy8 from './data/Happy8';
// const js = JSON.parse(MarkSixData);
const jObj:any[] = [];
jObj[1] = MarkSixData;
jObj[2] = D3;
jObj[3] = D3;
jObj[12] = Happy;
jObj[19] = Always;
jObj[20] = Cars;
jObj[21] = Speed3;
jObj[22] = Happy8;
jObj[30] = Happy8;
function getBetItems(id:number):BetItem[]|boolean {
    if (!jObj[id]) return false;
    const js = jObj[id];
    console.log('getBetItems', id, js);
    // const odds = js.odds;
    const BetItems:BetItem[] = [];
    Object.keys(js).forEach((key) => {
        Object.keys(js[key]).forEach((num) => {
            const tmp:BetItem = {
                BetType: key,
                Num: num,
            };
            BetItems.push(tmp);
            // console.log(key,num);
        });
    });
    return BetItems;
}
export default getBetItems;
