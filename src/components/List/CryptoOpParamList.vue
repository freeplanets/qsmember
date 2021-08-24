<template>
	<div class="col q-mt-xs">
		<div class="row q-ma-xs"><q-btn color="red-10" size="sm" :label="$t('Button.Add')" @click="AddNew" /></div>
		<table class="list" cellspacing="0" cellpadding="0" v-if="items">
			<tr>
				<th rowspan="2"><div>{{ $t('Table.CryptoOpParams.OpType') }}</div></th>
				<th rowspan="2"><div>{{ $t('Table.CryptoOpParams.isActive') }}</div></th>
				<th colspan="6"><div>{{ $t('Table.CryptoOpParams.OpType') }}</div></th>
				<th rowspan="2"><div>{{ $t('Label.Save') }}</div></th>
			</tr>
			<tr>
				<th><div>{{ $t('Table.CryptoOpParams.RuleName.OneHand') }}(USDT)</div></th>
				<th><div>{{ $t('Table.CryptoOpParams.RuleName.FullStorage') }}(USDT)</div></th>
				<th><div>{{ $t('Table.CryptoOpParams.RuleName.LeverLimit') }}</div></th>
				<th><div>{{ $t('Table.CryptoOpParams.RuleName.ShortTerm1') }}({{$t('Label.Sec')}})</div></th>
				<th><div>{{ $t('Table.CryptoOpParams.RuleName.ShortTerm2') }}({{$t('Label.Sec')}})</div></th>
				<th><div>{{ $t('Table.CryptoOpParams.RuleName.ShortTermFee') }}(&#8240;)</div></th>
			</tr>
			<tr
				v-for="(itm,idx) in items"
				:key="idx"
			>
				<td><div><q-select outlined dense v-model="itm.OpType" :options="options" /></div></td>
				<td><div>N<q-toggle v-model="itm.isActive" />Y</div></td>
				<td><div><q-input outlined dense v-model="itm.OneHand" /></div></td>
				<td><div><q-input outlined dense v-model="itm.FullStorage" /></div></td>
				<td><div><q-input outlined dense v-model="itm.LeverLimit" /></div></td>
				<td><div><q-input outlined dense v-model="itm.ShortTerm1" /></div></td>
				<td><div><q-input outlined dense v-model="itm.ShortTerm2" /></div></td>
				<td><div><q-input outlined dense v-model="itm.ShortTermFee" /></div></td>
				<td><div><q-btn v-if="itm.isChanged" color="primary" :label="$t('Label.Save')" @click="Save(itm,idx)" /></div></td>
			</tr>
		</table>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { QDialogOptions } from 'quasar';
import LStore from '../../layouts/data/LayoutStoreModule';
import { HasID, Msg } from '../../layouts/data/if';
import ErrCode from '../../layouts/data/ErrCode';
import { Channels, FuncKey, OpTypes } from '../if/ENum';
// import { CryptoOpParams } from '../if/dbif';
import OpParams from '../class/Params/CryptoOpParams';
import ApiFunc from '../class/Api/ApiFunc';
import { WsMsg } from '../if/dbif';

@Component
export default class CryptoOpParamList extends Vue {
	@Prop({ type: Number }) readonly ItemID!:number;
	@Prop({ type: Array }) readonly items!:OpParams[];
	/*
	@Watch('items', { deep:true, immediate:true })
	onItemsChange() {
		console.log('test items change');
	}
	*/
	store = getModule(LStore);
	ax = new ApiFunc(this.store);
	options = this.getENum();
	getENum() {
		// const a = { ...OpTypes };
		// const n = Object.keys(a).map((key) => a[key]);
		return Object.values(OpTypes);
	}
	Save(itm:OpParams, idx:number) {
		itm.ModifyID = this.store.personal.id;
		this.ax.setTableData('CryptoOpParams', itm.Data).then((res:Msg) => {
			const opt:QDialogOptions = {
				title: `${this.$t('Label.Save')}`,
				message: 'OK!',
			};
			console.log('Save:', res);
			if (res.ErrNo !== ErrCode.PASS) {
				opt.message = String(this.$t(`Error.${res.ErrNo}`));
			} else {
				if (res.insertId && itm.id === 0) {
					this.items[idx].setID(res.insertId);
				}
				if (itm.isLeverChanged) {
					this.NotifyLeverChange(itm.OpType, parseInt(itm.LeverLimit, 10), itm.ItemID);
				}
				this.items[idx].isChanged = false;
			}
			this.$q.dialog(opt);
		});
		/*
		const param:WebParams = { ...this.store.Param };
		param.TableName = 'CryptoOpParams';
		param.TableData = itm.Data;
		this.store.ax.getApi('cc/SaveData', param).then((res:Msg) => {
			const opt:QDialogOptions = {
				title: `${this.$t('Label.Save')}`,
				message: 'OK!',
			};
			console.log('Save:', res);
			if (res.ErrNo !== ErrCode.PASS) {
				opt.message = String(this.$t(`Error.${res.ErrNo}`));
			} else {
				if (res.insertId && itm.id === 0) {
					this.items[idx].setID(res.insertId);
				}
				this.items[idx].isChanged = false;
			}
			this.$q.dialog(opt);
		});
		*/
	}
	NotifyLeverChange(CLevel:string, value:number, itemid:number) {
		this.ax.getTableData('Member', { CLevel }, 'id').then((res) => {
			if (res.ErrNo === ErrCode.PASS) {
				const users = res.data as HasID[];
				const ids = users.map((user) => user.id);
				if (ids.length) {
					const msg:WsMsg = {};
					msg.Func = FuncKey.MESSAGE;
					msg.UserID = this.store.personal.id;
					msg.SendTo = ids;
					msg.ChannelName = Channels.ASK;
					msg.Message = JSON.stringify({ Lever: value, id: itemid });
					this.store.WSock.send(msg);
				}
			}
			console.log('NotifyLeverChange', res, value);
		});
	}
	AddNew() {
		this.items.push(new OpParams(this.ItemID));
	}
}
</script>
<style lang="scss" scoped>
.list {
	border-top: 1px solid $indigo-10;
	border-right: 1px solid $indigo-10;
}
.list th {
	border-left: 1px solid $indigo-3;
	border-bottom: 1px solid $indigo-3;
}
.list td {
	border-left: 1px solid $indigo-10;
	border-bottom: 1px solid $indigo-10;
}
.list div {
	margin: 2px 2px 2px 2px;
}
.list th {
	background-color: $cyan-10;
	color: white;
}
</style>
