import { FuncKey, MsgType, Channels } from '../if/ENum';
import { AskTable, WsMsg } from '../if/dbif';
import ASock from './ASock';

const ClientChannel = Channels.ADMIN;

export default class WSock extends ASock {
    // private list:AskTable[]=[];
    // private ledger: LedgerTotal[]=[];
    chkurl():string {
		const ws = this.url === 'localhost:4001' ? 'ws' : 'wss';
		return `${ws}://${this.url}`;
    }
    OnOpen() {
        this.registerChannel(ClientChannel);
    }
    OnMessage(data:string) {
    // this.NewMessage = data;
    // this.curMsg = data;
    // console.log('onmessage', data);
        try {
            const msg:WsMsg = JSON.parse(data);
            console.log('onmessage', msg);
            if (msg.Ask) {
                this.doAsk(msg.Ask as AskTable);
            } else if (msg.Asks) {
                if (Array.isArray(msg.Asks)) {
                    this.doAsks(msg.Asks as AskTable[]);
                } else {
                    this.doAsk(msg.Asks as AskTable);
                }
            } else if (msg.SettleMark) {
                const SettleMark = msg.SettleMark;
                this.LSM.Mqtt.Items.forEach((itm) => {
                    itm.setSettleMark(SettleMark);
                });
            }
        } catch (err) {
            console.log('err', data);
        }
    }
    doAsks(asks:AskTable[]) {
        asks.forEach((ask) => {
            this.doAsk(ask);
        });
    }
    doAsk(ask:AskTable) {
        this.list.forEach((mbr) => {
            if (mbr.Type === MsgType.ACCEPT_ASK) mbr.getMessage(ask);
        });
    }
    private registerChannel(channel: string) {
        if (this.sock.readyState === this.sock.OPEN) {
            console.log('Register Channel to Server:', channel);
            const msg:WsMsg = {
                Func: FuncKey.SET_CHANNEL,
                ChannelName: channel,
                UserID: this.UserID,
            };
            // this.sock.send(`SetChannel:${channel}:${this.UserID}`);
            this.sock.send(JSON.stringify(msg));
        }
    }
}
