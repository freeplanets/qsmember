import { FuncKey } from '../if/ENum';
import { AskTable, WsMsg, GetMessage } from '../if/dbif';
import { MsgType, Channels } from '../if/ENum';
// import { LayoutStoreModule } from '../../store/LayoutStoreModule';

const ClientChannel = Channels.ADMIN;

export default class WSock {
    private sock!:WebSocket;
    private receivedWelcome=false;
    // private list:AskTable[]=[];
    // private ledger: LedgerTotal[]=[];
    private list:GetMessage[] =[];
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
            console.log('onmessage', msg);
            if (msg.Ask) {
                this.doAsk(msg.Ask);
            } else if (msg.Asks) {
                if (Array.isArray(msg.Asks)) {
                    this.doAsks(msg.Asks);
                } else {
                    this.doAsk(msg.Asks);
                }
            } else if (msg.text) {

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
        this.list.forEach(mbr=>{
            if(mbr.Type === MsgType.ACCEPT_ASK) mbr.getMessage(ask);
        })
    }
    Add(mbr:GetMessage) {
        const fidx = this.list.findIndex(itm=>itm===mbr);
        if(fidx===-1) this.list.push(mbr);
    }
    Remove(mbr:GetMessage) {
        const fidx = this.list.findIndex(itm=>itm===mbr);
        if(fidx!==-1) this.list.splice(fidx,1);
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
