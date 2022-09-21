<template>
  <div class="row">
    <table cellspacing="0" cellpadding="0">
      <tr class='title'>
        <th> {{ $t('Table.Items.id') }} </th>
        <th> {{ $t('Table.SiteName') }} </th>
        <th> {{ $t('Table.AskTable.User') }} </th>
        <th> {{ $t('Table.AskTable.Item') }} </th>
        <th> {{ $t('Table.AskTable.ItemType') }} </th>
        <th> {{ $t('Table.AskTable.Qty') }} </th>
        <th> {{ $t('Select.Crypto.BuyType.0') }} </th>
        <th> {{ $t('Select.Crypto.BuyType.1') }} </th>
        <th> {{ $t('Table.AskTable.Fee') }} </th>
        <th> {{ $t('Table.AskTable.Lever') }} </th>
        <th> {{ $t('Report.GainLose') }} </th>
        <th> {{ $t('Label.Time') }} </th>
      </tr>
      <tr
        v-for="(itm,idx) in list"
        :key="'report'+idx"
        class="list"
      >
        <td>{{ itm.id }}</td>
        <td>{{ itm.SiteName }}</td>
        <td>{{ itm.User }}</td>
        <td>{{ itm.Item }}</td>
        <td align='center' :class="{ colorSell: itm.ItemType > 0 , colorBuy: itm.ItemType < 0 }">
           {{ itemTypeTitle(itm.ItemType) }}
        </td>
        <td align='right'> {{ itm.Qty.toFixed(8) }} </td>
        <td align='right'> {{ showPrice(itm).toFixed(2) }} </td>
        <td align='right'> {{ showPrice(itm, 'Sell').toFixed(2) }} </td>
        <td align='right'> {{ showFee(itm).toFixed(2) }} </td>
        <td align='right'> {{ itm.Lever }} </td>
        <td align='right' :class="{colorBuy: itm.GainLose < 0}"> {{ itm.GainLose.toFixed(2) }} </td>
        <td > {{ new Date(itm.SellTime).toLocaleString(lang,dOpt) }} </td>
      </tr>
    </table>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { LedgerReport } from './if/dbif';
import LStore from '../layouts/data/LayoutStoreModule';
import Func from '../components/class/Api/Func';

@Component
export default class LedgerList extends Vue {
  @Prop({ type: Array }) readonly list!:LedgerReport[];
  @Watch('list')
  onListChange() {
    console.log('OnListChange:', this.list);
  }
  store = getModule(LStore);
  func = new Func(this.store);
  lang = 'zh-TW';
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
  showPrice(itm:LedgerReport, type = 'New') {
    return type === 'New' ? itm.BuyPrice : itm.SellPrice;
    /*
    console.log('showPrice', itm.id, itm.ItemType, itm.BuyPrice, itm.SellPrice);
    if (type === 'New') {
      return itm.ItemType > 0 ? itm.BuyPrice : itm.SellPrice;
    }
    return itm.ItemType > 0 ? itm.SellPrice : itm.BuyPrice;
    */
  }
  showFee(itm:LedgerReport) {
    return itm.BuyFee + itm.SellFee + itm.TFee;
  }
  itemTypeTitle(itemType:number) {
    const iType = itemType < 0 ? 0 : itemType;
    return this.$t(`Select.Crypto.ItemType.${iType}`);
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
