/*
{Title:'LastMonth'},
{Title:'SinceLastMonth'},
*/
export interface DateSets {
  start:string;
  end:string;
}
class JDate {
  get today():DateSets {
    const d = new Date().toLocaleDateString();
    const ds:DateSets = { start: '', end: '' };
    ds.start = this.addZero(d);
    ds.end = ds.start;
    return ds;
  }
  get yesterday() {
    const d:Date = new Date();
    const gd = d.getDate();
    d.setDate(gd - 1);
    const ds:DateSets = { start: '', end: '' };
    ds.start = this.addZero(d.toLocaleDateString());
    ds.end = ds.start;
    return ds;
  }
  get currentWeek() {
    const d = new Date();
    const w = d.getDay();
    const ds:DateSets = { start: '', end: '' };
    ds.end = this.addZero(d.toLocaleDateString());
    const gd = d.getDate();
    d.setDate(gd - w);
    ds.start = this.addZero(d.toLocaleDateString());
    return ds;
  }
  get lastWeek() {
    const d = new Date();
    const w = d.getDay();
    const ds:DateSets = { start: '', end: '' };
    let gd = d.getDate();
    d.setDate(gd - w - 1);
    ds.end = this.addZero(d.toLocaleDateString());
    gd = d.getDate();
    d.setDate(gd - 6);
    ds.start = this.addZero(d.toLocaleDateString());
    return ds;
  }
  get currentMonth() {
    const d = new Date();
    const ds:DateSets = { start: '', end: '' };
    ds.end = this.addZero(d.toLocaleDateString());
    d.setDate(1);
    ds.start = this.addZero(d.toLocaleDateString());
    return ds;
  }
  get lastMonth() {
    const d = new Date();
    const ds:DateSets = { start: '', end: '' };
    d.setDate(0);
    ds.end = this.addZero(d.toLocaleDateString());
    d.setDate(1);
    ds.start = this.addZero(d.toLocaleDateString());
    return ds;
  }
  get sinceLastMonth() {
    const d = new Date();
    const ds:DateSets = { start: '', end: '' };
    ds.end = this.addZero(d.toLocaleDateString());
    d.setDate(0);
    d.setDate(1);
    ds.start = this.addZero(d.toLocaleDateString());
    return ds;
  }
  addZero(d:string) {
    const arr:string[] = d.split('/');
    const arr1 = arr.map((n) => (n.length < 2 ? `0${n}` : n));
    return arr1.join('/');
  }
}
export default new JDate();
