<template>
  <div class="q-pa-md">
    <div class="row selector">
      <div class="col-2"><item-selector :defaultModel="itemid" :retryData="1" @SetItem="setItem" /></div>
      <div class="col-2"><q-input class="" outlined dense v-model="SelectDate" /></div>
      <div class="pbtn2"><q-btn color="primary" dense icon="date_range" @click="isDateSlt=true"/></div>
      <div><q-input outlined dense v-model="BetID" :label="$t('Report.OrderNo')+'(n,1,2,3,...)'" /></div>
      <div class="col-1 row">
        <q-input class="" outlined dense v-model="Nickname" :label="$t('Label.MemberName')" />
      </div>
      <div class="col-1"><selector :Title="$t('Label.Status')" :defaultModel="askState" :options="procStatus" @SetItem="setAskState" /></div>
      <div class="col-1"><selector :Title="$t('Table.AskTable.ItemType')" :defaultModel="itemType" :options="itemTypes" @SetItem="setItemType" /></div>
      <div class='row col pbtn2'>
        <q-btn dense color="green" icon-right="search" :label="$t('Button.Search')"  @click="SearchData"/>
        <q-btn dense color="blue" icon-right="clear" :label="$t('Button.Clear')"  @click="ClearSearch"/>
      </div>
    </div>
    <q-separator />
    <AL v-if="askReports.length>0" :list="askReports" />
    <div>{{ recordCnt > 0 ? `Records:${recordCnt}` : '' }}</div>
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
import { Vue, Component, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { Msg, SelectOptions } from 'src/layouts/data/if';
import { AskTable, AskReport } from '../components/if/dbif';
import LStore from '../layouts/data/LayoutStoreModule';
import Selector from '../components/Selector/Selector.vue';
import ItemSelector from '../components/Selector/ItemSelector.vue';
import { ErrCode } from '../components/if/ENum';
import SEDate from '../layouts/components/SEDate.vue';
import AskList from '../components/AskList.vue';
import ApiFunc from '../components/class/Api/Func';

interface UserName {
  id: number;
  Nickname: string;
  UpId: number;
  SiteName: string;
}
interface SiteName {
  id:number;
  SiteName:string;
}

@Component({
  components: {
    Selector,
    ItemSelector,
    SED: SEDate,
    AL: AskList,
  },
})
export default class CrytoReport extends Vue {
  store = getModule(LStore);
  api = new ApiFunc(this.store);
  itemid = 0;
  isDateSlt = false;
  Nickname = '';
  BetID = '';
  askReports:AskReport[]=[];
  recordCnt = 0;
  askState = -1;
  procStatus = this.getAskState();
  itemType = 0;
  itemTypes = this.getItemTypes();
  options:SelectOptions[] = [];
  SelectDate = '';
  @Watch('SelectDate')
  onSDChange() {
    console.log('onSDChange:', this.SelectDate);
  }
  setItem(itemid:number) {
    // console.log('setItem', itemid);
    this.itemid = itemid;
  }
  setAskState(v:number) {
    // console.log('setAskState', v);
    this.askState = v;
  }
  setItemType(v:number) {
    this.itemType = v;
  }
  ClearSearch() {
    this.itemid = 0;
    this.SelectDate = '';
  }
  getAskState():SelectOptions[] {
    const data:SelectOptions[] = [{ value: -1, label: 'ALL' }];
    const tmp = this.$t('Label.ProcStatus');
    if (tmp && Array.isArray(tmp)) {
      (tmp as any).map((itm:any, idx:number) => {
        data.push({ value: idx, label: String(itm) });
      });
    }
    return data;
  }
  getItemTypes():SelectOptions[] {
    return [{ value: 0, label: 'ALL' },
      { value: -1, label: String(this.$t('Select.Crypto.ItemTypeLong.0')) },
      { value: 1, label: String(this.$t('Select.Crypto.ItemTypeLong.1')) },
    ];
  }
  async SearchData() {
    if (!this.SelectDate && !this.BetID) return;
    this.recordCnt = 0;
    this.store.setShowProgress(true);
    this.askReports = [];
    const msg:Msg = await this.api.getAskList(this.SelectDate, this.BetID, this.itemid, this.Nickname, this.askState, this.itemType);
    if (msg.ErrNo === ErrCode.PASS) {
      if (msg.data) {
        // const asks:AskTable[] = msg.data as AskTable[];
        // const users:number[] = [];
        const upids:number[] = [];
        const asks:AskTable[] = [];
        // const askids:number[] = [];
        (msg.data as AskTable[]).map((itm) => {
          if (!((itm.USetID || itm.SetID) && itm.ProcStatus < 2)) {
            // if (users.indexOf(itm.UserID) === -1) users.push(itm.UserID);
            // askids.push(itm.id);
            if (upids.indexOf(itm.UpId) === -1) upids.push(itm.UpId);
            asks.push(itm);
          }
        });
        console.log('asks length:', asks);

        if (upids.length > 0) {
          this.recordCnt = asks.length;
          // const Usrs = await this.getUsers(users);
          const Ups = await this.getUps(upids);
          console.log('after getUps', Ups);
          if (Ups.length > 0) {
            this.askReports = this.getAskReports(asks, Ups, this.options).sort((a, b) => a.DealTime - b.DealTime);
            console.log('after getAskReports length:', this.askReports.length);
          }
        }
      }
    }
    this.store.setShowProgress(false);
  }
  getAskReports(asks:AskTable[], ups:SiteName[], items:SelectOptions[]):AskReport[] {
    console.log('getAskReports', items);
    return asks.map((ask) => {
      /*
      const fu = users.find((usr) => usr.id === ask.UserID);
      let UsrName = '';
      let SiteName = '';
      if (fu) {
        UsrName = fu.Nickname;
        SiteName = fu.SiteName;
      }
      */
      const fi = items.find((itm) => itm.value === ask.ItemID);
      let ItemName = '';
      if (fi) ItemName = fi.label;
      let SettleType = 0;
      // const fmark = askmark.find((itm) => itm.AskID === ask.id);
      if (ask.MarkTS) SettleType = 1;
      const f = ups.find((itm) => itm.id === ask.UpId);
      const SiteName = f ? f.SiteName : '';
      const tmp:AskReport = {
        id: ask.id,
        SiteName,
        User: String(ask.Nickname),
        Item: ItemName,
        Code: ask.Code,
        AskType: this.$t(`Select.Crypto.AskType.${ask.AskType}`).toString(),
        AT: ask.AskType,
        BuyType: this.$t(`Select.Crypto.BuyType.${ask.BuyType}`).toString(),
        BT: ask.BuyType,
        ItemType: ask.ItemType > 0 ? 1 : 0,
        Qty: ask.Qty,
        Price: ask.Price,
        Amount: ask.Amount,
        Fee: ask.Fee,
        AskFee: ask.AskFee,
        AskPrice: ask.AskPrice,
        LeverCredit: ask.LeverCredit,
        ExtCredit: ask.ExtCredit,
        Lever: ask.Lever,
        ProcStatus: ask.ProcStatus,
        CreateTime: ask.CreateTime,
        DealTime: ask.DealTime || 0,
        isSettle: !!ask.BuyType,
        SettleType,
        isUserSettle: ask.isUserSettle,
      };
      return tmp;
    });
  }
  async getUps(upids:number[]) {
    const msg = await this.api.getMemberSiteNameByUpId(upids);
    if (msg.ErrNo === ErrCode.PASS) {
      const site = msg.data as SiteName[];
      return site;
    }
    return [];
  }
  async getUsers(userid:number[]):Promise<UserName[]> {
    let msg:Msg = await this.api.getMemberNameByID(userid);
    if (msg.ErrNo === ErrCode.PASS) {
      const users = msg.data as UserName[];
      const upid:number[] = [];
      users.map((user) => {
        const f = upid.findIndex((itm) => itm === user.UpId);
        if (f === -1) upid.push(user.UpId);
      });
      msg = await this.api.getMemberSiteNameByUpId(upid);
      if (msg.ErrNo === ErrCode.PASS) {
        const site = msg.data as SiteName[];
        users.forEach((user) => {
            const f = site.find((st) => st.id === user.UpId);
            if (f) user.SiteName = f.SiteName;
        });
      }
      console.log('getUsers after site', users);
      return users;
    }
    return [];
  }
  getOptions(v:SelectOptions[]) {
    console.log('getOptions:', v);
    this.options = v;
  }
}
</script>
<style scoped>
.selector {
  margin-bottom: 4px;
}
.pbtn {
    padding: 8px 4px;
}
.pbtn2 {
    padding: 4px 4px;
}
.diaDate {
  padding-top: 20px;
  width: 705px;
  max-width: 1000px;
}
</style>
