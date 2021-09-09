<template>
  <div class="row">
    <table cellspacing="0" cellpadding="0">
      <tr class='title'>
        <th> {{ $t('Table.Items.id') }} </th>
        <th> {{ $t('Table.AskTable.User') }} </th>
        <th> {{ $t('Table.AskTable.Item') }} </th>
        <th> {{ $t('Table.AskTable.AskType') }} </th>
        <th> {{ $t('Table.AskTable.BuyType') }} </th>
        <th> {{ $t('Table.AskTable.Qty') }} </th>
        <th> {{ $t('Table.AskTable.Price') }} </th>
        <th> {{ $t('Table.AskTable.Amount') }} </th>
        <th> {{ $t('Table.AskTable.Fee') }} </th>
        <th> {{ $t('Table.AskTable.AskFee') }} </th>
        <th> {{ $t('Table.AskTable.AskPrice') }} </th>
        <th> {{ $t('Table.AskTable.LeverCredit') }} </th>
        <th> {{ $t('Table.AskTable.ExtCredit') }} </th>
        <th> {{ $t('Table.AskTable.Lever') }} </th>
        <th> {{ $t('Table.AskTable.CreateTime') }} </th>
      </tr>
      <tr
        v-for="(itm,idx) in list"
        :key="'askreport'+idx"
        class="list"
      >
        <td>{{ itm.id }}</td>
        <td>{{ itm.User }}</td>
        <td>{{ itm.Item }}</td>
        <td align='center' :class="{ priceLimit: itm.AT }">{{ itm.AskType }}</td>
        <td align='center' :class="{ colorSell: itm.BT, colorBuy: !itm.BT }"> {{ itm.BuyType }} </td>
        <td align='right'> {{ itm.Qty.toFixed(8) }} </td>
        <td align='right'> {{ itm.Price.toFixed(2) }} </td>
        <td align='right'> {{ itm.Amount.toFixed(2) }} </td>
        <td align='right'> {{ itm.Fee.toFixed(2) }} </td>
        <td align='right'> {{ itm.AskFee }} </td>
        <td align='right'> {{ itm.AskPrice.toFixed(2) }} </td>
        <td align='right'> {{ itm.LeverCredit }} </td>
        <td align='right'> {{ itm.ExtCredit }} </td>
        <td align='right'> {{ itm.Lever }} </td>
        <td> {{ new Date(itm.CreateTime).toLocaleString(lang,dOpt) }} </td>
      </tr>
    </table>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { AskReport } from './if/dbif';

@Component
export default class AskList extends Vue {
  @Prop({ type: Array }) readonly list!:AskReport[];
  @Watch('list')
  onListChange() {
    console.log('OnListChange:', this.list);
  }
  lang='zh-TW';
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
.colorBuy {
  color: #c23437;
}
.priceLimit {
  color: #1c76b3;
}
.colorSell {
  color: #369c57;
}
</style>
