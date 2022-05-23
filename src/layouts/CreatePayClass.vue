<template>
	<div>
		<div class="row q-pa-sm">
			<div><GS :store='store' @setGames="setCurGames"></GS></div>
            <div class="talign">{{ $t('Label.PayClassName') }}</div>
            <div class="pbtn"><q-input outlined dense v-model="PayClassName" /></div>
            <div class="pbtn"><q-btn color="blue" icon-right="save" :label="$t('Label.SavePayClassName')" @click="SavePayClass();" /></div>
		</div>
        <div v-if="models">
            <div class="my-pa-md q-gutter-y-md" style="max-width: 600px">
            <q-card>
                <q-tabs
                v-model="tab"
                dense
                class="bg-primary text-silver shadow-2"
                active-color="white"
                indicator-color="yellow"
                align="justify"
                narrow-indicator
                >
                <q-tab
                    v-for="(itm,idx) in Funcs"
                    :key="idx"
                    :label="itm.title" @click="expendPR(itm.id)"
                    :name="itm.id" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated>
                <q-tab-panel :name="Funcs[0].id">
                    <div class="row justify-center">
                        <div class="col-2">{{ $t('Label.RateDiff') }}</div>
                        <div class="col-1"><input v-model="Funcs[0].value" style="max-width:30px" />%</div>
                        <div class="col">{{ $t('Label.RateDiffInfo') }}</div>
                    </div>
                </q-tab-panel>

                <q-tab-panel :name="Funcs[1].id">
                    <div class="row justify-center">
                        <div class="q-pa-md col-12 col-md-2">{{ $t('Label.ProfitDiff') }}</div>
                        <div class="q-pa-md col-12 col-md-2"><input v-model="Funcs[1].value"  style="max-width:30px" />%</div>
                        <div class="q-pa-md col-12 col-md-8">{{ $t('Label.ProfitDiffInfo') }}</div>
                    </div>
                </q-tab-panel>

                <q-tab-panel :name="Funcs[2].id">
                    <div class="row justify-center">
                        <div class="q-pa-md col-12 col-md-2">{{ $t('Label.FixProfit') }}</div>
                        <div class="q-pa-md col-12 col-md-2"><input v-model="Funcs[2].value"  style="max-width:30px" />%</div>
                        <div class="q-pa-md col-12 col-md-8">{{ $t('Label.FixProfitInfo') }}</div>
                    </div>
                </q-tab-panel>
                <q-tab-panel :name="Funcs[3].id">
                    <div class="row justify-center">
                        <div class="q-pa-md col-12 col-md-2">{{ $t('Label.FloatProfit')}}</div>
                        <div class="q-pa-md col-12 col-md-10">{{ $t('Label.FloatProfitInfo')}}</div>
                    </div>
                    <div class="row justify-center">
                        <div class="q-pa-md col-12 col-md-2">{{ $t('Label.WinChance')}}</div>
                        <div class="q-pa-md col-12 col-md-2">{{ $t('Label.FloatProfit')}}</div>
                        <div class="q-pa-md col-12 c{-12 col-md-8"></div>
                    </div>
                    <div
                        class="row justify-center rateline"
                        v-for="(rs,i) in RSteps"
                        :key="'RSteps'+i"
                    >
                        <div class="q-pa-md col-12 col-md-2">{{ rs.title }}</div>
                        <div class="q-pa-md col-12 col-md-2"><input v-model="rs.model"  style="max-width:30px" />%</div>
                        <div class="q-pa-md col-12 col-md-8"></div>
                    </div>
                </q-tab-panel>
                </q-tab-panels>
            </q-card>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators';
import LayoutStoreModule from './data/LayoutStoreModule';
import { SelectOptions, CommonParams, Msg, BasePayRateItm, LoginInfo } from './data/if';
import GameSelector from './components/GameSelector.vue';
import { BaNum } from './components/func';

Vue.component('GS', GameSelector);

