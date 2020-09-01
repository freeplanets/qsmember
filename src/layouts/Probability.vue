<template>
  <div>
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
import LayoutStoreModule from './data/LayoutStoreModule';
import {getModule} from 'vuex-module-decorators';
import PayRateData from './data/PayRateList';
import {Watch} from 'vue-property-decorator'
import { CommonParams,IMsg ,ProbTable} from './data/if';
import ProbT from './class/ProbabilityTable';
interface Slt {
  label:string;
  value:string;
}
@Component
export default class Probability extends Vue {
    private store = getModule(LayoutStoreModule);
    PR:Slt[]=[];
    slted:Slt={label:'',value:''};
    list:ProbT[]=[];
    @Watch('slted',{immediate:true,deep:true})
    onSltedChange(){
      console.log('onSltedChange',this.slted);
      if(this.slted.value){
        this.getProbData(this.slted.value);
      }
    }
    get pInfo(){
      return this.store.personal;
    }
    async getProbData(GType:string){
      const param:CommonParams={
        sid:this.pInfo.sid,
        UserID: this.pInfo.id,
        GType
      }
      this.list=[];
      const prd=PayRateData[GType].data;
      const odrs=PayRateData[GType].order;
      for(let i=0,n=odrs.length;i<n;i++){
        let bt=odrs[i];
        const tmp=prd[bt];
        tmp.map((itm,sbt)=>{
            const elm:ProbTable={
              id:0,
              GType,
              title: itm.Title,
              subtitle: itm.SubTitle ? itm.SubTitle : '',
              BetType: bt,
              SubType: sbt,
              Probability:0
            }
            this.list.push(new ProbT(elm));
        })
      }
      const msg:IMsg = await this.store.ax.getApi('getProbTable',param);
      if(msg.ErrNo===0){
        console.log(msg.data);
        const rlt=msg.data as ProbTable[];
        rlt.map(itm=>{
          const f = this.list.find(el=> el.BetType===itm.BetType && el.SubType === itm.SubType);
          if(f){
            f.id= itm.id;
            f.Probability = itm.Probability;
          }
        })
      } else {
        console.log(msg);
        this.$q.dialog({
          title: this.$t('Label.ProbabilityManage')+'',
          message: msg.ErrCon
        })
      }
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