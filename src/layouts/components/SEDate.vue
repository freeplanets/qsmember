<template>
  <div>
    <div class="row">
        <div>
          <q-list bordered separator>
            <q-item
              v-for="(itm,idx) in leftButton"
              :key="'lfbtn'+idx"
              clickable
              v-ripple
              class="leftbtn"
              @click="setDates(itm.ds);"
              >
              <q-item-section>{{ $t(`Report.${itm.Title}`)}}</q-item-section>
            </q-item>
          </q-list>
          <div class="row bbtn">
                <q-btn color="primary" dense :label="$t('Button.Confirm')" @click="setSltDates(true)" />
                <q-btn color="red" dense :label="$t('Label.Cancel')" @click="setSltDates(false)" />
          </div>
        </div>
        <div><DWIB v-model="SDate"></DWIB></div>
        <div><DWIB v-model="EDate"></DWIB></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import jd, { DateSets } from './Date/JDate';
import DateWithInputBox from './Date/DateWithInputBox.vue';

interface DateSltBtn {
  Title:string;
  ds:DateSets;
}
@Component({
  components: {
    DWIB: DateWithInputBox,
  },
})
export default class SEDate extends Vue {
  @Prop() value!:string;
  @Watch('value', { immediate: true, deep: true })
  onValueChange(v:string) {
    this.chkDates(v);
  }
  SDate='';
  EDate='';
  @Watch('SDate', { immediate: true, deep: true })
  onSDateChange() {
    console.log('onSDateChange', this.SDate);
  }
  isEmit=false;
  leftButton:DateSltBtn[]=[
    { Title: 'Today', ds: jd.today },
    { Title: 'Yesterday', ds: jd.yesterday },
    { Title: 'ThisWeek', ds: jd.currentWeek },
    { Title: 'LastWeek', ds: jd.lastWeek },
    { Title: 'ThisMonth', ds: jd.currentMonth },
    { Title: 'LastMonth', ds: jd.lastMonth },
    { Title: 'SinceLastMonth', ds: jd.sinceLastMonth },
  ]
  chkDates(s:string) {
    const reg = /\d\d\d\d\/\d\d\/\d\d/;
    const arr = s.replace(' ', '').split('-');
    if (arr[0]) {
      if (reg.exec(arr[0])) {
      // if (arr[0].match(reg)) {
        this.SDate = arr[0];
      }
    }
    if (arr[1]) {
      if (reg.exec(arr[1])) {
      // if (arr[1].match(reg)) {
        this.EDate = arr[1];
      }
    }
  }
  setDates(ds:DateSets) {
    this.SDate = ds.start;
    this.EDate = ds.end;
  }
  // setSltDates(ds?:DateSets){
  setSltDates(b:boolean) {
    if (!b) {
      this.$emit('closeme');
      return;
    }
    let dateSet:string|undefined;
    if (this.SDate) {
      if (this.EDate) {
        if (this.SDate === this.EDate) {
          dateSet = this.EDate;
        } else if (this.EDate < this.SDate) {
          dateSet = `${this.EDate}-${this.SDate}`;
        } else {
          dateSet = `${this.SDate}-${this.EDate}`;
        }
      } else {
        dateSet = this.SDate;
      }
    } else if (this.EDate) dateSet = this.EDate;
    if (dateSet) {
      this.$emit('input', dateSet);
    }
    this.$emit('closeme');
  }
  /*
  setSltDates(b:boolean){
    let ds:DateSets|undefined;
    if(b){
      ds={
        start:this.SDate,
        end:this.EDate
      }
    }
    //this.isEmit=true;
    this.$emit('setSltDates',ds);
  }
  */
  mounted() {
    // this.setDates(this.leftButton[0].ds);
  }
}
</script>
<style scoped>
.leftbtn {
  min-height: 42px;
}
.bbtn button{
  width: 50%;
}
</style>
