import { ChatMsg } from '../if/dbif';
import ServiceChat from './ServiceChat';
import WSock from '../WebSock/WSock';

export default class ChatManager {
	private list:ServiceChat[] = [];
	private own:any = null;
	constructor(private ws:WSock) {}
	get List() {
		return this.list;
	}
	get TotalUnread() {
		let cnt=0;
		this.list.forEach(itm=>{
			cnt += itm.unReadedLength;
		});
		return cnt;
	}
	refreshCounter() {
		if(this.own) this.own.unread = this.TotalUnread;
	}
	accept(msg:ChatMsg):void {
		const fIdx = this.list.findIndex(itm=>itm.MemberID === msg.SenderID);
		if(fIdx === -1) {
			const newChat = new ServiceChat(this, this.ws, msg.SenderID);
			// newChat.AcceptChat(msg);
			this.list.push(newChat);
		}
		this.acceptMsg(msg);
		console.log('ChatManager accpet:', this.TotalUnread);
	}
	setOwner(own:any) {
		this.own = own;
	}
	private acceptMsg(msg:ChatMsg) {
		this.list.forEach(chat=>{
			chat.AcceptChat(msg);
		});
	}
}