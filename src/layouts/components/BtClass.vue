<template>
    <div class='talign'>
        <q-btn-group>
            <q-btn
                v-for="(itm,key) in BtClass"
                :key="'BtClass'+key"
                color="secondary"
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
import { Prop } from 'vue-property-decorator';
import LayoutStoreModule from '../data/LayoutStoreModule';
import { IbtCls } from '../data/if';
/**
 * :store="ParameterName"
 * :GameID="ParameterName"
 * @SltBT="FunctionName"
 */
@Component
export default class BtClass extends Vue {
    @Prop() readonly store?:LayoutStoreModule;
    @Prop() readonly GameID?:number;
    BtClass:IbtCls[]=[];
	async getBtClass() {
        this.BtClass = [];
        if (this.GameID && this.store) {
			const ans = await this.store.ax.getBtClass(0, '', this.GameID);
			if (ans) {
				ans.map((itm:IbtCls) => {
					this.BtClass.push(itm);
                });
                const df:IbtCls = {
                    id: '',
                    BCName: 'C',
                    BetTypes: '',
                };
                this.BtClass.push(df);
            }
        }
    }
    SltBetTypes(v:string) {
        this.$emit('SltBT', v);
    }
    mounted() {
       this.getBtClass();
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
