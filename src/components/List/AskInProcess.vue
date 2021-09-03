<template>
	<table>
		<tr>
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
	</table>	
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class AskInProcess extends Vue {
	@Prop({ type: Boolean }) readonly hasAmount!:boolean;
	@Prop({ type: Boolean }) readonly isEmergencyClosed!:boolean
}
</script>