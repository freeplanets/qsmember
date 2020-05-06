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
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Components from 'vue-class-component';
import axios, { AxiosRequestConfig,AxiosResponse} from 'axios';
import LayoutStoreModule from './data/LayoutStoreModule';
import { getModule } from 'vuex-module-decorators';
import {IUser} from './data/schema';
import { IMsg } from './data/if';

@Components
export default class Login extends Vue {
  store = getModule(LayoutStoreModule);
  Account='';
  Password='';
  set Personal(value:IUser){
    this.store.setPersonal(value);
  }
  get Personal():IUser {
    return this.store.personal;
  }
  set isLogin(value:boolean){
    this.store.setIsLogin(value);
  }
  get isLogin():boolean {
    return this.store.isLogin;
  }
  async login(){
    const config:AxiosRequestConfig = {
      //withCredentials: true,
      //headers: {'Access-Control-Allow-Origin': 'http://localhost:8080'},
      params: {
        Account: this.Account,
        Password: this.Password
      }
    }
    const url:string=this.store.ax.Host+'/login';
    //console.log('login:',url);
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
    //console.log('login',this.Account,this.Password);
  }
  mounted(){
    //console.log('login:',this.$store.state.layout);
    //console.log('login user agent',navigator.userAgent);

  }
}
</script>