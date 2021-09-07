<template>
	<div class="row banblock">
		<div class="col-2 banmain">
			{{ item.Title }}
			<q-btn color="primary" v-if="false" icon="description" :label="$t('Button.MemberSettleMark')" @click="getMemberSettleMark" />
		</div>
		<div class="col-2 banmain">{{ item.Price }}</div>
		<div class="col">
			<div class="row sublineTop">
				<div class="col suba txtCenter">{{ $t('Select.Crypto.ItemType.1') }}</div>
				<div class="col-2 suba txtRight" @click="showlist(item.Title, item.Long.List)">{{ item.Long.Total.toFixed(item.DecimalPlaces) }}/{{ item.Long.Count }}</div>
				<div class="col-2 suba txtRight">{{ item.Long.Qty.toFixed(item.QtyDecimalPlaces) }}</div>
				<div class="col-2 suba txtRight">{{ item.Long.Price.toFixed(item.DecimalPlaces) }}</div>
				<div
					:class="{'col-2 suba txtRight':true, clrRed: item.Long.GainLose<0, clrGreen: item.Long.GainLose > 0}">
					{{ item.Long.GainLose.toFixed(2) }}
				</div>
				<div class="col-2 suba txtRight" @click="showlist(item.Title, item.Long.InProcess, true)">{{ `${item.Long.PriceLimit}/${item.Long.PriceLimitAmt ? item.Long.PriceLimitAmt.toFixed(item.DecimalPlaces) : 0}` }}</div>
				<div v-if="ShowFunc" class="col subb">
					<q-checkbox left-label v-model="longStop" label="停收" />
				</div>
			</div>
			<div class="row sublineBottom">
				<div class="col suba txtCenter" @click="showlist(item.Title, item.Short.List)">{{ $t('Select.Crypto.ItemType.0') }}</div>
				<div class="col-2 suba txtRight">{{ item.Short.Total.toFixed(2) }}/{{ item.Short.Count }}</div>
				<div class="col-2 suba txtRight">{{ item.Short.Qty.toFixed(8) }}</div>
				<div class="col-2 suba txtRight">{{ item.Short.Price.toFixed(2) }}</div>
				<div :class="{'col-2 suba txtRight':true, clrRed: item.Short.GainLose<0, clrGreen: item.Short.GainLose > 0}">
					{{ item.Short.GainLose.toFixed(2) }}
				</div>
				<div class="col-2 suba txtRight" @click="showlist(item.Title, item.Short.InProcess, true)">{{ `${item.Short.PriceLimit}/${item.Short.PriceLimitAmt ? item.Short.PriceLimitQty.toFixed(item.DecimalPlaces) : 0}` }}</div>
				<div v-if="ShowFunc" class="col subb">
					<q-checkbox left-label v-model="shortStop" label="停收" />
				</div>
			</div>
		</div>
		<dialog-ask-list
			v-model="showDialogAskList"
			:list="dialogList"
			:title="dialogTitle"
			:hasAmount="hasAmount"
			:isEmergencyClosed="!!item.EmergencyClosed"
			@doSettle="doSettle"
		></dialog-ask-list>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { LoginInfo } from 'src/layouts/data/if';
import Crypto from '../class/Item/Items';
import { PartialCryptoItems, AskWithMemberName, AskIdPrice } from '../if/dbif';
import { StopType } from '../if/ENum';
import DialogAskList from '../Dialog/AskList.vue';

@Component({
	components: {
		DialogAskList,
	},
})
export default class CryptoItemControl extends Vue {
	@Prop({ type: Object }) readonly item!:Crypto;
	@Prop({ type: Object }) readonly info!:LoginInfo;
	// @Prop({ type: Boolean }) readonly inProcess!:boolean;
	@Watch('item')
	onItemChange() {
		console.log('CryptoItemControl onItemChange', this.item);
		if (this.showDialogAskList) {
			if (!this.hasAmount && this.item) {
				this.showDialogAskList = false;
				this.showlist(`${this.item.Title}`, this.item.Asks);
			}
		}
	}
	isFromItemChangeLong = false;
	isFromItemChangeShort = false;
	longStop = this.item.getClosed(StopType.LONG_STOP);
	shortStop = this.item.getClosed(StopType.SHORT_STOP);
	get ShowFunc() {
		return this.info.Types > 2;
	}
	get Closed() {
		return this.item.Closed;
	}
	stop = StopType;
	showDialogAskList = false;
	dialogList:AskWithMemberName[]=[];
	dialogTitle = '';
	hasAmount = false;
	@Watch('Closed')
	onClosedChange() {
		this.setStopValue();
		// console.log('onClosedChange');
	}
	@Watch('longStop')
	onLongStopChange() {
		if (!this.isFromItemChangeLong)	this.setClosed(this.longStop, StopType.LONG_STOP);
		this.isFromItemChangeLong = false;
	}
	@Watch('shortStop')
	onShortStopChange() {
		if (!this.isFromItemChangeShort) this.setClosed(this.shortStop, StopType.SHORT_STOP);
		this.isFromItemChangeShort = false;
	}
	setStopValue() {
		const fromItemLong = this.item.getClosed(StopType.LONG_STOP);
		if (fromItemLong !== this.longStop) {
			this.longStop = fromItemLong;
			this.isFromItemChangeLong = true;
		}
		const fromItemShort = this.item.getClosed(StopType.SHORT_STOP);
		if (fromItemShort !== this.shortStop) {
			this.shortStop = fromItemShort;
			this.isFromItemChangeShort = true;
		}
	}
	setClosed(v:boolean, st:StopType) {
		let key = -1;
		if (v) key = 1;
		// console.log('setClosed:', v, key);
		const data:PartialCryptoItems = {
			id: this.item.id,
			Closed: this.item.Closed + key * st,
		};
		this.updateItems(data);
	}
	updateItems(data:PartialCryptoItems) {
		this.$emit('updateItems', data);
	}
	showlist(title:string, list:AskWithMemberName[], hasAmount = false) {
		if (list.length === 0) return;
		this.dialogTitle = title;
		this.dialogList = list;
		this.hasAmount = hasAmount;
		// console.log('showlist', this.dialogList);
		this.showDialogAskList = true;
		// console.log(title, JSON.stringify(list));
	}
	doSettle(ask:AskIdPrice) {
		console.log('CryptoItemControl doSettle', ask);
		const f = this.item.Asks.find((itm) => itm.id === ask.id);
		if (f) {
			const newAsk = { ...f };
			if (newAsk.Nickname) delete newAsk.Nickname;
			if (newAsk.MarkTS) delete newAsk.MarkTS;
			if (newAsk.SettlePrice) delete newAsk.SettlePrice;
			newAsk.Price = ask.Price;
			newAsk.ProcStatus = 2;
			newAsk.DealTime = new Date().getTime();
			this.$emit('doSettle', newAsk);
		}
	}
	getMemberSettleMark() {
		this.$emit('getMemberSettleMark', this.item.id);
		this.dialogList = this.item.Asks;
		this.showDialogAskList = true;
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
