<template>
	<div>
		<div class="row q-pa-sm ">
            <div class='col-2'><GS :store='store' @setGames="setCurGames"></GS></div>
            <div class='col-1 talign'><q-btn color="blue" icon-right="save" label="Save" @click="SaveData();" /></div>
		    <div class='col talign'>
                <q-btn-group>
                    <q-btn 
                        v-for="(itm,key) in BtClass"
                        :key="'BtClass'+key"
                        color="secondary" 
                        glossy 
                        :label="itm.BCName"
                        @click="SltBetTypes(itm.BetTypes)"
                         />
                </q-btn-group>                
            </div>
		</div>
        <div class="row profit">
            <div class='col-3'>
                賠率上限=(1 - 預定利潤
                <input 
                    maxlenght=2
                    v-model="pfRateTop" />
                %)/機率【轉換】
                <q-btn round size="xs" color="primary" icon="autorenew" @click="updateRateTop()"/>
            </div>
            <div class='col-3'>利潤
                <input
                    maxlenght=2
                    v-model="pfRate" />
                %=(1-原始賠率 x 機率)x100【轉換】
                <q-btn round size="xs" color="primary" icon="autorenew" @click="updateRateDefault()" />
            </div>
        </div>
        <div class="q-pa-md" v-if="models">
            <div class="row">
                <div class="col-1 test testheader">{{$t('Table.ItemName')}}</div>
                <div class="col-1 test testheader">{{$t('Table.SubName')}}</div>
                <div class="col-1 test testheader">{{$t('Table.NoAdjust')}}</div>
                <div class="col-1 test testheader">{{$t('Table.Profit')}}(%)</div>
                <div class="col-1 test testheader">{{$t('Table.RateDefault')}}</div>
                <div class="col-1 test testheader">{{$t('Table.RateTop')}}</div>
                <div class="col-1 test testheader">{{$t('Table.Probability')}}</div>
                <div class="col-1 test testheader">{{$t('Table.Steps')}}</div>
                <div class="col-1 test testheader">{{$t('Table.TopPay')}}</div>
                <div class="col-1 test testheader">{{$t('Table.OneHand')}}</div>
            </div>
            <div class="row datas"
                v-for="(itm,idx) in BasePayR"
                :key="idx"
            >
                <div :class="{'col-1':true,test:true,bgc:itm.Selected}">{{ itm.Title }}</div>
                <div :class="{'col-1':true,test:true,bgc:itm.Selected}">{{ itm.SubTitle }}</div>
                <div class="col-1 test"><q-checkbox v-model="itm.NoAdjust" color="teal" /></div>
                <div class="col-1 test">{{ itm.Profit }}</div>
                <div class="col-1 test"><input v-model="itm.DfRate"  /></div>
                <div class="col-1 test"><input v-model="itm.TopRate"  /></div>
                <div class="col-1 test"><input v-model="itm.Probability"  /></div>
                <div class="col-1 test"><input v-model="itm.Steps"  /></div>
                <div class="col-1 test"><input v-model="itm.TopPay"  /></div>
                <div class="col-1 test"><input v-model="itm.OneHand"  /></div>
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
import {SelectOptions,BasePayRateItm,IbtCls} from './data/if';
import BTG from './data/defaultData';
import {PayRateData } from './data/PayRateList';
import {BasePayRate} from './class/BasePayRate';
//import { cloneDeep } from 'lodash';
import  GameSelector from './components/GameSelector.vue';
Vue.component('GS',GameSelector);

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
    BtClass:IbtCls[] = [];
	options:SelectOptions[] = [
		{value: 0,label:'default'}
    ]
    pfRateTop:number = 0;
    pfRate:number = 0;
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
        const gid:string = v.value as string;
        const btg=BTG[gid];
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
        itms=await this.getBasePayRate(gid);
        console.log('getBasePayRate itms:',itms);
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
        await this.getBtClass();
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
            TopPay:0,
            OneHand:0
        }
        return bpr;
    }
	async getBtClass(){
		const models:SelectOptions = this.models as SelectOptions;
		this.BtClass=[];
		if(models.value){
			const ans = await this.store.ax.getBtClass(models.value)
			if(ans){
				ans.map((itm:IbtCls)=>{
					this.BtClass.push(itm)
                });
                let df:IbtCls ={
                    id:'',
                    BCName:'C',
                    BetTypes:''
                }
                this.BtClass.push(df);
			}
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
            data= err;
        })
        //console.log('await 1',data);
        return data;
    }
    updateRateTop(){
        if(this.pfRateTop>0){
            this.BasePayR.map(itm=>{
                if(itm.Selected){
                    itm.updateRateTopByProfit(this.pfRateTop);
                }
            })
        }
    }
    updateRateDefault(){
        if(this.pfRate>0){
            this.BasePayR.map(itm=>{
                if(itm.Selected){
                    itm.updateDefaultRateByProfit(this.pfRate);
                }
            })
        }
    }
    SltBetTypes(slt:string){
        const bts:string[] = slt.split(':');
        this.BasePayR.map(itm=>{
            itm.Selected = false;
        })
        bts.map(bt=>{
            const  f=this.BasePayR.find(bpr=>bpr.BetType===parseInt(bt,10));
            if(f){
                f.Selected = true;
            }
        })
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
.testheader {
    background-color: cadetblue;
    color:white;
}
.test {
    border: 1px gray solid;
    text-align: center;
    vertical-align: center;
}
.bgc {
    background-color:lightseagreen;
    color:white;
}
.talign {
    text-align: center;
    line-height:48px;
    margin: auto;
}
.profit input {
   max-width: 40px;
}
.datas input {
    width: 100%;
}
</style>