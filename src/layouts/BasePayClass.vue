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
                <div class="col test">{{$t('Table.Profit')}}(%)</div>
                <div class="col test">{{$t('Table.RateDefault')}}</div>
                <div class="col test">{{$t('Table.PateTop')}}</div>
                <div class="col test">{{$t('Table.Probability')}}</div>
                <div class="col test">{{$t('Table.Steps')}}</div>
                <div class="col test">{{$t('Table.TopPay')}}</div>
                <div class="col test">{{$t('Table.OneHand')}}</div>
                <div class="col test">{{$t('Table.PlusRate')}}</div>
            </div>
            <div class="row"
                v-for="(itm,idx) in BasePayR"
                :key="idx"
            >
                <div class="col test">{{ itm.Title }}</div>
                <div class="col test">{{ itm.SubTitle }}</div>
                <div class="col test">{{ itm.Profit }}</div>
                <div class="col test"><q-input outlined dense v-model="itm.DfRate" @change="updateBPR()" /></div>
                <div class="col test"><q-input outlined dense v-model="itm.TopRate" @change="updateBPR()" /></div>
                <div class="col test"><q-input outlined dense v-model="itm.Probability" @change="updateBPR()" /></div>
                <div class="col test"><q-input outlined dense v-model="itm.Steps" @change="updateBPR()" /></div>
                <div class="col test"><q-input outlined dense v-model="itm.TopPay" @change="updateBPR()" /></div>
                <div class="col test"><q-input outlined dense v-model="itm.OneHand" @change="updateBPR()" /></div>
                <div class="col test"><q-input outlined dense v-model="itm.PlusRate" @change="updateBPR()" /></div>
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
import {IGames} from './data/schema';
//import BTG from './data/defaultData';
import {SelectOptions,BasePayRateItm} from './data/if';
import BTG from './data/defaultData';
import {PayRateData } from './data/PayRateList';
import {BasePayRate} from './class/BasePayRate'
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
        const tmp:object=PayRateData[btg].data;
        const order:string[]=PayRateData[btg].order;
        let itms:BasePayRateItm[];
        //console.log('tmp',tmp);
        order.map(key=>{
            let itm:BasePayRateItm[] = tmp[key];
            //if(key=='1') console.log('itm',itm);
            itm.map((p:BasePayRateItm,i:number)=>{
                p.BetType=key;
                p.SubType =i;
                //if(p.BetType=='1') console.log('bb:',p);
                this.BasePayR.push(new BasePayRate<BasePayRateItm>(p));
            })
        });
        //console.log('BasePayR:',this.BasePayR)
        itms=await this.getBasePayRate(gid);
        //console.log('getBasePayRate itms:',itms);
        if(itms.length>0){
            itms.map(itm=>{
                const e = this.BasePayR.find(elm => elm.BetType == itm.BetType && elm.SubType == itm.SubType)
                if(e){
                    e.Datas= itm
                }
            })
            this.BasePayR=cloneDeep(this.BasePayR);
        }
        //console.log('PayRateData',tmp);
        // console.log('BasePayR before if:', this.BasePayR, this.BasePayR.length);
        //if(this.BasePayR.length==0) return;

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
            data= err;
        })
        //console.log('await 1',data);
        return data;
    }
    SaveData(){
        const dtas:BasePayRateItm[] = [];
        this.BasePayR.map(itm=>{
            if(itm.DataChanged) {
                dtas.push(itm.Datas);
            }
        })
        if(dtas.length>0){
            this.sendData(dtas);
        }
    }
    sendData(dtas:BasePayRateItm[]){
        if(!this.model) return;
 		const data = {
			GameID: this.model.value,
            ModifyID: this.UserID,
            data: JSON.stringify(dtas)
		}
        const url:string=this.store.ax.Host+'/api/batch/saveBasePayRate';
		axios.post(url,data).then((res:AxiosResponse)=>{
            console.log(res.data);
            dtas.map(itm=>{
                const tmp = this.BasePayR.find(elm => elm.BetType == itm.BetType && elm.SubType == itm.SubType)
                if(tmp){
                    tmp.DataChanged = false;
                }
            })
		}).catch(err=>{
			console.log(err);
		})       
    }
    updateBPR(){
        this.BasePayR=cloneDeep(this.BasePayR);
    }
  mounted(){
        if(!this.store.isLogin){
        this.$router.push({path:'/login'});
        }      
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