<template>
  <div>
    <div class="row col-4" style="margin:4px"><LL :List="list"></LL></div>
    <div class="row col-4" style="align:center;margin:4px"><q-btn color="secondary" 
    icon-right="send" :label="$t('Button.Edit')" @click="Send" /></div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Lever from './class/Lever';
import LeverList from './LeverList.vue';
import LayoutStoreModule from '../layouts/data/LayoutStoreModule';
import LeversModifier from './class/LeversModifier';
import { getModule } from 'vuex-module-decorators';
import { WebParams } from '../layouts/data/if';

@Component({
  components : {
    LL: LeverList,
  }
})
export default class LeverModifier extends Vue{
  private store = getModule(LayoutStoreModule);
  LM:LeversModifier|undefined;
  list:Lever[] = []
  get uInfo(){
    return this.store.personal;
  }
  async created(){
    const param:WebParams = {
      UserID: this.uInfo.id,
      sid: this.uInfo.sid,
    }
    this.LM = new LeversModifier(this.list, this.store.ax, param);
    // await this.LM.getList();
  }
  async Send():Promise<void>{
    console.log('Send');
    if(this.LM) {
      const ans = await this.LM.Update();
      console.log('Send after:', ans)
      if(ans) {
        await this.LM.getList();
      }
    }
  }
}
</script>
