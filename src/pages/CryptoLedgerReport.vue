<template>
  <div class="q-pa-md">
    <div class="row selector">
      <div class="col-2"><selector :Title="$t('Title.Item')" :defaultModel="itemid" :options="options" @SetItem="setItem" /></div>
      <div class="col-2"><q-input class="" outlined dense v-model="SelectDate" /></div>
      <div class="pbtn2"><q-btn color="primary" dense icon="date_range" @click="isDateSlt=true"/></div>
      <div><q-input outlined dense v-model="BetID" :label="$t('Report.OrderNo')+'(n,1,2,3,...)'" /></div>
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
    <LL v-if="Reports.length>0" :list="Reports" />
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
import { CryptoItem, LedgerLever, LedgerReport } from '../components/if/dbif';
import LStore from '../layouts/data/LayoutStoreModule';
import Selector from '../components/Selector.vue';
import ErrCode from '../layouts/data/ErrCode';
import SEDate from '../layouts/components/SEDate.vue';
import LedgerList from '../components/LedgerList.vue';
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
    SED: SEDate,
    LL: LedgerList,
  },
})
export default class CrytoLedgerReport extends Vue {
  store = getModule(LStore);
  api = new ApiFunc(this.store);
  options:SelectOptions[] = [];
  itemid = 0;
  isDateSlt = false;
  SelectDate = '';
  Nickname = '';
  BetID = '';
  Reports:LedgerReport[]=[];
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
    if (!this.SelectDate && !this.BetID) return;
    this.store.setShowProgress(true);
    this.Reports = [];
    // const msg:Msg = await this.api.getAskList(this.SelectDate, this.itemid, this.Nickname);
		const msg:Msg = await this.api.getLedgerLever(this.SelectDate, this.BetID, this.itemid, this.Nickname);
    if (msg.ErrNo === ErrCode.PASS) {
      if (msg.data) {
        // const asks:AskTable[] = msg.data as AskTable[];
        const users:number[] = [];
        const ldgr:LedgerLever[] = msg.data;
				ldgr.map((itm) => {
					const f = users.find((id) => id === itm.UserID);
					if (!f) users.push(itm.UserID);
				});
        if (users.length > 0) {
          const Usrs = await this.getUsers(users);
          console.log('after getUsers', Usrs);
          this.Reports = this.getReports(ldgr, Usrs, this.options);
        }
      }
    }
    this.store.setShowProgress(false);
  }
  getReports(ledgr:LedgerLever[], users:UserName[], items:SelectOptions[]):LedgerReport[] {
    console.log('getReports', items);
    return ledgr.map((itm) => {
      const fu = users.find((usr) => usr.id === itm.UserID);
      let UsrName = '';
      let SiteName = '';
      if (fu) {
        UsrName = fu.Nickname;
        SiteName = fu.SiteName;
      }
      const fi = items.find((opt) => opt.value === itm.ItemID);
      let ItemName = '';
      if (fi) ItemName = fi.label;
      const ldg:LedgerReport = { SiteName, User: UsrName, Item: ItemName, ...itm };
      return ldg;
    });
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
  async getData() {
    const param:WebParams = { ...this.store.Param };
    param.TableName = 'Items';
    param.Fields = ['id', 'Title'];
    const msg:Msg = await this.store.ax.getApi('cc/GetData', param);
    if (msg.ErrNo === ErrCode.PASS) {
      if (msg.data) {
        const list = msg.data as CryptoItem[];
        console.log('getData:', list);
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
