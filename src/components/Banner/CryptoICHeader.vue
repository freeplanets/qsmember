<template>
	<div class="row">
		<div class="row headblock col-10">
			<div class="col-2 banhead">{{ $t('Table.AskTable.Item') }}</div>
			<div class="col-2 banhead">{{ $t('Table.AskTable.Price') }}</div>
			<div class="col">
				<div class="row">
					<div class="col banhead">{{ $t('Table.Items.Type') }}</div>
					<div class="col-2 banhead">{{ $t('Table.Lever.Amount') }}</div>
					<div class="col-2 banhead">{{ $t('Table.Lever.Qty') }}</div>
					<div class="col-2 banhead">{{ $t('Table.AskTable.AvgPrice')}}</div>
					<div class="col-2 banhead">{{ $t('Label.CurGainLose') }}</div>
					<div class="col-1 banhead">{{ $t('Label.PriceLimitQty') }}</div>
					<div v-if="ShowFunc" class="col banhead">{{ $t('Label.OpenClose') }}</div>
				</div>
			</div>
			<div v-if="ShowFunc" class="col-2 banhead">{{ $t('Table.Items.OneHand') }}</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { LoginInfo } from 'src/layouts/data/if';

@Component
export default class CryptoICHeader extends Vue {
	@Prop({ type: Object }) readonly info!:LoginInfo;
	get ShowFunc():boolean {
		return this.info.Types > 2;
	}
}
</script>
<style lang="scss" scoped>
.headblock {
	border: 1px seagreen solid;
	background-color: $light-green-10;
	margin-left: 4px;
	margin-right: 4px;
}
.banhead {
	border-left: 1px seagreen solid;
	text-align: center;
	color: white;
}
</style>
