import { Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Store from '../../store/index';
import {IUser} from './schema';
import AxApi from '../components/AxApi';
import {ILoginInfo} from './if';

@Module({
    dynamic: true,
    name: 'layout',
    namespaced: true,
    store: Store
})
export default class LayoutStoreModule extends VuexModule {
    private isleftDrawerOpen = true;
    public isLogin = false;
    public personal:ILoginInfo = {
        id:0,
        Account:'',
        sid:'',
        Levels:0,
        isTwoPassAsked:0,
        isChkGA:0
    };
    private showGA = false;
    //public ApiUrl:string=myApiUrl;
    public ax=AxApi;
    private sInfo='';
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
}