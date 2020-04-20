<template>
	<div>
		<div class="row q-pa-sm">
            <div class="col-2"><GS :store="store" @setGames="setCurGames"></GS></div>
            <div class="pcls">
                <div class="row" v-if="curGameID">
                    <div><q-select square filled dense v-model="ClassName" :options="clsNameList" style="width:200px" transition-show='fade'/></div>
                    <div class="pbtn2"><q-btn color="green" icon-right="save" label="Save" @click="SaveData();" /></div>
    		    </div>
            </div>
            <div class="col" v-if="curGameID" ><BTC :store="store" :GameID="curGameID" @SltBT="SltBetTypes"></BTC></div>
		</div>
        <RCO @updateRateDefault="updateRateDefault"></RCO>       
        <div class="q-pa-md" v-if="curGameID">
            <div class="row">
                <div class="col-1 test testheader">{{$t('Table.ItemName')}}</div>
                <div class="col-1 test testheader">{{$t('Table.SubName')}}</div>
                <div class="col-1 test testheader">{{$t('Table.Profit')}}(%)</div>
                <div class="col-1 test testheader">{{$t('Table.RateDefault')}}</div>
                <div class="col-1 test testheader">{{$t('Table.Probability')}}</div>
                <div class="col-1 test testheader">{{$t('Table.Steps')}}</div>
                <div class="col-1 test testheader">{{$t('Table.OneHand')}}</div>
            </div>
            <div class="row"
                v-for="(itm,idx) in PayR"
                :key="idx"
            >
                <div :class="{'col-1':true,test:true,bgc:itm.Selected}">{{ itm.Title }}</div>
                <div :class="{'col-1':true,test:true,bgc:itm.Selected}">{{ itm.SubTitle }}</div>
                <div class="col-1 test">{{ itm.Profit }}</div>
                <div class="col-1 test"><q-input square standout dense v-model="itm.Rate" /></div>
                <div class="col-1 test">{{itm.Probability}}</div>
                <div class="col-1 test">{{itm.Steps}}</div>
                <div class="col-1 test">{{itm.OneHand}}</div>
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
import {SelectOptions,PayRateItm,IMsg,PayClass} from './data/if';
import BTG from './data/defaultData';
import {PayRateData } from './data/PayRateList';
import {PayRate} from './class/PayRate'
import { cloneDeep } from 'lodash'
//import { QDialogOptions } from 'quasar';
import GameSelector from './components/GameSelector.vue';
import BetTypeClass from './components/BetTypeClass.vue';
import RateChangeOption from './components/RateChangeOption.vue';
Vue.component('GS',GameSelector);
Vue.component('BTC',BetTypeClass);
Vue.component('RCO',RateChangeOption);

interface PostData {
    GameID:number;
    PayClassName:string;
    ModifyID:string;
    id?:number;
}
@Component
export default class BetClass extends Vue{
	private store = getModule(LayoutStoreModule);
    private curGameID:number|null=null
    private clsName:SelectOptions | null = null;
    public PayR:PayRate[]=[];
	options:SelectOptions[] = [
		{value: 0,label:'default'}
	];
    clsNameList:SelectOptions[]= [];
    ExpendPayClass:boolean = false;
    opPayRate:string | null=null;
    get ClassName() {
        return this.clsName as SelectOptions;
    }
    set ClassName(v:SelectOptions){
        this.clsName = v;
        //console.log('ClassName:',v.value,v.label);
        //this.PayClassName = v.label as string;
        this.chkdata(v.value as number);
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
    setCurGames(v:SelectOptions){
        this.curGameID = v.value as number;
        this.chkPayCls(this.curGameID);
        //console.log('doGames',v);
    }
    SltBetTypes(slt:string){
        const bts:string[] = slt.split(':');
        this.PayR.map(itm=>{
            itm.Selected = false;
        })
        bts.map(bt=>{
            const  f=this.PayR.find(bpr=>bpr.BetType===parseInt(bt,10));
            if(f){
                f.Selected = true;
            }
        })
        //console.log('SltBetTypes',bts);
    }
    updateRateDefault(v:number){
        if(v>0){
            this.PayR.map(itm=>{
                if(itm.Selected){
                    itm.updateDefaultRateByProfit(v);
                }
            })
        }
    }    
    async chkPayCls(gid:number){
        const data:PayClass[] = await this.getPayCls(gid);
        this.clsNameList=[];
        if(data.length>0){
            let firstItem:SelectOptions|undefined;
            data.map((itm:PayClass)=>{
                const tmp:SelectOptions={
                    value: itm.id,
                    label: itm.PayClassName
                }
                this.clsNameList.push(tmp);
                if(!firstItem) firstItem=tmp;
            });
            if(firstItem) this.ClassName = firstItem;
        }
    }
    async getPayCls(gid:string|number) {
        let data:PayClass[] = [];
        const ans:IMsg=await this.store.ax.getPayClass(gid);
        if(ans.ErrNo==0){
            data=ans.data as PayClass[];
        }
        return data;
    }
    async chkdata(v:number){
        //console.log('chkdata:', v);
        this.PayR=[];
        //const gid:string = this.models.value as string;
        if(!this.curGameID) return;
        const btg=BTG[this.curGameID];
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
        itms=await this.getPayRate(this.curGameID,v);
        //console.log('getPayRate itms:',itms);
        if(itms.length>0){
            itms.map(itm=>{
                const e = this.PayR.find(elm => elm.BetType == itm.BetType && elm.SubType == itm.SubType)
                if(e){
                    e.Datas= itm
                }
            })
            this.PayR=cloneDeep(this.PayR);
            //this.updateBPR(1);
        }

    }
    async getPayRate(gid:string|number,v:number){
        const url:string=this.store.ax.Host+'/api/getPayRate';
		const config:AxiosRequestConfig = {
            params: {
                GameID: gid,
                PayClassID: v
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
        if(!this.curGameID) return;
 		const data = {
			GameID: this.curGameID,
            ModifyID: this.UserID,
            PayClassID: this.ClassName.value,
            data: JSON.stringify(dtas)
		}
		const url:string=this.store.ax.Host+'/api/batch/savePayRate';
		axios.post(url,data).then((res:AxiosResponse)=>{
            //console.log(res.data);
            if(res.data.affectedRows>0){
                this.$q.dialog({
                    title: this.$t('Label.Save') as string,
                    message: 'OK!!'
                });
            }
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
    /*
    updateBPR(idx:number|undefined=undefined){
        if(idx){
            this.PayR=cloneDeep(this.PayR);
        }
    }
    */
  mounted(){
        if(!this.store.isLogin){
        this.$router.push({path:'/login'});
        }         
        this.PayR=[];
  }
}
</script>
<style>
.pcls {
    padding: 4px 4px;
}
.pbtn2 {
    padding: 2px 4px;
}
.testheader {
    background-color: cadetblue;
    color:white;
}
.test {
    border: 1px gray solid;
    text-align: center;
    vertical-align: middle;
}
.bgc {
    background-color:lightseagreen;
    color:white;
}
</style>