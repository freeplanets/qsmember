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
import {CommonParams,IMsg} from '../data/if';
import LayoutStoreModule from '../data/LayoutStoreModule';
@Component
export default class Comments extends Vue {
    @Prop() readonly PageName?:string;
    @Prop() readonly store?:LayoutStoreModule;
    private comment:string='';
    private page:string='';
    async saveWork(){
      if(this.comment==='') return;
      if(this.store){
        let cp:CommonParams={
          UserID:this.store.personal.id,
          sid:this.store.personal.sid,
          PageName:this.page,
          Comments:this.comment
        }
        //const ans:IMsg = await AxApi.getApi('saveComments',cp,'post');
        const ans:IMsg = await this.store.ax.getApi('saveComments',cp,'post');
        if(ans.ErrNo===0){
          let msg={
            title: 'Save Comments',
            message: 'Ok!!'
          }
          this.$q.dialog(msg).onOk(()=>{}).onCancel(()=>{}).onDismiss(()=>{});
        }
      }
    }
    async getComment(){
      if(this.page==='') return;
      if(this.store){
        let cp:CommonParams={
          UserID:this.store.personal.id,
          sid:this.store.personal.sid,          
          PageName:this.page
        }
        //const ans:IMsg = await AxApi.getApi('getComments',cp,'post');
        const ans:IMsg = await this.store.ax.getApi('getComments',cp,'post');
        //console.log('getComment',ans);
        if(ans.ErrNo===0){
          const dta:any=ans.data;
          if(dta.length>0){
            this.comment=dta[0].Comments;
          }
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