import LayoutStoreModule from 'src/layouts/data/LayoutStoreModule';
import { ChatMsg, WsMsg } from '../../if/dbif';
import ServiceChat from './ServiceChat';
import ASock from '../../WebSock/ASock';

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
	Send(message: string | WsMsg) {
		this.ws.send(message);
	}
	refreshCounter() {
		if (this.own) this.own.unread = this.TotalUnread;
	}
	accept(msg:ChatMsg):void {
		const fIdx = this.list.findIndex((itm) => itm.MemberID === msg.SenderID);
		if (fIdx === -1) {
			// console.log('accpet msg', msg);
			const newChat = new ServiceChat(this, this.LS, msg.MKey, msg.SenderID);
			// newChat.AcceptChat(msg);
			this.list.push(newChat);
		}
		this.acceptMsg(msg);
		// console.log('ChatManager accpet:', this.TotalUnread);
	}
	setOwner(own:any) {
		this.own = own;
	}
	private acceptMsg(msg:ChatMsg) {
		this.list.forEach((chat) => {
			chat.AcceptChat(msg);
		});
	}
}
