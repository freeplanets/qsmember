<template>
  <div>
    <div class="top row">
        <div><GS :store="store" :AddAllItem='true' @setGames="setCurGames"></GS></div>
        <div class="tbox-pd">
          <q-btn-toggle
            v-model="Ledger"
            class="my-custom-toggle"
            no-caps
            rounded
            unelevated
            toggle-color="primary"
            color="white"
            text-color="primary"
            :options="ledgers"
          />
        </div>        
        <div class="tbox-pd"><q-input class="tbox-w" outlined dense v-model="dateSet" /></div>
        <div class="miniBtn-pd"><q-btn color="primary" dense icon="date_range" @click="DateSlt=true"/></div>
        <div class='miniBtn-pd'><q-btn dense color="green" icon-right="search" :label="$t('Button.Search')"  @click="SearchData()"/></div>    
    </div>
    <q-separator inset />
    <div v-if='list.length>0' class="mytable">
      <table>
        <tr>
          <td class="mytable-head mytable-field-txt">{{$t('Table.Account')}}</td>
          <td v-if="hasBTField" class="col-1 mytable-head mytable-field-txt">{{$t('Report.OdrType')}}</td>
          <td class="mytable-head mytable-field-txt">{{$t('Report.OdrAmt')}}</td>
          <td class="mytable-head mytable-field-txt">{{$t('Report.Result')}}</td>
        </tr>
      <tr 
        v-for="(itm,idx) in list"
        :key="'bh'+idx"
        >
        <td class="mytable-field-txt">{{itm.Account}}</td>
        <td v-if="hasBTField"  class="col-1 mytable-field-txt">{{itm.BTName}}</td>
        <td class="mytable-field-num">{{itm.Total.toFixed(2)}}</td>
        <td :class="{'mytable-field-num':true,RedColor:itm.WinLose<0}">{{itm.WinLose.toFixed(2)}}</td>        
      </tr>
      <tr class="linetotal">
          <td class="mytable-field-txt" :colspan="hasBTField ? 2: 1">{{$t('Report.Total')}}</td>
          <td class="mytable-field-num">{{total.toFixed(2)}}</td>
          <td :class="{'mytable-field-num':true,RedColor:winlose<0}">{{winlose.toFixed(2)}}</td>
      </tr>
      </table>          
    </div>
    <q-dialog v-model="DateSlt">
      <q-card class='diaDate'>
        <q-card-section class="q-pt-none">
          <SED v-model="dateSet" @closeme="DateSlt=false"></SED>
        </q-card-section>
      </q-card>
    </q-dialog>      
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Compnent from 'vue-class-component';
import {Watch} from 'vue-property-decorator';
import LayoutStoreModule from './data/LayoutStoreModule';
import {getModule} from 'vuex-module-decorators';
import { SelectOptions, CommonParams,IMsg } from './data/if';
import GameSelector from './components/GameSelector.vue';
import SEDate from './components/SEDate.vue';
Vue.component('GS',GameSelector);
Vue.component('SED',SEDate);

interface TData {
  UpId:number;
  Account?:string;
  BetType?:string;
  BTName?:string;
  Total:number;
  WinLose:number;
}

@Compnent
export default class BetReport extends Vue{
  store=getModule(LayoutStoreModule);
  dateSet:string='';
  @Watch('dateSet',{immediate:true,deep:true})
  onDateSetChange(){
    //console.log('onDateSetChange',this.DateSlt);
    this.DateSlt=false;
  }
  curGameID:number=0;
  DateSlt:boolean=false;
  curGType:string='';
  curLedger:number=0;
  ledgers:SelectOptions[]=[
    //{value:0,label:'Report.GeneralLedger'},
    //{value:1,label:'Report.Ledger'}
  ];
  list:TData[]=[];
  total:number=0;
  winlose:number=0;
  hasBTField:boolean=false;
  get Ledger(){
    return this.curLedger;
  }
  set Ledger(v){
    if(this.curGameID){
      this.curLedger=v;
    }
  }
  setCurGames(v:SelectOptions){
    this.curGameID=v.value;
    this.curGType=v.GType ? v.GType : '';
    if(this.curGameID){
      this.curLedger=0;
    }
  }
  async SearchData(){
    const param:CommonParams={};
    if(this.dateSet){
      const tmp:string[]=this.dateSet.split('-');
      if(tmp[0]) param.SDate=tmp[0];
      if(tmp[1]) param.EDate=tmp[1];
    } else {
      return;
    }
    if(this.curGameID){
      param.GameID=this.curGameID;
    }
    if(this.curLedger){
      param.Ledger=this.curLedger;
    }
    const msg:IMsg=await this.store.ax.getApi('getBetTotal',param);
    if(msg.ErrNo===0){
      this.list = msg.data as TData[];
      const User=msg.User;
      this.total=0;
      this.winlose=0;
      this.list.map(itm=>{
        this.total+=itm.Total;
        this.winlose+=itm.WinLose;
        const f=User.find(u=>u.id===itm.UpId);
        if(f){
          itm.Account=f.Account;
        }
        if(itm.BetType){
          this.hasBTField=true;
          itm.BTName=this.$t(`Game.${this.curGType}.Item.${itm.BetType}.title`)+'';
        } else {
          this.hasBTField=false;
        }
      })
      //console.log('SearchData:',this.list);
    }
  }
  mounted(){
    this.ledgers.push({value:0,label:`${this.$t('Report.GeneralLedger')}`});
    this.ledgers.push({value:1,label:`${this.$t('Report.Ledger')}`});
    //console.log('BetReport mounted:',this.ledgers);
  }
}
</script>
<style scoped>
.top {
  padding-left: 8px;
}
.diaDate {
  padding-top: 20px;
  width: 705px;
  max-width: 1000px;
}
.tbox-w {
  width: 200px;
}
.my-custom-toggle {
  border: 1px solid #027be3
}

.mytable {
    max-width: 600px; 
    padding: 4px 0 8px 8px;
}
.mytable table {
    border-collapse: collapse;
}

.mytable td {
  width: 120px;
}
.mytable-head {
    background-color: cadetblue;
    color:white;
}
.mytable-field-txt {
    border: 1px gray solid;
    text-align: center;
    vertical-align: middle;
}
.mytable-field-txt-right {
    border: 1px gray solid;
    text-align: right;
    vertical-align: middle;
}
.mytable-field-num {
    border: 1px gray solid;
    text-align: right;
    vertical-align: middle;  
}
.RedColor {
  color:red;
}
</style>