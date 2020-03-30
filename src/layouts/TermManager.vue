<template>
	<div class="TermManager">
		<div class="row q-pa-sm">
			<div class="col-1 text-h6">{{ $t('Label.GameName')}}</div>
    		<q-select square filled v-model="model" :options="options" style="width:200px"/>
            <q-btn color="blue" icon-right="note_add" :label="$t('Label.AddTerm')" @click="ShowAdd()" />
		</div>
        <div v-if="data.length>0">
            <div class="row termhead">
                <div class="q-pa-md col-12 col-md-1">{{$t('Label.TermID')}}</div>
                <div class="q-pa-md col-12 col-md-2">{{$t('Label.OpenDate')+$t('Label.Time')}}</div>
                <div class="q-pa-md col-12 col-md-1">{{$t('Label.BetEndTime')}}</div>
                <div class="q-pa-md col-12 col-md-1">{{$t('Label.SPEndTime')}}</div>
                <div class="q-pa-md col-12 col-md-3">{{$t('Dialog.OpenResult')}}</div>
                <div class="q-pa-md col-12 col-md-1">{{$t('Label.Status')}}</div>
                <div class="q-pa-md col-12 col-md-1"></div>
            </div>
            <div class="row"
                v-for="(itm,idx) in data"
                :key="idx"
            >
                <div class="q-pa-md col-12 col-md-1">{{itm.TermID}}</div>
                <div class="q-pa-md col-12 col-md-2">{{itm.PDate + ' ' + itm.PTime}}</div>
                <div class="q-pa-md col-12 col-md-1">{{itm.StopTime}}</div>
                <div class="q-pa-md col-12 col-md-1">{{itm.StopTimeS}}</div>
                <div class="q-pa-md col-12 col-md-3">{{itm.Result}}{{ itm.SpNo ? `+${itm.SpNo}`:'' }}</div>
                <div class="q-pa-md col-12 col-md-1">{{$t(`Label.Settled.${itm.isSettled}`)}}</div>
                <div class="q-pa-md col-12 col-md-1">
                    <q-btn color="green" icon-right="edit" :label="$t('Label.InputNums')" @click="InputNum(itm)" />
                    <q-btn color="blue" icon-right="edit" label="Edit" @click="Edit(itm)" />
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
        <div 
            v-show="isAddTerm"
            class="q-pa-md row items-start q-gutter-md ">
            <q-card class="my-card">
            <q-card-section class="bg-primary text-white">
                <div class="text-h7">{{ term.id ? $t('Label.EditTerm') : $t('Label.AddTerm')}}</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="q-pa-md col-12 col-md-3">{{ $t('Label.OpenDate')}}</div>
                    <div class="q-pa-md"><q-btn color="primary" icon-right="date_range" :label="$t('Label.Date')"  @click="datePickerShow=true"/></div>
                    <div>
                        <q-input outlined dense v-model="TDate" mask="####-##-##"/>
                    </div>
                    <div class="q-pa-md">{{$t('Label.Time')}}</div>
                    <div><q-input outlined dense v-model="term.PTime" mask="time" /></div>
                </div>
                <div class="row">
                    <div class="q-pa-md col-12 col-md-3">{{ $t('Label.BetEndTime')}}</div>
                    <div><q-input outlined dense v-model="term.StopTime" mask="time" /></div>
                    <div>{{ $t('Label.SpNo')}}</div>
                    <div><q-input outlined dense v-model="term.StopTimeS" mask="time" /></div>
                </div>
                <div class="row">
                    <div class="q-pa-md col-12 col-md-3">{{ $t('Label.TermID')}}</div>
                    <div><q-input outlined dense v-model="term.TermID" /></div>
                </div>
                <div class="row">
                    <q-btn color="blue" icon-right="save" :label="$t('Label.Save')" @click="SaveTerm(itm);" />
                    <q-btn color="red" icon-right="cancel" :label="$t('Label.Cancel')" @click="isAddTerm=false" />
                </div>
            </q-card-section>
            </q-card> 
        </div>
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
    set model(v:SelectOptions){
        this.models = v;
        this.term.GameID = v.value as number;
        this.getTerms(this.term.GameID);
	}
	get model(){
		return this.models as SelectOptions;
    }
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
    async getGame(){
         let ans= await this.ax.getGames();
         if(ans){
            this.options=ans as SelectOptions[];
         }
    }
    ShowAdd(){
        if(this.model){
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
        if(ans.data.ErrNo === 0) {
            this.isAddTerm = false;    
            this.getTerms(this.model.value as number)
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
        }
        //console.log('getTerms',ans,this.data);
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
            this.isInputNum=false;
            this.getTerms(this.term.GameID);
        }
    }
    mounted(){
        if(!this.store.isLogin){
            this.$router.push({path:'/login'});
        }     
        this.getGame();
        this.term.PDate=this.dateString;
        //console.log(this.$t(`Label.Settled`),this.$t(`Label.Settled.${1}`));
    }
}
</script>
<style scoped>
.TermManager .my-card {
    width: 100%;
    max-width: 800px;
}
.termhead div {
    border:1px #00ffff solid; 
    background-color:#0055ff;
    color: white;
}
.numbox {
    width: 40px !important;
    margin-right: 5px;
}
</style>