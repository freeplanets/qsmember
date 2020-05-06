import { Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Store from '../../store/index';
import {IUser} from './schema';
import AxApi from '../components/AxApi';

@Module({
    dynamic: true,
    name: 'layout',
    namespaced: true,
    store: Store
})
export default class LayoutStoreModule extends VuexModule {
    private isleftDrawerOpen = true;
    public isLogin = false;
    public personal:IUser = {TableName:'User',id:0};
    //public ApiUrl:string=myApiUrl;
    public ax=AxApi;
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
    public SET_PERSONAL(value:IUser){
        this.personal = value;
    }

    @Action
    public setPersonal(value:IUser){
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
}