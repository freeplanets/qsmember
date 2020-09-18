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
                <div class="col-1 test">{{$t('Table.isParlay')}}</div>
            </div>
            <div class="row"
                v-for="(itm,idx) in list"
                :key="idx"
            >
                <div :class="{'col-1':true,test:true,bgc:itm.Selected}">{{ itm.Title }}</div>
                <div :class="{'col-1':true,test:true,bgc:itm.Selected}">{{ itm.SubTitle }}</div>
                <div class='col-1 alignR'><input type="text" size='8' v-model="itm.Probability" /></div>
                <div class='col-1 test'><input type="checkbox" v-model="itm.isParlay" /></div>
            </div>
            <div v-if="PInfo.Levels==9"><q-btn color="red" icon-right="save" label="Save Odds Item" @click="saveDfOddsItems(GType);" /></div>            
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
import BaseOddsItem,{CondOfBetType} from './data/defaultData';
interface Slt {
  label:string;
  value:string;
}
interface DfOddsItems {
    GType: string;
    BetType: number;
    SubType: number;
    Num: string;
    ModifyID?: number;
}
@Component
export default class Probability extends Vue {
    private store = getModule(LayoutStoreModule);
    PR:Slt[]=[];
    slted:Slt={label:'',value:''};
    list:ProbT[]=[];
    GType:string='';
    @Watch('slted',{immediate:true,deep:true})
    onSltedChange(){
      //console.log('onSltedChange',this.slted);
      if(this.slted.value){
        this.GType=this.slted.value;
        this.getProbData(this.GType);
      }
    }
    get PInfo(){
      return this.store.personal;
    }
    async getProbData(GType:string){
      const param:CommonParams={
        sid:this.PInfo.sid,
        UserID: this.PInfo.id,
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
              Probability:0,
              isParlay:0
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
        console.log('getProbData:',rlt);
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
    async saveDfOddsItems(GType:string){
      if(!BaseOddsItem[GType]){
        return;
      }
      let data:DfOddsItems[]=[];
      //let chkdata:DfOddsItems[]=[];
      Object.keys(BaseOddsItem[GType]).map(bt=>{
        let itm:CondOfBetType = BaseOddsItem[GType][bt];
        if(itm.UserOtherBTOdds) return;     
        for(let i=itm.Min;i<=itm.Max;i++){
          let SubType=0;
          let Num=i+'';
          if(itm.SubTypeAsNum) SubType=i;
          let tmp:DfOddsItems={
            GType,
            BetType: parseInt(bt,10),
            SubType,
            Num,
            ModifyID: this.PInfo.id
          }
          if(itm.SameAsDigitalOrder){
            const anum=Num.split('');
            const chk:string[]=[];
            const dgt= itm.Digital ? itm.Digital : 0;
            while(anum.length<dgt){
              anum.push('0');
            }
            anum.map(nu=>{
              if(chk.indexOf(nu)===-1){
                chk.push(nu);
              }
            });
            if(dgt==3){
              if(chk.length===1) tmp.SubType=2;
              if(chk.length===2) tmp.SubType=1;
            } else {
              if(chk.length===1) tmp.SubType=1;
            }
            const tnum=parseInt(anum.sort().join(''),10)+'';                       
            //if(tmp.BetType===33){
            //  console.log('anum.chk:',tnum,anum.join(''));
            //}
            const f=data.find(elm=>elm.BetType===tmp.BetType && elm.Num===tnum)
            if(f) continue;
            //else {
            //  if(tmp.BetType===33) chkdata.push(tmp);
           //}
          } 
          data.push(tmp);
        }
      });
      //console.log('chkdata:',chkdata);
      ///*
        const param:CommonParams={
            UserID:this.PInfo.id,
            sid:this.PInfo.sid,
            ModifyID: this.PInfo.id,        
            data: JSON.stringify(data)
        }
        const msg:IMsg=await this.store.ax.getApi('SaveDfOddsItem',param,'post');
        if(msg.ErrNo===0){
            this.$q.dialog({
                title: this.$t('Label.Save') as string,
                message: 'OK!!'
            });         
        } else {
            this.$q.dialog({
                title: this.$t('Label.Save') as string,
                message: 'Error!!'
            });            
        }
        //*/
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
            UserID:this.PInfo.id,
            sid:this.PInfo.sid,
            ModifyID: this.PInfo.id,
            data: JSON.stringify(dtas)            
        }
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