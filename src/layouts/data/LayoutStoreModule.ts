import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import Store from '../../store/index';
import AxApi from '../components/AxApi';
// import WSock from '../../components/WebSock/WSock';
import ASock from '../../components/WebSock/ASock';
import Mqtt from '../../components/WebSock/Mqtt';
import { LoginInfo } from './if';

@Module({
    dynamic: true,
    name: 'layout',
    namespaced: true,
    store: Store,
})
export default class LayoutStoreModule extends VuexModule {
    private isleftDrawerOpen = false;
    public isLogin = false;
    public personal:LoginInfo = {
        id: 0,
        Account: '',
        sid: '',
        Levels: 0,
        Types: 0,
        isTwoPassAsked: 0,
        forcePWChange: 0,
        isChkGA: 0,
        Progs: [],
    };
    private showGA = false;
    private ws!:ASock;
    private chater!:ASock;
    private mqtt!:Mqtt;
    // public ApiUrl:string=myApiUrl;
    public ax=AxApi;
    private sInfo='';
    public showProgress=false;
    public chgPW=false;
    public doLogout=false;
    get UserInfo() {
        return this.personal;
    }
    get isShowGA() {
        return this.showGA;
    }
    get Param() {
        return {
            sid: this.personal.sid,
            UserID: this.personal.id,
        };
    }
    get WSock() {
        return this.ws;
    }
    get CSock() {
        return this.chater;
    }
    get Mqtt() {
        return this.mqtt;
    }
    @Mutation
    private SET_SYSINFO(info:string) {
        this.sInfo = info;
    }
    @Action
    public setSysInfo(info:string) {
        this.SET_SYSINFO(info);
    }
    get SysInfo():string {
        return this.sInfo;
    }
    @Mutation
    public SET_LEFT_DRAWER_OPEN(value: boolean) {
        if (value) {
            if (!this.isLogin) return;
        }
        this.isleftDrawerOpen = value;
    }
    get leftDrawerOpen() {
        return this.isleftDrawerOpen && this.isLogin;
    }

    @Action
    public setLeftDrawerOpen(value:boolean) {
        this.SET_LEFT_DRAWER_OPEN(value);
    }

    @Mutation
    public SET_PERSONAL(value:LoginInfo) {
        this.personal = value;
    }
    @Action
    public setPersonal(value:LoginInfo) {
        this.SET_PERSONAL(value);
    }
    @Action
    public clearPInfo() {
        const personal:LoginInfo = {
            id: 0,
            Account: '',
            sid: '',
            Levels: 0,
            Types: 0,
            isTwoPassAsked: 0,
            forcePWChange: 0,
            isChkGA: 0,
            Progs: [],
        };
        this.SET_PERSONAL(personal);
    }
    @Mutation
    public SET_IS_LOGIN(value:boolean) {
        this.isLogin = value;
    }

    @Action
    public setIsLogin(value:boolean) {
        this.SET_IS_LOGIN(value);
    }

    @Mutation
    public SET_SHOW_GA(value:boolean) {
        this.showGA = value;
    }

    @Action
    public setShowGA(value:boolean) {
        this.SET_SHOW_GA(value);
    }

    @Mutation
    public SET_SHOWPROGRESS(value:boolean) {
        this.showProgress = value;
    }
    @Action
    public setShowProgress(value:boolean) {
        this.SET_SHOWPROGRESS(value);
    }
    @Mutation
    public SET_CHG_PW(value:boolean) {
        this.chgPW = value;
    }
    @Action
    public setCghPW(value:boolean) {
        this.SET_CHG_PW(value);
    }
    @Mutation
    public SET_LOGOUT(value:boolean) {
        this.doLogout = value;
    }
    @Action
    public Logout(value:boolean) {
        this.SET_LOGOUT(value);
    }
    @Mutation
    private SET_WSOCK(ws:ASock) {
        this.ws = ws;
    }
    @Action
    public setWSock(ws:ASock) {
        this.SET_WSOCK(ws);
    }
    @Mutation
    private SET_CHATER(ch:ASock) {
        this.chater = ch;
    }
    @Action
    public setChater(ch:ASock) {
        this.SET_CHATER(ch);
    }
    @Mutation
    private SET_MQTT(mqtt:Mqtt) {
        this.mqtt = mqtt;
    }
    @Action
    public setMqtt(mqtt:Mqtt) {
        this.SET_MQTT(mqtt);
    }
}
