<template>
<div class="gametable">
    <div class="row">
        <div class="gamefield col-12 col-md-1">{{$t('Label.GameName')}}</div>
        <div class="gamefield col-12 col-md-3"><q-select square filled dense v-model="model" :options="options" style="width:200px"/></div>
    </div>
    <div class="row">
        <div class="gamefield col-12 col-md-1">{{$t('Table.OfficeSite')}}</div>
        <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="MyGame.OfficeSite"/></div>
    </div>
    <div class="row">
        <div class="gamefield col-12 col-md-1">{{$t('Table.StopBeforeEnd')}}</div>
        <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="MyGame.StopBeforeEnd"/></div>
    </div>
    <div class="row">
        <div class="gamefield col-12 col-md-1">{{$t('Table.BothSideAdjust')}}</div>
        <div  class="gamefield col-12 col-md-3"><q-toggle v-model="MyGame.BothSideAdjust" /></div>
    </div>
    <div class="row">
        <div class="gamefield col-12 col-md-1">{{$t('Table.AutoOpen')}}</div>
        <div  class="gamefield col-12 col-md-3"><q-toggle v-model="MyGame.AutoOpen" /></div>
    </div>
    <div class="row">
        <div class="gamefield col-12 col-md-1">{{$t('Table.TwoMoreGame')}}</div>
        <div class="gamefield row col-12 col-md-3">
            <div>{{$t('Table.TwoSide')}}</div>
            <div><q-input outlined dense v-model="MyGame.PDiffTwoSide"/></div>
            <div>{{$t('Table.ColorWave')}}</div>
            <div><q-input outlined dense v-model="MyGame.PDiffColorWave"/></div>
        </div>
    </div>
    <div class="row">
        <div class="gamefield col-12 col-md-1">{{$t('Table.DelAfterBet')}}</div>
        <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="MyGame.DelAfterBet"/></div>
    </div>
    <div class="row">
        <div class="gamefield col-12 col-md-1">{{$t('Table.DelBeforeEnd')}}</div>
        <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="MyGame.DelBeforeEnd"/></div>
    </div>
    <div class="row">
        <div class="gamefield col-12 col-md-1">{{$t('Table.LowestBet')}}</div>
        <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="MyGame.LowestBet"/></div>
    </div>
    <div class="row">
        <div class="gamefield col-12 col-md-1">{{$t('Table.TopPay')}}</div>
        <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="MyGame.TopPay"/></div>
    </div>
    <div class="row">
        <div class="gamefield col-12 col-md-1">{{$t('Table.GType')}}</div>
        <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="MyGame.GType"/></div>
    </div>            
    <div class="row">
        <div><q-btn color="green" icon-right="save" label="Save" @click="saveGame();" /></div>
    </div>        
</div> 
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Game} from './data/schema';
import LayoutStoreModule from './data/LayoutStoreModule';
import {getModule} from 'vuex-module-decorators';
import { SelectOptions} from './data/if';
@Component
export default class GameManager extends Vue{
    store=getModule(LayoutStoreModule);
    MyGame:Game={
        id:0,
        name:'',
        StopBeforeEnd:'',
        BothSideAdjust:false,
        AutoOpen:false,
        PDiffTwoSide:0,
        PDiffColorWave:0,
        DelAfterBet:0,
        DelBeforeEnd:0,
        LowestBet:0,
        TopPay:0,
        GType:''        
    };
    options:SelectOptions[]=[];
    private gamelist:Game[]=[];
    private models:SelectOptions={};
    set model(v:SelectOptions){
        this.models=v;
        if(this.gamelist.length==0) {
            return;
        }
        const id:number=v.value as number;
        
        const t:Game=this.gamelist.find(itm => itm.id===id) as Game;
        if(t){
            this.MyGame = t;
        }
    }
    get model(){
        return this.models;
    }
    get ax(){
        return this.store.ax;
    }
    async getGameList(){
        const tmp:Game[]=await this.ax.getGameList();
        //console.log('getGameList',tmp);
        if(tmp){
            tmp.map((itm:Game)=>{
                if(itm.id){
                    this.gamelist.push(itm);
                    const opt:SelectOptions = {
                        label: itm.name,
                        value: itm.id
                    }
                    this.options.push(opt);
                }
            })
        }
    }
    async saveGame(){
        //const ans=
        await this.ax.saveGame(this.MyGame);
        //console.log('saveGame',ans);
    }
    mounted(){
        if(!this.store.isLogin){
            this.$router.push({path:'/login'});
        }           
        this.getGameList();
    }
}
</script>
<style>
.gametable .gamefield {
    border: 1px solid rgba(86,61,124,.2)
}
</style>