<template>
  <div class="row">
    <div v-if="Title" :class="{'col-2': Title, talign:true }">{{ Title }}</div>
    <q-select
      :class="{'col-10': Title, 'col-12': !Title}"
      style = "min-width: 130px"
      square filled dense
      v-model="model"
      :options="options"
      emit-value
      map-options
    />
  </div>  
</template>
<script lang="ts">
import { SelectOptions } from 'src/layouts/data/if';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Selector extends Vue {
  @Prop({ type: String }) readonly Title?:string;
  @Prop({ type: Array }) readonly options!:SelectOptions[];
  model:number | null = null;
  @Watch('options')
  onOptionsChange() {
    this.model = 0;
  }
  @Watch('model')
  onModelChange() {
    this.$emit('SetItem', this.model);
  }
}
</script>
<style scoped>
.talign {
    text-align: center;
    padding-top: 10px;
}
</style>