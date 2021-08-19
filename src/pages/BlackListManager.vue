<template>
	<div>
		<div class="q-pa-sm row">
			<div class="q-pt-sm sltbar-font">{{ $t('Label.BlackTypeSelect') }}</div>
			<q-select class="q-ml-sm" outlined dense v-model="BlackType" :options="BlackENum" />
			<q-input class="q-ml-sm" outlined dense v-model="SelectDate" />
			<q-btn class="q-ml-sm" dense color="primary" icon="date_range" @click="isDateSlt=true" />
			<q-btn class="q-ml-sm" dense color="primary" icon-right="search" :label="$t('Button.Search')" @click="Search" />
		</div>
		<q-separator />
		<div></div>
    <q-dialog v-model="isDateSlt">
      <q-card class='diaDate'>
        <q-card-section class="q-pt-none">
          <SED v-model="SelectDate" @closeme="isDateSlt=false"></SED>
        </q-card-section>
      </q-card>
    </q-dialog>
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import LStore from '../layouts/data/LayoutStoreModule';
import { OpTypes } from '../components/if/ENum';
import SEDate from '../layouts/components/SEDate.vue';
import DateFunc from '../components/Functions/MyDate';
import { WebParams } from '../layouts/data/if';

@Component({
	components: {
		SED: SEDate,
	},
})
export default class BlackListManager extends Vue {
	store = getModule(LStore);
	BlackType = OpTypes.NONE;
	get BlackENum() {
		return Object.values(OpTypes);
	}
	SelectDate = '';
	isDateSlt = false;
	Search() {
		if (!this.SelectDate) return;
		const param:WebParams = { ...this.store.Param };
		param.TableName = 'MemberReport';
		param.Filter = DateFunc.createDateFilter('SellTime', this.SelectDate);
		this.store.ax.getApi('cc/GetData', param).then((res) => {
			console.log(res);
		});
	}
}
</script>
<style lang="scss" scoped>
.diaDate {
  padding-top: 20px;
  width: 705px;
  max-width: 1000px;
}
.sltbar-font {
	font: 24px;
}
</style>
