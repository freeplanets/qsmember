<template>
    <div class='talign'>
        <q-btn-group>
            <q-btn 
                v-for="(itm,key) in BtClass"
                :key="'BtClass'+key"
                :color="itm.BetTypes ? 'secondary' : 'orange'" 
                glossy 
                :label="itm.BCName"
                @click="SltBetTypes(itm.BetTypes)"
                    />
        </q-btn-group>                
    </div>    
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop,Watch} from 'vue-property-decorator';
import LayoutStoreModule from '../data/LayoutStoreModule';
import { IbtCls,ILoginInfo } from '../data/if';
/**
 * :store="ParameterName"
 * :GameID="ParameterName"
 * @SltBT="FunctionName"
 */
@Component
export default class BetTypeClass extends Vue {
    @Prop() readonly store?:LayoutStoreModule;
    @Prop() readonly pinfo?:ILoginInfo;
    @Prop() readonly GameID?:number;
    @Watch('GameID',{ immediate: true, deep: true })
    onGameIDChange(){
        this.getBtClass()
    }
    BtClass:IbtCls[]=[];
	async getBtClass(){
        let pinfo:ILoginInfo={
            id:0,
            Account:'',
            sid:'',
            Levels:0
        }
        if(this.pinfo) pinfo=this.pinfo;
        this.BtClass=[];
        if(this.GameID && this.store){
			const ans = await this.store.ax.getBtClass(pinfo.id,pinfo.sid,this.GameID)
			if(ans){
				ans.map((itm:IbtCls)=>{
					this.BtClass.push(itm)
                });
                let df:IbtCls ={
                    id:'',
                    BCName:`${this.$t('Button.Clear')}`,
                    BetTypes:''
                }
                this.BtClass.push(df);
            }
        }
    }
    SltBetTypes(v:string){
        this.$emit('SltBT',v);
    }
    mounted(){
       //this.getBtClass();
    }
}
</script>
<style scoped>
.talign {
    text-align: left;
    line-height:48px;
    margin: auto;
}
</style>