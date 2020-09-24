<template>
  <div>
    <div class="row">
      <q-input standout="bg-teal text-white" v-model="Min" label="最小值" />
      <q-input standout="bg-teal text-white" v-model="Max" label="最大值" />
      <q-input standout="bg-teal text-white" v-model="Pos" label="字數" />
      <q-checkbox v-model="allowSameNum" label="可重複" />
      <q-checkbox v-model="NotOnlyDigital" label="包含英文字(16進位)" />
      <q-btn color="primary" label="分析"  @click="doHashAna()" />
    </div>
    <div class="row">
      <div>總筆數: {{HNum.Counter}}</div>
    </div>
    <div class="row">
      <q-btn-group>
        <q-btn 
          v-for="(itm,idx) in Btns"
          :key="'btn'+idx"
          :color="itm.color" 
          glossy :label="itm.title" @click="chgTitle(itm.title)" />
      </q-btn-group>
    </div>
    <div v-if="SNum.length>0">
      <div 
        v-for="(itm,idx) in SNum"
        :key="'numline'+idx" 
        class="row"
      >
        <div
          v-for="(num,nidx) in itm"
          :key="'block'+nidx"
        >
          <q-chip>
            <q-avatar :color="num.color" text-color="white">{{num.Num}}</q-avatar>
            {{num.Rate}}
          </q-chip>
        </div>
      </div>
    </div> 
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
//import {Watch} from 'vue-property-decorator'
import LayoutStoreModule from './data/LayoutStoreModule';
//import { QDialogOptions } from 'quasar';
import {getModule} from 'vuex-module-decorators';
import {CommonParams,IMsg} from './data/if';
import HASH from './class/HashAna';
interface KeyObj {
  [key:string]:number;
}
interface PosNum {
  Counter:number;
  Nums:KeyObj;
}
interface FailC {
  pos:number;
  Counter:number;
}
interface NumH {
  fails:FailC[];
  Counter:number;
  Num:PosNum[];
  TNum:PosNum;
}
interface NumBlock {
  Num:string;
  Rate:string;
  color:string;
}
@Component
export default class MyLayout extends Vue {
    private store = getModule(LayoutStoreModule);
    dStart:number=0;
    StopDo:boolean=false;
    steps:number=10000;
    curSteps:number=0;
    Max:string='49';
    Min:string='0';
    Pos:string='6';
    dfColor:string='secondary';
    sltColor:string='primary';
    Btns=[
      {title:'All',color:'primary'},
      {title:'1',color:'secondary'},
      {title:'2',color:'secondary'},
      {title:'3',color:'secondary'},
      {title:'4',color:'secondary'},
      {title:'5',color:'secondary'},
      {title:'6',color:'secondary'}
    ];
    HNum:NumH={
      fails:[],
      Counter:0,
      Num:[],
      TNum:{
        Counter:0,
        Nums:{}
      }
    };
    SNum:NumBlock[][]=[];
    Cols:number=10;
    allowSameNum:boolean=false;
    NotOnlyDigital:boolean=false;
    /*
    @Watch('allowSameNum',{ immediate: true, deep: true })
    onAllowSameNum(val:number){
        console.log(this.allowSameNum);
    }
    */
    get showProgress(){
        return this.store.showProgress;
    }
    set showProgress(v:boolean){
        this.store.setShowProgress(v);
    }
    get PInfo(){
      return this.store.personal;
    }
    async doHashAna(){
      this.showProgress=true;
      this.StopDo=false;
      this.setBtns();
      //while(!this.StopDo){
        await this.getBTCHashData();
      //}
      this.setBlock(this.HNum.TNum);
      this.showProgress=false;
    }
    async getBTCHashData(){
        /*
        if(this.curSteps===0){
          this.curSteps=this.steps;
        } else {
          this.dStart=this.curSteps;
          this.curSteps+=this.steps;
        }
        */
        this.HNum={
          fails:[],
          Counter:0,
          Num:[],
          TNum:{
            Counter:0,
            Nums:{}
          }
        };       
        const param:CommonParams={
            UserID:this.PInfo.id,
            sid:this.PInfo.sid,
            idx: this.dStart,
            steps: this.steps
        }
        const msg:IMsg=await this.store.ax.getApi('getBTCHashTable',param);
        //console.log('getBTCHashData:',msg);
        if(msg.ErrNo===0){
          if(msg.data){
            const dta=msg.data as {hashvalue:string}[];
            if(dta.length===0){
              this.StopDo=true;
              return;
            }
            dta.map(itm=>{
              const Max=parseInt(this.Max,10);
              const Min=parseInt(this.Min,10);
              const Pos=parseInt(this.Pos,10);
              const hl=new HASH(itm.hashvalue,Max,Min,Pos,this.allowSameNum,!this.NotOnlyDigital).NumLine;
              if(hl.length < Pos){
                if(this.HNum.fails){
                  let f=this.HNum.fails.find(itm=>itm.pos === hl.length);
                  if(f){
                    f.Counter+=1;
                  } else {
                    this.HNum.fails.push({pos:hl.length,Counter:1});  
                  }
                } else {
                  this.HNum.fails=[{pos:hl.length,Counter:1}];
                }
              } else {
                this.HNum.Counter+=1
                hl.map((num,idx)=>{
                  this.HNum.TNum.Counter+=1
                  if(this.HNum.TNum.Nums[`${num}`]){
                    this.HNum.TNum.Nums[`${num}`] +=1;
                  } else {
                    this.HNum.TNum.Nums[`${num}`]=1;
                  }
                  if(this.HNum.Num[idx]){
                    this.HNum.Num[idx].Counter+=1
                  } else {
                    this.HNum.Num[idx]={
                      Counter:1,
                      Nums:{}
                    }
                  }
                  if(this.HNum.Num[idx].Nums[`${num}`]){
                    this.HNum.Num[idx].Nums[`${num}`]+=1
                  } else {
                    this.HNum.Num[idx].Nums[`${num}`]=1;
                  }                  
                })
              }
            })
          }
          //console.log('getBTCHashData:',this.HNum);
        } else {
          console.log('getBTCHashData error:',msg);
        }
    }
    setBtns(){
      this.Btns=[];
      let len:number=parseInt(this.Pos,10)+1;
      for(let i=0;i<len;i++){
        if(i===0){
          this.Btns.push( {title:'All',color:this.sltColor});
        } else {
          this.Btns.push( {title:`${i}`,color:this.dfColor});
        }
      }
    }
    chgTitle(title:string){
      this.Btns.map((itm,idx)=>{
        if(itm.title===title){
          itm.color=this.sltColor;
          if(idx===0){
            this.setBlock(this.HNum.TNum);
          } else {
            this.setBlock(this.HNum.Num[idx-1]);
          }
        } else {
          itm.color=this.dfColor;
        }
        return itm;
      })
    }
    setBlock(pn:PosNum){
      console.log('Set Block:',pn);
      let nb:NumBlock[][]=[];
      let nn:NumBlock[]=[];
      Object.keys(pn.Nums).map(key=>{
        const r = pn.Nums[key]/pn.Counter*100;
        const tmp:NumBlock = {
          Num: key,
          Rate: r.toFixed(2),
          color: `red-${Math.floor(r*1.5)+1}`
        }
        nn.push(tmp);
        if(nn.length===this.Cols){
          nb.push(nn);
          nn=[];
        } 
      })
      if(nn.length > 0) nb.push(nn);
      this.SNum=nb;
      console.log('Set Block:',this.SNum);
    }
}
</script>
<style lang="less" scoped>

</style>