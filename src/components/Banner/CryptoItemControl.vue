<template>
	<div class="row banblock">
		<div class="col-2 banhead">項目</div>
		<div class="col-2 banhead">行情</div>
		<div class="col">
			<div class="row">
				<div class="col">多</div>
				<div class="col">金額</div>
				<div class="col">即時損益</div>
				<div class="col">單筆上限</div>
				<div class="col">停收</div>
			</div>
			<div class="row">
				<div class="col">空</div>
				<div class="col">金額</div>
				<div class="col">即時損益</div>
				<div class="col">單筆上限</div>
				<div class="col">停收</div>
			</div>
		</div>	
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class extends Vue {
	
}
</script>
<style lang="scss" scoped>
.banblock {
	border: 1px seagreen solid;
	background-color: $light-green-1;
}
.banhead {
	margin-top: 10px;
}
</style>
