<template>
    <div>
        <div class='row'>
            <div class='col-2'><GS :store='store' @setGames="setCurGames"></GS></div>
            <div class='col talign'
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
                                            :UserID="store.personal.id"
                                            :tid="curTid"
                                            :GameID="curGameID"
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
                    <div class='row justify-left'
                        v-for="(LItm,Lidx) in BItm.item"
                        :key="'bitm'+Lidx"
                    >
                        <div class='col-10 col-md-1'
                            v-for="(nItm,nidx) in LItm"
                            :key="'litm'+nidx"
                        >
                            <OB 
                                :UserID="store.personal.id"
                                :tid="curTid"
                                :GameID="curGameID"
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
import {Odds, SelectOptions,IMsg, CommonParams} from './data/if';
import Layouts,{Layout,contBlock,numBlock} from './components/layouts';
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
    private store = getModule(LayoutStoreModule);
    private sltBtn:BTNs[]=[];
    private dfLayout:Layout=[];
    private dfColor:string[]=[];
    private sltColor:string='light-blue'
    private unSltColor:string='teal'
    private curGameID:number=0;
    private cont:contBlock[]=[];
    private Game:CGame=new CGame();
    private oddshow:boolean=false;
    private curBt:number|null=null;
    private curGType:string='';
    private tab:string='';
    private tmpItem;
    private curTid:number=0;
    private curInterval:number|null=null;
    private curIdx:number=0;
    odds:Odds={
        Num:1,
        Odds:49,
        Risk:123456
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
                let ans:IMsg=await this.store.ax.getApi('CurOddsInfo',{GameID:v.value,MaxOddsID:0});
                //console.log('get CurOddsInfo:',ans);
                if(ans.data){
                    this.Game.inidata(ans.data as IData);
                    this.curTid=ans.tid;
                    this.oddshow=true;
                    console.log('CGame MaxOddsID:',this.Game.MaxOddsID);
                    this.curInterval=window.setInterval(this.getCurOdds,30000);
                }
            }
        }
    }
    getOdds(BT:number,Num:number){
        return this.Game.getOdds(BT,Num);
    }
    async getCurOdds(){
        const param:CommonParams = {
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
        //console.log('showlog',typeof(key),key);
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
        console.log('setStop',curCont,tmp);
        if(tmp.length>0) bt = tmp.join(',');
        const param:CommonParams = {
            GameID:this.curGameID,
            tid: this.curTid,
            isStop: stop,
            BetTypes: bt,
            UserID: this.store.personal.id
        }
        let ans:IMsg=await this.store.ax.getApi('setStop',param);
        console.log('setStop:',ans);
        if(ans.ErrNo===0){
            this.getCurOdds();
        }
    }
    showinfo(num,v) {
        console.log('showinfo',num,v);
    }
}
//export default Vue.extend({
    
//})
</script>
<style scoped>
.talign {
    line-height:48px;
    margin: auto;
}
</style>