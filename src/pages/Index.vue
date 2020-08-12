<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg">
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {IMsg, CommonParams} from '../layouts/data/if';
import { getModule } from 'vuex-module-decorators';
import LayoutStoreModule from '../layouts/data/LayoutStoreModule';

@Component
export default class PageIndex extends Vue {
  ///*
  store = getModule(LayoutStoreModule);
  get Personal(){
    return this.store.personal;
  }
  get isLogin(){
    return this.store.isLogin;
  }
  async setUserTP(){
    const param:CommonParams={
      UserID:this.store.personal.id,
      sid:this.store.personal.sid,
      isTwoPassAsked:1
    }
    const msg:IMsg=await this.store.ax.getApi('SetUser',param);
    if(msg.ErrNo!==0){
      console.log(msg);
    }     
  }
  async mounted(){
    if(this.isLogin){ 
      if(!this.Personal.isTwoPassAsked){
          this.store.personal.isTwoPassAsked=1;
          await this.setUserTP();
          this.$q.dialog({
              title: this.$t('Table.Password') as string,
              message: this.$t('Table.Pass2OrNot') + '?',
              cancel:true,
              persistent:true
          }).onOk(()=>{
              //this.showGA=true;
              this.store.setShowGA(true);
              //console.log(this.Personal);
          })
      }
    }
  }
  //*/
}

/*
export default Vue.extend({
  name: 'PageIndex',
});
*/
</script>
