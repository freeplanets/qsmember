import { FuncKey } from '../if/ENum';
import { AskTable, WsMsg } from '../if/dbif';
// import { LayoutStoreModule } from '../../store/LayoutStoreModule';

const ClientChannel = 'AskChannel';

export default class WSock {
    private sock!:WebSocket;
    private receivedWelcome=false;
    // private list:AskTable[]=[];
    // private ledger: LedgerTotal[]=[];
    private curMsg = '';
    constructor(private url:string, private UserID:number) {
        this.createConnection();
    }
    private createConnection() {
        const ws = this.url === 'localhost:4001' ? 'ws' : 'wss';
        const wsurl = `${ws}://${this.url}`;
        console.log(`connect to ${wsurl}`);
        this.sock = new window.WebSocket(wsurl);
        this.sock.onerror = (event:Event) => {
            console.log('Websocket server connecting error:', event);
        };
        this.sock.onmessage = (event:MessageEvent) => {
            this.doMsg(event.data);
        };
        this.sock.onopen = () => {
            // console.log('onopen', event);
            this.registerChannel(ClientChannel);
        };
        this.sock.onclose = (event:CloseEvent) => {
            console.log('onclose', event);
            setTimeout(() => {
                this.createConnection();
            }, 5000);
        };
    }

    get message() {
        return this.curMsg;
    }
    /*
  set List(asks:AskTable[]) {
    // this.User.Asks = asks;
    this.list = asks;
  }
  get List():AskTable[] {
    // return this.LSM.UserAsks;
    // return this.User.Asks;
    return this.list;
  }
  get Ledger():LedgerTotal[] {
    return this.ledger;
  }
  set Ledger(ldg:LedgerTotal[]) {
    this.ledger = ldg;
  }
  */
    /*
  setList(asks:AskTable[]) {
    // this.list = asks;
    this.User.Asks = asks;
  }
  */
    send(message:string) {
        console.log('Try send:', message);
        if (!this.receivedWelcome) {
            console.log('Wait for connect.......');
            return;
        }
        if (this.sock.readyState === WebSocket.OPEN) {
            const msg:WsMsg = {
                Message: message,
            };
            this.sock.send(JSON.stringify(msg));
        } else {
            console.log('no server connect....');
        }
    }
    private doMsg(data:any) {
    // this.NewMessage = data;
    // this.curMsg = data;
    // console.log('onmessage', data);
        try {
            const msg:WsMsg = JSON.parse(data);
            // console.log('onmessage', msg);
            if (msg.Ask) {
                this.doAsk(msg.Ask);
            } else if (msg.Asks) {
                if (Array.isArray(msg.Asks)) {
                    this.doAsks(msg.Asks);
                } else {
                    this.doAsk(msg.Asks);
                }
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
    /*
    let foundIdx = 0;
    foundIdx = this.List.findIndex((itm) => itm.id === ask.id);
    if (foundIdx === -1) {
      if (ask.ProcStatus < 2) this.List.push(ask);
    } else if (ask.ProcStatus > 1) {
      this.List.splice(foundIdx, 1);
    } else {
      this.List.splice(foundIdx, 1, ask);
    }
    */
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
