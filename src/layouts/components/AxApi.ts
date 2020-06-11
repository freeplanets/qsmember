import axios,{AxiosRequestConfig,AxiosResponse} from 'axios'
import { SelectOptions,CBetItems,IMsg,CommonParams,IbtCls, ParamLog} from '../data/if';
import {IGames,ITerms,Game, IUser} from '../data/schema';
let myApiUrl:string='https://testu.uuss.net:3000';

if(window.location.hostname==='localhost'){
    myApiUrl = 'http://localhost:3000';
}
/*
const config:AxiosRequestConfig = {
    //withCredentials: true,
    //headers: { 'Access-Control-Allow-Origin': '*' }
}
*/
export class AxApi {
    private router; 
    constructor(private ApiUrl){
        console.log('AxApi created!!',ApiUrl);
    }
    get Host(){
        return this.ApiUrl;
    }
    set Router(v){
        this.router=v;
    }
    gotoLoginPage(){
        console.log('gotoLoginPage',typeof(this.router));
        if(this.router){
            this.router.push({path:'/login'});
        }
    }
	async getGames(UserID:number,sid:string):Promise<SelectOptions[] | undefined>{
        const params:CommonParams={
            UserID:UserID,
            sid:sid
        }        
        const ans=await this.getApi('getGames',params);
        const tmp:SelectOptions[]=[];
        //console.log('getGames:',ans);
        if(ans.ErrNo===0){
            const dta:any=ans.data;
            //console.log('getGames ans.data:',dta);
            dta.map(itm=>{
                const t:SelectOptions={
                    label: itm.name,
                    value: itm.id,
                    GType: itm.GType
                }
                tmp.push(t);                
            })
            return tmp;
        } else {
            return;
        }
    }
    async getTermIDByGameID(UserID:number,sid:string,GameID:number):Promise<SelectOptions[] | undefined>{
        const params:CommonParams={
            GameID:GameID,
            UserID:UserID,
            sid:sid
        }
        const tmp:SelectOptions[]=[];
        const ans=await this.getApi('getTermIDByGameID',params);
        if(ans.ErrNo===0){
            const dta:any=ans.data;
            dta.map(itm=>{
                const t:SelectOptions={
                    label: itm.TermID,
                    value: itm.id,
                }
                tmp.push(t);                
            })
            return tmp;            
        } else {
            return;
        }
    }
    async getBtClass(UserID:number,sid:string,GameID:number|string):Promise<IbtCls[] | undefined>{
		const param:CommonParams={
            GameID:GameID,
            UserID:UserID,
            sid:sid            
        }
        const ans=await this.getApi('getBtClass',param);
        if(ans.ErrNo===0){
            return ans.data as IbtCls[];
        } else {
            return;
        }
    }    
    async saveTerms(UserID:number,sid:string,dtas:ITerms,PL?:ParamLog[]){
        let param:CommonParams={
            UserID,
            sid
        }
        param=Object.assign(param,dtas)
        if(PL){
            param.ParamLog = PL
        }
        //const url:string=this.ApiUrl+'/api/saveTerms';
        //console.log('saveTerms',dtas);
        return await this.getApi('saveTerms',param,'post');
    }
    async createBetItems(dtas:CBetItems){
        let ans;
        const url:string=this.ApiUrl+'/api/createBetItems';
        await axios.post(url,dtas).then((res:AxiosResponse)=>{
            //console.log(res.data);
            ans = res.data;
        }).catch(err=>{
            //console.log(err);
            ans = err;
        })           
        return ans;
    }
    async getGameList(UserID:number,sid:string):Promise<Game[]|undefined>{
		const param:CommonParams={
            UserID:UserID,
            sid:sid            
        }
        return new Promise((resolve,reject)=>{
            this.getApi('GameList',param).then((msg:IMsg)=>{
                resolve(msg.data as Game[]);
            }).catch(err=>{
                reject(err);
            })
        });      

        /*
        const url:string=this.ApiUrl+'/api/GameList';
        const config:AxiosRequestConfig = {
        }
        let ans;
        await axios.get(url,config).then(res=>{
            ans=res.data;
        }).catch(err=>{
            //console.log(err);
            ans= err;
        })
        return ans;
        */
    }
    async saveGame(UserID:number,sid:string,dta:Game):Promise<IMsg>{
        const param:CommonParams={
            UserID:UserID,
            sid:sid,
        }
        Object.keys(dta).map(key=>{
            param[key]=dta[key];
        })
        //const url:string=this.ApiUrl+'/api/UpdateGame';
        return await this.getApi('UpdateGame',param,'post');
    }

