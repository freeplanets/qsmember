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
      <div class="col-3"><q-toggle v-model="isLoan" /></div>
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
      <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items.IMG")}}</div>
      <div class="col-3"><q-input outlined  dense v-model="IMG" label="" /></div>
    </div>    
    <div class="row q-pa-md q-gutter-sm">
      <q-btn color="primary" icon-right="send" :label="$t('Button.Send')" @click="SendData()" />
      <q-btn color="red" icon-right="undo"  :label="$t('Label.Cancel')" @click="Cancel()" />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { CryptoItem } from './if/dbif';
import { SelectOptions } from '../layouts/data/if';

@Component
export default class CryptoItemBlock extends Vue {
  @Prop({ type: Object }) readonly value!:CryptoItem;
  @Prop({ type: Number }) readonly UserLevel!:number;
  @Watch('value', { deep:true, immediate:true })
  onValueChange() {
    if(!this.Item) this.Item = { ...this.value };
    this.Cancel();
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
    if (this.Item) this.Item.StopGain = parseFloat(this.StopGain);
  }
  StopLose='';
  @Watch('StopLose')
  onStopLose() {
    if (this.Item) this.Item.StopLose = parseFloat(this.StopLose);
  }
  isLoan = false;
  @Watch('isLoan')
  onIsLoanChange() {
    if (this.Item) {
      this.Item.isLoan = this.isLoan ? 1 : 0; 
    }
  }
  options:SelectOptions[] = [
    {label:`${this.$t('Select.Crypto.ItemType.0')}`,value:1},
    {label:`${this.$t('Select.Crypto.ItemType.1')}`,value:-1}
  ]
  IMG='';
  @Watch('IMG')
  onIMGChange() {
    if (this.Item) this.Item.IMG = this.IMG;
  }
  SendData() {
    if(this.Item){
      this.$emit('input', this.Item);
      this.$emit('Save');
    } 
  }
  Cancel() {
    Object.keys(this.value).forEach(key=>{
      if(this.value[key] !== undefined) this[key] = `${this.value[key]}`;
      if(this.Item) this.Item[key] = this.value[key];
    });
    /*
    Object.keys(this.value).forEach(key=>{
      if(this.Item) this.Item[key] = this.value[key];
    })
    */
  }
}
</script>