<template>
    <div class="row">
        <div class="talign" >{{ $t('Label.GameName')}}</div>
        <q-select square filled dense v-model="model" :options="options" style="width:200px"/>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { SelectOptions } from '../data/if';
import LayoutStoreModule from '../data/LayoutStoreModule';
/**
 * :store='yourvalue'
 * @setGames="functionName"
 */
@Component
export default class GameSelector extends Vue {
    @Prop() readonly store?:LayoutStoreModule;
    @Prop() AddAllItem?:boolean; // 增加GameID=0的選項=> Select ALL
    @Prop() ReturnList?:boolean;
    @Prop() readonly showall?:boolean;
    /*
    @Prop() GameID?:number;
    @Watch('GameID',{ immediate: true, deep: true })
    onGameIDChange(val:number){
        //console.log('onGameIDChange:',this.GameID,val,typeof val);
        if(val===undefined) return;
        this.ChangeFromUp=true;
        console.log('GameSelector onGameIDChange:',this.options);
        const f=this.options.find(itm=>itm.value===val)
        if(f){
            this.model=f;
        }
    }
    */
    ChangeFromUp=false;
    models:SelectOptions = { value: 0, label: '' };
    options:SelectOptions[] = []
    AllItem:SelectOptions = { value: 0, label: 'ALL' };
    get UserPayClass() {
        if (this.store) {
            if (this.store.personal.PayClass) {
                return this.store.personal.PayClass;
            }
        }
        return [];
    }
	set model(v:SelectOptions) {
        this.models = v;
        // console.log('GameSelector',this.ChangeFromUp);;
        if (!this.ChangeFromUp) this.$emit('setGames', v);
        this.ChangeFromUp = false;
	}
	get model() {
        // console.log('get Model:', this.models);
		return this.models;
    }
	async getGames() {
        // console.log('GameSelector getGames AddAllItem:',this.AddAllItem);
        if (!this.store) return;
        let ans:SelectOptions[] | undefined = await this.store.ax.getGames(this.store.personal.id, this.store.personal.sid, this.showall);
        if (ans) {
            if (this.UserPayClass.length > 0) {
                const tmp:SelectOptions[] = ans;
                const tmpWK:SelectOptions[] = [];
                this.UserPayClass.map((itm) => {
                    const f = tmp.find((sl) => sl.value === itm.GameID && itm.PayClassID > 0);
                    if (f) tmpWK.push(f);
                });
                ans = tmpWK;
            }
            if (this.AddAllItem) {
                this.options = [this.AllItem].concat(ans);
                this.model = this.AllItem;
            } else {
                this.options = ans;
                this.model = this.options[0];
            }
        }
        if (this.ReturnList) {
            this.$emit('setLists', this.options);
        }
        // console.log('GameSelector getGames:',this.options);
    }
    async mounted() {
        // console.log('GameSelector mounted');
        await this.getGames();
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
