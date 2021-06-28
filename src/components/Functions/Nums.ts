class Nums {
	isMaxTwoDigitlAfterPoint(v:number|string):boolean {
		if (typeof v !== 'string') v = String(v);
		const reg = /^[0-9]+(.[0-9]{0,2})?$/;
		return reg.test(v);
	}
	isGreen(v:number):boolean {
		return v > 0 ? true : false;
	}
	isRed(v:number):boolean {
		return v < 0 ? true : false;
	}
}
export default new Nums();
