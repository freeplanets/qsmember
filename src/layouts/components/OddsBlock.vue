<template>
    <table
        v-if="Odds && Odds.BT"
     :class="{oddblock:true,oddblockRightLine:rightLine,oddblockBottomLine:bottomLine,Stoped:Odds.isStop===1}">
        <tr>
            <td class='col nums' :style="'backgroup-color:'+getColor()" v-if="titleLen>5">
                {{title}}
            </td>
            <td class='col nums' v-if="titleLen<6">
                <q-btn  round size="sm" :color="getColor()" :label="title" @click="showOdds" />
            </td>
            <td class='col data'>
                <div class='row' v-if="!EditMode && !NoOddsAdjust" @dblclick="SwitchMode(Odds.Odds)">
                    <div class='col btnpos'>
                        <q-btn v-if="UserTypes>2" dense style="font-szie:6px" icon="add" @click="setOdds(Odds.BT,Odds.Num,1,Odds.Steps)" />
                    </div>
                    <div class='col'>{{parseFloat(Odds.Odds.toFixed(4))}}</div>
                    <div class='col btnpos'>
                        <q-btn v-if="UserTypes>2" dense style="font-szie:6px" icon="remove" @click="setOdds(Odds.BT,Odds.Num,-1,Odds.Steps)" />
                    </div>
                </div>
                <div class='row' v-if="EditMode && !NoOddsAdjust" @dblclick="SwitchMode">
                    <div class='col btnpos'>
                        <q-btn dense icon="clear" @click="EditMode=false" />
                    </div>
                    <div class='col OddsEdit'>
                        <input type="text" v-model="NewOdds">
                    </div>
                    <div class='col btnpos'>
                        <q-btn v-if="UserTypes>2" dense icon="send" @click="setOdds(Odds.BT,Odds.Num)" />
                    </div>
                </div>
                <div class='row'
                    v-if="ExtOdds && !EditMode1 && !NoOddsAdjust"
                     @dblclick="SwitchMode1(ExtOdds.Odds)"
                >
                    <div class='col btnpos'>
                        <q-btn v-if="UserTypes>2" dense style="font-szie:6px" icon="add" @click="setOdds(ExtOdds.BT,ExtOdds.Num,1,ExtOdds.Steps)" />
                    </div>
                    <div class='col'>{{ExtOdds.Odds}}</div>
                    <div class='col btnpos'>
                        <q-btn v-if="UserTypes>2" dense style="font-szie:6px" icon="remove" @click="setOdds(ExtOdds.BT,ExtOdds.Num,-1,ExtOdds.Steps)" />
                    </div>
                </div>
                <div class='row' v-if="ExtOdds && EditMode1 && !NoOddsAdjust" @dblclick="SwitchMode1">
                    <div class='col btnpos'>
                        <q-btn dense icon="clear" @click="EditMode1=false" />
                    </div>
                    <div class='col OddsEdit'>
                        <input type="text" v-model="NewOdds1">
                    </div>
                    <div class='col btnpos'>
                        <q-btn v-if="UserTypes>2" dense icon="send" @click="setOdds(ExtOdds.BT,ExtOdds.Num)" />
                    </div>
                </div>
                <div class='row'>
                    <div class='col'>{{Math.round(Odds.tolS)}}</div>
                </div>
                <div class='row'>
                    <div class='col' :class="{redcolor:Odds.Risk ? Odds.Risk<0 : false}">{{Odds.Risk===0 ? '' : Odds.Risk}}</div>
                </div>
            </td>
        </tr>
    </table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { Odds } from './Odds/Games';
import { chkColor, itemName } from './func';
import { CommonParams } from '../data/if';
import LayoutStoreModule from '../data/LayoutStoreModule';

