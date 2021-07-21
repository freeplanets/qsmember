import { WebParams, Msg } from 'src/layouts/data/if';
import LayoutStoreModule from 'src/layouts/data/LayoutStoreModule';
import { ChatMsg, WsMsg } from '../if/dbif';
import { FuncKey, Channels, ErrCode } from '../if/ENum';
import ChatManager from './ChatManager';

export default abstract class AChat {
	protected list:ChatMsg[]=[];
	protected readed = 0;
	// protected ws:WSock;
	protected memid:number;
	private UserID:number;
	constructor(protected CM:ChatManager,protected LS:LayoutStoreModule, protected MKey:string, MemberID:number) {
		// this.ws = ws;
		this.memid = MemberID;
		this.UserID = this.LS.UserInfo.id;
	}
	abstract add(fromWho:string, msg:string):void;
	AcceptChat(msg:ChatMsg) {
		msg.sent = false;
		this.AddToList(msg);
		this.CM.refreshCounter();
	}
	get MemberID() {
		return this.memid;
	}
	get List() {
		return this.list;
	}
	get length() {
		return this.list.length;
	}
	get unReadedLength() {
		return this.length - this.readed;
	}
	Send(msg:string) {
		// console.log('AChat Send:', msg);
		const cMsg = this.CreateMsg(msg);
		// this.list.push(cMsg);
		// this.AddToList(cMsg);
		// console.log('AChat Sent:', this.list.length);
		const wsmsg:WsMsg = {
			Func: FuncKey.MESSAGE,
			ChannelName: Channels.ASK,
			Message: JSON.stringify(cMsg),
			UserID: this.UserID,
		};
		const param:WebParams = { ...this.LS.Param };
		param.WsMsg = wsmsg;
		this.LS.ax.getApi('cc/PostMessage', param, 'post').then((ans:Msg) => {
			if (ans.ErrNo === ErrCode.PASS) {
				// if (ans.MKey) this.MKey = ans.MKey;
				this.AddToList(cMsg);
			}
		}).catch((err) => {
			console.log('AChat Send Error:', err);
		})
		this.Readed();
	}
	AddToList(msg:ChatMsg) {
		if (this.list.length === 0) this.list.push(msg);
		else {
			const listIdx = this.list.length - 1;
			if (this.list[listIdx].sent === msg.sent) {
				const newT = msg.receiveTime as number;
				const oldT = this.list[listIdx].receiveTime as number;
				// console.log('AddToList', newT, oldT, newT - oldT);
				if (newT - oldT < 60000) {
					this.list[listIdx].text.push(msg.text[0]);
				} else {
					this.list.push(msg);
				}
			} else {
				this.list.push(msg);
			}
		}
	}
	Readed() {
		this.readed = this.length;
		this.CM.refreshCounter();
	}
	protected CreateMsg(msg:string):ChatMsg {
		const cMsg = this.createEmptyMsg();
		cMsg.text.push(msg);
		// cMsg.name = this.ws.UserName;
		cMsg.name = this.LS.UserInfo.Account;
		cMsg.sent = true;
		return cMsg;
	}	
	protected createEmptyMsg():ChatMsg {
		return {
			name: '',
			text: [],
			sent: false,
			receiveTime: new Date().getTime(),
			SenderID: this.UserID,
			ReceiverID: 0,
			MKey: this.MKey,
		};
	}
}
