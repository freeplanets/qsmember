<template>
    <table :class="{oddblock:true,oddblockRightLine:rightLine,oddblockBottomLine:bottomLine,Stoped:Odds.isStop===1}">
        <tr>
            <td class='col nums'>
                <q-btn round size="sm" :color="getColor()" :label="getItemName()" />
            </td>
            <td class='col data'>
                <div class='row'>
                    <div class='col btnpos'>
                        <q-btn dense style="font-szie:6px" icon="add" @click="setOdds(Odds.BT,Odds.Num,1)" />
                    </div>
                    <div class='col'>{{Odds.Odds}}</div>
                    <div class='col btnpos'>
                        <q-btn dense style="font-szie:6px" icon="remove" @click="setOdds(Odds.BT,Odds.Num,-1)" />
                    </div>
                </div>
                <div class='row'
                    v-if="ExtOdds"
                >
                    <div class='col btnpos'>
                        <q-btn dense style="font-szie:6px" icon="add" @click="setOdds(ExtOdds.BT,ExtOdds.Num,1)" />
                    </div>
                    <div class='col'>{{ExtOdds.Odds}}</div>
                    <div class='col btnpos'>
                        <q-btn dense style="font-szie:6px" icon="remove" @click="setOdds(ExtOdds.BT,ExtOdds.Num,-1)" />
                    </div>
                </div>
                <div class='row'>    
                    <div class='col'>{{Odds.tolS}}</div>
                </div>
                <div class='row'>
                    <div class='col' :class="{redcolor:Odds.Risk<0}">{{Odds.Risk}}</div>
                </div>
            </td>
        </tr>
    </table>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import {IOdds} from './Games';
import {chkColor,itemName} from './func';
import AxApi from './AxApi';
import {CommonParams} from '../data/if';
@Component
export default class TestComp extends Vue {
    @Prop() readonly UserID?:number;
    @Prop() readonly tid?:number;
    @Prop() readonly GameID?:number;
    @Prop({}) readonly Odds?:IOdds;
    @Prop({}) readonly ExtOdds?:IOdds;
    @Prop() readonly rightLine?:boolean;
    @Prop() readonly bottomLine?:boolean;
    @Prop() readonly GType?:string;
    @Prop() readonly colorWave?:boolean;
    @Prop() readonly colorExt?:number;
    getColor(){
        //console.log(this.Num,this.GType,this.colorWave,this.colorExt)
        const num=this.Odds ? (this.Odds.Num ? this.Odds.Num : 0) : 0;
        if(this.colorWave || num > 1400){
            const GType=(this.GType? this.GType : '');
            return chkColor(num,GType,this.colorExt);
        }
        return 'blue-grey';
    }
    getItemName(){
        const num=this.Odds ? (this.Odds.Num ? this.Odds.Num : 0) : 0;  
        const bt=this.Odds ? (this.Odds.BT ? this.Odds.BT : 0) : 0;
        return itemName(bt,num,this);
    }
    async setOdds(BT:number,Num:number,step:number){
        //console.log('setOdds:',BT,Num,step);
        if(this.Odds){
            if(this.Odds.isStop) return;
        }
        const params:CommonParams={
            tid:this.tid,
            GameID:this.GameID,
            BT:BT,
            Num:Num,
            Step:step,
            UserID:this.UserID
        }
        const ans=await AxApi.getApi('setOdds',params);
        //console.log('setOdds:',ans);
        this.$emit('OddChange');
    }
    mounted(){
        //console.log('OddsBlock mounted:',this.Odds);

    }
}
//export default Vue.extend({
    
//})
</script>
<style scoped>
.oddblock {
    width: 100%;
    height: 80px;
    border-left: solid 1px;
    border-top: solid 1px;
}
.oddblockRightLine {
    border-right: solid 1px;
}
.oddblockBottomLine {
    border-bottom: solid 1px;
}
.nums {
    width: 30%;
    height: 100%;
    background-color: #AED6F1;
    text-align: center;
}
.datta {
    width: 70%;
    height: 100%;
    border: 0;
}
.row {
    text-align: center;
}
.btnpos .q-btn {
    background-color:#ABB2B9;
    color:white;
    font-size: 6px !important;
}
.redcolor {
    color:red;
}
.Stoped {
    background-color:#ABB2B9;
}
/*---------------*/
/*  Ball Bgcolor */
/*---------------*/
.red_ball {
  background-color: #c23437;
}
.blue_ball {
  background-color: #1c76b3;
}
.green_ball {
  background-color: #369c57;
}
.bg-GreenWav {
  background-color: #2ECC71;
}
.bg-RedWav {
  background-color: #C0392B;
}
.bg-BlueWav {
  background-color: #2980B9;
}
.bg-GreenWavTxt {
  color: #2ECC71 !important;
}
.bg-RedWavTxt {
  color: #C0392B !important;
}
.bg-BlueWavTxt {
  color: #2980B9 !important;
}
</style>