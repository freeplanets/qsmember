<template>
	<div>
		<block-ask-header />
		<block-ask
			v-for="(ask,idx) in list"
			:key="idx"
			:ask="ask"
		/>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { AskTable } from '../if/dbif';
import BlockAsk from '../Block/Ask.vue';
import BlockAskHeader from '../Block/AskHeader.vue';

@Component({
	components: {
		BlockAsk,
		BlockAskHeader,
	},
})
export default class Asks extends Vue {
	@Prop({ type: Array }) readonly list!:AskTable[];
}
</script>
