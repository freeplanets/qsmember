// import { WebParams, Msg } from 'src/layouts/data/if';
import LayoutStoreModule from 'src/layouts/data/LayoutStoreModule';
import { ChatMsg, MsgCont } from '../../if/dbif';
import { FuncKey } from '../../if/ENum';
import ChatManager from './ChatManager';

export default abstract class AChat {
	protected list:ChatMsg[] = [];
	private listkey:number[] = [];
	protected readed = 0;
	protected messageFrom = '';
	protected SendTo = '';
	private UserID:number;
	private UserName:string;
	private RoomID = '';
	constructor(protected CM:ChatManager, protected LS:LayoutStoreModule, msg:MsgCont) {
		// this.ws = ws;
		this.messageFrom = msg.Sender || '';
		this.UserID = this.LS.UserInfo.id;
		this.UserName = this.LS.UserInfo.Account;
		this.RoomID = msg.roomId || '';
		this.AcceptChat(msg);
		console.log('AChat constructor:', this.messageFrom, this.UserID, this.MsgFrom);
	}
	abstract add(fromWho:string, msg:string):void;
	get roomId() {
		return this.RoomID;
	}
	SwitchRoom(msg:MsgCont) {
		console.log('SwitchRoom', msg, this.RoomID, this.MsgFrom);
		if (msg.roomId) {
			if (msg.Receiver === this.MsgFrom) {
				this.RoomID = msg.roomId;
				this.AcceptChat(msg);
			}
		}
	}
	AcceptChat(msg:MsgCont) {
		console.log('AChat AcceptChat', msg);
		if (this.RoomID === msg.roomId || this.MsgFrom === msg.Sender) {
			const MessageID = msg.MessageID || 0;
			const f = this.listkey.find((itm) => itm === MessageID);
			if (!f) {
				this.listkey.push(MessageID);
				this.AddToList(msg);
			}
		}
		this.CM.refreshCounter();
		// if (msg.Sender === this.UserName) this.Readed();
		/*
		const cMsg:ChatMsg = this.CreateMsg(msg);
		cMsg.sent = msg.Sender === this.UserName;
		cMsg.name = msg.SenderNick || msg.Sender || '';
		// if (!this.SendTo) this.SendTo = msg.Sender || '';
		if (msg.Sender !== this.UserName) this.SendTo = msg.Sender || '';
		*/
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
	Send(msg:string, action = FuncKey.GET_MESSAGE) {
		const msgS:MsgCont = {
			action,
			text: msg,
			// roomId: this.SendTo,
			Receiver: this.MsgFrom,
			roomId: this.roomId,
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
	private AddToList(msg:MsgCont) {
		const chat:ChatMsg = this.CreateMsg(msg);
		console.log('AddToList', chat);
		if (this.list.length === 0) {
			this.list.push(chat);
		} else {
			const listIdx = this.list.length - 1;
			if (this.list[listIdx].sent === chat.sent) {
				const newT = chat.receiveTime;
				const oldT = this.list[listIdx].receiveTime;
				// console.log('AddToList', newT, oldT, newT - oldT);
				if (newT - oldT < 60000) {
					this.list[listIdx].text.push(chat.text[0]);
				} else {
					this.list.push(chat);
				}
			} else {
				this.list.push(chat);
			}
		}
	}
	Readed() {
		this.readed = this.length;
		this.CM.refreshCounter();
	}
	protected CreateMsg(msg:string|MsgCont):ChatMsg {
		const cMsg = this.createEmptyMsg();
		if (typeof msg === 'string') {
			cMsg.text.push(msg);
			cMsg.sent = true;
			cMsg.name = this.LS.UserInfo.Account;
		} else {
			cMsg.text.push(msg.text);
			cMsg.receiveTime = msg.receiveTime || 0;
			cMsg.sent = msg.Sender === this.UserName;
			cMsg.name = msg.SenderNick || msg.Sender || '';
		}
		// cMsg.name = this.ws.UserName;
		return cMsg;
	}
	protected createEmptyMsg():ChatMsg {
		return {
			name: '',
			text: [],
			sent: false,
			receiveTime: new Date().getTime(),
			SenderID: this.UserID,
		};
	}
}
