<template>
    <div>
      <q-toolbar class="bg-purple text-white">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title>
          {{$t('Label.AddUser')}}
        </q-toolbar-title>
        <q-btn flat round dense icon="add_circle" class="q-mr-xs" @click="addNewUser()"/>
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>
    <div class="q-pa-md ListUser"
      v-show="showList"
    >
      <q-table
        title="Treats"
        :data="data"
        :columns="cols"
        row-key="name"
        selection="single"
        :selected.sync="Selected"
      />
    </div>
    <div class='UserModify'
      v-show="showEdit"
    >
      <div class="row">
          <div class="gamefield col-12 col-md-1">{{$t('Table.Account')}}</div>
          <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="NewUser.Account"/></div>
      </div>
      <div class="row">
          <div class="gamefield col-12 col-md-1">{{$t('Table.Password')}}</div>
          <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="NewUser.Password" type="password" /></div>
      </div>
      <div class="row">
          <div class="gamefield col-12 col-md-1">{{$t('Table.Nickname')}}</div>
          <div  class="gamefield col-12 col-md-3"><q-input outlined dense v-model="NewUser.Nickname" /></div>
      </div>
      <div class="row">
          <div class="gamefield col-12 col-md-1">{{$t('Table.Types')}}</div>
          <div  class="gamefield col-12 col-md-3"><q-select square filled dense v-model="model" :options="options" style="width:200px"/></div>
      </div>
      
      <div class="row">
          <div><q-btn color="green" icon-right="save" label="Save" @click="saveUser();" /></div>
          <div><q-btn color="red" icon-right="cancel" label="Cancel" @click="Cancel();" /></div>
      </div>
    </div>
    </div>
</template>
<script lang="ts">
// import Vue from 'vue';
// import Component from 'vue-class-component';
import { Vue, Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import LayoutStoreModule from './data/LayoutStoreModule';
import { User } from './data/schema';
import { SelectOptions, TableHeader, Msg, LoginInfo, CommonParams } from './data/if';
import { UserTypes } from './class/Users';

interface Ans {
  affectedRow?:number;
  insertId?:number;
  warningStatus?:number;
}
@Component
export default class AddUser extends Vue {
    store=getModule(LayoutStoreModule);
    NewUser:User = { TableName: 'User', id: 0 };
    slt:SelectOptions={ value: 0, label: '' };
    showList=true;
    showEdit=false;
    data:User[]=[]
    cols:TableHeader[]=[
      {
        name: 'Account',
        label: 'Account',
        field: 'Account',
      },
      {
        name: 'Nickname',
        label: 'Nickname',
        field: 'Nickname',
      },
      {
        name: 'Types',
        label: 'Types',
        field: 'TypeName',
      },
    ]
    private typesOption:SelectOptions[]=[]
    // paycls:SelectOptions={}
    // payclss:SelectOptions[]=[];
    private slted=[];
    get PInfo():LoginInfo {
      return this.store.personal;
    }
    get Selected() {
      return this.slted;
    }
    set Selected(v:User[]) {
      // console.log('Selected',v,v.length)
      // this.slted = v;
      this.showEdit = true;
      this.showList = false;
      this.setUser(v[0]);
    }
    get model() {
      return this.slt;
    }
    set model(v:SelectOptions) {
      this.slt = v;
      this.NewUser.Types = v.value;
    }
    get options() {
      return this.typesOption;
    }
    getTypeOptions() {
      const tmp:SelectOptions[] = [];
      UserTypes.map((itm) => {
        const im:SelectOptions = {
          label: String(this.$t(`Label.${itm.title}`)),
          value: itm.value,
        };
        tmp.push(im);
      });
      this.typesOption = tmp;
      // console.log('options',tmp);
      // return tmp;
    }
    /*
    get payc(){
      return this.paycls;
    }
    set payc(v:SelectOptions){
      this.paycls = v;
    }
    */
    setUser(v:User) {
      Object.keys(v).map((key) => {
        if (key === 'TypeName') return;
        this.NewUser[key] = v[key];
      });
      this.typesOption.map((itm) => {
        if (itm.value === v.Types) {
          this.model = itm;
        }
      });
    }
    async saveUser() {
      const ax = this.store.ax;
      const ans:Msg = await ax.saveUser(this.PInfo.id, this.PInfo.sid, this.NewUser);
      // console.log('saveUSer',ans);
      if (ans.ErrNo === 0) {
        this.clearUser();
        this.getUsers();
        this.showList = true;
        this.showEdit = false;
      }
    }
    clearUser() {
      Object.keys(this.NewUser).map((key) => {
        if (key === 'TableName') return;
        if (typeof this.NewUser[key] === 'string') {
          this.NewUser[key] = '';
        } else {
          this.NewUser[key] = 0;
        }
      });
    }
    addNewUser() {
      if (!this.showEdit) {
        this.clearUser();
        this.showEdit = true;
        this.showList = false;
      }
    }
    Cancel() {
      this.NewUser = { TableName: 'User', id: 0 };
      this.showList = true;
      this.showEdit = false;
    }
    async getUsers() {
      const ax = this.store.ax;
      const param:CommonParams = {
        UserID: this.PInfo.id,
        sid: this.PInfo.sid,
      };
      const ans:Msg = await ax.getUsers(param);
      if (ans.ErrNo === 0) {
        this.data = ans.data as User[];

        this.data.map((u) => {
          const tmp = this.typesOption.find((itm) => itm.value === u.Types);
          if (tmp) {
            u.TypeName = tmp.label;
          }
        });
      }
      console.log('getUsers', this.data);
    }

    mounted() {
      if (!this.store.isLogin) {
        this.$router.push({ path: '/login' });
      }
      this.cols.map((itm) => {
        itm.label = this.$t(`Table.${itm.label}`) as string;
      });
      // console.log('language',this.$t('Table.Account'));
      this.getTypeOptions();
      this.getUsers();
    }
}
</script>
<style scoped>
.UserModify {
  margin: 20px;
}
.UserModify div {
  margin-bottom: 5px;
}
</style>
