<template>
	<div>
		<div class="q-pa-sm row">
			<div>{{ $t('Label.EmergencySwitch.Title') }}</div>
			<q-btn color="red" icon="dangerous" :label="$t('Label.EmergencySwitch.Shutdown')" @click="CloseAll" />
			<q-btn color="red" icon="dangerous" :label="$t('Label.EmergencySwitch.RaiseUp')" @click="OpenAll" />
		</div>
		<q-separator />
		<BCIH class="q-pt-sm" :info="LoginInfo" />
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
import { QDialogOptions } from 'quasar';
import BanCryptoItemControl from '../components/Banner/CryptoItemControl.vue';
import BanCryptoICHeader from '../components/Banner/CryptoICHeader.vue';
import LayoutStoreModule from '../layouts/data/LayoutStoreModule';
import Items from '../components/class/Item/Items';
import ApiFunc from '../components/class/Api/ApiFunc';
import { CryptoItem, AskTable, PartialCryptoItems } from '../components/if/dbif';
import { Msg } from '../layouts/data/if';
import Mqtt from '../components/WebSock/Mqtt';
import { ErrCode } from '../components/if/ENum';

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
		this.Api.getTableData('Items', { isLoan: 1 }).then((msg:Msg) => {
			if (msg.ErrNo === 0) {
				const data:CryptoItem[] = msg.data as CryptoItem[];
				// console.log('CryptoRiskController getData', data);
				data.forEach((itm) => {
					// console.log('getdata', itm.id, itm.Closed);
					if (itm.isLoan) {
						this.list.push(new Items(itm));
					}
				});
				if (this.list.length > 0) {
					this.list.forEach((itm) => {
						this.store.WSock.Add(itm);
					});
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
		this.Api.getTableData('AskTable', filter).then((msg:Msg) => {
			// console.log('getData AskTable', msg);
			if (msg.ErrNo === 0) {
				const asks:AskTable[] = msg.data as AskTable[];
				this.list.forEach((itm) => {
					itm.addAsks(asks);
				});
			}
		});
	}
	updateItems(data:PartialCryptoItems | PartialCryptoItems[], isEmergencyClose:number = 0) {
		console.log('CRC setClosed:', data);
		this.Api.setTableData<PartialCryptoItems>('Items', data, isEmergencyClose).then((msg:Msg) => {
			if (msg.ErrNo === ErrCode.PASS) {
				this.resetDataValue(data);
			}
		});
	}
	resetDataValue(data:PartialCryptoItems | PartialCryptoItems[]) {
		if (Array.isArray(data)) {
			data.forEach((itm) => {
				this.resetValue(itm);
			});
		} else {
			this.resetValue(data);
		}
	}
	resetValue(data:PartialCryptoItems) {
		const f = this.list.find((itm) => itm.id === data.id);
		if (f) {
			// console.log('setClosed:', f.Closed);
			f.setClosed(data);
		}
	}
	OpenAll() {
		this.EmergencySwitch(0);
	}
	CloseAll() {
		this.EmergencySwitch(1);
	}
	EmergencySwitch(sw:number) {
		const opt: QDialogOptions = {
			title: `${this.$t('Dialog.EmergencyShutdown.Title')}`,
			message: String(this.$t(`Dialog.EmergencyShutdown.Message.${sw}`)),
			cancel: true,
		};
		this.$q.dialog(opt).onOk(() => {
			this.EmergencyShutdown(sw);
		});
	}
	EmergencyShutdown(sw:number) {
		const itms = this.list.map((itm) => {
			const tmp:PartialCryptoItems = {
				id: itm.id,
				EmergencyClosed:sw,
			};
			if(sw === 1) {
				tmp.Closed = 3;
			}
			return tmp;
		});
		if (itms.length) {
			this.updateItems(itms, sw);
		}
	}
	mounted() {
		this.mqtt.subscribeTick();
		this.getData();
		this.getAsks();
		// this.interval = setInterval(this.getAsks,500000);
	}
}
</script>
