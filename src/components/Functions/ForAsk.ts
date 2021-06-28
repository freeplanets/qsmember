import { AskTable } from '../if/dbif';

class ForAsk {
  public GainPrice(ask: AskTable): number {
    const StopGain = ask.StopGain ? ask.StopGain : 0;
    const Lever = ask.Lever ? ask.Lever : 1;
    const LeverCredit = ask.LeverCredit ? ask.LeverCredit : 0;
    const addPrice = ((StopGain * LeverCredit * ask.ItemType) / Lever) / ask.Qty;
    const price = ask.AskPrice ? ask.AskPrice : 0;
    // console.log("GainPrice", addPrice , StopGain, LeverCredit, ask.ItemType, Lever, ask.Qty);
    return addPrice + price;
  }
  public LosePrice(ask: AskTable): number {
    const StopLose = ask.StopLose ? ask.StopLose : 0;
    const Lever = ask.Lever ? ask.Lever : 1;
    const LeverCredit = ask.LeverCredit ? ask.LeverCredit : 0;
    const addPrice = ((((1 - StopLose) * LeverCredit - LeverCredit) * ask.ItemType) / Lever) / ask.Qty;
    const price = ask.AskPrice ? ask.AskPrice : 0;
    // console.log("LosePrice", addPrice , StopLose, LeverCredit, ask.ItemType, Lever, ask.Qty);
    return addPrice + price;
  }
}
export default new ForAsk();
