<template>
	<div>
		<div class="row">
			<div>{{ $t('Label.CryptoOpManager') }}</div>
			<btn-bar @setValue="setValue" />
		</div>
		<q-separator />
		<op-param-list :items="list" />
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import OpParamList from '../components/List/CryptoOpParamList.vue';
import BtnBar from '../components/BtnBar.vue';
import { CryptoItem } from '../components/if/dbif';
import { WebParams } from '../layouts/data/if';
import { getModule } from 'vuex-module-decorators';
import LStore from '../layouts/data/LayoutStoreModule';
import OpParams from '../components/class/CryptoOpParams';

@Component({
	components: {
		OpParamList,
		BtnBar
	}
})
export default class CryptoOpManager extends Vue {
	store = getModule(LStore);
	list:OpParams[] = [];
	// curItem:CryptoItem | undefined;
	setValue(itm:CryptoItem) {
		// this.curItem = itm;
		const param:WebParams = { ...this.store.Param };
		param.TableName = 'CryptoOpParams';
		param.Filter = { ItemID: itm.id };
	}
}
</script>