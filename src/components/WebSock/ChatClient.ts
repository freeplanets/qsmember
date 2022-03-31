import ASock from './ASock';
// import LayoutStoreModule from 'src/layouts/data/LayoutStoreModule';
import { Channels } from '../if/ENum';
import { MsgCont } from '../if/dbif';

export default class ChatClient extends ASock {
	chkurl():string {
		// const ws = this.url === 'localhost:4002' ? 'ws' : 'wss';
		const ws = this.addPrefix(this.url);
		return `${ws}?host=${this.LSM.ax.Host}&auth=${this.LSM.ax.Auth}`;
		// return `${ws}://${this.url}/${this.site}/${Channels.ADMIN}/${this.UserID}_${this.UserName}?token1=1`;
	}
	OnOpen() {
		const msg:MsgCont = {
			roomId: Channels.SERVICE,
			action: 'enterRoom',
		};
		console.log('connected:', this.chkurl());
		this.send(msg);
	}
	OnMessage(data:string) {
		console.log('ChatClient OnMessage:', data);
		const msg = this.toJSON(data);
		if (msg) {
			console.log('ChatClient OnMessage text:', msg.text);
			this.chatM.accept(msg as MsgCont);
		}
	}
}
