<template>
  <div>
    <div class="row">
      <div class="col-2 gsltor"><GS :store="store" :AddAllItem='true' :GameID='curGameID' :ReturnList='true' @setLists='setGameLists' @setGames="setCurGames"></GS></div>
      <div class="col-1 tsltor" v-if="curGameID>0"><TIDS :store="store" :GameID='curGameID' @setTermID='setTermID'></TIDS></div>
      <div class="col-1 tsltor" v-if="curGameID>0"><BTS :GType='curGType' @setBetType='setBetType'></BTS></div>
      <div class="pbtn2"><q-input outlined dense v-model="NameOrNick" :label="$t('Label.NameOrNick')" /></div>
      <div class="pbtn2"><q-input outlined dense v-model="UpName" :label="`${$t('Label.Agent')}/${$t('Label.WebOwner')}`" /></div>
      <div class="pbtn2"><q-input outlined dense v-model="BetID" :label="$t('Report.OrderNo')+'(n,1,2,3,...)'" /></div>
      <div class="tbox-pd"><q-input class="tbox-w" outlined dense v-model="dateSet" /></div>
      <div class="miniBtn-pd"><q-btn color="primary" dense icon="date_range" @click="DateSlt=true"/></div>      
      <div v-if="showTimeEdit" class='pbtn2'><q-input outlined dense v-model="STime" label="##:##:##" mask="##:##:##"/></div>
      <div v-if="showTimeEdit" class='pbtn2'><q-input outlined dense v-model="ETime" label="##:##:##" mask="##:##:##"/></div>      
    </div>
    <div class="row">
      <div class="col-1">{{$t('Report.OdrAmt')}}</div>
      <div class='row pbtn2'>
          <q-input outlined dense v-model="OrdAmtS" />
          <q-input outlined dense v-model="OrdAmtE" />
      </div>
      <div class="col-1">{{$t('Report.WinLose')}}</div>
      <div class='row pbtn2'>
          <q-input outlined dense v-model="WinLoseS" />
          <q-input outlined dense v-model="WinLoseE" />
      </div>      
      <div class='pbtn'><q-btn dense color="green" icon-right="search" :label="$t('Button.Search')"  @click="SearchData()"/></div>      
      <div class='pbtn'><q-btn dense color="blue" icon-right="clear" :label="$t('Button.Clear')"  @click="ClearSearch()"/></div>
    </div>
    <q-separator inset />
    <div v-if="list.length>0" class="mytable">
      <table>
        <tr>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Report.OrderNo')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Report.OrderTime')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Label.GameName')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Label.TermID')}}</td>
          <td class="col mytable-head mytable-field-txt">{{$t('Report.OdrType')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Report.OdrAmt')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Report.Result')}}</td>
        </tr>
      <tr 
        v-for="(itm,idx) in list"
        :key="'bh'+idx"
        >
        <td class="col-1 mytable-field-txt">{{itm.id}}</td>
        <td class="col-1 mytable-field-txt">{{DTString(itm.CreateTime)}}</td>
        <td class="col-1 mytable-field-txt">{{itm.GameName}}</td>
        <td class="col-1 mytable-field-txt">{{itm.TermID}}</td>
        <td class="col mytable-field-txt wdbr" v-html="itm.BetContent"></td>
        <td class="col-1 mytable-field-num">{{itm.Total}}</td>
        <td :class="{'col-1 mytable-field-num':true,RedColor:itm.WinLose<0}">{{itm.WinLose.toFixed(2)}}</td>        
      </tr>
      <tr class="linetotal">
          <td class="col-1 mytable-field-txt" colspan="4">{{$t('Report.Total')}}</td>
          <td class="col-1 mytable-field-txt-right">{{`${$t('Label.TotalN')}`.replace('{N}',list.length)}}</td>
          <td class="col-1 mytable-field-num">{{total}}</td>
          <td :class="{'col-1 mytable-field-num':true,RedColor:winlose<0}">{{winlose.toFixed(2)}}</td>
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
import Component from 'vue-class-component';
import {Watch} from 'vue-property-decorator';
import LayoutStoreModule from './data/LayoutStoreModule'
import {getModule} from 'vuex-module-decorators';
import {SelectOptions,CommonParams,IMsg,BetHeader, ILoginInfo} from './data/if';
import {BHRemaster,datetime} from './components/func';
import GameSelector from './components/GameSelector.vue';
import TermIDSelector from './components/TermIDSelector.vue';
import BetTypeSelector from './components/BetTypeSelector.vue';
import SEDate from './components/SEDate.vue';
Vue.component('GS',GameSelector);
Vue.component('SED',SEDate);
Vue.component('TIDS',TermIDSelector);
Vue.component('BTS',BetTypeSelector);

