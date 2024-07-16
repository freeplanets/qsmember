<template>
  <q-select
    :class="{'col-10': Title, 'col-12': !Title}"
    style = "min-width: 130px"
    square filled dense
    v-model="model"
    :options="options"
    emit-value
    map-options
    :label="Title"
  />
</template>
<script lang="ts">
import { SelectOptions } from 'src/layouts/data/if';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Selector extends Vue {
  @Prop({ type: String }) readonly Title?:string;
  @Prop({ type: Array }) readonly options!:SelectOptions[];
  @Prop({ type: Number }) readonly defaultModel!:number;
  model:number = this.defaultModel;
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
