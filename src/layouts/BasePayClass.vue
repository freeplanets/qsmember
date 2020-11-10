<template>
	<div>
		<div class="row q-pa-sm">
            <div class='col-2'><GS :store='store' @setGames="setCurGames"></GS></div>
            <div class='pbtn'><q-btn color="blue" icon-right="save" label="Save" @click="SaveData();" /></div>
		    <div class='col' 
                v-if='curGameID'
                >
                <BTC :store='store' :GameID='curGameID' :pinfo='store.personal' @SltBT='SltBetTypes' ></BTC>
            </div>
		</div>
        <div class="row">
        <RCO class='col-6' :showUpLimit='true' @updateRateTop="updateRateTop" @updateRateDefault="updateRateDefault"
            @updateSingleNum="updateSingleNum"
            @updateMinBet="updateMinBet"
            @updateMaxBet="updateMaxBet"
            @updateChangeStart="updateChangeStart"
            @updateBetForChange="updateBetForChange"
            @updateBetSteps="updateBetSteps"
        ></RCO>
        </div>
        <div class="q-pa-md" v-if="showDataTable">
            <table>
              <tr class="testheader">
                <td class="test ext">{{$t('Table.ItemName')}}</td>
                <td class="test">{{$t('Table.SubName')}}</td>
                <td class="test">{{$t('Table.Profit')}}(%)</td>
                <td class="test">{{$t('Table.RateDefault')}}</td>
                <td class="test">{{$t('Table.RateTop')}}</td>
                <td class="test">{{$t('Table.Probability')}}</td>
                <td class="test">{{$t('Table.TotalNums')}}</td>
                <td class="test">{{$t('Table.SingleNum')}}</td>
                <td class="test">{{$t('Table.UnionNum')}}</td>
                <td class="test">{{$t('Table.MinHand')}}</td>
                <td class="test">{{$t('Table.MaxHand')}}</td>
                <td class="test">{{$t('Table.PerStep')}}</td>
                <td class="test">{{$t('Table.ChangeStart')}}</td>
                <td class="test">{{$t('Table.BetForChange')}}</td>                
                <td class="test">{{$t('Table.Steps')}}</td>
                <td class="test">{{$t('Table.NoAdjust')}}</td>
                <td class="test">{{$t('Table.UseAvg')}}</td>
                <td class="test">{{$t('Table.ChaseNum')}}</td>
              </tr>
              <tr class="datas"
                v-for="(itm,idx) in BasePayR"
                :key="idx"
              >
                <td :class="{test:true,bgc:itm.Selected}" @click="itm.Selected=!itm.Selected">{{ itm.Title }}</td>
                <td :class="{test:true,bgc:itm.Selected}" @click="itm.Selected=!itm.Selected">{{ itm.SubTitle }}</td>
                <td :class="{'test':true,redColor:itm.Profit<0}">{{ itm.Profit }}</td>
                <td class="test"><input type="text" size='4' v-model="itm.Rate" @change="chkItem(itm)" /></td>
                <td class="test"><input type="text" size='4' v-model="itm.TopRate"  /></td>
                <td class="test">{{itm.ProbabilityS}}</td>
                <td class="test"><input type="text" size='4' v-model="itm.TotalNums" /></td>
                <td class="test"><input type="text" size='4' v-model="itm.SingleNum" /></td>
                <td class="test"><input type="text" size='4' v-model="itm.UnionNum" /></td>
                <td class="test"><input type="text" size='4' v-model="itm.MinHand" /></td>
                <td class="test"><input type="text" size='4' v-model="itm.MaxHand" /></td>
                <td class="test"><input type="text" size='4' v-model="itm.PerStep" /></td>
                <td class="test"><input type="text" size='4' v-model="itm.ChangeStart" /></td>
                <td class="test"><input type="text" size='4' v-model="itm.BetForChange" /></td>
                <td class="test1">
                    <input type="text" size='4' v-model="itm.Steps"  />
                    <q-btn round dense size='sm' color="primary" icon="trending_up" @click="showStepGroup(itm)" />
                </td>
                <td class="test1"><input type="checkbox" v-model="itm.NoAdjust" /></td>
                <td class="test1"><input type="checkbox" v-model="itm.UseAvg" /></td>
                <td class="test1"><input type="checkbox" v-model="itm.ChaseNum" /></td>
              </tr>
            </table>
        </div>
    <q-dialog v-model="showBFCG" persistent>
      <q-card style="width: 300px">
        <q-card-section>
            <div class="text-h6">{{ BFCTitle }}</div>
        </q-card-section>

        <q-card-section>
            <table>
                <tr class="testheader">
                    <td class="test">{{$t('Table.StepsGroup')}}</td>
                    <td class="test">{{$t('Table.Steps')}}</td>
                </tr>
                <tr class="datas"
                v-for="(itm,idx) in BFCS"
                :key="'BFCS'+idx">
                    <td class="test"><input type="text" size='4' v-model="itm.Start" /></td>
                    <td class="test"><input type="text" size='4' v-model="itm.Step" /></td>
                </tr>
            </table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="OK" color="primary" @click="SaveStepG()" />
        </q-card-actions>        
      </q-card>
    </q-dialog>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Watch} from 'vue-property-decorator';
