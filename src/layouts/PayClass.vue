<template>
	<div>
		<div class="row q-pa-sm">
			<div class="col-1 text-h6">{{ $t('Label.GameName')}}</div>
    		<div><q-select square filled dense v-model="model" :options="options" style="width:200px"/></div>
		</div>       
        <div class="row q-pa-md" v-if="model">
            <div>{{ $t('Label.PayClassName') }}</div>
            <div><q-select square filled dense v-model="ClassName" :options="clsNameList" style="width:200px" transition-show='fade'/></div>
            <div><q-btn color="green" icon-right="save" label="Save" @click="SaveData();" /></div>
		</div>  
        <div class="q-pa-md" v-if="model">
            <div class="row testheader">
                <div class="col test">{{$t('Table.ItemName')}}</div>
                <div class="col test">{{$t('Table.SubName')}}</div>
                <div class="col test">{{$t('Table.Profit')}}(%)</div>
                <div class="col test">{{$t('Table.RateDefault')}}</div>
                <div class="col test">{{$t('Table.Probability')}}</div>
                <div class="col test">{{$t('Table.Steps')}}</div>
                <div class="col test">{{$t('Table.OneHand')}}</div>
            </div>
            <div class="row"
                v-for="(itm,idx) in PayR"
                :key="idx"
            >
                <div class="col test">{{ itm.Title }}</div>
                <div class="col test">{{ itm.SubTitle }}</div>
                <div class="col test">{{ itm.Profit }}</div>
                <div class="col test"><q-input square standout dense v-model="itm.Rate" @change="updateBPR(idx)" /></div>
                <div class="col test">{{itm.Probability}}</div>
                <div class="col test">{{itm.Steps}}</div>
                <div class="col test">{{itm.OneHand}}</div>
            </div>
        </div>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import axios,{ AxiosRequestConfig, AxiosResponse } from 'axios';
