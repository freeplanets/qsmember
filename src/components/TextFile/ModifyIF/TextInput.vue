<template>
	<div>
		<q-input v-model="myvalue" :label="title" />
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class TextInput extends Vue {
	@Prop({ type: String }) value!:string;
	@Prop({ type: String }) readonly title!:string;
	@Watch('value')
	onValueChange() {
		this.myvalue = this.value;
	}
	get myvalue() {
		return this.value;
	}
	set myvalue(v:string) {
		this.$emit('input', this.value);
	}
}
</script>