    async getTerms(UserID:number,sid:string,GameID:number|string,sdate?:string):Promise<IMsg>{
        const param:CommonParams={
            UserID:UserID,
            sid:sid,
            GameID:GameID,
            SDate:sdate
        }
        return await this.getApi('getTerms',param);
        /*
        const url:string=this.ApiUrl+'/api/getTerms';
        const config:AxiosRequestConfig = {
            params: {
                GameID:GameID,
                SDate:sdate
            }
        }
        let ans;
        await axios.get(url,config).then(res=>{
            ans=res.data;
        }).catch(err=>{
            //console.log(err);
            ans= err;
        })
        return ans;
        */   
    }
    async saveUser(UserID:number,sid:string,user:IUser):Promise<IMsg>{
        const param:CommonParams={
            UserID:UserID,
            sid:sid,
        }
        Object.keys(user).map(key=>{
            param[key]=user[key];
        })
        return await this.getApi('SaveUser',param,'post');
        /*
        let ans;
        const url:string=this.ApiUrl+'/api/SaveUser';
        await axios.post(url,user).then((res:AxiosResponse)=>{
            //console.log(res.data);
            ans = res.data;
        }).catch(err=>{
            //console.log(err);
            ans = err;
        })           
        return ans;
        */     
    }
    async getUsers(f:CommonParams):Promise<IMsg>{
        return await this.getApi('getUsers',f);
        /*
        const url:string=this.ApiUrl+'/api/getUsers';
        await axios.get(url).then((res:AxiosResponse)=>{
            //console.log(res.data);
            ans=res.data;
        }).catch(err=>{
            //console.log(err);
            ans = err;
        })
        return ans;
        */
    }
    async getPayClass(UserID:number,sid:string,GameID?:number|string):Promise<IMsg>{
        const param:CommonParams={
            GameID:GameID,
            UserID:UserID,
            sid:sid            
        }       
        return await this.getApi('getPayClass',param);
    }
    async saveNums(UserID:number,sid:string,tid:number,GameID:number|string,nums:string,isSettled?:number,PLog?:ParamLog[]):Promise<IMsg>{
        const param:CommonParams={
            UserID:UserID,
            sid:sid,
            tid:tid,
            GameID:GameID,
            Nums:nums,
            isSettled:isSettled,                        
        }
        if(PLog){
            param.ParamLog=PLog;
        }
        return await this.getApi('SaveNums',param,'post');
        /*
        let ans;
        const url:string=this.ApiUrl+'/api/SaveNums';
        const config:AxiosRequestConfig = {
            params: {
                tid:tid,
                GameID:GameID,
                Nums:nums,
                isSettled:isSettled,
            }            
        }
        await axios.post(url,config).then((res:AxiosResponse)=>{
            ans=res;
        }).catch(err=>{
            ans=err;
        })
        return ans;
        */
    }
    /*
    async getOpParams(GameID:number|string){
        let msg:IMsg={ErrNo:0};
        const url:string=this.ApiUrl+'/api/getOpParams';
        const config:AxiosRequestConfig = {
            params: {
                GameID:GameID,
            }            
        }
        await axios.get(url,config).then((res:AxiosResponse)=>{
            //ans=res;
            if(res.data.ErrNo===0){
                msg.data=res.data.data;
            } else {
                msg = res.data;
            }
        }).catch(err=>{
            msg.debug=err
            msg.ErrNo=9;
            console.log('error',err);
        })
        return msg;        
    }
    */
    async SaveData(TableName:string,data:string){
        let msg:IMsg={ErrNo:0};
        const url:string=`${this.ApiUrl}/api/save/${TableName}`;
        const config:AxiosRequestConfig = {
            params: {
                data:data,
            }            
        } 
        await axios.post(url,config).then((res:AxiosResponse)=>{
            //ans=res;
            if(res.data.ErrNo===0){
                msg.data=res.data.data;
            } else {
                msg = res.data;
            }
        }).catch(err=>{
            msg.debug=err
            msg.ErrNo=9;
            console.log('error',err);
        })
        return msg;                
    }
    async getApi(appName:string,param:CommonParams|ITerms,method?:string):Promise<IMsg>{
        const url:string=`${this.ApiUrl}/api/${appName}`;
        let func:Promise<IMsg>;
        if(method==='post'){
            func=this.doPost(url,param);
        } else {
            func=this.doit(url,param);
        }
        return new Promise((resolve,reject)=>{
            func.then((msg:IMsg)=>{
                if(msg.ErrNo===7){
                    this.gotoLoginPage();
                }
                resolve(msg);
            }).catch(err=>{
                const msg:IMsg={
                    ErrNo:9,
                    error:err
                };
                reject(msg);
            })
        })
        /*
        if(method==='post'){
            return await this.doPost(url,param);
        } else {
            return await this.doit(url,param);
        }
        */
    }
    async setOdds(param:CommonParams,appName:string){
        const url:string=`${this.ApiUrl}/api/${appName}`;
        return await this.doit(url,param); 
    }
    doit(url:string,param:CommonParams|ITerms):Promise<IMsg>{
       const config:AxiosRequestConfig = {
           params: param
       };
       /*
        if(param){
            config.params=param
        }
        */
        let msg:IMsg={ErrNo:0};
        return new Promise((resolve,reject)=>{
            axios.get(url,config).then((res:AxiosResponse)=>{
                //console.log('AxApi doit res:',res);
                msg=res.data;
                resolve(msg);
            }).catch(err=>{
                msg.ErrNo=9;
                msg.error=err;
                reject(msg);
            })
        });
    }
    doPost(url:string,param:CommonParams|ITerms):Promise<IMsg>{
        //const config:AxiosRequestConfig = {}
        let msg:IMsg={ErrNo:0};
        return new Promise((resolve,reject)=>{
            axios.post(url,param).then((res:AxiosResponse)=>{
                msg=res.data;
                resolve(msg);
            }).catch(err=>{
                msg.ErrNo=9;
                msg.error=err;
                reject(msg);
            })
        });
    }
}
export default new AxApi(myApiUrl);