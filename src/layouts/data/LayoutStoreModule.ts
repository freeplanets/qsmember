import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import Store from '../../store/index';
import AxApi from '../components/AxApi';
import {ILoginInfo} from './if';

@Module({
    dynamic: true,
    name: 'layout',
    namespaced: true,
    store: Store
})
export default class LayoutStoreModule extends VuexModule {
    private isleftDrawerOpen = false;
    public isLogin = false;
    public personal:ILoginInfo = {
        id:0,
        Account:'',
        sid:'',
        Levels:0,
        Types:0,
        isTwoPassAsked:0,
        forcePWChange:0,
        isChkGA:0,
        Progs:[]
    };
    private showGA = false;
    //public ApiUrl:string=myApiUrl;
    public ax=AxApi;
    private sInfo='';
    public showProgress=false;
    public chgPW=false;
    public doLogout=false;
    get isShowGA(){
        return this.showGA;
    }
    @Mutation
    private SET_SYSINFO(info:string){
        this.sInfo=info;
    }
    @Action 
    public setSysInfo(info:string){
        this.SET_SYSINFO(info);
    }
    get SysInfo():string{
        return this.sInfo;
    }
    @Mutation
    public SET_LEFT_DRAWER_OPEN(value: boolean){
        if(value){
            if(!this.isLogin) return;
        }
        this.isleftDrawerOpen = value;
    }
    get leftDrawerOpen(){
        return this.isleftDrawerOpen && this.isLogin;
    }

    @Action
    public setLeftDrawerOpen(value:boolean){
        this.SET_LEFT_DRAWER_OPEN(value);
    }

    @Mutation
    public SET_PERSONAL(value:ILoginInfo){
        this.personal = value;
    }

    @Action
    public setPersonal(value:ILoginInfo){
        this.SET_PERSONAL(value);
    }
    @Action
    public clearPInfo(){
        const personal:ILoginInfo = {
            id:0,
            Account:'',
            sid:'',
            Levels:0,
            Types:0,
            isTwoPassAsked:0,
            forcePWChange:0,
            isChkGA:0,
            Progs:[]
        };
        this.SET_PERSONAL(personal);
    }
    @Mutation
    public SET_IS_LOGIN(value:boolean){
        this.isLogin = value;
    }

    @Action
    public setIsLogin(value:boolean){
        this.SET_IS_LOGIN(value);
    }

    @Mutation
    public SET_SHOW_GA(value:boolean){
        this.showGA = value;
    }

    @Action
    public setShowGA(value:boolean){
        this.SET_SHOW_GA(value);
    }

    @Mutation
    public SET_SHOWPROGRESS(value:boolean){
        this.showProgress=value;
    }
    @Action
    public setShowProgress(value:boolean){
        this.SET_SHOWPROGRESS(value);
    }
    @Mutation
    public SET_CHG_PW(value:boolean){
        this.chgPW=value;
    }
    @Action
    public setCghPW(value:boolean){
        this.SET_CHG_PW(value);
    }    
    @Mutation
    public SET_LOGOUT(value:boolean){
        this.doLogout=value;
    }
    @Action
    public Logout(value:boolean){
        this.SET_LOGOUT(value);
    }  
}