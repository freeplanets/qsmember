<template>
    <div>
        <div class='row'>
            <div class='col-2'><GS :store='store' @setGames="setCurGames"></GS></div>
            <div class="pbtn"><q-select outlined dense v-model="refSec" :options="refSecs" /></div><div class="talign">{{$t('Label.Sec')}}</div>
            <div class="pbtn">
                <q-chip
                    clickable
                    @click="refreshData(1)"
                >
                    <q-avatar color="red" text-color="white">{{CountDown}}</q-avatar>
                    {{$t('Label.Refresh')}}
                </q-chip>
            </div>
            <div class='col-1'>
                <div class="row pbtn">
                    <q-btn-dropdown color="primary" :label="SortName" icon="sort">
                    <q-list>
                        <q-item
                            v-for="(itm,idx) in SortItems"
                            :key="'sort'+idx"
                            clickable
                            v-close-popup
                            @click="setSortType(idx,itm)">
                        <q-item-section>
                            <q-item-label>{{itm}}</q-item-label>
                        </q-item-section>
                        </q-item>
                    </q-list>
                    </q-btn-dropdown>
                </div>
            </div>
            <div class='col-3 talign1'
                 v-if="oddshow"
            >
                <q-btn-group outline class='mtop'  v-if="PInfo.Types>2">
                    <q-btn outline color="brown" :label="$t('Button.TotalStop')" @click="setStop(1)" />
                    <q-btn outline color="brown" :label="$t('Button.TotalOpen')" @click="setStop(0)" />
                    <q-btn outline color="brown" :label="$t('Button.PageStop')"  @click="setStop(1,cont)" />
                    <q-btn outline color="brown" :label="$t('Button.PageOpen')"  @click="setStop(0,cont)" />
                    <q-btn outline color="brown" :label="BtnSubTotal"  @click="showSubTotal = !showSubTotal" />
                </q-btn-group>
            </div>
            <div class='col-1 Total'>
                <div>合計： {{ Total }}</div>
            </div>
        </div>
        <div class="q-gutter-sm"
            v-if="oddshow"
        >
            <table class="btnSlt">
                <tr>
                    <td
                        v-for="(itm,idx) in dfLayout"
                        :key="'layout'+idx"
                    >
                    <q-chip
                        square
                        size="sm"
                        :color="dfColor[idx]"
                        text-color="white"
                        clickable
                        @click="changePage(itm.cont,idx)"
                        >
                        <q-avatar icon="play_arrow" color="primary" text-color="white" />
                        {{$t(itm.name)}}
                    </q-chip>
                    </td>
                </tr>
                <tr
                    v-if="showSubTotal"
                >
                    <td
                        v-for="(itm,idx) in dfLayout"
                        :key="'subtotal'+idx"
                    >
                    <q-chip
                        square
                        size="sm"
                        >
                        {{ getSubTotal(itm.cont) }}
                    </q-chip>
                    </td>
                </tr>
            </table>
            <div class='q-pa-md'
                v-for="(BItm,bidx) in cont"
                :key="'cont'+bidx"
            >
                <div
                    v-if="BItm.Selects"
                    class="q-gutter-y-md"
                >
                    <q-card>
                        <q-tabs
                        v-model="tab"
                        dense
                        class="text-grey"
                        active-color="primary"
                        indicator-color="primary"
                        align="left"
                        narrow-indicator
                        >
                            <q-tab
                                v-for="(title,idx) in BItm.Selects"
                                :key="'Select'+idx"
                                :name="'tab'+idx"
                                :label="$t(title)"
                                />
                        </q-tabs>

                        <q-separator />

                        <q-tab-panels v-model="tab" animated v-if="BItm.items">
                            <q-tab-panel
                                v-for="(lnItem,idx) in BItm.items"
                                :key="'BTab'+idx"
                                :name="'tab'+idx">
                                <div class='row justify-left'
                                    v-for="(LItm,Lidx) in lnItem"
                                    :key="'litm'+Lidx"
                                >
                                    <div class='col-10 col-md-1'
                                        v-for="(nItm,nidx) in LItm"
                                        :key="'nitm'+nidx"
                                    >
                                    <div v-if="nItm.BT<1"></div>
                                    <OB
                                        v-if="nItm.BT>=0"
                                        :store="store"
                                        :tid="curTid"
                                        :GameID="curGameID"
                                        :dgt="BItm.dgt"
                                        :Odds="getOdds(nItm,nItm.BT)"
                                        :rightLine="nidx==(LItm.length-1)"
                                        :bottomLine="Lidx==(LItm.length-1) || nidx==9 || (lnItem[Lidx+1] && lnItem[Lidx+1][nidx] && lnItem[Lidx+1][nidx].BT<0)"
                                        :GType="curGType"
                                        :colorWave="BItm.colorWave"
                                        :colorExt="BItm.colorExt"
                                        @OddChange="getCurOdds"></OB>
                                    </div>
                                </div>
                            </q-tab-panel>
                        </q-tab-panels>
                    </q-card>
                </div>
                <div
                    v-if="BItm.aBT"
                    class="q-gutter-y-md"
                >
                    <q-card>
                        <q-tabs
                        v-model="tab"
                        dense
                        class="text-grey"
                        active-color="primary"
                        indicator-color="primary"
                        align="left"
                        narrow-indicator
                        >
                            <q-tab
                                v-for="(BT,idx) in BItm.aBT"
                                :key="'BItm'+idx"
                                :name="'tab'+BT"
                                :label="$t(`Game.${curGType}.Item.${BT}.title`)"
                                @click="BItm.curBT=BT;BItm.twOdds ? BItm.isTwOdd=BItm.twOdds[idx] : 0; BItm.NoOddsAdjust ? BItm.NoAdjust=BItm.NoOddsAdjust[idx]:0"
                                />
                        </q-tabs>

                        <q-separator />
                        <q-tab-panels v-model="tab" animated>
                            <q-tab-panel
                                v-for="(BT,idx) in BItm.aBT"
                                :key="'BTab'+idx"
                                :name="'tab'+BT">
                                <div v-if="BItm.item && typeof(BItm.item)==='function' && BItm.Position ">
                                    <q-btn-group outline>
                                        <q-btn
                                            v-for="(pos,pidx) in BItm.Position"
                                            :key="'pidx'+pidx"
                                            :color="BItm.PosSelected && BItm.PosSelected[idx]== pos ? 'amber' : 'secondary'"
                                            :label="$t(`Game.${curGType}.Item.${BT}.sctitle.${pos}`)"
                                            @click="BItm.PosSelected ? BItm.PosSelected[idx]=pos : BItm.PosSelected=[1,1,1,1,1,1]"
                                            />
                                    </q-btn-group>
                                <div class='row justify-left'
                                    v-for="(LItm,Lidx) in tmpItem=BItm.item(BT,BItm.start,BItm.end,BItm.PosSelected ? BItm.PosSelected[idx] : false)"
                                    :key="BT+'bitm'+Lidx"
                                >
                                    <div class='col-10 col-md-1'
                                        v-for="(nItm,nidx) in LItm"
                                        :key="BT+'litm'+nidx"
                                    >
                                        <OB
                                            :store="store"
                                            :tid="curTid"
                                            :GameID="curGameID"
                                            :dgt="BItm.dgt"
                                            :Odds="getOdds(nItm,nItm.BT)"
                                            :rightLine="nidx==(LItm.length-1)"
                                            :bottomLine="Lidx==(tmpItem.length-1) || (nidx==9 && (tmpItem[Lidx+1] && tmpItem[Lidx+1].length<10))"
                                            :GType="curGType"
                                            :colorWave="BItm.colorWave"
                                            :colorExt="BItm.colorExt"
                                            @OddChange="getCurOdds"></OB>
                                    </div>
                                </div>
                                </div>
                            <div v-if="BItm.item && !BItm.Position">
                                <div class='row justify-left'
                                    v-for="(LItm,Lidx) in BItm.item"
                                    :key="'bitm'+Lidx"
                                >
                                    <div class='col-10 col-md-1'
                                        v-for="(nItm,nidx) in LItm"
                                        :key="'litm'+nidx"
                                    >
                                        <OB
                                            v-if="BItm.item"
                                            :store="store"
                                            :tid="curTid"
                                            :GameID="curGameID"
                                            :dgt="BItm.dgt"
                                            :Odds="getOdds(nItm,BT)"
                                            :NoOddsAdjust="!!BItm.NoAdjust"
                                            :ExtOdds="Game.getOdds(nItm,BT,(BItm.isTwOdd ? BItm.isTwOdd : 0 ))"
                                            :rightLine="nidx==(LItm.length-1)"
                                            :bottomLine="parseInt(Lidx,10)==BItm.item.length-1 || (nidx==(BItm.item[Lidx].length-1) && (BItm.item[Lidx+1] && BItm.item[Lidx+1].length<BItm.item[Lidx].length)) || (BItm.item[Lidx+1] && (!BItm.item[Lidx+1][nidx] || BItm.item[Lidx+1][nidx].BT<0))"
                                            :GType="curGType"
                                            :colorWave="BItm.colorWave"
                                            :colorExt="BItm.colorExt"
                                            @OddChange="getCurOdds"></OB>
                                    </div>
                                </div>
                            </div>
                            </q-tab-panel>
                        </q-tab-panels>
                    </q-card>
                </div>
                <div
                    v-if="!BItm.aBT && BItm.item"
                >
                    <div>{{ `${BItm.title ? $t(BItm.title) : '' } ${(BItm.subtitle ? $t(BItm.subtitle) : '')}` }}</div>
                        <div class="row FastSlt" v-if="BItm.FastSlt">
                            <div class="row" v-if="BItm.FastSlt.subcont">
                                <div class="row" v-for="(itm,idx) in BItm.FastSlt.subcont" :key="'fast'+idx">
                                    <div>{{itm.title ? $t(itm.title) : ''}}</div>
                                    <div v-for="(slt,sltidx) in  itm.subitem" :key="'fastsub'+idx+'-'+sltidx">
                                        <q-btn :outline="!slt.isActive" size='sm' class='btn-pad' color="primary" :label="slt.num" @click="
                                        setActive(BItm.FastSlt ? BItm.FastSlt.subcont : []);slt.isActive=true"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div class='row justify-left'
                        v-for="(LItm,Lidx) in BItm.item"
                        :key="'bitm'+Lidx"
                    >
                        <div class='col-10 col-md-1'
                            v-for="(nItm,nidx) in LItm"
                            :key="nItm.BT+'litm'+nidx"
                        >
                            <OB
                                v-if="BItm.item"
                                :store="store"
                                :tid="curTid"
                                :GameID="curGameID"
                                :dgt="BItm.dgt"
                                :Odds="getOdds(nItm,BItm.BT ? BItm.BT : nItm.BT)"
                                :rightLine="nidx==(LItm.length-1)"
                                :bottomLine="parseInt(Lidx,10)==BItm.item.length-1 || (nidx==(BItm.item[Lidx].length-1) && (BItm.item[Lidx+1] && BItm.item[Lidx+1].length<BItm.item[Lidx].length)) || (BItm.item[Lidx+1] && (!BItm.item[Lidx+1][nidx] || BItm.item[Lidx+1][nidx].BT<0))"
                                :GType="curGType"
                                :colorWave="BItm.colorWave"
                                :colorExt="BItm.colorExt"
                                @OddChange="getCurOdds"></OB>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
