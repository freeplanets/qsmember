<template>
	<div>
		<div class="row">
			<div class="col-1 bg-secondary">ID</div>
			<div class="col-1 bg-secondary">PfID</div>
			<div class="col-3 bg-secondary">MKey</div>
			<div class="col-2 bg-secondary">ModifyTime</div>
		</div>
		<div
			v-for="itm in list" :key="'pfkey'+ itm.id"
			class="row">
			<div class="col-1">{{ itm.id }}</div>
			<div class="col-1">{{ itm.PfName }}</div>
			<div class="col-3">{{ itm.MKey }}</div>
			<div class="col-2">{{ showDate(itm.CreateTime) }}</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PfKey } from '../if/dbif';
import FuncDate from '../Functions/MyDate';

@Component
export default class List extends Vue {
	@Prop({ type: Array })	readonly list!:PfKey[];
	showDate(v:string) {
		return FuncDate.toLocalStringNoYear(v);
	}
}
</script>
