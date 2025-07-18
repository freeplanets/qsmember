import { LeverData, WebParams, Msg } from '../../../layouts/data/if';
import { ErrCode } from '../../if/ENum';
import Lever from './Lever';
import { AxApi } from '../../../layouts/components/AxApi';

export default class LeversModifier {
  constructor(private list:Lever[], private ax:AxApi, private params:WebParams) {
    this.params.TableName = 'Lever';
    this.getList();
  }
  get List():Lever[] {
    return this.list;
  }
  async getList():Promise<void> {
    let msg:Msg = { ErrNo: 0 };
    console.log('getList', msg);
    const param = { ...this.params };
    msg = await this.ax.getApi('cc/GetData', param);
    console.log('after api', msg);
    if (msg.ErrNo === 0) {
      console.log('after PASS');
      const tmp:LeverData[] = msg.data as LeverData[];
      tmp.forEach((itm:LeverData) => {
        const fidx = this.list.findIndex((l) => l.id === itm.id);
        if (fidx === -1) {
          this.list.push(new Lever(itm));
        } else {
          this.list[fidx].MultiUpdate(itm);
        }
      });
      const newOne:LeverData = {
        id: 0,
        Multiples: 0,
        LongT: 0,
        ShortT: 0,
        ModifyID: this.params.UserID,
      };
      this.list.push(new Lever(newOne));
      console.log('getList', this.list);
    } else {
      console.log('NO PASS', msg.ErrNo, ErrCode.PASS);
    }
  }
  async Update():Promise<boolean> {
    const tmp:LeverData[] = [];
     this.list.forEach((itm) => {
      if (itm.isChanged) tmp.push(itm.Data);
    });
    if (tmp.length === 0) return false;
    return new Promise<boolean>((resolve) => {
      const param = { ...this.params };
      param.TableData = JSON.stringify(tmp);
      this.ax.getApi('cc/SaveData', param).then((msg:Msg) => {
        if (msg.ErrNo === ErrCode.PASS) {
          resolve(true);
        }
          resolve(false);
      }).catch((err:Msg) => {
        console.log('LeverModifier get Api Error:', err.error);
        resolve(false);
      });
    });
  }
}
