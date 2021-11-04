import ASock from './ASock';
// import LayoutStoreModule from 'src/layouts/data/LayoutStoreModule';
import { Channels, FuncKey } from '../if/ENum';
import { WsMsg, ChatMsg } from '../if/dbif';

export default class ChatClient extends ASock {
	chkurl():string {
		const ws = this.url === 'localhost:4002' ? 'ws' : 'wss';
		return `${ws}://${this.url}/${this.site}/${Channels.ADMIN}/${this.UserID}_${this.UserName}`;
	}
	OnOpen() {
		const msg:WsMsg = {
			Func: FuncKey.SET_CHANNEL,
			ChannelName: Channels.SERVICE,
		};
		console.log('connected:', this.chkurl());
		this.send(msg);
	}
	OnMessage(data:string) {
		console.log(data);
		const msg = this.toJSON(data);
		if (msg) {
			console.log('ChatClient OnMessage text:', msg.text);
			this.chatM.accept(msg as ChatMsg);
		}
	}
}
