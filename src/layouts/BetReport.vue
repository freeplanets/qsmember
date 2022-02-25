<template>
  <div>
    <div class="top row">
        <div><GS :store="store" :AddAllItem='true' @setGames="setCurGames" :ReturnList='true' @setLists='setGameLists'></GS></div>
        <div class="tbox-pd">
          <q-btn-toggle
            v-model="Ledger"
            class="my-custom-toggle"
            no-caps
            rounded
            unelevated
            toggle-color="primary"
            color="white"
            text-color="primary"
            :options="ledgers"
          />
        </div>
        <div class="tbox-pd"><q-input class="tbox-w" outlined dense v-model="dateSet" /></div>
        <div class="miniBtn-pd"><q-btn color="primary" dense icon="date_range" @click="DateSlt=true"/></div>
        <div class='miniBtn-pd'><q-btn dense color="green" icon-right="search" :label="$t('Button.Search')"  @click="SearchData()"/></div>
    </div>
    <q-separator inset />
    <div v-if='showTotal' class="mytable">
      <table>
        <tr>
          <td v-if="curLedger===2" class="mytable-head mytable-field-txt">{{$t('Label.Date')}}</td>
          <td class="mytable-head mytable-field-txt">{{$t('Table.Account')}}</td>
          <td v-if="hasBTField" class="col-1 mytable-head mytable-field-txt">{{$t('Report.OdrType')}}</td>
          <td class="mytable-head mytable-field-txt">{{$t('Report.OdrAmt')}}</td>
          <td class="mytable-head mytable-field-txt">{{$t('Report.Result')}}</td>
        </tr>
      <tr
        v-for="(itm,idx) in Tlist"
        :key="'bh'+idx"
        >
        <td v-if="curLedger===2" class="mytable-field-txt">{{itm.SDate}}</td>
        <td class="mytable-field-txt">{{itm.Account}}</td>
        <td v-if="hasBTField"  class="col-1 mytable-field-txt" ><q-btn dense flat @click="getBTDetail(itm.UpId,itm.BetType)" :label="itm.BTName" /></td>
        <td class="mytable-field-num">{{itm.Total.toFixed(2)}}</td>
        <td :class="{'mytable-field-num':true,RedColor:itm.WinLose<0}">{{itm.WinLose.toFixed(2)}}</td>
      </tr>
      <tr class="linetotal">
          <td class="mytable-field-txt" :colspan="hasBTField || curLedger===2 ? 2: 1">{{$t('Report.Total')}}</td>
          <td class="mytable-field-num">{{total.toFixed(2)}}</td>
          <td :class="{'mytable-field-num':true,RedColor:winlose<0}">{{winlose.toFixed(2)}}</td>
      </tr>
      </table>
    </div>
    <!-- detail  //-->
    <div v-if="showDetail" class="myDetail">
      <q-btn round color="primary" icon="reply" @click="showTotal=true;showDetail=false" />
      <table>
        <tr>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Report.OrderNo')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Label.Member')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Report.OrderTime')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Label.GameName')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Label.TermID')}}</td>
          <td class="col mytable-head mytable-field-txt">{{$t('Report.OdrType')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Report.OdrAmt')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Report.Result')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Label.WebOwner')}}</td>
        </tr>
      <tr
        v-for="(itm,idx) in list"
        :key="'bh'+idx"
        >
        <td class="col-1 mytable-field-txt">{{itm.id}}</td>
        <td class="col-1 mytable-field-txt">{{itm.UName}}</td>
        <td class="col-1 mytable-field-txt">{{DTString(itm.CreateTime)}}</td>
        <td class="col-1 mytable-field-txt">{{itm.GameName}}</td>
        <td class="col-1 mytable-field-txt">{{itm.TermID}}</td>
        <td class="col mytable-field-txt wdbr" v-html="itm.BetContent"></td>
        <td class="col-1 mytable-field-num">{{itm.Total}}</td>
        <td :class="{'col-1 mytable-field-num':true,RedColor:itm.WinLose ? itm.WinLose<0 : false}">{{itm.WinLose? itm.WinLose.toFixed(2): 0}}</td>
        <td class="col-1 mytable-field-txt">{{itm.UPName}}</td>
      </tr>
      <tr class="linetotal">
          <td class="col-1 mytable-field-txt" colspan="5">{{$t('Report.Total')}}</td>
          <td class="col-1 mytable-field-txt-right">{{`${$t('Label.TotalN')}`.replace('{N}',list.length+'')}}</td>
          <td class="col-1 mytable-field-num">{{total}}</td>
          <td :class="{'col-1 mytable-field-num':true,RedColor:winlose<0}">{{winlose.toFixed(2)}}</td>
          <td class="col-1 mytable-field-txt"></td>
      </tr>
      </table>
      </div>
    <q-dialog v-model="DateSlt">
      <q-card class='diaDate'>
        <q-card-section class="q-pt-none">
          <SED v-model="dateSet" @closeme="DateSlt=false"></SED>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
// import Vue from 'vue';
// import Compnent from 'vue-class-component';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import LayoutStoreModule from './data/LayoutStoreModule';
import { BHRemaster, datetime } from './components/func';
import { SelectOptions, CommonParams, Msg, LoginInfo, BetHeader, MyUser } from './data/if';
import GameSelector from './components/GameSelector.vue';
import SEDate from './components/SEDate.vue';
// Vue.component('GS',GameSelector);
// Vue.component('SED',SEDate);

interface TData {
  UpId:number;
  SDate?:string;
  UXTimeStamp?:number;
  Account?:string;
  BetType?:string;
  BTName?:string;
  Total:number;
  WinLose:number;
}

@Component({
  components: {
    GS: GameSelector,
    SED: SEDate,
  },
})
export default class BetReport extends Vue {
  store=getModule(LayoutStoreModule);
  dateSet='';
  @Watch('dateSet', { immediate: true, deep: true })
  onDateSetChange() {
    // console.log('onDateSetChange',this.DateSlt);
    this.DateSlt = false;
  }
  curGameID=0;
  DateSlt=false;
  curGType='';
  curLedger=0;
  ledgers:SelectOptions[]=[
    // {value:0,label:'Report.GeneralLedger'},
    // {value:1,label:'Report.Ledger'}
  ];
  Tlist:TData[]=[];
  list:BetHeader[]=[];
  GameList:SelectOptions[]=[];
  total=0;
  winlose=0;
  hasBTField=false;
  curDateSet='';
  showTotal=false;
  showDetail=false;
  get Ledger() {
    return this.curLedger;
  }
  set Ledger(v) {
    if (!this.curGameID && v === 1) return;
    this.showTotal = false;
    this.curLedger = v;
  }
  get PInfo():LoginInfo {
    return this.store.personal;
  }
  setGameLists(v:SelectOptions[]) {
    this.GameList = v;
  }
  setCurGames(v:SelectOptions) {
    this.curGameID = v.value;
    this.curGType = v.GType ? v.GType : '';
    if (!this.curGameID) {
      this.curLedger = 0;
    }
  }
  DTString(v?:string|number, style?:string) {
    if (!v) v = '';
    return datetime(v, style);
  }
  async getBTDetail(UpId:number, BetType?:string) {
    const param:CommonParams = {
      UserID: this.PInfo.id,
      sid: this.PInfo.sid,
      Table: 'BetTable',
      UpId,
      BetType,
    };
    if (this.curDateSet) {
      const tmp:string[] = this.curDateSet.split('-');
      if (tmp[0]) param.SDate = tmp[0];
      if (tmp[1]) param.EDate = tmp[1];
    }
    console.log('getBTDetail', param);
    const msg:Msg = await this.store.ax.getApi('getBetHeaders', param);
    if (msg.ErrNo === 0) {
      const bhs:BetHeader[] = msg.data as BetHeader[];
      bhs.map((bh) => {
        let f:MyUser|undefined = msg.users.find((itm:any) => itm.id === bh.UserID);
        if (f) {
          bh.UName = f.Account;
        }
        f = msg.UpUser.find((itm:any) => itm.id === bh.UpId);
        if (f) {
          bh.UPName = f.Account;
        }
        bh.BetContent = JSON.parse(bh.BetContent);
        bh = BHRemaster(bh, this.GameList, this);
      });
      // console.log('SearchData ok!!',bhs);
      // this.list = msg.data as BetHeader[];
      this.list = bhs;
      this.total = 0;
      this.winlose = 0;
      this.list.map((itm) => {
        this.total += itm.Total;
        this.winlose += itm.WinLose ? itm.WinLose : 0;
      });
      this.showTotal = false;
      this.showDetail = true;
    }
  }
  async SearchData() {
    this.showDetail = false;
    const param:CommonParams = {
      UserID: this.PInfo.id,
      sid: this.PInfo.sid,
    };
    if (this.PInfo.Types === 1) {
      param.UpId = this.PInfo.id;
    }
    if (this.dateSet) {
      const tmp:string[] = this.dateSet.split('-');
      if (tmp[0]) param.SDate = tmp[0];
      if (tmp[1]) param.EDate = tmp[1];
    } else {
      return;
    }
    if (this.curGameID) {
      param.GameID = this.curGameID;
    }
    if (this.curLedger) {
      param.Ledger = this.curLedger;
    }
    const msg:Msg = await this.store.ax.getApi('getBetTotal', param);
    if (msg.ErrNo === 0) {
      this.curDateSet = this.dateSet;
      this.Tlist = msg.data as TData[];
      const User = msg.User;
      this.total = 0;
      this.winlose = 0;
      this.Tlist.map((itm) => {
        this.total += itm.Total;
        this.winlose += itm.WinLose;
        const f = User.find((u:any) => u.id === itm.UpId);
        if (f) {
          itm.Account = f.Account;
        }
        // itm.SDate = this.DTString(itm.UXTimeStamp ? itm.UXTimeStamp : 0,'date');
        if (itm.BetType) {
          this.hasBTField = true;
          itm.BTName = `${this.$t(`Game.${this.curGType}.Item.${itm.BetType}.title`)}`;
        } else {
          this.hasBTField = false;
        }
      });
      this.showTotal = true;
      // console.log('SearchData:',this.list);
    }
  }
  mounted() {
    this.ledgers.push({ value: 0, label: `${this.$t('Report.GeneralLedger')}` });
    this.ledgers.push({ value: 1, label: `${this.$t('Report.Ledger')}` });
    this.ledgers.push({ value: 2, label: `${this.$t('Report.DayReport')}` });
    // console.log('BetReport mounted:',this.ledgers);
  }
}
</script>
<style scoped>
.top {
  padding-left: 8px;
}
.diaDate {
  padding-top: 20px;
  width: 750px;
  max-width: 1000px;
}
.tbox-w {
  width: 200px;
}
.my-custom-toggle {
  border: 1px solid #027be3
}
.myDetail {
    max-width: 1400px;
    padding: 4px 0 8px 8px;
}
.mytable {
    max-width: 600px;
    padding: 4px 0 8px 8px;
}
.mytable table,.myDetail table {
    border-collapse: collapse;
}

.mytable td,.myDetail td{
  width: 120px;
}
.mytable-head {
    background-color: cadetblue;
    color:white;
}
.mytable-field-txt {
    border: 1px gray solid;
    text-align: center;
    vertical-align: middle;
}
.mytable-field-txt-right {
    border: 1px gray solid;
    text-align: right;
    vertical-align: middle;
}
.mytable-field-num {
    border: 1px gray solid;
    text-align: right;
    vertical-align: middle;
}
.RedColor {
  color:red;
}
</style>
