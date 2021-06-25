<template>
	<div class="row banblock">
		<div class="col-2 banmain">{{ item.Title }}</div>
		<div class="col-2 banmain">{{ item.Price }}</div>
		<div class="col">
			<div class="row sublineTop">
				<div class="col suba">多</div>
				<div class="col-3 suba">{{ item.Long.Qty.toFixed(8) }}</div>
				<div class="col-3 suba">{{ item.Long.Price.toFixed(2) }}</div>
				<div 
					:class="{'col-3 suba':true, clrRed: item.Long.GainLose<0, clrGreen: item.Long.GainLose > 0}">
					{{ item.Long.GainLose.toFixed(2) }}
				</div>
				<div class="col subb">
					<q-checkbox left-label v-model="longStop" label="停收" />
				</div>
			</div>
			<div class="row sublineBottom">
				<div class="col suba">空</div>
				<div class="col-3 suba">{{ item.Short.Qty.toFixed(8) }}</div>
				<div class="col-3 suba">{{ item.Short.Price.toFixed(2) }}</div>
				<div :class="{'col-3 suba':true, clrRed: item.Short.GainLose<0, clrGreen: item.Short.GainLose > 0}">
					{{ item.Short.GainLose.toFixed(2) }}
				</div>
				<div class="col subb">
					<q-checkbox left-label v-model="shortStop" label="停收" />
				</div>
			</div>
		</div>
		<div class="col-2 banmainL">
			<div class="row">
				<q-input class="col-8" color="grey-3" label-color="orange" dense outlined v-model="OneHand" :label="$t('Table.OneHand')" />
				<q-btn class="col-3" color="primary" dense :label="$t('Button.Edit')" @click="EditOneHand" />
			</div>
		</div>	
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Crypto from '../class/Items';
import { PartialCryptoItems } from '../if/dbif';
import { StopType } from '../if/ENum';

@Component
export default class CryptoItemControl extends Vue {
	@Prop({ type: Object }) readonly item!:Crypto;
	get Closed() {
		return this.item.Closed;
	}
	stop = StopType;
	OneHand = this.item.OneHand;
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
		const data:PartialCryptoItems = {
			id: this.item.id,
			Closed: this.item.Closed + key*st, 
		}
		this.updateItems(data);
	}
	updateItems(data:PartialCryptoItems) {
		this.$emit('updateItems', data);
	}
	EditOneHand() {
		if (this.OneHand === this.item.OneHand) return;
		const data:PartialCryptoItems = {
			id: this.item.id,
			OneHand: this.OneHand, 
		}
		this.updateItems(data);
	}
	mounted() {
		// this.setStopValue();
	}
}
</script>
<style lang="scss" scoped>
.banblock {
	border-left: 1px seagreen solid;
	border-right: 1px seagreen solid;
	border-bottom: 1px seagreen solid;
	background-color: $light-green-1;
	margin-left: 4px;
	margin-right: 4px;
}
.sublineTop div, .sublineBottom div {
	text-align: right;
}
.sublineTop {
	border-bottom: 1px seagreen solid;
}
.suba, .subb, .banmain, .banmainL {
	border-left: 1px seagreen solid;
}
.suba {
	padding-top: 10px;
	padding-right: 4px;
}
.banmain {
	padding-top: 30px;
	text-align: center;
}
.banmainL {
	padding-top:20px;
}
.banmainL div {
	margin-left: 8px;
}
</style>
