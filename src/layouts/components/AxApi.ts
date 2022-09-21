import VueRouter from 'vue-router';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken';
import { PfKey } from 'src/components/if/dbif';
import { ErrCode } from 'src/components/if/ENum';
import { SelectOptions, CBetItems, Msg, CommonParams, IbtCls, ParamLog, WebParams, HasID, AnyObject } from '../data/if';
import { Terms, Game, User } from '../data/schema';

let myApiUrl = 'https://testu.uuss.net:3000';

if (window.location.hostname === 'localhost') {
    myApiUrl = 'http://localhost:3000';
}
/*
const config:AxiosRequestConfig = {
    // withCredentials: true,
    // headers: { 'Access-Control-Allow-Origin': '*' }
};
*/
interface authinfo extends AnyObject {
    iat: number;
    exp: number;
}

export class AxApi {
    private router: VueRouter | undefined;
    private auth = '';
    private authkey = '';
    private authlimit = 0;
    private authgap = 600; // before auth expire. (sec)
    private info: authinfo = { iat: 0, exp: 0 };
    private defaultParam:AnyObject = {};
    constructor(private ApiUrl:string) {
        console.log('AxApi created!!', ApiUrl);
    }
    get Host() {
        return this.ApiUrl;
    }
    setRouter(v:VueRouter) {
        this.router = v;
    }
    get Info() {
        return this.info;
    }
    get Auth() {
        return this.auth;
    }
    setParam(o:AnyObject) {
        this.defaultParam = o;
    }
    gotoLoginPage() {
        if (this.router) {
            this.router.push({ path: '/' });
        }
    }
	async getGames(showall = false, order = false):Promise<SelectOptions[] | undefined> {
        const params = {
            // UserID,
            // sid,
            showall: showall ? 1 : 0,
            order: order ? 1 : 0,
        };
        let rlt:SelectOptions[] | undefined;
        const ans = await this.getApi('getGames', params);
        // const tmp:SelectOptions[] = [];
        // console.log('getGames:',ans);
        if (ans.ErrNo === 0) {
            const dta:any = ans.data;
            // console.log('getGames ans.data:',dta);
            rlt = dta.map((itm:HasID) => {
                const t:SelectOptions = {
                    label: itm.name,
                    value: itm.id,
                    GType: itm.GType,
                    OpenNums: itm.OpenNums,
                };
                // tmp.push(t);
                return t;
            });
            // return tmp;
        }
        return rlt;
    }
    async getTermIDByGameID(UserID:number, sid:string, GameID:number):Promise<SelectOptions[] | undefined> {
        const params:CommonParams = {
            GameID,
            UserID,
            sid,
        };
        let rlt:SelectOptions[] | undefined;
        const ans = await this.getApi('getTermIDByGameID', params);
        if (ans.ErrNo === 0) {
            const dta:any = ans.data;
            rlt = dta.map((itm:HasID) => {
                const t:SelectOptions = {
                    label: itm.TermID,
                    value: itm.id,
                };
                // tmp.push(t);
                return t;
            });
            // return tmp;
        }
        return rlt;
    }
    async getBtClass(UserID:number, sid:string, GameID:number|string):Promise<IbtCls[] | undefined> {
		const param:CommonParams = {
            GameID,
            UserID,
            sid,
        };
        let rlt:IbtCls[] | undefined;
        const ans = await this.getApi('getBtClass', param);
        if (ans.ErrNo === 0) {
            rlt = ans.data as IbtCls[];
        }
        return rlt;
    }
    saveTerms(UserID:number, sid:string, dtas:Terms, PL?:ParamLog[]) {
        let param:CommonParams = {
            UserID,
            sid,
        };
        param = Object.assign(param, dtas);
        if (PL) {
            param.ParamLog = PL;
        }
        // const url:string=this.ApiUrl+'/api/saveTerms';
        // console.log('saveTerms',dtas);
        return this.getApi('saveTerms', param, 'post');
    }
    async createBetItems(dtas:CBetItems) {
        let ans;
        const url = `${this.ApiUrl}/api/createBetItems`;
        await axios.post(url, dtas).then((res:AxiosResponse) => {
            // console.log(res.data);
            ans = res.data;
        }).catch((err) => {
            // console.log(err);
            ans = err;
        });
        return ans;
    }
    async getGameList(UserID:number, sid:string):Promise<Game[]|undefined> {
		const param:CommonParams = {
            UserID,
            sid,
        };
        return new Promise((resolve, reject) => {
            this.getApi('GameList', param).then((msg:Msg) => {
                resolve(msg.data as Game[]);
            }).catch((err) => {
                reject(err);
            });
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
    saveGame(UserID:number, sid:string, dta:Game):Promise<Msg> {
        const param:CommonParams = {
            UserID,
            sid,
        };
        Object.keys(dta).map((key) => {
            param[key] = dta[key];
        });
        // const url:string=this.ApiUrl+'/api/UpdateGame';
        return this.getApi('UpdateGame', param, 'post');
    }
    getTerms(UserID:number, sid:string, GameID:number|string, sdate?:string):Promise<Msg> {
        const param:CommonParams = {
            UserID,
            sid,
            GameID,
            SDate: sdate,
        };
        return this.getApi('getTerms', param);
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
    saveUser(UserID:number, sid:string, user:User):Promise<Msg> {
        const param:CommonParams = {
            UserID,
            sid,
        };
        Object.keys(user).map((key) => {
            param[key] = user[key];
        });
        return this.getApi('SaveUser', param, 'post');
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
    getUsers(f:CommonParams):Promise<Msg> {
        return this.getApi('getUsers', f);
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
    getPfList() {
        const param = { ...this.defaultParam } as WebParams;
        param.TableName = 'ClientKey';
        return this.getApi('cc/GetData', param);
    }
    savePf(data:PfKey) {
        const param = { ...this.defaultParam } as WebParams;
        param.TableName = 'ClientKey';
        param.TableData = data;
        return this.getApi('cc/SaveData', param);
    }
    getPayClass(UserID:number, sid:string, GameID?:number|string):Promise<Msg> {
        const param:CommonParams = {
            GameID,
            UserID,
            sid,
        };
        return this.getApi('getPayClass', param);
    }
    saveNums(UserID:number, sid:string, tid:number, GameID:number|string, nums:string, isSettled?:number, PLog?:ParamLog[]):Promise<Msg> {
        const param:CommonParams = {
            UserID,
            sid,
            tid,
            GameID,
            Nums: nums,
            isSettled,
        };
        if (PLog) {
            param.ParamLog = PLog;
        }
        return this.getApi('SaveNums', param, 'post');
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
        let msg:Msg={ErrNo:0};
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
    async SaveData(TableName:string, data:string) {
        // let msg:Msg = { ErrNo: 0 };
        const url = `save/${TableName}`;
        return this.getApi(url, { data }, 'post');
        /*
        const url = `${this.ApiUrl}/api/save/${TableName}`;
        const config:AxiosRequestConfig = {
            params: {
                data,
            },
        };
        // config.params = { data };
        await axios.post(url, config).then((res:AxiosResponse) => {
            // ans=res;
            if (res.data.ErrNo === 0) {
                msg.data = res.data.data;
            } else {
                msg = res.data;
            }
        }).catch((err) => {
            msg.debug = err;
            msg.ErrNo = 9;
            console.log('error', err);
        });
        return msg;
        */
    }
    async getApi(appName:string, param:CommonParams|Terms|WebParams|AnyObject, method = 'get'):Promise<Msg> {
        const url = `${this.ApiUrl}/api/${appName}`;
        const config:AxiosRequestConfig = {
            params: param,
        };
        if (this.auth) {
            config.headers = {
                Authorization: this.auth,
            };
            const { iat, exp } = this.Info;
            if ((exp - iat) <= (this.authlimit - this.authgap)) {
                config.headers.AuthKey = this.authkey;
            }
            // config.headers['Access-Control-Expose-Headers'] = 'Authorization';
        }
        let func:Promise<AnyObject>;
        // console.log('getApi param:', config);
        if (method === 'post') {
            func = this.doPost(url, config);
        } else {
            func = this.doit(url, config);
        }
        return new Promise((resolve, reject) => {
            func.then((res:AnyObject) => {
                let msg:Msg = { ErrNo: ErrCode.NOT_DEFINED_ERR };
                if (res.data) msg = res.data;
                // console.log('AxApi login check:', msg);
                if (msg.ErrNo === ErrCode.NO_LOGIN) {
                    this.gotoLoginPage();
                }
                if (res.headers.authorization) {
                    // console.log('show headers:', res.headers);
                    this.auth = res.headers.authorization;
                    if (res.headers.authkey) {
                        this.authkey = res.headers.authkey;
                        this.authlimit = res.headers.authlimit;
                    }
                    const ans = jwt.decode(this.auth);
                    if (ans && typeof ans === 'object') this.info = ans as authinfo;
                }
                resolve(msg);
            }).catch((err) => {
                const msg:Msg = {
                    ErrNo: 9,
                    error: err,
                };
                reject(msg);
            });
        });
        /*
        if(method==='post'){
            return await this.doPost(url,param);
        } else {
            return await this.doit(url,param);
        }
        */
    }
    async setOdds(param:CommonParams, appName:string) {
        const url = `${this.ApiUrl}/api/${appName}`;
        return this.doit(url, param);
    }
    doit(url:string, config: AxiosRequestConfig):Promise<Msg> {
        // console.log('doit config', config);
        let msg:Msg = { ErrNo: 0 };
        return new Promise((resolve, reject) => {
            axios.get(url, config).then((res:AxiosResponse) => {
                msg = res;
                resolve(msg);
            }).catch((err) => {
                msg.ErrNo = ErrCode.APISERVER_GONE_AWAY;
                msg.error = err;
                reject(msg);
            });
        });
    }
    doPost(url:string, config:AxiosRequestConfig):Promise<Msg> {
        // const config:AxiosRequestConfig = {}
        // console.log('doPost',url,param);
        let msg:Msg = { ErrNo: 0 };
        return new Promise((resolve, reject) => {
            axios.post(url, config.params, { headers: config.headers }).then((res:AxiosResponse) => {
                // console.log('AxApi doPost res:', res);
                msg = res;
                resolve(msg);
            }).catch((err) => {
                msg.ErrNo = ErrCode.APISERVER_GONE_AWAY;
                msg.error = err;
                reject(msg);
            });
        });
    }
}
export default new AxApi(myApiUrl);