import LayoutStoreModule from './data/LayoutStoreModule';
import {getModule} from 'vuex-module-decorators';
//import {IGames} from './data/schema';
//import BTG from './data/defaultData';
import {SelectOptions,PayRateItm} from './data/if';
import BTG from './data/defaultData';
import {PayRateData } from './data/PayRateList';
import {PayRate} from './class/PayRate'
import { cloneDeep } from 'lodash'
interface PayClass {
    id:number;
    PayClassName:string;
}
interface PostData {
    GameID:number;
    PayClassName:string;
    ModifyID:string;
    id?:number;
}
@Component
export default class BetClass extends Vue{
	private store = getModule(LayoutStoreModule);
    private models:SelectOptions | null = null;
    private clsName:SelectOptions | null = null;
    public PayR:PayRate[]=[];
	options:SelectOptions[] = [
		{value: 0,label:'default'}
	];
    clsNameList:SelectOptions[]= [];
    ExpendPayClass:boolean = false;
    opPayRate:string | null=null;
	set model(v:SelectOptions){
        this.models = v;
        this.chkPayCls(v);
    }
	get model(){
        //console.log('get Model:', this.models);
		return this.models as SelectOptions;
    }
    get ClassName() {
        return this.clsName as SelectOptions;
    }
    set ClassName(v:SelectOptions){
        this.clsName = v;
        //this.PayClassName = v.label as string;
        this.chkdata();
    }
	get UserID():string{
		if(this.store.personal.id) {
			return this.store.personal.id + '';
		} 
		return '';
    }
    expendPR(){
        if( this.ExpendPayClass){
            this.ExpendPayClass = false;
        } else {
            this.ExpendPayClass = true;
        }
    }
	async getGames(){
        const ans =await this.store.ax.getGames();
        if(ans){
            this.options = ans;
        }
        /*
		const url:string=this.store.ax.Host+'/api/getGames';
		const config:AxiosRequestConfig = {
		}
		axios.get(url,config).then((res:AxiosResponse)=>{
			//console.log(res.data);
			const tmp:SelectOptions[]=[];
			res.data.map((itm:IGames)=>{
				const t:SelectOptions={
					label: itm.name,
					value: itm.id
				}
				tmp.push(t);
			})
			if(tmp.length > 0) this.options = tmp;
        })
        */
    }
    async chkPayCls(v:SelectOptions){
        const gid:string = v.value as string;
        const data:PayClass[] = await this.getPayCls(gid);
        this.clsNameList=[];
        if(data.length>0){
            data.map((itm:PayClass)=>{
                const tmp:SelectOptions={
                    value: itm.id,
                    label: itm.PayClassName
                }
                this.clsNameList.push(tmp);
            });
        }
    }
    async getPayCls(gid:string|number) {
        const url:string=this.store.ax.Host+'/api/getPayClass';
		const config:AxiosRequestConfig = {
            params: {
                GameID: gid
            }
        }
        let data:PayClass[] = [];
        await axios.get(url,config).then((res:AxiosResponse)=>{
            //console.log('await ',res)
            data= res.data;
        }).catch(err=>{
            console.error('getPayRate error',err);
            //data= false;
        })
        //console.log('await 1',data);
        return data;
    }
    async chkdata(){
        //console.log('chkdata:', v);
        this.PayR=[];
        const gid:string = this.model.value as string;
        const btg=BTG[gid];
        const tmp:object=PayRateData[btg].data;
        const order:string[]=PayRateData[btg].order;
        let itms:PayRateItm[];
        //console.log('tmp',tmp);
        order.map(key=>{
            let itm:PayRateItm[] = tmp[key];
            //if(key=='1') console.log('itm',itm);
            itm.map((p:PayRateItm,i:number)=>{
                p.BetType=parseInt(key,10);
                p.SubType =i;
                //if(!p.Rate) p.Rate=0;
                //if(p.BetType=='1') console.log('bb:',p);
                this.PayR.push(new PayRate(p));
            })
        });
        //console.log('BasePayR:',this.BasePayR)
        itms=await this.getPayRate(gid);
        //console.log('getPayRate itms:',itms);
        if(itms.length>0){
            itms.map(itm=>{
                const e = this.PayR.find(elm => elm.BetType == itm.BetType && elm.SubType == itm.SubType)
                if(e){
                    e.Datas= itm
                }
            })
            //this.PayR=cloneDeep(this.PayR);
            this.updateBPR(1);
        }

    }
    async getPayRate(gid:string|number){
        const url:string=this.store.ax.Host+'/api/getPayRate';
		const config:AxiosRequestConfig = {
            params: {
                GameID: gid,
                PayClassID: this.ClassName.value as string
            }
        }
        let data;
        await axios.get(url,config).then((res:AxiosResponse)=>{
            //console.log('await ',res)
            data= res.data;
        }).catch(err=>{
            console.error('getPayRate error',err);
            data= false;
        })
        //console.log('await 1',data);
        return data;
    }
    SaveData(){
        const dtas:PayRateItm[] = [];
        this.PayR.map(itm=>{
            if(itm.DataChanged) {
                dtas.push(itm.Datas);
            }
        })
        if(dtas.length>0){
            this.sendData(dtas);
        }
    }
    sendData(dtas:PayRateItm[]){
        if(!this.model) return;
 		const data = {
			GameID: this.model.value,
            ModifyID: this.UserID,
            PayClassID: this.ClassName.value,
            data: JSON.stringify(dtas)
		}
		const url:string=this.store.ax.Host+'/api/batch/savePayRate';
		axios.post(url,data).then((res:AxiosResponse)=>{
            console.log(res.data);
            dtas.map(itm=>{
                const tmp = this.PayR.find(elm => elm.BetType == itm.BetType && elm.SubType == itm.SubType)
                if(tmp){
                    tmp.DataChanged = false;
                }
            })
		}).catch(err=>{
			console.error(err);
		})       
    }
    updateBPR(idx:number|undefined=undefined){
        /*
        if(idx){
            //console.log('updateBPR',this.PayR[idx]);
        }
        */
        if(idx){
            this.PayR=cloneDeep(this.PayR);
        }
    }
  mounted(){
        if(!this.store.isLogin){
        this.$router.push({path:'/login'});
        }         
        this.getGames();
        this.PayR=[];
  }
}
</script>
<style>
.testheader {
    background-color: cadetblue;
    color:white;
}
.test {
    border: 1px gray solid;
    text-align: center;
    vertical-align: center;
}
</style>