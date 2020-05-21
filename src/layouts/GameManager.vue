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
            <div  class="gamefield col-12 col-md-3"><q-toggle v-model="MyGame.AutoOpen" /></div>
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
            <div class="gamefield col-12 col-md-3"><q-toggle v-model="MyGame.UseAvgOdds" /></div>
        </div>        
        <div class="row my-line-high">
            <div class="gamefield my-tb-head col-1">{{$t('Table.GType')}}</div>
            <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="MyGame.GType"/></div>
        </div>            
        <div class="row my-line-high">
            <div><q-btn color="green" icon-right="save" label="Save" @click="saveGame();" /></div>
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
import { SelectOptions,IMsg} from './data/if';
import {GameM} from './class/GameM';
import GameSelector from './components/GameSelector.vue';
Vue.component('GS',GameSelector);
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
    get ax(){
        return this.store.ax;
    }
    async setCurGames(v:SelectOptions){
        const gid:number=v.value as number;
        if(this.gamelist.length===0){
           await this.getGameList();
        }
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
        const tmp:Game[]=await this.ax.getGameList();
        //console.log('getGameList',tmp);
        if(tmp){
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
                let msg:IMsg=await this.ax.saveGame(g);
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