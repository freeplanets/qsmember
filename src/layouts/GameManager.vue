<template>
<div class="gametable">
    <div class="row q-pa-sm">
        <div class="col-2"><GS :store='store' @setGames="setCurGames"></GS></div>
    </div>
    <div v-if="MyGame" class='my-pa-left'>
        <div class="row my-line-high">
            <div class="gamefield my-tb-head col-1">{{$t('Table.OfficeSite')}}</div>
            <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="MyGame.OfficeSite"/></div>
        </div>
        <div class="row my-line-high">
            <div class="gamefield my-tb-head col-1">{{$t('Table.StopBeforeEnd')}}</div>
            <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="MyGame.StopBeforeEnd"/></div>
        </div>
        <div class="row my-line-high">
            <div class="gamefield my-tb-head col-1">{{$t('Table.BothSideAdjust')}}</div>
            <div  class="gamefield col-12 col-md-3"><q-toggle v-model="MyGame.BothSideAdjust" /></div>
        </div>
        <div class="row my-line-high">
            <div class="gamefield my-tb-head col-1">{{$t('Table.AutoOpen')}}</div>
            <div class="gamefield col-12 col-md-3"><q-toggle v-model="MyGame.AutoOpen" /></div>
        </div>
        <div class="row my-line-high">
            <div class="gamefield my-tb-head col-1">{{$t('Table.TwoMoreGame')}}</div>
            <div class="gamefield row col-12 col-md-3">
                <div>{{$t('Table.TwoSide')}}</div>
                <div><q-input outlined dense v-model="MyGame.PDiffTwoSide"/></div>
                <div>{{$t('Table.ColorWave')}}</div>
                <div><q-input outlined dense v-model="MyGame.PDiffColorWave"/></div>
            </div>
        </div>
        <div class="row my-line-high">
            <div class="gamefield my-tb-head col-1">{{$t('Table.DelAfterBet')}}</div>
            <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="MyGame.DelAfterBet"/></div>
        </div>
        <div class="row my-line-high">
            <div class="gamefield my-tb-head col-1">{{$t('Table.DelBeforeEnd')}}</div>
            <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="MyGame.DelBeforeEnd"/></div>
        </div>
        <div class="row my-line-high">
            <div class="gamefield my-tb-head col-1">{{$t('Table.UseAvgOdds')}}</div>
            <div class="gamefield col-12 col-md-3"><q-toggle v-model="MyGame.UseAvgOdds" />({{$t('Label.UseAvgMsg')}})</div>
        </div>        
        <div class="row my-line-high" v-if="PInfo.Levels==9">
            <div class="gamefield my-tb-head col-1">{{$t('Table.GType')}}</div>
            <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="MyGame.GType"/></div>
        </div>
        <div class="row my-line-high">
            <div class="gamefield my-tb-head col-1">{{$t('Table.hasSPNO')}}</div>
            <div class="gamefield col-12 col-md-3"><q-toggle v-model="MyGame.hasSPNO" /></div>
        </div>
        <div class="row my-line-high">
            <div class="gamefield my-tb-head col-1">{{$t('Table.OpenNums')}}</div>
            <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="MyGame.OpenNums" /></div>
        </div>        
        <div class="row my-line-high">
            <div><q-btn color="green" icon-right="save" label="Save" @click="saveGame();" /></div>
            <div v-if="PInfo.Levels==999"><q-btn color="red" icon-right="save" label="SaveDfOddsItem" @click="SaveDfOddsItem();" /></div>
            <div v-if="PInfo.Levels==9"><q-btn color="red" icon-right="save" label="SaveGameCaption" @click="saveGameCaption();" /></div>
        </div>        
    </div>