@Component
export default class BetLists extends Vue {
  store=getModule(LayoutStoreModule);
  NameOrNick:string='';
  curGameID:number=0;
  curGType:string='';
  STime:string='';
  ETime:string='';
  list:BetHeader[]=[];
  GameList:SelectOptions[]=[];
  total:number=0;
  winlose:number=0;
  BetID:string='';
  UpName:string='';
  termid:number=0;
  bettype:number=0;
  OrdAmtS:number=0;
  OrdAmtE:number=0;
  WinLoseS:number=0;
  WinLoseE:number=0;
  DateSlt:boolean=false;
  showTimeEdit:boolean=false;
  dateSet:string='';
  @Watch('dateSet',{immediate:true,deep:true})
  onDateSetChange(){
    //console.log('onDateSetChange',this.DateSlt);
    this.DateSlt=false;
    if(this.dateSet && this.dateSet.indexOf('-')<0){
      this.showTimeEdit=true;
    } else {
      this.showTimeEdit=false;
    }
  }
  get PInfo():ILoginInfo {
    return this.store.personal;
  }
  setCurGames(v:SelectOptions){
    //console.log('setCurGames',v);
    this.curGameID=v.value;
    this.curGType=v.GType ? v.GType : '';
  }
  ClearSearch(){
    this.NameOrNick='';
    this.curGameID=0;
    this.BetID='';
    this.UpName='';
    this.termid=0;
    this.bettype=0;
    this.dateSet='';
    this.STime='';
    this.ETime='';
    this.OrdAmtS=0;
    this.OrdAmtE=0;
    this.WinLoseS=0;
    this.WinLoseE=0;    
  }
  async SearchData(){
    const param:CommonParams={
      UserID: this.PInfo.id,
      sid: this.PInfo.sid
    }
    param.findString = this.NameOrNick;
    param.GameID=this.curGameID;
    if(this.BetID) param.BetID=this.BetID;
    param.UpName=this.UpName;
    if(this.termid) param.tid = this.termid;
    if(this.bettype) param.BetType = this.bettype;
    if(this.dateSet){
      const tmp:string[]=this.dateSet.split('-');
      if(tmp[0]) param.SDate = tmp[0];
      if(tmp[1]) param.EDate = tmp[1];
    }
    if(this.STime) param.STime = this.STime;
    if(this.ETime) param.ETime = this.ETime;
    if(this.OrdAmtS) param.OrdAmtS = this.OrdAmtS;
    if(this.OrdAmtE) param.OrdAmtE = this.OrdAmtE;
    if(this.WinLoseS) param.WinLoseS = this.WinLoseS;
    if(this.WinLoseE) param.WinLoseE = this.WinLoseE;
    const msg:IMsg = await this.store.ax.getApi('getBetHeaders',param);
    //console.log('SearchData',msg);
    if(msg.ErrNo==0){
      const bhs:BetHeader[]=msg.data as BetHeader[];
      //console.log('GameList:',this.GameList);
      bhs.map(bh=>{
        bh.BetContent=JSON.parse(bh.BetContent);
        bh=BHRemaster(bh,this.GameList,this);
      })
      //console.log('SearchData ok!!',bhs);
      this.list = msg.data as BetHeader[];
      this.total=0;
      this.winlose=0;
      this.list.map(itm=>{
        this.total += itm.Total;
        this.winlose += itm.WinLose ? itm.WinLose : 0;
      })
    } else {
      console.log('SearchData error!!');
    }
  }
  setGameLists(v:SelectOptions[]){
    this.GameList = v;
  }
  DTString(v:string){
    return datetime(v);
  }
  setTermID(v:number){
    this.termid=v;
  }
  setBetType(v:number){
    this.bettype=v;
  }
  mounted(){
      if(!this.store.isLogin){
          this.$router.push({path:'/login'});
      }
  }
}
</script>
<style scoped>
.pbtn {
    padding: 8px 4px;
}
.pbtn2 {
    padding: 4px 4px;
}
.mytable {
    max-width: 1400px; 
    padding: 4px 0 8px 8px;
}
.mytable table {
    border-collapse: collapse;
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

.Nums {
  color:blue;
  background-color: cornflowerblue;
}

.Odds {
  color: red;
  background-color: blueviolet;
}
.BetType {
  background-color: black;
  color: white;
}
.linetotal {
  background-color: lightskyblue;
}
.RedColor {
  color:red;
}
.tsltor {
  min-width: 200px;
  padding-top: 4px;
}
.gsltor {
  min-width: 380px;
}
.wdbr {
  word-break: break-all;
  max-width: 500px;
}
.diaDate {
  padding-top: 20px;
  width: 705px;
  max-width: 1000px;
}
</style>