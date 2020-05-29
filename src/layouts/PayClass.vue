<template>
	<div>
		<div class="row q-pa-sm">
            <div class="col-2"><GS :store="store" @setGames="setCurGames"></GS></div>
            <div class="pcls">
                <div class="row" v-if="curGameID">
                    <div class='pbtn'><PCS :ax="store.ax" :GameID='curGameID' :itmChange="PNChange" @setPayClass="setPayClass"></PCS></div>
                    <div class="pbtn"><q-input outlined dense v-model="PayClassName" /></div>
                    <div class="pbtn2"><q-btn color="green" icon-right="save" :label="$t('Label.EditPayClassName')" @click="EditPayClassName();" /></div>
                    <div class="pbtn2"><q-btn color="red" icon-right="delete_forever" :label="$t('Label.DeletePayClass')" @click="DelPayClass();" /></div>
    		    </div>
            </div>
            <div v-if="curGameID" ><BTC :store="store" :GameID="curGameID" :pinfo='store.personal' @SltBT="SltBetTypes"></BTC></div>
            <div class="pbtn3"><q-btn color="green" icon-right="save" label="Save" @click="SaveData();" /></div>
		</div>
        <div class="row">
            <RCO @updateRateDefault="updateRateDefault"></RCO>
        </div> 
        <div class="q-pa-md" v-if="curGameID">
            <div class="row testheader">
                <div class="col-1 test">{{$t('Table.ItemName')}}</div>
                <div class="col-1 test">{{$t('Table.SubName')}}</div>
                <div class="col-1 test">{{$t('Table.Profit')}}(%)</div>
                <div class="col-1 test">{{$t('Table.RateDefault')}}</div>
            </div>
            <div class="row"
                v-for="(itm,idx) in PayR"
                :key="idx"
            >
                <div :class="{'col-1':true,test:true,bgc:itm.Selected}" @click="itm.Selected=!itm.Selected">{{ itm.Title }}</div>
                <div :class="{'col-1':true,test:true,bgc:itm.Selected}">{{ itm.SubTitle }}</div>
                <div :class="{'col-1 test':true,redColor: itm.Profit<0 }">{{ itm.Profit }}</div>
                <div class="col-1 test"><q-input square standout dense v-model="itm.Rate" /></div>
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
import {SelectOptions,PayRateItm,IMsg,PayClass, CommonParams} from './data/if';
import BTG from './data/defaultData';
import {PayRateData } from './data/PayRateList';
import {PayRate} from './class/PayRate'
import { cloneDeep } from 'lodash'
//import { QDialogOptions } from 'quasar';
import GameSelector from './components/GameSelector.vue';
import BetTypeClass from './components/BetTypeClass.vue';
import RateChangeOption from './components/RateChangeOption.vue';
import PayClassSelector from './components/PayClassSelector.vue';
Vue.component('PCS',PayClassSelector);
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
    private curGameID:number|undefined=0;
    private clsName:SelectOptions | null = null;
    private PayClassName:string='';
    private curPayClass:PayClass={id:0,PayClassName:''};
    public PayR:PayRate[]=[];
    private PNChange:boolean=false;
	options:SelectOptions[] = [
		{value: 0,label:'default'}
	];
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
        //console.log('doGames',v);
    }
    SltBetTypes(slt:string){
        const bts:string[] = slt.split(':');
        this.PayR.map(itm=>{
            itm.Selected = false;
        })
        this.PayR.map(itm=>{
            const f = bts.find(bt=>parseInt(bt,10)===itm.BetType);
            if(f){
                itm.Selected = true;
            }
        })
        /*
        bts.map(bt=>{
            const  f=this.PayR.find(bpr=>bpr.BetType===parseInt(bt,10));
            if(f){
                f.Selected = true;
            }
        })
        */
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
	setPayClass(pc:PayClass){
        this.curPayClass=pc;
        this.PayClassName=pc.PayClassName;
        this.PNChange = false;
        this.chkdata(pc.id);
        //console.log('GreatePayClass setPayClass:',pc);
    }
    async EditPayClassName(){
        if(this.PayClassName===this.curPayClass.PayClassName) return;
        const param:CommonParams={};
        param.id= this.curPayClass.id;
        param.PayClassName=this.PayClassName;
        param.ModifyID = this.store.personal.id;
        const msg:IMsg=await this.store.ax.getApi('editPayClass',param);
        console.log('after getApi editPayClass',msg);
        if(msg.ErrNo===0){
            this.$q.dialog({
                title: this.$t('Label.Save') as string,
                message: 'OK!!'
            });
            console.log('before change PNChange',this.PNChange);
            this.PNChange = true;
        }
    }
    DelPayClass(){
        const param:CommonParams={};
        param.id= this.curPayClass.id;
        this.$q.dialog({
            title: `${this.$t('Label.DeletePayClass')}`,
            message: `${this.$t('Label.DeletePayClass')} ${this.curPayClass.PayClassName} ?`,
            ok: true,
            cancel: true,
        }).onOk(this.DPC);
    }
    async DPC(){
        const param:CommonParams={};
        param.id= this.curPayClass.id;
        param.GameID = this.curGameID;
        const msg:IMsg=await this.store.ax.getApi('delPayClass',param);
        console.log('after getApi editPayClass',msg);
        if(msg.ErrNo===0){
            this.$q.dialog({
                title: `${this.$t('Label.DeletePayClass')}`,
                message: 'OK!!'
            });
            this.PNChange = true;
        } else {
             this.$q.dialog({
                title: `${this.$t('Label.DeletePayClass')}`,
                message: msg.ErrCon
            });           
        }
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
.pbtn3 {
    padding: 6px 8px;
}
.testheader div {
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