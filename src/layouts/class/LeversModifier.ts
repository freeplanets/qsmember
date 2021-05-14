import { LeverData, WebParams, Msg } from '../data/if';
import ErrCode from '../data/ErrCode';
import Lever from './Lever';
import { AxApi } from '../components/AxApi';

export default class LeversModifier {
  private list:Lever[] = [];
  constructor(private ax:AxApi,private params:WebParams){
    this.params.TableName = 'Lever';
    this.getList();
  }
  get List():Lever[] {
    return this.list;
  }  
  async getList():Promise<void> {
    let msg:Msg = { ErrNo:ErrCode.PASS };
    const param = Object.assign({},this.params);
    msg = await this.ax.getApi('/cc/GetData',param);
    if(msg.ErrNo === ErrCode.PASS) {
      const tmp:LeverData[] = msg.data as LeverData[];
      tmp.forEach((itm:LeverData)=>{
        const fidx = this.list.findIndex(l => l.id === itm.id);
        if(fidx === -1){
          this.list.push(new Lever(itm));
        } else {
          this.list[fidx].MultiUpdate(itm);
        }
      })
    }
  }
  async Update():Promise<boolean> {
    let tmp:LeverData[] = [];
     this.list.forEach((itm)=>{
      if(itm.isChanged) return tmp.push(itm);
    });
    if(tmp.length === 0) return false;
    return new Promise<boolean>((resolve)=>{
      const param = Object.assign({},this.params);
      param.TableData = tmp;
      this.ax.getApi('/cc/SaveData',param).then((msg:Msg) => {
        if (msg.ErrNo === ErrCode.PASS) {
          return true;
        } else {
          return false;
        }
      }).catch((err:Msg)=>{
        console.log('LeverModifier get Api Error:', err.error)
        return false;
      })
    });
  }
}