//import axios, { AxiosResponse } from 'axios';
import LayoutStoreModule from './data/LayoutStoreModule';
import {getModule} from 'vuex-module-decorators';
//import {IGames} from './data/schema';
import {SelectOptions,BasePayRateItm,IbtCls,CommonParams,IMsg,StepG, ILoginInfo} from './data/if';
import PayRateData from './data/PayRateList';
import {BasePayRate,ExtPR} from './class/BasePayRate';
import { cloneDeep } from 'lodash';
import GameSelector from './components/GameSelector.vue';
import BetTypeClass from './components/BetTypeClass.vue';
import RateChangeOption from './components/RateChangeOption.vue';
/*
Vue.component('GS',GameSelector);
Vue.component('BTC',BetTypeClass);
Vue.component('RCO',RateChangeOption);
*/

interface PayClass {
    id:number;
    PayClassName:string;
}
interface PostData {
    GameID:number;
    PayClassName:string;
    ModifyID:string;
    id?:number;
}
interface BItem {
    Title:string;
    SubTitle?:string;
    Filter?:string;
}

@Component({
    components: {
        GS:GameSelector,
        BTC:BetTypeClass,
        RCO:RateChangeOption
    }
})
export default class BetClass extends Vue{
	store = getModule(LayoutStoreModule);
    models:SelectOptions | null = null;
    BasePayR:BasePayRate<BasePayRateItm>[]=[];
    curGameID:number|null=null;
    curItem:BasePayRate<BasePayRateItm>|undefined;
    BtClass:IbtCls[] = [];
    BFCS:StepG[]=[];
    spArr:number[] | undefined;
    @Watch('BFCS',{immediate:true,deep:true})
    onBFCSChange(){
        let needAddLine=true;
        this.BFCS.map(itm=>{
            if(itm.Step===0) needAddLine=false;
        })
        if(needAddLine){
            this.BFCS.push({Start:0,Step:0})
        }
    }
    BFCTitle:string='';
	options:SelectOptions[] = [
		{value: 0,label:'default'}
    ]
    showBFCG:boolean=false;
    //showProgress:boolean=false;
    showDataTable:boolean=false;
    get showProgress(){
        return this.store.showProgress;
    }
    set showProgress(v:boolean){
        this.store.setShowProgress(v);
    }
	get UserID():string{
		if(this.store.personal.id) {
			return this.store.personal.id + '';
		} 
        return '';
    }
    get PInfo():ILoginInfo{
        return this.store.personal;
    }
    async setCurGames(v:SelectOptions){
        this.models = v;
        let GType:string = this.models.GType ? this.models.GType : '';
        if(GType==='MarkSix'){
            // 8,72 三中二
            // 10,73 二中特
            this.spArr=[8,72,10,73];
        } else if(GType==='HashSix') {
            this.spArr=[8,79,80,81];
        } else {
            this.spArr = undefined;
        }
        this.showProgress=true;
        this.showDataTable=false;
        await this.chkdata(v,GType);
    }
    async chkdata(v:SelectOptions,GType:string){
        // console.log('chkdata:', v);
        //const gid:string = v.value as string;
        this.curGameID = v.value as number;
        //const btg=BTG[this.curGameID];
        if(!PayRateData[GType]){
            this.showProgress=false;
            return;
        } else {
            console.log('chkdata no do!!');
        }
        const tmp:object=PayRateData[GType].data;
        const order:string[]=PayRateData[GType].order;
        let itms:BasePayRateItm[];
        this.BasePayR=[];
        //console.log('BasePayClass tmp',btg,tmp);
        order.map(key=>{
            let itm:BItem[] = tmp[key];
            //if(key=='1') console.log('itm',itm);
            itm.map((p:BItem,i:number)=>{
                const BetType:number=parseInt(key,10);
                const SubType:number=i;
                const bpr:BasePayRateItm=this.createBPRItem(p,BetType,SubType);
                //if(p.BetType=='1') console.log('bb:',p);
                this.BasePayR.push(new BasePayRate<BasePayRateItm>(bpr));
            })
        });
        itms=await this.getBasePayRate(this.curGameID);
        //console.log('getBasePayRate itms:',itms);
        if(itms.length>0){
            itms.map(itm=>{
                const e = this.BasePayR.find(elm => elm.BetType == itm.BetType && elm.SubType == itm.SubType)
                if(e){
                    e.Datas= itm
                }
            })
            if(this.spArr){
                this.spArr.map(bt=>{
                    this.BasePayR.map(itm=>{
                        if(itm.BetType === bt){
                            this.chainEdit(itm);
                        }
                    });
                });
            } 
            //this.BasePayR=cloneDeep(this.BasePayR);
        }
        //console.log('BasePayR:',this.BasePayR)
        //console.log('PayRateData',tmp);
        // console.log('BasePayR before if:', this.BasePayR, this.BasePayR.length);
        //if(this.BasePayR.length==0) return;
        this.showDataTable=true;
        this.showProgress=false;
    }
    chainEdit(b:BasePayRate<BasePayRateItm>){
        let itm = this.BasePayR.find(elm => elm.BetType === b.BetType && elm.SubType ===b.SubType);
        if(itm){
            if(itm.isParlay){
                //itm.resetExtPR();
                itm=this.setExtPR(itm)
            }
        } else {
            console.log( b, ' not procss!!!');
        }
        /*
        const e0 = this.BasePayR.find(elm => elm.BetType == bt && elm.SubType == 0);
        const e1 = this.BasePayR.find(elm => elm.BetType == bt && elm.SubType == 1);
        if( e0 &&  e1){
            e0.ExtProb = e1.Probability ? e1.Probability : 0;
            e0.ExtRate = e1.Rate ? e1.Rate : 0;
            e1.ExtProb = e0.Probability ? e0.Probability : 0;
            e1.ExtRate = e0.Rate ? e0.Rate : 0;
        }
        */
    }
    setExtPR(itm:BasePayRate<BasePayRateItm>){
        //console.log('setExtPR',itm.BetType ,itm.SubType);
        this.BasePayR.map(elm=>{
            if(elm.isParlay && elm.BetType === itm.BetType && elm.SubType !== itm.SubType){
                let tmp:ExtPR={
                    SubType: itm.SubType ? itm.SubType : 0,
                    Rate: itm.Rate ? itm.Rate : 0,
                    Probability: itm.Probability ? itm.Probability : 0
                }
                elm.addExtPRS(tmp);
            }
        })
        //console.log('setExtPR',itm);
        return itm;
    }
    createBPRItem(p:BItem,BetType:number,SubType:number):BasePayRateItm{
        let bpr:BasePayRateItm = Object.assign({},{
            Title:p.Title,
            SubTitle: p.SubTitle ? p.SubTitle : '',
            BetType: BetType,
            SubType: SubType,
            NoAdjust:0,
            Profit:0,
            DfRate:0,
            TopRate:0,
            Probability:0,
            Steps:0,
            //TopPay:0,
            //OneHand:0
            isParlay:0,
            TotalNums:0,
            UseAvg:0,
            SingleNum:0,
            UnionNum:0,
            MinHand:0,
            MaxHand:0,
            BetForChange:0,
            StepsGroup:''
        });
        return bpr;
    }  
    async getBasePayRate(gid:number):Promise<BasePayRateItm[]>{
        let dta:BasePayRateItm[]=[];
        const param:CommonParams = {
            GameID: gid,
            UserID: this.store.personal.id,
            sid: this.store.personal.sid
        }
        let msg:IMsg = await this.store.ax.getApi('getBasePayRate',param);
        if(msg.ErrNo==0){
            dta=msg.data as BasePayRateItm[]; 
        }
        return dta;
    }
    updateRateTop(v:number){
        if(v>0){
            this.BasePayR.map(itm=>{
                if(itm.Selected){
                    itm.updateRateTopByProfit(v);
                }
            })
        }
    }
    updateRateDefault(v:number){
        if(v>0){
            this.BasePayR.map(itm=>{
                if(itm.Selected){
                    itm.updateDefaultRateByProfit(v);
                }
            })
        }
    }
    updateSingleNum(risk:number){
        if(risk>0){
            this.BasePayR.map(itm=>{
                if(itm.Selected){
                    itm.updateSingleNumFull(risk);
                }
            })
        }        
    }
    updateMinBet(v:number){
        if(v>0){
            this.BasePayR.map(itm=>{
                if(itm.Selected){
                    itm.MinHand=v;
                }
            })
        }
    }
    updateMaxBet(v:number){
        if(v>0){
            this.BasePayR.map(itm=>{
                if(itm.Selected){
                    itm.MaxHand=v;
                }
            })
        }
    }
    updateChangeStart(v:number){
        if(v){
            this.BasePayR.map(itm=>{
                if(itm.Selected){
                    itm.updateChangeStart(v);
                }
            })
            this.BasePayR=cloneDeep(this.BasePayR);
        }
    }
    updateBetForChange(v:number){
        if(v){
            this.BasePayR.map(itm=>{
                if(itm.Selected){
                    itm.updateBetForChange(v);
                }
            })
        }
    }
    updateBetSteps(v:number){
        if(v){
            this.BasePayR.map(itm=>{
                if(itm.Selected){
                    itm.updateSteps(v);
                }
            })
        }
    }
    SltBetTypes(slt:string){
        const bts:string[] = slt.split(':');
        this.BasePayR.map(itm=>{
            itm.Selected = false;
        })
        this.BasePayR.map(itm=>{
            const f = bts.find(bt=>parseInt(bt,10)===itm.BetType);
            if(f){
                itm.Selected = true;
            }
        })
        /*
        bts.map(bt=>{
            const  f=this.BasePayR.find(bpr=>bpr.BetType===parseInt(bt,10));
            if(f){
                f.Selected = true;
            }
        })
        */
        //console.log('SltBetTypes',bts);
    }
    SaveData(){
        const dtas:BasePayRateItm[] = [];
        this.BasePayR.map(itm=>{
            if(itm.DataChanged) {
                if(itm.Datas.StepsGroup){
                    itm.Datas.StepsGroup = JSON.parse(itm.Datas.StepsGroup as string);
                }
                dtas.push(itm.Datas);
            }
        })
        if(dtas.length>0){
            this.sendData(dtas);
        }
    }
    async sendData(dtas:BasePayRateItm[]){
        if(!this.models) return;
        const param:CommonParams={
            UserID:this.PInfo.id,
            sid:this.PInfo.sid,
            GameID: this.models.value,
            GType: this.models.GType,
            ModifyID: this.PInfo.id,
            data: JSON.stringify(dtas)            
        }
        /*
 		const data = {
			GameID: this.models.value,
            ModifyID: this.UserID,
            data: JSON.stringify(dtas)
        }
        */
        const msg:IMsg=await this.store.ax.getApi('batch/saveBasePayRate',param,'post');
        if(msg.ErrNo===0){
            this.$q.dialog({
                title: this.$t('Label.Save') as string,
                message: 'OK!!'
            });
            dtas.map(itm=>{
                const tmp = this.BasePayR.find(elm => elm.BetType == itm.BetType && elm.SubType == itm.SubType)
                if(tmp){
                    tmp.DataChanged = false;
                }
            })            
        } else {
            this.$q.dialog({
                title: this.$t('Label.Save') as string,
                message: msg.ErrCon
            });            
        }
        /*
        const url:string=this.store.ax.Host+'/api/batch/saveBasePayRate';
		axios.post(url,data).then((res:AxiosResponse)=>{
            //console.log(res);
            if(res.data.ErrNo===0){
                this.$q.dialog({
                    title: this.$t('Label.Save') as string,
                    message: 'OK!!'
                });
            }            
            dtas.map(itm=>{
                const tmp = this.BasePayR.find(elm => elm.BetType == itm.BetType && elm.SubType == itm.SubType)
                if(tmp){
                    tmp.DataChanged = false;
                }
            })
		}).catch(err=>{
			console.log(err);
        })
        */       
    }
    showStepGroup(itm:BasePayRate<BasePayRateItm>){
        this.BFCTitle=itm.Title + (itm.SubTitle ? ' / ' + itm.SubTitle : '');
        this.curItem=itm;
        const EmptyItm:StepG={
            Start:0,
            Step:0
        }
        this.BFCS=itm.StepsGroup;
        this.BFCS.push(EmptyItm)
        this.showBFCG=true;
    }
    SaveStepG(){
        if(this.curItem){
            this.curItem.StepsGroup=this.BFCS;
        }
        this.showBFCG=false;
    }
    /*
    updateBPR(){
        this.BasePayR=cloneDeep(this.BasePayR);
    }
    */
    chkItem(itm){
        console.log('chkItem',itm.BetType,this.spArr);
        if(this.spArr){
            const f = this.spArr.find(bt=>bt===itm.BetType)
            if(f){
                this.chainEdit(itm);
            }
        }
    }
  mounted(){
        if(!this.store.isLogin){
        this.$router.push({path:'/login'});
        }      
        this.BasePayR=[];
  }
}
</script>
<style scoped>
table {
    border: 0;
    border-spacing: 0;
    border-collapse: collapse;
}
.pbtn {
    padding: 6px 4px;
}
.testheader td {
    background-color: cadetblue;
    color:white;
    width: 90px;
}
.testheader .ext {
    width: 120px;
}
.test {
    border: 1px gray solid;
    text-align: center;
    vertical-align: middle;
}
.bgc {
    background-color:lightseagreen;
    color:white;
}
.test input {
    width: 100%;
}
.test1 {
    border: 1px gray solid;
    text-align: center;
    vertical-align: middle;    
}

</style>