<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen=true"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          App {{ ProName }}
        </q-toolbar-title>
        <q-btn flat round dense icon="edit" @click="showComment=!showComment" />
        <div v-if="Personal.Account">
          <q-btn-dropdown flat icon="account_circle" :label="Personal.Account">
            <q-list>
              <q-item clickable v-close-popup @click="showGA=true">
                <q-item-section>
                  <q-item-label>{{$t('Table.Pass2OrNot')}}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="cleanPW">
                <q-item-section>
                  <q-item-label>{{$t('Title.ChangePassword')}}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="logout">
                <q-item-section>
                  <q-item-label>{{$t('Common.Logout')}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>          
        </div>
        <div v-if="!Personal.Account">App v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
      overlay
      @click="leftDrawerOpen=false"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item to="/basepayclass"  @click="ProName=$t('Label.BasePayClassManage')+'';showComment=false" clickable >
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Label.BasePayClassManage') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/payclass"  @click="ProName=$t('Label.PayClassManage')+'';showComment=false" clickable >
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Label.PayClassManage') }}</q-item-label>
          </q-item-section>
        </q-item>        
        <q-item to="/betclass" @click="ProName=$t('Label.ClassName')+'';showComment=false" exact>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Label.ClassName')}}</q-item-label>
          </q-item-section>          
        </q-item>
        <q-item to="/createpayclass" @click="ProName=$t('Label.CratePayClass')+'';showComment=false">
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.CratePayClass')}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/termsmanager" @click="ProName=$t('Label.TermManager')+'';showComment=false">
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.TermManager')}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/gamemanager" @click="ProName=$t('Label.GameManager')+'';showComment=false">
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.GameManager')}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/adduser" @click="ProName=$t('Label.UserManager')+'';showComment=false">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.UserManager')}}</q-item-label>
          </q-item-section>
        </q-item>
        <!--
        <q-item to="/openparams" @click="ProName=$t('Label.OpenParams');showComment=false">
          <q-item-section avatar>
            <q-icon name="emoji_symbols" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.OpenParams')}}</q-item-label>
          </q-item-section>
        </q-item>
        -->
        <q-item to="/oddsmanager" @click="ProName=$t('Label.OddsManager')+'';showComment=false">
          <q-item-section avatar>
            <q-icon name="emoji_symbols" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.OddsManager')}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/betlists" @click="ProName=$t('Label.BetLists')+'';showComment=false">
          <q-item-section avatar>
            <q-icon name="receipt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.BetLists')}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/betreport" @click="ProName=$t('Label.BetReport')+'';showComment=false">
          <q-item-section avatar>
            <q-icon name="receipt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Label.BetReport')}}</q-item-label>
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
    <q-dialog v-model="showCp">
      <q-card style="width: 300px" class="q-px-sm q-pb-md">
        <q-card-section>
          <div class="text-h6">{{$t('Title.ChangePassword')}}</div>
        </q-card-section>
        <q-item dense>
          <q-item-section>
            <q-input outlined dense type="password" v-model="OPassword" :label="$t('Title.OPassword')" />
          </q-item-section>
        </q-item>
        <q-item dense>
          <q-item-section>
            <q-input outlined dense type="password" v-model="NPassword" :label="$t('Title.NPassword')" />
          </q-item-section>
        </q-item>

        <q-item dense>
          <q-item-section>
            <q-input outlined dense type="password" v-model="CPassword" :label="$t('Title.CPassword')" />
          </q-item-section>
        </q-item>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('Button.Confirm')" @click="ChangePW" />
        </q-card-actions>        
      </q-card>
    </q-dialog>
    <q-dialog v-model="showGA">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">{{$t('Label.GAMsg')}}</div>
        </q-card-section>        
        <q-separator />
        <div v-html="GAIMG">
          </div>
        <q-separator />
        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" :label="$t('Label.Cancel')" />
          <q-btn v-close-popup flat color="primary" :label="$t('Label.Save')" />
        </q-card-actions>
      </q-card>
    </q-dialog>    
    <q-page-container>
      <router-view />
      <q-dialog v-model="showComment" seamless position="bottom">
          <CMMT style="width: 80%" :store='store'></CMMT>
      </q-dialog>      
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators';
import LayoutStoreModule from './data/LayoutStoreModule';
import {IMsg,ILoginInfo, CommonParams} from './data/if';
import {Watch} from 'vue-property-decorator';
//import {IUser} from './data/schema';
import Comments from './components/Comments.vue';
Vue.component('CMMT',Comments);

