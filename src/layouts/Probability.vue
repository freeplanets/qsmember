<template>
  <div>
    <div>{{propA}}</div>
    <div class="q-pa-md" style="max-width: 300px">
      <div class="q-gutter-md">
        <q-select outlined v-model="slted" :options="PR" :label="$t('Label.PlsSlt')+''" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import PayRateData from './data/PayRateList';
import {Prop,Watch} from 'vue-property-decorator'
interface Slt {
  label:string;
  value:string;
}
@Component
export default class Probability extends Vue {
    @Prop(Number) readonly propA?:number;
    PR:Slt[]=[];
    slted:Slt={label:'',value:''};
    @Watch('slted',{immediate:true,deep:true})
    onSltedChange(){
      console.log('onSltedChange',this.slted);
    }
    mounted(){
      Object.keys(PayRateData).map(key=>{
        const tmp:Slt={
          value: key,
          label: this.$t(`Label.Game.${key}`)+''
        }
        this.PR.push(tmp);
      });
      console.log(this.PR);
    }
}
//export default Vue.extend({
    
//})
</script>