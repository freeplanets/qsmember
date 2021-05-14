<template>
  <div>
    <div class="row">
      <div
        class = "col-4"
        v-for="(title,idx) in fields"
        :key = "'hd'+idx" 
      >{{ $t(`Table.Lever.${title}`)}}</div>
    </div>
    <div class="row"
      v-for = "(itm,idx) in List"
      :key = "'bd'+idx"
    >
      <div class = "col-4">
        <q-input v-model="itm.Multiples" :dense="dense" />        
      </div>
      <div class = "col-4">
        <q-input v-model="itm.LongT" :dense="dense" />        
      </div>
      <div class = "col-4">
        <q-input v-model="itm.ShortT" :dense="dense" />        
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Lever from '../class/Lever';

@Component
export default class LeverModifier extends Vue{
  @Prop({type: Array}) readonly List!:Lever[];
  fields = Lever.fields;
}
</script>