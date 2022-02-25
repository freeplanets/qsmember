<template>
	<div class="q-pa-md">
		<div class="row">
				<div class="col-1"></div>
				<div class="col-5"><q-chip dense size="xl" icon="bookmark">{{$t('Game.SGPools.OpenTitle.First')}}</q-chip></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[0]" /></div>
				<div class="col-3"></div>
		</div>
		<div class="row">
				<div class="col-1"></div>
				<div class="col-5"><q-chip dense size="xl" icon="bookmark">{{$t('Game.SGPools.OpenTitle.Secondary')}}</q-chip></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[1]" /></div>
				<div class="col-3"></div>
		</div>
		<div class="row">
				<div class="col-1"></div>
				<div class="col-5"><q-chip dense size="xl" icon="bookmark">{{$t('Game.SGPools.OpenTitle.Third')}}</q-chip></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[2]" /></div>
				<div class="col-3"></div>
		</div>
		<div class="row">
				<div class="col-6"><q-chip dense size="xl" icon="bookmark">{{$t('Game.SGPools.OpenTitle.Shortlisted')}}</q-chip></div>
				<div class="col-6"><q-chip dense size="xl" icon="bookmark">{{$t('Game.SGPools.OpenTitle.ConsolationPrize')}}</q-chip></div>
		</div>
		<div class="row">
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[3]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[8]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[13]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[18]" /></div>
		</div>
		<div class="row">
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[4]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[9]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[14]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[19]" /></div>
		</div>
		<div class="row">
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[5]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[10]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[15]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[20]" /></div>
		</div>
		<div class="row">
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[6]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[11]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[16]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[21]" /></div>
		</div>
		<div class="row">
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[7]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[12]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[17]" /></div>
				<div class="col-3"><q-input class="numboxL" outlined dense v-model="nums[22]" /></div>
		</div>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class SGPools extends Vue {
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
		if (!this.isInitValue) this.$emit('input', this.nums.join(','));
		this.isInitValue = false;
	}
}
</script>