// import Vue from 'vue';
// import Component from 'vue-class-component';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import LayoutStoreModule from './data/LayoutStoreModule';
import OddsBlock from './components/OddsBlock.vue';
import GameSelector from './components/GameSelector.vue';
import { Odds, SelectOptions, Msg, CommonParams, LoginInfo, AnyObject } from './data/if';
import Layouts, { Layout, contBlock, numBlock, FastSltSub, FastSltSubItem } from './components/Odds/layouts';
import { CGame, Data } from './components/Odds/Games';

interface BTNs {
    title:string;
    BT?:number;
    SubItm?:number[];
    SubMenu?:string[];
}

@Component({
    components: {
        OB: OddsBlock,
        GS: GameSelector,
    },
})
export default class OddsManager extends Vue {
    store = getModule(LayoutStoreModule);
    sltBtn:BTNs[]=[];
    dfLayout:Layout=[];
    dfColor:string[]=[];
    sltColor='light-blue'
    unSltColor='teal'
    curGameID=0;
    cont:contBlock[]=[];
    Game:CGame=new CGame();
    oddshow=false;
    curBt:number|null=null;
    curGType='';
    tab='';
    tmpItem:any;
    curTid=0;
    curInterval:number|null=null;
    curIdx=0;
    Steps:number[]=[];
    refSecs:number[]=[5, 10, 15, 30, 60];
    refSec=5;
    CountDown=0;
    odds:Odds={
        Num: 1,
        Odds: 49,
        Risk: 123456,
    }
    SortID=0;
    SortName='';
    SortItems:string[]=[];
    showSubTotal = false;
    curPayClassID = 0;
    get BtnSubTotal() {
        const titlekey = `Label.SubTotal.${this.showSubTotal ? 'Close' : 'Open'}`;
        return this.$t(titlekey);
    }
    get PInfo():LoginInfo {
        return this.store.personal;
    }
    get Total() {
        return this.Game.Total;
    }
    @Watch('Total', { deep: true, immediate: true })
    onTotalChange(newV:number, oldV:number) {
        console.log('onTotalChange:', newV, oldV);
    }
    async setCurGames(v:SelectOptions) {
        console.log('setGames:', v, this.PInfo);
        if (v.value === this.curGameID) {
            return;
        }
        if (this.curInterval) {
            window.clearInterval(this.curInterval);
        }
        if (v.GType) {
            this.oddshow = false;
            this.showSubTotal = false;
            const f = this.PInfo.PayClass?.find((itm) => (itm.GameID === v.value));
            if (f) {
                this.curPayClassID = f.PayClassID;
            }
            /*
            console.log(this.$t(`Game.${v.GType}.Menu.Group`))
            const tmp:any=this.$t(`Game.${v.GType}.Menu.Group`);
            tmp.map((itm:BTNs)=>{
                this.sltBtn.push(itm);
            })
            */
            this.Game.GType = v.GType;
            this.curGameID = v.value;
            this.curGType = v.GType;
            this.dfLayout = Layouts[v.GType];
            this.dfColor = [];
            // this.getOpSteps();
            Object.keys(this.dfLayout).map((key) => {
                // console.log('layout:',key,this.dfLayout[key]);
                if (key === '0') {
                    this.cont = this.dfLayout[key].cont;
                    this.dfColor.push(this.sltColor);
                } else {
                    this.dfColor.push(this.unSltColor);
                }
            });
            // this.cont = this.dfLayout[0].cont;
            // console.log('setCurGames',this.dfLayout);
            if (v.value) {
                const param:CommonParams = {
                    UserID: this.PInfo.id,
                    sid: this.PInfo.sid,
                    GameID: v.value,
                    PayClassID: this.curPayClassID,
                    MaxOddsID: 0,
                };
                const ans:Msg = await this.store.ax.getApi('CurOddsInfo', param);
                // console.log('get CurOddsInfo:',ans);
                if (ans.data) {
                    /*
                    let Steps:OSteps[]=[];
                    if(ans.Steps){
                        Steps=ans.Steps;
                    }
                    */
                    this.Game.inidata(ans.data as Data); // , this);
                    // console.log('Game:',this.Game.Items)
                    Object.keys(this.dfLayout).map((key) => {
                        // const me = this;
                        Object.keys(this.dfLayout[key].cont).map((idx) => {
                            if (this.dfLayout[key].cont[idx] && this.dfLayout[key].cont[idx].Sortable) {
                                if (this.dfLayout[key].cont[idx].BT) {
                                    this.Game.setSortTableByBT(this.dfLayout[key].cont[idx].BT, true);
                                } else if (this.dfLayout[key].cont[idx].aBT) {
                                    this.dfLayout[key].cont[idx].aBT.map((BT:any) => {
                                        this.Game.setSortTableByBT(BT, true);
                                    });
                                }
                            }
                        });
                    });
                    this.curTid = ans.tid;
                    // console.log('CGame MaxOddsID:',this.Game.MaxOddsID);
                    if (this.curInterval) {
                        window.clearInterval(this.curInterval);
                    }
                    // this.curInterval=window.setInterval(this.getCurOdds,3000);
                    this.CountDown = this.refSec;
                    this.curInterval = window.setInterval(() => {
                        this.refreshData();
                    }, 1000);
                }
            }
            this.oddshow = true;
        }
    }
    getOdds(Num:numBlock, BT?:number) {
        const gOdds = this.Game.getOdds(Num, BT);
        // if(this.curGType==='HashSix') console.log('getOdds:',Num,BT,Odds);
        return gOdds;
    }
    refreshData(doitnow?:number) {
        if (doitnow) {
            this.CountDown = 0;
        } else {
            this.CountDown -= 1;
        }
        if (this.CountDown === 0) {
            this.CountDown = this.refSec;
            this.getCurOdds();
        }
        // console.log('refresh',this.refSec);
    }
    async getCurOdds() {
        const param:CommonParams = {
            UserID: this.PInfo.id,
            sid: this.PInfo.sid,
            GameID: this.curGameID,
            PayClassID: this.curPayClassID,
            MaxOddsID: this.Game.MaxOddsID,
        };
        const ans:Msg = await this.store.ax.getApi('CurOddsInfo', param);
        if (ans.data) {
            this.Game.updateData(ans.data as Data); // , this);
            this.curTid = ans.tid;
            // this.$forceUpdate();
            // console.log('do changePage');
            this.changePage(this.cont, this.curIdx);
        }
    }
    getSubTotal(v:contBlock[]) {
        let bts:number[] = [];
        v.map((itm) => {
            if (itm.BT) {
                // this.curSubTotal = this.Game.getBtTotal(itm.BT);
                bts.push(itm.BT);
            } else if (itm.aBT) {
                // this.curSubTotal = this.Game.getBtTotal(itm.aBT);
                bts = bts.concat(itm.aBT);
            } else if (itm.item) {
                (itm.item as numBlock[][]).map((nba) => {
                    nba.map((nb) => {
                        const f = bts.find((bt) => bt === nb.BT);
                        if (!f) bts.push(nb.BT);
                    });
                });
            } else if (itm.items) {
                itm.items.map((nbaa) => {
                    nbaa.map((nba) => {
                        nba.map((nb) => {
                            const f = bts.find((bt) => bt === nb.BT);
                            if (!f) bts.push(nb.BT);
                        });
                    });
                });
            }
        });
        return this.Game.getBtTotal(bts);
    }
    changePage(v:contBlock[], key:number|string) {
        if (typeof (key) === 'string') key = parseInt(key, 10);
        if (this.cont !== v) {
            if (v[0].aBT) {
                this.tab = `tab${v[0].aBT[0]}`;
            }
            if (v[0].Selects) {
                this.tab = `tab${0}`;
            }
        }
        this.cont = v;
        this.curIdx = key;
        // console.log('changePage cont:',v,this.cont);
        this.dfColor = this.dfColor.map((itm, idx) => {
            if (idx === key) itm = this.sltColor;
            else itm = this.unSltColor;
            return itm;
        });
        // console.log('show',this.dfColor);
        // console.log('show',v,this.Game.getOdds(2,0));     
    }
    async setStop(stop:number, curCont?:contBlock[]) {
        let bt : string | undefined = '';
        let tmp:number[] = [];
        if (curCont) {
            curCont.map((itm:contBlock) => {
                if (itm.aBT) {
                    tmp = tmp.concat(itm.aBT);
                } else {
                    // let lines:numBlock[][]=itm.item as numBlock[][];
                    const lines:AnyObject = itm.item as numBlock[][];
                    Object.keys(lines).map((key) => {
                        const items:numBlock[] = lines[key] as numBlock[];
                        items.map((odds) => {
                            const f = tmp.find((fbt) => fbt === odds.BT);
                            if (!f) {
                                tmp.push(odds.BT);
                            }
                        });
                    });
                }
            });
        }
        // console.log('setStop',curCont,tmp);
        if (tmp.length > 0) bt = tmp.join(',');
        const param:CommonParams = {
            UserID: this.PInfo.id,
            sid: this.PInfo.sid,
            GameID: this.curGameID,
            tid: this.curTid,
            isStop: stop,
            BetTypes: bt,
        };
        const ans:Msg = await this.store.ax.getApi('setStop', param);
        // console.log('setStop:',ans);
        if (ans.ErrNo === 0) {
            this.getCurOdds();
        }
    }
    setActive(subcont?:FastSltSub[]) {
        if (!subcont) subcont = [];
        subcont.map((itm) => {
            itm.subitem.map((subitm:FastSltSubItem) => {
                subitm.isActive = false;
            });
        });
    }
    // showinfo(num,v) {
    //     console.log('showinfo',num,v);
    // }
    beforeDestroy() {
        // console.log('page beforeDestroy',this.$route.name);
        if (this.curInterval) {
            window.clearInterval(this.curInterval);
        }
    }
    setSortType(sortid:number, sortname:string) {
        this.SortID = sortid;
        this.SortName = sortname;
        this.Game.setSortType(sortid);
    }
    mounted() {
        this.SortName = this.$t('Label.SortItem.0').toString();
        this.SortItems.push(this.$t('Label.SortItem.0').toString());
        this.SortItems.push(this.$t('Label.SortItem.1').toString());
        this.SortItems.push(this.$t('Label.SortItem.2').toString());
        console.log('OddsManager mounted:', this.PInfo);
    }
}
// export default Vue.extend({
    
// })
</script>
<style scoped>
.talign1 {
    line-height:48px;
    padding-left: 12px;
}
.pbtn {
    padding: 6px 4px;
}
.talign {
    text-align: center;
    line-height:48px;
    padding: 0 4px 0 4px;
}
.btn-pad {
    padding: 4px 12px;
}
.FastSlt {
    padding-bottom: 5px;
}
.Total {
    margin-top: 12px;
}
.btnSlt {
    border: 0px;
}
.btn tr {
    margin-top: 0px;
}
</style>
