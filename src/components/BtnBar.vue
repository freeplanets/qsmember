<template>
  <div class="row q-ma-xs">
    <div
      class="q-ml-sm"
      v-for="(itm,idx) in list"
      :key="'lst'+idx"
    >
      <q-btn
        :color="idx === curIdx ? 'teal-9' : 'teal-2' "
        size="xs"
        :label="itm.Title"
        @click="setValue(itm, idx)"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import LStore from '../layouts/data/LayoutStoreModule';
import { CryptoItem } from './if/dbif';
import { WebParams, Msg } from '../layouts/data/if';
import ErrCode from '../layouts/data/ErrCode'

@Component
export default class BtnBar extends Vue {
  store = getModule(LStore);
  curIdx = 0;
  list:CryptoItem[]=[];
  getData() {
    const param:WebParams = { ...this.store.Param };
    param.TableName = 'Items';
    param.Filter = { isLoan: 1 };
    this.store.ax.getApi('cc/GetData',param).then((res:Msg)=>{
      if(res.ErrNo === ErrCode.PASS ) {
        this.list = res.data as CryptoItem[];
        if (this.list.length > 0) {
          this.setValue(this.list[0], 0);
        }
      }
    }).catch(err=>{
      console.log('BtnBar getData:', err);
    });
  }
  setValue(itm:CryptoItem, sltIdx:number) {
    console.log('BtnBar setValue', itm, sltIdx);
    this.curIdx = sltIdx;
    this.$emit('setValue', itm);
  }
  mounted() {
    this.getData();
  }
}
</script>
