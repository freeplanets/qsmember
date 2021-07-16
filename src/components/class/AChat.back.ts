import { ChatMsg, WsMsg } from '../if/dbif';
import { FuncKey, Channels } from '../if/ENum';
import ChatManager from './ChatManager';
import WSock from '../WebSock/WSock';

export default abstract class AChat {
	protected list:ChatMsg[]=[];
	protected readed = 0;
	protected ws:WSock;
	protected memid:number;
	constructor(protected CM:ChatManager, ws:WSock, MemberID:number) {
		this.ws = ws;
		this.memid = MemberID;
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
		const cMsg = this.createEmptyMsg();
		cMsg.text.push(msg);
		cMsg.name = this.ws.UserName;
		cMsg.sent = true;
		// this.list.push(cMsg);
		this.AddToList(cMsg);
		console.log('AChat Sent:', this.list.length);
		const wsmsg:WsMsg = {
			Func: FuncKey.MESSAGE,
			ChannelName: Channels.ASK,
			Message: JSON.stringify(cMsg),
			UserID: this.ws.UserID,
		};
		this.ws.send(wsmsg);
	}
	AddToList(msg:ChatMsg) {
		if (this.list.length === 0) this.list.push(msg);
		else {
			const listIdx = this.list.length - 1;
			if (this.list[listIdx].sent === msg.sent) {
				const newT = msg.receiveTime as number;
				const oldT = this.list[listIdx].receiveTime as number;
				console.log('AddToList', newT, oldT, newT - oldT);
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
	protected createEmptyMsg():ChatMsg {
		return {
			name: '',
			text: [],
			sent: false,
			receiveTime: new Date().getTime(),
			SenderID: this.ws.UserID,
			ReceiverID: 0,
		};
	}
}
