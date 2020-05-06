<template>
	<div>
		<div class="row q-pa-sm">
            <div class='col-2'><GS :store='store' @setGames="setCurGames"></GS></div>
            <div class='pbtn'><q-btn color="blue" icon-right="save" label="Save" @click="SaveData();" /></div>
		    <div class='col' 
                v-if='curGameID'
                >
                <BTC :store='store' :GameID='curGameID' @SltBT='SltBetTypes' ></BTC>
            </div>
		</div>
        <div class="row">
        <RCO class='col-6' :showUpLimit='true' @updateRateTop="updateRateTop" @updateRateDefault="updateRateDefault"></RCO>
        </div>
        <div class="q-pa-md" v-if="models">
            <div class="row testheader">
                <div class="col-1 test">{{$t('Table.ItemName')}}</div>
                <div class="col-1 test">{{$t('Table.SubName')}}</div>
                <div class="col-1 test">{{$t('Table.NoAdjust')}}</div>
                <div class="col-1 test">{{$t('Table.Profit')}}(%)</div>
                <div class="col-1 test">{{$t('Table.RateDefault')}}</div>
                <div class="col-1 test">{{$t('Table.RateTop')}}</div>
                <div class="col-1 test">{{$t('Table.Probability')}}</div>
                <div class="col-1 test">{{$t('Table.Steps')}}</div>
            </div>
            <div class="row datas"
                v-for="(itm,idx) in BasePayR"
                :key="idx"
            >
                <div :class="{'col-1':true,test:true,bgc:itm.Selected}" @click="itm.Selected=!itm.Selected">{{ itm.Title }}</div>
                <div :class="{'col-1':true,test:true,bgc:itm.Selected}" @click="itm.Selected=!itm.Selected">{{ itm.SubTitle }}</div>
                <div class="col-1 test"><q-checkbox v-model="itm.NoAdjust" color="teal" /></div>
                <div :class="{'col-1 test':true,redColor:itm.Profit<0}">{{ itm.Profit }}</div>
                <div class="col-1 test"><q-input square standout="bg-teal text-white" dense v-model="itm.Rate"  /></div>
                <div class="col-1 test"><q-input square standout="bg-teal text-white" dense v-model="itm.TopRate"  /></div>
                <div class="col-1 test"><q-input square standout="bg-teal text-white" dense v-model="itm.Probability"  /></div>
                <div class="col-1 test"><q-input square standout="bg-teal text-white" dense v-model="itm.Steps"  /></div>
            </div>
        </div>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import axios,{AxiosResponse } from 'axios';