@Component
export default class MyLayout extends Vue {
  store = getModule(LayoutStoreModule);
  showComment:boolean=false;
  ProName:string='*';
  showCp:boolean=false;
  OPassword:string='';
  NPassword:string='';
  CPassword:string='';
  GAIMG:string='';
  get leftDrawerOpen() {
    //console.log('leftDrawerOpen get:',this.store.leftDrawerOpen);
    return this.store.leftDrawerOpen;
  }
  set leftDrawerOpen(value:boolean){
    //console.log('leftDrawerOpen set:');
    this.store.setLeftDrawerOpen(value);
  }
  get showGA(){
    return this.store.isShowGA;
  }
  set showGA(v:boolean){
    this.store.setShowGA(v);    
  }
  @Watch('showGA',{immediate:true,deep:true})
  onShowGAChange(){
    //console.log('onShowGAChange',this.store.SysInfo);
    if(this.store.isShowGA){
      this.getGAImg();
    }
  }
  get isLogin(){
    return this.store.isLogin;
  }
  get Personal():ILoginInfo{
    return this.store.personal as ILoginInfo;
  }
  async getGAImg(){
    const param:CommonParams={
      UserID:this.store.personal.id,
      sid:this.store.personal.sid,
      AppName:this.store.SysInfo
    }
    const msg:IMsg=await this.store.ax.getApi('getGAImg',param);
    if(msg.ErrNo===0){
      this.GAIMG=msg.ErrCon ? msg.ErrCon : '';
    } 
    //console.log(msg);
  }
  async SaveGAImg(){
    const param:CommonParams={
      UserID:this.store.personal.id,
      sid:this.store.personal.sid
    }
    const msg:IMsg=await this.store.ax.getApi('SaveGAImg',param);
    if(msg.ErrNo===0){
      this.GAIMG=msg.ErrCon ? msg.ErrCon : '';
    } 
    //console.log(msg);
  }  
  async getSysInfo(){
    const param:CommonParams={
      UserID:0,
      sid:''
    }
    const msg:IMsg=await this.store.ax.getApi('getSysInfo',param);
    //console.log(msg);
    if(msg.ErrNo===0){
      //Object.assign(this.store.SysInfo,msg.data);
      let a:any=msg.data;
      this.store.setSysInfo(a.SysName);
    }
  }
  cleanPW(){
    this.OPassword='';
    this.NPassword='';
    this.CPassword='';
    this.showCp=true;
  }
  async ChangePW(){
    if(this.CPassword !== this.NPassword){
        this.$q.dialog({
            title: this.$t('Title.ChangePassword') as string,
            message: this.$t('Title.PassERR') as string
        });
        return;
    }
    const param:CommonParams={
      UserID:this.store.personal.id,
      sid:this.store.personal.sid,
      OPassword: this.OPassword,
      NPassword: this.NPassword,
      CPassword: this.CPassword
    }
    const msg:IMsg= await this.store.ax.getApi('ChangePassword',param,'post');
    if(msg.ErrNo===0){
      this.showCp=false;
      this.$q.dialog({
          title: this.$t('Title.ChangePassword') as string,
          message: this.$t('Title.PassChgMsg') as string
      });    
      this.$router.push({path:'/login'});      
    }
  }
  async logout(){
    const param:CommonParams={
      UserID:this.Personal.id,
      sid: this.Personal.sid
    }
    const msg:IMsg= await this.store.ax.getApi('logout',param);
    console.log(msg);
    this.$router.push({path:'/login'});
  }
  mounted() {
    //console.log('MyLayout mounted isLogin:',this.isLogin);
    this.getSysInfo();
    if(!this.isLogin){      
      //console.log('MyLayout:',this.$route);
      this.store.ax.Router = this.$router;
      if(this.$route.path !== '/login'){
        this.$router.push({path:'/login'});
      }
    } else {
         this.$router.push({path:'/'});
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
