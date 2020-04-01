<template>
	<div>
		<div class="row q-pa-sm">
			<div class="col-1 text-h6">{{ $t('Label.GameName')}}</div>
    		<div><q-select square filled dense v-model="model" :options="options" style="width:200px"/></div>
            <div><q-btn color="blue" icon-right="save" label="Save" @click="SaveData();" /></div>
		</div>       
        <div v-if="model">
            <div class="row q-pa-md" >
                <div>{{ $t('Label.PayClassName') }}</div>
                <div><q-input outlined dense v-model="PayClassName" /></div>
                <div><q-btn color="green" icon-right="save" :label="$t('Label.SavePayClassName')" @click="SavePayClass();" /></div>
            </div>
            <div class="q-pa-md">
            <div class="q-gutter-y-md" style="max-width: 600px">
            <q-card>
                <q-tabs
                v-model="tab"
                dense
                class="bg-primary text-silver shadow-2"
                active-color="white"
                indicator-color="yellow"
                align="justify"
                narrow-indicator
                >
                <q-tab 
                    v-for="(itm,idx) in Funcs"
                    :key="idx"
                    :label="itm.title" @click="expendPR(itm.id)"
                    :name="itm.id" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated>
                <q-tab-panel :name="Funcs[0].id">
                    <div class="row justify-center">
                        <div class="q-pa-md col-12 col-md-2">{{ $t('Label.RateDiff') }}</div>
                        <div class="col-12 col-md-2"><q-input outlined dense v-model="Funcs[0].value" /></div>
                        <div class="q-pa-md col-12 col-md-8">{{ $t('Label.RateDiffInfo') }}</div>
                    </div>
                </q-tab-panel>

                <q-tab-panel :name="Funcs[1].id">
                    <div class="row justify-center">
                        <div class="q-pa-md col-12 col-md-2">{{ $t('Label.ProfitDiff') }}</div>
                        <div class="q-pa-md col-12 col-md-2"><q-input outlined dense v-model="Funcs[1].value" /></div>
                        <div class="q-pa-md col-12 col-md-8">{{ $t('Label.ProfitDiffInfo') }}</div>
                    </div>
                </q-tab-panel>

                <q-tab-panel :name="Funcs[2].id">
                    <div class="row justify-center">
                        <div class="q-pa-md col-12 col-md-2">{{ $t('Label.FixProfit') }}</div>
                        <div class="q-pa-md col-12 col-md-2"><q-input outlined dense v-model="Funcs[2].value" /></div>
                        <div class="q-pa-md col-12 col-md-8">{{ $t('Label.FixProfitInfo') }}</div>
                    </div>
                </q-tab-panel>
                <q-tab-panel :name="Funcs[3].id">
                    <div class="row justify-center">
                        <div class="q-pa-md col-12 col-md-2">{{ $t('Label.FloatProfit')}}</div>
                        <div class="q-pa-md col-12 col-md-10">{{ $t('Label.FloatProfitInfo')}}</div>
                    </div>
                    <div class="row justify-center">
                        <div class="q-pa-md col-12 col-md-2">{{ $t('Label.WinChance')}}</div>
                        <div class="q-pa-md col-12 col-md-2">{{ $t('Label.FloatProfit')}}</div>
                        <div class="q-pa-md col-12 col-md-8"></div>
                    </div>
                    <div 
                        class="row justify-center rateline"
                        v-for="(rs,i) in RSteps"
                        :key="'RSteps'+i"
                    >
                        <div class="q-pa-md col-12 col-md-2">{{ rs.title }}</div>
                        <div class="q-pa-md col-12 col-md-2"><q-input outlined dense v-model="rs.model" /></div>
                        <div class="q-pa-md col-12 col-md-8"></div>
                    </div>                
                </q-tab-panel>                
                </q-tab-panels>
            </q-card>
            </div>
            </div>
        </div>        
    </div>      
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import axios,{ AxiosResponse } from 'axios';
import LayoutStoreModule from './data/LayoutStoreModule';
import {getModule} from 'vuex-module-decorators';
//import BTG from './data/defaultData';
import {SelectOptions} from './data/if';
interface PayClass {
    id:number;
    PayClassName:string;
}
interface FuncBtn {
    id:number;
    color:string;
    title:string;
    value?:string;
}
interface RateSteps {
    title:string;
    rate:number;
    model:number|null;
}
interface SetPayClassParam {
    type:number;
    param:string|RateSteps[];
}