interface FuncBtn {
    id:number;
    color:string;
    title:string;
    value:string;
}
interface RateRange {
    Min:number;
    Max:number;
}
interface RateSteps {
    title:string;
    Range: RateRange;
    rate:number;
    model:number|null;
}
interface SetPayClassParam {
    type:number;
    param:string|RateSteps[];
}
interface PayRate {
    BetType:number;
    SubType:number;
    Rate:number;
}
const DEFAULT_COLOR = 'blue';
const SELECTED_COLOR = 'purple';
@Component
export default class BetClass extends Vue {
	private store = getModule(LayoutStoreModule);
    private models:SelectOptions | null = null;
    BPR:BasePayRateItm[]=[];
    PayClassName='';
	options:SelectOptions[] = [
		{ value: 0, label: 'default' },
    ];
    tab:number|null=null;
    Funcs:FuncBtn[] = [];
    ExpendPayClass = false;
    opPayRate:string | null=null;
    FuncSlted:number|null=null;
    curGameID=0;
    // > Min, <= Max 
    RSteps:RateSteps[]=[
        { title: '>1/2', Range: { Min: 1 / 2, Max: 999 }, rate: 1 / 2, model: null },
        { title: '<=1/2', Range: { Min: 1 / 3, Max: 1 / 2 }, rate: 1 / 2, model: null },
        { title: '<=1/3', Range: { Min: 1 / 4, Max: 1 / 3 }, rate: 1 / 3, model: null },
        { title: '<=1/4', Range: { Min: 1 / 5, Max: 1 / 4 }, rate: 1 / 4, model: null },
        { title: '<=1/5', Range: { Min: 1 / 10, Max: 1 / 5 }, rate: 1 / 5, model: null },
        { title: '<=1/10', Range: { Min: 1 / 25, Max: 1 / 10 }, rate: 1 / 10, model: null },
        { title: '<=1/25', Range: { Min: 1 / 50, Max: 1 / 25 }, rate: 1 / 25, model: null },
        { title: '<=1/50', Range: { Min: 1 / 100, Max: 1 / 50 }, rate: 1 / 50, model: null },
        { title: '<=1/100', Range: { Min: 1 / 250, Max: 1 / 100 }, rate: 1 / 100, model: null },
        { title: '<=1/250', Range: { Min: 1 / 500, Max: 1 / 250 }, rate: 1 / 250, model: null },
        { title: '<=1/500', Range: { Min: 1 / 1000, Max: 1 / 500 }, rate: 1 / 500, model: null },
        { title: '<=1/1000', Range: { Min: 0, Max: 1 / 1000 }, rate: 1 / 1000, model: null },
    ];
	get UserID():string {
		if (this.store.personal.id) {
			return `${this.store.personal.id}`;
		}
		return '';
    }
    get PInfo():LoginInfo {
        return this.store.personal;
    }
    expendPR(id:number) {
        this.FuncSlted = id;
        this.Funcs.map((itm) => {
            if (itm.id === id) {
                itm.color = SELECTED_COLOR;
            } else {
                itm.color = DEFAULT_COLOR;
            }
        });
        // console.log('tab:',this.tab);
    }
    setCurGames(v:SelectOptions) {
        this.models = v;
        this.curGameID = v.value;
        this.tab = 0;
        this.BPR = [];
    }

