import LayoutStoreModule from 'src/layouts/data/LayoutStoreModule';
import { MsgCont } from '../../if/dbif';
import ServiceChat from './ServiceChat';
import ASock from '../../WebSock/ASock';
import { Channels } from '../../../components/if/ENum';

export default class ChatManager {
	private list:ServiceChat[] = [];
	private own:any = null;
	private ws:ASock;
	private LS:LayoutStoreModule;
	constructor(ws:ASock, LS:LayoutStoreModule) {
		this.ws = ws;
		this.LS = LS;
	}
	get List() {
		return this.list;
	}
	get TotalUnread() {
		let cnt = 0;
		this.list.forEach((itm) => {
			cnt += itm.unReadedLength;
		});
		return cnt;
	}
	Send(message: string | MsgCont) {
		this.ws.send(message);
	}
	refreshCounter() {
		if (this.own) this.own.unread = this.TotalUnread;
	}
	switchRoom(msg:MsgCont) {
		this.list.forEach((itm) => itm.SwitchRoom(msg));
	}
	accept(msg:MsgCont):void {
		const fIdx = this.list.findIndex((itm) => (msg.roomId !== Channels.SERVICE && itm.roomId === msg.roomId) || itm.MsgFrom === msg.Sender);
		if (fIdx === -1) {
			// console.log('accpet msg', msg);
			const newChat = new ServiceChat(this, this.LS, msg);
			// newChat.AcceptChat(msg);
			this.list.push(newChat);
		}
		this.acceptMsg(msg);
		// console.log('ChatManager accpet:', this.TotalUnread);
	}
	remove(msg:MsgCont) {
		let fIdx:number;
		if (msg.roomId !== Channels.SERVICE) {
			fIdx = this.list.findIndex((itm) => itm.roomId === msg.roomId);
		} else {
			fIdx = this.list.findIndex((itm) => itm.MsgFrom === msg.Receiver);
		}
		if (fIdx !== -1) {
			this.list.splice(fIdx, 1);
			this.refreshCounter();
		}
	}
	setOwner(own:any) {
		this.own = own;
	}
	private acceptMsg(msg:MsgCont) {
		this.list.forEach((chat) => {
			chat.AcceptChat(msg);
		});
	}
}
