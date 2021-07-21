<template>
	<div>
		<q-scroll-area ref="scrollArea" :style="`height: ${scrollHeight}px; max-width: ${scrollMaxWidth}px;`">
			<div class="chatbody">
				<blk-message-of-chat
					v-for="(msg,idx) in list"
					:key="idx"
					:message="msg"
				/>
			</div>
		</q-scroll-area>
		<q-separator />
		<div class="row chatinput">
			<div class="col-10"><q-input outlined v-model="message" dense /></div>
			<div class="col-2"><q-btn round color="secondary" size="sm" icon="send" @click="Send" /></div>
		</div>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { ChatMsg } from '../if/dbif';
import BlkMessageOfChat from './MessageOfChat.vue';
import AChat from '../class/AChat';
import FuncDate from '../Functions/MyDate';

@Component({
	components: {
		BlkMessageOfChat,
	},
})
export default class Chat extends Vue {
	@Prop({ type: Object }) readonly chat!:AChat;
	// @Prop({ type: Array }) list:ChatMsg[]=[];
	headerHeight = 32;
  bottomHeight = 60;
	height = 667;
	width = 450;
	scrollRef:any;
  scrollHeight = this.height - this.headerHeight - this.bottomHeight;
  scrollMaxWidth = this.width;
	list:ChatMsg[] = [];
	get messages() {
		return this.chat.List;
	}
	message = '';
	@Watch('messages', { deep: true, immediate: true })
	onMessagesChange() {
		// console.log('onMessgesChange:', this.messages.length);
		const rtn = this.messages.map((itm:ChatMsg) => {
			const minutesAgo = FuncDate.howMinutesAgo(itm.receiveTime);
			itm.stamp = this.getStamp(minutesAgo);
			return itm;
		});
		// console.log('onMessageChage:', rtn);
		if (rtn) this.list = rtn;
		this.scrollToBottom();
	}
	scrollToBottom() {
		if (this.scrollRef) {
			// console.log('ref', ref);
			const diff = this.scrollRef.scrollSize - this.scrollRef.containerSize;
			// console.log(ref.scrollSize, ref.containerSize, diff);
			if (diff > 0) {
				// ref.setScrollPosition('vertical', ref.scrollSize, 300);
				this.scrollRef.setScrollPosition(this.scrollRef.scrollSize, 300);
				// ref.scrollPosition = ref.scrollSize + 50;
				// ref.setScrollPercentage('vertical', 0.9, 300);
			}
			//console.log('after', ref.scrollPosition, ref.getScrollPosition());
		}		
	}
	getStamp(v:number) {
		if (v === 0) return '';
		let stamp = '';
		if (v < 60) {
			stamp = `${v} ${this.$t('Label.Stamp.Minutes')}`;
		} else {
			const h = Math.floor(v / 60);
			if (h < 24) {
				stamp = `${h} ${this.$t('Label.Stamp.Hours')}`;
			} else {
				const d = Math.floor(h / 24);
				stamp = `${d} ${this.$t('Label.Stamp.Days')}`;
			}
		}
		return stamp;
	}
	Send() {
		if (this.message) {
			this.chat.Send(this.message);
			this.message = '';
			// console.log('Chat Send:', this.messages.length, this.chat.List.length);
			// this.onMessagesChange();
			// this.chat.Readed();
		}
	}
	mounted() {
		this.chat.Readed();
		this.scrollRef = this.$refs.scrollArea;
		// console.log('Chat mounted', this.chat.unReadedLength, this.chat.length);
	}
}
</script>
<style lang="scss" scoped>
.chatinput {
	margin-top: 8px;
	margin-left: 12px;
}
.chatinput .q-btn {
	margin-left: 8px;
	margin-top: 4px;
}
</style>
