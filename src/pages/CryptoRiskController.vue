<template>
	<div>
		<div class="row">Risk Controller</div>
		<BCIC
			v-for="(itm, idx) in list"
			:key="'bcic'+idx"
			:item="itm"
			@setClosed="setClosed"
		 />
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators'; 
import BanCryptoItemControl from '../components/Banner/CryptoItemControl.vue';
import LayoutStoreModule from '../layouts/data/LayoutStoreModule';
import Items from '../components/class/Items';
import ApiFunc from '../components/class/ApiFunc';
import { CryptoItem, AskTable } from '../components/if/dbif';
import { Msg, HasID } from '../layouts/data/if';
import Mqtt from '../components/WebSock/Mqtt';

interface SubItems extends HasID {
	Closed:number;
}

@Component({
	components: {
		BCIC: BanCryptoItemControl,
	},
})
export default class CryptoRiskController extends Vue {
	store = getModule(LayoutStoreModule);
	Api = new ApiFunc(this.store);
	list:Items[]=[];
	Mqtt = new Mqtt(this.store.personal);
	getData() {
		this.Api.getTableData('Items').then((msg:Msg)=>{
			if(msg.ErrNo ===0 ) {
				const data:CryptoItem[] = msg.data as CryptoItem[];
				data.forEach(itm=>{
					console.log('getdata', itm.id, itm.Closed);
					if(itm.isLoan) this.list.push(new Items(itm));
				});
			}
		});
		const filter = 'ProcStatus<2 and (USetID > 0 or SetID > 0)';
		this.Api.getTableData('AskTable', filter).then((msg:Msg)=>{
			console.log('getData AskTable', msg);
			if (msg.ErrNo == 0) {
				const asks:AskTable[] = msg.data as AskTable[];
				this.list.forEach(itm=>{
					itm.addAsks(asks);
				})
			}
		})
		this.Mqtt.setItems(this.list);
	}
	setClosed(itemid:number, closed:number) {
		console.log('CRC setClosed:', itemid, closed);
		const data:SubItems = {
			id:itemid,
			Closed: closed,
		}
		this.Api.setTableData<SubItems>('Items', data).then((msg:Msg)=>{
			if(msg.ErrNo === 0){
				const f = this.list.find(itm=>itm.id === itemid);
				if (f) {
					console.log('setClosed:', f.Closed);
					f.setClosed(closed);
				}
			}
		})
	}
	mounted() {
		this.getData();
	}
}
</script>
