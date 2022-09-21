<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-form
        @submit="login"
        class="q-gutter-md"
      >
        <q-input square outlined v-model="Account">
          <template v-slot:prepend>
            <q-icon name="account_circle" />
          </template>
        </q-input>

        <q-input square outlined v-model="Password" type="password" autocomplete="on">
          <template v-slot:prepend>
            <q-icon name="vpn_key" />
          </template>
        </q-input>

        <div class="q-pa-lg">
          <q-option-group
            v-model="curlang"
            :options="Lang"
            color="primary"
            inline
          />
        </div>
        <q-btn color="red" icon-right="send" label="Login" type="submit" />
      </q-form>
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
import { Vue, Component, Watch } from 'vue-property-decorator';
// import axios, { AxiosRequestConfig,AxiosResponse} from 'axios';
import { getModule } from 'vuex-module-decorators';
// import {User} from './data/schema';
import WSock from '../components/WebSock/WSock';
import Mqtt from '../components/WebSock/Mqtt';
import ChatClient from '../components/WebSock/ChatClient';
import LayoutStoreModule from './data/LayoutStoreModule';
import { Msg, CommonParams, LoginInfo } from './data/if';

interface selOptions {
  label: string;
  value: string;
}
interface PlatformParams {
  userCode:string;
  token:string;
  lang:string;
  [key:string]:string;
}
interface objD {
  [key:string]:string;
}

@Component
export default class Login extends Vue {
  store = getModule(LayoutStoreModule);
  params:PlatformParams = {
    userCode: '',
    token: '',
    lang: '',
  };
  Account='';
  Password='';
  Pin='';
  prompt=false;
  GAError=false;
  Lang:selOptions[] = [
    { label: '正體', value: 'zh-tw' },
    { label: '簡體', value: 'zh-cn' },
    { label: 'English', value: 'en-us' },
  ]
  curlang = '';
  @Watch('curlang')
  onLangChange() {
    console.log('onLangChange', this.$i18n.locale, this.curlang);
    this.$i18n.locale = this.curlang;
  }
  set Personal(value:LoginInfo) {
    this.store.setPersonal(value);
  }
  get Personal():LoginInfo {
    return this.store.personal;
  }
  set isLogin(value:boolean) {
    this.store.setIsLogin(value);
  }
  get isLogin():boolean {
    return this.store.isLogin;
  }
  async autoLogin() {
    await this.login(this.params);
  }
  async login(param?:PlatformParams) {
    const params:CommonParams = {
        Account: this.Account,
        Password: this.Password,
        UserID: 0,
        sid: '',
    };
    // const url:string=this.store.ax.Host+'/login';
    const msg:Msg = await this.store.ax.getApi('/login', param?.userCode ? param : params);
    console.log('after login:', msg);
    if (msg.ErrNo === 0) {
        this.Account = '';
        this.Password = '';
        this.Personal = msg.data as LoginInfo;
        this.isLogin = true;
        // this.store.leftDrawerOpen=true;
        // console.log('Login PInfo:',this.Personal);
        if (msg.wsServer) {
          const ws:WSock = new WSock(this.store, msg.wsServer);
          this.store.setWSock(ws);
        }
        if (msg.chatServer && !param) {
          const chat:ChatClient = new ChatClient(this.store, msg.chatServer, msg.chatSite);
          this.store.setChater(chat);
        }
        this.store.setMqtt(new Mqtt(this.Personal));
        if (this.Personal.forcePWChange) {
          this.store.setCghPW(true);
        } else if (this.Personal.isChkGA) {
          this.prompt = true;
        }
        // console.log('login router push', this.$router.getRoutes());
        this.store.setRouter(this.$router);
        this.$router.push({ path: '/Main' });
        // console.log('header chk info:', this.store.ax.Info);
    } else {
      this.$q.dialog({
          title: this.$t('Title.PersonalInfo') as string,
          message: this.$t('Title.LoginERR') as string,
      });
    }
  }
  async GAValidate() {
    this.store.setShowProgress(true);
    const param:CommonParams = {
      UserID: this.store.personal.id,
      sid: this.store.personal.sid,
      Pin: this.Pin,
    };
    const msg:Msg = await this.store.ax.getApi('GAValidate', param);
    console.log('GAValidate:', msg);
    if (msg.ErrNo === 0) {
      // this.GAIMG=msg.ErrCon ? msg.ErrCon : '';
      this.$router.push({ path: '/' });
    } else {
      this.Pin = '';
      this.GAError = true;
      this.prompt = true;
    }
    this.store.setShowProgress(false);
  }
  getDefaultLanguage() {
    let lang = navigator.language.toLowerCase();
    if (lang) {
      const f = this.Lang.find((itm) => itm.value);
      if (f) this.curlang = f.value;
    } else {
      lang = this.Lang[0].value;
    }
    console.log('getDefaultLanguage', lang);
    // if (this.$i18n.locale !== lang) this.$i18n.locale = lang;
    return lang;
  }
  regroupParams(urlparam:string): PlatformParams {
    urlparam = urlparam.replace('?', '');
    const arrStr:string[] = urlparam.split('&');
    const param:objD = {};
    arrStr.map((itm) => {
      const tmp:string[] = itm.split('=');
      param[tmp[0]] = tmp[1];
    });
    return param as PlatformParams;
  }
  async mounted() {
    console.log('login mounted', this.$route);
    if (this.$route.params.userCode) {
      this.params = this.$route.params as PlatformParams;
      // console.log('login mounted params', this.params);
    } else {
      // this.params = this.regroupParams(window.location.search);
      Object.assign(this.params, this.regroupParams(window.location.search));
      // console.log('Location', window.location);
      window.history.pushState('', '', `${window.location.origin}/#/`);
    }
    this.store.setIsLogin(false);
    this.getDefaultLanguage();
    if (this.params.token) {
      await this.autoLogin();
    }
    // console.log('login SysInfo:',this.store.SysInfo);
    // console.log('login locale:',this.$i18n);
    // this.$i18n.locale='zh-cn';
    // console.log('login user agent',navigator.userAgent);
  }
}
</script>
