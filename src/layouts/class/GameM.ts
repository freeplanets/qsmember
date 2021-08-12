import BClass from './BClass';
import { Game } from '../data/schema';
/**
 *     id:number;
    name:string;
 */
export class GameM extends BClass<Game> {
    get OfficeSite():string {
        return this.data.OfficeSite;
    }
    set OfficeSite(v:string) {
        this.data.OfficeSite = v;
        this.isDataChanged = true;
    }
    get StopBeforeEnd():number {
        return this.data.StopBeforeEnd;
    }
    set StopBeforeEnd(v:number) {
        this.data.StopBeforeEnd = v;
        this.isDataChanged = true;
    }
    get BothSideAdjust():boolean {
        return this.data.BothSideAdjust === 1;
    }
    set BothSideAdjust(v:boolean) {
        this.data.BothSideAdjust = v ? 1 : 0;
        this.isDataChanged = true;
    }
    get AutoOpen():boolean {
        return this.data.AutoOpen === 1;
    }
    set AutoOpen(v:boolean) {
        this.data.AutoOpen = v ? 1 : 0;
        this.isDataChanged = true;
    }
    get PDiffTwoSide():number {
        return this.data.PDiffTwoSide;
    }
    set PDiffTwoSide(v:number) {
        this.data.PDiffTwoSide = v;
        this.isDataChanged = true;
    }
    get PDiffColorWave():number {
        return this.data.PDiffColorWave;
    }
    set PDiffColorWave(v:number) {
        this.data.PDiffColorWave = v;
        this.isDataChanged = true;
    }
    get DelAfterBet():number {
        return this.data.DelAfterBet;
    }
    set DelAfterBet(v:number) {
        this.data.DelAfterBet = v;
        this.isDataChanged = true;
    }
    get DelBeforeEnd():number {
        return this.data.DelBeforeEnd;
    }
    set DelBeforeEnd(v:number) {
        this.data.DelBeforeEnd = v;
        this.isDataChanged = true;
    }
    /*
    get LowestBet():number{
        return this.data.LowestBet;
    }
    set LowestBet(v:number){
        this.data.LowestBet=v;
        this.isDataChanged = true;
    }
    get TopPay():number{
        return this.data.TopPay;
    }
    set TopPay(v:number){
        this.data.TopPay=v;
        this.isDataChanged = true;
    }
    */
    get UseAvgOdds():boolean {
        return this.data.UseAvgOdds === 1;
    }
    set UseAvgOdds(v:boolean) {
        this.data.UseAvgOdds = v ? 1 : 0;
        this.isDataChanged = true;
    }
    get GType():string {
        return this.data.GType;
    }
    set GType(v:string) {
        this.data.GType = v;
        this.isDataChanged = true;
    }
    get hasSPNO():boolean {
        return !!this.data.hasSPNO;
    }
    set hasSPNO(v:boolean) {
        this.data.hasSPNO = v ? 1 : 0;
        this.isDataChanged = true;
    }
    get OpenNums():number {
        return this.data.OpenNums;
    }
    set OpenNums(v:number) {
        this.data.OpenNums = v;
        this.isDataChanged = true;
    }
}
