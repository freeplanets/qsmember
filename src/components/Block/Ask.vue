<template>
	<div v-if="ask" class="row block_ask">
		<div class="col-1 txtRight">{{ ask.id }}</div>
		<div class="col-3 txtCenter">{{ CreateTime }}</div>
		<div class="col-1 txtCenter">{{ ask.Nickname ? ask.Nickname : ask.UserID }}</div>
		<div :class="{ 'col-1 txtCenter':true, clrGreen:isGreen, clrRed:isRed }">{{ ItemType }}</div>
		<div class="col-2 txtRight">{{ ask.Lever }}</div>
		<div class="col-2 txtRight">{{ ask.Amount ? ask.Amount : ask.Qty }}</div>
		<div class="col-2 txtRight">{{ ask.AskPrice }}</div>
		<template v-if='isEmergencyClosed'>
			<div class="col txtRight">{{ ask.MarkTS }}</div>
			<div class="col txtCenter">
				<q-input v-if="ask.MarkTS" outlined dense v-model="ask.SettlePrice" :label="$t('Label.SettlePricePlease')" />
			</div>
			<div class="col txtCenter">
				<q-btn v-if="ask.SettlePrice" round color="primary" icon="send" @click="doSettle" />
			</div>
		</template>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import DateFunc from '../Functions/MyDate';
import NumsFunc from '../Functions/Nums';
import { AskIdPrice, AskWithMemberName } from '../if/dbif';

@Component
export default class Ask extends Vue {
	@Prop({ type: Object }) readonly ask!:AskWithMemberName;
	@Prop({ type: Boolean }) readonly isEmergencyClosed!:boolean;
	get CreateTime() {
		return DateFunc.toLocalString(this.ask.CreateTime);
	}
	get ItemType() {
		const itemType = this.ask.ItemType < 0 ? 0 : 1;
		return String(this.$t(`Select.Crypto.ItemType.${itemType}`));
	}
	get isGreen():boolean {
		return NumsFunc.isGreen(this.ask.ItemType);
	}
	get isRed():boolean {
		return NumsFunc.isRed(this.ask.ItemType);
	}
	doSettle() {
		if (this.ask.SettlePrice) {
			const price = parseFloat(this.ask.SettlePrice);
			/*
			const chkGain = (price - this.ask.StopGain) * this.ask.ItemType;
			const chkLose = (price - this.ask.StopLose) * this.ask.ItemType;
			if (chkGain > 0 || chkLose < 0) {
				const opt:QDialogOptions = {
					title: `${this.$t('Dialog.DoSettle.Title')}`,
					message: `${this.$t('Dialog.DoSettle.Message')}?`,
				};
				this.$q.dialog(opt);
				return;
			}
			*/
			const pAsk:AskIdPrice = {
				id: this.ask.id,
				Price: price,
			};
			this.$emit('doSettle', pAsk);
		}
	}
}
</script>
<style lang="scss" scoped>
.block_ask {
	border-right: 1px $green-10 solid;
	border-bottom: 1px $green-10 solid;
}
.block_ask div {
	border-left: 1px $green-10 solid;
}
.txtRight {
	padding-right: 8px;
}
</style>
