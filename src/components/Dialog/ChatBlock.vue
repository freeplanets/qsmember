<template>
    <q-dialog
      v-model="dialog"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-cyan-1 text-black fixed-bottom-right">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" @click="CloseMe">
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pt-none">
					<div>
						<blk-chat :chat='chat'  />
					</div>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import BlkChat from '../Block/Chat.vue';
import AChat from '../class/AChat';

@Component({
	components: {
		BlkChat,
	},
})
export default class ChatBlock extends Vue {
	@Prop({ type: Boolean }) readonly value!:boolean;
	@Prop({ type: Object }) readonly chat!:AChat;
	dialog = false;
	@Watch('value')
	onValueChange() {
    if(this.value){
      if(this.chat){
        this.dialog = true;
      }
    } 
	}
	CloseMe() {
    this.dialog = false
		this.$emit('input', false);
	}
}
</script>
