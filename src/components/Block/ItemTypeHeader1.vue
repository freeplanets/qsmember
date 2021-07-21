<template>
	<tr>
		<th rowspan="2">{{ isLedger ? $t('Report.Item') : $t('Label.WebSite') }}</th>
		<th rowspan="2">{{ $t('Label.RecordCount') }}</th>
		<th rowspan="2">{{ $t('Report.OdrAmt') }}</th>
		<th rowspan="2">{{ $t('Report.LeverAmt') }}</th>
		<th rowspan="2">{{ $t('Report.AvgLever') }}</th>
		<th colspan="5">{{ $t('Select.Crypto.ItemTypeLong.1') }}</th>
		<th colspan="5">{{ $t('Select.Crypto.ItemTypeLong.0') }}</th>
		<th rowspan="2">{{ $t('Table.AskTable.Fee') }}</th>
		<th rowspan="2" class="last">{{ $t('Report.TotalGainLose') }}</th>
	</tr>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ItemTypeHeader1 extends Vue{
	@Prop({ type: Boolean }) readonly isLedger!:boolean;
}
</script>
<style lang="scss" scoped>
th {
	border-top: 1px solid black;	
	border-left: 1px solid black;
	border-bottom: 1px solid black;
}
.last {
	border-right: 1px solid black;
}
</style>
