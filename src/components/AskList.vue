<template>
  <div class="row">
    <table cellspacing="0" cellpadding="0">
      <tr class='title'>
        <th> {{ $t('Table.Items.id') }} </th>
        <th> {{ $t('Table.SiteName') }} </th>
        <th> {{ $t('Table.AskTable.User') }} </th>
        <th> {{ $t('Table.AskTable.Item') }} </th>
        <th> {{ $t('Table.AskTable.AskType') }} </th>
        <th> {{ $t('Table.AskTable.BuyType') }} </th>
        <th> {{ $t('Table.AskTable.ItemType') }} </th>
        <th> {{ $t('Table.AskTable.Qty') }} </th>
        <th> {{ $t('Table.AskTable.Price') }} </th>
        <th> {{ $t('Table.AskTable.Amount') }} </th>
        <th> {{ $t('Table.AskTable.Fee') }} </th>
        <th> {{ $t('Table.AskTable.AskFee') }} </th>
        <th> {{ $t('Table.AskTable.AskPrice') }} </th>
        <th> {{ $t('Table.AskTable.LeverCredit') }} </th>
        <th> {{ $t('Table.AskTable.Lever') }} </th>
        <th> {{ `${$t('Label.Settle')} / ${$t('Table.AskTable.CreateTime')}` }} </th>
        <th> {{ $t('Label.Status') }} </th>
        <th> {{ $t('Report.SettleType') }} </th>
      </tr>
      <tr
        v-for="(itm,idx) in list"
        :key="'askreport'+idx"
        class="list"
      >
        <td>{{ itm.id }}</td>
        <td>{{ itm.SiteName }}</td>
        <td>{{ itm.User }}</td>
        <td>{{ itm.Item }}</td>
        <td align='center' :class="{ priceLimit: itm.AT }">{{ itm.AskType }}</td>
        <td align='center' :class="{ colorSell: itm.BT, colorBuy: !itm.BT }"> {{ itm.BuyType }} </td>
        <td align='center' :class="{ colorSell: !itm.ItemType, colorBuy: itm.ItemType }">
           {{ $t(`Select.Crypto.ItemType.${itm.ItemType}`) }}
        </td>
        <td align='right'> {{ itm.Qty.toFixed(8) }} </td>
        <td align='right'> {{ itm.Price.toFixed(2) }} </td>
        <td align='right'> {{ itm.Amount.toFixed(2) }} </td>
        <td align='right'> {{ itm.Fee.toFixed(2) }} </td>
        <td align='right'> {{ itm.AskFee }} </td>
        <td align='right'> {{ itm.AskPrice.toFixed(2) }} </td>
        <td align='right'> {{ itm.LeverCredit }} </td>
        <td align='right'> {{ itm.Lever }} </td>
        <td v-if="!itm.isSettle"> {{ new Date(itm.CreateTime).toLocaleString(lang,dOpt) }} </td>
        <td v-if="itm.isSettle" style="color:green"> {{ new Date(itm.DealTime).toLocaleString(lang,dOpt) }}</td>
        <td align='center' :class="`StatusColor${itm.ProcStatus}`" @click="getPriceTick(itm)"> {{ $t(`Label.ProcStatus.${itm.ProcStatus}`) }} </td>
        <td align='center'> {{ itm.SettleType ? $t('Report.HandSettle') : '' }} </td>
      </tr>
    </table>
    <q-dialog v-model="showPT" persistent>
      <q-card>
        <q-bar>
          <div>{{ curItemTitle }}</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>{{ $t('Label.Close') }}</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <list-price-tick :list="ptList" />
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { AskReport, PriceTick } from './if/dbif';
import LStore from '../layouts/data/LayoutStoreModule';
import Func from '../components/class/Api/Func';
import { ErrCode } from './if/ENum';
import ListPriceTick from './List/PriceTick.vue';

@Component({
  components: {
    ListPriceTick,
  },
})
export default class AskList extends Vue {
  @Prop({ type: Array }) readonly list!:AskReport[];
  @Watch('list')
  onListChange() {
    console.log('OnListChange:', this.list);
  }
  store = getModule(LStore);
  func = new Func(this.store);
  lang = 'zh-TW';
  showPT = false;
  ptList:PriceTick[] = [];
  curImg = '';
  curItemTitle = '';
  dOpt = {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    // timeZone: 'Asia/Taipei',
    weekday: 'short',
  }
  d = new Date();
  getPriceTick(item:AskReport) {
    if (item.ProcStatus !== 2) return;
    this.ptList = [];
    this.curItemTitle = item.Code;
    this.curImg = '';
    const code = item.Code.replace('USDT', '/USDT');
    console.log('code:', code);
    this.func.getPriceTick(code, item.DealTime).then((msg) => {
      console.log('getPriceTick:', msg);
      if (msg.ErrNo === ErrCode.PASS) {
        if (msg.data) {
          const tmp = msg.data as PriceTick[];
          this.ptList = tmp.sort((a, b) => a.ticktime - b.ticktime);
          this.showPT = true;
        }
      }
    });
  }
}
</script>
<style scoped>
table {
  border-left: 1px solid forestgreen;
  margin-top: 4px;
}
.title th{
  background-color: cadetblue;
  color: white;
  border-right: 1px solid forestgreen;
  border-bottom: 1px solid royalblue;
  padding: 4px;
}
.list td{
  border-bottom: 1px solid cornflowerblue;
  border-right: 1px solid forestgreen;
  padding-left: 4px;
  padding-right: 4px;
}
.colorBuy, .StatusColor3, .StatusColor4 {
  color: #c23437;
}
.priceLimit, .StatusColor0, .StatusColor1 {
  color: #1c76b3;
}
.colorSell, .StatusColor2 {
  color: #369c57;
}
.StatusColor2 {
  cursor: pointer;
}
</style>
