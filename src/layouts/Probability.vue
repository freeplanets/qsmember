<template>
  <div>
    <div class="row q-pa-md" >
      <div class="col-2 q-gutter-md">
        <q-select outlined v-model="slted" :options="PR" :label="$t('Label.PlsSlt')+''" />
      </div>
      <div class='col-1 pbtn'><q-btn color="blue" icon-right="save" label="Save" @click="SaveData();" /></div>
    </div>
        <div class="q-pa-md" v-if="list.length>0">
            <div class="row testheader">
                <div class="col-1 test">{{$t('Table.ItemName')}}</div>
                <div class="col-1 test">{{$t('Table.SubName')}}</div>
                <div class="col-1 test">{{$t('Table.Probability')}}(%)</div>
            </div>
            <div class="row"
                v-for="(itm,idx) in list"
                :key="idx"
            >
                <div :class="{'col-1':true,test:true,bgc:itm.Selected}">{{ itm.Title }}</div>
                <div :class="{'col-1':true,test:true,bgc:itm.Selected}">{{ itm.SubTitle }}</div>
                <div class='col-1 alignR'><input type="text" size='8' v-model="itm.Probability" /></div>            
            </div>
        </div>         
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import LayoutStoreModule from './data/LayoutStoreModule';
import { QDialogOptions } from 'quasar';
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
      //console.log('onSltedChange',this.slted);
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
              //title: itm.Title,
              //subtitle: itm.SubTitle ? itm.SubTitle : '',
              BetType: parseInt(bt,10),
              SubType: sbt,
              Probability:0
            }
            const pt=new ProbT(elm);
            pt.Title = itm.Title;
            pt.SubTitle =  itm.SubTitle ? itm.SubTitle : '';
            this.list.push(pt);
        })
      }
      const msg:IMsg = await this.store.ax.getApi('getProbTable',param);
      if(msg.ErrNo===0){
        const rlt=msg.data as ProbTable[];
        //console.log(rlt,this.list);
        rlt.map(itm=>{
          const f = this.list.find(el=> el.BetType===itm.BetType && el.SubType === itm.SubType);
          if(f){
            //console.log('find:',f);
            f.id= itm.id;
            f.Probability = itm.Probability;
          } 
        })
      } else {
        //console.log(msg);
        const opts:QDialogOptions = {
          title: this.$t('Label.ProbabilityManage')+'',
          message: msg.ErrCon          
        } 
        this.$q.dialog(opts);
      }
    }
    SaveData(){
        const dtas:ProbTable[] = [];
        this.list.map(itm=>{
            if(itm.DataChanged) {
                dtas.push(itm.Datas);
            }
        })
        if(dtas.length>0){
            this.sendData(dtas);
        }
    }
    async sendData(dtas:ProbTable[]){
        const param:CommonParams={
            UserID:this.pInfo.id,
            sid:this.pInfo.sid,
            ModifyID: this.pInfo.id,
            data: JSON.stringify(dtas)            
        }
        /*
 		const data = {
			GameID: this.models.value,
            ModifyID: this.UserID,
            data: JSON.stringify(dtas)
        }
        */
        const msg:IMsg=await this.store.ax.getApi('batch/saveProbTable',param,'post');
        if(msg.ErrNo===0){
            this.$q.dialog({
                title: this.$t('Label.Save') as string,
                message: 'OK!!'
            });
            dtas.map(itm=>{
                const tmp = this.list.find(elm => elm.BetType == itm.BetType && elm.SubType == itm.SubType)
                if(tmp){
                    tmp.DataChanged = false;
                }
            })            
        } else {
            this.$q.dialog({
                title: this.$t('Label.Save') as string,
                message: msg.ErrCon
            });            
        } 
    }    
    mounted(){
      if(!this.store.isLogin){
          this.$router.push({path:'/login'});
      }
      Object.keys(PayRateData).map(key=>{
        const tmp:Slt={
          value: key,
          label: this.$t(`Label.Game.${key}`)+''
        }
        this.PR.push(tmp);
      });
      //console.log(this.PR);
    }
}
//export default Vue.extend({
    
//})
</script>
<style scoped>
.testheader div {
    background-color: cadetblue;
    color:white;
}
.test {
    border: 1px gray solid;
    text-align: center;
    vertical-align: middle;
}
.alignR {
  border: 1px gray solid;
  vertical-align: middle;
  text-align: left;
}
.alignR input {
    width: 100%;
}
</style>