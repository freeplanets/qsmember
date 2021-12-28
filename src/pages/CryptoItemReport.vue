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
		<ITRPT v-if="total" :list="list" :isLedger="isLedger" :total="total" :isDialog="false" @showItem="showItem" />
    <q-dialog v-model="isDateSlt">
      <q-card class='diaDate'>
        <q-card-section class="q-pt-none">
          <SED v-model="SelectDate" @closeme="isDateSlt=false"></SED>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showSub">
      <q-card style="width: 1200px; max-width: 100vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ rptSubTitle }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <ITRPT v-if="rptSub" :list="rptSub.List" :isLedger="rptSub.isLedger" :total="rptSub.Total" :isDialog="true" @showItem="showItem" />
        </q-card-section>
      </q-card>
    </q-dialog>
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import ItemReportVue from '../components/ItemReport.vue';
import SEDate from '../layouts/components/SEDate.vue';
import ItemTot from '../components/class/Item/ItemTot';
import LStore from '../layouts/data/LayoutStoreModule';
import { ItemTotal, ReportTotal } from '../components/if/dbif';
import ItemReport from '../components/class/Item/ItemReport';

@Component({
	components: {
		SED: SEDate,
		ITRPT: ItemReportVue,
	},
})
export default class CryptoItemReport extends Vue {
	store = getModule(LStore);
	isLedger = false;
	isLedgerT = false;
	SelectDate = '';
	isDateSlt = false;
	list:ItemTotal[]=[];
	itemTot:ReportTotal = new ItemTot(this.store);
	total:ItemTotal | null = null;
	rptMain:ItemReport | null = null;
	rptSub:ItemReport | null = null;
	showSub = false;
	rptSubTitle = '';
	async SearchData() {
		if (this.SelectDate) {
			this.list = [];
			this.store.setShowProgress(true);
			this.isLedger = this.isLedgerT;
			this.rptMain = new ItemReport(this.itemTot, 0, this.isLedgerT);
			await this.rptMain.getReport(this.SelectDate);
			this.list = this.rptMain.List;
			this.total = this.rptMain.Total;
			this.total.reCal();
			this.total.setTitle(String(this.$t('Report.Total')));
			this.store.setShowProgress(false);
			// console.log('SeachData filter', filter);

			/*
			this.itemTot.getItemReport(this.SelectDate, this.isLedger).then((res) => {
				this.list = res;
				console.log('SearchData list', this.list);
				this.total = this.itemTot.Total;
				this.total.reCal();
				this.total.setTitle(String(this.$t('Report.Total')));
				this.store.setShowProgress(false);
			});
			*/
		}
	}
	ClearSearch() {
		this.SelectDate = '';
	}
	showItem(isLedger:boolean, key:number, title:string) {
		// console.log('CryptoItemReprot showItem:', isLedger, key);
		// if (!isLedger) {
			this.rptSubTitle = title;
			this.rptSub = new ItemReport(this.itemTot, key, !isLedger);
			this.rptSub.getReport();
			this.rptSub.Total.reCal();
			this.rptSub.Total.setTitle(String(this.$t('Report.Total')));
			this.showSub = true;
		// }
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
