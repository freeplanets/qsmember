<template>
    <div class="row profit">
        <div class='col-3' v-if='showUpLimit'>
            賠率上限=(1 - 預定利潤
            <input 
                maxlenght=2
                v-model="pfRateTop" />
            %)/機率【轉換】
            <q-btn round size="xs" color="primary" icon="autorenew" @click="updateRateTop()"/>
        </div>
        <div class='col-3'>利潤
            <input
                maxlenght=2
                v-model="pfRate" />
            %=(1-原始賠率 x 機率)x100【轉換】
            <q-btn round size="xs" color="primary" icon="autorenew" @click="updateRateDefault()" />
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
    updateRateTop(){
        this.$emit('updateRateTop',this.pfRateTop);
    }
    updateRateDefault(){
        this.$emit('updateRateDefault',this.pfRate);
    }
}
</script>
<style scoped>
    .profit input {
        max-width: 40px;
    }
    .profit {
        padding: 0px 8px;
    }
</style>