<template>
	<table>
		<tr class="bg-indigo-7">
			<th>{{ $t('Table.AskTable.Price') }}</th>
			<th>{{ $t('Table.AskTable.Qty') }}</th>
			<th>{{ $t('Label.Time') }}</th>
		</tr>
		<tr v-for="(itm,idx) in list"
			:key="`pt_${idx}`"
		>
			<td>{{ itm.lastPrice.toFixed(2) }}</td>
			<td>{{ itm.lastVol }}</td>
			<td>{{ toMyDate(itm.ticktime) }}</td>
		</tr>
	</table>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import DateFunc from 'components/Functions/MyDate';

@Component
export default class PriceTick extends Vue {
	@Prop({ type: Array }) readonly list!:PriceTick[];
	toMyDate(date:number) {
		return DateFunc.toLocalString(date);
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
	color: white;
}
td {
	padding: 0 8px 0 8px;
	border-bottom: 1px $green-10 solid;
	border-left: 1px $green-10 solid;
}
</style>