@Component
export default class OddsBlock extends Vue {
    @Prop() readonly store?:LayoutStoreModule;
    @Prop() readonly tid?:number;
    @Prop() readonly GameID?:number;
    @Prop() readonly Odds!:Odds;
    @Prop() readonly ExtOdds!:Odds;
    @Prop() readonly rightLine?:boolean;
    @Prop() readonly bottomLine?:boolean;
    @Prop() readonly GType?:string;
    @Prop() readonly colorWave?:boolean;
    @Prop() readonly colorExt?:number;
    @Prop() readonly dgt?:number;
    @Prop() readonly NoOddsAdjust?:boolean;
    NewOdds=0;
    EditMode=false;
    NewOdds1=0;
    EditMode1=false;
    usertypes=0;
    title='';
    @Watch('Odds', { immediate: true, deep: true })
    onOddsChange(newVal:Odds, oldVal:Odds) {
        if (!oldVal || oldVal.BT !== newVal.BT || oldVal.Num !== newVal.Num) {
            this.getItemName();
        }
        // console.log('onTitleChange',oldVal,newVal,this.Odds);
    }
    titleLen=0;
    get digital() {
        if (this.dgt) return this.dgt;
        return 1;
    }
    get UserTypes() {
        return this.usertypes;
    }
    getColor() {
        // console.log(this.Num,this.GType,this.colorWave,this.colorExt)
        let num = 0;
        if (this.Odds && this.Odds.Num) {
            num = this.Odds.Num;
        }
        if (this.colorWave || num > 1400) {
            const GType = (this.GType ? this.GType : '');
            const clr = chkColor(num, GType, this.colorExt);
            // console.log(this.Odds.Num,num,clr,this.GType,this.colorWave,this.colorExt)
            return clr;
        }
        return 'BlueWav';
    }
    getItemName() {
        let num = 0;
        let bt = 0;
        if (this.Odds) {
            if (this.Odds.Num) num = this.Odds.Num;
            if (this.Odds.BT) bt = this.Odds.BT;
        }
        /*
        if(this.GType==='3D' && bt===14){
            console.log('getItemName:',this.GType,bt,this.digital,this.dgt);
        }
        */
        // if(bt===0) return;
        this.title = itemName(bt, num, this, this.digital);
        this.titleLen = this.TitleLen(this.title);
        // console.log('getItemName:',bt,num,this.title);
        // return title;
    }
    TitleLen(t:string) {
        let len = 0;
        for (let i = 0, n = t.length; i < n; i++) {
            let code = t.charCodeAt(i);
            while (code > 0) {
                len += 1;
                code >>= 8;
            }
        }
        return len;
    }
    async setOdds(BT?:number, Num?:number, add?:number, step?:number) {
        // console.log('setOdds:',BT,Num,step);
        if (this.store) {
            /*
            if(this.Odds){
                if(this.Odds.isStop) return;
            }
            */
            const params:CommonParams = {
                tid: this.tid,
                GameID: this.GameID,
                BT,
                Num,
                Add: add,
                Step: step,
                UserID: this.store.personal.id,
                sid: this.store.personal.sid,
            };
            if (add) {
                params.Add = add;
            }
            if (step) {
                params.Step = step;
            } else if (this.EditMode) {
                    params.Step = this.NewOdds;
                } else {
                    params.Step = this.NewOdds1;
                }
            const ans = await this.store.ax.getApi('setOdds', params);
            // console.log('setOdds:',ans);
            if (ans) {
                this.$emit('OddChange');
                this.EditMode = false;
                this.EditMode1 = false;
            }
        }
    }
    SwitchMode(odds?:number) {
        if (this.UserTypes < 3) return;
        this.EditMode1 = false;
        this.EditMode = !this.EditMode;
        console.log('SwitchMode:', typeof odds);
        if (odds) {
            this.NewOdds = odds;
        }
    }
    SwitchMode1(odds?:number) {
        if (this.UserTypes < 3) return;
        this.EditMode = false;
        this.EditMode1 = !this.EditMode1;
        console.log('SwitchMode:', typeof odds);
        if (odds) {
            this.NewOdds1 = odds;
        }
    }
    showOdds() {
        console.log('OddsBlock:', this.Odds);
    }
    mounted() {
        // console.log('OddsBlock mounted:',this.Odds);
        // this.getItemName()
        if (this.store) this.usertypes = this.store.personal.Types;
    }
}
// export default Vue.extend({
    
// })
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
.OddsEdit input {
    height: 24px;
    padding: 0;
    width: 40px;
    text-align: right;
    font-size: 10px;
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
