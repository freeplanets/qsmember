<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-input square outlined v-model="Account">
        <template v-slot:prepend>
          <q-icon name="account_circle" />
        </template>
      </q-input>

      <q-input square outlined v-model="Password" type="password">
        <template v-slot:prepend>
          <q-icon name="vpn_key" />
        </template>
      </q-input>
      <q-btn color="red" icon-right="send" label="Login" @click="login()" />  
    </div>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{$t('Label.InputGA')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="Pin" autofocus />
        </q-card-section>
        <q-card-section class="q-pt-none" v-if="GAError">
          {{$t('Label.GAError')}}
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('Button.Confirm')" v-close-popup @click="GAValidate"/>
        </q-card-actions>
      </q-card>
    </q-dialog>    
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Components from 'vue-class-component';
//import axios, { AxiosRequestConfig,AxiosResponse} from 'axios';
import LayoutStoreModule from './data/LayoutStoreModule';
import { getModule } from 'vuex-module-decorators';
//import {IUser} from './data/schema';
import { IMsg,CommonParams,ILoginInfo } from './data/if';

@Components
export default class Login extends Vue {
  store = getModule(LayoutStoreModule);
  Account='';
  Password='';
  Pin='';
  prompt=false;
  GAError=false;
  set Personal(value:ILoginInfo){
    this.store.setPersonal(value);
  }
  get Personal():ILoginInfo {
    return this.store.personal;
  }
  set isLogin(value:boolean){
    this.store.setIsLogin(value);
  }
  get isLogin():boolean {
    return this.store.isLogin;
  }
  async login(){
    /*
    const config:AxiosRequestConfig = {
      //withCredentials: true,
      //headers: {'Access-Control-Allow-Origin': 'http://localhost:8080'},
      params: {
        Account: this.Account,
        Password: this.Password
      }
    }
    */
    const params:CommonParams = {
        Account: this.Account,
        Password: this.Password,
        UserID:0,
        sid:''
    }
    //const url:string=this.store.ax.Host+'/login';
    const msg:IMsg=await this.store.ax.getApi('/login',params);
    if(msg.ErrNo===0){
        this.Account='';
        this.Password='';
        this.Personal = msg.data as ILoginInfo;
        this.isLogin = true;
        //this.store.leftDrawerOpen=true;
        console.log('Login PInfo:',this.Personal);
        if(this.Personal.forcePWChange){
          this.store.setCghPW(true);
        } else if(this.Personal.isChkGA){
          this.prompt=true;
        } else {
          this.$router.push({path:'/'});      
        }
    } else {
      this.$q.dialog({
          title: this.$t('Title.PersonalInfo') as string,
          message: this.$t('Title.LoginERR') as string
      });      
    }
    //console.log('login:',url);
    /*
    await axios.get(url,config).then((res:AxiosResponse)=>{
      const ans:IMsg=res.data as IMsg;
      //console.log('login:',ans);
      if(ans.ErrNo===0){
        this.Personal = ans.data as IUser;
        this.isLogin = true;
        //this.store.leftDrawerOpen=true;
        this.$router.push({path:'/'});
      }
    }).catch(err=>{
      console.error('login error:',err);
    })
    */
    //console.log('login',this.Account,this.Password);
  }
  async GAValidate(){
    this.store.setShowProgress(true);
    const param:CommonParams={
      UserID:this.store.personal.id,
      sid:this.store.personal.sid,
      Pin:this.Pin
    }
    const msg:IMsg=await this.store.ax.getApi('GAValidate',param);
    console.log('GAValidate:',msg);
    if(msg.ErrNo===0){
      //this.GAIMG=msg.ErrCon ? msg.ErrCon : '';
      this.$router.push({path:'/'});  
    } else {
      this.Pin = '';
      this.GAError=true;
      this.prompt=true;
    }
    this.store.setShowProgress(false);
  }
  mounted(){
    //console.log('login SysInfo:',this.store.SysInfo);
    //console.log('login locale:',this.$i18n);
    //this.$i18n.locale='zh-cn';
    //console.log('login user agent',navigator.userAgent);

  }
}
</script>