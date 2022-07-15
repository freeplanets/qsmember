<template>
  <div>
    <div class="row">
      <div class="col-2 gsltor"><GS :store="store" :AddAllItem='false' :GameID='curGameID' :ReturnList='true' @setLists='setGameLists' @setGames="setCurGames"></GS></div>
      <div class="col-1 tsltor" v-if="curGameID>0"><TIDS :store="store" :GameID='curGameID' @setTermID='setTermID'></TIDS></div>
      <div class="col-1 tsltor" v-if="curGameID>0"><BTS :GType='curGType' @setBetType='setBetType'></BTS></div>
      <div class="pbtn2"><q-input outlined dense v-model="NameOrNick" :label="$t('Label.NameOrNick')" /></div>
      <div class="pbtn2"><q-input outlined dense v-model="UpName" :label="`${$t('Label.Agent')}/${$t('Label.WebOwner')}`" /></div>
      <div class="pbtn2"><q-input outlined dense v-model="BetID" :label="$t('Report.OrderNo')+'(n,1,2,3,...)'" /></div>
      <div class="tbox-pd"><q-input class="tbox-w" outlined dense v-model="dateSet" /></div>
      <div class="miniBtn-pd"><q-btn color="primary" dense icon="date_range" @click="DateSlt=true"/></div>
      <div v-if="showTimeEdit" class='pbtn2'><q-input outlined dense v-model="STime" label="hh:mm:ss" mask="##:##:##"/></div>
      <div v-if="showTimeEdit" class='pbtn2'><q-input outlined dense v-model="ETime" label="hh:mm:ss" mask="##:##:##"/></div>
    </div>
    <div class="row">
      <div class="talign2">{{$t('Report.OdrAmt')}}</div>
      <div class='row pbtn2'>
          <q-input outlined dense v-model="OrdAmtS" />
          <q-input outlined dense v-model="OrdAmtE" />
      </div>
      <div class="talign2">{{$t('Report.WinLose')}}</div>
      <div class='row pbtn2'>
          <q-input outlined dense v-model="WinLoseS" />
          <q-input outlined dense v-model="WinLoseE" />
      </div>
      <div class='pbtn2'>
        <q-select outlined dense v-model="sltedTS" :options="TStatus"  />
      </div>
      <div>{{ $t('Report.RptType.Head') }}<q-toggle v-model="isDetail" />{{ $t('Report.RptType.Detail') }}</div>
      <div class='pbtn'><q-btn dense color="green" icon-right="search" :label="$t('Button.Search')"  @click="SearchData()"/></div>
      <div class='pbtn'><q-btn dense color="blue" icon-right="clear" :label="$t('Button.Clear')"  @click="ClearSearch()"/></div>
    </div>
    <q-separator inset />
    <div v-if="list.length>0" class="mytable">
      <table>
        <tr>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Report.OrderNo')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Table.SiteName')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Label.Member')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Report.OrderTime')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Label.GameName')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Label.TermID')}}</td>
          <td class="col mytable-head mytable-field-txt">{{$t('Report.OdrType')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Report.OdrAmt')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Report.Result')}}</td>
          <td class="col-1 mytable-head mytable-field-txt">{{$t('Label.Status')}}</td>
        </tr>
      <tr
        v-for="(itm,idx) in list"
        :key="'bh'+idx"
        >
        <td class="col-1 mytable-field-txt">{{`${itm.betid ? itm.betid+':' : '' }${itm.id}`}}</td>
        <td class="col-1 mytable-field-txt">{{itm.UPName}}</td>
        <td class="col-1 mytable-field-txt">{{itm.UName}}</td>
        <td class="col-1 mytable-field-txt">{{DTString(itm.CreateTime)}}</td>
        <td class="col-1 mytable-field-txt">{{itm.GameName}}</td>
        <td class="col-1 mytable-field-txt">{{itm.TermID}}</td>
        <td class="col mytable-field-txt wdbr" v-html="itm.BetContent"></td>
        <td class="col-1 mytable-field-num">{{itm.Total}}</td>
        <td :class="{'col-1 mytable-field-num':true,RedColor:itm.WinLose ? itm.WinLose<0 : false}">{{itm.WinLose? itm.WinLose.toFixed(2):0}}</td>
        <td class="col-1 mytable-field-txt">{{ $t(`Label.TicketStatus.${itm.isCancled}`)}}</td>
      </tr>
      <tr class="linetotal">
          <td class="col-1 mytable-field-txt" colspan="6">{{$t('Report.Total')}}</td>
          <td class="col-1 mytable-field-txt-right">{{`${$t('Label.TotalN')}`.replace('{N}', list.length+'')}}</td>
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
import { Vue, Component, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import LayoutStoreModule from './data/LayoutStoreModule';
import { SelectOptions, CommonParams, Msg, BetHeader, LoginInfo, MyUser } from './data/if';
import { BHRemaster, datetime } from './components/func';
import GameSelector from './components/GameSelector.vue';
import TermIDSelector from './components/TermIDSelector.vue';
import BetTypeSelector from './components/BetTypeSelector.vue';
import SEDate from './components/SEDate.vue';

@Component({
  components: {
    GS: GameSelector,
    SED: SEDate,
    TIDS: TermIDSelector,
    BTS: BetTypeSelector,
  },
})
export default class BetLists extends Vue {
  store=getModule(LayoutStoreModule);
  NameOrNick='';
  curGameID=0;
  curGType='';
  STime='';
  ETime='';
  list:BetHeader[]=[];
  GameList:SelectOptions[]=[];
  total=0;
  winlose=0;
  BetID='';
  UpName='';
  termid=0;
  bettype=0;
  OrdAmtS=0;
  OrdAmtE=0;
  WinLoseS=0;
  WinLoseE=0;
  DateSlt=false;
  showTimeEdit=false;
  dateSet='';
  TStatus:SelectOptions[]=[];
  sltedTS:SelectOptions={ value: 0, label: '' };
  isDetail = false;
  @Watch('dateSet', { immediate: true, deep: true })
  onDateSetChange() {
    // console.log('onDateSetChange',this.DateSlt);
    this.DateSlt = false;
    if (this.dateSet && this.dateSet.indexOf('-') < 0) {
      this.showTimeEdit = true;
    } else {
      this.showTimeEdit = false;
    }
  }
  get PInfo():LoginInfo {
    return this.store.personal;
  }
  setCurGames(v:SelectOptions) {
    // console.log('setCurGames',v);
    this.curGameID = v.value;
    this.curGType = v.GType ? v.GType : '';
  }
  ClearSearch() {
    this.NameOrNick = '';
    // this.curGameID = 0;
    this.BetID = '';
    this.UpName = '';
    this.termid = 0;
    this.bettype = 0;
    this.dateSet = '';
    this.STime = '';
    this.ETime = '';
    this.OrdAmtS = 0;
    this.OrdAmtE = 0;
    this.WinLoseS = 0;
    this.WinLoseE = 0;
    this.sltedTS = this.TStatus[0];
  }
  async SearchData() {
    const param:CommonParams = {
      UserID: this.PInfo.id,
      sid: this.PInfo.sid,
      Types: this.PInfo.Types,
    };
    if (this.dateSet) {
      const tmp:string[] = this.dateSet.split('-');
      if (tmp[0]) param.SDate = tmp[0];
      if (tmp[1]) param.EDate = tmp[1];
    } else if (!this.termid && !this.BetID) {
      this.$q.dialog({
        title: `${this.$t('Label.BetLists')}`,
        message: `${this.$t('Error.10')}`, // 參數不足
      });
      return;
    }
    param.findString = this.NameOrNick;
    param.GameID = this.curGameID;
    if (this.BetID) param.BetID = this.BetID;
    param.UpName = this.UpName;
    if (this.termid) param.tid = this.termid;
    if (this.bettype) param.BetType = this.bettype;
    if (this.STime) param.STime = this.STime;
    if (this.ETime) param.ETime = this.ETime;
    if (this.OrdAmtS) param.OrdAmtS = this.OrdAmtS;
    if (this.OrdAmtE) param.OrdAmtE = this.OrdAmtE;
    if (this.WinLoseS) param.WinLoseS = this.WinLoseS;
    if (this.WinLoseE) param.WinLoseE = this.WinLoseE;
    if (this.sltedTS) param.isCanceled = this.sltedTS.value;
    param.isDetail = this.isDetail ? 1 : 0;
    const msg:Msg = await this.store.ax.getApi('getBetHeaders', param);
    console.log('SearchData', msg);
    this.list = [];
    if (msg.ErrNo === 0) {
      const bhs:BetHeader[] = msg.data as BetHeader[];
      // console.log('GameList:',this.GameList);
      bhs.map((bh) => {
        let f:MyUser|undefined = msg.users.find((itm:any) => itm.id === bh.UserID);
        if (f) {
          bh.UName = f.Nickname ? f.Nickname : f.Account;
        }
        f = msg.UpUser.find((itm:any) => itm.id === bh.UpId);
        if (f) {
          bh.UPName = f.SiteName;
        }
        bh = BHRemaster(bh, this.GameList, this);
      });
      // console.log('SearchData ok!!',bhs);
      this.list = msg.data as BetHeader[];
      this.total = 0;
      this.winlose = 0;
      this.list.map((itm) => {
        this.total += itm.Total;
        this.winlose += itm.WinLose ? itm.WinLose : 0;
      });
    } else {
      console.log('SearchData error!!');
    }
  }
  setGameLists(v:SelectOptions[]) {
    this.GameList = v;
  }
  DTString(v?:string) {
    if (!v) v = '';
    return datetime(v);
  }
  setTermID(v:number) {
    this.termid = v;
  }
  setBetType(v:number) {
    this.bettype = v;
  }
  mounted() {
      if (!this.store.isLogin) {
          this.$router.push({ path: '/login' });
      }
      const Tmp = this.$t('Label.TicketStatus') as any;
      Tmp.map((itm:string, idx:number) => {
        const so:SelectOptions = {
          value: idx,
          label: itm,
        };
        this.TStatus.push(so);
      });
      this.sltedTS = this.TStatus[0];
      // console.log('BetLists mounted',this.TStatus);
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
.mytable {
    max-width: 1400px;
    padding: 4px 0 8px 8px;
}
.mytable table {
    border-collapse: collapse;
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

.Nums {
  color:blue;
  background-color: cornflowerblue;
}

.Odds {
  color: red;
  background-color: blueviolet;
}
.BetType {
  background-color: black;
  color: white;
}
.linetotal {
  background-color: lightskyblue;
}
.RedColor {
  color:red;
}
.tsltor {
  min-width: 200px;
  padding-top: 4px;
}
.gsltor {
  min-width: 380px;
}
.wdbr {
  word-break: break-all;
  max-width: 500px;
}
.diaDate {
  padding-top: 20px;
  width: 705px;
  max-width: 1000px;
}
.talign2 {
    text-align: center;
    line-height:40px;
    padding: 0 4px 0 4px;
}
</style>