    async SavePayClass() {
        let RateData:any;
        if (this.tab === null) {
            return;
        }
        if (this.BPR.length === 0) {
            this.BPR = await this.getBasePayRate(this.curGameID);
            console.log('SavePayClass', this.BPR);
        }
        const inp:number = parseFloat(this.Funcs[this.tab].value) / 100;
        switch (this.tab) {
            case 0:
                RateData = this.getRate0(inp);
                break;
            case 1:
                RateData = this.getRate1(inp);
                break;
            case 2:
                RateData = this.getRate2(inp);
                break;
            case 3:
            default: {
                const f = this.RSteps.find((itm) => itm.model === null);
                // console.log('SavePayClass RSteps chk:',f);
                if (f) return;
                RateData = this.getRate3();
            }
        }
        console.log('SavePayClass', inp, RateData);
        if (RateData.length < 1) return;
        const param:CommonParams = {
            UserID: this.PInfo.id,
            sid: this.PInfo.sid,
            GameID: this.curGameID,
            ModifyID: parseInt(this.UserID, 10),
            data: RateData,
            PayClassName: this.PayClassName,
        };
        const ans:Msg = await this.store.ax.getApi('savePayClass', param, 'post');
        const msg = {
          title: `${this.$t('Label.CratePayClass')}`,
          message: 'Ok!!',
        };
        if (ans.ErrNo !== 0) {
            msg.message = ans.ErrCon ? ans.ErrCon : 'Error!!';
        }
        this.$q.dialog(msg).onOk(() => {}).onCancel(() => {}).onDismiss(() => {});
    }
    // 基本盤比例
    getRate0(r:number):PayRate[] {
        const pr:PayRate[] = [];
        this.BPR.map((itm) => {
            const DfRate:number = itm.DfRate as number;
            let step:number = itm.PerStep as number;
            const base = BaNum(step);
            if (step === 0) step = 1;
            // const afr:number= (DfRate*r);
            // const afStep:number = Math.round(afr/step)*step;
            // const rate:number=Math.round((afStep - DfRate)*base)/base;
            const rate:number = Math.round((Math.round((DfRate * r) / step) * step - DfRate) * base) / base;
            // console.log(itm.BetType,itm.SubType,DfRate,`/${rate}/`,step,base);
            const tmp:PayRate = {
                BetType: itm.BetType as number,
                SubType: itm.SubType as number,
                Rate: rate,
            };
            // console.log(`getRate0 base: ${base}`,tmp,DfRate,step);
            pr.push(tmp);
        });
        return pr;
    }
    getRate1(r:number):PayRate[] {
        const pr:PayRate[] = [];
        // console.log('getRate1:',r);
        this.BPR.map((itm) => {
            const DfRate:number = itm.DfRate as number;
            const step:number = itm.PerStep as number;
            const pf = r + (itm.Profit ? itm.Profit : 0) / 100;
            const rt = Math.round(((1 - pf) / (itm.Probability ? itm.Probability : 1)) / step) * step;
            const base = BaNum(step);
            const rate:number = Math.round((rt - DfRate) * base) / base;
            // console.log(itm.BetType,itm.SubType,DfRate,pf,itm.Profit,r,`/${rate}/`);
            const tmp:PayRate = {
                BetType: itm.BetType as number,
                SubType: itm.SubType as number,
                Rate: rate,
            };
            pr.push(tmp);
        });
        return pr;
    }
    getRate2(r:number):PayRate[] {
        const pr:PayRate[] = [];
        this.BPR.map((itm) => {
            const DfRate:number = itm.DfRate as number;
            const step:number = itm.PerStep as number;
            const rt = Math.round(((1 - r) / (itm.Probability ? itm.Probability : 1)) / step) * step;
            const base = BaNum(step);
            const rate:number = Math.round((rt - DfRate) * base) / base;
            const tmp:PayRate = {
                BetType: itm.BetType as number,
                SubType: itm.SubType as number,
                Rate: rate,
            };
            pr.push(tmp);
        });
        return pr;
    }
    getRate3():PayRate[] {
        const pr:PayRate[] = [];
        this.BPR.map((itm) => {
            const DfRate:number = itm.DfRate as number;
            let step:number = itm.PerStep as number;
            const base = BaNum(step);
            if (step === 0) step = 1;
            const p = itm.Probability ? itm.Probability : 1;
            const f = this.RSteps.find((rs) => p > rs.Range.Min && p <= rs.Range.Max);
            let r = 0;
            if (f) {
                r = (f.model ? f.model : 1) / 100;
            }
            const rt = Math.round(((1 - r) / (itm.Probability ? itm.Probability : 1)) / step) * step;
            const rate:number = Math.round((rt - DfRate) * base) / base;
            const tmp:PayRate = {
                BetType: itm.BetType as number,
                SubType: itm.SubType as number,
                Rate: rate,
            };
            pr.push(tmp);
        });
        return pr;
    }
    initFuncBtn() {
        if (this.$t('Label.PayClassFunc')) {
            const t:string[] = this.$t('Label.PayClassFunc').toString().split(',');
            t.map((itm, idx) => {
                const f:FuncBtn = {
                    id: idx,
                    title: itm,
                    color: DEFAULT_COLOR,
                    value: '',
                };
                this.Funcs.push(f);
            });
        }
    }
    async getBasePayRate(gid:number):Promise<BasePayRateItm[]> {
        let dta:BasePayRateItm[] = [];
        const param:CommonParams = {
            UserID: this.PInfo.id,
            sid: this.PInfo.sid,
            GameID: gid,
        };
        const msg:Msg = await this.store.ax.getApi('getBasePayRate', param);
        if (msg.ErrNo === 0) {
            dta = msg.data as BasePayRateItm[];
        }
        console.log('getBasePayRate', msg);
        return dta;
    }
  mounted() {
        if (!this.store.isLogin) {
        this.$router.push({ path: '/login' });
        }
        this.initFuncBtn();
  }
}
</script>
<style scoped>
.rateline .q-pa-md{
    padding: 4px 4px;
}
.pbtn {
    padding: 6px 4px;
}
.talign {
    text-align: center;
    line-height:48px;
    padding: 0 4px 0 4px;
}
.my-pa-md {
    padding: 0px 16px;
}
</style>
