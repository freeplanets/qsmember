<template>
	<div>
		<block-ask-header :hasAmount="hasAmount" :isEmergencyClosed="isEmergencyClosed" />
		<block-ask
			v-for="(ask,idx) in list"
			:key="idx"
			:ask="ask"
			:isEmergencyClosed="isEmergencyClosed"
			:doSettle="doSettle"
		/>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { AskWithMemberName } from '../if/dbif';
import BlockAsk from '../Block/Ask.vue';
import BlockAskHeader from '../Block/AskHeader.vue';

@Component({
	components: {
		BlockAsk,
		BlockAskHeader,
	},
})
export default class Asks extends Vue {
	@Prop({ type: Array }) readonly list!:AskWithMemberName[];
	@Prop({ type: Boolean }) readonly hasAmount!:boolean;
	@Prop({ type: Boolean }) readonly isEmergencyClosed!:boolean;
	doSettle(ask:any) {
		console.log('asks doSettle', ask);
		this.$emit('doSettle', ask);
	}
}
</script>
