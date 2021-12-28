<template>
	<tr v-if="item" :class="{ trline: !isDialog }" @click="showItem(item.key, item.Title)">
		<td>{{ item.Title }}</td>
		<td>{{ item.Records }}</td>
		<td>{{ item.Amount.toFixed(2) }}</td>
		<td>{{ item.LeverAmount.toFixed(2) }}</td>
		<td>{{ item.AvgLever.toFixed(2) }}</td>

		<td>{{ item.Items[1].Records }}</td>
		<td>{{ item.Items[1].Amount.toFixed(2) }}</td>
		<td>{{ item.Items[1].LeverAmount.toFixed(2) }}</td>
		<td>{{ item.Items[1].AvgLever.toFixed(2) }}</td>
		<td :class="{clrRed:item.Items[1].GainLose<0,clrGreen:item.Items[1].GainLose>0}">
				{{ item.Items[1].GainLose.toFixed(2) }}</td>

		<td>{{ item.Items[0].Records }}</td>
		<td>{{ item.Items[0].Amount.toFixed(2) }}</td>
		<td>{{ item.Items[0].LeverAmount.toFixed(2) }}</td>
		<td>{{ item.Items[0].AvgLever.toFixed(2) }}</td>
		<td :class="{clrRed:item.Items[0].GainLose<0,clrGreen:item.Items[0].GainLose>0}">
			{{ item.Items[0].GainLose.toFixed(2) }}</td>
		<td :class="{last:true, clrRed:item.GainLose<0,clrGreen:item.GainLose>0}">
			{{ item.GainLose.toFixed(2) }}</td>
		<td>{{ item.Fee.toFixed(2) }}</td>
		<td>{{ item.FeeShort.toFixed(2) }}</td>
		<td :class="{last:true, clrRed:item.GainLose<0,clrGreen:item.GainLose>0}">
			{{ item.NetGainLose.toFixed(2) }}</td>
	</tr>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { ItemTotal } from '../if/dbif';

@Component
export default class ItemType extends Vue {
	@Prop({ type: Object })	readonly itemT!:ItemTotal;
	@Prop({ type: Boolean }) readonly isDialog!:boolean;
	item:ItemTotal | undefined;
	@Watch('itemT', { deep: true, immediate: true })
	onItemTChange() {
		// console.log('ItemType onItemTChange', this.itemT);
		this.item = this.itemT;
	}
	showItem(key:number, title:string) {
		if (!this.isDialog) {
			this.$emit('showItem', key, title);
		}
	}
}
</script>
<style lang="scss" scoped>
.trline:hover {
	background-color: lightblue;
	cursor: pointer;
}
td {
	border-left: 1px solid black;
	border-bottom: 1px solid black;
	text-align: right;
	padding-right: 4px;
	padding-left: 4px;
}
.last {
		border-right: 1px solid black;
}
</style>
