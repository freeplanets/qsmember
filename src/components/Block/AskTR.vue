<template>
	<tr v-if="ask" class="block_ask">
		<td class="txtRight">{{ ask.id }}</td>
		<td class="txtCenter">{{ CreateTime }}</td>
		<td class="txtCenter">{{ ask.Nickname ? ask.Nickname : ask.UserID }}</td>
		<td :class="{ 'txtCenter':true, clrGreen:isGreen, clrRed:isRed }">{{ ItemType }}</td>
		<td class="txtRight">{{ ask.Lever }}</td>
		<td class="txtRight">{{ ask.Amount ? ask.Amount : ask.Qty }}</td>
		<td class="txtRight">{{ ask.AskPrice }}</td>
		<template v-if='isEmergencyClosed'>
			<td class="txtRight">{{ ask.MarkTS }}</td>
			<td class="txtCenter">
				<q-input v-if="ask.MarkTS" outlined v-model="ask.SettlePrice" :label="$t('Label.SettlePricePlease')" />
			</td>
			<td class="txtCenter">
				<q-btn v-if="ask.SettlePrice" round color="primary" icon="send" @click="doSettle" />
			</td>
		</template>
	</tr>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import DateFunc from '../Functions/MyDate';
import NumsFunc from '../Functions/Nums';
import { AskIdPrice, AskWithMemberName } from '../if/dbif';

@Component
export default class AskTR extends Vue {
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
			console.log('AskTR doSettle:', pAsk);
			this.$emit('doSettle', pAsk);
		}
	}
}
</script>
<style lang="scss" scoped>
.block_ask td {
	border-left: 1px $green-10 solid;
	border-bottom: 1px $green-10 solid;
}
.txtRight {
	padding-right: 8px;
}
</style>
