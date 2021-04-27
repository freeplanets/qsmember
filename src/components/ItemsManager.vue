<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 700px">
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
          <q-tab name="addnew" :label="$t('Button.Add')+'/'+$t('Button.Edit')" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated class="bg-secondary text-white">
          <q-tab-panel name="lists">
              <div class="q-pa-md">
              <q-table
                :title="$t('Button.Lists')"
                dense
                :data="data"
                :columns="columns"
                row-key="name"
                @row-click="onRowClick"
                :rows-per-page-label="$t('Label.RecordCount')+' : '"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="addnew">
            <div class="text-h6">{{ updateid ? $t('Button.Edit') : $t('Button.Add')}}</div>
            <div class="row" 
              v-for="(keys,idx) in Object.keys(UpdateItem)"
              :key="'modi:'+idx"
              >
              <div class="col-3 title" style='text-valign:center'>{{ $t("Table.Items."+keys) + (typeof(UpdateItem[keys])==='number' ? '(%)' : '')}}</div>
              <div class="col-3"><q-input outlined  dense v-model="UpdateItem[keys]" label="" /></div>
            </div>
            <div class="row q-pa-md q-gutter-sm">
              <q-btn color="primary" icon-right="send" :label="$t('Button.Send')" @click="SendData()" />
              <q-btn color="red" icon-right="undo"  :label="$t('Label.Cancel')" @click="Cancel()" />
            </div>
          </q-tab-panel>

        </q-tab-panels>
      </q-card>      
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {TableItems} from './if/dbif';
import {getModule} from 'vuex-module-decorators';
import LayoutStoreModule from '../layouts/data/LayoutStoreModule';
import {Msg,WebParams} from '../layouts/data/if';
//import {Watch} from 'vue-property-decorator';
interface TableColumn {
  name?:string;
  field?:string;
  label?:string;
  require?:boolean;
  align?:string;
  sortable?:boolean;
}

@Component
export default class ItemsManager extends Vue{
  store = getModule(LayoutStoreModule);
  uInfo = this.store.personal;
  tab = 'lists';
  updateid=0;
  modifyStatus = 0 // 0 add, 1 edit
  initItemData:TableItems={
    Title:'',
    OpenFee: 0,
    CloseFee: 0,
    LoanFee: 0,
    BattleFee: 0,
    BattleLoanFee: 0
  }
  UpdateItem:TableItems=Object.assign({},this.initItemData);
  columns:TableColumn[]=[];
  data:TableItems[]=[];
  visibleColumns=['id','Code','ModifyID','ModifyTime'];
  async GetData(){
    const param:WebParams = {
      sid:this.uInfo.sid,
      UserID:this.uInfo.id,
      TableName:'Items'
    }    
    const msg = await this.store.ax.getApi('cc/GetData',param);
    if(msg.ErrNo === 0) {
      if(msg.data) {
        this.data = msg.data as TableItems[];
      }
    }
  }
  async SendData(){
    let msg:Msg={ErrNo:0};
    this.UpdateItem.ModifyUID = this.uInfo.id;
    this.UpdateItem.id = this.updateid;
    const param:WebParams = {
      sid:this.uInfo.sid,
      UserID:this.uInfo.id,
      id:this.uInfo.id,
      TableName:'Items',
      TableData:this.UpdateItem
    }
    msg = await this.store.ax.getApi('cc/Save',param);
    //console.log(msg);
    if(msg.ErrNo === 0){
      this.updateid = 0;
      this.UpdateItem=Object.assign({},this.initItemData);
      await this.GetData();
      this.tab = 'lists';
    }
  }
  setColumns(){
    this.columns=Object.keys(this.initItemData).map(key=>{
      const column:TableColumn = {
        name: key,
        label:`${this.$t('Table.Items.'+key)}${key.indexOf('Fee')>-1 ? '(%)' : '' }`,
        field: key, 
        sortable:false,
        align:'left'};
      if(typeof this.initItemData[key] === 'number' ) column.align = 'right';
      return column;
    })
  }
  onRowClick (evt, row) {
    Object.keys(this.UpdateItem).map(key=>{
      this.UpdateItem[key] = row[key];
    })
    this.updateid=row.id;
    //this.ItemData = row;
    //console.log('clicked on', row,evt);
    this.tab = 'addnew';
  }
  Cancel(){
    this.UpdateItem=Object.assign({},this.initItemData);
    this.updateid = 0;
    this.tab='lists';
  }
  async mounted(){
    this.setColumns();
    await this.GetData();
  }

 }
</script>
<style scoped>
.title {
  text-align: right;
  line-height: 40px;
  margin-right: 8px;
}
</style>