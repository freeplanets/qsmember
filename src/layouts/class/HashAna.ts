class HashAna {
  private radix:number=10;
  private aHash:string[]=[];
  private re=/[a-zA-Z]/g;
  private zero=/^0{8,19}/;
  private dgt:number=0;
  constructor(private hash:string,private Max:number,private Min:number,private pos:number,private allowSameNum:boolean=false,private OnlyDigital:boolean=true,private NoZero:boolean=false,private RepetOne:boolean=false){
    let str;
    if(this.NoZero){
      str = this.hash.replace(this.zero,'');
    } else {
      str = this.hash;
    }
    if(this.OnlyDigital){
      str=str.replace(this.re,'');
    } else {
      this.radix=16;
      //str = this.hash;
    }
    this.dgt = `${this.Max}`.length;
    this.aHash = str.split('');
  }
  get NumLine(){
    let n=this.pos;
    const tmp:number[]=[];
    while(n>0){
      if(this.aHash.length<this.dgt) break;
      const tnum=this.Pop();
      if(tnum < this.Min) continue;
      if(this.allowSameNum){
        tmp.push(tnum);
      } else {
        if(tmp.indexOf(tnum)===-1){
          tmp.push(tnum);
        } else {
          continue;
        }
      }
      //tmp.push()
      n--;
    }
    return tmp.reverse();
  }
  Pop(){
    //let n=this.dgt;
    const tmp:string[]=[];
    while(this.aHash.length>0 && tmp.length<this.dgt){
      const p=this.aHash.pop();
      if(p) tmp.push(p);
      if(this.RepetOne) tmp.push(this.aHash[this.aHash.length-1]);
      //n--;
    }
    const num=parseInt(tmp.reverse().join(''),this.radix);
    return num > this.Max ? num % (this.Max+1) : num;
  }
  /*
  RepetLastOne(){
    const tmp:string[]=[];
    while(this.aHash.length>this.dgt-1 && tmp.length < this.dgt){
      if(this.lastOne){
        tmp.push(this.lastOne);
      } else {
        const p=this.aHash.pop();
        if(p){
          tmp.push(p)
          this.lastOne=p
        }
      }
    }
  }
  */
}
export default HashAna;
/*
let hash='00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048';
const ha=new HashAna(hash,49,0,6,false,true,true,true);
console.log(ha.NumLine);
*/