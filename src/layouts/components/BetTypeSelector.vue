<template>
  <q-select square filled dense v-model="model" :options="options" style="width:200px"/>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop,Watch} from 'vue-property-decorator';
import {SelectOptions} from '../data/if';
/**
 * :store='yourvalue'
 * @setGames="functionName"
 */
@Component
export default class BetTypeSelector extends Vue {
    @Prop() readonly GType?:string;
    @Watch('GType',{ immediate: true, deep: true })
    onGTypeChange(){
      //console.log('onGTypeChange',this.GType,val,oldval);
      this.getBetTypes();
    }
    models:SelectOptions = {value: 0,label:''};
    options:SelectOptions[] = []
    set model(v:SelectOptions){
          this.models = v;
          this.$emit('setBetType',v.value);
    }
    get model(){
          //console.log('get Model:', this.models);
      return this.models as SelectOptions;
      }
    async getBetTypes(){
        //console.log('getGames AddAllItem:',this.AddAllItem);
        this.options=[];
        this.options.push({value:0,label:'ALL'});
        if(this.GType){
          const bts=this.$t(`Game.${this.GType}.Item`);
          //console.log('getBetTypes',bts);
          Object.keys(bts).map(idx=>{
            const tmp:SelectOptions={
              value:parseInt(idx,10),
              label:bts[idx].title
            }
            this.options.push(tmp);
          })
          this.model = this.options[0];
        }
     }    

}
</script>
<style scoped>
</style>