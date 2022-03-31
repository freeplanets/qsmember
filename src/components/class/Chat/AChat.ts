// import { WebParams, Msg } from 'src/layouts/data/if';
import { AnyObject } from 'src/layouts/data/if';
import LayoutStoreModule from 'src/layouts/data/LayoutStoreModule';
import { ChatMsg, MsgCont } from '../../if/dbif';
import { FuncKey } from '../../if/ENum';
import ChatManager from './ChatManager';

export default abstract class AChat {
	protected list:ChatMsg[]=[];
	protected readed = 0;
	protected messageFrom = '';
	protected SendTo = '';
	private UserID:number;
	constructor(protected CM:ChatManager, protected LS:LayoutStoreModule, protected roomId?:string, sender?:string) {
		// this.ws = ws;
		this.messageFrom = sender || '';
		this.UserID = this.LS.UserInfo.id;
		console.log('AChat constructor:', this.messageFrom, this.UserID, roomId);
	}
	abstract add(fromWho:string, msg:string):void;
	
	AcceptChat(msg:AnyObject) {
		const cMsg:ChatMsg = this.CreateMsg(msg.text || '');
		cMsg.sent = false;
		cMsg.name = msg.SenderNick || '';
		console.log('AChat AcceptChat', msg);
		if (!this.SendTo) this.SendTo = msg.Sender || '';
		this.AddToList(cMsg);
		this.CM.refreshCounter();
	}
	get MsgFrom() {
		return this.messageFrom;
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
		const cMsg:ChatMsg = this.CreateMsg(msg);
		console.log('AChat Create:', cMsg);
		// this.list.push(cMsg);
		this.AddToList(cMsg);
		// console.log('AChat Sent:', this.list.length);
		const msgS:MsgCont = {
			action: FuncKey.MESSAGE,
			text: msg,
			// roomId: this.SendTo,
			Receiver: this.MsgFrom,
		};
		console.log('AChat Sent:', msgS);
		/*
		const wsmsg:WsMsg = {
			// Func: FuncKey.MESSAGE,
			// ChannelName: Channels.ASK,
			toChannels: Channels.MEMBER,
			Message: JSON.stringify(cMsg),
			toWho: `${this.SendTo}`,
			UserID: this.UserID,
			// SendTo: this.SendTo,
		};
		*/
		this.CM.Send(msgS);
		/*
		const param:WebParams = { ...this.LS.Param };
		param.WsMsg = wsmsg;
		this.LS.ax.getApi('cc/PostMessage', param, 'post').then((ans:Msg) => {
			if (ans.ErrNo === ErrCode.PASS) {
				// if (ans.MKey) this.MKey = ans.MKey;
				this.AddToList(cMsg);
			}
		}).catch((err) => {
			console.log('AChat Send Error:', err);
		});
		*/
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
			ReceiverID: 0, // this.SendTo,
			MKey: this.roomId || '',
		};
	}
}
