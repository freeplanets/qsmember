import AChat from './AChat';
import { ChatMsg } from '../if/dbif';
// import WSock from '../WebSock/WSock';

export default class ServiceChat extends AChat {
	add(fromWho:string, msg:string, ReceiverID?:number) {
		const chat:ChatMsg = {
			name: fromWho,
			text: [msg],
			sent: false,
			receiveTime: new Date().getTime(),
			SenderID: 0,
			ReceiverID: ReceiverID ? ReceiverID : 0,
			MKey: this.MKey
		};
		this.list.push(chat);
	}
}
