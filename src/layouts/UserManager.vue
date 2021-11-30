<template>
  <div>
    <q-toolbar class="bg-purple text-white">
      <q-btn flat round dense icon="assignment_ind" />
      <q-toolbar-title>
        <div class="row">
            <q-input class="bgc" dense outlined v-model="Userf" :label="$t('Tip.UserFind')" />
            <div v-if='options.length>0'>
                <q-btn-dropdown color="primary" :label="curTypeName">
                <q-list>
                    <q-item clickable v-close-popup @click="setTypes()">
                    <q-item-section>
                        <q-item-label>None</q-item-label>
                    </q-item-section>
                    </q-item>
                    <q-item
                        v-for="(typ,idx) in options"
                        :key="'typ'+idx"
                        clickable
                        v-close-popup
                        @click="setTypes(typ.value,typ.label)">
                    <q-item-section>
                        <q-item-label>{{ typ.label }}</q-item-label>
                    </q-item-section>
                    </q-item>
                </q-list>
                </q-btn-dropdown>
            </div>
            <q-btn flat round dense icon="search" @click="SearchUser" />
        </div>
      </q-toolbar-title>

      <q-btn flat round dense icon="add_circle" class="q-mr-xs" @click="addNewUser()"/>
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>
    <div class="q-pa-md ListUser"
      v-show="showList"
    >
        <div class='row'>
            <div class="col-1 test testheader"
                v-for="(hd,idxu) in cols"
                :key="'m'+idxu"
            >
                {{  hd.label }}
            </div>
        </div>
        <div class="row"
            v-for="(itm,idx) in data"
            :key="'u'+idx"
        >
            <div class='col-1 test lnh'>{{ itm.SiteName }}</div>
            <div class='col-1 test lnh'>{{ itm.Account }}</div>
            <div class='col-1 test lnh'>{{ itm.Nickname }}</div>
            <div class='col-1 test lnh'>{{ itm.TypeName }}</div>
            <div class='col-1 test lnh'><q-btn  flat round dense v-if='itm.Types===1 || itm.Types===2' :label="$t('Common.Setup')" @click="SetupGames(itm.id,itm.PayClass ? itm.PayClass : '')" /></div>
            <div class='col-1 test lnh'><q-btn  flat round dense  v-if='itm.Types && itm.Types < 9' :label="$t('Common.Setup')" @click="SetupPrograms(itm.id,itm.Programs)" /></div>
            <div class='col-1 test lnh'><q-btn  flat round dense  v-if='itm.Types && itm.Types < 4' :label="$t('Common.Setup')" @click="ResetPW(itm.id,itm.Account)" /></div>
       </div>
    </div>
    <div class='UserModify'
      v-show="showEdit"
    >
      <div class="row">
          <div class="gamefield col-12 col-md-1">{{$t('Table.SiteName')}}</div>
          <div class="gamefield col-12 col-md-3"><q-input outlined dense v-model="NewUser.SiteName"/></div>
      </div>
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
    <q-dialog
      v-model="showPayClass">
      <q-card class="my-min-wd">
        <q-card-section>
          <div class="text-h6">{{$t('Table.GameItems')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <GPCS :store="store" :uid="curUserID" :emptyitem="true" :PayClass="curPayClass" @setPayClass="setPayClass"></GPCS>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('Label.Save')" @click="SavePayClass" />
          <q-btn flat :label="$t('Label.Cancel')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="showPrograms">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{$t('Label.ProgramsSlt')}}</div>
        </q-card-section>
        <q-card-section>
        <q-list bordered>
          <q-item clickable v-ripple
            v-for="(itm,idx) in Programs"
            :key="`progs-${idx}`"
          >
            <q-item-section avatar>
              <q-checkbox v-model="itm.isChecked" />
            </q-item-section>
            <q-item-section avatar>
              <q-icon color="primary" :name="itm.Icon" />
            </q-item-section>
            <q-item-section>{{ $t(`Label.${itm.Title}`)}}</q-item-section>
          </q-item>
        </q-list>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('Label.Save')" @click="SavePrograms" />
          <q-btn flat :label="$t('Label.Cancel')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showResetPW" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{WhosName}}:{{$t('Title.NPassword')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="NPassword" autofocus @keyup.enter="prompt = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('Label.Cancel')" v-close-popup />
          <q-btn flat :label="$t('Table.ResetPW')" v-close-popup @click="DoResetPW" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators';
import LayoutStoreModule from './data/LayoutStoreModule';
import { User } from './data/schema';
import { SelectOptions, TableHeader, CommonParams, LoginInfo, Msg, Progs } from './data/if';
import { UserTypes } from './class/Users';
import GamePayClassSelector from './components/GamePayClassSelector.vue';

Vue.component('GPCS', GamePayClassSelector);
interface Ans {
  affectedRow?:number;
  insertId?:number;
  warningStatus?:number;
}
interface UserGPC {
  [key:string]:number;
}
interface EPrograms extends Progs{
  isChecked:boolean;
}
@Component
export default class UserManager extends Vue {
    store=getModule(LayoutStoreModule);
    NewUser:User = { TableName: 'User', id: 0, Types: 0 }
    slt:SelectOptions={ value: 0, label: '' }
    showList=true;
    showEdit=false;
    Userf='';
    data:User[]=[]
    typeNameTip='';
    curTypeName='';
    curType:number|undefined;
    curUserID=0;
    curPayClass='';
    showPayClass=false;
    PayClassSlted='';
    Programs:EPrograms[]=[];
    showPrograms=false;
    showResetPW=false;
    NPassword='';
    SetUid=0;
    WhosName='';
    cols:TableHeader[]=[
      {
        name: 'SiteName',
        label: 'SiteName',
        field: 'SiteName',
      },
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
      {
        name: 'GameItems',
        label: 'GameItems',
        field: 'GameItems',
      },
      {
        name: 'Programs',
        label: 'Programs',
        field: 'Programs',
      },
      {
        name: 'ResetPW',
        label: 'ResetPW',
        field: 'ResetPW',
      },
    ]
    private typesOption:SelectOptions[]=[]
    // paycls:SelectOptions={}
    // payclss:SelectOptions[]=[];
    private slted=[]
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
    get UserID() {
      return this.store.personal.id;
    }
    get PInfo():LoginInfo {
      return this.store.personal;
    }
    getTypeOptions() {
      const tmp:SelectOptions[] = [];
      UserTypes.map((itm) => {
        // console.log('getTypeOptions:',itm);
        const im:SelectOptions = {
          label: this.$t(`Label.${itm.title}`) as string,
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
    SavePayClass() {
      const user:User = {
        TableName: 'User',
        id: this.curUserID,
      };
      // let payclass:string='';
      // const ugpc:UserGPC={};
      /*
      this.PayClassSlted.map(itm=>{
        const p:SelectOptions=itm.PayClass as SelectOptions;
        const gid:string = itm.id +'';
          ugpc[gid]=p.value as number;
      })
      User.Payclass = JSON.stringify(ugpc);
      */
      user.PayClass = this.PayClassSlted;
      this.saveUser(user);
      this.showPayClass = false;
    }
    ResetPW(userid:number, username = '') {
      // console.log('ResetPW:',userid);
      this.showResetPW = true;
      this.SetUid = userid;
      this.WhosName = username;
    }
    async DoResetPW() {
      if (this.NPassword && this.NPassword === '') {
          this.$q.dialog({
              title: this.$t('Table.ResetPW') as string,
              message: 'Empty is not allowed!',
          });
          return;
      }
      const param:CommonParams = {
        UserID: this.store.personal.id,
        sid: this.store.personal.sid,
        WhosID: this.SetUid,
        NPassword: this.NPassword,
      };
      const msg:Msg = await this.store.ax.getApi('ResetPassword', param, 'post');
      if (msg.ErrNo === 0) {
        this.$q.dialog({
            title: this.$t('Table.ResetPW') as string,
            message: `${this.WhosName}'s Password is changed!`,
        });
      }
    }
    setPayClass(slted:string) {
      this.PayClassSlted = slted;
      /*
      let fidx:number|undefined;
      const f = this.PayClassSlted.find((itm,idx)=>{
        if(itm.id===game.id){
            fidx = idx;
            return itm;
        } 
      });
      if(!game.isSelected){
        if(fidx!==undefined){
          this.PayClassSlted.splice(fidx,1);
        }
      } else {
        if(!f){
          this.PayClassSlted.push(game);
        }
      }
      */
    }
    SetupGames(uid:number, PayClass:string) {
      this.curUserID = uid;
      this.curPayClass = PayClass;
      this.showPayClass = true;
    }
    async SetupPrograms(uid:number, Programs?:string) {
      this.SetUid = uid;
      if (this.Programs.length === 0) {
        await this.getPrograms();
      }
      this.Programs.map((itm) => {
        itm.isChecked = false;
      });
      if (Programs) {
        const progs = Programs.split(',').map((v) => parseInt(v, 10));
        progs.map((v) => {
          const f = this.Programs.find((itm) => itm.id === v);
          if (f) {
            f.isChecked = true;
          }
        });
      }
      this.showPrograms = true;
    }
    setTypes(v?:number, n?:string) {
        this.curType = v;
        this.curTypeName = this.typeNameTip;
        if (v !== undefined) {
            this.curTypeName = `${n}`;
        }
    }
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
    async SavePrograms() {
      const ax = this.store.ax;
      const param:CommonParams = {
        UserID: this.PInfo.id,
        sid: this.PInfo.sid,
        SetUserID: this.SetUid,
      };
      const prog:number[] = [];
      this.Programs.map((itm) => {
        if (itm.isChecked) prog.push(itm.id);
      });
      if (prog.length === 0) return;
      param.Programs = prog.join(',');
      const msg:Msg = await ax.getApi('SetUser', param);
      this.$q.dialog({
        title: `${this.$t('Label.ProgramsSet')}`,
        message: msg.ErrNo ? msg.ErrCon : 'Ok!!',
      });
      if (msg.ErrNo === 0) {
        const fuser = this.data.find((itm) => itm.id === this.SetUid);
        if (fuser) {
          fuser.Programs = param.Programs;
          console.log(fuser);
        } else {
          console.log('not found');
        }
      } else {
        console.log(msg);
      }
      this.showPrograms = false;
    }
    async getPrograms() {
      const ax = this.store.ax;
      const param:CommonParams = {
        UserID: this.PInfo.id,
        sid: this.PInfo.sid,
      };
      const msg:Msg = await ax.getApi('getPrograms', param);
      if (msg.ErrNo === 0) {
        const data = msg.data as EPrograms[];
        data.map((itm) => {
          itm.isChecked = false;
          this.Programs.push(itm);
        });
      }
    }
    async saveUser(user?:User) {
      let curUser:User;
      if (user) {
        curUser = user;
      } else {
        curUser = this.NewUser;
      }
      curUser.ModifyID = this.UserID;
      const ax = this.store.ax;
      const ans:Msg = await ax.saveUser(this.PInfo.id, this.PInfo.sid, curUser);
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
      this.NewUser = { TableName: 'User', id: 0, Types: 0 };
      this.showList = true;
      this.showEdit = false;
    }
    async getUsers() {
      const ax = this.store.ax;
      const param:CommonParams = {
        UserID: this.PInfo.id,
        sid: this.PInfo.sid,
      };
      if (this.Userf) param.findString = this.Userf;
      if (this.curType !== undefined) param.userType = this.curType;
    
      const ans:Msg = await ax.getUsers(param);
      if (ans.ErrNo === 0) {
        this.data = ans.data as [];
        // console.log('getUsers', this.data);
        this.data.map((u) => {
          if (u.Account && u.Account.length > 20) {
            u.Account = u.Nickname;
          }
          if (u.PayClass) {
            u.PayClass = u.PayClass.replace(/\\/g, '');
          }
          const tmp = this.typesOption.find((itm) => itm.value === u.Types);
          if (tmp) {
            u.TypeName = tmp.label;
          }
        });
      }
      // console.log('getUsers',ans);
    }
    SearchUser() {
        this.getUsers();
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
        this.typeNameTip = this.$t('Label.InputClassName') as string;
        this.curTypeName = this.typeNameTip;
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
.testheader div{
    background-color: cadetblue;
    color:white;
}
.test {
    border: 1px gray solid;
    text-align: center;
    vertical-align: middle;
}
.bgc {
    background-color: cornsilk;
}
.lnh {
    line-height: 34px;
}
.my-min-wd {
  min-width: 90%;
}
</style>
