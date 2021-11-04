<template>
	<div class="row">
		<div v-if="!show" class="row">
			<q-btn
				v-for="(chat,idx) in list"
				:key="idx"
				@click="showDlg(chat)"
				dense flat round icon="person_outline" class="q-ml-md">
				<q-badge :color="`${ chat.unReadedLength ? 'red' : 'grey' }`" floating>{{ chat.unReadedLength }}</q-badge>
			</q-btn>
		</div>
		<q-btn dense color="secondary" round icon="connect_without_contact" class="q-ml-md" @click="show=!show">
      <q-badge :color="`${ unread ? 'red' : 'grey' }`" floating>{{ unread }}</q-badge>
    </q-btn>
		<dlg-chat-block v-model="model" :chat="curChat"></dlg-chat-block>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import LayoutStoreModule from '../../layouts/data/LayoutStoreModule';

import ServiceChat from '../class/Chat/ServiceChat';
import DlgChatBlock from '../Dialog/ChatBlock.vue';
import ChatClient from '../WebSock/ChatClient';

@Component({
	components: {
		DlgChatBlock,
	},
})
export default class MsgControl extends Vue {
	store = getModule(LayoutStoreModule);
	get CSock() {
		return this.store.CSock as ChatClient;
	}
	get Chater() {
		return this.CSock.Chater;
	}
	get list() {
		return this.CSock.Chater.List;
	}
	unread = 0;
	show=true;
	model=false;
	curChat:ServiceChat | null = null;
	showDlg(chat:ServiceChat) {
		this.curChat = chat;
		this.model = true;
	}
	@Watch('unread')
	onUnreadChange() {
		console.log('Unread', this.unread);
	}
	mounted() {
		this.Chater.setOwner(this);
	}
}
</script>