const DEFAULT_COLOR = 'blue';
const SELECTED_COLOR = 'purple';
@Component
export default class BetClass extends Vue{
	private store = getModule(LayoutStoreModule);
    private models:SelectOptions | null = null;
    PayClassName:string='';
	options:SelectOptions[] = [
		{value: 0,label:'default'}
    ];
    tab:number|null=null;
    Funcs:FuncBtn[] = [];
    ExpendPayClass:boolean = false;
    opPayRate:string | null=null;
    FuncSlted:number|null=null;
    RSteps:RateSteps[]=[
        { title:'>1/2', rate: 1/2, model:null},
        { title:'<=1/2', rate: 1/2, model:null},
        { title:'<=1/3', rate: 1/3, model:null},
        { title:'<=1/4', rate: 1/4, model:null},
        { title:'<=1/5', rate: 1/5, model:null},
        { title:'<=1/10', rate: 1/10, model:null},
        { title:'<=1/25', rate: 1/25, model:null},
        { title:'<=1/50', rate: 1/50, model:null},
        { title:'<=1/100', rate: 1/100, model:null},
        { title:'<=1/250', rate: 1/250, model:null},
        { title:'<=1/500', rate: 1/500, model:null},
        { title:'<=1/1000', rate: 1/1000, model:null}
    ];
    set model(v:SelectOptions){
        this.models = v;
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
    expendPR(id:number){
        this.FuncSlted = id;
        this.Funcs.map(itm=>{
            if(itm.id===id){
                itm.color = SELECTED_COLOR;
            } else {
                itm.color = DEFAULT_COLOR;
            }
        })
        //console.log('tab:',this.tab);
    }
	async getGames(){
        const ans=await this.store.ax.getGames();
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
    SaveData(){
    }
    SavePayClass(){
        const pcp:SetPayClassParam = {
            type:0,
            param:''
        }
        if(this.tab === null) {
            return;
        }
        pcp.type=this.tab;
        if(this.tab==3){
            //console.log('SavePayClass:',this.RSteps);
            if(!this.RSteps[0].model){
                //console.log('First rate filed will not be empty!!');
                return;
            }
            pcp.param = this.RSteps;
            return;
        } else {
            //console.log('SavePayClass:',this.Funcs[this.tab]);
            pcp.param = this.Funcs[this.tab].value as string;
        }
        //console.log(pcp);
 		const data = {
			GameID: this.model.value as string,
            ModifyID: this.UserID,
            PayClassName: this.PayClassName,
            condition: JSON.stringify(pcp)
        }
		const url:string=this.store.ax.Host+'/api/savePayClass';        
		axios.post(url,data).then((res:AxiosResponse)=>{
            console.log(res.data);
		}).catch(err=>{
			console.error(err);
        })
    }
    initFuncBtn(){
        if(this.$t('Label.PayClassFunc')){
            const t:string[]=this.$t('Label.PayClassFunc').toString().split(',');
            t.map((itm,idx)=>{
                const f:FuncBtn = {
                    id:idx,
                    title: itm,
                    color: DEFAULT_COLOR,
                }
                this.Funcs.push(f);
            })
        }
    }
  mounted(){
        if(!this.store.isLogin){
        this.$router.push({path:'/login'});
        }         
        this.getGames();
        this.initFuncBtn();
  }
}
</script>
<style scoped>
.rateline .q-pa-md{
    padding: 4px 4px;
}
</style>