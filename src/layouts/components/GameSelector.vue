<template>
    <div class="row q-pa-sm">
        <div class="talign" >{{ $t('Label.GameName')}}</div>
        <q-select square filled dense v-model="model" :options="options" style="width:200px"/>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import {SelectOptions} from '../data/if';
import LayoutStoreModule from '../data/LayoutStoreModule';

@Component
export default class GameSelector extends Vue {
    @Prop() readonly store?:LayoutStoreModule;
    models:SelectOptions = {value: 0,label:''};
	options:SelectOptions[] = []
	set model(v:SelectOptions){
        this.models = v;
        this.$emit('setGames',v);
	}
	get model(){
        //console.log('get Model:', this.models);
		return this.models as SelectOptions;
    }
	async getGames(){
        if(!this.store) return;
        const ans:SelectOptions[] | undefined = await this.store.ax.getGames()
        if(ans){
            this.options = ans;
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
}
</style>