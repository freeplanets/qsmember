<template>
  <q-select class="tids" square filled dense v-model="model" :options="options" style="width:200px"/>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { SelectOptions } from '../data/if';
import LayoutStoreModule from '../data/LayoutStoreModule';
/**
 * :store='yourvalue'
 * @setGames="functionName"
 */
@Component
export default class TermIDSelector extends Vue {
    @Prop() readonly store?:LayoutStoreModule;
    @Prop() readonly GameID?:number;
    @Watch('GameID', { immediate: true, deep: true })
    onGameIDChange() {
      this.getGameID();
    }
    models:SelectOptions = { value: 0, label: '' };
    options:SelectOptions[] = []
    set model(v:SelectOptions) {
          this.models = v;
          this.$emit('setTermID', v.value);
    }
    get model() {
          // console.log('get Model:', this.models);
      return this.models;
      }
    async getGameID() {
        // console.log('getGames AddAllItem:',this.AddAllItem);
        if (this.GameID && this.store) {
          this.options = [];
          const ans:SelectOptions[] | undefined = await this.store.ax.getTermIDByGameID(this.store.personal.id, this.store.personal.sid, this.GameID);
          if (ans) {
            this.options = ans;
            this.model = this.options[0];
          }
        }
     }
}
</script>
<style scoped>
.tids {
    padding: 0 4px 0 4px;
    min-width: 180;
}
</style>
