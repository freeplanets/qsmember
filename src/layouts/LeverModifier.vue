<template>
  <div>
    <LL v-if="LM" :List="LM.List"></LL>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import LeverList from './components/LeverList.vue';
import LayoutStoreModule from './data/LayoutStoreModule';
import LeversModifier from './class/LeversModifier';
import { getModule } from 'vuex-module-decorators';
import { WebParams } from './data/if';

@Component({
  components : {
    LL: LeverList,
  }
})
export default class LeverModifier extends Vue{
  private store = getModule(LayoutStoreModule);
  LM:LeversModifier|undefined;
  get uInfo(){
    return this.store.personal;
  }
  created(){
    const param:WebParams = {
      UserID: this.uInfo.id,
      sid: this.uInfo.sid,
    }
    this.LM = new LeversModifier(this.store.ax, param);
  }
}
</script>