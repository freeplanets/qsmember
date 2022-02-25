<template>
	<div class="q-pa-md">
		<div class="row">
			<div class="col-1">{{ $t('Game.VNNorth.OpenTitle.Spirit') }}</div>
			<div>
				<q-input class="numboxL" outlined dense v-model="nums[0]" />
			</div>
		</div>
		<q-separator color="secondary" />
		<div class="row">
			<div class="col-1">{{ $t('Game.VNNorth.OpenTitle.SpNo') }}</div>
			<div class="col">
				<q-input class="numboxL" outlined dense v-model="nums[1]" />
			</div>
		</div>
		<q-separator color="secondary" />
		<div class="row">
			<div class="col-1">{{ $t('Game.VNNorth.OpenTitle.P1st') }}</div>
			<div class="col">
				<q-input class="numboxL" outlined dense v-model="nums[2]" />
			</div>
		</div>
		<q-separator color="secondary" />
		<div class="row">
			<div class="col-1">{{ $t('Game.VNNorth.OpenTitle.P2nd') }}</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[3]" />
			</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[4]" />
			</div>
		</div>
		<q-separator color="secondary" />
		<div class="row">
			<div class="col-1">{{ $t('Game.VNNorth.OpenTitle.P3rd') }}</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[5]" />
			</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[6]" />
			</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[7]" />
			</div>
			<div class="col">
				<q-input class="numboxL" outlined dense v-model="nums[8]" />
			</div>
		</div>
		<div class="row">
			<div class="col-1"></div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[9]" />
			</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[10]" />
			</div>
		</div>
		<q-separator color="secondary" />
		<div class="row">
			<div class="col-1">{{ $t('Game.VNNorth.OpenTitle.P4th') }}</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[11]" />
			</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[12]" />
			</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[13]" />
			</div>
			<div class="col">
				<q-input class="numboxL" outlined dense v-model="nums[14]" />
			</div>
		</div>
		<q-separator color="secondary" />
		<div class="row">
			<div class="col-1">{{ $t('Game.VNNorth.OpenTitle.P5th') }}</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[15]" />
			</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[16]" />
			</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[17]" />
			</div>
			<div class="col">
				<q-input class="numboxL" outlined dense v-model="nums[18]" />
			</div>
		</div>
		<div class="row">
			<div class="col-1"></div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[19]" />
			</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[20]" />
			</div>
		</div>
		<q-separator color="secondary" />
		<div class="row">
			<div class="col-1">{{ $t('Game.VNNorth.OpenTitle.P6th') }}</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[21]" />
			</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[22]" />
			</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[23]" />
			</div>
		</div>
		<q-separator color="secondary" />
		<div class="row">
			<div class="col-1">{{ $t('Game.VNNorth.OpenTitle.P7th') }}</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[24]" />
			</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[25]" />
			</div>
			<div class="col-3">
				<q-input class="numboxL" outlined dense v-model="nums[26]" />
			</div>
			<div class="col">
				<q-input class="numboxL" outlined dense v-model="nums[27]" />
			</div>
		</div>
		<q-separator color="secondary" />
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class VNNorth extends Vue {
	@Prop({ type: Array }) readonly value!:string[];
	nums:string[] = [];
	isInitValue = false;
	@Watch('value', { deep: true, immediate: true })
	onScoreChange() {
		if (this.value) {
			this.isInitValue = true;
			this.nums = this.value;
		}
	}
	@Watch('nums', { deep: true, immediate: true })
	onNumsChange() {
		if (!this.isInitValue) this.$emit('input', this.nums);
		this.isInitValue = false;
	}
}
</script>
<style lang="scss" scoped>
.numboxL {
    width: 80px !important;
    margin-right: 5px;
}
</style>
