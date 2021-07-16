<template>
	<div class="row block_ask_header bg-cyan-8">
		<div class="col-1 txtCenter">{{ $t('Report.OrderNo') }}</div>
		<div class="col-3 txtCenter">{{ $t('Table.AskTable.CreateTime') }}</div>
		<div class="col-1 txtCenter">{{ $t('Table.AskTable.User') }}</div>
		<div class="col-1 txtCenter">{{ $t('Table.AskTable.AskType') }}</div>
		<div class="col-2 txtCenter">{{ $t('Table.AskTable.Lever') }}</div>
		<div class="col-2 txtCenter">{{ $t('Table.AskTable.Qty') }}</div>
		<div class="col-2 txtCenter">{{ $t('Table.AskTable.Price') }}</div>
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AskHeader extends Vue {
	
}
</script>
<style lang="scss" scoped>
.block_ask_header {
	border-top: 1px $green-10 solid;
	border-right: 1px $green-10 solid;
	border-bottom: 1px $green-10 solid;
	color: white;
}
.block_ask_header div {
	border-left: 1px $green-10 solid;
}
</style>