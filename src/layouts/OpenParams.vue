<template>
	<div>
		<div class="row q-pa-sm">
			<div class="col-1 text-h6">{{ $t('Label.GameName')}}</div>
    		<div><q-select square filled dense v-model="game" :options="Games" style="width:200px"/></div>
            <div><q-btn color="blue" icon-right="save" label="Save" @click="SaveData();" /></div>
		</div>
        <div class="q-pa-md" v-if="model">
            <div class="row testheader">
                <div class="col test">{{$t('Table.ItemName')}}</div>
                <div class="col test">{{$t('Table.TotalNums')}}</div>
                <div class="col test">{{$t('Table.UseAvg')}}</div>
                <div class="col test">{{$t('Table.SingleNum')}}</div>
                <div class="col test">{{$t('Table.UnionNum')}}</div>
                <div class="col test">{{$t('Table.MinHand')}}</div>
                <div class="col test">{{$t('Table.MaxHand')}}</div>
            </div>
            <div class="row"
                v-for="(itm,idx) in OpParams"
                :key="idx"
            >
                <div class="col test">{{ itm.BTName }}</div>
                <div class="col test"><q-input outlined dense v-model="itm.TotalNums" /></div>
                <div class="col test"><q-checkbox v-model="itm.UseAvg" color="teal" /></div>
                <div class="col test"><q-input outlined dense v-model="itm.SingleNum" /></div>
                <div class="col test"><q-input outlined dense v-model="itm.UnionNum" /></div>
                <div class="col test"><q-input outlined dense v-model="itm.MinHand" /></div>
                <div class="col test"><q-input outlined dense v-model="itm.MaxHand" /></div>
            </div>            
        </div>
        <q-dialog v-model="Message.show" persistent>
        <q-card>
            <q-card-section class="row items-center">
            <q-avatar :icon="Message.icon" :color="Message.color" text-color="white" />
            <span class="q-ml-sm">{{Message.message}}</span>
            </q-card-section>

            <q-card-actions align="right">
            <q-btn flat label="Close" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
        </q-dialog>                
    </div>    
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {getModule} from 'vuex-module-decorators';
import LayoutStoreModule from './data/LayoutStoreModule';
import {SelectOptions,IMsg} from './data/if';
import OpParams,{IOParam} from './class/OpParams';
import {Orders} from './data/PayRateList';
interface SItem  { 
    title: string, 
    shortT?: string,
    subtitle?: string[]
}
interface DialogMsg {
    icon:string;
    color:string;
    show:boolean;
    message?:string;
}
@Component
export default class OpenParams extends Vue{
    private store= getModule(LayoutStoreModule);
    private Games:SelectOptions[]=[];
    private curGame:SelectOptions|null=null;
    private Params;
    private OpParams:OpParams[]=[];
    private model=false;
    public SuccessMsg:DialogMsg={
        icon:'check_circle',
        color:'green',
        show:true,
        message:'OK!!'
    }
    private FailMsg:DialogMsg={
        icon:'info',
        color:'red',
        show:true,
        message:'Save Fail!!'
    }
    private Message:DialogMsg = Object.assign({},this.SuccessMsg);
    set game(v:SelectOptions){
        this.curGame = v;
        if(v.value){
            this.getOpenParams(v.value);
        }
    }
	get game(){
        //console.log('get Model:', this.models);
		return this.curGame as SelectOptions;
    }
    async getGames(){
        let ans=await this.store.ax.getGames();
        if(ans){
            this.Games=ans;
            this.model=true;
        }
    }
    async SaveData(){
        console.log('SaveData');
        let datas:IOParam[]=[];
        this.OpParams.map((itm:OpParams)=>{
            if(itm.DataChanged){
                datas.push(itm.Datas);
            }
        })
        if(datas.length>0){
            console.log('SaveData:',datas);
            let msg=await this.store.ax.SaveData('OpenParams',JSON.stringify(datas));
            console.log('SaveData:',msg);
            if(msg.ErrNo===0){
                this.Message=Object.assign(this.Message,this.SuccessMsg);
                console.log('change message',this.Message,this.SuccessMsg);
                this.setDataChange(false);
            } else {
                this.Message=Object.assign(this.Message,this.FailMsg);
            }
        }
    }
    setDataChange(b:boolean){
        this.OpParams.map(itm=>{
            itm.DataChanged = b;
        })
    }
    async getOpenParams(GameID:number|string){
        let msg:IMsg=await this.store.ax.getOpParams(GameID);
        console.log('getOpenParams',msg);
        this.OpParams=[];
        if(msg.ErrNo===0){
            if(msg.data){
                let opparams:IOParam[]=msg.data as IOParam[];
                let GType:string|undefined;
                if(this.curGame){
                    if(this.curGame.value==1){
                        GType='MarkSix';
                    }
                }
                if(GType){
                    Orders[GType].map(itm=>{
                        let f=opparams.find(p=>p.BetType===parseInt(itm,10));
                        if(!f){
                            let tmp:IOParam = {
                                id:0,
                                GameID:GameID as number,
                                BetType:itm,
                                TotalNums:0,
                                UseAvg:0,
                                SingleNum:0,
                                UnionNum:0,
                                MinHand:0,
                                MaxHand:0,
                                BetForChange:0,
                                Steps:0
                            }
                            f=tmp;
                        } 
                        let S:any=this.$t(`Game.${GType}.Item.${f.BetType}`);
                        let SI:SItem = S as SItem;
                        let OPitm:OpParams=new OpParams(f);    
                        OPitm.BTName = (SI.shortT && SI.subtitle ? SI.shortT + SI.subtitle.join('') : SI.title );
                        this.OpParams.push(OPitm);
                    })
                }
            }
        }
    }
    mounted(){
        console.log('OpenParams mounted');
        this.Message.show=false;
        this.Message.message='check';
        if(!this.store.isLogin){
            this.$router.push({path:'/login'});
        }
        this.getGames();
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