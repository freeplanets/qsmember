<template>
	<div class="TermManager">
		<div class="row q-pa-sm">
			<div><GS :store='store' @setGames="setCurGames"></GS></div>
            <div class="pd"><q-btn color="blue" icon-right="note_add" :label="$t('Label.AddTerm')" @click="ShowAdd()" /></div>
            <div class="pd"><q-btn color="secondary" :label="$t('Report.Today')" @click="getToday()" /></div>
            <div class="pd"><q-btn color="secondary" :label="$t('Report.Yesterday')" @click="getYesterday()" /></div>
            <div class="pd"><q-btn color="secondary" :label="$t('Report.Beforeday')" @click="getBeforeday()" /></div>
            <div class="miniBtn-pd"><q-btn color="secondary" dense icon="date_range" @click="DateSlt=true"/></div>    
            <div class="tbox-pd"><q-input class="tbox-w" outlined dense v-model="sdate" /></div>
            <div class="pd"><q-btn color="secondary" :label="$t('Button.Search')" @click="getTerms()" /></div>
		</div>
        <div v-if="data.length>0" class='mytable'>
            <div class="row">
                <div class='col-2 mytable-head mytable-field'>{{$t('Label.TermID')}}</div>
                <div class='col-2 mytable-head mytable-field'>{{`${$t('Label.OpenDate')} ${$t('Label.Time')}`}}</div>
                <div class='col-1 mytable-head mytable-field'>{{$t('Label.BetEndTime')}}</div>
                <div class='col-1 mytable-head mytable-field'>{{$t('Label.SPEndTime')}}</div>
                <div class='col-2 mytable-head mytable-field'>{{$t('Dialog.OpenResult')}}</div>
                <div class='col-1 mytable-head mytable-field'>{{$t('Label.Status')}}</div>
                <div class='col mytable-head mytable-field'></div>
            </div>
            <div class="row"
                v-for="(itm,idx) in data"
                :key="idx"
            >
                <div class='col-2 mytable-field'>{{itm.TermID}}</div>
                <div class='col-2 mytable-field'>{{itm.PDate + ' ' + itm.PTime}}</div>
                <div class='col-1 mytable-field'>{{itm.StopTime}}</div>
                <div class='col-1 mytable-field'>{{itm.StopTimeS}}</div>
                <div class='col-2 mytable-field'><div style='word-break: normal;'>{{itm.Result ? itm.Result.replace(/\,/g,', ') : ''}} {{ itm.SpNo ? `+${itm.SpNo}`:'' }}</div></div>
                <div class='col-1 mytable-field'>{{$t(`Label.Settled.${itm.isSettled}`)}}</div>
                <div class='col mytable-field'>
                    <div class="row">
                        <div class='col' v-if="itm.isSettled===0 && itm.isCanceled===0"><q-btn color="blue" dense :label="$t('Button.Edit')" @click="Edit(itm)" /></div>
                        <div class='col' v-if="itm.isCanceled===0"><q-btn color="green" dense :label="$t('Label.InputNums')" @click="InputNum(itm,itm.Result,itm.SpNo)" /></div>
                        <div class='col'><q-btn color="blue" dense :label="$t('Button.EditRecord')" @click="getEditRecord(itm.id);" /></div>
                        <div class='col' v-if="itm.isSettled===0 && itm.isCanceled===0"><q-btn color="red" dense :label="$t('Label.Delete')" @click="DelTerm(itm.id);" /></div>
                        <div class='col' v-if="itm.isSettled===0 && itm.isCanceled===0"><q-btn color="red" dense :label="$t('Label.Cancel')" @click="CancelTerm(itm.id,itm.TermID);" /></div>
                    </div>
                </div>             
            </div>
        </div>
        <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="DateSlt">
        <q-card>
            <q-card-section class="row items-center q-pb-none">
            <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
                <q-date
                    v-model="sdate"
                    minimal
                />
            </q-card-section>
        </q-card>
        </q-dialog>
        </div>
        <q-dialog v-model="isInputNum" persistent>
        <q-card style="min-width: 350px; max-width: 500px;">
            <q-card-section>
            <div class="text-h6">{{$t('Label.InputNums')}}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <div class="row">
                <q-input class="numbox"
                    v-for="(num,idx) in nums"
                    :key="idx"
                    outlined dense v-model="nums[idx]" />
                </div>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Send" @click="SendNums()" />
            <q-btn flat label="Cancel" v-close-popup />
            </q-card-actions>
        </q-card>
        </q-dialog>
        <q-dialog v-model="isAddTerm">
            <q-card class="my-card">
            <q-card-section class="bg-primary text-white">
                <div class="text-h7">{{ term.id ? $t('Label.EditTerm') : $t('Label.AddTerm')}}</div>
            </q-card-section>

            <q-card-section>
                <div class="row q-pa-sm">
                    <div><q-chip square>{{ $t('Label.OpenDate')}}</q-chip></div>
                    <div>
                        <q-input outlined dense v-model="TDate" mask="####-##-##"/>
                    </div>
                    <div><q-btn color="primary" icon-right="date_range" :label="$t('Label.Date')"  @click="datePickerShow=true"/></div>                    
                    <div><q-chip square>{{$t('Label.Time')}}</q-chip></div>
                    <div><q-input outlined dense v-model="term.PTime" mask="fulltime" /></div>
                </div>
                <div class="row q-pa-sm">
                    <div class="col-3"><q-chip square>{{ $t('Label.BetEndTime')}}</q-chip></div>
                    <div><q-input outlined dense v-model="term.StopTime" mask="fulltime" /></div>
                    <div v-if="hasSPNO"><q-chip square>{{ $t('Label.SpNo')}}</q-chip></div>
                    <div v-if="hasSPNO"><q-input outlined dense v-model="term.StopTimeS" mask="fulltime" /></div>
                </div>
                <div class="row q-pa-sm">
                    <div class="col-3"><q-chip square>{{ $t('Label.TermID')}}</q-chip></div>
                    <div><q-input outlined dense v-model="term.TermID" /></div>
                </div>
                <div class="row q-pa-sm">
                    <q-btn color="blue" icon-right="save" :label="$t('Label.Save')" @click="SaveTerm();" />
                    <q-btn color="red" icon-right="cancel" :label="$t('Label.Cancel')" @click="isAddTerm=false" />
                </div>
            </q-card-section>
            </q-card>
        </q-dialog>
        <q-dialog v-model="datePickerShow">
            <q-card>            
                <q-card-section>
                <q-date v-model="TDate" mask="YYYY-MM-DD" />
                </q-card-section>                
            </q-card>
        </q-dialog>
        <q-dialog v-model="showEditRecord">
      <q-card class="bg-teal text-white" >
        <q-bar>
          <div>{{$t('Button.EditRecord')}}</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>          
        <q-card-section class="bg-white text-black">
          <table>
            <tr>
                <th>{{$t('Title.Item')}}</th>
                <th>{{$t('Title.OValue')}}</th>
                <th>{{$t('Title.NValue')}}</th>
                <th>{{$t('Title.EditMan')}}</th>
            </tr>
            <tr 
                v-for="(itm,key) in EditRecord"
                :key="'term'+key"
            >
                <td>{{$t(`Table.${itm.mykey}`)}}</td>
                <td>{{itm.ovalue}}</td>
                <td>{{itm.nvalue}}</td>
                <td>{{itm.adminid}}</td>
            </tr>
          </table>
        </q-card-section>
      </q-card>
        </q-dialog>
    </div>    
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import LayoutStoreModule from './data/LayoutStoreModule';
import {getModule} from 'vuex-module-decorators';
import {SelectOptions,CommonParams,IMsg,ParamLog,ILoginInfo} from './data/if';
import {Game} from './data/schema';
import {ITerms} from './data/schema';
import JDate from './components/Date/JDate'
import {dateAddZero} from './components/func';
import GameSelector from './components/GameSelector.vue';
Vue.component('GS',GameSelector);

