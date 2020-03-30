<template>
    <div class="row">
        <div class="col test">{{ itm.Title }}</div>
        <div class="col test">{{ itm.SubTitle }}</div>
        <div class="col test"><q-input outlined dense v-model="itm.Profit" @change="doit()" /></div>
        <div class="col test"><q-input outlined dense v-model="itm.RateDefault" @change="doit()"/></div>
        <div class="col test"><q-input outlined dense v-model="itm.PateTop" @change="doit()" /></div>
        <div class="col test"><q-input outlined dense v-model="itm.Probability" @change="doit()" /></div>
        <div class="col test"><q-input outlined dense v-model="itm.Steps" @change="doit()" /></div>        
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
@Component
export default class BaseRateRow extends Vue {
    @Prop({required:true})
    public itm!:object;
    /*
    :value="itm.Profit"
    @input="update('Profit',$event)"
    update(key,value){
        //console.log('update',key,value,this.itm);
        //this.BasePayR[idx][key]=value;
        this.$emit('input', tap(cloneDeep(this.itm), v => set(v, key, value)))
    }
    */
    doit(){
        this.$emit('input');
    }
}
</script>