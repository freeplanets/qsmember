<template>
	<div class="q-pa-md">
		<q-btn round color="secondary" icon="person_add" @click="openDialog=true" />
    <q-dialog v-model="openDialog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add New</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
					<edit-form @save="save" />
        </q-card-section>
      </q-card>
    </q-dialog>
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import EditForm from './EditForm.vue';

@Component({
	components: {
		EditForm,
	},
})
export default class Add extends Vue {
	openDialog=false;
	save(v:string) {
		console.log('Add save', v);
		this.$emit('save', v);
		this.openDialog = false;
	}
}
</script>
