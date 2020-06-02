<template>
    <div class="row">
        <div class="talign" >{{ $t('Label.GameName')}}</div>
        <q-select square filled dense v-model="model" :options="options" style="width:200px"/>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator';
import {SelectOptions} from '../data/if';
import LayoutStoreModule from '../data/LayoutStoreModule';
/**
 * :store='yourvalue'
 * @setGames="functionName"
 */
@Component
export default class GameSelector extends Vue {
    @Prop() readonly store?:LayoutStoreModule;
    @Prop() AddAllItem?:boolean;   //增加GameID=0的選項=> Select ALL
    @Prop() ReturnList?:boolean;
    @Prop() GameID?:number;
    @Watch('GameID',{ immediate: true, deep: true })
    onGameIDChange(val:number){
        //console.log('onGameIDChange:',this.GameID,val,typeof val);
        if(val===undefined) return;
        this.ChangeFromUp=true;
        const f=this.options.find(itm=>itm.value===val)
        if(f){
            this.model=f;
        }
    }
    ChangeFromUp:boolean=false;
    models:SelectOptions = {value: 0,label:''};
    options:SelectOptions[] = []
    AllItem:SelectOptions = {value:0,label:'ALL'};
	set model(v:SelectOptions){
        this.models = v;
        if(!this.ChangeFromUp) this.$emit('setGames',v);
        this.ChangeFromUp=false;
	}
	get model(){
        //console.log('get Model:', this.models);
		return this.models as SelectOptions;
    }
	async getGames(){
        //console.log('getGames AddAllItem:',this.AddAllItem);
        if(!this.store) return;
        const ans:SelectOptions[] | undefined = await this.store.ax.getGames(this.store.personal.id,this.store.personal.sid)
        if(ans){
            if(this.AddAllItem){
                this.options = [this.AllItem].concat(ans);
                this.model = this.AllItem;
            } else {
                this.options = ans;
                this.model = this.options[0];
            }
        }
        if(this.ReturnList){
            this.$emit('setLists',this.options);
        }
    }    
    mounted(){
        this.getGames();
    }
}
</script>
<style scoped>
.talign {
    text-align: center;
    line-height:48px;
    margin: auto;
    padding: 0 4px 0 4px;
}
</style>