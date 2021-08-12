import { ProbTable } from '../data/if';
import BClass from './BClass';
import { NoSientificNotation } from '../components/func';

export default class ProbabilityTable extends BClass<ProbTable> {
  private title='';
  private subtitle='';
    get id() {
      return this.data.id;
    }
    set id(v:number) {
      this.data.id = v;
    }
    get BetType() {
      return this.data.BetType;
    }
    get SubType() {
      return this.data.SubType;
    }
    get Title() {
      return this.title;
    }
    set Title(v:string) {
      this.title = v;
    }
    get SubTitle() {
      return this.subtitle;
    }
    set SubTitle(v:string) {
      this.subtitle = v;
    }
    get Probability() {
      return NoSientificNotation(this.data.Probability);
    }
    set Probability(v:string) {
      this.data.Probability = parseFloat(v);
      if (this.data.Probability !== this.oldData.Probability) {
        this.isDataChanged = true;
      } else {
        this.isDataChanged = false;
      }
    }
    get isParlay():boolean {
      return !!this.data.isParlay;
    }
    set isParlay(v:boolean) {
      this.data.isParlay = v ? 1 : 0;
      this.isDataChanged = true;
    }
    get Selected() {
      return false;
    }
}
