<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen=!leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          App {{ ProName }}
        </q-toolbar-title>
        <q-btn flat round dense icon="edit" @click="showComment=!showComment" />
        <div v-if="Personal.Account">
          <q-icon name="account_circle"  class="text-white" style="font-size: 32px;" />
          {{ Personal.Account }}
        </div>
        <div v-if="!Personal.Account">App v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
      no-swipe-close
      overlay
      @click="leftDrawerOpen=false"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item to="/basepayclass"  @click="ProName=$t('Label.BasePayClassManage');showComment=false" clickable >
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Label.BasePayClassManage') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/payclass"  @click="ProName=$t('Label.PayClassManage');showComment=false" clickable >
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Label.PayClassManage') }}</q-item-label>
          </q-item-section>
        </q-item>        
        <q-item to="/betclass" @click="ProName=$t('Label.ClassName');showComment=false" exact>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Label.ClassName')}}</q-item-label>
          </q-item-section>          
        </q-item>
        <q-item to="/createpayclass" @click="ProName=$t('Label.CratePayClass');showComment=false">
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.CratePayClass')}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/termsmanager" @click="ProName=$t('Label.TermManager');showComment=false">
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.TermManager')}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/gamemanager" @click="ProName=$t('Label.GameManager');showComment=false">
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.GameManager')}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/adduser" @click="ProName=$t('Label.UserManager');showComment=false">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.UserManager')}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/openparams" @click="ProName=$t('Label.OpenParams');showComment=false">
          <q-item-section avatar>
            <q-icon name="emoji_symbols" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.OpenParams')}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/oddsmanager" @click="ProName=$t('Label.OddsManager');showComment=false">
          <q-item-section avatar>
            <q-icon name="emoji_symbols" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.OddsManager')}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/betlists" @click="ProName=$t('Label.BetLists');showComment=false">
          <q-item-section avatar>
            <q-icon name="receipt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.BetLists')}}</q-item-label>
          </q-item-section>
        </q-item>           
        <!--
          
        <q-item clickable tag="a" target="_blank" href="https://facebook.quasar.dev">
          <q-item-section avatar>
            <q-icon name="public" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Facebook</q-item-label>
            <q-item-label caption>@QuasarFramework</q-item-label>
          </q-item-section>
        </q-item>
        // !-->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <q-dialog v-model="showComment" seamless position="bottom">
          <CMMT style="width: 80%"></CMMT>
      </q-dialog>      
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators';
import LayoutStoreModule from './data/LayoutStoreModule';
import {IUser} from './data/schema';
import Comments from './components/Comments.vue';
Vue.component('CMMT',Comments);

@Component
export default class MyLayout extends Vue {
  store = getModule(LayoutStoreModule);
  showComment:boolean=false;
  ProName:string='*';
  get leftDrawerOpen() {
    return this.store.leftDrawerOpen;
  }
  set leftDrawerOpen(value:boolean){
    this.store.setLeftDrawerOpen(value);
  }
  get isLogin(){
    return this.store.isLogin;
  }
  get Personal():IUser{
    return this.store.personal as IUser;
  }
  mounted() {
    //console.log('MyLayout mounted isLogin:',this.isLogin);
    if(!this.isLogin){
      //console.log('MyLayout:',this.$route);
      if(this.$route.path !== '/login'){
        this.$router.push({path:'/login'});
      }
    }
  }
}

/*
export default Vue.extend({
  name: 'MyLayout',

  data() {
    return {
      leftDrawerOpen: false,
    };
  },
});
*/
</script>