</div> 
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Game} from './data/schema';
import LayoutStoreModule from './data/LayoutStoreModule';
import {getModule} from 'vuex-module-decorators';
import { SelectOptions,IMsg, ILoginInfo,CommonParams} from './data/if';
import {itemNameNew} from './components/func';
import getBetItems from './class/BetItems';
import {GameM} from './class/GameM';
import GameSelector from './components/GameSelector.vue';
Vue.component('GS',GameSelector);
interface OddsItem {
    GType:string;
    BetType:number;
    Num:string;
    [key:string]:string|number;
}
interface ItemSub {
    title:string;
    sctitle?:string[];
    shortT?:string;
    subTitle?:string[];
}
@Component
export default class GameManager extends Vue{
    store=getModule(LayoutStoreModule);
    MyGame:GameM|null=null;
    /*
    MyGame:Game={
        id:0,
        name:'',
        StopBeforeEnd:0,
        BothSideAdjust:0,
        AutoOpen:0,
        PDiffTwoSide:0,
        PDiffColorWave:0,
        DelAfterBet:0,
        DelBeforeEnd:0,
        LowestBet:0,
        TopPay:0,
        UseAvgOdds:0,
        GType:''        
    };
    */
    options:SelectOptions[]=[];
    gamelist:Game[]=[];
    get PInfo():ILoginInfo{
        return this.store.personal;
    }
    get ax(){
        return this.store.ax;
    }
    async setCurGames(v:SelectOptions){
        const gid:number=v.value as number;
        if(this.gamelist.length===0){
           await this.getGameList();
        }
        //console.log('setGurGames',this.gamelist);
        const g:Game|undefined=this.gamelist.find(itm=>{
            //console.log('setCurGames',itm.id,gid);
            if(itm.id===gid) return itm
        });
        //console.log('setCurGames',g);
        if(g){
            this.MyGame=new GameM(g);
        }
    }    
    async getGameList(){
        //GameList
        //const tmp:Game[]|undefined=await this.ax.getGameList(this.PInfo.id,this.PInfo.sid);
        const param:CommonParams={
            UserID:this.PInfo.id,
            sid:this.PInfo.sid
        }
        const msg:IMsg = await this.ax.getApi('GameList',param);
        //console.log('getGameList',msg);
        if(msg.ErrNo===0){
            let tmp:Game[]=msg.data as Game[];
            tmp.map((itm:Game)=>{
                if(itm.id){
                    this.gamelist.push(itm);
                }
            })
        }
    }
    async saveGame(){
        //const ans=
        if(this.MyGame){
            if(this.MyGame.DataChanged){
                const g:Game=this.MyGame.Datas;
                let msg:IMsg=await this.ax.saveGame(this.PInfo.id,this.PInfo.sid,g);
                if(msg.ErrNo===0){
                    this.$q.dialog({
                        title: this.$t('Label.Save') as string,
                        message: 'OK!!'
                    });                    
                } else {
                    this.$q.dialog({
                        title: this.$t('Label.Save') as string,
                        message: msg.ErrCon ? msg.ErrCon : 'Error!!'
                    });                     
                }
            }
        }
        //console.log('saveGame',ans);
    }
    async saveGameCaption(){
        const param:CommonParams={
            UserID:this.PInfo.id,
            sid:this.PInfo.sid,
            Game: '',
            BetType:''
        }
        const lang:string[] = ['zh-tw','zh-cn'];
        console.log('saveGameCaption');
        let dod=await this.getDfOddsItem();
        let gc = {};
        let btc = {};
        let chk = {};
        this.gamelist.map((itm:Game)=>{
            if(itm.GType){
                let gm={};
                gm['type']=itm.GType;
                if(!btc[`${itm.GType}`]) btc[`${itm.GType}`]={};
                lang.map(ln=>{
                    this.$i18n.locale=ln;
                    console.log('Lang:',ln);
                    gm[ln]=this.$t(`GameTitle.${itm.id}`);
                    if(chk[`${itm.GType}`]){
                        console.log(`${itm.id} ${itm.GType} done!!`);
                        return;
                    }                     
                    if(dod[`${itm.GType}`]){
                       dod[`${itm.GType}`].map((dta,bt)=>{
                           if(typeof(btc[`${itm.GType}`][`${bt}`])==='undefined') btc[`${itm.GType}`][`${bt}`]={};
                           btc[`${itm.GType}`][`${bt}`][`${ln}`]={
                               name: this.$t(`Game.${itm.GType}.Item.${bt}.title`)
                           }
                           if(dta){
                                let nums={};
                                dta.map(num=>{
                                    let aNum=itemNameNew(itm.GType,bt,num,this);
                                    if(itm.GType==='MarkSix' && bt===15){
                                        let tBT=Math.floor(num/100);
                                        let tPos= Math.floor((num-tBT*100)/10);
                                        aNum= this.$t(`Game.${itm.GType}.Item.${tBT}.sctitle.${tPos}`)+'-'+aNum;
                                    } else {
                                        const chkTemp:any = this.$t(`Game.${itm.GType}.Item.${bt}`);
                                        let chkItem:ItemSub= chkTemp as ItemSub;
                                        if(chkItem.sctitle){
                                            let base=10;
                                            if(itm.GType==='Happy' && bt===1){
                                                base=100;
                                                aNum=aNum % 100;
                                            }
                                            let scPos=Math.floor(num/base);
                                            if(!(itm.GType==='Cars' && bt !==1)){
                                                if(itm.GType==='Cars' && bt ===1){
                                                    if(aNum===10 || aNum===0) scPos=scPos-1
                                                }
                                                aNum= this.$t(`Game.${itm.GType}.Item.${bt}.sctitle.${scPos}`)+'-'+aNum;                                             
                                            }
                                        }
                                    }
                                    if(num !== parseInt(aNum,10)) nums[`${num}`]=aNum;
                                });
                                let chkLen=Object.keys(nums).length
                                if(chkLen>0){
                                    btc[`${itm.GType}`][`${bt}`][`${ln}`]['values']=nums;
                                }
                           }
                       }) 
                    }
                })
                console.log('gc:',itm.id,gm);
                gc[`${itm.id}`]=gm;
                chk[`${itm.GType}`]=true;                
            }
        })
        this.$i18n.locale='zh-tw';
        //console.log('saveGameCaption:',gc);
        //console.log('saveGameCaption:',btc);
        param.Game = JSON.stringify(gc);
        param.BetType = JSON.stringify(btc);
        //let GC=this.$t('GameTitle');

        const msg= await this.ax.getApi('saveGameCaption',param,'post');
        //const ans = await this.ax.createBetItems(param);
        console.log(msg);
        this.$q.dialog({
            title: this.$t('Label.Save') as string,
            message: msg.ErrNo===0 ? 'OK!!' : 'Error!!'
        });
    }
    async getDfOddsItem(){
        const param:CommonParams={
            UserID:this.PInfo.id,
            sid:this.PInfo.sid,
        }
        const msg= await this.ax.getApi('getDfOddsItem',param);
        let tmp:number[][][]=[];
        if(msg.data){
            let data:OddsItem[]=msg.data as OddsItem[];
            data.map(itm=>{
                if(typeof(tmp[itm.GType])==='undefined') tmp[itm.GType]=[];
                if(typeof(tmp[itm.GType][itm.BetType])==='undefined') tmp[itm.GType][itm.BetType]=[];
                tmp[itm.GType][itm.BetType].push(parseInt(itm.Num,10))
            })
        }
        console.log(tmp);
        return tmp;        
    }
    async SaveDfOddsItem(){
        if(this.MyGame){
            const GameID = this.MyGame.Datas.id;
            const BetItems=getBetItems(GameID);
            if(!BetItems){
                console.log('BetItems error');
                return;
            }
            const param:CommonParams={
                UserID:this.PInfo.id,
                sid:this.PInfo.sid,
                GameID,
                ModifyID: this.PInfo.id,
                data: JSON.stringify(BetItems)
            }
            const msg= await this.ax.getApi('createBetItems',param,'post');
            //const ans = await this.ax.createBetItems(param);
            console.log(msg);
            if(msg.ErrNo===0){
                this.$q.dialog({
                    title: this.$t('Label.Save') as string,
                    message: 'OK!!'
                });                    
            }
        }
    }    
    mounted(){
        if(!this.store.isLogin){
            this.$router.push({path:'/login'});
        }           
        //this.getGameList();
    }
}
</script>
<style>
.gamefield {
    border: 1px solid rgba(86,61,124,.2)
}
.my-tb-head {
    background-color: cadetblue;
    color:cornsilk;
    text-align: center;
}
.my-pa-left {
    padding-left: 12px;
}
.my-line-high {
    line-height: 40px;
}
</style>