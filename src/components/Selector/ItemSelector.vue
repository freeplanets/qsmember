<template>
  <selector :Title="$t('Title.Item')" :defaultModel="defaultModel" :options="options" @SetItem="setItem" />
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { CryptoItem } from 'src/components/if/dbif';
import { SelectOptions, WebParams } from '../../layouts/data/if';
import { ErrCode } from '../if/ENum';
import LStore from '../../layouts/data/LayoutStoreModule';
import selector from './Selector.vue';

@Component({
  components: {
    selector,
  },
})
export default class ItemSelector extends Vue {
  @Prop({ type: Number }) readonly defaultModel!:number;
  @Prop({ type: Number }) readonly retryData!:number;
  store = getModule(LStore);
  options:SelectOptions[] = [];
  getData() {
    const param:WebParams = { ...this.store.Param };
    param.TableName = 'Items';
    param.Fields = ['id', 'Title', 'isLoan'];
    this.store.ax.getApi('cc/GetData', param).then((msg) => {
      if (msg.ErrNo === ErrCode.PASS) {
        if (msg.data) {
          const list = msg.data as CryptoItem[];
          console.log('getData:', list);
          this.options = list.map((itm) => {
            const tString = `Select.Crypto.LoanType.${itm.isLoan}`;
            const tmp:SelectOptions = {
              label: `${itm.Title} ${this.$t(tString)}`,
              value: itm.id,
            };
            return tmp;
          });
          const sltOne:SelectOptions = {
            label: 'ALL',
            value: 0,
          };
          this.options.splice(0, 0, sltOne);
        }
      }
      if (this.retryData === 1) {
        this.$emit('SendOptions', this.options);
      }
    });
  }
  setItem(v:number) {
    this.$emit('SetItem', v);
  }
  mounted() {
    this.getData();
  }
}
</script>