import LayoutStoreModule from './data/LayoutStoreModule';
import {getModule} from 'vuex-module-decorators';
//import {IGames} from './data/schema';
//import BTG from './data/defaultData';
import {SelectOptions,BasePayRateItm,IbtCls,CommonParams,IMsg} from './data/if';
import BTG from './data/defaultData';
import {PayRateData } from './data/PayRateList';
import {BasePayRate} from './class/BasePayRate';
//import { cloneDeep } from 'lodash';
import GameSelector from './components/GameSelector.vue';
import BetTypeClass from './components/BetTypeClass.vue';
import RateChangeOption from './components/RateChangeOption.vue';
Vue.component('GS',GameSelector);
Vue.component('BTC',BetTypeClass);
Vue.component('RCO',RateChangeOption);

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
interface BItem {
    Title:string;
    SubTitle?:string;
    Filter?:string;
}
@Component
export default class BetClass extends Vue{
	store = getModule(LayoutStoreModule);
    models:SelectOptions | null = null;
    BasePayR:BasePayRate<BasePayRateItm>[]=[];
    curGameID:number|null=null;
    BtClass:IbtCls[] = [];
	options:SelectOptions[] = [
		{value: 0,label:'default'}
    ]
	get UserID():string{
		if(this.store.personal.id) {
			return this.store.personal.id + '';
		} 
		return '';
    }
    setCurGames(v:SelectOptions){
        this.models = v;
        this.chkdata(v);
        console.log('doGames',v);
    }
    async chkdata(v:SelectOptions){
        // console.log('chkdata:', v);
        //const gid:string = v.value as string;
        this.curGameID = v.value as number;
        const btg=BTG[this.curGameID];
        const tmp:object=PayRateData[btg].data;
        const order:string[]=PayRateData[btg].order;
        let itms:BasePayRateItm[];
        //console.log('tmp',tmp);
        order.map(key=>{
            let itm:BItem[] = tmp[key];
            //if(key=='1') console.log('itm',itm);
            itm.map((p:BItem,i:number)=>{
                const BetType:number=parseInt(key,10);
                const SubType:number=i;
                const bpr:BasePayRateItm=this.createBPRItem(p,BetType,SubType);
                //if(p.BetType=='1') console.log('bb:',p);
                this.BasePayR.push(new BasePayRate<BasePayRateItm>(bpr));
            })
        });
        itms=await this.getBasePayRate(this.curGameID);
        //console.log('getBasePayRate itms:',itms);
        if(itms.length>0){
            itms.map(itm=>{
                const e = this.BasePayR.find(elm => elm.BetType == itm.BetType && elm.SubType == itm.SubType)
                if(e){
                    e.Datas= itm
                }
            })
            //this.BasePayR=cloneDeep(this.BasePayR);
        }
        //console.log('BasePayR:',this.BasePayR)
        //console.log('PayRateData',tmp);
        // console.log('BasePayR before if:', this.BasePayR, this.BasePayR.length);
        //if(this.BasePayR.length==0) return;

    }
    createBPRItem(p:BItem,BetType:number,SubType:number):BasePayRateItm{
        let bpr:BasePayRateItm ={
            Title:p.Title,
            SubTitle: p.SubTitle ? p.SubTitle : '',
            BetType: BetType,
            SubType: SubType,
            NoAdjust:0,
            Profit:0,
            DfRate:0,
            TopRate:0,
            Probability:0,
            Steps:0,
            //TopPay:0,
            //OneHand:0
        }
        return bpr;
    }  
    async getBasePayRate(gid:number):Promise<BasePayRateItm[]>{
        let dta:BasePayRateItm[]=[];
        const param:CommonParams = {
            GameID: gid
        }
        let msg:IMsg = await this.store.ax.getApi('getBasePayRate',param);
        if(msg.ErrNo==0){
            dta=msg.data as BasePayRateItm[]; 
        }
        return dta;
    }
    updateRateTop(v:number){
        if(v>0){
            this.BasePayR.map(itm=>{
                if(itm.Selected){
                    itm.updateRateTopByProfit(v);
                }
            })
        }
    }
    updateRateDefault(v:number){
        if(v>0){
            this.BasePayR.map(itm=>{
                if(itm.Selected){
                    itm.updateDefaultRateByProfit(v);
                }
            })
        }
    }
    SltBetTypes(slt:string){
        const bts:string[] = slt.split(':');
        this.BasePayR.map(itm=>{
            itm.Selected = false;
        })
        this.BasePayR.map(itm=>{
            const f = bts.find(bt=>parseInt(bt,10)===itm.BetType);
            if(f){
                itm.Selected = true;
            }
        })
        /*
        bts.map(bt=>{
            const  f=this.BasePayR.find(bpr=>bpr.BetType===parseInt(bt,10));
            if(f){
                f.Selected = true;
            }
        })
        */
        //console.log('SltBetTypes',bts);
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
        if(!this.models) return;
 		const data = {
			GameID: this.models.value,
            ModifyID: this.UserID,
            data: JSON.stringify(dtas)
		}
        const url:string=this.store.ax.Host+'/api/batch/saveBasePayRate';
		axios.post(url,data).then((res:AxiosResponse)=>{
            //console.log(res.data);
            if(res.data.affectedRows>0){
                this.$q.dialog({
                    title: this.$t('Label.Save') as string,
                    message: 'OK!!'
                });
            }            
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
    /*
    updateBPR(){
        this.BasePayR=cloneDeep(this.BasePayR);
    }
    */
  mounted(){
        if(!this.store.isLogin){
        this.$router.push({path:'/login'});
        }      
        this.BasePayR=[];
  }
}
</script>
<style scoped>
.pbtn {
    padding: 6px 4px;
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
.datas input {
    width: 100%;
}
</style>