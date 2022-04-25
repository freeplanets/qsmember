<template>
  <div
    class="q-pa-md row items-start q-gutter-md">
    <q-card
      v-for="(game,idx) in games"
      :key="'game'+idx"
      :class="{'my-card':true,'bg-primary':game.isSelected,'bg-info':!game.isSelected,'text-white':true,'my-card-min-w':true}"
    >
      <q-card-section>
        <div class="text-subtitle2">{{ game.title }}</div>
      </q-card-section>
      <q-separator dark />

      <q-card-actions
      >
        <q-select dense outlined v-model="game.PayClass" :options="game.PayClassList"/>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { cloneDeep } from 'lodash';
import { SelectOptions } from '../data/if';
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
  @Prop() readonly emptyitem?:boolean;
  @Prop() readonly PayClass?:string;
  @Watch('PayClass', { immediate: true, deep: true })
  onPayClassChange() {
    // console.log('onPayClassChange',this.PayClass);
    if (this.PayClass) {
      this.slted = JSON.parse(this.PayClass);
    }
  }
  @Watch('games', { immediate: true, deep: true })
  onGamesChange(o:GamePayClass[], n:GamePayClass[]) {
    if (o === n) {
      this.games = cloneDeep(this.games);
      this.games.map((game) => {
          this.setSelect(game);
      });
    }
  }
  slted:GamePC[]=[];
  games:GamePayClass[] = [];
  setSelected() {
    if (this.slted.length > 0) {
      this.slted.map((gpc) => {
        const f = this.games.find((g) => g.id === gpc.GameID);
        if (f) {
          if (f.PayClass) {
            if (f.PayClass.value !== gpc.PayClassID) {
              const fpc = f.PayClassList.find((pcl) => pcl.value === gpc.PayClassID);
              if (fpc) {
                f.PayClass = { ...fpc };
              }
            }
          }
        }
      });
    }
  }
	async getGames() {
    if (this.PayClass) {
      this.slted = JSON.parse(this.PayClass);
    }
    if (!this.store) return;
    const UserID = this.store.personal.id;
    const sid = this.store.personal.sid;
    const ans:SelectOptions[] | undefined = await this.store.ax.getGames();
    if (ans) {
      ans.map((itm) => {
          const tmp:GamePayClass = {
            id: itm.value,
            title: itm.label,
            isSelected: false,
            PayClassList: [],
          };
          if (this.emptyitem) {
            tmp.PayClassList.push({ value: 0, label: '' });
          }
          this.games.push(tmp);
      });
    }
    const pans = await this.store.ax.getPayClass(UserID, sid);
    if (pans.ErrNo === 0) {
      const pc:PayClass[] = pans.data as PayClass[];
      // console.log('PayClass:',pc);
      pc.map((itm) => {
        const f = this.games.find((g) => g.id === itm.GameID);
        if (f) {
          const tmp:SelectOptions = {
            value: itm.id,
            label: itm.PayClassName,
          };
          f.PayClassList.push(tmp);
          if (!f.PayClass) {
            f.PayClass = { value: 0, label: '' };
          }
        }
      });
    }
    this.setSelected();
  }
  setSelect(game:GamePayClass) {
    // if(game.PayClass){
      // game.isSelected = !game.isSelected;
      if (game.PayClass) {
        const tmp:GamePC = {
          GameID: game.id,
          PayClassID: game.PayClass.value,
        };
        let fidx:number|undefined;
        let ridx:number|undefined;
        this.slted.find((itm, idx) => {
          if (itm.GameID === tmp.GameID) {
            itm.PayClassID = tmp.PayClassID;
            fidx = idx;
            if (itm.PayClassID === 0) {
              ridx = idx;
            }
          }
        });
        if (fidx === undefined) {
          this.slted.push(tmp);
        }
        if (ridx) {
          this.slted.splice(ridx, 1);
        }
        this.$emit('setPayClass', JSON.stringify(this.slted));
      }
    // }
  }
  doit() {
    console.log('change doit');
  }
  async mounted() {
      await this.getGames();
      // console.log('GamePayClassSelector mounted:',this.games);
  }
}
</script>
<style scoped>
.my-card-min-w {
  min-width: 150px;
}
</style>
