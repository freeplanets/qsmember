<template>
  <div class="q-pa-md">
    <div class="row selector">
      <div class="col-2"><selector :Title="$t('Title.Item')" :defaultModel="itemid" :options="options" @SetItem="setItem" /></div>
      <div class="col-2"><q-input class="" outlined dense v-model="SelectDate" /></div>
      <div class="pbtn2"><q-btn color="primary" dense icon="date_range" @click="isDateSlt=true"/></div>
      <div class="col row">
        <q-chip square>
          <q-avatar icon="account_circle" color="red" text-color="white" />
          {{ $t('Label.MemberName') }}
        </q-chip>
        <q-input class="" outlined dense v-model="Nickname" />
      </div>
      <div class='row col pbtn2'>
        <q-btn dense color="green" icon-right="search" :label="$t('Button.Search')"  @click="SearchData"/>
        <q-btn dense color="blue" icon-right="clear" :label="$t('Button.Clear')"  @click="ClearSearch"/>
      </div>
    </div>
    <q-separator />
    <AL v-if="askReports.length>0" :list="askReports" />
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
import { Msg, SelectOptions, WebParams } from 'src/layouts/data/if';
import { AskTable, AskReport, CryptoItem } from '../components/if/dbif';
import LStore from '../layouts/data/LayoutStoreModule';
import Selector from '../components/Selector.vue';
import ErrCode from '../layouts/data/ErrCode';
import SEDate from '../layouts/components/SEDate.vue';
import AskList from '../components/AskList.vue';
import ApiFunc from '../components/class/Api/Func';

interface UserName {
  id: number;
  Nickname: string;
}

@Component({
  components: {
    Selector,
    SED: SEDate,
    AL: AskList,
  },
})
export default class CrytoReport extends Vue {
  store = getModule(LStore);
  api = new ApiFunc(this.store);
  options:SelectOptions[] = [];
  itemid = 0;
  isDateSlt = false;
  SelectDate = '';
  Nickname = '';
  askReports:AskReport[]=[];
  @Watch('SelectDate')
  onSDChange() {
    console.log('onSDChange:', this.SelectDate);
  }
  setItem(itemid:number) {
    console.log('setItem', itemid);
    this.itemid = itemid;
  }
  ClearSearch() {
    this.itemid = 0;
    this.SelectDate = '';
  }
  async SearchData() {
    if (!this.SelectDate) return;
    this.store.setShowProgress(true);
    this.askReports = [];
    const msg:Msg = await this.api.getAskList(this.SelectDate, this.itemid, this.Nickname);
    if (msg.ErrNo === ErrCode.PASS) {
      if (msg.data) {
        const asks:AskTable[] = msg.data as AskTable[];
        const users:number[] = [];
        asks.forEach((itm) => {
          if (users.indexOf(itm.UserID) === -1) users.push(itm.UserID);
        });
        if (users.length > 0) {
          const Usrs = await this.getUsers(users);
          console.log('after getUsers', Usrs);
          if (Usrs.length > 0) {
            this.askReports = this.getAskReports(asks, Usrs, this.options);
            console.log('after getAskReports', this.askReports);
          }
        }
      }
    }
    this.store.setShowProgress(false);
  }
  getAskReports(asks:AskTable[], users:UserName[], items:SelectOptions[]):AskReport[] {
    return asks.map((ask) => {
      const fu = users.find((usr) => usr.id === ask.UserID);
      let UsrName = '';
      if (fu) UsrName = fu.Nickname;
      const fi = items.find((itm) => itm.value === ask.ItemID);
      let ItemName = '';
      if (fi) ItemName = fi.label;
      const tmp:AskReport = {
        id: ask.id,
        User: UsrName,
        Item: ItemName,
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
      };
      return tmp;
    });
  }
  async getUsers(users:number[]):Promise<UserName[]> {
    const msg:Msg = await this.api.getMemberNameByID(users);
    if (msg.ErrNo === ErrCode.PASS) {
      return msg.data as UserName[];
    }
    return [];
  }
  async getData() {
    const param:WebParams = { ...this.store.Param };
    param.TableName = 'Items';
    param.Fields = ['id', 'Title'];
    const msg:Msg = await this.store.ax.getApi('cc/GetData', param);
    if (msg.ErrNo === ErrCode.PASS) {
      if (msg.data) {
        const list = msg.data as CryptoItem[];
        this.options = list.map((itm) => {
          const tmp:SelectOptions = {
            label: `${itm.Title}`,
            value: itm.id,
          };
          return tmp;
        });
        const sltOne:SelectOptions = {
          label: 'ALL',
          value: 0,
        };
        this.options.splice(0, 0, sltOne);
      }
    }
  }
  async mounted() {
    await this.getData();
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
