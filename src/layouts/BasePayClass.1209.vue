<template>
	<div>
		<div class="row q-pa-sm">
			<div class="col-1 text-h6">{{ $t('Label.GameName')}}</div>
    		<q-select square filled dense v-model="model" :options="options" style="width:200px"/>
            <q-btn color="blue" icon-right="save" label="Save" @click="SaveData();" />
		</div>
        <div class="q-pa-md" v-if="model">
            <div class="row testheader">
                <div class="col test">{{$t('Table.ItemName')}}</div>
                <div class="col test">{{$t('Table.SubName')}}</div>
                <div class="col test">{{$t('Table.Profit')}}</div>
                <div class="col test">{{$t('Table.RateDefault')}}</div>
                <div class="col test">{{$t('Table.PateTop')}}</div>
                <div class="col test">{{$t('Table.Probability')}}</div>
                <div class="col test">{{$t('Table.Steps')}}</div>
            </div>
            <baseRateRow 
            v-for="(itm,idx) in BasePayR"
            :key="idx"
            :itm="itm"
            v-on:input="test()" />
        </div>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import axios,{ AxiosRequestConfig, AxiosResponse } from 'axios';
import LayoutStoreModule from './data/LayoutStoreModule';
import {getModule} from 'vuex-module-decorators';
import {IGames} from './data/schema';
//import BTG from './data/defaultData';
import {SelectOptions,BasePayRateItm} from './data/if';
import BTG from './data/defaultData';
import { PayRateData } from './data/PayRateList';
import {BasePayRate} from './class/BasePayRate';
import BaseRateRow from './components/BaseRateRow.vue';
import {cloneDeep} from 'lodash';

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

@Component(
    {
        components: {
            BaseRateRow
        }
    }
)
export default class BetClass extends Vue{
    
	private store = getModule(LayoutStoreModule);
    private models:SelectOptions | null = null;
    public BasePayR:BasePayRate<BasePayRateItm>[]=[];
	options:SelectOptions[] = [
		{value: 0,label:'default'}
	]

	set model(v:SelectOptions){
        this.models = v;
        this.chkdata(v);
	}
	get model(){
        //console.log('get Model:', this.models);
		return this.models as SelectOptions;
	}
	get UserID():string{
		if(this.store.personal.id) {
			return this.store.personal.id + '';
		} 
		return '';
	}
	getGames(){
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
    }
    async chkdata(v:SelectOptions){
        // console.log('chkdata:', v);
        const gid:string = v.value as string;
        const btg=BTG[gid];
        const tmp:object=PayRateData[btg];
        this.BasePayR=await this.getBasePayRate(gid);
        if(this.BasePayR.length==0) {
            const me = this;
            Object.keys(tmp).map(key=>{
                const itm:BasePayRateItm[] = tmp[key];
                itm.map((p:BasePayRateItm,i:number)=>{
                    p.BetType=key;
                    p.SubType =i;
                    const bpr:BasePayRate<BasePayRateItm> = new BasePayRate(p); 
                    //if(p.BetType=='1') console.log('BT=1:',bpr);
                    me.BasePayR.push(bpr);
                })
                //console.log(tmp[key]);
            })
           // console.log('BasePayR:',this.BasePayR);
        }
    }
    async getBasePayRate(gid:string|number){
        const url:string=this.store.ax.Host+'/api/getBasePayRate';
		const config:AxiosRequestConfig = {
            params: {
                GameID: gid
            }
        }
        let data;
        await axios.get(url,config).then((res:AxiosResponse)=>{
            //console.log('await ',res)
            data= res.data;
        }).catch(err=>{
            //console.log('getBasePayRate error',err);
            data= false;
        })
        //console.log('await 1',data);
        return data;
    }
    SaveData(){
        //console.log('SaveData',this.BasePayR)
        this.BasePayR.map(itm=>{
            if(itm.DataChanged) {
                //console.log(itm);
            }
        })
    }
    test(){
        //console.log('child input!!',v);
        this.BasePayR=cloneDeep(this.BasePayR);
    }
  mounted(){
        this.getGames();
        this.BasePayR=[];
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