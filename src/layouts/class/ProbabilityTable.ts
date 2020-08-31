import {ProbTable} from '../data/if'
import BClass from './BClass'

class ProbabilityTable extends BClass<ProbTable>{
    constructor(data:ProbTable){
      super(data);
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