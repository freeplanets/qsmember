<template>
    <div>
        <div class='row'>
            <div class='col-2'><GS :store='store' @setGames="setCurGames"></GS></div>
            <div class="pbtn"><q-select outlined dense v-model="refSec" :options="refSecs" /></div><div class="talign">{{$t('Label.Sec')}}</div>
            <div class="pbtn">
                <q-chip
                    clickable
                    @click="refreshData(1)"
                >
                    <q-avatar color="red" text-color="white">{{CountDown}}</q-avatar>
                    {{$t('Label.Refresh')}}                    
                </q-chip>
            </div>            
            <div class='col talign1'
                 v-if="oddshow"
            >
                <q-btn-group outline class='mtop'>
                    <q-btn outline color="brown" :label="$t('Button.TotalStop')" @click="setStop(1)" />
                    <q-btn outline color="brown" :label="$t('Button.TotalOpen')" @click="setStop(0)" />
                    <q-btn outline color="brown" :label="$t('Button.PageStop')"  @click="setStop(1,cont)" />                    
                    <q-btn outline color="brown" :label="$t('Button.PageOpen')"  @click="setStop(0,cont)" />
                </q-btn-group>
            </div>
        </div>
        <div class="q-gutter-sm"
            v-if="oddshow"
        >
            <q-chip 
                v-for="(itm,idx) in dfLayout"
                :key="'layout'+idx"
                square
                size="sm"
                :color="dfColor[idx]"
                text-color="white"
                clickable
                @click="changePage(itm.cont,idx)"
                >
                <q-avatar icon="play_arrow" color="primary" text-color="white" />
                {{$t(itm.name)}}
            </q-chip>
            <div class='q-pa-md'
                v-for="(BItm,bidx) in cont"
                :key="'cont'+bidx"
            >   
                <div
                    v-if="BItm.aBT"
                    class="q-gutter-y-md"
                >
                    <q-card>
                        <q-tabs
                        v-model="tab"
                        dense
                        class="text-grey"
                        active-color="primary"
                        indicator-color="primary"
                        align="left"
                        narrow-indicator
                        >
                            <q-tab 
                                v-for="(BT,idx) in BItm.aBT"
                                :key="'BItm'+idx"
                                :name="'tab'+BT" 
                                :label="$t(`Game.${curGType}.Item.${BT}.title`)" 
                                />
                        </q-tabs>

                        <q-separator />

                        <q-tab-panels v-model="tab" animated>
                            <q-tab-panel 
                                v-for="(BT,idx) in BItm.aBT"
                                :key="'BTab'+idx"                                
                                :name="'tab'+BT">
                                <div class='row justify-left'
                                    v-for="(LItm,Lidx) in tmpItem=BItm.item(BT,BItm.end,BItm.start)"
                                    :key="BT+'bitm'+Lidx"
                                >
                                    <div class='col-10 col-md-1'
                                        v-for="(nItm,nidx) in LItm"
                                        :key="BT+'litm'+nidx"
                                    >
                                        <OB 
                                            :store="store"
                                            :tid="curTid"
                                            :GameID="curGameID"
                                            :dgt="BItm.dgt"
                                            :Odds="getOdds(nItm.BT,nItm.Num)"
                                            :ExtOdds="Game.getOdds(nItm.BT,nItm.Num,(BItm.twOdds ? BItm.twOdds[idx] : 0 ))"                                            
                                            :rightLine="nidx==(LItm.length-1)"
                                            :bottomLine="Lidx==(tmpItem.length-1) || (nidx==9 && (tmpItem[Lidx+1] && tmpItem[Lidx+1].length<10))"
                                            :GType="curGType"
                                            :colorWave="BItm.colorWave"
                                            :colorExt="BItm.colorExt"
                                            @OddChange="getCurOdds"></OB>
                                    </div>
                                </div>
                            </q-tab-panel>
                        </q-tab-panels>
                    </q-card>
                </div>
                <div
                    v-if="!BItm.aBT"
                > 
                    <div>{{ $t(BItm.title)+(BItm.subtitle ? $t(BItm.subtitle) : '') }}</div>
                        <div class="row FastSlt" v-if="BItm.FastSlt">
                            <div class="row" v-if="BItm.FastSlt.subcont">
                                <div class="row" v-for="(itm,idx) in BItm.FastSlt.subcont" :key="'fast'+idx">
                                    <div>{{$t(itm.title)}}</div>
                                    <div v-for="(slt,sltidx) in  itm.subitem" :key="'fastsub'+idx+'-'+sltidx">
                                        <q-btn :outline="!slt.isActive" size='sm' class='btn-pad' color="primary" :label="slt.num" @click="BItm.item=itm.func(itm.key,slt.num,BItm.BT);setActive(BItm.FastSlt.subcont);slt.isActive=true"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div class='row justify-left'
                        v-for="(LItm,Lidx) in BItm.item"
                        :key="'bitm'+Lidx"
                    >
                        <div class='col-10 col-md-1'
                            v-for="(nItm,nidx) in LItm"
                            :key="'litm'+nidx"
                        >
                            <div v-if="nItm.BT<1"></div>
                            <OB 
                                v-if="nItm.BT>0"
                                :store="store"
                                :tid="curTid"
                                :GameID="curGameID"
                                :dgt="BItm.dgt"
                                :Odds="getOdds(nItm.BT,nItm.Num)" 
                                :rightLine="nidx==(LItm.length-1)"
                                :bottomLine="Lidx==(BItm.item.length-1) || (nidx==(BItm.item[Lidx].length-1) && (BItm.item[Lidx+1] && BItm.item[Lidx+1].length<BItm.item[Lidx].length))"
                                :GType="curGType"
                                :colorWave="BItm.colorWave"
                                :colorExt="BItm.colorExt"
                                @OddChange="getCurOdds"></OB>
                        </div>
                    </div>
                </div>
            </div>            
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import LayoutStoreModule from './data/LayoutStoreModule';
import {getModule} from 'vuex-module-decorators';
import OddsBlock from './components/OddsBlock.vue';
import GameSelector from './components/GameSelector.vue';
import {Odds, SelectOptions,IMsg, CommonParams,ILoginInfo} from './data/if';
import Layouts,{Layout,contBlock,numBlock,FastSltSub,FastSltSubItem} from './components/layouts';
import {CGame,IData} from './components/Games';

