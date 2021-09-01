<template>
	<div>
		<div class="q-pa-sm row">
			<div class="q-pt-sm sltbar-font">{{ $t('Label.BlackTypeSelect') }}</div>
			<q-toggle v-model="value" />
			<q-select v-if="value" class="q-ml-sm" outlined dense v-model="BlackType" :options="BlackENum" />
			<q-input class="q-ml-sm" outlined dense v-model="SelectDate" />
			<q-btn class="q-ml-sm" dense color="primary" icon="date_range" @click="isDateSlt=true" />
			<q-btn class="q-ml-sm" dense color="primary" icon-right="search" :label="$t('Button.Search')" @click="Search" />
		</div>
		<q-separator />
		<div class="q-pa-sm">
			<MGLS :list="list" @setCLevel="setCLevel" />
		</div>
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
import { ErrCode, OpTypes } from '../components/if/ENum';
import SEDate from '../layouts/components/SEDate.vue';
import DateFunc from '../components/Functions/MyDate';
import { KeyVal, Msg } from '../layouts/data/if';
import ApiFunc from '../components/class/Api/Func';
import MemberGainLoseSheet from '../components/List/MemberGainLoseSheet.vue';
import { MemberCLevel, MemberGainLoseData } from '../components/if/dbif';
import MemberGainLose from '../components/class/GainLose/Member';

@Component({
	components: {
		SED: SEDate,
		MGLS: MemberGainLoseSheet,
	},
})
export default class BlackListManager extends Vue {
	store = getModule(LStore);
	Api = new ApiFunc(this.store);
	list:MemberGainLose[] = [];
	BlackType = OpTypes.NONE;
	get BlackENum() {
		return Object.values(OpTypes);
	}
	SelectDate = '';
	isDateSlt = false;
	inProcess = false;
	value=false;
	setCLevel(v:MemberCLevel) {
		console.log('BlackListManager setCLevel', v);
		if (this.inProcess) return;
		this.inProcess = true;
		this.Api.setMemberCLevel(v).then((msg:Msg) => {
			if (msg.ErrNo === ErrCode.PASS) {
				const f = this.list.find((itm) => itm.id === v.id);
				if (f) {
					f.CLevel = v.CLevel;
					console.log('BlackListManager setCLevel done');
				}
			}
			this.inProcess = false;
		});
	}
	Search() {
		if (!this.SelectDate) return;
		// const param:WebParams = { ...this.store.Param };
		const Filter:KeyVal[] = [];
		Filter.push(DateFunc.createDbDateFilter(this.SelectDate));
		if (this.value) {
			Filter.push({ CLevel: this.BlackType });
		}
		this.Api.getMemberReport(Filter).then((msg: Msg) => {
			if (msg.ErrNo === ErrCode.PASS) {
				console.log('BlackListManager msg', msg.data);
				const datas = msg.data as MemberGainLoseData[];
				this.list = datas.map((itm) => new MemberGainLose(itm));
			}
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
