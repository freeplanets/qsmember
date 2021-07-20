<template>
	<tr>
		<td>{{ item.Title }}</td>
		<td>{{ item.Records }}</td>
		<td>{{ item.Amount }}</td>
		<td>{{ item.LeverAmount }}</td>
		<td>{{ item.AvgLever }}</td>

		<td>{{ item.Items[1].Records }}</td>
		<td>{{ item.Items[1].Amount }}</td>
		<td>{{ item.Items[1].LeverAmount }}</td>
		<td>{{ item.Items[1].AvgLever }}</td>
		<td>{{ item.Items[1].GainLose }}</td>

		<td>{{ item.Items[0].Records }}</td>
		<td>{{ item.Items[0].Amount }}</td>
		<td>{{ item.Items[0].LeverAmount }}</td>
		<td>{{ item.Items[0].AvgLever }}</td>
		<td>{{ item.Items[0].GainLose }}</td>

		<td>{{ item.Fee }}</td>
		<td>{{ item.GainLose }}</td>
	</tr>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ItemTotal } from '../if/dbif';

@Component
export default class ItemType extends Vue {
	@Prop({ type: Object })	readonly item!:ItemTotal;
}
</script>
<style lang="scss" scoped>
td {
	border: 1px solid black;
}
</style>
