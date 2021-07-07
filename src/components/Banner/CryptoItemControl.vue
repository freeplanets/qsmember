<template>
	<div class="row banblock">
		<div class="col-2 banmain">{{ item.Title }}</div>
		<div class="col-2 banmain">{{ item.Price }}</div>
		<div class="col">
			<div class="row sublineTop" @click="showlist(item.Title, item.Long.List)">
				<div class="col suba txtCenter">多</div>
				<div class="col-2 suba txtRight">{{ item.Long.Total.toFixed(2) }}</div>
				<div class="col-3 suba txtRight">{{ item.Long.Qty.toFixed(8) }}</div>
				<div class="col-2 suba txtRight">{{ item.Long.Price.toFixed(2) }}</div>
				<div 
					:class="{'col-2 suba txtRight':true, clrRed: item.Long.GainLose<0, clrGreen: item.Long.GainLose > 0}">
					{{ item.Long.GainLose.toFixed(2) }}
				</div>
				<div v-if="ShowFunc" class="col subb">
					<q-checkbox left-label v-model="longStop" label="停收" />
				</div>
			</div>
			<div class="row sublineBottom" @click="showlist(item.Title, item.Short.List)">
				<div class="col suba txtCenter">空</div>
				<div class="col-2 suba txtRight">{{ item.Short.Total.toFixed(2) }}</div>				
				<div class="col-3 suba txtRight">{{ item.Short.Qty.toFixed(8) }}</div>
				<div class="col-2 suba txtRight">{{ item.Short.Price.toFixed(2) }}</div>
				<div :class="{'col-2 suba txtRight':true, clrRed: item.Short.GainLose<0, clrGreen: item.Short.GainLose > 0}">
					{{ item.Short.GainLose.toFixed(2) }}
				</div>
				<div v-if="ShowFunc" class="col subb">
					<q-checkbox left-label v-model="shortStop" label="停收" />
				</div>
			</div>
		</div>
		<div v-if="ShowFunc" class="col-2 banmainL">
			<div class="row">
				<q-input class="col-8" color="grey-3" label-color="orange" dense outlined v-model="OneHand" :label="$t('Table.OneHand')" />
				<q-btn class="col-3" color="primary" dense :label="$t('Button.Edit')" @click="EditOneHand" />
			</div>
		</div>
		<dialog-ask-list v-model="showDialogAskList" :list="dialogList" :title="dialogTitle"></dialog-ask-list>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Crypto from '../class/Items';
import { PartialCryptoItems, AskTable } from '../if/dbif';
import { StopType } from '../if/ENum';
import DialogAskList from '../Dialog/AskList.vue';
import { LoginInfo } from 'src/layouts/data/if';

@Component({
	components: {
		DialogAskList,
	},
})
export default class CryptoItemControl extends Vue {
	@Prop({ type: Object }) readonly item!:Crypto;
	@Prop({ type: Object }) readonly info!:LoginInfo;
	// @Prop({ type: Boolean }) readonly inProcess!:boolean;
	get ShowFunc() {
		return this.info.Types > 2;
	}
	get Closed() {
		return this.item.Closed;
	}
	stop = StopType;
	OneHand = this.item.OneHand;
	longStop = this.item.getClosed(StopType.LONG_STOP);
	shortStop = this.item.getClosed(StopType.SHORT_STOP);
	showDialogAskList = false;
	dialogList:AskTable[]=[];
	dialogTitle = '';
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
	showlist(title:string, list:AskTable[]) {
		if (list.length === 0) return;
		this.dialogTitle = title;
		this.dialogList = list;
		this.showDialogAskList = true;
		console.log(title, JSON.stringify(list));
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
