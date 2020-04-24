<template>
  <q-select v-if='GameID' square filled dense v-model="ClassName" :options="clsNameList" style="width:200px" transition-show='fade' />  
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator';
import {SelectOptions,PayClass,IMsg} from '../data/if';
import {AxApi} from './AxApi';

@Component
export default class PayClassSelector extends Vue {
  @Prop() readonly ax?:AxApi;
  @Prop() GameID?:number;
  @Prop() itmChange:boolean=false;
  @Watch('GameID',{ immediate: true, deep: true })
  onGameIDChange(){
  //onGameIDChange(val?:number,oldval?:number){
    //console.log('onGameIDChange:',val,oldval);
    this.chkPayCls();
  }
  @Watch('itmChange',{ immediate: true, deep: true })
  onItmChange(v){
    //console.log('onItmChange:',v);
    if(v){
      this.chkPayCls();
    }
  }
  private curItem:SelectOptions|null = null;
  //private clsName:SelectOptions | null = null;
  get ClassName():SelectOptions {
      return this.curItem as SelectOptions;
  }
  set ClassName(v:SelectOptions){
      this.curItem = v;
      const pc:PayClass={
        id:v.value as number,
        PayClassName: v.label as string
      }
      this.$emit('setPayClass',pc)
  }  
  clsNameList:SelectOptions[]= [];
  public async chkPayCls(){
      if(this.GameID){
        const data:PayClass[] = await this.getPayCls(this.GameID);
        this.clsNameList=[];
        if(data.length>0){
            let firstItm:SelectOptions|undefined;
            data.map((itm:PayClass)=>{
                const tmp:SelectOptions={
                    value: itm.id,
                    label: itm.PayClassName
                }
                this.clsNameList.push(tmp);
                if(!firstItm) firstItm = tmp;
                if(!this.curItem) this.curItem=tmp;
            });
            if(this.curItem){
              const pItem = this.curItem;
              const f=this.clsNameList.find(itm=>itm.value===pItem.value)
              if(f){
                this.ClassName = f;
              } else {
                if(firstItm){
                  this.ClassName = firstItm;
                }
              }
            } 
        }
      }
  }
  async getPayCls(gid:string|number) {
      let data:PayClass[] = [];
      if(this.ax){
        const ans:IMsg=await this.ax.getPayClass(gid);
        if(ans.ErrNo==0){
            data=ans.data as PayClass[];
        }
      }
      return data;
  }
  
}
</script>