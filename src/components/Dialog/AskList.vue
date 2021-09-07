<template>
	<q-dialog v-model="model">
		<q-card :style="`width: ${width}px; max-width: ${maxWidth}px`">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">{{ title }}</div>
				<q-space />
				<q-btn icon="close" flat round dense v-close-popup />
			</q-card-section>

			<q-card-section>
				<list-asks
					:list="list"
					:hasAmount="hasAmount"
					@doSettle="doSettle"
					:isEmergencyClosed="isEmergencyClosed"
				></list-asks>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { AskIdPrice, AskWithMemberName } from '../if/dbif';
// import ListAsks from '../List/Asks.vue';
import ListAsks from '../List/AskInProcess.vue';

@Component({
	components: {
		ListAsks,
	},
})
export default class AskList extends Vue {
	@Prop({ type: Array }) readonly list!:AskWithMemberName[];
	@Prop({ type: String }) readonly title!:string;
	@Prop({ type: Boolean }) readonly value!:boolean;
	@Prop({ type: Boolean }) readonly hasAmount!:boolean;
	@Prop({ type: Boolean }) readonly isEmergencyClosed!:boolean
	model = false;
	@Watch('isEmergencyClosed')
	onECChange() {
		console.log('AskList onECChange', this.isEmergencyClosed);
	}
	/*
	@Watch('list')
	onListChange() {
		console.log('AskList onListChange', this.list);
	}
	*/
	@Watch('value')
	onValueChange() {
		if (this.value) this.model = true;
	}
	@Watch('model')
	onModelChange() {
		if (!this.model) {
			this.$emit('input', false);
		}
	}
	doSettle(ask:AskIdPrice) {
		console.log('AskList doSettle', ask);
		this.$emit('doSettle', ask);
	}
	get width() {
		let base = 0.4;
		if (this.isEmergencyClosed) base = 0.6;
		return Math.round(window.screen.width * base);
	}
	get maxWidth() {
		return window.screen.width;
	}
}
</script>
