<template>
  <div>報表畫面進行中。。。</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import LStore from '../layouts/data/LayoutStoreModule';
import { Msg, WebParams } from 'src/layouts/data/if';
import { getModule } from 'vuex-module-decorators';

@Component
export default class CrytoReport extends Vue{
  store = getModule(LStore);
  async getData(){
    const param:WebParams = { ...this.store.Param };
    param.TableName = 'Items';
    param.Fields = ['id','code'];
    const msg:Msg = await this.store.ax.getApi('cc/GetData',param);
    console.log(msg);
  }
  async mounted() {
    await this.getData();
  }
}
</script>