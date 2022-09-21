<template>
	<tr class="list" v-if="mgl && mgl.Nickname">
		<td>{{ mgl.Nickname }}</td>
		<td class="number">{{ mgl.Total.toFixed(2) }}</td>
		<td class="number">{{ mgl.LeverTotal.toFixed(2) }}</td>
		<td class="number">{{ (mgl.LeverAvgRate*100).toFixed(2) }}</td>
		<td class="number">{{ mgl.GainLose.toFixed(2) }}</td>
		<td class="number">{{ mgl.GainLoseRate.toFixed(2) }}</td>
		<td class="number">{{ mgl.CLevel }}</td>
		<td><q-select outlined dense hide-bottom-space v-model="model" :options="options" /></td>
	</tr>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import MemberGainLose from '../class/GainLose/Member';
import { OpTypes } from '../if/ENum';
import { MemberCLevel } from '../if/dbif';

@Component
export default class MemberGainLoseLine extends Vue {
	@Prop({ type: Object })	readonly mgl!: MemberGainLose;
	@Watch('mgl', { deep: true, immediate: true })
	onMglChange() {
		// console.log('onMglChang');
		// this.mgl.setObjectHasSetValue(this);
		this.model = this.mgl.CLevel;
	}
	model = '';
	@Watch('model')
	onModelChange() {
		if (this.model !== this.mgl.CLevel) {
			this.setValue({ id: this.mgl.id, CLevel: this.model });
		}
		// console.log('onModelChange:', this.model);
	}
	get options() {
		return Object.values(OpTypes);
	}
	setValue(v:MemberCLevel) {
		this.$emit('setCLevel', v);
	}
}
</script>
<style lang="scss" scoped>
.list td {
	border-left: 1px solid $indigo-10;
	border-bottom: 1px solid $indigo-10;
	padding: 0 8px 0 16px;
}
.number {
	text-align: right;
}
</style>
