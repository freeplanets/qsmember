<template>
  <div>
    <div class="row">
      <div class="col-2"><GS :store="store" :AddAllItem='true' @setGames="setCurGames"></GS></div>
      <div class="pbtn2"><q-input outlined dense v-model="NameOrNick" :label="$t('Label.NameOrNick')" /></div>
      <div class='pbtn2'><q-btn color="primary" icon-right="date_range" :label="$t('Label.Date')"  @click="datePickerShow=true"/></div>      
      <div class='pbtn2'>
          <q-input outlined dense v-model="TDate" mask="####-##-##"/>
      </div>
      <div class='pbtn2'><q-btn color="green" icon-right="search" :label="$t('Button.Search')"  @click="SearchData()"/></div>
    </div>
    <q-separator inset />
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
import {SelectOptions,CommonParams} from './data/if';
import {dateString} from './components/func';
import GameSelector from './components/GameSelector.vue';
Vue.component('GS',GameSelector);

@Component
export default class BetLists extends Vue {
  store=getModule(LayoutStoreModule);
  NameOrNick:string='';
  curGameID:number=0;
  TDate:string=dateString();
  datePickerShow:boolean=false;
  setCurGames(v:SelectOptions){
      this.curGameID=v.value;
  }
  SearchData(){
    const param:CommonParams={}
    param.NameOrNick = this.NameOrNick;
    param.GameID=this.curGameID;
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
    padding: 6px 4px;
}
.pbtn2 {
    padding: 2px 4px;
}
</style>