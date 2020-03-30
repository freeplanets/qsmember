<template>
	<div>
		<div class="row q-pa-sm">
			<div class="col-1 text-h6">{{ $t('Label.GameName')}}</div>
    		<q-select square filled v-model="model" :options="options" style="width:200px"/>
		</div>
		<div v-if="model">
			<div class="row q-pa-sm">
			<div class="col-1 text-h6">{{ $t('Label.ClassName')}}</div>
			<div><q-select square filled v-model="modelClass" :options="clss" style="width:200px" /></div>
			<div><q-input outlined v-model="newClassName" :label="$t('Label.InputClassName')" /></div>
			</div>
			<q-card class="my-card q-pa-sm">
				<q-card-section>
					<div class="row">
					<q-checkbox 
						class="col-1"
						v-for="(itm,idx) in btList"
						:key="idx"
						v-model="itm.chk" :label="itm.title" />
					</div>
				</q-card-section>
			</q-card>
			<div class="row q-pa-sm">
				<div class="col-1"><q-btn color="blue" icon-right="send" label="Save" @click="log()" /></div>
				<div class="col-1"><q-btn color="red" icon-right="clear" label="clear" @click="clear()" /></div>
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
import BTG from './data/defaultData';
import { SelectOptions, ItmBtg, IbtCls,Btg} from './data/if';

@Component
export default class BetClass extends Vue{
	private store = getModule(LayoutStoreModule);
	private models:SelectOptions | null = null;
	private mClass:string = '';
	public newClassName:string ='';
	public btList: ItmBtg[] = [];
	public clss:string[]=[];
	private BtClass:IbtCls[] = [];
	options:SelectOptions[] = [
		{value: 0,label:'default'}
	]

	set model(v:SelectOptions){
		this.models = v;
		this.listBetTypes(BTG[v.value as number]);
	}
	get model(){
		return this.models as SelectOptions;
	}
	set modelClass(v){
		this.mClass = v;
		this.setBtSelect(v);
	}
	get modelClass(){
		return this.mClass;
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
	getBtClass(){
		const url:string=this.store.ax.Host+'/api/getBtClass';
		const models:SelectOptions = this.models as SelectOptions;
		const config:AxiosRequestConfig = {
			params: {
				GameID: models.value
			}
		}
		axios.get(url,config).then((res:AxiosResponse)=>{
			//console.log(res.data);
			//const tmp:SelectOptions[]=[];
			this.clss=[];
			this.BtClass=[];
			let me = this;
			res.data.map((itm:IbtCls)=>{
				me.clss.push(itm.BCName);
				me.BtClass.push(itm)
			})
		})		
	}
	listBetTypes(btg:string):void{
		this.btList = [];
		this.clss = [];
		this.clear();
		const tmp:object=this.$t(`Game.${btg}.Item`) as object;
		Object.keys(tmp).map(key=>{
			const itm:Btg = tmp[key];
			const ibtg:ItmBtg = {
				id:key,
				title: itm.title,
				chk:false
			}
			this.btList.push(ibtg);
		})
		this.getBtClass();		
	}
	log(){
		const bt:string[]=[];
		this.btList.map(itm=>{
			if(itm.chk) bt.push(itm.id);
		})
		if(bt.length==0) return;
		if(this.UserID==='') return;
		const models:SelectOptions = this.models as SelectOptions;
		if(!models) return;
		const data = {
			GameID: models.value as number,
			BCName: this.newClassName,
			BetTypes: bt.join(':'),
			ModifyID: this.UserID
		}
		const url:string=this.store.ax.Host+'/api/saveBtClass';
		axios.post(url,data).then((res:AxiosResponse)=>{
			console.log(res.data);
			this.getBtClass();
		}).catch(err=>{
			console.log(err);
		})
		//console.log('log',this.btList);
	}
	setBtSelect(v:string){
		if(this.BtClass.length==0) return;
		const found:IbtCls=this.BtClass.find((itm:IbtCls)=>itm.BCName===v) as IbtCls;
		if(found){
			this.newClassName = v;
			const bts = found.BetTypes.split(':');
			let me = this;
			bts.map((v:string) => {
				const tmp:ItmBtg=me.btList.find((itm:ItmBtg)=>itm.id==v) as ItmBtg;
				tmp.chk = true;
			});
		}
	}
	clear(){
		this.modelClass = '';
		this.newClassName = '';
		this.btList.map((itm:ItmBtg)=>{
			itm.chk = false;
		});
	}
  mounted(){
        if(!this.store.isLogin){
        this.$router.push({path:'/login'});
        }   	  
		this.getGames();
		//console.log('BTG:',BTG)
  }
}
</script>