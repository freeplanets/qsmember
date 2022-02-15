<template>
	<div v-if="myValue">
		<div v-if="checkString(myValue)">
			<text-input v-model="myValue" :title="textkey" />
		</div>
		<div v-if="!checkString(myValue)">
			<array-text-modify v-model="myValue" />
		</div>

	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ArrayTextModify from './ModifyIF/ArrayTextModify.vue';
import TextInput from './ModifyIF/TextInput.vue';

@Component({
	components: {
		ArrayTextModify,
		TextInput,
	},
})
export default class TextModify extends Vue {
	@Prop() value:any;
	@Prop() readonly textkey!:string;
	get myValue() {
		console.log('get data', this.value);
		return this.value;
	}
	set myValue(v:any) {
		// this.value = v;
		this.$emit('input', this.textkey, v);
	}
	setValue(v:any) {
		this.myValue = v;
		// 
	}
	checkString(v:any) {
		if (typeof v === 'string') return true;
		return false;
	}
}
</script>
