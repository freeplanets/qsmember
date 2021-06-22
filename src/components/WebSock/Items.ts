import { CryptoItem, ReceiveData } from '../if/dbif';

export default class Items {
    private price = '';
    private upColor = 'green';
    private downColor = 'red';
    private upIcon = 'trending_up';
    private downIcon = 'trending_down';
    private priceChangePercent = 0;
    private qty = 0;
    private cryto:CryptoItem;
    constructor(cryto:CryptoItem) {
        this.cryto = cryto;
    }
    get id() {
        return this.cryto.id;
    }
    get Code() {
        return this.cryto.Code;
    }
    get Title() {
        return this.cryto.Title;
    }
    get isLoan():boolean {
        return !!this.cryto.isLoan;
    }
    get IMG() {
        return this.cryto.IMG;
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
        return this.cryto;
    }
    setPrice(r:ReceiveData) {
        if (r.symbol === this.Code) {
            // console.log('setPrice',r);
            this.price = parseFloat(r.currentClose).toFixed(2);
            this.priceChangePercent = parseFloat(r.priceChangePercent);
            this.qty = parseFloat(r.closeQuantity);
        }
    }
}
