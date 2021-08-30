import { CryptoItem, ReceiveData, AskTable, GetMessage, PartialCryptoItems, MemberName } from '../../if/dbif';
import { StopType, MsgType, ErrCode } from '../../if/ENum';
import CryptoItemOneSide from './CrpytoItemOneSide';
import LayoutStoreModule from '../../../layouts/data/LayoutStoreModule';
import ApiFunc from '../Api/ApiFunc';
import { Msg } from '../../../layouts/data/if';

export default class Items implements GetMessage {
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
    public Type = MsgType.ACCEPT_ASK;
    private api:ApiFunc | null = null;
    private MberName:MemberName[] = [];
    private findUserID:number[] = [];
    constructor(crypto:CryptoItem, LStore?:LayoutStoreModule) {
        this.crypto = crypto;
        this.Long = new CryptoItemOneSide(crypto.id, 1);
		this.Short = new CryptoItemOneSide(crypto.id, -1);
        if (LStore) this.api = new ApiFunc(LStore);
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
        if (this.crypto.EmergencyClosed) return 3;
        return this.crypto.Closed ? this.crypto.Closed : 0;
    }
    get EmergencyClosed() {
        return this.crypto.EmergencyClosed;
    }
    get DecimalPlaces() {
        return this.crypto.DecimalPlaces;
    }
    get QtyDecimalPlaces() {
        return this.crypto.QtyDecimalPlaces;
    }
    get Count() {
        return this.Long.Count + this.Short.Count;
    }
    getClosed(v:StopType):boolean {
        const closed = this.crypto.Closed ? this.crypto.Closed : 0;
        const bClosed = !!(v & closed);
        // console.log('Item getClosed', bClosed, v, this.crypto.Closed);
        return bClosed;
    }
    setClosed(v:PartialCryptoItems) {
        if (typeof v.EmergencyClosed === 'number') {
            this.crypto.EmergencyClosed = v.EmergencyClosed;
        }
        if (typeof v.Closed === 'number') {
            this.crypto.Closed = v.Closed;
        }
    }
    setOneHand(v:number) {
        this.crypto.OneHand = v;
    }
    /*
    addAsk(ask:AskTable) {
        this.Short.add(ask);
        this.Long.add(ask);
    }
    */
    addAsks(asks:AskTable[]) {
        this.Short.cleanList();
        this.Long.cleanList();
        asks.forEach((ask) => {
            // this.addAsk(ask);
            this.getMessage(ask, false);
        });
        this.getMemberName();
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
    getMessage(ask:AskTable, doUserName = true) {
        this.Long.add(ask);
        this.Short.add(ask);
        if (this.Count > 0) this.setUserNotInList(ask.UserID);
        if (doUserName) {
            // console.log('getMessage', ask);
            this.getMemberName();
        }
    }
    private setUserNotInList(UserID:number) {
        const fIdx = this.MberName.findIndex((mbr) => mbr.id === UserID);
        if (fIdx === -1) {
            this.findUserID.push(UserID);
        }
    }
    private getMemberName():void {
        // console.log('getMemberName', this.findUserID, typeof this.api);
        if (this.findUserID.length > 0 && this.api) {
            this.api.getMemberNameByID(this.findUserID).then((msg:Msg) => {
                // console.log('getMemberName msg', msg);
                if (msg.ErrNo === ErrCode.PASS) {
                    const ans = msg.data as MemberName[];
                    this.MberName = this.MberName.concat(ans);
                    this.setMeberName();
                    this.findUserID = [];
                }
            });
        }
    }
    private setMeberName() {
        this.Long.MbrName = this.MberName;
        this.Short.MbrName = this.MberName;
    }
}
