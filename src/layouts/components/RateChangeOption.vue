<template>
    <div style='width:100%'>
    <div class="row profit">
        <div class='col' v-if='showUpLimit'>
            賠率上限=(1 - 預定利潤
            <input 
                maxlenght=8
                v-model="pfRateTop" />
            %)/機率
            <q-btn round size="xs" color="primary" icon="autorenew" @click="updateRateTop()"/>
        </div>
        <div class='col'>賠率 = (1 - 利潤
            <input
                maxlenght=8
                v-model="pfRate" />
            %)/機率
            <q-btn round size="xs" color="primary" icon="autorenew" @click="updateRateDefault()" />
        </div>
        <div class='col' v-if='showUpLimit'>單碼滿倉=風險金額
            <input
                maxlenght=8
                v-model="pfRisk" />
            /不含本金賠率
            <q-btn round size="xs" color="primary" icon="autorenew" @click="updateSingleNum()" />
        </div>
        <div class='col' v-if='showUpLimit'>最小單注=
            <input
                maxlenght=8
                v-model="pfMin" />
            <q-btn round size="xs" color="primary" icon="autorenew" @click="updateMinBet()" />
        </div>                      
    </div>
    <div class="row profit" v-if='showUpLimit'>           
        <div class='col' >押碼啟動金額 = 不降賠可承受風險
            <input
                maxlenght=8
                v-model="pfTopRisk" />
            /不含本金賠率
            <q-btn round size="xs" color="primary" icon="autorenew" @click="updateChangeStart()" />
        </div>
        <div class='col' v-if='showUpLimit'>押碼金額 = 押碼風險金額
            <input
                maxlenght=8
                v-model="pfBetRisk" />
            /不含本金賠率
            <q-btn round size="xs" color="primary" icon="autorenew" @click="updateBetForChange()" />
        </div>
        <div class='col' v-if='showUpLimit'>押碼點數 = 跳動點*
            <input
                maxlenght=8
                v-model="pfSteps" />
            <q-btn round size="xs" color="primary" icon="autorenew" @click="updateBetSteps()" />
        </div>        
        <div class='col' v-if='showUpLimit'>最大單注=
            <input
                maxlenght=8
                v-model="pfMax" />
            <q-btn round size="xs" color="primary" icon="autorenew" @click="updateMaxBet()" />
        </div>  
    </div>
    </div>    
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
/**
 * :showUpLimit='true/false';
 * @updateRateTop="functionName"
 * @updateRateDefault="functionName"
 */
@Component
export default class RateChangeOption extends Vue{
    @Prop() readonly showUpLimit?:boolean;
    private pfRateTop:number = 0;
    private pfRate:number = 0;
    private pfRisk:number = 0;
    private pfMin:number=0;
    private pfMax:number=0;
    private pfTopRisk:number = 0;
    private pfBetRisk:number = 0;
    private pfSteps:number = 0;
    updateRateTop(){
        this.$emit('updateRateTop',this.pfRateTop);
    }
    updateRateDefault(){
        this.$emit('updateRateDefault',this.pfRate);
    }
    updateSingleNum(){
        this.$emit('updateSingleNum',this.pfRisk)
    }
    updateMinBet(){
        this.$emit('updateMinBet',this.pfMin);
    }
    updateMaxBet(){
        this.$emit('updateMaxBet',this.pfMax);
    }
    updateChangeStart(){
        this.$emit('updateChangeStart',this.pfTopRisk);
    }
    updateBetForChange(){
        this.$emit('updateBetForChange',this.pfBetRisk);
    }
    updateBetSteps(){
        this.$emit('updateBetSteps',this.pfSteps);
    }
}
</script>
<style scoped>
    .profit input {
        max-width: 80px;
    }
    .profit {
        padding: 0px 8px;
    }
</style>