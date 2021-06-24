import { CryptoItem, ReceiveData, AskTable } from '../if/dbif';
import { StopType } from '../if/ENum';
import CryptoItemOneSide from './CrpytoItemOneSide';

export default class Items {
    private price = '';
    private upColor = 'green';
    private downColor = 'red';
    private upIcon = 'trending_up';
    private downIcon = 'trending_down';
    private priceChangePercent = 0;
    private qty = 0;
    private crypto:CryptoItem;
    public Long:CryptoItemOneSide;
	public Short:CryptoItemOneSide;
    constructor(crypto:CryptoItem) {
        this.crypto = crypto;
        this.Long = new CryptoItemOneSide(crypto.id, 1);
		this.Short = new CryptoItemOneSide(crypto.id, -1)
    }
    get id() {
        return this.crypto.id;
    }
    get Code() {
        return this.crypto.Code;
    }
    get Title() {
        return this.crypto.Title;
    }
    get isLoan():boolean {
        return !!this.crypto.isLoan;
    }
    get OneHand():number {
        return this.crypto.OneHand ? this.crypto.OneHand : 0;
    }
    get IMG() {
        return this.crypto.IMG;
    }
    get Price() {
        return this.price;
    }
    get Change() {
        return this.priceChangePercent;
    }
    get Color() {
        if (this.priceChangePercent < 0) return this.downColor;
        return this.upColor;
    }
    get PriceChangeIcon() {
        if (this.priceChangePercent < 0) return this.downIcon;
        return this.upIcon;
    }
    get Qty() {
        return this.qty;
    }
    get data() {
        return this.crypto;
    }
    get Closed() {
        return this.crypto.Closed ? this.crypto.Closed : 0;
    }
    getClosed(v:StopType):boolean {
        const closed = this.crypto.Closed ? this.crypto.Closed : 0;
        const bClosed = !!(v & closed)
        console.log('Item getClosed', bClosed, v, this.crypto.Closed);
        return bClosed;
    }
    setClosed(v:number) {
        this.crypto.Closed = v;
    }
    addAsk(ask:AskTable) {
        this.Short.add(ask);
        this.Long.add(ask);
    }
    addAsks(asks:AskTable[]) {
        asks.forEach(ask=>{
            this.addAsk(ask);
        })
    }
    setPrice(r:ReceiveData) {
        if (r.symbol === this.Code) {
            // console.log('setPrice',r);
            const price = parseFloat(r.currentClose);
            this.Long.acceptPrice(price);
            this.Short.acceptPrice(price);
            this.price = price.toFixed(2);
            this.priceChangePercent = parseFloat(r.priceChangePercent);
            this.qty = parseFloat(r.closeQuantity);
        }
    }
}
