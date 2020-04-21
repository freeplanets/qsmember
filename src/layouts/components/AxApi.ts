import axios,{AxiosRequestConfig,AxiosResponse} from 'axios'
import { SelectOptions,CBetItems,IMsg,CommonParams,IbtCls} from '../data/if';
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
    constructor(private ApiUrl){
        console.log('AxApi created!!',ApiUrl);
    }
    get Host(){
        return this.ApiUrl;
    }
	async getGames():Promise<SelectOptions[] | undefined>{
        const ans=await this.getApi('getGames');
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
    async getBtClass(gid:number|string):Promise<IbtCls[] | undefined>{
		//const url:string=this.store.ax.Host+'/api/getBtClass';
		//const models:SelectOptions = this.models as SelectOptions;
		const param:CommonParams={
            GameID:gid
        }
        const ans=await this.getApi('getBtClass',param);
        if(ans.ErrNo===0){
            return ans.data as IbtCls[];
        } else {
            return;
        }
    }    
    async saveTerms(dtas:ITerms){
        //const url:string=this.ApiUrl+'/api/saveTerms';
        //console.log('saveTerms',dtas);
        return await this.getApi('saveTerms',dtas,'post');
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
    async getGameList(){
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
    }
    async saveGame(dta:Game){
        let ans;
        const url:string=this.ApiUrl+'/api/UpdateGame';
        await axios.post(url,dta).then((res:AxiosResponse)=>{
            //console.log(res.data);
            ans = res.data;
        }).catch(err=>{
            //console.log(err);
            ans = err;
        })           
        return ans;
    }

    async getTerms(GameID:number|string){
        const url:string=this.ApiUrl+'/api/getTerms';
        const config:AxiosRequestConfig = {
            params: {
                GameID:GameID
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
    }
    async saveUser(user:IUser){
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
    }
    async getUsers(f?:CommonParams){
        let ans:IMsg;
        ans = await this.getApi('getUsers',f);
        if(ans.ErrNo==0){
            return ans.data;
        }
        return false;
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
    async getPayClass(GameID?:number|string){
        return await this.getApi('getPayClass');
    }
    async saveNums(tid:number,GameID:number|string,nums:string){
        let ans;
        const url:string=this.ApiUrl+'/api/SaveNums';
        const config:AxiosRequestConfig = {
            params: {
                tid:tid,
                GameID:GameID,
                Nums:nums
            }            
        }
        await axios.post(url,config).then((res:AxiosResponse)=>{
            ans=res;
        }).catch(err=>{
            ans=err;
        })
        return ans;
    }
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
    async getApi(appName:string,param?:CommonParams|ITerms,method?:string):Promise<IMsg>{
        const url:string=`${this.ApiUrl}/api/${appName}`;
        if(method==='post'){
            return await this.doPost(url,param);
        } else {
            return await this.doit(url,param);
        }
    }
    async setOdds(param:CommonParams,appName:string){
        const url:string=`${this.ApiUrl}/api/${appName}`;
        return await this.doit(url,param); 
    }
    doit(url:string,param?:CommonParams):Promise<IMsg>{
       const config:AxiosRequestConfig = {};
        if(param){
            config.params=param
        }
        let msg:IMsg={ErrNo:0};
        return new Promise(async(resolve)=>{
            await axios.get(url,config).then((res:AxiosResponse)=>{
                //console.log('AxApi doit res:',res);
                msg=res.data;
            }).catch(err=>{
                msg.ErrNo=9;
                msg.error=err;
            })
            resolve(msg);
        });
    }
    doPost(url:string,param?:CommonParams):Promise<IMsg>{
        //const config:AxiosRequestConfig = {}
        if(!param){
            //config.params=param
            param={};
        }
        let msg:IMsg={ErrNo:0};
        return new Promise(async(resolve)=>{
            await axios.post(url,param).then((res:AxiosResponse)=>{
                msg=res.data;
            }).catch(err=>{
                msg.ErrNo=9;
                msg.error=err;
            })
            resolve(msg);
        });
    }
}
export default new AxApi(myApiUrl);