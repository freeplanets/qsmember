<template>
	<div>
		<div class="row">Risk Controller</div>
		<BCIH :info="LoginInfo" />
		<div
			v-for="(itm, idx) in list"
			:key="'bcic'+idx"
			class="row"
		>
			<BCIC
				class="col-10"
				:item="itm"
				:info="LoginInfo"
				@updateItems="updateItems"
			/>
		 </div>
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators'; 
import BanCryptoItemControl from '../components/Banner/CryptoItemControl.vue';
import BanCryptoICHeader from '../components/Banner/CryptoICHeader.vue';
import LayoutStoreModule from '../layouts/data/LayoutStoreModule';
import Items from '../components/class/Items';
import ApiFunc from '../components/class/ApiFunc';
import { CryptoItem, AskTable, PartialCryptoItems } from '../components/if/dbif';
import { Msg } from '../layouts/data/if';
import Mqtt from '../components/WebSock/Mqtt';

@Component({
	components: {
		BCIC: BanCryptoItemControl,
		BCIH: BanCryptoICHeader,
	},
})
export default class CryptoRiskController extends Vue {
	store = getModule(LayoutStoreModule);
	Api = new ApiFunc(this.store);
	list:Items[]=[];
	mqtt:Mqtt=this.store.Mqtt; 
	interval:NodeJS.Timeout | null = null;
	get LoginInfo() {
		return this.store.personal;
	}
	getData() {
		this.Api.getTableData('Items', {isLoan:1}).then((msg:Msg)=>{
			if(msg.ErrNo ===0 ) {
				const data:CryptoItem[] = msg.data as CryptoItem[];
				// console.log('CryptoRiskController getData', data);
				data.forEach(itm=>{
					// console.log('getdata', itm.id, itm.Closed);
					if(itm.isLoan) {
						this.list.push(new Items(itm));
					}
				});
				if (this.list.length > 0) {
					this.list.forEach(itm=>{
						this.store.WSock.Add(itm);
					})
				}
			}
		});
		this.getAsks();
		this.mqtt.setItems(this.list);
	}
	getAsks() {
		let filter = 'ProcStatus<2 and (USetID > 0 or SetID > 0)';
		if (this.LoginInfo.Types < 3) {
			filter = `${filter} and UpId = ${this.LoginInfo.id}`;
		}
		this.Api.getTableData('AskTable', filter).then((msg:Msg)=>{
			// console.log('getData AskTable', msg);
			if (msg.ErrNo == 0) {
				const asks:AskTable[] = msg.data as AskTable[];
				this.list.forEach(itm=>{
					itm.addAsks(asks);
				})
			}
		})		
	}
	updateItems(data:PartialCryptoItems) {
		console.log('CRC setClosed:', data);
		this.Api.setTableData<PartialCryptoItems>('Items', data).then((msg:Msg)=>{
			if(msg.ErrNo === 0){
				const f = this.list.find(itm=>itm.id === data.id);
				if (f) {
					// console.log('setClosed:', f.Closed);
					if (data.Closed) f.setClosed(data.Closed);
					if (data.OneHand){
						f.setOneHand(data.OneHand);
						this.$q.dialog({
							title: this.$t('Label.Save') as string,
							message: 'OK!!',
            });
					}
				}
			}
		})
	}
	mounted() {
		this.mqtt.subscribeTick();
		this.getData();
		this.getAsks();
		// this.interval = setInterval(this.getAsks,500000);
	}
}
</script>
