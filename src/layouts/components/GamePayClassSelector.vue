<template>
  <div 
    class="q-pa-md row items-start q-gutter-md">
    <q-card 
      v-for="(game,idx) in games"
      :key="'game'+idx"
      :class="{'my-card':true,'bg-primary':game.isSelected,'bg-info':!game.isSelected,'text-white':true,'my-card-min-w':true}"
      @click="setSelect(game)"
    >
      <q-card-section>
        <div class="text-subtitle2">{{ game.title }}</div>
      </q-card-section>
      <q-separator dark />

      <q-card-actions
      >
        <q-select dense outlined v-model="game.PayClass" :options="game.PayClassList" />
      </q-card-actions>
    </q-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import {SelectOptions} from '../data/if';
import LayoutStoreModule from '../data/LayoutStoreModule';
/**
 * :store='yourvalue'
 * @setGames="functionName"
 */
interface PayClass {
  id:number;
  PayClassName:string;
  GameID:number;
}
export interface GamePayClass {
  id:number;
  title:string;
  isSelected:boolean;
  PayClass?:SelectOptions;
  PayClassList:SelectOptions[];
}
interface GamePC {
  GameID:number;
  PayClassID:number;
}

@Component
export default class GamePayClassSelector extends Vue {
  @Prop() readonly store?:LayoutStoreModule;
  @Prop() readonly uid?:number;
  @Prop() readonly PayClass?:string;
	games:GamePayClass[] = []
	async getGames(){
    let slted:GamePC[]=[]
    if(this.PayClass){
      slted = JSON.parse(this.PayClass);
    }
    if(!this.store) return;
    const ans:SelectOptions[] | undefined = await this.store.ax.getGames();
    if(ans){
      ans.map(itm=>{
          const tmp:GamePayClass={
            id:itm.value as number,
            title: itm.label as string,
            isSelected: false,
            PayClassList:[]
          }
          this.games.push(tmp);
      })
    }
    const pans = await this.store.ax.getPayClass();
    if(pans.ErrNo==0){
      const pc:PayClass[] = pans.data as PayClass[];
      //console.log('PayClass:',pc);
      pc.map(itm=>{
        let f = this.games.find(g=>g.id === itm.GameID);
        if(f){
          const tmp:SelectOptions = {
            value: itm.id,
            label: itm.PayClassName,
          }
          f.PayClassList.push(tmp);
          if(!f.PayClass){
            f.PayClass=Object.assign({},tmp);  
          }
        }
      })
    }
    if(slted.length>0){
      slted.map(gpc=>{
        let f = this.games.find(g=>g.id===gpc.GameID);
        if(f){
          if(f.PayClass){
            if(f.PayClass.value!=gpc.PayClassID){
              let fpc = f.PayClassList.find(pcl=>pcl.value===gpc.PayClassID);
              if(fpc){
                f.PayClass=Object.assign({},fpc);
              }
            }
          }
        }
      })
    }
  }
  setSelect(game:GamePayClass){
    //if(game.PayClass){
      game.isSelected = !game.isSelected;
      this.$emit('setPayClass',game);
    //}
  }
  async mounted(){
      await this.getGames();
      //console.log('GamePayClassSelector mounted:',this.games);
  }
}
</script>
<style scoped>
.my-card-min-w {
  min-width: 150px;
}
</style>