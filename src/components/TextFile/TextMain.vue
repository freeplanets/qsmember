<template>
	<q-splitter
		v-if="myText"
		v-model="splitterModel"
	>
		<template v-slot:before>
			<q-tabs
				v-model="curTab"
				vertical
				class="text-teal"
			>
				<q-tab
					v-for="(key, idx) in Object.keys(myText)"
					:key="'left:'+idx"
					:name="key" :label="key" />
			</q-tabs>
		</template>

		<template v-slot:after>
			<q-tab-panels
				v-model="curTab"
				animated
				transition-prev="slide-down"
				transition-next="slide-up"
			>
				<q-tab-panel
					v-for="(tit, id) in Object.keys(myText)"
					:key="'con:'+id"
					:name="tit">
					<div class="text-h4 q-mb-md">{{ typeof myText[tit] === 'string' ? myText[tit] : tit }}</div>
					<text-modify v-model="myData[tit]"></text-modify>
				</q-tab-panel>
			</q-tab-panels>
		</template>
	</q-splitter>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import TextFile, { TextStructure } from './data/All';
import TextModify from './TextModify.vue';

@Component({
	components: {
		TextModify,
	},
})
export default class TextMain extends Vue {
	@Prop({ type: String })	readonly textkey!:string;
	myText:TextStructure | null = null;
	splitterModel = 20;
	curTab = 'TopText';
	myData: TextStructure = {};
	setValue(key:string, value:any) {
		if (this.myText) this.myText[key] = value;
	}
	getTexts(textkey:string) {
		return (TextFile as any)[textkey] as TextStructure;
	}
	mounted() {
		console.log('mounted:', this.textkey);
		if (this.textkey) {
			this.myText = this.getTexts(this.textkey);
			this.myData = { ...this.myText };
		}
	}
}
</script>
