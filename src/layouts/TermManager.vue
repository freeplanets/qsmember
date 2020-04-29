<template>
	<div class="TermManager">
		<div class="row q-pa-sm">
			<div><GS :store='store' @setGames="setCurGames"></GS></div>
            <div class="pd"><q-btn color="blue" icon-right="note_add" :label="$t('Label.AddTerm')" @click="ShowAdd()" /></div>
		</div>
        <div v-if="data.length>0" class='mytable'>
            <div class="row">
                <div class='col-1 mytable-head mytable-field'>{{$t('Label.TermID')}}</div>
                <div class='col-2 mytable-head mytable-field'>{{$t('Label.OpenDate')+$t('Label.Time')}}</div>
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
                <div class='col-1 mytable-field'>{{itm.TermID}}</div>
                <div class='col-2 mytable-field'>{{itm.PDate + ' ' + itm.PTime}}</div>
                <div class='col-1 mytable-field'>{{itm.StopTime}}</div>
                <div class='col-1 mytable-field'>{{itm.StopTimeS}}</div>
                <div class='col-2 mytable-field'>{{itm.Result}}{{ itm.SpNo ? `+${itm.SpNo}`:'' }}</div>
                <div class='col-1 mytable-field'>{{$t(`Label.Settled.${itm.isSettled}`)}}</div>
                <div class='col mytable-field'>
                    <div class="row">
                        <div class='col'><q-btn color="blue" icon-right="edit" label="Edit" @click="Edit(itm)" /></div>
                        <div class='col'><q-btn color="green" icon-right="edit" :label="$t('Label.InputNums')" @click="InputNum(itm)" /></div>
                    </div>
                </div>             
            </div>
        </div>
        <q-dialog v-model="isInputNum" persistent>
        <q-card style="min-width: 350px">
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
                    <div><q-chip square>{{ $t('Label.SpNo')}}</q-chip></div>
                    <div><q-input outlined dense v-model="term.StopTimeS" mask="fulltime" /></div>
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
    </div>    
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import LayoutStoreModule from './data/LayoutStoreModule';
import {getModule} from 'vuex-module-decorators';
import {SelectOptions} from './data/if';
import {ITerms} from './data/schema';
import GameSelector from './components/GameSelector.vue';
Vue.component('GS',GameSelector);

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
    nums:string[]=[];
    data:ITerms[]=[];
    isAddTerm:boolean=false;
    isInputNum:boolean=false;
    curTid:number=0;
    get ax(){
        return this.store.ax;
    }
    get User(){
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
        this.getTerms(this.term.GameID);
    }      
    ShowAdd(){
        if(this.models){
            this.isAddTerm = !this.isAddTerm
        }
    }
    showDatePicker(){
        this.datePickerShow=!this.datePickerShow;
    }
    async SaveTerm(){
        /*
        const param:CBetItems={
            GameID: this.model.value as number,
            ModifyID: this.User.id as number,
            data: JSON.stringify(BetItems)
       
        */
        //const ans = await this.ax.createBetItems(param);
        const ans = await this.ax.saveTerms(this.term);
        //console.log('SaveTerm',this.term,ans);
        if(ans.ErrNo === 0) {
            this.isAddTerm = false;    
            this.getTerms(this.term.GameID)
        }
    }
    get dateString(){
        const d:Date=new Date();
        const reg1 = /(\d+)-(\d+)-(\d+).*/;
        return d.toJSON().replace(reg1, '$1-$2-$3');
    }
    async getTerms(GameID:number){
        this.data=[];
        const ans=await this.ax.getTerms(GameID)
        if(ans.ErrNo===0){
            this.data=ans.data;
            this.data.map(itm=>{
                if(itm.ResultFmt){
                    console.log('getTerms',JSON.parse(itm.ResultFmt));
                }
            })
        }
    }
    Edit(v:ITerms){
        Object.keys(v).map(key=>{
            this.term[key]=v[key];
        })
        //v.ModifyID = this.User.id as number;
        this.term.ModifyID = this.User.id as number;
        this.isAddTerm = true;
    }
    InputNum(v:ITerms){
        this.nums=['','','','','','',''];
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
    async SendNums(){
        const ax=this.store.ax;
        const ans=await ax.saveNums(this.curTid,this.term.GameID,this.nums.join(','));
        //console.log('SendNums',ans);
        if(ans.data.ErrNo===0){
            this.$q.dialog({
                title: this.$t('Label.Save') as string,
                message: 'OK!!'
            });
            this.isInputNum=false;
            this.getTerms(this.term.GameID);
        }
    }
    mounted(){
        if(!this.store.isLogin){
            this.$router.push({path:'/login'});
        }     
        this.term.PDate=this.dateString;
        //console.log(this.$t(`Label.Settled`),this.$t(`Label.Settled.${1}`));
    }
}
</script>
<style scoped>
.mytable {
    max-width: 900px; 
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