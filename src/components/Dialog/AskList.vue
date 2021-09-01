<template>
	<q-dialog v-model="model">
		<q-card :style="`width: ${width}px; max-width: ${maxWidth}px`">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">{{ title }}</div>
				<q-space />
				<q-btn icon="close" flat round dense v-close-popup />
			</q-card-section>

			<q-card-section>
				<list-asks :list="list" :hasAmount="hasAmount" :doSettle="doSettle"></list-asks>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { AskWithMemberName } from '../if/dbif';
import ListAsks from '../List/Asks.vue';

@Component({
	components: {
		ListAsks,
	},
})
export default class extends Vue {
	@Prop({ type: Array }) readonly list!:AskWithMemberName[];
	@Prop({ type: String }) readonly title!:string;
	@Prop({ type: Boolean }) readonly value!:boolean;
	@Prop({ type: Boolean }) readonly hasAmount!:boolean;
	@Prop({ type: Boolean }) readonly isEmergencyClosed!:boolean
	model = false;
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
	doSettle(ask:any) {
		console.log('AskList doSettle', ask);
		this.$emit('doSettle', ask);
	}
	get width() {
		return Math.round(window.screen.width * 0.4);
	}
	get maxWidth() {
		return window.screen.width;
	}
}
</script>
