<template>
  <div v-if="Item">
    <div class="row">
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.Title") }}</div>
      <div class="col-3"><q-input outlined  dense v-model="Title" label="" /></div>
    </div>
    <div class="row" v-if="UserLevel===9">
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.Code") }}</div>
      <div class="col-3"><q-input outlined  dense v-model="Code" label="" /></div>
    </div>
    <div class="row">
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.OpenFee") }}</div>
      <div class="col-3"><q-input outlined  dense v-model="OpenFee" label="" /></div>
    </div>
    <div class="row">
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.CloseFee") }}</div>
      <div class="col-3"><q-input outlined  dense v-model="CloseFee" label="" /></div>
    </div>
    <div class="row">
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.isLoan") }}</div>
      <div class="col-3">N<q-toggle v-model="isLoan" />Y</div>
    </div>
    <div class="row">
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.PriceLimitPercentage") }}</div>
      <div class="col-3"><q-input outlined  dense v-model="PriceLimitPercentage" label="" /></div>
    </div>
    <div class="row">
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.StopGain") }}</div>
      <div class="col-3"><q-input outlined  dense v-model="StopGain" label="" /></div>
    </div>
    <div class="row">
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.StopLose")}}</div>
      <div class="col-3"><q-input outlined  dense v-model="StopLose" label="" /></div>
    </div>
    <div class="row">
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.DecimalPlaces")}}</div>
      <div class="col-3"><q-input outlined  dense v-model="DecimalPlaces" label="" /></div>
    </div>
    <div class="row">
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.QtyDecimalPlaces")}}</div>
      <div class="col-3"><q-input outlined  dense v-model="QtyDecimalPlaces" label="" /></div>
    </div>
    <div class="row">
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.StayLimit")}}</div>
      <div class="col-3"><q-input outlined  dense v-model="StayLimit" label="" /></div>
    </div>
    <div class="row">
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.PerStep")}}</div>
      <div class="col-3"><q-input outlined  dense v-model="PerStep" label="" /></div>
    </div>
    <div class="row">
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.IMG")}}</div>
      <div class="col-3"><q-input outlined  dense v-model="IMG" label="" /></div>
    </div>
    <div class="row">
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.isActive") }}</div>
      <div class="col-3">N<q-toggle v-model="isActive" />Y</div>
    </div>
    <div class="row q-pa-md q-gutter-sm">
      <q-btn color="primary" icon-right="send" :label="$t('Button.Send')" @click="SendData()" />
      <q-btn color="red" icon-right="undo"  :label="$t('Label.Cancel')" @click="Cancel(true)" />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { CryptoItem } from './if/dbif';
import { AnyObject } from '../layouts/data/if';

@Component
export default class CryptoItemBlock extends Vue implements AnyObject {
  @Prop({ type: Object }) readonly value!:CryptoItem;
  @Prop({ type: Number }) readonly UserLevel!:number;
  @Watch('value', { deep: true, immediate: true })
  onValueChange() {
    if (!this.Item) this.Item = { ...this.value };
    this.Cancel();
    this.isLoan = !!this.Item.isLoan;
    this.isActive = !!this.Item.isActive;
    // console.log('CryptoItem onValueChange', this.isLoan, this.isActive, true);
  }
  /*
  @Watch('UserLevel', {deep:true, immediate:true})
  onUserLevelChange() {
    console.log('onUserLevelChange:', this.UserLevel);
  }
  */
  Item:CryptoItem | null = null;
  Title='';
  @Watch('Title')
  onTitleChange() {
    if (this.Item) this.Item.Title = this.Title;
  }
  Code='';
  @Watch('Code')
  onCodeChange() {
    if (this.Item) this.Item.Code = this.Code;
  }
  OpenFee='';
  @Watch('OpenFee')
  onOpenFee() {
    if (this.Item) this.Item.OpenFee = parseFloat(this.OpenFee);
  }
  CloseFee='';
  @Watch('CloseFee')
  onCloseFee() {
    if (this.Item) this.Item.CloseFee = parseFloat(this.CloseFee);
  }
  StopGain='';
  @Watch('StopGain')
  onStopGain() {
    if (this.Item) {
      this.Item.StopGain = parseFloat(this.StopGain);
      // console.log('onStopGain update', this.Item.StopGain, this.StopGain);
    }
  }
  StopLose='';
  @Watch('StopLose')
  onStopLose() {
    if (this.Item) this.Item.StopLose = parseFloat(this.StopLose);
  }
  PriceLimitPercentage = '';
  @Watch('PriceLimitPercentage')
  onPriceLimitPercentageChange() {
    if (this.Item) this.Item.PriceLimitPercentage = parseFloat(this.PriceLimitPercentage);
  }
  isLoan = false;
  isActive = false;
  /*
  options:SelectOptions[] = [
    { label: `${this.$t('Select.Crypto.ItemType.0')}`, value: 1 },
    { label: `${this.$t('Select.Crypto.ItemType.1')}`, value: -1 },
  ]
  */
  DecimalPlaces = '';
  @Watch('DecimalPlaces')
  onDecimalPlacesChange() {
    if (this.Item) this.Item.DecimalPlaces = parseInt(this.DecimalPlaces, 10);
  }
  QtyDecimalPlaces = '';
  @Watch('QtyDecimalPlaces')
  onQtyDecimalPlacesChange() {
    if (this.Item) this.Item.QtyDecimalPlaces = parseInt(this.QtyDecimalPlaces, 10);
  }
  StayLimit = '';
  @Watch('StayLimit')
  onStayLimitChange() {
    if (this.Item) this.Item.StayLimit = parseInt(this.StayLimit, 10);
  }

  PerStep = '';
  @Watch('PerStep')
  onPerStepChange() {
    if (this.Item) this.Item.PerStep = parseFloat(this.PerStep);
  }
  IMG='';
  @Watch('IMG')
  onIMGChange() {
    if (this.Item) this.Item.IMG = this.IMG;
  }
  SendData() {
    if (this.Item) {
      this.Item.isLoan = this.isLoan ? 1 : 0;
      this.Item.isActive = this.isActive ? 1 : 0;
      this.$emit('input', this.Item);
      this.$emit('Save');
    }
  }
  Cancel(isClick = false) {
    this.assignValue(this, this.value);
    if (isClick) {
      this.$emit('Cancel');
    }
    /*
    Object.keys(this.value).forEach((key) => {
      if (this.value[key] !== undefined) {
        const tmp = `${this.value[key]}`;
        eval(`this.${key} = ${tmp}`);
      }
      if (this.Item) this.Item[key] = this.value[key];
    });
    */
    /*
    Object.keys(this.value).forEach(key=>{
      if(this.Item) this.Item[key] = this.value[key];
    })
    */
  }
  assignValue(obj:AnyObject, item:CryptoItem) {
    Object.keys(item).forEach((key) => {
      if (item[key] !== undefined) obj[key] = `${item[key]}`;
      if (obj.Item) obj.Item[key] = item[key];
      // obj[key] = item[key];
      // obj.Item[key] = item[key];
    });
  }
}
</script>
