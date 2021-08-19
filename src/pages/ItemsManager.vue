<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 950px">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="bg-grey-3 text-grey-7"
          active-color="primary"
          indicator-color="purple"
          align="justify"
        >
          <q-tab name="lists" :label="$t('Button.Lists')" />
          <q-tab name="addnew" :label="$t('Button.Add')+'/'+$t('Button.Edit')" @click="addNewPress" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated class="bg-blue-5 text-white">
          <q-tab-panel name="lists">
              <div class="q-pa-md">
              <q-table
                dense
                :data="data"
                :columns="columns"
                row-key="name"
                @row-click="onRowClick"
                :rows-per-page-label="$t('Label.RecordCount')+' : '"
                :visible-columns="visibleColumns"
                separator="cell"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="addnew">
            <CIB v-model="UpdateItem" @Save="SendData" @Cancel="Cancel" :UserLevel="uInfo.Levels"></CIB>
          </q-tab-panel>

        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { CryptoItem } from '../components/if/dbif';
import LayoutStoreModule from '../layouts/data/LayoutStoreModule';
import { LoginInfo, Msg, WebParams } from '../layouts/data/if';
import CryptoItemBlock from '../components/CryptoItemBlock.vue';
// import { FunctionDeclaration, FunctionLikeDeclaration } from 'typescript';

interface TableColumn {
  name?:string;
  field?:string;
  label?:string;
  require?:boolean;
  align?:string;
  sortable?:boolean;
  // format?:Function;
  format?: any;
  headerStyle?:string;
}

@Component({
  components: {
    CIB: CryptoItemBlock,
  },
})
export default class ItemsManager extends Vue {
  store = getModule(LayoutStoreModule);
  uInfo:LoginInfo = this.store.personal;
  tab = 'lists';
  updateid=0;
  modifyStatus = 0 // 0 add, 1 edit
  initItemData:CryptoItem = {
    id: 0,
    Title: '',
    Code: '',
    OpenFee: 0,
    CloseFee: 0,
    isLoan: 0,
    PriceLimitPercentage: 0,
    StopGain: 0,
    StopLose: 0,
    DecimalPlaces: 2,
    QtyDecimalPlaces: 8,
    PerStep: 1,
    isActive: 0,
    IMG: '',
  }
  UpdateItem:CryptoItem = { ...this.initItemData };
  /*
  @Watch('UpdateItem')
  chk=0;
  async onUpdateItemChange() {
    console.log('onUpdateItemChange:', this.UpdateItem);
    // await this.SendData();
  }
  */
  columns:TableColumn[] = [];
  data:CryptoItem[] = [];
  visibleColumns = ['id', 'Title', 'OpenFee', 'CloseFee', 'isLoan', 'PriceLimitPercentage',
   'StopGain', 'StopLose', 'DecimalPlaces', 'QtyDecimalPlaces', 'PerStep', 'isActive'];
  async GetData() {
    const param:WebParams = {
      sid: this.uInfo.sid,
      UserID: this.uInfo.id,
      TableName: 'Items',
    };
    const msg = await this.store.ax.getApi('cc/GetData', param);
    if (msg.ErrNo === 0) {
      if (msg.data) {
        this.data = msg.data as CryptoItem[];
        console.log('getDATA', this.data);
      }
    }
  }
  async SendData() {
    let msg:Msg = { ErrNo: 0 };
    this.UpdateItem.ModifyID = this.uInfo.id;
    this.UpdateItem.id = this.updateid;
    if (!this.UpdateItem.Title) return;
    const param:WebParams = {
      sid: this.uInfo.sid,
      UserID: this.uInfo.id,
      id: this.uInfo.id,
      TableName: 'Items',
      TableData: this.UpdateItem,
    };
    msg = await this.store.ax.getApi('cc/Save', param);
    // console.log(msg);
    if (msg.ErrNo === 0) {
      this.updateid = 0;
      this.UpdateItem = { ...this.initItemData };
      await this.GetData();
      this.tab = 'lists';
    }
  }
  setColumns() {
    this.columns = Object.keys(this.initItemData).map((key) => {
      const lab = this.$t(`Table.Items.${key}`);
      const column:TableColumn = {
        name: key,
        label: `${lab}${key.indexOf('Fee') > -1 ? '(%)' : ''}`,
        field: key,
        sortable: false,
        headerStyle: 'text-align: center',
        align: 'center',
      };
      if (typeof this.initItemData[key] === 'number') column.align = 'right';
      if (key === 'isLoan' || key === 'isActive') {
        column.format = (val:number) => `${val ? 'Y' : 'N'}`;
      }
      return column;
    });
  }
  onRowClick(evt:any, row:any) {
    Object.keys(this.UpdateItem).map((key) => {
      this.UpdateItem[key] = row[key];
      // eval(`this.UpdateItem.${key} = row.${key}`);
    });
    this.updateid = row.id;
    // this.ItemData = row;
    // console.log('clicked on', row,evt);
    this.tab = 'addnew';
  }
  addNewPress() {
    if (this.tab === 'lists') {
      this.Cancel();
    }
  }
  Cancel() {
    // this.UpdateItem=Object.assign({}, this.initItemData);
    this.UpdateItem = { ...this.initItemData };
    this.updateid = 0;
    this.tab = 'lists';
  }
  async mounted() {
    this.setColumns();
    await this.GetData();
  }
}
</script>
<style scoped>
.q-table th {
  background-color: #c1f4cd;
}
</style>
