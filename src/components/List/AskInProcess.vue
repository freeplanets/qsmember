<template>
	<table>
		<tr class="bg-green-14">
			<th>{{ $t('Report.OrderNo') }}</th>
			<th>{{ $t('Table.AskTable.CreateTime') }}</th>
			<th>{{ $t('Table.AskTable.User') }}</th>
			<th>{{ $t('Table.AskTable.AskType') }}</th>
			<th>{{ $t('Table.AskTable.Lever') }}</th>
			<th>{{ hasAmount ? $t('Table.AskTable.Amount') : $t('Table.AskTable.Qty') }}</th>
			<th>{{ $t('Table.AskTable.Price') }}</th>
			<template v-if="isEmergencyClosed">
				<th>{{ $t('Label.MarkTS') }}</th>
				<th>{{ $t('Table.AskTable.Price') }}</th>
				<th>{{ $t('Label.Settle') }}</th>
			</template>
		</tr>
		<BAT v-for="(ask, idx) in list"
			:key="idx"
			:ask="ask"
			:isEmergencyClosed="isEmergencyClosed"
			@doSettle="doSettle"
		/>
	</table>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import BlockAskTR from '../Block/AskTR.vue';
import { AskIdPrice, AskWithMemberName } from '../if/dbif';

@Component({
	components: {
		BAT: BlockAskTR,
	},
})
export default class AskInProcess extends Vue {
	@Prop({ type: Array }) readonly list!: AskWithMemberName;
	@Prop({ type: Boolean }) readonly hasAmount!:boolean;
	@Prop({ type: Boolean }) readonly isEmergencyClosed!:boolean;
	@Watch('Asks')
	onAsksChange() {
		console.log('onAsksChange', this.list);
	}
	@Watch('isEmergencyClosed')
	onECChange() {
		console.log('onECChange', this.isEmergencyClosed);
	}
	doSettle(ask:AskIdPrice) {
		console.log('AskInProcess doSettle:', ask);
		this.$emit('doSettle', ask);
	}
}
</script>
<style lang="scss" scoped>
table {
	border-right: 1px $green-10 solid;
	border-top: 1px $green-10 solid;
	border-spacing: 0px;
	width: 100%;
}
th {
	border-bottom: 1px $green-10 solid;
	border-left: 1px $green-10 solid;
}
</style>
