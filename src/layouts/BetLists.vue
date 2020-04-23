<template>
  <div>
    <div class="row">
      <div class="col-2"><GS :store="store" :AddAllItem='true' :ReturnList='true' @setLists='setGameLists' @setGames="setCurGames"></GS></div>
      <div class="pbtn2"><q-input outlined dense v-model="NameOrNick" :label="$t('Label.NameOrNick')" /></div>
      <div class='pbtn'><q-btn dense color="primary" icon-right="date_range" :label="$t('Label.Date')"  @click="datePickerShow=true"/></div>      
      <div class='pbtn2'>
          <q-input outlined dense v-model="TDate" mask="####-##-##"/>
      </div>
      <div class='pbtn'><q-btn dense color="green" icon-right="search" :label="$t('Button.Search')"  @click="SearchData()"/></div>
    </div>
    <q-separator inset />
    <div v-if="list.length>0" class="mytable">
      <div class="row">
        <div class="col-1 mytable-head mytable-field-txt">{{$t('Report.OrderNo')}}</div>
        <div class="col-1 mytable-head mytable-field-txt">{{$t('Report.OrderTime')}}</div>
        <div class="col-1 mytable-head mytable-field-txt">{{$t('Label.GameName')}}</div>
        <div class="col mytable-head mytable-field-txt">{{$t('Report.OdrType')}}</div>
        <div class="col-1 mytable-head mytable-field-txt">{{$t('Report.OdrAmt')}}</div>
        <div class="col-1 mytable-head mytable-field-txt">{{$t('Report.Result')}}</div>
      </div>
      <div 
        v-for="(itm,idx) in list"
        :key="'bh'+idx"
        class="row">
        <div class="col-1 mytable-field-txt">{{itm.id}}</div>
        <div class="col-1 mytable-field-txt">{{DTString(itm.CreateTime)}}</div>
        <div class="col-1 mytable-field-txt">{{itm.GameName}}</div>
        <div class="col mytable-field-txt" v-html="itm.BetContent"></div>
        <div class="col-1 mytable-field-num">{{itm.Total}}</div>
        <div class="col-1 mytable-field-num">{{itm.WinLose.toFixed(2)}}</div>        
      </div>
    </div>
    <q-dialog v-model="datePickerShow">
      <q-card>            
          <q-card-section>
          <q-date v-model="TDate" mask="YYYY-MM-DD" />
          </q-card-section>                
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LayoutStoreModule from './data/LayoutStoreModule'
import {getModule} from 'vuex-module-decorators';
import {SelectOptions,CommonParams,IMsg,BetHeader} from './data/if';
import {dateString,BHRemaster,datetime} from './components/func';
import GameSelector from './components/GameSelector.vue';
Vue.component('GS',GameSelector);

@Component
export default class BetLists extends Vue {
  store=getModule(LayoutStoreModule);
  NameOrNick:string='';
  curGameID:number=0;
  TDate:string=dateString();
  list:BetHeader[]=[];
  datePickerShow:boolean=false;
  GameList:SelectOptions[]=[];
  setCurGames(v:SelectOptions){
      this.curGameID=v.value;
  }
  async SearchData(){
    const param:CommonParams={}
    param.findString = this.NameOrNick;
    param.GameID=this.curGameID;
    param.SDate=this.TDate;
    const msg:IMsg = await this.store.ax.getApi('getBetHeaders',param);
    console.log('SearchData',msg);
    if(msg.ErrNo==0){
      const bhs:BetHeader[]=msg.data as BetHeader[];
      console.log('GameList:',this.GameList);
      bhs.map(bh=>{
        bh.BetContent=JSON.parse(bh.BetContent);
        bh=BHRemaster(bh,this.GameList,this);
      })
      console.log('SearchData ok!!',bhs);
      this.list = msg.data as BetHeader[];
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
    max-width: 1000px; 
    padding-left: 8px;
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
.cont {
  max-width: 200px;
}
</style>