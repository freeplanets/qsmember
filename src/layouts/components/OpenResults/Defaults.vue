<template>
	<div class="row">
	<q-input :class="{ numboxWidth: nums.length>1, 'full-width':nums.length<2 , numbox:true}"
			v-for="(num,idx) in nums"
			:key="idx"
			outlined dense v-model="nums[idx]" />
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Defaults extends Vue {
	@Prop({ type: Array }) readonly value!:string[];
	nums:string[] = [];
	isInitValue = false;
	@Watch('value', { deep: true, immediate: true })
	onValueChange() {
		console.log('onValueChange start');
		if (this.value) {
			console.log('onValueChange', this.value);
			this.isInitValue = true;
			this.nums = this.value;
		}
	}
	@Watch('nums', { deep: true, immediate: true })
	onNumsChange() {
		if (!this.isInitValue) this.$emit('input', this.nums);
		this.isInitValue = true;
	}
}
</script>
<style lang="scss" scoped>
.numboxWidth {
	width: 40px !important;
}
.numbox {
	margin-right: 5px;
}
</style>
