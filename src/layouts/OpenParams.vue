<template>
	<div>
		<div class="row q-pa-sm">
            <div class='col-2'><GS :store='store' @setGames="setCurGames"></GS></div>
            <div class='col-1 talign'><q-btn color="blue" icon-right="save" label="Save" @click="SaveData();" /></div>
		</div>
        <div class="q-pa-md" v-if="model">
            <div class="row testheader">
                <div class="col-1 test">{{$t('Table.ItemName')}}</div>
                <div class="col-1 test">{{$t('Table.TotalNums')}}</div>
                <div class="col-1 test">{{$t('Table.UseAvg')}}</div>
                <div class="col-1 test">{{$t('Table.SingleNum')}}</div>
                <div class="col-1 test">{{$t('Table.UnionNum')}}</div>
                <div class="col-1 test">{{$t('Table.MinHand')}}</div>
                <div class="col-1 test">{{$t('Table.MaxHand')}}</div>
                <div class="col-1 test">{{$t('Table.BetForChange')}}</div>
                <div class="col-j test">{{$t('Table.Steps')}}</div>
            </div>
            <div class="row"
                v-for="(itm,idx) in OpParams"
                :key="idx"
            >
                <div class="col-1 test colh">{{ itm.BTName }}</div>
                <div class="col-1 test"><q-input outlined dense v-model="itm.TotalNums" /></div>
                <div class="col-1 test"><q-checkbox v-model="itm.UseAvg" color="teal" /></div>
                <div class="col-1 test"><q-input outlined dense v-model="itm.SingleNum" /></div>
                <div class="col-1 test"><q-input outlined dense v-model="itm.UnionNum" /></div>
                <div class="col-1 test"><q-input outlined dense v-model="itm.MinHand" /></div>
                <div class="col-1 test"><q-input outlined dense v-model="itm.MaxHand" /></div>
                <div class="col-1 test"><q-input outlined dense v-model="itm.BetForChange" /></div>
                <div class="col-j test">
                    <div class="row"><q-input outlined dense v-model="itm.Steps" /><q-btn round dense color="primary" icon="trending_up" /></div>
                </div>
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
import {SelectOptions,IMsg,CommonParams} from './data/if';
import OpParams,{IOParam} from './class/OpParams';
import {PayRateData} from './data/PayRateList';
import GameSelector from './components/GameSelector.vue';
Vue.component('GS',GameSelector);
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
    private gType:string='';
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
    setCurGames(v:SelectOptions){
        this.curGame = v;
        if(this.curGame.GType){
            this.gType = this.curGame.GType;
        }
        if(v.value){
            this.model = true;
            this.getOpenParams(v.value as number);
        }        
    }
    async SaveData(){
        //console.log('SaveData');
        const datas:IOParam[]=[];
        this.OpParams.map((itm:OpParams)=>{
            if(itm.DataChanged){
                datas.push(itm.Datas);
            }
        })
        if(datas.length>0){
            //console.log('SaveData:',datas);
            let msg=await this.store.ax.SaveData('OpenParams',JSON.stringify(datas));
            //console.log('SaveData:',msg);
            if(msg.ErrNo===0){
                this.Message=Object.assign(this.Message,this.SuccessMsg);
                //console.log('change message',this.Message,this.SuccessMsg);
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
    async getOpenParams(GameID:number){
        //let msg:IMsg=await this.store.ax.getOpParams(GameID);
        const param:CommonParams={
            GameID:GameID
        }
        let msg:IMsg=await this.store.ax.getApi('getOpParams',param);
        //console.log('getOpenParams',msg);
        this.OpParams=[];
        if(msg.ErrNo===0){
            if(msg.data){
                const opparams:IOParam[]=msg.data as IOParam[];
                if(this.gType){
                    //const ops=PayRateData[this.gType].data;
                    const orders=PayRateData[this.gType].order;
                    orders.map(bt=>{
                        //ops[bt].map((itm,idx)=>{
                            const ibt=parseInt(bt,10);
                            let f=opparams.find(iop=>iop.BetType===ibt);
                            if(!f){
                                f=this.getDefaultIOP(GameID,ibt);
                            }
                            let OPitm:OpParams=new OpParams(f);
                            OPitm.BTName = this.$t(`Game.${this.gType}.Item.${bt}.title`) as string;
                            this.OpParams.push(OPitm);
                        //})
                    })
                    
                }
            }
        }
    }
    getDefaultIOP(GameID:number,BetType:number):IOParam{
        let tmp:IOParam = {
            id:0,
            GameID:GameID,
            BetType:BetType,
            TotalNums:0,
            UseAvg:0,
            SingleNum:0,
            UnionNum:0,
            MinHand:0,
            MaxHand:0,
            BetForChange:0,
            Steps:0,
            StepsGroup:''
        } 
        return tmp;
    }
    mounted(){
        //console.log('OpenParams mounted');
        this.Message.show=false;
        this.Message.message='check';
        if(!this.store.isLogin){
            this.$router.push({path:'/login'});
        }
    }
}
</script>
<style scoped>
.testheader div {
    background-color: cadetblue;
    color:white;
}
.test {
    border: 1px gray solid;
    text-align: center;
    vertical-align: middle;
}
.talign {
    text-align: center;
    line-height:48px;
}
.colh {
    text-align: center;
    line-height:40px;  
}
.col-j {
    height: auto;
    width: 220px;
}
</style>