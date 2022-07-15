<template>
	<div class="q-pd-md">
		<q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="name"
        label="Platform name *"
        hint="Name or ID"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class EditForm extends Vue {
	name='';
	onSubmit() {
		this.$emit('save', this.name);
		this.name = '';
	}
	onReset() {
		this.name = '';
	}
}
</script>
