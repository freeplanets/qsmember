<template>
	<div v-if="ask" class="row block_ask">
		<div class="col-1 txtRight">{{ ask.id }}</div>
		<div class="col-3 txtCenter">{{ CreateTime }}</div>
		<div class="col-1 txtCenter">{{ ask.UserID }}</div>
		<div :class="{ 'col-1 txtCenter':true, clrGreen:isGreen, clrRed:isRed }">{{ ItemType }}</div>
		<div class="col-2 txtRight">{{ ask.Qty }}</div>
		<div class="col-2 txtRight">{{ ask.AskPrice }}</div>
		<div class="col-2 txtRight">{{ ask.Lever }}</div>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import DateFunc from '../Functions/MyDate';
import NumsFunc from '../Functions/Nums';
import { AskTable } from '../if/dbif';

@Component
export default class Ask extends Vue{
	@Prop( { type: Object }) readonly ask!:AskTable;
	get CreateTime() {
		return DateFunc.toLocalString(this.ask.CreateTime);
	}
	get ItemType() {
		const itemType = this.ask.ItemType < 0 ? 0 : 1;
		return String(this.$t(`Select.Crypto.ItemType.${itemType}`));
	}
	get isGreen():boolean {
		return NumsFunc.isGreen(this.ask.ItemType);
	}
	get isRed():boolean {
		return NumsFunc.isRed(this.ask.ItemType);
	}
}
</script>
<style lang="scss" scoped>
.block_ask {
	border-right: 1px $green-10 solid;
	border-bottom: 1px $green-10 solid;
}
.block_ask div {
	border-left: 1px $green-10 solid;
}
.txtRight {
	padding-right: 8px;
}
</style>
