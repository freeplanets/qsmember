<template>
	<div>
		<div class="row">
			<div class="q-pa-xs">{{ $t('Label.CryptoOpManager') }}:</div>
			<div><btn-bar @setValue="setValue" /></div>
		</div>
		<q-separator />
		<op-param-list :ItemID="curItemID" :items="list" />
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { WebParams, Msg } from '../layouts/data/if';
import { CryptoItem, CryptoOpParams } from '../components/if/dbif';
import OpParamList from '../components/List/CryptoOpParamList.vue';
import BtnBar from '../components/BtnBar.vue';
import { ErrCode } from '../components/if/ENum';
import LStore from '../layouts/data/LayoutStoreModule';
import OpParams from '../components/class/Params/CryptoOpParams';

@Component({
	components: {
		OpParamList,
		BtnBar,
	},
})
export default class CryptoOpManager extends Vue {
	store = getModule(LStore);
	curItemID = 0;
	list:OpParams[] = [];
	// curItem:CryptoItem | undefined;
	setValue(itm:CryptoItem) {
		// this.curItem = itm;
		this.curItemID = itm.id;
		const param:WebParams = { ...this.store.Param };
		param.TableName = 'CryptoOpParams';
		param.Filter = { ItemID: itm.id };
		this.store.ax.getApi('cc/GetData', param).then((res:Msg) => {
			if (res.ErrNo === ErrCode.PASS) {
				this.list = [];
				const ans:CryptoOpParams[] = res.data as CryptoOpParams[];
				this.list = ans.map((r) => new OpParams(this.curItemID, r));
			}
		});
	}
}
</script>
<style lang="scss" scoped>
.title {
	margin: 4xp 0 4px 4px !important;
}
</style>
