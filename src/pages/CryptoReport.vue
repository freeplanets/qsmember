<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-2"><selector :Title="$t('Title.Item')" :defaultModel="itemid" :options="options" @SetItem="setItem" /></div>
      <div class="col-2"><q-input class="" outlined dense v-model="SelectDate" /></div>
      <div class="pbtn2"><q-btn color="primary" dense icon="date_range" @click="isDateSlt=true"/></div>
      <div class='row col pbtn2'>
        <q-btn dense color="green" icon-right="search" :label="$t('Button.Search')"  @click="SearchData"/>      
        <q-btn dense color="blue" icon-right="clear" :label="$t('Button.Clear')"  @click="ClearSearch"/>
      </div>
    </div>
    <q-dialog v-model="isDateSlt">
      <q-card class='diaDate'>
        <q-card-section class="q-pt-none">
          <SED v-model="SelectDate" @closeme="isDateSlt=false"></SED>
        </q-card-section>
      </q-card>
    </q-dialog>  
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import LStore from '../layouts/data/LayoutStoreModule';
import { Msg, SelectOptions, WebParams } from 'src/layouts/data/if';
import { getModule } from 'vuex-module-decorators';
import Selector from '../components/Selector.vue';
import ErrCode from '../layouts/data/ErrCode';
import { Item } from '../components/if/dbif';
import SEDate from '../layouts/components/SEDate.vue';

@Component({
  components: {
    Selector,
    SED: SEDate,
  }
})
export default class CrytoReport extends Vue{
  store = getModule(LStore);
  options:SelectOptions[] = [];
  itemid = 0;
  isDateSlt = false;
  SelectDate = '';
  @Watch('SelectDate')
  onSDChange(){
    console.log('onSDChange:', this.SelectDate);
  }
  setItem(itemid:number){
    console.log('setItem', itemid);
    this.itemid = itemid;
  }
  ClearSearch() {
    this.itemid = 0;
    this.SelectDate = '';
  }
  async SearchData() {
    if ( !this.SelectDate ) return;
    const param:WebParams = { ...this.store.Param };
    const tmp = this.SelectDate.split('-');
    const sdate = tmp[0];
    const edate = tmp[1] ? tmp[1] : tmp[0];
    param.TableName = 'AskTable';
    param.Filter = [];
    if(this.itemid){
      param.Filter.push({
        Key: 'ItemID',
        Val: this.itemid
      })
    }
    param.Filter.push({
      Key: 'CreateTime',
      Val: `${sdate} 00:00:00`,
      Val2: `${edate} 23:59:59`,
      Cond: 'between'
    })
    const msg:Msg = await this.store.ax.getApi('cc/GetData',param);
    console.log(msg,param);
    /*
    if (msg.ErrNo === ErrCode.PASS) {
      
    }
    */
  }
  async getData(){
    const param:WebParams = { ...this.store.Param };
    param.TableName = 'Items';
    param.Fields = ['id','Title'];
    const msg:Msg = await this.store.ax.getApi('cc/GetData',param);
    if (msg.ErrNo === ErrCode.PASS) {
      if( msg.data ) {
        const list = msg.data as Item[];
        this.options = list.map((itm)=>{
          const tmp:SelectOptions = {
            label: `${itm.Title}`,
            value: itm.id
          }
          return tmp;
        })
        const sltOne:SelectOptions = {
          label: 'ALL',
          value: 0
        }
        this.options.splice(0, 0, sltOne);
      }
    }
  }
  async mounted() {
    await this.getData();
  }
}
</script>
<style scoped>
.pbtn {
    padding: 8px 4px;
}
.pbtn2 {
    padding: 4px 4px;
}
.diaDate {
  padding-top: 20px;
  width: 705px;
  max-width: 1000px;
}
</style>