Vue.component('OB',OddsBlock);
Vue.component('GS',GameSelector);

interface BTNs {
    title:string;
    BT?:number;
    SubItm?:number[];
    SubMenu?:string[];
}

@Component
export default class OddsManager extends Vue {
    store = getModule(LayoutStoreModule);
    sltBtn:BTNs[]=[];
    dfLayout:Layout=[];
    dfColor:string[]=[];
    sltColor:string='light-blue'
    unSltColor:string='teal'
    curGameID:number=0;
    cont:contBlock[]=[];
    Game:CGame=new CGame();
    oddshow:boolean=false;
    curBt:number|null=null;
    curGType:string='';
    tab:string='';
    tmpItem;
    curTid:number=0;
    curInterval:number|null=null;
    curIdx:number=0;
    Steps:number[]=[];
    refSecs:number[]=[5,10,15,30,60];
    refSec:number=5;
    CountDown:number=0;
    odds:Odds={
        Num:1,
        Odds:49,
        Risk:123456
    }
    get PInfo():ILoginInfo{
        return this.store.personal;
    }
    async setCurGames(v:SelectOptions){
        console.log('setGames:',v);
        if(v.value===this.curGameID) {
            return;
        }
        if(this.curInterval){
            window.clearInterval(this.curInterval);
        }
        if(v.GType){
            this.oddshow=false;
            /*
            console.log(this.$t(`Game.${v.GType}.Menu.Group`))
            const tmp:any=this.$t(`Game.${v.GType}.Menu.Group`);
            tmp.map((itm:BTNs)=>{
                this.sltBtn.push(itm);
            })
            */
            this.Game.GType=v.GType;
            this.curGameID=v.value as number;
            this.curGType=v.GType;
            this.dfLayout=Layouts[v.GType];
            this.dfColor=[];
            //this.getOpSteps();
            Object.keys(this.dfLayout).map(key=>{
                if(key==='0'){
                    this.cont = this.dfLayout[key].cont;
                    this.dfColor.push(this.sltColor);
                } else {
                    this.dfColor.push(this.unSltColor);
                }
            })
            //this.cont = this.dfLayout[0].cont;
            //console.log('setCurGames',this.dfLayout);
            if(v.value){
                const param:CommonParams={
                    UserID:this.PInfo.id,
                    sid:this.PInfo.sid,
                    GameID:v.value,
                    MaxOddsID:0
                }
                let ans:IMsg=await this.store.ax.getApi('CurOddsInfo',param);
                //console.log('get CurOddsInfo:',ans);
                if(ans.data){
                    /*
                    let Steps:OSteps[]=[];
                    if(ans.Steps){
                        Steps=ans.Steps;
                    }
                    */
                    this.Game.inidata(ans.data as IData);
                    //console.log('Game:',this.Game.Items)
                    this.curTid=ans.tid;
                    //console.log('CGame MaxOddsID:',this.Game.MaxOddsID);
                    if(this.curInterval){
                        window.clearInterval(this.curInterval);
                    }
                    //this.curInterval=window.setInterval(this.getCurOdds,3000);
                    this.CountDown = this.refSec;
                    this.curInterval=window.setInterval(this.refreshData,1000);
                }
            }
            this.oddshow=true;
        }
    }
    getOdds(BT:number,Num:number){
        return this.Game.getOdds(BT,Num);
    }
    refreshData(doitnow?:number){
        if(doitnow){
            this.CountDown=0;
        } else {
            this.CountDown--
        }
        if(this.CountDown==0){
            this.CountDown = this.refSec;
            this.getCurOdds();
        }
        console.log('refresh',this.refSec);
    }
    async getCurOdds(){
        const param:CommonParams = {
            UserID:this.PInfo.id,
            sid:this.PInfo.sid,
            GameID:this.curGameID,
            MaxOddsID: this.Game.MaxOddsID
        }
        let ans:IMsg=await this.store.ax.getApi('CurOddsInfo',param);
        if(ans.data){
            this.Game.updateData(ans.data as IData);
            this.curTid=ans.tid;
            //this.$forceUpdate();
            //console.log('do changePage');
            this.changePage(this.cont,this.curIdx);
        }
    }
    changePage(v:contBlock[],key:number){
        if(this.cont != v){
            if(v[0].aBT){
                this.tab='tab'+v[0].aBT[0];
            }
        }
        this.cont = v;
        this.curIdx = key;
        //console.log('changePage cont:',v,this.cont);
        this.dfColor=this.dfColor.map((itm,idx)=>{
            if(idx===key) itm=this.sltColor;
            else itm=this.unSltColor;
            return itm;
        })
        //console.log('show',this.dfColor);
        //console.log('show',v,this.Game.getOdds(2,0));     
    }
    async setStop(stop:number,curCont?:contBlock[]){
        let bt : string | undefined ='';
        let tmp:number[]=[];
        if(curCont){
            curCont.map((itm:contBlock)=>{
                if(itm.aBT){
                    tmp =  tmp.concat(itm.aBT);
                } else {
                    let lines:numBlock[][]=itm.item as numBlock[][];
                    Object.keys(lines).map(key=>{
                        let items:numBlock[]=lines[key] as numBlock[];
                        items.map(odds=>{
                            let f=tmp.find(bt=>bt===odds.BT);
                            if(!f){
                                tmp.push(odds.BT);
                            }
                        })

                    });
                }
            })
        }
        //console.log('setStop',curCont,tmp);
        if(tmp.length>0) bt = tmp.join(',');
        const param:CommonParams = {
            UserID:this.PInfo.id,
            sid:this.PInfo.sid,
            GameID:this.curGameID,
            tid: this.curTid,
            isStop: stop,
            BetTypes: bt,
        }
        let ans:IMsg=await this.store.ax.getApi('setStop',param);
        //console.log('setStop:',ans);
        if(ans.ErrNo===0){
            this.getCurOdds();
        }
    }
    setActive(subcont:FastSltSub[]){
        subcont.map(itm=>{
            itm.subitem.map((subitm:FastSltSubItem)=>{
                subitm.isActive=false;
            })
        })
    }
    showinfo(num,v) {
        console.log('showinfo',num,v);
    }
    beforeDestroy(){
        //console.log('page beforeDestroy',this.$route.name);
        if(this.curInterval){
            window.clearInterval(this.curInterval);
        }
    }
}
//export default Vue.extend({
    
//})
</script>
<style scoped>
.talign1 {
    line-height:48px;
    padding-left: 12px;
}
.pbtn {
    padding: 6px 4px;
}
.talign {
    text-align: center;
    line-height:48px;
    padding: 0 4px 0 4px;
}
.btn-pad {
    padding: 4px 12px;
}
.FastSlt {
    padding-bottom: 5px;
}
</style>