<template>
	<div class="row banblock">
		<div class="col-2 banmain">{{ item.Title }}</div>
		<div class="col-2 banmain">{{ item.Price }}</div>
		<div class="col">
			<div class="row">
				<div class="col">多</div>
				<div class="col-3">{{ item.Long.Qty }}</div>
				<div class="col-3">{{ item.Long.Price.toFixed(2) }}</div>
				<div 
					:class="{'col-3':true, clrRed: item.Long.GainLose<0, clrGreen: item.Long.GainLose > 0}">
					{{ item.Long.GainLose.toFixed(2) }}
				</div>
				<div class="col">
					<q-checkbox left-label v-model="longStop" label="停收" />
				</div>
			</div>
			<div class="row">
				<div class="col">空</div>
				<div class="col-3">{{ item.Short.Qty }}</div>
				<div class="col-3">{{ item.Short.Price.toFixed(2) }}</div>
				<div :class="{'col-3':true, clrRed: item.Short.GainLose<0, clrGreen: item.Short.GainLose > 0}">
					{{ item.Short.GainLose.toFixed(2) }}
				</div>
				<div class="col">
					<q-checkbox left-label v-model="shortStop" label="停收" />
				</div>
			</div>
		</div>
		<div class="col-2 banmain">單手：{{ item.OneHand }}</div>	
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Crypto from '../class/Items';
import { StopType } from '../if/ENum';

@Component
export default class CryptoItemControl extends Vue {
	@Prop({ type: Object }) readonly item!:Crypto;
	get Closed() {
		return this.item.Closed;
	}
	stop = StopType;
	longStop = this.item.getClosed(StopType.LONG_STOP);
	shortStop = this.item.getClosed(StopType.SHORT_STOP);
	@Watch('Closed')
	onClosedChange() {
		this.setStopValue();
		console.log('onClosedChange');
	}
	@Watch('longStop')
	onLongStopChange() {
		this.setClosed(this.longStop, StopType.LONG_STOP);
	}
	@Watch('shortStop')
	onShortStopChange() {
		this.setClosed(this.shortStop, StopType.SHORT_STOP);
	}
	setStopValue() {
		this.longStop = this.item.getClosed(StopType.LONG_STOP);
		this.shortStop = this.item.getClosed(StopType.SHORT_STOP);
	}
	setClosed(v:boolean, st:StopType) {
		let key = -1
		if(v) key = 1;
		console.log('setClosed:', v, key);
		this.$emit('setClosed', this.item.id, this.item.Closed + key*st);
	}
	mounted() {
		// this.setStopValue();
	}
}
</script>
<style lang="scss" scoped>
.banblock {
	border: 1px seagreen solid;
	background-color: $light-green-1;
}
.banmain {
	margin-top: 10px;
}
</style>
