<template>
	<div>
		<PfKeyList :list="list"></PfKeyList>
		<add-pf-key @save="save" />
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { ErrCode } from 'src/components/if/ENum';
import LayoutStoreModule from '../layouts/data/LayoutStoreModule';
import { PfKey } from '../components/if/dbif';
import PfKeyList from '../components/PfKey/List.vue';
import AddPfKey from '../components/PfKey/Add.vue';

@Component({
	components: {
		PfKeyList,
		AddPfKey,
	},
})
export default class PfKeyManager extends Vue {
	store = getModule(LayoutStoreModule);
	list:PfKey[] = [];
	async getList() {
		const msg = await this.store.ax.getPfList();
		console.log('getList:', msg);
		if (msg.ErrNo === ErrCode.PASS) {
			this.list = msg.data as PfKey[];
		}
	}
	save(v:string) {
		console.log('pf save', v);
		const data:PfKey = {
			id: 0,
			PfName: v,
			ModifyID: this.store.personal.id,
		};
		this.store.ax.savePf(data).then(async (msg) => {
			if (msg.ErrNo === ErrCode.PASS) {
				await this.getList();
			}
		}).catch((err) => {
			console.log('save err', err);
		});
	}
	mounted() {
		this.getList();
	}
}
</script>
