import LayoutStoreModule from 'src/layouts/data/LayoutStoreModule';
import ChatManager from '../class/Chat/ChatManager';
import { WsMsg, GetMessage, MsgCont, ObjWithServerInfo } from '../if/dbif';
import StrFunc from '../Functions/MyStr';
import { FuncKey } from '../if/ENum';

export default abstract class ASock {
	protected sock:WebSocket | null = null;
	protected list:GetMessage[] =[];
	private isConnected = false;
	protected chatM:ChatManager;
	protected objInfo: ObjWithServerInfo | null = null;
	constructor(protected LSM:LayoutStoreModule, protected url:string, protected site = '') {
		this.createConnection();
		this.chatM = new ChatManager(this, LSM);
	}
	protected addPrefix(url:string):string {
		const ws = url === 'localhost:4001' || url === 'localhost:4002' ? 'ws' : 'wss';
		return `${ws}://${url}`;
	}
	get UserID() {
		return this.LSM.UserInfo.id;
	}
	get UserName() {
			return this.LSM.UserInfo.Account;
	}
	get Chater() {
			return this.chatM;
	}
	setMsg(objVue:ObjWithServerInfo) {
		this.objInfo = objVue;
	}
	protected abstract OnMessage(msg:string):void;
	protected abstract OnOpen():void;
	protected abstract chkurl():string;
	private createConnection() {
		const wsurl = this.chkurl();
		console.log(`connect to ${wsurl}`);
		this.sock = null;
		this.sock = new window.WebSocket(wsurl);
		this.sock.onerror = (event:Event) => {
				console.log('Error from server:', wsurl, event);
		};
		this.sock.onmessage = (event:MessageEvent) => {
				this.OnMessage(event.data.toString());
		};
		this.sock.onopen = (/* ev:Event */) => {
				// this.registerChannel(ClientChannel);
				// console.log('Chat onopen', ev);
				this.isConnected = true;
				this.OnOpen();
		};
		this.sock.onclose = (event:CloseEvent) => {
				console.log('onclose', event);
				setTimeout(() => {
						this.createConnection();
				}, 5000);
		};
	}
	send(message:string | MsgCont | WsMsg) {
		console.log('Try send:', message);
		if (!this.isConnected) {
				console.log('Wait for connect.......');
				return;
		}
		if (this.sock && this.sock.readyState === WebSocket.OPEN) {
				let msg:MsgCont | WsMsg;
				if (typeof message === 'string') {
						msg = {
								action: FuncKey.MESSAGE,
								text: message,
						};
				} else {
						msg = message;
				}
				this.sock.send(JSON.stringify(msg));
		} else {
				console.log('no server connect....');
		}
	}
	protected JSONParse(v:string) {
		try {
				return JSON.parse(v);
		} catch (err) {
				return false;
		}
	}
	Add(mbr:GetMessage) {
		const fidx = this.list.findIndex((itm) => itm === mbr);
		if (fidx === -1) this.list.push(mbr);
	}
	Remove(mbr:GetMessage) {
			const fidx = this.list.findIndex((itm) => itm === mbr);
			if (fidx !== -1) this.list.splice(fidx, 1);
	}
	toJSON(str:string) {
		return StrFunc.toJSON(str);
	}
}
