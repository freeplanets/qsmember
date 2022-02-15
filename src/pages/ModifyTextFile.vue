<template>
	<div>
		<q-tabs
        v-model="tab"
        class="text-teal"
      >
        <q-tab
					v-for="(itm, idx) in Files"
					:key = "'tab'+idx"
					:name="itm" :label="itm" />
    </q-tabs>
		<q-separator />
		<q-tab-panels v-model="tab" animated>
			<q-tab-panel
				v-for="(tit, id) in Files"
				:key="'main:'+id"
				:name="tit">
				<div class="text-h6">{{ tit }}</div>
				<t-main :textkey="tit" />
			</q-tab-panel>
    </q-tab-panels>
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import TextMain from '../components/TextFile/TextMain.vue';

@Component({
	components: {
		TMain: TextMain,
	},
})
export default class ModifyTextFile extends Vue {
	tab = '';
	Files = ['Manager', 'Lotto', 'Crypto'];
}
</script>
