import ASock from './ASock';
// import LayoutStoreModule from 'src/layouts/data/LayoutStoreModule';
import { Channels, FuncKey } from '../if/ENum';
import { MsgCont, AnyObject, KeyMsgs } from '../if/dbif';

export default class ChatClient extends ASock {
	// private roomId = '';
	chkurl():string {
		// const ws = this.url === 'localhost:4002' ? 'ws' : 'wss';
		const ws = this.addPrefix(this.url);
		return `${ws}?host=${this.LSM.ax.Host}&auth=${this.LSM.ax.Auth}`;
		// return `${ws}://${this.url}/${this.site}/${Channels.ADMIN}/${this.UserID}_${this.UserName}?token1=1`;
	}
	OnOpen() {
		this.enterRoom(Channels.SERVICE);
	}
	OnMessage(data:string) {
		console.log('ChatClient OnMessage:', data);
		const msg:MsgCont = this.toJSON(data) as MsgCont;
		switch (msg.action) {
			case FuncKey.MESSAGE:
				console.log('ChatClient OnMessage text:', msg.text);
				this.chatM.accept(msg);
				break;
			case FuncKey.ENTER_ROOM:
				// this.roomId = String(msg.roomId);
				this.getMessage(Channels.SERVICE);
				break;
			case FuncKey.GET_MESSAGE:
				if (msg.Msgs) this.addTo(msg.Msgs);
				break;
			case FuncKey.NEW_ROOM:
				console.log('do new room');
				this.chatM.switchRoom(msg);
				break;
			case FuncKey.CLOSE_CONVERSATION:
				this.chatM.remove(msg);
				break;
			default:
				console.log('On Message default:', msg);
		}
	}
	private addTo(msg:KeyMsgs) {
		// console.log('addTo', this.roomId);
		Object.keys(msg).map((key) => {
			const msgs = msg[key];
			msgs.forEach((itm) => {
				const tmp:MsgCont = {
					action: FuncKey.MESSAGE,
					Sender: itm.Sender,
					text: itm.message,
					receiveTime: itm.receiveTime,
					MessageID: itm.MessageID,
					roomId: key,
				};
				// this.addToChat(tmp);
				this.chatM.accept(tmp);
			});
		});
	}
	enterRoom(roomId:string) {
		const msg:MsgCont = {
			action: FuncKey.ENTER_ROOM,
			text: '',
			roomId,
		};
		this.send(msg);
	}
	getMessage(roomId:string) {
		const msg:MsgCont = {
			action: FuncKey.GET_MESSAGE,
			text: '',
			roomId,
		};
		this.send(msg);
	}
	// override send
	send(message: string | AnyObject): void {
		if (typeof message === 'string') {
			message = { text: message };
		}
		const msg = { ...message } as MsgCont;
		if (!msg.roomId || msg.roomId === Channels.SERVICE) {
			if (msg.action === FuncKey.MESSAGE) {
				msg.action = FuncKey.NEW_ROOM;
			}
		}
		msg.Sender = this.UserName;
		console.log('override send:', msg);
		super.send(msg);
	}
}
