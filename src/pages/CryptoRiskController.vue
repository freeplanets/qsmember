<template>
	<div>
		<div v-if="LoginInfo.Types>2" class="q-pa-sm row esblock">
			<div :class="{title:true,closed:isEmergencyClose,opend:!isEmergencyClose}">{{ $t('Label.EmergencySwitch.Title') }}</div>
			<q-btn color="red" icon="dangerous" v-if="!isEmergencyClose" :label="$t('Label.EmergencySwitch.Shutdown')" @click="CloseAll" />
			<q-btn color="green" icon="check_circle" v-if="isEmergencyClose" :label="$t('Label.EmergencySwitch.RaiseUp')" @click="OpenAll" />
			<div v-if="isEmergencyClose" class="info">{{ $t('Label.EmergencySwitch.info') }}</div>
			<q-btn color="info" icon="article" :label="$t('Label.EmergencySwitch.log')" @click="EmergencyLog" />
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
				@doSettle="doSettle"
				@getMemberSettleMark="getMemberSettleMark"
			/>
		</div>
    <q-dialog v-model="showECLog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ $t('Label.EmergencySwitch.log') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <LEC :list="ECLogList" />
        </q-card-section>
      </q-card>
    </q-dialog>
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
import ApiFunc from '../components/class/Api/Func';
import { CryptoItem, AskTable, PartialCryptoItems, WsMsg, MemberSettleMark, EmergencyCloseLog } from '../components/if/dbif';
import { Msg } from '../layouts/data/if';
import Mqtt from '../components/WebSock/Mqtt';
import { Channels, ErrCode } from '../components/if/ENum';
import ListEmergencyClose from '../components/List/EmergencyClose.vue';

@Component({
	components: {
		BCIC: BanCryptoItemControl,
		BCIH: BanCryptoICHeader,
		LEC: ListEmergencyClose,
	},
})
export default class CryptoRiskController extends Vue {
	store = getModule(LayoutStoreModule);
	Api = new ApiFunc(this.store);
	list:Items[]=[];
	mqtt:Mqtt | null = this.store.Mqtt;
	interval:NodeJS.Timeout | null = null;
	isEmergencyClose = false;
	losefocustimer = 0;
	ECLogList:EmergencyCloseLog[] = [];
	showECLog = false;
	get LoginInfo() {
		return this.store.personal;
	}
	getData() {
		this.Api.getLoanItem().then((msg:Msg) => {
			if (msg.ErrNo === 0) {
				const data:CryptoItem[] = msg.data as CryptoItem[];
				console.log('CryptoRiskController getData', data);
				data.forEach((itm) => {
					// console.log('getdata', itm.id, itm.Closed);
					if (itm.isLoan) {
						this.list.push(new Items(itm, this.store));
					}
				});
				if (this.list.length > 0) {
					this.list.forEach((itm) => {
						this.isEmergencyClose = !!itm.EmergencyClosed;
						if (this.store.WSock) {
							this.store.WSock.Add(itm);
						}
					});
				}
			}
		});
		this.getAsks();
		if (this.mqtt) {
			this.mqtt.setItems(this.list);
		} else {
			console.log('getData mqtt not ready');
		}
	}
	getAsks() {
		console.log('do getAsks');
		let UpId = 0;
		if (this.LoginInfo.Types < 3) {
			UpId = this.LoginInfo.id;
		}
		this.Api.getInProcessAsks(UpId).then((msg:Msg) => {
			console.log('getData AskTable', msg);
			if (msg.ErrNo === 0) {
				const asks:AskTable[] = msg.data as AskTable[];
				this.list.forEach((itm) => {
					itm.addAsks(asks);
				});
				if (this.list.length > 0) {
					this.getMemberSettleMark();
				}
			}
		});
	}
	updateItems(data:PartialCryptoItems | PartialCryptoItems[], isEmergencyClose = 0) {
		console.log('CRC setClosed:', data);
		this.Api.setEmergencyClose(data, isEmergencyClose).then((msg:Msg) => {
			if (msg.ErrNo === ErrCode.PASS) {
				console.log(msg);
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
		console.log('resetValue', data);
		const f = this.list.find((itm) => itm.id === data.id);
		if (f) {
			if (typeof data.EmergencyClosed !== 'undefined') {
				this.isEmergencyClose = !!data.EmergencyClosed;
				console.log('setClosed:', this.isEmergencyClose, f.Closed);
			}
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
				EmergencyClosed: sw,
			};
			if (sw === 1) {
				tmp.Closed = 3;
			}
			return tmp;
		});
		if (itms.length) {
			this.updateItems(itms, sw);
		}
	}
	getMemberSettleMark() {
		this.Api.getSettleMark().then((msg:Msg) => {
			if (msg.ErrNo === ErrCode.PASS) {
				console.log('getMemberSettleMark', this.isEmergencyClose, msg);
				const msm = msg.data as MemberSettleMark[];
				this.list.map((itm) => {
					itm.setSettleMark(msm);
				});
			}
		});
	}
	EmergencyLog() {
		this.ECLogList = [];
		this.Api.getEmergencyLog().then((msg:Msg) => {
			if (msg.ErrNo === ErrCode.PASS) {
				const ec = msg.data as EmergencyCloseLog[];
				this.ECLogList = ec.map((itm) => {
					if (this.mqtt) {
						const f = this.mqtt.getItem(itm.ItemID);
						if (f) {
							itm.Item = String(f.Title);
						}
					}
					return itm;
				});
				this.showECLog = true;
				// console.log('getEmergencyLosg 111:', ec);
			}
		});
	}
	doSettle(ask:AskTable) {
		const msg:WsMsg = {
			ChannelName: Channels.API_SERVER,
			Ask: ask,
		};
		msg.SettleServiceID = this.LoginInfo.id;
		console.log('CryptoRiskController doSettle:', msg);
		if (this.store.WSock) {
			this.store.WSock.send(msg);
		}
	}
	focusMsg(msg:string) {
		let timer = 0;
		if (msg === 'Active' && this.losefocustimer > 0) {
			timer = new Date().getTime() - this.losefocustimer;
		} else {
			this.losefocustimer = new Date().getTime();
		}
		console.log(`Tab lose focus before ${msg}: ${timer}`);
		if (timer > 300000) {
			this.getAsks();
		}
	}
	mounted() {
		if (this.mqtt) {
			this.mqtt.subscribeTick();
		} else {
			console.log('mqtt not ready!!');
		}
		this.getData();
		// this.getAsks();
		window.onfocus = () => { this.focusMsg('Active'); };
		window.onblur = () => { this.focusMsg('Inactive'); };
		// this.interval = setInterval(this.getAsks,500000);
	}
}
</script>
<style lang="scss" scoped>
.esblock .title {
	border: 1px solid $red-14;
	padding: 8px 4px 0px 4px;
}
.esblock .q-btn {
	margin-left: 8px;
}
.opened {
	background-color: $red-1;
	color: black;
}
.closed {
	background-color: $red-10;
	color: white;
}
.info {
	margin: 4px 0 0 16px;
	padding: 4px 0 0 0;
	background-color: $warning;
	border-radius: 10px;
}
</style>
