import LayoutStoreModule from 'src/layouts/data/LayoutStoreModule';
import { FuncKey, MsgType, Channels } from '../if/ENum';
import { AskTable, WsMsg, GetMessage, ChatMsg } from '../if/dbif';
import ChatManager from '../class/Chat/ChatManager';

const ClientChannel = Channels.ADMIN;

export default class WSock {
    private sock!:WebSocket;
    private receivedWelcome=false;
    // private list:AskTable[]=[];
    // private ledger: LedgerTotal[]=[];
    private chatM:ChatManager;
    private list:GetMessage[] =[];
    private curMsg = '';
    constructor(private LSM:LayoutStoreModule, private url:string) {
        this.createConnection();
        this.chatM = new ChatManager(this, LSM);
    }
    private createConnection() {
        const ws = this.url === 'localhost:4001' ? 'ws' : 'wss';
        const wsurl = `${ws}://${this.url}`;
        // console.log(`connect to ${wsurl}`);
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
    get UserID() {
        return this.LSM.UserInfo.id;
    }
    get UserName() {
        return this.LSM.UserInfo.Account;
    }
    get message() {
        return this.curMsg;
    }
    get Chater() {
        return this.chatM;
    }
    send(message:string | WsMsg) {
        console.log('Try send:', message);
        if (!this.receivedWelcome) {
            console.log('Wait for connect.......');
            return;
        }
        if (this.sock.readyState === WebSocket.OPEN) {
            let msg:WsMsg;
            if (typeof message === 'string') {
                msg = {
                    Message: message,
                };
            } else {
                msg = message;
            }
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
            if (msg.Message) {
                this.receivedWelcome = true;
            }
            if (msg.Ask) {
                this.doAsk(msg.Ask);
            } else if (msg.Asks) {
                if (Array.isArray(msg.Asks)) {
                    this.doAsks(msg.Asks);
                } else {
                    this.doAsk(msg.Asks);
                }
            } else if (msg.SettleMark) {
                const SettleMark = msg.SettleMark;
                this.LSM.Mqtt.Items.forEach((itm) => {
                    itm.setSettleMark(SettleMark);
                });
            } else if (msg.text) {
                console.log('WSock doMsg text:', msg.text);
                this.chatM.accept(msg as ChatMsg);
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
    Add(mbr:GetMessage) {
        const fidx = this.list.findIndex((itm) => itm === mbr);
        if (fidx === -1) this.list.push(mbr);
    }
    Remove(mbr:GetMessage) {
        const fidx = this.list.findIndex((itm) => itm === mbr);
        if (fidx !== -1) this.list.splice(fidx, 1);
    }
    private JSONParse(v:string) {
        try {
            return JSON.parse(v);
        } catch (err) {
            return false;
        }
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
