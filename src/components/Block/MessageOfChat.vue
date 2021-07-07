<template>
	<q-chat-message
		:name="message.name"
		:text="message.text"
		:stamp="message.stamp"
		:sent="message.sent"
		:text-color="textColor"
		:bg-color="bgColor"
	></q-chat-message>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ChatMsg } from '../if/dbif';

@Component
export default class MessageOfChat extends Vue {
	@Prop({ type: Object }) readonly message!:ChatMsg;
	senderTxtColor = 'dark';
	senderBgColor = 'green-5';
	txtColor = 'white' ;
	backColor = 'grey-6' ;
	get textColor():string {
		return this.message.sent ? this.senderTxtColor : this.txtColor;
	}
	get bgColor():string {
		return this.message.sent ? this.senderBgColor : this.backColor;
	}
}
</script>
