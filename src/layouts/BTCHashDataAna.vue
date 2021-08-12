<template>
  <div>
    <div class="row">
      <div class='col-5'><q-select outlined v-model="model" :options="options" label="歷史分析記錄" /></div>
      <q-btn color="negative" label="刪除"  @click="delHashAna()" />
    </div>
    <div class="row">
      <q-input standout="bg-teal text-white" v-model="Min" label="最小值" />
      <q-input standout="bg-teal text-white" v-model="Max" label="最大值" />
      <q-input standout="bg-teal text-white" v-model="Pos" label="字數" />
      <q-checkbox v-model="allowSameNum" label="可重複" />
      <q-checkbox v-model="NotOnlyDigital" label="包含英文字(16進位)" />
      <q-checkbox v-model="NoZero" label="去除前導 0" />
      <q-checkbox v-model="RepetLastOne" label="疊字" />
      <q-btn color="primary" label="分析"  @click="doHashAna()" />
    </div>
    <div class="row">
      <div>
      <q-chip>
        <q-avatar icon="save_alt" color="indigo" text-color="white" />
        {{HNum.Counter}}
      </q-chip>
      </div>
      <div v-if="HNum.fails.length>0">
          <q-chip
            v-for="(itm,idx) in HNum.fails"
            :key="'fail'+idx"
            clickable @click="fails=itm;alert=true"
          >
            <q-avatar color="warning" text-color="white">{{itm.pos}}</q-avatar>
            {{itm.Counter}}
          </q-chip>
      </div>
    </div>
    <div class="row">
      <q-btn-group>
        <q-btn
          v-for="(itm,idx) in Btns"
          :key="'btn'+idx"
          :color="itm.color"
          glossy :label="itm.title" @click="chgTitle(itm.title)" />
      </q-btn-group>
    </div>
    <div v-if="TB.SNum.length>0">
      <div
        v-for="(itm,idx) in TB.SNum"
        :key="'numline'+idx"
        class="row"
      >
        <div
          v-for="(num,nidx) in itm"
          :key="'block'+nidx"
        >
          <q-chip>
            <q-avatar :color="`${TB.Color}-${Math.floor((num.Rate-TB.MinR)/TB.RateDf*10)+1 > 10 ? 10 : Math.floor((num.Rate-TB.MinR)/TB.RateDf*10)+1}`" text-color="white">{{num.Num}}</q-avatar>
            {{num.Rate.toFixed(4)}}
          </q-chip>
        </div>
      </div>
    </div>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{fails.pos}}個數字{{fails.Counter}}組</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list bordered separator style="max-width: 558px">
            <q-item
              v-for="(itm,idx) in fails.data"
              :key="'fail'+idx"
              clickable
              v-ripple>
              <q-item-section>
                <q-item-label caption>{{itm.height}}</q-item-label>
                <q-item-label>{{itm.hashvalue}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import LayoutStoreModule from './data/LayoutStoreModule';
import { CommonParams, Msg, SelectOptions, HashAna } from './data/if';
import HASH from './class/HashAna';

interface KeyObj {
  [key:string]:number;
}
interface HashData {
  height:number;
  hashvalue:string;
}
interface PosNum {
  Counter:number;
  Nums:KeyObj;
}
interface FailC {
  pos:number;
  Counter:number;
  data:HashData[];
}
interface NumH {
  fails:FailC[];
  Counter:number;
  Num:PosNum[];
  TNum:PosNum;
}
interface NumBlock {
  Num:string;
  Rate:number;
}
interface TBlock {
  MaxR:number;
  MinR:number;
  RateDf:number;
  Color:string;
  SNum:NumBlock[][];
}
@Component
export default class MyLayout extends Vue {
    private store = getModule(LayoutStoreModule);
    dStart=0;
    StopDo=false;
    steps=10000;
    curSteps=0;
    Min='0';
    Max='49';
    Pos='6';
    allowSameNum=false;
    NotOnlyDigital=false;
    NoZero=false;
    RepetLastOne=false; // 疊字
    dfColor='secondary';
    sltColor='primary';
    options:SelectOptions[]=[];
    model:SelectOptions={ value: 0, label: 'none' };
    alert=false;
    fails:FailC={ pos: 0, Counter: 0, data: [] };
    @Watch('model', { immediate: true, deep: true })
    onModelChange(newVal:SelectOptions) {
      // console.log('onModelChange:',newVal);
      if (newVal.data) {
        if (newVal.label) {
          const tmp = newVal.label.split('-');
          this.Min = tmp[0];
          this.Max = tmp[1];
          this.Pos = tmp[2];
          this.allowSameNum = tmp[3] === '1';
          this.NotOnlyDigital = tmp[4] === '1';
          this.NoZero = tmp[5] === '1';
          this.RepetLastOne = tmp[6] === '1';
        }
        this.HNum = JSON.parse(newVal.data);
        this.setBlock(this.HNum.TNum);
        this.setBtns();
      }
    }
    Btns=[
      { title: 'All', color: 'primary' },
      { title: '1', color: 'secondary' },
      { title: '2', color: 'secondary' },
      { title: '3', color: 'secondary' },
      { title: '4', color: 'secondary' },
      { title: '5', color: 'secondary' },
      { title: '6', color: 'secondary' },
    ];
    HNum:NumH={
      fails: [],
      Counter: 0,
      Num: [],
      TNum: {
        Counter: 0,
        Nums: {},
      },
    };
    TB:TBlock={
      MaxR: 0,
      MinR: 0,
      RateDf: 0,
      Color: 'red',
      SNum: [],
    }
    SNum:NumBlock[][]=[];
    Cols=10;
    /*
    @Watch('allowSameNum',{ immediate: true, deep: true })
    onAllowSameNum(val:number){
        console.log(this.allowSameNum);
    }
    */
    get showProgress() {
        return this.store.showProgress;
    }
    set showProgress(v:boolean) {
        this.store.setShowProgress(v);
    }
    get PInfo() {
      return this.store.personal;
    }
    async doHashAna() {
      console.log('doHashAna start:', new Date().toLocaleTimeString());
      this.showProgress = true;
      this.StopDo = false;
      this.dStart = 0;
      this.curSteps = 0;
        this.HNum = {
          fails: [],
          Counter: 0,
          Num: [],
          TNum: {
            Counter: 0,
            Nums: {},
          },
        };
      this.setBtns();
      // while (!this.StopDo) {
      if (!this.StopDo) {
        await this.getBTCHashData();
      }
      this.setBlock(this.HNum.TNum);
      await this.saveHashAna();
      await this.getHashAna();
      this.showProgress = false;
      console.log('doHashAna end:', new Date().toLocaleTimeString());
    }
    async getBTCHashData() {
        if (this.curSteps === 0) {
          this.curSteps = this.steps;
        } else {
          this.dStart = this.curSteps;
          this.curSteps += this.steps;
        }
        const param:CommonParams = {
            UserID: this.PInfo.id,
            sid: this.PInfo.sid,
            idx: this.dStart,
            steps: this.steps,
        };
        const msg:Msg = await this.store.ax.getApi('getBTCHashTable', param);
        // console.log('getBTCHashData:',msg);
        if (msg.ErrNo === 0) {
          if (msg.data) {
            const dta = msg.data as HashData[];
            if (dta.length === 0) {
              this.StopDo = true;
              return;
            }
            dta.map((itm) => {
              const Max = parseInt(this.Max, 10);
              const Min = parseInt(this.Min, 10);
              const Pos = parseInt(this.Pos, 10);
              const hl = new HASH(itm.hashvalue, Max, Min, Pos, this.allowSameNum, !this.NotOnlyDigital, this.NoZero, this.RepetLastOne).NumLine;
              if (hl.length < Pos) {
                if (this.HNum.fails) {
                  const f = this.HNum.fails.find((fitm) => fitm.pos === hl.length);
                  if (f) {
                    f.Counter += 1;
                    f.data.push(itm);
                  } else {
                    this.HNum.fails.push({ pos: hl.length, Counter: 1, data: [itm] });
                  }
                } else {
                  this.HNum.fails = [{ pos: hl.length, Counter: 1, data: [itm] }];
                }
              } else {
                this.HNum.Counter += 1;
                hl.map((num, idx) => {
                  this.HNum.TNum.Counter += 1;
                  if (this.HNum.TNum.Nums[`${num}`]) {
                    this.HNum.TNum.Nums[`${num}`] += 1;
                  } else {
                    this.HNum.TNum.Nums[`${num}`] = 1;
                  }
                  if (this.HNum.Num[idx]) {
                    this.HNum.Num[idx].Counter += 1;
                  } else {
                    this.HNum.Num[idx] = {
                      Counter: 1,
                      Nums: {},
                    };
                  }
                  if (this.HNum.Num[idx].Nums[`${num}`]) {
                    this.HNum.Num[idx].Nums[`${num}`] += 1;
                  } else {
                    this.HNum.Num[idx].Nums[`${num}`] = 1;
                  }
                });
              }
            });
          }
          // console.log('getBTCHashData:',this.HNum);
        } else {
          console.log('getBTCHashData error:', msg);
        }
    }
    setBtns() {
      this.Btns = [];
      const len:number = parseInt(this.Pos, 10) + 1;
      for (let i = 0; i < len; i++) {
        if (i === 0) {
          this.Btns.push({ title: 'All', color: this.sltColor });
        } else {
          this.Btns.push({ title: `${i}`, color: this.dfColor });
        }
      }
    }
    chgTitle(title:string) {
      this.Btns.map((itm, idx) => {
        if (itm.title === title) {
          itm.color = this.sltColor;
          if (idx === 0) {
            this.setBlock(this.HNum.TNum);
          } else {
            this.setBlock(this.HNum.Num[idx - 1]);
          }
        } else {
          itm.color = this.dfColor;
        }
        return itm;
      });
    }
    async saveHashAna() {
      const param:CommonParams = {
        UserID: this.PInfo.id,
        sid: this.PInfo.sid,
        Cond: `${this.Min}-${this.Max}-${this.Pos}-${this.allowSameNum ? 1 : 0}-${this.NotOnlyDigital ? 1 : 0}-${this.NoZero ? 1 : 0}-${this.RepetLastOne ? 1 : 0}`,
        AnaData: JSON.stringify(this.HNum),
      };
      const msg:Msg = await this.store.ax.getApi('saveHashAna', param, 'post');
      if (msg.ErrNo !== 0) {
        console.log('saveHashAna', msg);
      }
    }
    async delHashAna() {
      if (!this.model.value) return;
      this.showProgress = true;
      const param:CommonParams = {
        UserID: this.PInfo.id,
        sid: this.PInfo.sid,
        id: this.model.value,
      };
      const msg:Msg = await this.store.ax.getApi('delHashAna', param);
      if (msg.ErrNo !== 0) {
        console.log('delHashAna', msg);
        this.showProgress = false;
      } else {
        await this.getHashAna();
        this.showProgress = false;
        this.$q.dialog({
            title: this.$t('Label.Delete') as string,
            message: 'OK!!',
        });
      }
    }
    async getHashAna() {
      const param:CommonParams = {
        UserID: this.PInfo.id,
        sid: this.PInfo.sid,
      };
      this.options = [{ value: 0, label: 'none' }];
      this.model = { value: 0, label: 'none' };
      const msg:Msg = await this.store.ax.getApi('getHashAna', param);
      if (msg.ErrNo !== 0) {
        console.log('saveHashAna', msg);
      } else if (msg.data) {
          const dta = msg.data as HashAna[];
          dta.map((itm) => {
            const tmp:SelectOptions = {
              value: itm.id,
              label: itm.Cond,
              data: itm.AnaData,
            };
            this.options.push(tmp);
          });
        }
    }
    setBlock(pn:PosNum) {
      // console.log('Set Block:',pn);
      this.TB = { MaxR: 0, MinR: 999, RateDf: 0, Color: 'red', SNum: [] };
      const nb:NumBlock[][] = [];
      let nn:NumBlock[] = [];
      Object.keys(pn.Nums).map((key) => {
        const r = (pn.Nums[key] / pn.Counter) * 100;
        if (r < this.TB.MinR) this.TB.MinR = r;
        else if (r > this.TB.MaxR) this.TB.MaxR = r;
        const tmp:NumBlock = {
          Num: key,
          Rate: r,
        };
        nn.push(tmp);
        if (nn.length === this.Cols) {
          nb.push(nn);
          nn = [];
        }
      });
      if (nn.length > 0) nb.push(nn);
      this.SNum = nb;
      this.TB.RateDf = this.TB.MaxR - this.TB.MinR;
      this.TB.SNum = nb;
      // console.log('Set Block:',this.TB);
    }
    mounted() {
      this.getHashAna();
    }
}
</script>
<style lang="less" scoped>

</style>