interface GameType {
    GType:string;
    OpenNums:number;
    OpenSP:number;
    StartNum:number;
    EndNum:number;
    SameNum:number;
}

@Component
export default class TermManager extends Vue {
    private store = getModule(LayoutStoreModule);
    private models:SelectOptions | null = null;
    datePickerShow=false;
    options:SelectOptions[] = [
		{value: 0,label:'default'}
    ]
    term:ITerms={
        id:0,
        GameID:0,
        TermID:'',
        PDate:'',
        PTime:'',
        StopTime:'',
        StopTimeS:'',
        ModifyID: this.User.id as number,
    }
    oldTerm:ITerms|undefined;
    nums:string[]=[];
    data:ITerms[]=[];
    isAddTerm:boolean=false;
    isInputNum:boolean=false;
    curTermSettleStatus:number=0;
    curTid:number=0;
    sdate:string='';
    DateSlt:boolean=false;
    PLog:ParamLog[]|undefined;
    showEditRecord:boolean=false;
    EditRecord:ParamLog[]=[];
    curResult:string|undefined;
    InProcess:boolean=false;
    curGame:Game|undefined;
    hasSPNO:boolean=false;
    NoSettleDate:string='';
    GTypes:GameType[]=[];
    curGType:GameType|undefined;
    get showProgress(){
        return this.store.showProgress;
    }
    set showProgress(v:boolean){
        this.store.setShowProgress(v);
    }    
    get ax(){
        return this.store.ax;
    }
    get User():ILoginInfo{
        return this.store.personal;
    }
    get TDate() {
        return this.term.PDate;
    }
    set TDate(v:string) {
        this.term.PDate = v;
        if(this.datePickerShow){
            this.datePickerShow=false;
        }
        //console.log('TDate:',this.TDate)
    }
    setCurGames(v:SelectOptions){
        this.models = v;
        this.term.GameID = v.value as number;
        if(v.GType){
            this.setCurGType(v.GType);
        }
        //this.nums=new Array(v.OpenNums);
        this.getTerms();
    }
    setCurGType(GType:string){
        this.curGType = this.GTypes.find(itm=>itm.GType===GType);
        if(this.curGType){
            this.nums=new Array(this.curGType.OpenNums);
        }        
    }
    ShowAdd(){
        if(this.NoSettleDate){
            this.$q.dialog({
                title: this.$t('Dialog.NoSettle') as string,
                message: this.NoSettleDate
            })            
            return;
        }
        if(this.models){
            this.isAddTerm = !this.isAddTerm
            this.getLastTerm();
        }
    }
    async getEditRecord(id:number) {
        const param:CommonParams={
            UserID:this.User.id,
            sid:this.User.sid,
            id,
            tb:'Terms'
        }
        const msg:IMsg=await this.ax.getApi('getEditRecord',param);
        if(msg.ErrNo===0){
            this.EditRecord = msg.data as ParamLog[];
        }
        this.showEditRecord=true;
    }
    async getLastTerm(){
        const param:CommonParams={
            GameID: this.term.GameID,
            UserID: this.store.personal.id,
            sid: this.store.personal.sid
        }
        const msg:IMsg=await this.store.ax.getApi('getLastTerm',param);
        if(msg.ErrNo===0){
            //console.log(msg.data);
            if(msg.data){
                const lsTerm:ITerms=msg.data[0] as ITerms;
                this.term.PDate = this.dateString;
                if(lsTerm && lsTerm.PTime){
                    this.term.PTime = lsTerm.PTime;
                    this.term.StopTime = lsTerm.StopTime;
                    this.term.StopTimeS = lsTerm.StopTimeS;
                    this.term.TermID = this.TermIDAdd(lsTerm.TermID)
                }
            }

        }
    }
    TermIDAdd(TermID:string):string{
        const len:number=TermID.length;
        let rs:string=(parseInt(TermID,10)+1).toString();
        while(rs.length<len){
            rs='0'+rs;
        }
        return rs;
    }
    showDatePicker(){
        this.datePickerShow=!this.datePickerShow;
    }
    async SaveTerm(){
        if(this.oldTerm){
            const OLD=this.oldTerm;
            const adminid = this.User.id;
            Object.keys(OLD).map(key=>{
                if(OLD[key]!==this.term[key]){
                    const pl:ParamLog={
                        id:0,
                        tb:'Terms',
                        uid:OLD.id ? OLD.id : 0,
                        mykey:key,
                        ovalue:OLD[key],
                        nvalue:this.term[key],
                        adminid
                    }
                    if(!this.PLog) this.PLog=[];
                    this.PLog.push(pl);
                }
            })
        }
        const ans = await this.ax.saveTerms(this.User.id,this.User.sid,this.term,this.PLog);
        //console.log('SaveTerm',this.term,ans);
        if(ans.ErrNo === 0) {
            this.PLog=undefined;
            this.isAddTerm = false;    
            await this.getTerms()
        }
    }
    get dateString(){
        const d:Date=new Date();
        const reg1 = /(\d+)-(\d+)-(\d+).*/;
        return d.toJSON().replace(reg1, '$1-$2-$3');
    }
    async getTerms(){
        if(this.InProcess) return;
        if(!this.term.GameID) return;
        this.InProcess=true;
        this.showProgress=true;
        const GameID:number=this.term.GameID;
        this.data=[];
        const ans=await this.ax.getTerms(this.store.personal.id,this.store.personal.sid,GameID,this.sdate.split('/').join('-'))
        if(ans.ErrNo===0){
            this.data=ans.data as ITerms[];
            if(ans.Game) {
                this.curGame=ans.Game as Game;
                this.hasSPNO = !!this.curGame.hasSPNO;
            }
            if(ans.PDate){
                this.NoSettleDate=ans.PDate;
            } else {
                this.NoSettleDate = '';
            }
            this.PLog=undefined;
            /*
            this.data.map(itm=>{
                if(itm.ResultFmt){
                    console.log('getTerms',JSON.parse(itm.ResultFmt));
                }
            })
            */
        }
        this.InProcess=false;
        this.showProgress=false;
    }
    Edit(v:ITerms){
        this.oldTerm=Object.assign({},v);
        this.term=Object.assign(this.term,v);
        console.log('Edit',this.oldTerm);
        /*
        Object.keys(v).map(key=>{
            this.term[key]=v[key];
        })
        */
        //v.ModifyID = this.User.id as number;
        this.term.ModifyID = this.User.id as number;
        this.isAddTerm = true;
    }
    InputNum(v:ITerms,rlt?:string,spno?:string){
        if(rlt){
            this.nums=rlt.split(',');
            if(spno){
                this.nums.push(spno);
            }
            this.curResult=this.nums.join(',');
        } 
        if(v.isSettled){
            this.curTermSettleStatus = v.isSettled;
        }
        if(v.Result){
            this.nums=v.Result.split(',');
            if(v.SpNo) this.nums.push(v.SpNo);
        }
        this.isInputNum=true;
        //console.log('InputNum',v);
        if(v.id){
            this.curTid = v.id;
        }
        //const nums:string[]=v.split(',');
    }
    chkNums(nums:string[]):boolean{
        if(this.curGType){
            if(nums.length != this.curGType.OpenNums)  return false;
            const GT=this.curGType;
            const tmpA:number[]=[];
            let hasSpace = false
            nums.map(num=>{
                if(hasSpace) return;
                if(num==='') {
                    hasSpace = true;
                    return;
                }
                const iNum:number = parseInt(num,10);
                if(iNum < GT.StartNum) return false;
                if(iNum > GT.EndNum) return false;
                if(tmpA.indexOf(iNum)===-1) tmpA.push(iNum);
            })
            if(hasSpace) return false;
            if(!GT.SameNum){
                if(nums.length !== tmpA.length) return false;
            }
        } else {
            return true;
        }
        return true;
    }
    async SendNums(){
        if(!this.chkNums(this.nums)) {
            this.$q.dialog({
                title: this.$t('Label.InputNums') as string,
                message: 'Error!!'
            }) 
            return ;
        }
        this.isInputNum=false;
        this.showProgress=true;
        if(this.curResult){
            const tmp:ParamLog = {
                id:0,
                tb:'Terms',
                uid: this.curTid,
                mykey:'Result',
                ovalue:this.curResult,
                nvalue:this.nums.join(','),
                adminid: this.User.id
            }
            if(!this.PLog) this.PLog=[];
            this.PLog.push(tmp);
        }
        const ax=this.store.ax;
        const ans=await ax.saveNums(this.store.personal.id,this.store.personal.sid,this.curTid,this.term.GameID,this.nums.join(','),this.curTermSettleStatus,this.PLog);
        //console.log('SendNums',ans);
        if(ans.ErrNo===0){
            this.showProgress=false;  
            this.$q.dialog({
                title: this.$t('Label.Save') as string,
                message: 'OK!!'
            }).onOk(async ()=>{
                await this.getTerms();
            });
            
        } 
    }
    async DelTerm(tid:number){
        const param:CommonParams={
            UserID:this.User.id,
            sid:this.User.sid,
            tid
        }
        const msg:IMsg=await this.ax.getApi('DelTerm',param);
        if(msg.ErrNo===0){
            this.$q.dialog({
                title: this.$t('Label.Delete') as string,
                message: 'OK!!'
            }).onOk(async ()=>{
                await this.getTerms();
            });            
        } else {
            this.$q.dialog({
                title: this.$t('Label.Delete') as string,
                message: this.$t(`Error.${msg.ErrNo}`) as string
            })            
        }
    }
    CancelTerm(tid:number,TermID:string){
        let GTitle =this.models ? this.models.label : '';
        this.$q.dialog({
            title: this.$t('Label.Cancel') as string,
            message: `${this.$t('Label.Cancel')} ${GTitle} ${this.$t('Label.TermID')} : ${TermID} ?`,
            ok: true,
            cancel: true
        }).onCancel( ()=>{
            console.log('cancel');
            return;
        }).onOk(async ()=>{
            await this.doCancelTerm(tid);
        });
        console.log('after cancel');
    }
    async doCancelTerm(tid:number){
        const param:CommonParams={
            UserID:this.User.id,
            sid:this.User.sid,
            tid
        }
        const msg:IMsg=await this.ax.getApi('CancelTerm',param);
        if(msg.ErrNo===0){
            this.$q.dialog({
                title: this.$t('Label.Cancel') as string,
                message: 'OK!!'
            }).onOk(async ()=>{
                await this.getTerms();
            });            
        } else {
            this.$q.dialog({
                title: this.$t('Label.Cancel') as string,
                message: this.$t(`Error.${msg.ErrNo}`) as string
            })            
        }
    }    
    async getGameType(){
        const param:CommonParams={
            UserID:this.User.id,
            sid:this.User.sid,
        }
        let ans:IMsg=await this.ax.getApi('getGameType',param);
        if(ans.ErrNo===0){
            this.GTypes = ans.data as GameType[];
            if(!this.curGType){
                if(this.models){
                    this.setCurGType(this.models.GType ? this.models.GType : '')
                }
            }
            //console.log('getGameType:',this.GTypes);
        }
    }
    getToday(){
        this.sdate = JDate.today.start;
        this.getTerms();
    }
    getYesterday(){
        this.sdate = JDate.yesterday.start;
        this.getTerms();
    }
    getBeforeday(){
        //console.log('getBeforeday',this.sdate);
        if(!this.sdate) return;
        const d=new Date(this.sdate);
        const ds=d.getTime()-86400000;
        const d1=new Date(ds);
        this.sdate=dateAddZero(d1.toLocaleDateString());
        this.getTerms();
        //console.log('getBeforeday',this.sdate,d1.toJSON(),d.toUTCString(),d.toLocaleDateString(),d.toISOString());
    }
    mounted(){
        if(!this.store.isLogin){
            this.$router.push({path:'/login'});
        }     
        this.term.PDate=this.dateString;
        this.getToday();
        this.getGameType();
        //console.log(this.$t(`Label.Settled`),this.$t(`Label.Settled.${1}`));
    }
}
</script>
<style scoped>
table {
    padding-top: 8px;
    border: 0;
    border-spacing: 0;
    border-collapse: collapse;
}
th {
    background-color: cadetblue;
    border: 1px gray solid;
    color:white;
    width: 100px;
}
td {
    border: 1px gray solid;
    text-align: center;
    vertical-align: middle;
}
.mytable {
    max-width: 1350px; 
    padding-left: 8px;
}
.mytable-head {
    background-color: cadetblue;
    color:white;
}
.mytable-field {
    border: 1px gray solid;
    text-align: center;
    vertical-align: middle;
}
.numbox {
    width: 40px !important;
    margin-right: 5px;
}
.pd {
	padding: 6px 0px 0 8px;
}
.my-pa-btn {
    padding: 0 0 0 8px;
}
.mytable-field div {
  text-align: center;  
}
.my-card {
    max-width: 800px;
}
</style>