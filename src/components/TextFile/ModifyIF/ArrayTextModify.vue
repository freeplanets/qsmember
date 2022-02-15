<template>
	<div>
		<text-input
			v-for="(cont, idx) in myvalue"
			:key="'arr:'+idx"
			v-model="myvalue[idx]"
			:title="cont"
		/>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import TextInput from './TextInput.vue';

@Component({
	components: {
		TextInput,
	},
})
export default class ArrayTextModify extends Vue {
	@Prop({ type: Array }) readonly value!:string[];
	myvalue:string[] = [];
	mounted() {
		this.myvalue = this.value.map((itm) => itm);
	}
}
</script>
