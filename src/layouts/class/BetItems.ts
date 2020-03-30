import {BetItem} from '../data/if';
import MarkSixData from './data/MarkSixData';
const js = JSON.parse(MarkSixData);
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
export default BetItems;