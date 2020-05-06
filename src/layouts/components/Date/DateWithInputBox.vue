<template>
  <div>
    <div class="row">
      <q-input class="dbox" square outlined dense v-model="date" />
    </div>
    <div class="row">
      <q-date
        v-model="date"
        minimal
      />
    </div>
  </div> 
</template>
<script lang="ts">
import Vue from 'vue'
import Compnent from 'vue-class-component'
import {Prop,Watch} from 'vue-property-decorator'

@Compnent
export default class DateWithInputBox extends Vue{
  date:string=''
  @Prop() value!:string;
  @Watch('value',{ immediate: true, deep: true })
  onmdatechange(v:string){
    //console.log('onmdatechange',v);
    this.date=v;
  }
  @Watch('date',{ immediate: true, deep: true })
  onDateChange(v:string){
    //this.date=v;
    //console.log('onDateChange',v);
    const reg = /\d\d\d\d\/\d\d\/\d\d/;
    if(v.match(reg)){
      this.$emit('input',v);
    }
  }
}
</script>
<style scoped>
.dbox {
  width: 100%;
}
</style>