<template>
	<div class="col">
		<div class="row"><q-btn color="primary" :label="$t('Button.Add')" /></div>
		<table>
			<tr>
				<th rowspan="2">{{ $t('Table.CryptoOpParams.OpType') }}</th>
				<th rowspan="2">{{ $t('Table.CryptoOpParams.isActive') }}</th>
				<th :colspan="rules.length">{{ $t('Table.CryptoOpParams.OpType') }}</th>
				<th rowspan="2">{{ $t('Label.Save') }}</th>
			</tr>
			<tr v-if="rules.length > 0">
				<th 
					v-for="(title,idx) in rules"
					:key="idx"
				>
					{{ $t(`Table.CryptoOpParams.RuleName.${title}`) }}
				</th>
			</tr>
			<tr
				v-for="(itm,idx) in items"
				:key="idx"
			>
				<td><q-select v-model="itm.OpType" :options="options" label="Standard" /></td>
				<td>N<q-toggle v-model="itm.isActive" />Y</td>
				<td
					v-for="(rule, idx) in rules"
					:key="`rule-${idx}`"
				>
					{{ itm.Rules(rule) }}
				</td>
				<td><q-btn v-if="itm.isChaned" color="primary" :label="$t('Label.Save')" @click="Save(itm)" /></td>
			</tr>
		</table>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import LStore from '../../layouts/data/LayoutStoreModule';
import { WebParams, Msg } from '../../layouts/data/if';
import ErrCode from '../../layouts/data/ErrCode';
import { OpTypes } from '../if/ENum';
// import { CryptoOpParams } from '../if/dbif';
import OpParams from '../class/CryptoOpParams';
import { QDialogOptions } from 'quasar';

@Component
export default class CryptoOpParamList extends Vue {
	@Prop({ type: Array }) readonly items!:OpParams[];
	store = getModule(LStore);
	options = OpTypes;
	get rules():string[] {
		let ans:string[] = [];
		if(this.items){
			ans = this.items[0].getRulesKey();
		}
		return ans;
	}
	Save(itm:OpParams) {
		itm.ModifyID = this.store.personal.id;
		const param:WebParams = { ...this.store.Param };
		param.TableName = 'CryptoOpParams';
		param.TableData = itm.Data;
		this.store.ax.getApi('cc/SaveData', param).then((res:Msg)=>{
			const opt:QDialogOptions = {
				title: `${this.$t('Label.Save')}`,
				message: 'OK!',
			}
			if(res.ErrNo !== ErrCode.PASS) {
				opt.message = String(this.$t(`Error.${res.ErrNo}`));
			}
			this.$q.dialog(opt);			
		})
	}
}
</script>