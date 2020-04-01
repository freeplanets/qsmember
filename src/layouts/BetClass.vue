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
						v-for="(itm,idx) in btList"
						:key="idx"
						:class="{'col-1':true,bgc: itm.ungrouped}"
						v-model="itm.chk" :label="itm.title"/>
					</div>
				</q-card-section>
			</q-card>
			<div class="row q-pa-sm">
				<div class="col-1"><q-btn color="blue" icon-right="send" label="Save" @click="Save()" /></div>
				<div class="col-1"><q-btn color="accent" icon-right="clear" label="clear" @click="clear()" /></div>
				<div class="col-1"><q-btn color="red" icon-right="delete_forever" label="Delete" @click="Delete()" /></div>
				<div class="col-2"><q-btn color="green-9" icon-right="pan_tool" label="Unseleted" @click="getUnGroupedBT()" /></div>
			</div>
		</div>	 
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LayoutStoreModule from './data/LayoutStoreModule';
import {getModule} from 'vuex-module-decorators';
import BTG from './data/defaultData';
import { SelectOptions, ItmBtg, IbtCls,Btg,CommonParams} from './data/if';

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
	async getGames(){
		const ans = await this.store.ax.getGames();
		if(ans){
			this.options=ans;
		}
	}
	async getBtClass(){
		const models:SelectOptions = this.models as SelectOptions;
		this.clss=[];
		this.BtClass=[];
		if(models.value){
			const ans = await this.store.ax.getBtClass(models.value)
			if(ans){
				ans.map((itm:IbtCls)=>{
					this.clss.push(itm.BCName);
					this.BtClass.push(itm)
				});
			}
		}	
	}
	listBetTypes(btg:string):void{
		this.btList = [];
		this.clss = [];
		//this.clear();
		const tmp:object=this.$t(`Game.${btg}.Item`) as object;
		Object.keys(tmp).map(key=>{
			const itm:Btg = tmp[key];
			const ibtg:ItmBtg = {
				id:key,
				title: itm.title,
				chk:false,
				ungrouped:false
			}
			this.btList.push(ibtg);
		})
		this.getBtClass();		
	}
	async Save(){
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
		const ans=await this.store.ax.getApi('saveBtClass',data,'post');
		if(ans.ErrNo===0){
			this.getBtClass();
			this.clear();
			this.$q.dialog({
				title: this.$t('Label.Save') as string,
				message: 'OK!!'
			});
		}
	}
	async Delete(){
		if(!this.mClass) return;
		this.$q.dialog({
			title: this.$t('Dialog.Attention') as string,
			message: this.$t('Dialog.DelBCMsg') + ':' + this.mClass,
			cancel:true,
			persistent:true
		}).onOk(()=>{
			this.delBtClass();
		});
	}
	async delBtClass(){
		const models:SelectOptions = this.models as SelectOptions;
		let GameID:number= models.value ? models.value as number : 0;
		if(!GameID) return;
		console.log('delBtClass',GameID,this.mClass);			
		const param:CommonParams={
			GameID: GameID,
			BCName: this.mClass
		}
		const ans=await this.store.ax.getApi('delBtClass',param);
		if(ans.ErrNo===0){
			this.getBtClass();
			this.clear();			
		}
		console.log(ans);
	}
	getUnGroupedBT(){
		const slted:string[]=[];
		this.BtClass.map((itm:IbtCls)=>{
			const bts=itm.BetTypes.split(':');
			console.log(bts);
			bts.map(bt=>{
				//const iBt=parseInt(bt,10);
				const f=slted.find(sbt=>sbt===bt);
				if(!f){
					slted.push(bt);
				}
			})
		})
		this.btList.map((bitm:ItmBtg)=>{
			const fd=slted.find(uns=>uns===bitm.id);
			if(!fd){
				bitm.ungrouped=true;
				return bitm;
			} else {
				bitm.ungrouped = false;
			}
		});
		console.log('getUnGroupedBT',this.btList);
	}	
	setBtSelect(v:string){
		if(this.BtClass.length==0) return;
		const found:IbtCls=this.BtClass.find((itm:IbtCls)=>itm.BCName===v) as IbtCls;
		this.btList.map((itm:ItmBtg)=>{
			itm.chk = false;
		});
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
		this.mClass='';
		this.modelClass = '';
		this.newClassName = '';
		this.btList.map((itm:ItmBtg)=>{
			itm.chk = false;
		});
		//this.models = null;
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
<style scoped>
.bgc {
	color: orange;
}
</style>