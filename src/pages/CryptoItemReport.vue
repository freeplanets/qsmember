<template>
	<div>
		<div class="row filter">
			<div class="datelabel">{{ $t('Label.Date') }} : </div>
      <div class="col-2"><q-input class="" outlined dense v-model="SelectDate" /></div>
      <div class="pbtn2"><q-btn color="primary" dense icon="date_range" @click="isDateSlt=true"/></div>
			<div class="row">
				<div class="ledger">{{ $t('Report.GeneralLedger')}}</div>
				<q-toggle
					:label="`${$t('Report.Ledger')}`"
					v-model="isLedgerT"
				/>
			</div>
      <div class='row col pbtn2'>
        <q-btn dense color="green" icon-right="search" :label="$t('Button.Search')"  @click="SearchData"/>
        <q-btn dense color="blue" icon-right="clear" :label="$t('Button.Clear')"  @click="ClearSearch"/>
      </div>
		</div>
		<q-separator />
		<ITRPT :list="list" :isLedger="isLedger" />
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
import ItemReport from '../components/ItemReport.vue';
import SEDate from '../layouts/components/SEDate.vue';
import ItemTot from '../components/class/ItemTot';
import LStore from '../layouts/data/LayoutStoreModule';
import FuncDate from '../components/Functions/MyDate';
import { ItemTotal } from '../components/if/dbif';

@Component({
	components: {
		SED: SEDate,
		ITRPT: ItemReport,
	},
})
export default class CryptoItemReport extends Vue {
	store = getModule(LStore);
	isLedger = false;
	isLedgerT = false;
	SelectDate = '';
	isDateSlt = false;
	list:ItemTotal[]=[];
	itemTot = new ItemTot(this.store);
	SearchData() {
		if (this.SelectDate) {
			this.list = [];
			this.store.setShowProgress(true);
			this.isLedger = this.isLedgerT;
			const filter = FuncDate.createDateFilter(this.SelectDate, 'SellTime');
			// console.log('SeachData filter', filter);
			this.itemTot.getItemReport(filter, this.isLedger).then((res) => {
				this.list = res;
				console.log('SearchData list', this.list);
				this.store.setShowProgress(false);
			});
		}
	}
	ClearSearch() {
		this.SelectDate = '';
	}
}
</script>
<style lang="scss" scoped>
.pbtn2 {
    padding: 4px 4px;
}
.ledger {
	margin-top: 10px;
}
.diaDate {
  padding-top: 20px;
  width: 705px;
  max-width: 1000px;
}
.datelabel {
	margin: 10px 4px 0 4px;
}
.filter {
	margin: 4px 0 4px 0;
}
</style>
