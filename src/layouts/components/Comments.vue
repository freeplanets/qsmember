<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-model="comment"
      :definitions="{
        save: {
          tip: 'Save your work',
          icon: 'save',
          label: 'Save',
          handler: saveWork
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['upload', 'save']
      ]"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import AxApi from './AxApi';
import {CommonParams,IMsg} from '../data/if';
import { QDialogOptions } from 'quasar';
@Component
export default class Comments extends Vue {
    @Prop() readonly PageName?:string;
    private comment:string='';
    private page:string='';
    async saveWork(){
      if(this.comment==='') return;
      let cp:CommonParams={
        PageName:this.page,
        Comments:this.comment
      }
      const ans:IMsg = await AxApi.getApi('saveComments',cp,'post');
      if(ans.ErrNo===0){
        let msg:QDialogOptions={
          title: 'Save Comments',
          message: 'Ok!!'
        }
        this.$q.dialog(msg).onOk(()=>{}).onCancel(()=>{}).onDismiss(()=>{});
      }
    }
    async getComment(){
      if(this.page==='') return;
      let cp:CommonParams={
        PageName:this.page
      }
      const ans:IMsg = await AxApi.getApi('getComments',cp,'post');
      //console.log('getComment',ans);
      if(ans.ErrNo===0){
        const dta:any=ans.data;
        if(dta.length>0){
          this.comment=dta[0].Comments;
        }
      }
      
    }
    mounted(){
        this.page=this.$route.path.replace('/',':');
        if(this.page===':'){
          this.page='root';
        }
        this.getComment();
        //console.log('mounted getComment');
    }
}
</script>
<style scoped>
.q-dialog__inner--minimized > div {
    max-width: 100% !important;
}
</style>