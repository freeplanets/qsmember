import {ProbTable} from '../data/if'
import BClass from './BClass'

export default class ProbabilityTable extends BClass<ProbTable>{
    constructor(data:ProbTable){
      super(data);
    }
    get id() {
      return this.data.id;
    }
    set id(v:number) {
      this.id=v;
    }
    get BetType(){
      return this.data.BetType;
    }
    get SubType(){
      return this.data.SubType;
    }    
    get Title(){
      return this.data.title ?　this.data.title : '';
    }
    get SubTitle(){
      return this.data.subtitle ? this.data.subtitle : '';
    }
    get Probability(){
      return this.data.Probability;
    }
    set Probability(v:number){
      this.data.Probability=v;
      if(this.data.Probability !== this.oldData.Probability){
        this.isDataChanged = true;
      } else {
        this.isDataChanged = false;
      }
    }
}