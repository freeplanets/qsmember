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
  @Watch('GameID',{ immediate: true, deep: true })
  onGameIDChange(val:number,oldval:number){
    console.log('onGameIDChange:',val,oldval);
    this.chkPayCls();
  }
  
  private clsName:SelectOptions | null = null;
  get ClassName() {
      return this.clsName as SelectOptions;
  }
  set ClassName(v:SelectOptions){
      this.clsName = v;
      const pc:PayClass={
        id:v.value as number,
        PayClassName: v.label as string
      }
      this.$emit('setPayClass',pc)
  }  
  clsNameList:SelectOptions[]= [];
  public async chkPayCls(){
      console.log('chkPayCls:',this.GameID);
      if(this.GameID){
        const data:PayClass[] = await this.getPayCls(this.GameID);
        this.clsNameList=[];
        if(data.length>0){
            let firstItem:SelectOptions|undefined;
            data.map((itm:PayClass)=>{
                const tmp:SelectOptions={
                    value: itm.id,
                    label: itm.PayClassName
                }
                this.clsNameList.push(tmp);
                if(!firstItem) firstItem=tmp;
            });
            if(firstItem) this.ClassName = firstItem;
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